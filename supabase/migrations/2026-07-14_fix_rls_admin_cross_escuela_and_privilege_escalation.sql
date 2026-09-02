-- ============================================================================
-- FIX CRÍTICO #1 (auditoría de viabilidad, dimensión Seguridad): las policies
-- "admin_*" en profiles/grupos/alumnos_grupos/intentos/progress/escuelas usan
-- únicamente `get_my_role() = 'admin'` (o `IN ('admin','super_admin')`), sin
-- ningún filtro de escuela_id ni WITH CHECK. El scoping por escuela_id que sí
-- existe hoy (session.profile.escuela_id en adminActions.ts/adminUserActions.ts)
-- vive SOLO en las Server Actions, que usan el cliente service_role y por lo
-- tanto YA saltan RLS de cualquier forma — no protegen nada a este nivel.
-- La app-level scoping no ofrece ninguna defensa contra un admin autenticado
-- que llame a PostgREST directamente con su propio JWT + la anon key pública
-- (NEXT_PUBLIC_SUPABASE_ANON_KEY, visible en el bundle del navegador): con las
-- policies tal como estaban, ese admin podía leer/escribir profiles, grupos,
-- alumnos_grupos, intentos y progress de CUALQUIER escuela, no solo la suya —
-- una fuga de datos entre escuelas (incluyendo datos de menores de edad).
--
-- FIX CRÍTICO #2 (mismo audit): protect_user_profile_fields() (ver
-- security_triggers.sql) tiene ramas para 'student' y 'teacher' pero ninguna
-- para 'admin'. Combinado con el fix #1 de abajo, sin este fix un admin podría
-- seguir usando su propio UPDATE permitido (dentro de su propia escuela) para
-- auto-promoverse a role='super_admin' (perdiendo el scoping por completo) o
-- para reasignarse a sí mismo (o a cualquier perfil de su escuela) a
-- escuela_id de otra escuela.
--
-- Modelo objetivo (el mismo que ya usan las Server Actions, ver
-- adminActions.ts:206,234 y adminUserActions.ts:74,160,226-230):
--   - role='admin'       -> solo su propia escuela_id (lectura y escritura)
--   - role='super_admin' -> plataforma completa, sin restricción
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Helper: escuela_id del usuario autenticado actual (mismo patrón que
--    get_my_role() — SECURITY DEFINER para evitar recursión RLS sobre profiles).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_escuela_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT escuela_id FROM public.profiles WHERE id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- 1. profiles
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_ve_todos_profiles" ON public.profiles;
CREATE POLICY "admin_ve_todos_profiles" ON public.profiles
  FOR ALL USING (
    public.get_my_role() = 'super_admin'
    OR (public.get_my_role() = 'admin' AND escuela_id = public.get_my_escuela_id())
  )
  WITH CHECK (
    public.get_my_role() = 'super_admin'
    OR (public.get_my_role() = 'admin' AND escuela_id = public.get_my_escuela_id())
  );

-- ----------------------------------------------------------------------------
-- 2. grupos
--    "profesor_ve_sus_grupos" tenía un `OR get_my_role() = 'admin'` sin
--    escopar que, al ser una policy PERMISSIVE de SELECT separada, seguiría
--    dejando pasar a cualquier admin de cualquier escuela aunque se arregle
--    admin_gestiona_grupos — se retira ese OR porque admin_gestiona_grupos ya
--    cubre (de forma escopada) todo el acceso que un admin necesita.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "profesor_ve_sus_grupos" ON public.grupos;
CREATE POLICY "profesor_ve_sus_grupos" ON public.grupos
  FOR SELECT USING (
    public.get_my_role() = 'teacher' AND id_profesor = auth.uid()
  );

DROP POLICY IF EXISTS "admin_gestiona_grupos" ON public.grupos;
CREATE POLICY "admin_gestiona_grupos" ON public.grupos
  FOR ALL USING (
    public.get_my_role() = 'super_admin'
    OR (public.get_my_role() = 'admin' AND escuela_id = public.get_my_escuela_id())
  )
  WITH CHECK (
    public.get_my_role() = 'super_admin'
    OR (public.get_my_role() = 'admin' AND escuela_id = public.get_my_escuela_id())
  );

-- ----------------------------------------------------------------------------
-- 3. alumnos_grupos (sin columna escuela_id propia — se escopa vía grupos)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_gestiona_alumnos_grupos" ON public.alumnos_grupos;
CREATE POLICY "admin_gestiona_alumnos_grupos" ON public.alumnos_grupos
  FOR ALL USING (
    public.get_my_role() = 'super_admin'
    OR (
      public.get_my_role() = 'admin'
      AND id_grupo IN (SELECT id FROM public.grupos WHERE escuela_id = public.get_my_escuela_id())
    )
  )
  WITH CHECK (
    public.get_my_role() = 'super_admin'
    OR (
      public.get_my_role() = 'admin'
      AND id_grupo IN (SELECT id FROM public.grupos WHERE escuela_id = public.get_my_escuela_id())
    )
  );

-- ----------------------------------------------------------------------------
-- 4. intentos (sin columna escuela_id propia — se escopa vía profiles)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_ve_todos_intentos" ON public.intentos;
CREATE POLICY "admin_ve_todos_intentos" ON public.intentos
  FOR ALL USING (
    public.get_my_role() = 'super_admin'
    OR (
      public.get_my_role() = 'admin'
      AND user_id IN (SELECT id FROM public.profiles WHERE escuela_id = public.get_my_escuela_id())
    )
  )
  WITH CHECK (
    public.get_my_role() = 'super_admin'
    OR (
      public.get_my_role() = 'admin'
      AND user_id IN (SELECT id FROM public.profiles WHERE escuela_id = public.get_my_escuela_id())
    )
  );

-- ----------------------------------------------------------------------------
-- 5. progress (sin columna escuela_id propia — se escopa vía profiles)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_ve_todo_progreso" ON public.progress;
CREATE POLICY "admin_ve_todo_progreso" ON public.progress
  FOR ALL USING (
    public.get_my_role() = 'super_admin'
    OR (
      public.get_my_role() = 'admin'
      AND user_id IN (SELECT id FROM public.profiles WHERE escuela_id = public.get_my_escuela_id())
    )
  )
  WITH CHECK (
    public.get_my_role() = 'super_admin'
    OR (
      public.get_my_role() = 'admin'
      AND user_id IN (SELECT id FROM public.profiles WHERE escuela_id = public.get_my_escuela_id())
    )
  );

-- ----------------------------------------------------------------------------
-- 6. escuelas — un admin solo gestiona (lee/edita) su propia fila; super_admin
--    conserva acceso total. La creación de escuelas nuevas sigue pasando
--    siempre por el cliente service_role en onboardEscuela() (adminActions.ts),
--    que ya salta RLS, así que esto no bloquea el alta de escuelas nuevas.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_gestiona_escuelas" ON public.escuelas;
CREATE POLICY "admin_gestiona_escuelas" ON public.escuelas
  FOR ALL USING (
    public.get_my_role() = 'super_admin'
    OR (public.get_my_role() = 'admin' AND id = public.get_my_escuela_id())
  )
  WITH CHECK (
    public.get_my_role() = 'super_admin'
    OR (public.get_my_role() = 'admin' AND id = public.get_my_escuela_id())
  );

-- ----------------------------------------------------------------------------
-- 7. protect_user_profile_fields() — agrega la rama faltante para 'admin':
--    ni auto-promoción a super_admin, ni asignar/asignarse escuela_id fuera
--    de la propia. Un super_admin (rama no tocada, sigue sin restricciones)
--    conserva la capacidad de reasignar admins entre escuelas o de otorgar
--    el rol super_admin.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_user_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.get_my_role() = 'student' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Seguridad: Un alumno no puede cambiar su propio rol.';
    END IF;
    IF NEW.group_id IS DISTINCT FROM OLD.group_id THEN
      RAISE EXCEPTION 'Seguridad: No puedes cambiar de grupo sin autorizacion del profesor.';
    END IF;
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Seguridad: El email solo puede ser modificado por administradores.';
    END IF;
    IF NEW.school_level IS DISTINCT FROM OLD.school_level THEN
      RAISE EXCEPTION 'Seguridad: No puedes cambiar tu nivel escolar autonomamente.';
    END IF;
  END IF;

  IF public.get_my_role() = 'teacher' AND auth.uid() = NEW.id THEN
    IF NEW.role IS DISTINCT FROM OLD.role AND NEW.role = 'admin' THEN
      RAISE EXCEPTION 'Seguridad: Un profesor no puede promoverse a administrador.';
    END IF;
  END IF;

  IF public.get_my_role() = 'admin' THEN
    IF NEW.role IS DISTINCT FROM OLD.role AND NEW.role = 'super_admin' THEN
      RAISE EXCEPTION 'Seguridad: Un admin no puede otorgar u obtener el rol super_admin.';
    END IF;
    IF NEW.escuela_id IS DISTINCT FROM OLD.escuela_id
       AND NEW.escuela_id IS DISTINCT FROM public.get_my_escuela_id() THEN
      RAISE EXCEPTION 'Seguridad: Un admin solo puede asignar perfiles a su propia escuela.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- Tracking (ver supabase/migrations/2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-14_fix_rls_admin_cross_escuela_and_privilege_escalation.sql',
      'CRITICO: escopa por escuela_id todas las policies admin_* (profiles, grupos, alumnos_grupos, intentos, progress, escuelas) y agrega WITH CHECK; agrega rama admin a protect_user_profile_fields() para bloquear auto-escalada a super_admin y reasignacion de escuela_id fuera de la propia'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
