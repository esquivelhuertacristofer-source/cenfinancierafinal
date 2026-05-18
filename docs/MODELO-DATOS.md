# Modelo de Datos — CEN Educación Financiera

**Última actualización:** 2026-05-17

---

## Tabla `profiles`

Extiende `auth.users` de Supabase. Se crea automáticamente vía trigger al registrar un usuario.

### Columna `role`

| Valor | Nombre | Descripción |
|---|---|---|
| `student` | Alumno | Estudiante con acceso a Hub, Academia y actividades de su nivel. Ve su propio progreso. |
| `teacher` | Docente | Profesor con acceso a Dashboard. Puede ver el progreso de los alumnos de su grupo. |
| `admin` | Administrador de institución | Administrador de una escuela o institución específica. Puede gestionar usuarios y grupos de su escuela. Accede al panel `/admin`. |
| `super_admin` | Administrador global CEN | Administrador global de la plataforma CEN. Tiene todos los permisos de `admin` más acceso a funciones de gestión multi-institución. Nunca es asignado automáticamente — se establece manualmente en DB. |

### Diferencia clave: `admin` vs `super_admin`

- **`admin`**: Gestiona UNA institución/escuela. Puede crear grupos, onboardear docentes y alumnos de su escuela. Creado vía `onboardInstitutionalUsers()`.
- **`super_admin`**: Gestiona TODA la plataforma CEN. Puede operar en cualquier institución. Se asigna manualmente en Supabase Dashboard — nunca mediante flujo de registro normal.

### CHECK constraint

```sql
CHECK (role IN ('student', 'teacher', 'admin', 'super_admin'))
```

Migración: `supabase/migrations/add_super_admin_role.sql` (pendiente aplicar en Supabase Dashboard → SQL Editor).

---

## Tabla `progress`

Registra la actividad completada por cada usuario.

| Columna | Tipo | Descripción |
|---|---|---|
| `user_id` | UUID | FK a `profiles.id` |
| `activity_id` | TEXT | ID de la actividad del JSON curriculum |
| `completed_at` | TIMESTAMPTZ | Timestamp de completado |

---

## Tabla `grupos` (via `institutional_full.sql`)

Grupos de alumnos dentro de una institución. Gestionados por docentes y admins.

---

## Notas de implementación

- `requireAdminSession()` en `src/lib/supabase-server.ts` acepta `['admin', 'super_admin']` — cualquiera de los dos puede ejecutar Server Actions administrativas.
- El rol `super_admin` aún NO está en el CHECK constraint de producción hasta que se aplique la migración `add_super_admin_role.sql`. Intentar insertar `super_admin` en DB fallará hasta entonces.
- El trigger de creación de perfil asigna `'student'` como rol por defecto.
