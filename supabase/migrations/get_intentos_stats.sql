-- supabase/migrations/get_intentos_stats.sql
-- RPC de agregación en Postgres para reemplazar el patrón "traer todo +
-- reducir en JS" en TopAlumnos.tsx y alumnos/page.tsx.
--
-- INSTRUCCIONES:
-- Aplicar manualmente en Supabase Dashboard → SQL Editor → New query.
-- Migración aditiva y reversible (DROP FUNCTION), no toca filas existentes.
--
-- SECURITY INVOKER (no DEFINER): Postgres sigue aplicando la política RLS
-- de intentos fila por fila, así que aunque el cliente mande IDs fuera del
-- grupo del profesor, esas filas no aparecen en el resultado.

CREATE OR REPLACE FUNCTION public.get_intentos_stats(p_student_ids uuid[])
RETURNS TABLE (
  user_id uuid,
  completed_count integer,
  avg_score integer,
  total_minutes integer
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    user_id,
    COUNT(*)::int                                   AS completed_count,
    COALESCE(ROUND(AVG(score)), 0)::int              AS avg_score,
    (COALESCE(SUM(tiempo_segundos), 0) / 60)::int    AS total_minutes
  FROM public.intentos
  WHERE user_id = ANY(p_student_ids) AND status = 'completed'
  GROUP BY user_id
$$;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- SELECT * FROM public.get_intentos_stats(ARRAY['<uuid-de-prueba>']::uuid[]);
