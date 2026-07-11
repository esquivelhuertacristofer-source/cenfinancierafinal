# Diagnóstico, correcciones y optimización — Julio 2026

Registro de lo realizado durante el ciclo de depuración de julio 2026: estado de despliegue, dos bugs de producción corregidos, y verificación de que el plan de optimización de consumo BD/backend quedó completo.

## 1. Estado de despliegue

- La plataforma corre en producción sobre **Cloudflare Workers** vía OpenNext (`.open-next/worker.js`, build con `opennextjs-cloudflare build`).
- Dominio: `https://www.cenplataformaeducacionfinanciera.com.mx` (el apex `cenplataformaeducacionfinanciera.com.mx` redirige 308 a `www`).
- Login, sesión y navegación del dashboard verificados **en vivo** contra la URL de producción real (no solo en local) con un script de Playwright.
- `wrangler.jsonc`: `routes` con dominios custom, `assets` binding, `RATE_LIMIT_KV` (namespace de Cloudflare KV para el rate limiter), `observability` activado.
- Nota abierta: el `id` de `RATE_LIMIT_KV` en el `wrangler.jsonc` local todavía tiene el placeholder `REPLACE_WITH_REAL_KV_NAMESPACE_ID`. El login y el rate limiting funcionan en producción, así que el binding real probablemente está configurado del lado de Cloudflare (fuera del archivo versionado) — no confirmado como roto, queda como punto a revisar si se vuelve a tocar el deploy.

## 2. Bug corregido: alta de escuelas no vinculaba bien a profesores ni alumnos

**Causa raíz** (`src/app/actions/adminActions.ts`, función `onboardEscuela`):
- El trigger `handle_new_user` de Supabase crea *siempre* el `profile` con `role = 'student'`, sin excepción. El código de alta de profesores nunca sobreescribía ese rol a `'teacher'` — solo vinculaba `escuela_id`. Resultado: todo profesor creado por el flujo de alta quedaba en la base de datos con rol de alumno.
- El alta de alumnos asumía (incorrectamente) que el mismo trigger los insertaba en la tabla `alumnos_grupos`. No lo hace — solo crea el `profile`. Resultado: los alumnos quedaban con `escuela_id` pero sin membresía de grupo, así que no aparecían en el roster del profesor.

**Fix aplicado** (aún sin commitear, ver sección 5):
```diff
- await admin.from("profiles").update({ escuela_id: escuela.id }).eq("id", tid);
+ await admin.from("profiles").update({ escuela_id: escuela.id, role: "teacher" }).eq("id", tid);
```
```diff
  await admin.from("profiles").update({ escuela_id: escuela.id }).eq("id", authData.user.id);
+ await admin.from("alumnos_grupos").insert({ id_alumno: authData.user.id, id_grupo: grupoId });
```

**Corrección retroactiva en producción**: los 22 registros ya creados por el flujo de prueba (escuela "Escuela Primaria Benito Juárez") se corrigieron manualmente vía script con service-role key — `role` de los profesores puesto a `'teacher'`, alumnos insertados en `alumnos_grupos`.

**Verificación**: login en vivo como el profesor Carlos López Torres → el dashboard muestra la escuela correcta y los 10 alumnos de GRUPO-A.

## 3. Bug corregido: RPC `get_intentos_stats` faltante en producción

- `TopAlumnos.tsx` y `alumnos/page.tsx` ya llamaban a `supabase.rpc("get_intentos_stats", { p_student_ids })`, pero esa función nunca se había creado en la base de datos de producción. Causaba `PGRST202` (función no encontrada) en cada llamada, silenciosamente absorbido por el código, y los alumnos mostraban siempre "0/20" de avance sin importar su progreso real.
- La plantilla SQL ya existía en el repo (`supabase/migrations/get_intentos_stats.sql`) pero nunca se había aplicado a producción.
- **Fix**: se ejecutó manualmente en el SQL Editor del Dashboard de Supabase, con tu aprobación explícita, el `CREATE OR REPLACE FUNCTION public.get_intentos_stats(p_student_ids uuid[])` (agrega `completed_count`, `avg_score`, `total_minutes` por alumno en Postgres, con `SECURITY INVOKER` para respetar RLS).
- **Verificación**: la función ya existe y responde sin error; probada contra alumnos reales con actividades completadas (ej. una alumna con 2 actividades completadas y promedio 85) — el resultado coincidió exactamente con las filas crudas de `intentos`.
- El "0/20" que siguen mostrando los alumnos de la escuela de prueba **ya no es un bug**: esos alumnos nunca completaron una actividad real en `/hub`, así que no tienen filas en `intentos`.

## 4. Plan de optimización de consumo BD/backend — estado: completo

Objetivo: que la plataforma alcance para miles de alumnos reales dentro de los límites gratuitos de Supabase (500MB almacenamiento, bandwidth) y Cloudflare Workers.

**Primera ronda (ya implementada antes de este ciclo)**: Realtime reemplazado por polling, queries con scoping por roster del profesor, verificación de JWT local en middleware (sin round-trip a Supabase para checar sesión), rate limiter en Cloudflare KV, índices versionados.

**Segunda ronda — verificada esta sesión, ya implementada en su totalidad**:

| Fase | Cambio | Estado |
|---|---|---|
| 1.1 | `BotonProgreso.tsx` ya no escribe a Supabase (solo `localStorage`, es una demo pública desconectada del flujo real de `/hub`) | ✅ |
| 1.2 | `.limit(50)` en los 2 modales de historial sin límite (`alumnos/page.tsx`, `StudentRecordModal.tsx`) | ✅ |
| 1.3 | `LabProgressRings.tsx` (código huérfano, sin imports) eliminado | ✅ |
| 1.4 | Cache compartido `swr` entre componentes hermanos del dashboard (vía `useScopedStudentIds.ts`), deduplica las 4 llamadas concurrentes al roster en una sola | ✅ |
| 2.1 | RPC `get_intentos_stats` — agregación en Postgres en vez de traer todo y reducir en JS | ✅ (aplicada esta sesión, sección 3) |
| 2.2 | Batch del sync queue offline: un solo `.upsert()` de array en vez de N requests individuales (`hub.ts`) | ✅ |
| 3.1 | Deduplicación de `intentos` + `UNIQUE(user_id, activity_id)` | ✅ (verificado empíricamente: dos llamadas a `record_intento` con la misma clave producen una sola fila) |
| 3.2 | RPC `record_intento` con upsert real (`ON CONFLICT DO UPDATE`, score = mejor de los dos, tiempo = suma) | ✅ |

No queda ninguna fase pendiente de este plan.

## 5. Pendientes / decisiones abiertas

- **Sin commitear**: `src/app/actions/adminActions.ts` (fix de la sección 2) y `src/app/globals.css` (cambio menor: `@import "tailwindcss" source("../")` para que Tailwind escanee bien las clases del proyecto). Ambos ya están confirmados funcionando en producción; faltan en el historial de git. Se comitean solo si lo pides explícitamente.
- **`wrangler.jsonc` / `RATE_LIMIT_KV`**: placeholder local sin confirmar contra el binding real de Cloudflare (ver sección 1).
- **Avisos no bloqueantes vistos en producción** (no requieren acción):
  - CSP bloquea la textura decorativa `grainy-gradients.vercel.app/noise.svg` (efecto visual menor, no funcional).
  - `TypeError: Failed to fetch` transitorio en `_getUser` justo después del login (no impide el login).
  - Un prefetch RSC fallido hacia `/dashboard/teacher/planeamiento` (probablemente un hover-prefetch abortado).

## 6. Datos de prueba en producción — no limpiar

- Escuela "Escuela Primaria Benito Juárez" (`escuela_id = 89f0a469-aa3f-49f8-bc7a-ec1414ae859a`) y las cuentas generadas para la prueba de onboarding.
- Grupo `GRUPO-FINANCIERA-PILOTO-001` (preexistente, no relacionado con esta prueba).
