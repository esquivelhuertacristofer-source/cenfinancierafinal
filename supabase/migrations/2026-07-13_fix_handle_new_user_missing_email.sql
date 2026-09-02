-- 2026-07-13_fix_handle_new_user_missing_email.sql
-- ============================================================================
-- BUG: profiles.email queda NULL en todo usuario nuevo desde que se aplicó
-- fix_handle_new_user_role_escalation.sql (junio 2026).
-- ============================================================================
-- Esa recreación de handle_new_user() (hecha para cerrar CRÍTICO-001, escalada
-- de privilegios) reescribió la lista de columnas del INSERT y, sin intención,
-- omitió "email". auth.users.email siempre tuvo el valor correcto, pero nunca
-- se copiaba a public.profiles desde entonces (~5+ semanas de registros).
--
-- Esta migración recrea handle_new_user() preservando EXACTAMENTE el fix de
-- seguridad de junio (el role siempre se fuerza a 'student', nunca se toma de
-- raw_user_meta_data) y agrega "email" a las columnas/valores del INSERT.
--
-- Referencia: supabase/migrations/fix_handle_new_user_role_escalation.sql
-- Complementa: 2026-07-13_backfill_profiles_email.sql (corrige filas existentes)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
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
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'student',  -- siempre student; admin asigna roles manualmente (ver fix_handle_new_user_role_escalation.sql)
    COALESCE(NEW.raw_user_meta_data->>'school_level', 'primary'),
    NEW.raw_user_meta_data->>'group_id',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Reversión (no recomendada — reintroduce el bug de email NULL):
-- Restaurar el cuerpo exacto de fix_handle_new_user_role_escalation.sql.

-- ============================================================================
-- Tracking de migraciones (ver 2026-07-13_create_schema_migrations_tracking.sql)
-- No falla si la tabla de tracking todavía no existe: esta migración puede
-- aplicarse en cualquier orden respecto a la migración que la crea.
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-13_fix_handle_new_user_missing_email.sql',
      'Agrega email al INSERT de handle_new_user (se perdió al arreglar CRÍTICO-001)'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
