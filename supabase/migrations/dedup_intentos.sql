-- supabase/migrations/dedup_intentos.sql
-- Fase 3.1 — Deduplicación de `intentos` + UNIQUE(user_id, activity_id)
--
-- *** NO EJECUTAR CONTRA PRODUCCIÓN SIN AUTORIZACIÓN EXPLÍCITA ***
-- *** Y SIN HABER HECHO ANTES UN EXPORT CSV MANUAL DE LA TABLA `intentos` ***
-- (Supabase Table Editor → intentos → Export → CSV). El free tier no tiene PITR,
-- así que este export es el único respaldo disponible si algo sale mal.
--
-- Esta migración borra filas duplicadas (mismo user_id + activity_id) y agrega
-- una restricción UNIQUE. Es irreversible sin el respaldo CSV.
--
-- INSTRUCCIONES:
-- 1. Exportar CSV de `intentos` desde el Dashboard.
-- 2. Ejecutar este bloque completo como una sola transacción en SQL Editor.
-- 3. Antes del ALTER, la query de verificación embebida debe devolver 0 filas.

BEGIN;

CREATE TEMP TABLE intentos_dedup AS
SELECT
  user_id,
  activity_id,
  (ARRAY_AGG(id ORDER BY completed_at DESC NULLS LAST, created_at DESC))[1] AS keep_id,
  MAX(score)                              AS best_score,
  SUM(COALESCE(tiempo_segundos, 0))       AS total_tiempo,
  MAX(completed_at)                       AS last_completed_at,
  (ARRAY_AGG(last_step ORDER BY completed_at DESC NULLS LAST, created_at DESC))[1] AS last_step_val
FROM public.intentos
GROUP BY user_id, activity_id
HAVING COUNT(*) > 1;

UPDATE public.intentos i
SET score = d.best_score,
    tiempo_segundos = d.total_tiempo,
    completed_at = d.last_completed_at,
    last_step = d.last_step_val
FROM intentos_dedup d
WHERE i.id = d.keep_id;

DELETE FROM public.intentos i
USING intentos_dedup d
WHERE i.user_id = d.user_id AND i.activity_id = d.activity_id AND i.id <> d.keep_id;

-- Verificación (debe devolver 0 filas) antes del ALTER:
-- SELECT user_id, activity_id, COUNT(*) FROM public.intentos GROUP BY 1,2 HAVING COUNT(*) > 1;

ALTER TABLE public.intentos
  ADD CONSTRAINT intentos_user_activity_unique UNIQUE (user_id, activity_id);

COMMIT;

-- =====================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- =====================================================
-- SELECT COUNT(*) FROM public.intentos; -- comparar contra el conteo previo a la migración
-- SELECT user_id, activity_id, COUNT(*) FROM public.intentos GROUP BY 1,2 HAVING COUNT(*) > 1; -- debe ser 0 filas
