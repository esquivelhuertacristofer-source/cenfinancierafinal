-- ============================================================================
-- Fix CRÍTICO (auditoría de viabilidad — onboarding institucional): tanto
-- onboardEscuela() como createGrupo() (adminActions.ts) insertan filas en
-- public.grupos sin ninguna restricción UNIQUE que respalde (nombre,
-- escuela_id) a nivel de base de datos — el mismo problema que ya se
-- corrigió para escuelas en 2026-07-14_add_unique_escuelas_nombre.sql, pero
-- aquí sin ningún check-then-insert previo siquiera a nivel de aplicación:
-- onboardEscuela() crea un grupo NUEVO cada vez que agrupa entradas del CSV
-- por (grupo, grado), sin verificar si ya existe uno con ese nombre en esa
-- escuela. Si un admin reintenta subir el mismo CSV tras una falla parcial
-- (conexión caída a medio lote), o si dos pestañas/admins onboardean el
-- mismo nombre de grupo casi al mismo tiempo, el resultado son dos grupos
-- "GRUPO-A" distintos bajo la misma escuela — los alumnos del segundo lote
-- quedan separados del primero y su profesor no los ve como un solo grupo.
-- ============================================================================
-- Antes de aplicar el UNIQUE, verificar manualmente que no haya duplicados
-- ya existentes en producción (si los hay, fusionarlos a mano primero):
--
--   SELECT nombre, escuela_id, COUNT(*) FROM public.grupos
--   GROUP BY nombre, escuela_id HAVING COUNT(*) > 1;
--
-- Nota: dos filas con escuela_id NULL (grupos huérfanos, ver fix de
-- super_admin en adminActions.ts) NO colisionan entre sí bajo UNIQUE de
-- Postgres (NULL nunca es igual a NULL) — esto es aceptable porque el fix
-- ALTO de "super_admin con escuela_id null" ya evita crear grupos huérfanos
-- nuevos hacia adelante.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'grupos_nombre_escuela_key' AND table_name = 'grupos'
  ) THEN
    ALTER TABLE public.grupos ADD CONSTRAINT grupos_nombre_escuela_key UNIQUE (nombre, escuela_id);
  END IF;
END
$$;

-- Reversión:
-- ALTER TABLE public.grupos DROP CONSTRAINT IF EXISTS grupos_nombre_escuela_key;

-- ============================================================================
-- Tracking (ver supabase/migrations/2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-14_add_unique_grupos_nombre_escuela.sql',
      'CRITICO: agrega UNIQUE(nombre, escuela_id) a grupos para respaldar a nivel de BD la idempotencia del onboarding institucional y evitar grupos duplicados por reintentos o carreras concurrentes'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
