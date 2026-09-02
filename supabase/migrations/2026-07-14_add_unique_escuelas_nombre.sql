-- ============================================================================
-- Fix MEDIO (auditoría de seguridad, finding #5): onboardEscuela() en
-- adminActions.ts decide si crear una escuela nueva o reutilizar una
-- existente con un patrón "check-then-insert" (SELECT por nombre, y si no
-- hay resultado, INSERT) sin ninguna restricción UNIQUE que lo respalde a
-- nivel de base de datos. Dos llamadas concurrentes con el mismo nombre de
-- escuela (p. ej. un admin haciendo doble clic, o dos pestañas) pueden pasar
-- ambas el SELECT antes de que la primera termine su INSERT, resultando en
-- dos filas de escuelas con el mismo nombre — y cada una arrastrando su
-- propio grupo de alumnos/docentes por separado bajo escuelas "duplicadas".
-- ============================================================================
-- Antes de aplicar el UNIQUE, verificar manualmente que no haya nombres
-- duplicados ya existentes en producción (si los hay, hay que fusionarlos
-- a mano antes de que este ALTER pueda tener éxito):
--
--   SELECT nombre, COUNT(*) FROM public.escuelas GROUP BY nombre HAVING COUNT(*) > 1;
--
-- Si esa consulta devuelve filas, resolver los duplicados primero y luego
-- correr esta migración.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'escuelas_nombre_key' AND table_name = 'escuelas'
  ) THEN
    ALTER TABLE public.escuelas ADD CONSTRAINT escuelas_nombre_key UNIQUE (nombre);
  END IF;
END
$$;

-- Reversión:
-- ALTER TABLE public.escuelas DROP CONSTRAINT IF EXISTS escuelas_nombre_key;

-- ============================================================================
-- Tracking (ver supabase/migrations/2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-14_add_unique_escuelas_nombre.sql',
      'Agrega UNIQUE(nombre) a escuelas para respaldar a nivel de BD la idempotencia de onboardEscuela()'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
