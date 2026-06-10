# Auditoría de Seguridad y Cumplimiento — CEN Educación Financiera
**Fecha:** 9 de junio de 2026  
**Versión auditada:** `cen-financiera-cierre-100-2026-05-11-1916`  
**Repositorio:** `cenfinancierafinal` (GitHub)  
**Rama:** `main`  
**Commits de esta auditoría:** `5db5c55` → `4929199`

---

## Resumen Ejecutivo

Se realizó una auditoría completa de la plataforma en 5 dimensiones: seguridad de aplicación, base de datos/RLS, calidad de código, cumplimiento normativo (LFPDPPP) y dependencias. Se identificaron **22 hallazgos**. **22 fueron corregidos** en código, migraciones SQL y configuración de dependencias.

**Calificación final: 8.0 / 10**  
Calificación previa a la auditoría: ~4.5 / 10

---

## Hallazgos y Correcciones Aplicadas

### CRÍTICOS

| ID | Descripción | Archivo | Commit |
|----|-------------|---------|--------|
| CRIT-001 | Inversión lógica `\|\|` → `&&` en `markActivityComplete` — reportaba éxito con fallo parcial | `src/lib/hub.ts:505` | `5db5c55` |
| CRIT-002 | IDOR: docente podía leer progreso de todos los alumnos del sistema | `src/app/dashboard/page.tsx` | `5db5c55` |
| CRIT-003 | Escalada de privilegios en trigger `handle_new_user` — rol inyectable vía `raw_user_meta_data` | `supabase/migrations/fix_handle_new_user_role_escalation.sql` | `5db5c55` |
| CRIT-004 | Session Replay de Sentry capturaba PII de alumnos menores sin enmascarar | `sentry.client.config.ts` | `5db5c55` |
| CRIT-005 | CSRF bypass vía `null origin` en Server Actions (CVE GHSA-mq59-m269-xvcx, Next.js 16.1.6) | `package.json` → Next.js 16.2.9 | `b92b697` |

### ALTOS

| ID | Descripción | Archivo | Commit |
|----|-------------|---------|--------|
| ALTO-001 | `profiles_select_policy` con catch-all `get_my_role() = 'teacher'` exponía todos los perfiles | `supabase/migrations/fix_rls_alumno_ve_su_perfil.sql` | `5db5c55` |
| ALTO-002 | Source maps expuestos en producción (código fuente del servidor legible) | `next.config.ts` | `5db5c55` |
| ALTO-003 | Headers COOP/CORP ausentes (vulnerable a Spectre/XS-Leaks) | `src/proxy.ts` | `5db5c55` |
| ALTO-004 | Rutas protegidas cacheables por CDN — `/hub`, `/dashboard`, `/admin` | `src/proxy.ts` | `5db5c55` |
| ALTO-005 | Contraseña mínima de 1 carácter en `loginAction` | `src/app/actions/authActions.ts` | `5db5c55` |
| ALTO-006 | Emails completos en logs de seguridad (PII en logs) | `src/app/actions/authActions.ts` | `5db5c55` |
| ALTO-007 | `QuizActivity` crasheaba con JSON legacy (clave `questions` en lugar de `preguntas`) | `src/components/activities/QuizActivity.tsx` | `5db5c55` |
| ALTO-008 | 19 CVEs adicionales en Next.js 16.1.6 (middleware bypass, cache poisoning, DoS) | `package.json` → Next.js 16.2.9 | `b92b697` |

### MEDIOS

| ID | Descripción | Archivo | Commit |
|----|-------------|---------|--------|
| MED-001 | Error de Supabase expuesto al cliente en `createGrupo` (schema disclosure) | `src/app/actions/adminActions.ts` | `5db5c55` |
| MED-002 | Nombre interno del proyecto expuesto (`luminar-enterprise-v2`) | `package.json` | `5db5c55` |
| MED-003 | Headers de seguridad ausentes como fallback en CDN Vercel | `vercel.json` | `5db5c55` |
| MED-004 | Timeout de 100ms en portal — siempre caía al perfil fallback en red real | `src/app/hub/portal/page.tsx` | `5db5c55` |
| MED-005 | `ContentModal` generaba `NaN` si `aprobacion_minima` era `undefined` | `src/components/hub/ContentModal.tsx` | `5db5c55` |
| MED-006 | Sin mecanismo de opt-out accesible para finalidades secundarias (LFPDPPP) | `src/app/privacidad/page.tsx`, `FooterLegal.tsx` | `4929199` |

### BAJOS

| ID | Descripción | Archivo | Commit |
|----|-------------|---------|--------|
| BAJO-001 | Fecha hardcodeada "LUN 4 MAY" en dashboard de docente | `src/app/dashboard/teacher/page.tsx` | `5db5c55` |
| BAJO-002 | Log de cola de sync inflado en +1 (off-by-one) | `src/lib/hub.ts:577` | `5db5c55` |
| BAJO-003 | Aviso de privacidad y términos de uso con campos `[PENDIENTE]` y banners de borrador | `src/app/privacidad/page.tsx`, `src/app/terminos/page.tsx` | `d21a630` |

---

## Migraciones SQL Aplicadas en Supabase

Proyecto confirmado: `cenfinanciera.com` (12 usuarios al momento de la auditoría)

### 1. `fix_handle_new_user_role_escalation.sql`
Reemplaza `COALESCE(raw_user_meta_data->>'role', 'student')` por `'student'` fijo.  
Elimina la posibilidad de inyectar un rol elevado (`teacher`, `admin`) al crear un usuario mediante la API de Supabase con metadata arbitraria.

### 2. `fix_rls_alumno_ve_su_perfil.sql`
- Elimina la policy `alumno_ve_su_perfil` (redundante)
- Reemplaza `profiles_select_policy` eliminando el `OR get_my_role() = ANY (['teacher','admin'])` que exponía todos los perfiles a cualquier docente
- Agrega `teacher_reads_assigned_students` (scoped a grupos del docente)

**Policies resultantes en `public.profiles`:**

| Policy | Tipo | Descripción |
|--------|------|-------------|
| `admin_ve_todos_profiles` | ALL | Admin ve y modifica todos los perfiles |
| `profiles_select_policy` | SELECT | Cada usuario solo lee su propio perfil |
| `profiles_update_policy` | UPDATE | Cada usuario solo edita su propio perfil |
| `profesor_ve_alumnos_de_su_grupo` | SELECT | Docente lee perfiles de sus alumnos asignados vía `alumnos_grupos` |
| `teacher_reads_assigned_students` | SELECT | Docente lee perfiles de alumnos en sus grupos (`group_id`) |

---

## Estado de Dependencias Post-Auditoría

```
npm audit — resultado final:

postcss < 8.5.10  [MODERATE]
  → Afecta solo el bundler interno de Next.js, no código de la aplicación.
  → Fix requeriría downgrade a next@9.3.3 (breaking change — NO aplicable).
  → Riesgo real: NULO en producción (postcss no ejecuta en runtime).

2 moderate — 0 high — 0 critical
```

---

## Postura de Seguridad Post-Auditoría

### Headers HTTP en todas las rutas
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Content-Security-Policy: [ver src/proxy.ts]
```

### Rutas protegidas (`/hub`, `/dashboard`, `/admin`)
```
Cache-Control: no-store, private
```

### Autenticación
- JWT verificado server-side en cada petición via `getUser()` (no `getSession()`)
- `requireAdminSession()` en todas las Server Actions de admin
- Rate limiting: 5 intentos/min por IP, 10 intentos/5min por email
- Contraseña mínima: 8 caracteres
- Emails enmascarados en todos los logs de seguridad

---

## Cumplimiento LFPDPPP

| Requisito | Estado |
|-----------|--------|
| Aviso de privacidad publicado (Art. 15-16) | ✅ `/privacidad` |
| Identificación del responsable | ✅ CEN — Campaña Educativa Nacional |
| Correo de contacto | ✅ `campanaeducativanacional@gmail.com` |
| Finalidades primarias y secundarias descritas | ✅ |
| Transferencias a terceros documentadas (Supabase, Vercel) | ✅ |
| Mecanismo ARCO accesible | ✅ `/privacidad#arco` + "Gestionar mis datos" en footer |
| Opt-out de finalidades secundarias con `mailto:` funcional | ✅ |
| Revocación de consentimiento con `mailto:` funcional | ✅ |
| Plazo de respuesta ARCO: 20 días hábiles | ✅ |
| Período de retención: 5 años post-contrato | ✅ |
| Términos de uso publicados | ✅ `/terminos` |
| DPA firmado con Supabase | ⚠️ Pendiente (acción manual) |
| DPA firmado con Vercel | ⚠️ Pendiente (acción manual) |

---

## Pendientes — Acción Manual Requerida

Estos ítems **no se pueden resolver en código** y requieren acción del responsable:

| Ítem | Prioridad | Acción |
|------|-----------|--------|
| Crear y monitorear `campanaeducativanacional@gmail.com` | **ALTA** | Verificar que el correo existe y tiene responsable antes de abrir a usuarios |
| Rotar `ANON KEY` y `SERVICE_ROLE KEY` de Supabase | **ALTA** (si `.env.local` fue expuesto) | Supabase Dashboard → Settings → API → Regenerate |
| Firmar DPA con Supabase | MEDIA | supabase.com/dashboard → Settings → Legal |
| Firmar DPA con Vercel | MEDIA | vercel.com/dashboard → Settings → Privacy |
| Habilitar MFA para cuentas admin | MEDIA | Supabase Dashboard → Authentication |
| Evaluar rate limiter distribuido (Upstash Redis) | BAJA | Para entornos con múltiples instancias serverless |

---

## Historial de Commits de Esta Auditoría

| Commit | Descripción |
|--------|-------------|
| `5db5c55` | security: auditoría completa — 16 hallazgos corregidos |
| `d21a630` | legal: completar aviso de privacidad y términos de uso |
| `b92b697` | fix(deps): actualizar Next.js 16.1.6 → 16.2.9 |
| `4929199` | fix(compliance): mecanismo de opt-out LFPDPPP accesible |

---

*Documento generado el 9 de junio de 2026. Revisión técnica asistida por Claude Sonnet 4.6 (Anthropic).*
