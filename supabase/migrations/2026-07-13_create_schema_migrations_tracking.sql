-- 2026-07-13_create_schema_migrations_tracking.sql
-- ============================================================================
-- Tracking ligero de qué migraciones ya se aplicaron manualmente en
-- producción vía Supabase Dashboard → SQL Editor.
-- ============================================================================
-- Hasta ahora no había forma de saber, mirando solo la base de datos, qué
-- archivos de supabase/migrations/ ya se ejecutaron en producción y cuáles
-- siguen pendientes. Esta tabla resuelve eso con el mínimo mecanismo posible:
-- cada migración nueva se auto-registra al final (ver convención en
-- supabase/migrations/README.md).
--
-- No reemplaza un sistema real de migraciones (no valida orden, no calcula
-- checksums, no hace rollback automático) — es solo un registro de auditoría
-- para saber "¿esto ya se corrió?" antes de reaplicar algo por error.

CREATE TABLE IF NOT EXISTS public._schema_migrations (
  name        text PRIMARY KEY,          -- nombre del archivo .sql, ej. '2026-07-13_backfill_profiles_email.sql'
  applied_at  timestamptz NOT NULL DEFAULT now(),
  description text                        -- resumen corto de qué hace la migración
);

-- Tabla de auditoría interna: solo admins/super_admins pueden leerla.
-- (Nadie necesita escribirla desde el cliente: los INSERT los hacen las
-- propias migraciones al aplicarse manualmente en el SQL Editor, que corre
-- con privilegios elevados y por lo tanto no está sujeto a estas policies.)
ALTER TABLE public._schema_migrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_ve_schema_migrations" ON public._schema_migrations;
CREATE POLICY "admin_ve_schema_migrations" ON public._schema_migrations
  FOR SELECT USING (public.get_my_role() IN ('admin', 'super_admin'));

-- ============================================================================
-- BACKFILL: migraciones que ya existían en supabase/migrations/ al
-- 2026-07-13 y que, según el estado documentado del proyecto (desplegado y
-- funcional en producción), ya fueron aplicadas manualmente con anterioridad.
-- ============================================================================
INSERT INTO public._schema_migrations (name, description) VALUES
  ('add_super_admin_role.sql',
    'Agrega super_admin al CHECK constraint de profiles.role (CRIT-002)'),
  ('dedup_intentos.sql',
    'Deduplica filas de intentos y agrega UNIQUE(user_id, activity_id)'),
  ('escuelas.sql',
    'Sistema de escuelas: tabla escuelas, escuela_id en grupos/profiles'),
  ('fix_handle_new_user_role_escalation.sql',
    'CRÍTICO-001: evita escalada de privilegios en handle_new_user (siempre student)'),
  ('fix_rls_alumno_ve_su_perfil.sql',
    'ALTO-003: separa policies de lectura de profiles entre alumno y docente'),
  ('get_intentos_stats.sql',
    'RPC de agregación get_intentos_stats para reemplazar reduce en JS'),
  ('institutional_full.sql',
    'Migración institucional: grupos, alumnos_grupos, intentos, RLS multi-rol'),
  ('legacy_indexes.sql',
    'Índices de performance en progress y profiles'),
  ('record_intento.sql',
    'RPC record_intento: upsert real con acumulación de tiempo y mejor score')
ON CONFLICT (name) DO NOTHING;

-- Esta misma migración se auto-registra (la tabla ya existe en este punto).
INSERT INTO public._schema_migrations (name, description) VALUES
  ('2026-07-13_create_schema_migrations_tracking.sql',
    'Crea la tabla de tracking de migraciones y backfillea el historial existente')
ON CONFLICT (name) DO NOTHING;

-- Reversión:
-- DROP POLICY IF EXISTS "admin_ve_schema_migrations" ON public._schema_migrations;
-- DROP TABLE IF EXISTS public._schema_migrations;
