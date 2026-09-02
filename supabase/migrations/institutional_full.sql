-- ============================================================================
-- MIGRACIÓN INSTITUCIONAL COMPLETA — CEN Financiera
-- Fecha: 2026-05-11 | Sprint Institucional
-- ============================================================================
-- INSTRUCCIONES: Ejecutar este archivo completo en
--   Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================================

-- ============================================================================
-- 1. TABLA: grupos
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.grupos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       text NOT NULL UNIQUE,
  grado        text,             -- Ej: 'P4', 'S2', 'MIXTO'
  id_profesor  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_grupos_profesor ON public.grupos(id_profesor);

-- ============================================================================
-- 2. TABLA: alumnos_grupos
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.alumnos_grupos (
  id_alumno  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  id_grupo   uuid NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id_alumno, id_grupo)
);
ALTER TABLE public.alumnos_grupos ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_alumnos_grupos_grupo   ON public.alumnos_grupos(id_grupo);
CREATE INDEX IF NOT EXISTS idx_alumnos_grupos_alumno  ON public.alumnos_grupos(id_alumno);

-- ============================================================================
-- 3. TABLA: intentos
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.intentos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id      text NOT NULL,
  status           text NOT NULL DEFAULT 'in_progress'
                   CHECK (status IN ('in_progress', 'completed', 'failed')),
  score            integer CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  tiempo_segundos  integer,
  last_step        integer,
  started_at       timestamptz NOT NULL DEFAULT now(),
  completed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.intentos ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_intentos_user_id     ON public.intentos(user_id);
CREATE INDEX IF NOT EXISTS idx_intentos_activity_id ON public.intentos(activity_id);
CREATE INDEX IF NOT EXISTS idx_intentos_user_status ON public.intentos(user_id, status);

-- ============================================================================
-- 4. FUNCIÓN AUXILIAR: get_my_group_ids
--    Devuelve los IDs de grupos del profesor autenticado.
--    SECURITY DEFINER para evitar recursión RLS.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_my_group_ids()
RETURNS uuid[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY(
    SELECT id FROM public.grupos
    WHERE id_profesor = auth.uid()
  );
$$;

-- ============================================================================
-- 5. TRIGGER: handle_new_user
--    NOTA (2026-07-14): el cuerpo de abajo ya incluye, desde el origen, los
--    dos fixes de seguridad/datos que se aplicaron después en producción
--    mediante migraciones separadas — así ejecutar este archivo solo (p. ej.
--    para levantar un ambiente nuevo desde cero) no reintroduce ninguno de
--    los dos problemas:
--      1) CRÍTICO-001 (escalada de privilegios): la versión original tomaba
--         "role" de raw_user_meta_data, controlado por el cliente que llama
--         a signUp(). Aquí se fuerza siempre a 'student'; solo el admin
--         asigna otros roles manualmente. Ver: fix_handle_new_user_role_escalation.sql
--      2) "email" faltante: ese primer fix, sin intención, había omitido la
--         columna email del INSERT (~5 semanas de registros con email NULL
--         en profiles). Restaurada aquí. El cuerpo de abajo es una copia
--         exacta de la versión vigente en producción:
--         Ver: 2026-07-13_fix_handle_new_user_missing_email.sql
--    Este archivo YA NO inserta en alumnos_grupos desde el trigger: esa
--    vinculación automática por metadata quedó superada por la lógica
--    explícita del lado de aplicación (ver onboardEscuela() en
--    src/app/actions/adminActions.ts, que hace su propio INSERT en
--    alumnos_grupos tras crear cada cuenta de alumno). Ninguna migración
--    posterior a este archivo restauró ese bloque — mantenerlo aquí
--    divergiría de la versión de esta función que en realidad corre en
--    producción hoy.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    school_level,
    group_id,
    created_at
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'student',  -- siempre student; admin asigna roles manualmente (ver fix_handle_new_user_role_escalation.sql)
    COALESCE(new.raw_user_meta_data->>'school_level', 'primary'),
    new.raw_user_meta_data->>'group_id',
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Re-crear el trigger (ya existe, lo reemplazamos)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. RLS POLICIES — profiles
-- ============================================================================
-- NOTA (2026-07-14): las dos policies de abajo (student_reads_own_profile y
-- teacher_reads_assigned_students) ya reflejan el fix de ALTO-003 aplicado
-- después en producción vía fix_rls_alumno_ve_su_perfil.sql. La policy
-- original de esta sección ("alumno_ve_su_perfil") tenía un catch-all
-- (OR get_my_role() IN ('teacher','admin')) que dejaba a CUALQUIER docente o
-- admin leer el perfil de CUALQUIER usuario de la plataforma completa, sin
-- importar su escuela o grupo. Ejecutar este archivo solo hoy ya deja el
-- estado correcto, sin depender de aplicar ese fix aparte.

-- Alumno: solo puede leer su propio perfil
DROP POLICY IF EXISTS "alumno_ve_su_perfil" ON public.profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "student_reads_own_profile" ON public.profiles;
CREATE POLICY "student_reads_own_profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Docente: puede leer perfiles de alumnos asignados a su(s) grupo(s) vía el
-- campo legado profiles.group_id (string, posiblemente CSV de varios
-- grupos). Ver: fix_rls_alumno_ve_su_perfil.sql
DROP POLICY IF EXISTS "teacher_reads_assigned_students" ON public.profiles;
CREATE POLICY "teacher_reads_assigned_students"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS tp
      WHERE tp.id = auth.uid()
        AND tp.role = 'teacher'
        AND tp.group_id IS NOT NULL
        AND profiles.group_id = ANY(string_to_array(tp.group_id, ','))
    )
  );

-- Profesor ve perfiles de alumnos de sus grupos (modelo nuevo: tabla
-- alumnos_grupos + get_my_group_ids()). Coexiste con la policy anterior
-- (basada en el campo legado profiles.group_id): al ser ambas policies
-- permissive de SELECT, Postgres las combina con OR — cualquiera de las dos
-- que aplique concede la lectura.
DROP POLICY IF EXISTS "profesor_ve_alumnos_de_su_grupo" ON public.profiles;
CREATE POLICY "profesor_ve_alumnos_de_su_grupo" ON public.profiles
  FOR SELECT USING (
    public.get_my_role() = 'teacher'
    AND (
      auth.uid() = id
      OR id IN (
        SELECT id_alumno FROM public.alumnos_grupos
        WHERE id_grupo = ANY(public.get_my_group_ids())
      )
    )
  );

-- Admin ve todo
DROP POLICY IF EXISTS "admin_ve_todos_profiles" ON public.profiles;
CREATE POLICY "admin_ve_todos_profiles" ON public.profiles
  FOR ALL USING (public.get_my_role() = 'admin');

-- ============================================================================
-- 7. RLS POLICIES — grupos
-- ============================================================================
DROP POLICY IF EXISTS "profesor_ve_sus_grupos" ON public.grupos;
CREATE POLICY "profesor_ve_sus_grupos" ON public.grupos
  FOR SELECT USING (
    public.get_my_role() = 'teacher' AND id_profesor = auth.uid()
    OR public.get_my_role() = 'admin'
  );

DROP POLICY IF EXISTS "admin_gestiona_grupos" ON public.grupos;
CREATE POLICY "admin_gestiona_grupos" ON public.grupos
  FOR ALL USING (public.get_my_role() = 'admin');

-- ============================================================================
-- 8. RLS POLICIES — alumnos_grupos
-- ============================================================================
DROP POLICY IF EXISTS "alumno_ve_su_membresia" ON public.alumnos_grupos;
CREATE POLICY "alumno_ve_su_membresia" ON public.alumnos_grupos
  FOR SELECT USING (id_alumno = auth.uid());

DROP POLICY IF EXISTS "profesor_ve_miembros_de_su_grupo" ON public.alumnos_grupos;
CREATE POLICY "profesor_ve_miembros_de_su_grupo" ON public.alumnos_grupos
  FOR SELECT USING (
    public.get_my_role() = 'teacher'
    AND id_grupo = ANY(public.get_my_group_ids())
  );

DROP POLICY IF EXISTS "admin_gestiona_alumnos_grupos" ON public.alumnos_grupos;
CREATE POLICY "admin_gestiona_alumnos_grupos" ON public.alumnos_grupos
  FOR ALL USING (public.get_my_role() = 'admin');

-- ============================================================================
-- 9. RLS POLICIES — intentos
-- ============================================================================
DROP POLICY IF EXISTS "alumno_ve_sus_intentos" ON public.intentos;
CREATE POLICY "alumno_ve_sus_intentos" ON public.intentos
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "profesor_ve_intentos_de_su_grupo" ON public.intentos;
CREATE POLICY "profesor_ve_intentos_de_su_grupo" ON public.intentos
  FOR SELECT USING (
    public.get_my_role() = 'teacher'
    AND user_id IN (
      SELECT id_alumno FROM public.alumnos_grupos
      WHERE id_grupo = ANY(public.get_my_group_ids())
    )
  );

DROP POLICY IF EXISTS "admin_ve_todos_intentos" ON public.intentos;
CREATE POLICY "admin_ve_todos_intentos" ON public.intentos
  FOR ALL USING (public.get_my_role() = 'admin');

-- ============================================================================
-- 10. RLS POLICIES — progress (mejoradas)
-- ============================================================================
DROP POLICY IF EXISTS "alumno_ve_su_progreso" ON public.progress;
CREATE POLICY "alumno_ve_su_progreso" ON public.progress
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "profesor_ve_progreso_de_su_grupo" ON public.progress;
CREATE POLICY "profesor_ve_progreso_de_su_grupo" ON public.progress
  FOR SELECT USING (
    public.get_my_role() = 'teacher'
    AND user_id IN (
      SELECT id_alumno FROM public.alumnos_grupos
      WHERE id_grupo = ANY(public.get_my_group_ids())
    )
  );

DROP POLICY IF EXISTS "admin_ve_todo_progreso" ON public.progress;
CREATE POLICY "admin_ve_todo_progreso" ON public.progress
  FOR ALL USING (public.get_my_role() = 'admin');

-- ============================================================================
-- FIN DE MIGRACIÓN
-- ============================================================================
-- Verificación: correr después de ejecutar:
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1;
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname='public' ORDER BY tablename;
-- ============================================================================
