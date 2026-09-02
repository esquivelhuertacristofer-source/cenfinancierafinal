-- ============================================================================
-- Fix CRÍTICO (auditoría de viabilidad — onboarding institucional): en
-- onboardEscuela() (adminActions.ts), la asignación de un profesor recién
-- creado a su grupo se hacía con dos escrituras separadas y no atómicas:
--   1. SELECT grupos.id_profesor, y si es NULL, UPDATE grupos SET id_profesor
--   2. UPDATE profiles SET escuela_id, role = 'teacher'
-- Si el paso 2 fallaba (timeout, conexión) después de que el paso 1 ya
-- hubiera tenido éxito, el grupo quedaba con id_profesor apuntando a un
-- usuario cuyo profile NUNCA se vinculó a la escuela ni se promovió a
-- role='teacher' — un profesor "asignado" al grupo pero con un perfil
-- inconsistente (todavía role='student' del trigger handle_new_user, o sin
-- escuela_id). Además, el paso 1 en sí era un check-then-set (SELECT +
-- UPDATE) sin atomicidad: dos profesores del mismo grupo procesados por
-- llamadas concurrentes a onboardEscuela podían leer ambos id_profesor=NULL
-- antes de que cualquiera de los dos escribiera, resultando en una condición
-- de carrera sobre "quién es el primer profesor del grupo".
--
-- Esta función resuelve ambos problemas en una sola llamada: al ejecutarse
-- como el cuerpo de una función plpgsql, Postgres la envuelve en una
-- transacción implícita (todo o nada), y el UPDATE condicionado con
-- `WHERE id_profesor IS NULL` hace el check-then-set atómico a nivel de fila
-- (sin necesidad de un SELECT previo separado).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.assign_teacher_to_group(
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
  -- "Primer profesor del grupo gana": el WHERE hace el check-then-set
  -- atómico, sin ventana de carrera entre profesores concurrentes.
  UPDATE public.grupos
  SET id_profesor = p_user_id
  WHERE id = p_grupo_id AND id_profesor IS NULL;

  -- El trigger handle_new_user() siempre crea el profile con role='student'
  -- — aquí se promueve a 'teacher' y se vincula a la escuela en la misma
  -- transacción que la asignación del grupo de arriba.
  UPDATE public.profiles
  SET escuela_id = p_escuela_id, role = 'teacher'
  WHERE id = p_user_id;
END;
$$;

-- Reversión:
-- DROP FUNCTION IF EXISTS public.assign_teacher_to_group(uuid, uuid, uuid);

-- ============================================================================
-- Tracking (ver supabase/migrations/2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-14_assign_teacher_to_group.sql',
      'CRITICO: agrega RPC assign_teacher_to_group() que hace atomica (una sola transaccion) la asignacion de id_profesor al grupo (check-then-set sin condicion de carrera) junto con la promocion del profile a role=teacher/escuela_id'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
