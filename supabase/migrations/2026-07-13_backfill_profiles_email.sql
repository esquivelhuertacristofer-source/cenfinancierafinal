-- 2026-07-13_backfill_profiles_email.sql
-- ============================================================================
-- Backfill de public.profiles.email para las filas creadas mientras
-- handle_new_user() no copiaba el email (ver
-- 2026-07-13_fix_handle_new_user_missing_email.sql).
-- ============================================================================
-- auth.users.email siempre tuvo el valor correcto; solo faltaba propagarlo a
-- public.profiles. Esta migración corrige las filas ya existentes.
--
-- IMPORTANTE: aplicar DESPUÉS de 2026-07-13_fix_handle_new_user_missing_email.sql
-- para que los usuarios nuevos ya no sigan generando filas con email NULL.
--
-- Idempotente / segura de re-ejecutar: solo toca filas con email IS NULL, así
-- que correrla más de una vez no tiene efectos secundarios (la segunda vez
-- actualiza 0 filas).

UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND p.email IS NULL
  AND u.email IS NOT NULL;

-- ============================================================================
-- VERIFICACIÓN (opcional, no se ejecuta automáticamente)
-- ============================================================================
-- Antes de aplicar, para ver cuántas filas se van a corregir:
-- SELECT COUNT(*) FROM public.profiles WHERE email IS NULL;
--
-- Después de aplicar, debería quedar en 0 (o cerca de 0, si hay usuarios de
-- auth.users sin email, ej. login solo por teléfono):
-- SELECT COUNT(*) FROM public.profiles WHERE email IS NULL;

-- Reversión: no aplica (backfill de datos, no de esquema). No hay "vuelta
-- atrás" razonable — restaurar email a NULL sería reintroducir el bug.

-- ============================================================================
-- Tracking de migraciones (ver 2026-07-13_create_schema_migrations_tracking.sql)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES (
      '2026-07-13_backfill_profiles_email.sql',
      'Backfillea profiles.email desde auth.users para filas con email NULL'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
