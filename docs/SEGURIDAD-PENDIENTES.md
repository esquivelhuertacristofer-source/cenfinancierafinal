# Deuda de Seguridad — CEN Educación Financiera

**Última actualización:** 2026-07-13 (runbook de rotación de secretos y rollback actualizados al flujo Cloudflare; SEC-010 marcado resuelto)
**Actualización previa:** 2026-05-17 (SEC-001 a SEC-007 resueltos o documentados)
**Fuente:** Auditoría OWASP Top 10 (2021) — ver `docs/AUDITORIA-OWASP-FINANCIERA.md`

---

## ALTA PRIORIDAD

### ~~SEC-001 — adminActions.ts sin verificación de rol del caller~~ ✅ RESUELTO (2026-05-17)
- **Categoría:** A01 Broken Access Control
- **Acciones resueltas:** `onboardInstitutionalUsers`, `createGrupo`, `getGrupos`
- **Acción:** Instalado `@supabase/ssr`. Creado `src/lib/supabase-server.ts` con `requireAdminSession()` que valida JWT + rol server-side. Las 3 Server Actions llaman `await requireAdminSession()` como primera instrucción — si falla, lanzan `UNAUTHORIZED` o `FORBIDDEN` antes de tocar `service_role`.
- **Cambios:** `src/lib/supabase-server.ts` (NUEVO), `src/app/actions/adminActions.ts`, `src/lib/supabase-browser.ts` (migrado a `createBrowserClient`).
- **Tests:** 7 tests de control de acceso + 10 de `requireAdminSession` (100% cobertura en `supabase-server.ts`).

### ~~SEC-002 — cen_session cookie es trivialmente forgeable~~ ✅ RESUELTO (2026-05-17)
- **Categoría:** A07 Auth Failures / A01 Access Control
- **Acción:** `src/proxy.ts` migrado a async. Reemplazado `!request.cookies.get('cen_session')` por `supabase.auth.getUser()` de `@supabase/ssr`. Cookie `cen_session` manual eliminada de `log-in/page.tsx`. El proxy ahora valida el JWT firmado de Supabase en lugar de un cookie custom forgeable. Token refresh propagado automáticamente via `setAll` callback.
- **Rutas protegidas:** `/hub`, `/dashboard`, `/admin` (añadida).
- **Archivos:** `src/proxy.ts`, `src/app/log-in/page.tsx`.

### ~~SEC-003 — Rate limiting real en login~~ ✅ RESUELTO (2026-05-17)
- **Categoría:** A04 Insecure Design
- **Acción:** Login migrado a Server Action exclusiva (`src/app/actions/authActions.ts`).
  - `loginAction(email, password)` aplica doble rate limit antes de llamar a Supabase: 5 req/min por IP, 10 req/5min por email (normalizado lowercase).
  - `supabase.auth.signInWithPassword()` ya no se llama desde el cliente — sólo desde el servidor.
  - `logoutAction()` centraliza el logout con logging de evento.
  - Validación con Zod: email válido + password no vacío.
  - Eventos `login_success`, `login_failure`, `login_rate_limited`, `logout_success` logueados vía `security-logger.ts`.
- **Limitación documentada (histórica):** en su momento, rate limiter in-memory sin persistir entre instancias Vercel serverless. **Resuelto** en la migración a Cloudflare Workers — ver SEC-010 más abajo (ahora usa Cloudflare KV como store compartido).
- **Configuración manual recomendada (Supabase Dashboard):** Auth > Rate Limits — revisar umbrales de signups/IP como capa adicional.
- **Tests:** 8 tests en `src/__tests__/authActions.test.ts` (email inválido, password vacío, credenciales incorrectas, IP rate limit, email rate limit, log failure, log success, retorno de rol).
- **Archivos:** `src/app/actions/authActions.ts` (NUEVO), `src/lib/rate-limiter.ts` (función `rateLimit` genérica), `src/lib/security-logger.ts` (campos `email`, `action`, tipo `logout_success`), `src/app/log-in/page.tsx` (usa `loginAction`).

---

## MEDIA PRIORIDAD

### ~~SEC-004 — xlsx con vulnerabilidades sin fix disponible~~ ✅ RESUELTO (2026-05-17)
- **Categoría:** A06 Vulnerable Components
- **Paquete eliminado:** `xlsx@0.18.5` (SheetJS Community Edition)
- **CVEs eliminados:** GHSA-4r6h-8v6p-xvw6 (Prototype Pollution), GHSA-5pgg-2g8v-p4x9 (ReDoS)
- **Acción:** `npm uninstall xlsx` — migración completa a CSV nativo + PapaParse (ya existente)
  - `downloadTemplate()` reemplazada: genera `.csv` con `Blob + URL.createObjectURL` (sin dependencias)
  - `processFile()` simplificada: solo acepta `.csv` vía PapaParse (rama `xlsx/xls` eliminada)
  - Input de archivo: `accept=".csv"` (antes `.xlsx,.xls,.csv`)
- **Coherencia UAEMEX:** Sincronizado con la versión entregada en auditoría UAEMEX (2026-05-13) donde xlsx fue reemplazado por PapaParse + CSV nativo.
- **Archivo modificado:** `src/app/admin/usuarios/page.tsx`

### ~~SEC-005 — new Function() en math-engine y BuilderActivity~~ ✅ RESUELTO (2026-05-17)
- **Categoría:** A03 Injection
- **Acción:** `new Function()` reemplazado por `evaluate()` de `mathjs` en todos los usos.
  - `src/lib/math-engine.ts`: reescrito con `evaluate(normalizeFormula(f), variables)`. Eliminado `new Function('return ...')()`.
  - `src/components/activities/BuilderActivity.tsx`: 3 instancias migradas a `evaluate()` con scope objeto.
  - `normalizeFormula()` convierte `Math.ceil/max/round/pow/min/abs/sqrt/log` → equivalentes mathjs. Las fórmulas reales del proyecto usan estos métodos.
  - mathjs NO tiene acceso a `process`, `require`, ni globals JS — solo evalúa expresiones matemáticas.
- **Tests:** 17 tests en `src/__tests__/math-engine.test.ts` (normalización, aritmética, fórmulas reales con Math.*, robustez, rechazo de código arbitrario).
- **Archivos:** `src/lib/math-engine.ts`, `src/components/activities/BuilderActivity.tsx`, `package.json` (`mathjs` añadido).

### ~~SEC-006 — CSP con unsafe-inline en script-src~~ ✅ RESUELTO (2026-05-17)
- **Categoría:** A05 Security Misconfiguration
- **Acción:** Nonce-based CSP implementada en `src/proxy.ts`.
  - Se genera un nonce por request via `crypto.randomUUID()` → base64.
  - `script-src` reemplazado: `'unsafe-inline' 'unsafe-eval'` → `'nonce-${nonce}' 'strict-dynamic'`.
  - `'unsafe-eval'` eliminado completamente (builds de producción no lo requieren).
  - `style-src` mantiene `'unsafe-inline'` — styles inline no son ejecutables, riesgo aceptado.
  - El nonce se pasa como `x-nonce` en los request headers para que Next.js App Router lo aplique a sus scripts de hidratación.
- **Limitación:** El comportamiento con Turbopack (Next.js 16.1.6) no fue verificado en browser — requiere validación manual en staging antes de deploy a producción. Si los scripts de hidratación quedan bloqueados, agregar `'unsafe-inline'` de vuelta a `script-src` como fallback temporal.
- **Archivos:** `src/proxy.ts`.

### SEC-007 — Anon key en git history — PROCEDIMIENTO DOCUMENTADO
- **Categoría:** A02 Cryptographic Failures
- **Severidad:** Baja (anon key es pública por diseño en Supabase)
- **Estado:** Archivo removido del tracking (.gitignore actualizado en auditoría anterior). El historial git persiste. La ejecución de la rotación es acción manual del usuario.

#### Procedimiento de rotación (ejecutar manualmente):

> **Actualizado (2026-07-08) — flujo Cloudflare.** El proyecto migró de Vercel a Cloudflare Workers; el runbook anterior (`vercel env` / Vercel Dashboard) ya no aplica. Los secretos ya no se declaran en `wrangler.jsonc` (ese archivo solo tiene `vars` públicas, no sensibles) — se cargan uno por uno con `wrangler secret put`.

1. Ir a **Supabase Dashboard** → Project Settings → API
2. Click en **"Rotate anon key"** (o "Regenerate")
3. Copiar la nueva anon key
4. Actualizar la variable en los dos entornos:
   - **Producción (Cloudflare Workers):**
     ```bash
     npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```
     El comando pide pegar el valor de forma interactiva (no queda en shell history ni en archivos versionados). Repetir el mismo patrón para cualquier otro secreto rotado (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, etc.):
     ```bash
     npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
     npx wrangler secret put SUPABASE_JWT_SECRET
     ```
   - **Desarrollo local:** actualizar el archivo `.dev.vars` en la raíz del proyecto (gitignored, usado por `npm run cf:preview` / `wrangler dev`). Para desarrollo con `npm run dev` (Next.js puro, sin runtime de Cloudflare), actualizar `.env.local` (también gitignored).
5. Publicar el cambio: `wrangler secret put` no requiere un redeploy completo del Worker para tomar efecto, pero si se rotó junto con un cambio de código, hacer `npm run cf:deploy`.
6. Verificar que login, queries y Supabase Realtime siguen funcionando
7. La key vieja permanece en git history pero **ya no es funcional** una vez rotada

> **Nota:** Limpiar el historial git (`git filter-repo` / BFG Repo Cleaner) es opcional. La key rotada en el historial no representa riesgo porque ya no funciona.

---

## Procedimiento de Rollback (Cloudflare Workers)

Si un deploy a producción introduce un problema (error 500 generalizado, regresión de seguridad, build corrupto), revertir con:

```bash
npx wrangler rollback
```

Notas:

- `wrangler rollback` vuelve al **último deployment previo** del Worker sin necesidad de rehacer el build — es la opción más rápida para mitigar un incidente en producción.
- No revierte cambios de base de datos (migraciones SQL de Supabase) ni secretos rotados con `wrangler secret put` — solo el código del Worker. Si el incidente involucra una migración de esquema, evaluar también un rollback manual en Supabase Dashboard.
- Después de un rollback de emergencia, corregir el problema en una rama/commit nuevo y volver a desplegar con `npm run cf:deploy` en vez de dejar el proyecto indefinidamente en el estado revertido.
- `npx wrangler deployments list` muestra el historial de deployments si se necesita revertir a uno específico distinto del inmediatamente anterior.

---

## BAJA PRIORIDAD

### SEC-008 — Security logger sin integración en flujos individuales
- **Categoría:** A09 Logging & Monitoring
- **Severidad:** Baja
- **Descripción:** El módulo `src/lib/security-logger.ts` fue creado pero no está integrado en todos los flujos. Login y logout ya están integrados vía `authActions.ts`. Faltan: adminActions, y los API routes que retornan 401/403.
- **Cómo resolver:** Integrar `logSecurityEvent()` en `requireAdminSession()` cuando lanza UNAUTHORIZED/FORBIDDEN, y en las API routes relevantes.

### SEC-009 — Next.js 16.1.6 con CVEs de middleware bypass
- **Categoría:** A06 Vulnerable Components
- **Severidad:** Alta (en el paquete) / requiere evaluación
- **CVEs:** GHSA-26hh-7cqf-hhc6 (middleware bypass), GHSA-vfv6-92ff-j949 (cache poisoning), GHSA-mg66-mrh9-m8jx (DoS)
- **Nota:** El fix requiere `npm audit fix --force` que puede actualizar Next.js a una versión con breaking changes. Evaluar si hay una versión 16.1.x o 16.2.x que resuelva estos CVEs sin breaking changes.
- **Cómo resolver:** `npm install next@latest` o evaluar la versión mínima con los fixes y actualizar específicamente.

### ~~SEC-010 — Rate limiter in-memory no distribuido~~ ✅ RESUELTO (2026-07-08, migración a Cloudflare)
- **Categoría:** A04 Insecure Design (deuda residual de SEC-003)
- **Descripción original:** El rate limiter en `src/lib/rate-limiter.ts` usaba un `Map` en memoria de proceso. En Vercel con auto-scaling, cada instancia serverless tenía su propio contador independiente, permitiendo circunvalar los límites siendo enrutado a instancias distintas.
- **Acción:** Al migrar a Cloudflare Workers, `rate-limiter.ts` se reescribió para usar **Cloudflare KV** (binding `RATE_LIMIT_KV`, declarado en `wrangler.jsonc`) como store compartido entre todos los isolates/regiones del Worker, resolviendo el problema de contadores independientes por instancia sin necesitar un proveedor externo (Upstash ya no es necesario).
- **Fallback:** en `next dev` (Node, sin contexto de Cloudflare) sigue usando un `Map` en memoria — mismo comportamiento que antes, útil para desarrollo local sin `wrangler dev`.
- **Archivo:** `src/lib/rate-limiter.ts`.
