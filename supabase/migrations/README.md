# Convención de migraciones — supabase/migrations/

Todas las migraciones de este directorio son **manuales**: no hay CLI de
Supabase ni pipeline automático que las aplique. Cada archivo `.sql` se
copia y ejecuta a mano en **Supabase Dashboard → SQL Editor → New query**.

## Tracking de qué ya se aplicó

Desde `2026-07-13_create_schema_migrations_tracking.sql` existe la tabla
`public._schema_migrations` (name, applied_at, description) que sirve como
registro de auditoría: "¿este archivo ya se corrió en producción?".

**A partir de ahora, toda migración nueva debe terminar con un INSERT que se
auto-registre**, por ejemplo:

```sql
-- Al final del archivo:
INSERT INTO public._schema_migrations (name, description)
VALUES ('2026-08-01_mi_nueva_migracion.sql', 'Qué hace, en una frase')
ON CONFLICT (name) DO NOTHING;
```

Si tu migración puede necesitar aplicarse antes de que la tabla de tracking
exista (por ejemplo, si reordenas el trabajo), envuelve el INSERT así para
que no falle:

```sql
DO $$
BEGIN
  IF to_regclass('public._schema_migrations') IS NOT NULL THEN
    INSERT INTO public._schema_migrations (name, description)
    VALUES ('2026-08-01_mi_nueva_migracion.sql', 'Qué hace, en una frase')
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;
```

## Convención de nombres

Prefijo de fecha `YYYY-MM-DD_` + descripción corta en snake_case, por
ejemplo `2026-07-13_backfill_profiles_email.sql`. Los archivos anteriores a
esta convención (sin fecha en el nombre) no se renombran retroactivamente
para no romper el historial ni referencias existentes en otros documentos.

## Reglas generales

- Cada migración debe ser lo más idempotente posible (`IF NOT EXISTS`,
  `ON CONFLICT DO NOTHING`, `DROP ... IF EXISTS` antes de recrear, etc.) para
  poder re-ejecutarse sin efectos secundarios si algo falla a la mitad.
- Si la migración no es reversible de forma segura (ej. backfills de datos,
  borrados), decirlo explícitamente en un comentario en vez de fingir un
  `DROP`/rollback que perdería datos.
- Comentar el porqué (contexto del bug o la mejora), no solo el qué — el
  código SQL ya dice el qué.
- Nunca ejecutar contra producción sin haber leído el archivo completo primero.
