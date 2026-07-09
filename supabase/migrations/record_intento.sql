-- supabase/migrations/record_intento.sql
-- Fase 3.2 — RPC de upsert real para `intentos` (acumula tiempo, conserva mejor score)
--
-- *** DEPENDE DE 3.1 (dedup_intentos.sql) ***
-- Esta función usa ON CONFLICT (user_id, activity_id), que requiere que la
-- restricción UNIQUE de dedup_intentos.sql ya exista. Aplicar dedup_intentos.sql
-- primero; aplicar esta función antes de eso fallará al invocarse
-- ("no unique or exclusion constraint matching the ON CONFLICT specification").
--
-- El .upsert() del cliente JS de Supabase no puede expresar "acumular
-- tiempo_segundos" ni "conservar el mejor score" (solo reemplaza columnas),
-- de ahí la necesidad de esta función con ON CONFLICT DO UPDATE sobre EXCLUDED.
--
-- SECURITY INVOKER preserva la política alumno_ve_sus_intentos — un alumno
-- solo puede llamar esta función para su propio user_id.
--
-- INSTRUCCIONES: aplicar manualmente en Supabase Dashboard → SQL Editor,
-- DESPUÉS de dedup_intentos.sql.

CREATE OR REPLACE FUNCTION public.record_intento(
  p_user_id uuid,
  p_activity_id text,
  p_score integer DEFAULT NULL,
  p_tiempo_segundos integer DEFAULT NULL,
  p_last_step integer DEFAULT NULL
) RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  INSERT INTO public.intentos (user_id, activity_id, status, score, tiempo_segundos, last_step, completed_at)
  VALUES (p_user_id, p_activity_id, 'completed', p_score, p_tiempo_segundos, p_last_step, now())
  ON CONFLICT (user_id, activity_id) DO UPDATE SET
    score           = GREATEST(public.intentos.score, EXCLUDED.score),
    tiempo_segundos = COALESCE(public.intentos.tiempo_segundos, 0) + COALESCE(EXCLUDED.tiempo_segundos, 0),
    last_step       = COALESCE(EXCLUDED.last_step, public.intentos.last_step),
    completed_at    = EXCLUDED.completed_at,
    status          = 'completed';
$$;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Completar la misma actividad dos veces con distinto score/tiempo desde el hub;
-- confirmar que `intentos` sigue teniendo 1 sola fila con el mejor score y el
-- tiempo acumulado de ambos intentos.
-- SELECT * FROM public.intentos WHERE user_id = '<uuid-de-prueba>' AND activity_id = '<id-de-prueba>';
