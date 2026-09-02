-- ============================================================================
-- Fix ALTO (auditoría de viabilidad — onboarding institucional): tanto
-- onboardEscuela() como onboardInstitutionalUsers() (adminActions.ts)
-- vinculaban a un alumno recién creado a su escuela/grupo con dos escrituras
-- separadas y no atómicas:
--   1. UPDATE profiles SET escuela_id
--   2. INSERT INTO alumnos_grupos (id_alumno, id_grupo)
-- En onboardEscuela() ninguna de las dos llamadas revisaba siquiera su
-- resultado de error (ambas se descartaban con un await suelto), así que un
-- fallo en el paso 2 se reportaba como éxito aunque el alumno jamás quedara
-- vinculado a alumnos_grupos — invisible para su profesor pese a que el
-- resultado del lote lo mostrara como "creado" sin errores.
--
-- Mismo patrón que assign_teacher_to_group() (2026-07-14_assign_teacher_to_group.sql):
-- al ejecutarse como el cuerpo de una función plpgsql, Postgres la envuelve
-- en una transacción implícita (todo o nada). El INSERT usa
-- ON CONFLICT (id_alumno, id_grupo) DO NOTHING para que sea seguro
-- reintentar sobre un alumno ya vinculado (alumnos_grupos tiene
-- PRIMARY KEY (id_alumno, id_grupo), ver institutional_full.sql:25-30).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.link_student_to_group(
  p_user_id uuid,
  p_grupo_id uuid,
  p_escuela_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET escuela_id = p_escuela_id
  WHERE id = p_user_id;

  INSERT INTO public.alumnos_grupos (id_alumno, id_grupo)
  VALUES (p_user_id, p_grupo_id)
  ON CONFLICT (id_alumno, id_grupo) DO NOTHING;
END;
$$;

-- Reversión:
-- DROP FUNCTION IF EXISTS public.link_student_to_group(uuid, uuid, uuid);

-- ============================================================================
-- Tracking (ver supabase/migrations/2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-14_link_student_to_group.sql',
      'ALTO: agrega RPC link_student_to_group() que hace atomica (una sola transaccion) la vinculacion de un alumno a su escuela (profiles.escuela_id) y a su grupo (alumnos_grupos), con ON CONFLICT DO NOTHING para reintentos seguros'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
