-- 2026-07-13_add_stable_to_helper_functions.sql
-- ============================================================================
-- Marca get_my_role() y get_my_group_ids() como STABLE.
-- ============================================================================
-- Ambas funciones se usan repetidamente dentro de policies RLS (a menudo una
-- vez por fila evaluada) y no modifican datos ni dependen de nada que cambie
-- dentro de una misma sentencia/transacción — su resultado depende solo de
-- auth.uid() y del contenido de profiles/grupos en ese instante. El patrón
-- correcto ya lo usa get_intentos_stats.sql (LANGUAGE sql / STABLE /
-- SECURITY .../ SET search_path). Sin la marca STABLE, Postgres las trata
-- como VOLATILE por defecto y no puede cachear/optimizar su evaluación
-- repetida dentro del plan de una misma query, lo cual es innecesariamente
-- costoso a escala (miles de filas evaluadas por policy).
--
-- El cuerpo de cada función se copia tal cual de su definición original:
--   - get_my_role():      supabase/security_triggers.sql
--   - get_my_group_ids(): supabase/migrations/institutional_full.sql
-- No se cambia ningún comportamiento, solo se agrega la marca de volatilidad.

-- ----------------------------------------------------------------------------
-- get_my_role() — cuerpo original de supabase/security_triggers.sql + STABLE
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- SECURITY DEFINER es la clave para saltar el RLS en la búsqueda del rol
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- get_my_group_ids() — cuerpo original de institutional_full.sql + STABLE
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_group_ids()
RETURNS uuid[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY(
    SELECT id FROM public.grupos
    WHERE id_profesor = auth.uid()
  );
$$;

-- Reversión (si hiciera falta, no recomendada): volver a CREATE OR REPLACE
-- de cada función quitando la línea "STABLE" (queda VOLATILE por defecto).

-- ============================================================================
-- Tracking de migraciones (ver 2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-13_add_stable_to_helper_functions.sql',
      'Marca get_my_role() y get_my_group_ids() como STABLE (antes VOLATILE por defecto)'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
