# REPORTE SPRINT INSTITUCIONAL — CEN Financiera
**Fecha:** 2026-05-11  
**Sprint:** Institucional v1 (paridad con Labs)  
**Build:** ✅ 45 páginas, 0 errores, 5.5s compile

---

## Resumen ejecutivo

Sprint completo de 5 fases que lleva CEN Financiera a paridad institucional con CEN Labs. La plataforma ahora soporta creación masiva de usuarios, gestión de grupos, seguimiento de intentos con puntaje y tiempo, y panel docente con métricas reales.

---

## Fases ejecutadas

### Fase 0 — Cuenta Admin
- Cuenta `admin@cenfinanciera.com` registrada en Supabase Auth con `role: admin` en `user_metadata`
- El trigger `handle_new_user` crea el perfil correspondiente en `profiles`

### Fase 1 — Tabla `intentos` + `markActivityComplete`
**Archivo:** `supabase/migrations/institutional_full.sql`

Nueva tabla `intentos`:
```sql
intentos (id, user_id, activity_id, status CHECK IN('in_progress','completed','failed'),
          score 0-100, tiempo_segundos, last_step, started_at, completed_at)
```

**Archivo:** `src/lib/hub.ts`
- `markActivityComplete` actualizado: escribe en `intentos` Y `progress` en paralelo via `Promise.all`
- Si ambas fallan → encola offline en `syncQueue`
- Logs detallados con `console.info`/`console.error`

### Fase 2 — Módulo Admin `/admin/usuarios`
**Archivos nuevos:**
- `src/app/admin/usuarios/page.tsx` — UI completa
- `src/app/actions/adminActions.ts` — Server Actions con service_role

**Funcionalidades:**
- Selección de grupo existente o creación inline de grupo nuevo
- Select de grado (P1-S3) con mapeo a `school_level` legible
- Select de rol (alumno/profesor)
- Contraseña compartida (mínimo 8 caracteres)
- Textarea de nombres (uno por línea) + upload CSV
- Creación via `admin.auth.admin.createUser` con `email_confirm: true`
- Email generado automáticamente: `nombre.apellido@cenfinanciera.com` (deduplicado)
- Descarga PDF de credenciales con jsPDF (header navy CEN, tabla con email + contraseña)
- Panel de resultados: éxitos en verde, errores con mensaje en rojo

**Trigger actualizado** (`handle_new_user`):
- Si `group_id` está en `user_metadata` → inserta en `alumnos_grupos` automáticamente

### Fase 3 — RLS completo
**Archivo:** `supabase/migrations/institutional_full.sql`

Políticas por tabla:
| Tabla | Alumno | Profesor | Admin |
|---|---|---|---|
| `profiles` | Ve solo su perfil | Ve alumnos de sus grupos | Todo |
| `grupos` | — | Ve sus grupos | Todo |
| `alumnos_grupos` | Ve su membresía | Ve miembros de sus grupos | Todo |
| `intentos` | CRUD sus intentos | Ve intentos de sus grupos | Todo |
| `progress` | CRUD su progreso | Ve progreso de sus grupos | Todo |

Helper `get_my_group_ids()` como `SECURITY DEFINER` para evitar recursión RLS.

### Fase 4 — Dashboard docente con métricas reales

**Panel principal** (`src/app/dashboard/teacher/page.tsx`):
- Ahora carga grupos del profesor via `grupos WHERE id_profesor = user.id`
- Pasa `teacherGroupIds: string[]` a todos los componentes

**MetricCards** (`src/components/dashboard/MetricCards.tsx`):
- Schema nuevo: alumnos via `alumnos_grupos`, prácticas via `intentos WHERE status='completed'`
- Schema legacy: fallback a `group_id` string + `progress`

**TopAlumnos** (`src/components/dashboard/TopAlumnos.tsx`):
- Score = `intentos_completados * 10 + promedio_score`
- Ranking ordenado por XP real
- Estado vacío elegante cuando no hay actividad

**LatestDeliveries** (`src/components/dashboard/LatestDeliveries.tsx`):
- Query `intentos WHERE status='completed'` ordenados por `completed_at`
- Suscripción realtime en `intentos` Y `progress`
- Estado vacío elegante

**StudentRecordModal** (`src/components/dashboard/StudentRecordModal.tsx`):
- Prioriza `intentos` (schema nuevo), fallback a `progress`
- Muestra score individual por actividad
- XP calculado como suma de scores reales

**Alumnos page** (`src/app/dashboard/teacher/alumnos/page.tsx`):
- Carga alumnos via `grupos → alumnos_grupos → profiles`
- Métricas: `progress_count`, `avg_score`, `total_minutes` desde `intentos`
- Modal de expediente: 3 KPIs (actividades, puntaje prom., tiempo)
- Historia con score por intento
- PDF de expediente incluye puntaje y tiempo por actividad
- Estado vacío con instrucción al admin

---

## Pasos pendientes para el operador

### 1. Ejecutar migración SQL
En Supabase Dashboard → SQL Editor → New Query:
```
Archivo: supabase/migrations/institutional_full.sql
```
Crea: `grupos`, `alumnos_grupos`, `intentos`, funciones, triggers, RLS.

### 2. Agregar variables de entorno en Vercel
En Vercel Dashboard → Settings → Environment Variables:
```
SUPABASE_SERVICE_ROLE_KEY = [service role JWT del proyecto]
```
(ya deberían estar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Crear primer grupo piloto
Después de ejecutar la migración, ir a `/admin/usuarios` con cuenta admin:
1. Crear grupo "GRUPO-FINANCIERA-PILOTO-001", grado P4
2. Crear 10 alumnos piloto + 1 profesor
3. Descargar PDF de credenciales
4. Verificar que el profesor puede ver sus alumnos en `/dashboard/teacher/alumnos`

### 4. Push a producción
```bash
git add -A
git commit -m "feat: sprint institucional v1 — intentos, admin, grupos, RLS, teacher metrics"
git push
```

---

## Archivos clave modificados

| Archivo | Cambio |
|---|---|
| `src/lib/hub.ts` | `markActivityComplete` → `intentos` + `progress` paralelo |
| `src/app/actions/adminActions.ts` | NUEVO: Server Actions admin con service_role |
| `src/app/admin/usuarios/page.tsx` | NUEVO: módulo de onboarding institucional |
| `supabase/migrations/institutional_full.sql` | NUEVO: DDL completo (grupos, alumnos_grupos, intentos, RLS) |
| `src/app/dashboard/teacher/page.tsx` | Carga `teacherGroupIds` desde tabla `grupos` |
| `src/components/dashboard/MetricCards.tsx` | Métricas desde `alumnos_grupos` + `intentos` |
| `src/components/dashboard/TopAlumnos.tsx` | Ranking desde `intentos` (XP real) |
| `src/components/dashboard/LatestDeliveries.tsx` | Feed desde `intentos` con realtime |
| `src/components/dashboard/StudentRecordModal.tsx` | Score por actividad desde `intentos` |
| `src/app/dashboard/teacher/alumnos/page.tsx` | Full rewrite: grupos, métricas, PDF mejorado |

---

## Dependencia instalada
```
jspdf ^3.x  (para generación de PDF de credenciales)
```
