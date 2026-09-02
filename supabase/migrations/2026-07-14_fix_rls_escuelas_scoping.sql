-- ============================================================================
-- Fix MEDIO (auditoría de seguridad, finding #4): la policy
-- "autenticados_ven_su_escuela" en escuelas.sql se llama como si limitara
-- cada usuario a leer solo su propia escuela, pero su USING real es
-- simplemente `auth.role() = 'authenticated'` — deja que CUALQUIER usuario
-- con sesión (alumno, docente, admin de OTRA escuela) lea la fila de TODAS
-- las escuelas registradas en la plataforma (nombres de clientes/escuelas).
-- No expone datos de alumnos directamente, pero sí la lista completa de
-- escuelas dadas de alta, que debería quedar limitada a la propia escuela
-- del usuario (más admin/super_admin, que ya tienen acceso total vía la
-- policy separada "admin_gestiona_escuelas", FOR ALL, sin tocar aquí).
-- ============================================================================

DROP POLICY IF EXISTS "autenticados_ven_su_escuela" ON public.escuelas;

CREATE POLICY "autenticados_ven_su_escuela" ON public.escuelas
  FOR SELECT
  TO authenticated
  USING (
    id = (SELECT escuela_id FROM public.profiles WHERE id = auth.uid())
  );

-- Reversión (no recomendada — reintroduce el finding #4: expone todas las
-- escuelas a cualquier usuario autenticado, sin importar su escuela o rol):
--   DROP POLICY IF EXISTS "autenticados_ven_su_escuela" ON public.escuelas;
--   CREATE POLICY "autenticados_ven_su_escuela" ON public.escuelas
--     FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- Tracking (ver supabase/migrations/2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-14_fix_rls_escuelas_scoping.sql',
      'Escopa la policy autenticados_ven_su_escuela a la escuela propia del usuario (antes exponía todas las escuelas a cualquier autenticado)'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
