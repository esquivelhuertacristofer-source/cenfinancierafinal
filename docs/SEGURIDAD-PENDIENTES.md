# Deuda de Seguridad — CEN Educación Financiera

**Última actualización:** 2026-05-17 (SEC-001, SEC-002, SEC-004 resueltos)
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

### SEC-003 — Rate limiting real en login
- **Categoría:** A04 Insecure Design
- **Severidad:** Alta
- **Descripción:** El rate limiter actual (in-memory, proxy) intercepta POSTs a `/log-in` (la página), no la llamada real a Supabase auth. El flujo real de login va directo desde el cliente al servidor de Supabase vía SDK, sin pasar por nuestro proxy. Supabase tiene rate limiting nativo pero no controlamos sus umbrales.
- **Cómo resolver:**
  1. Migrar `supabase.auth.signInWithPassword()` a una Server Action que primero aplique rate limiting
  2. O configurar rate limits específicos en el dashboard de Supabase: Auth > Rate Limits > Limit signups per IP

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

### SEC-005 — new Function() en math-engine y BuilderActivity
- **Categoría:** A03 Injection
- **Severidad:** Media (riesgo acotado en estado actual)
- **Archivos:** `src/lib/math-engine.ts:23`, `src/components/activities/BuilderActivity.tsx:42,48,62`
- **Descripción:** Uso de `new Function()` para evaluar fórmulas matemáticas. Fórmulas provienen de archivos JSON del repositorio (developer-controlled). Riesgo se elevaría a CRÍTICO si fórmulas vinieran de base de datos o input de usuario.
- **Cómo resolver:** Reemplazar con biblioteca `mathjs` que provee un evaluador de expresiones matemáticas sin acceso a scope global.

### SEC-006 — CSP con unsafe-inline en script-src
- **Categoría:** A05 Security Misconfiguration
- **Severidad:** Media
- **Archivo:** `src/proxy.ts`
- **Descripción:** La CSP implementada incluye `'unsafe-inline'` en `script-src` porque Next.js/Turbopack inyecta scripts inline. Con `'unsafe-inline'`, XSS puede ejecutar scripts inline.
- **Cómo resolver:** Implementar nonce-based CSP. Requiere generar un nonce por request y pasarlo a Next.js via `nonce` en la configuración. Complejidad media-alta.

### SEC-007 — Anon key en git history
- **Categoría:** A02 Cryptographic Failures
- **Severidad:** Baja (anon key es pública por diseño)
- **Descripción:** `docs/CREDENCIALES_MAESTRAS.md` contiene el Supabase anon key en git history. Archivo removido del tracking (.gitignore actualizado). El historial persiste.
- **Acción recomendada:** Si se quiere limpiar el historial, usar `git filter-repo` o BFG Repo Cleaner. Rotar el anon key en el Supabase dashboard como buena práctica aunque no sea urgente.

---

## BAJA PRIORIDAD

### SEC-008 — Security logger sin integración en flujos individuales
- **Categoría:** A09 Logging & Monitoring
- **Severidad:** Baja
- **Descripción:** El módulo `src/lib/security-logger.ts` fue creado pero no está integrado en los flujos de login, admin actions ni API routes. Los eventos de seguridad no se están logueando actualmente.
- **Cómo resolver:** Integrar `logSecurityEvent()` en login (éxito/fallo), adminActions, y los API routes que retornan 401/403.

### SEC-009 — Next.js 16.1.6 con CVEs de middleware bypass
- **Categoría:** A06 Vulnerable Components
- **Severidad:** Alta (en el paquete) / requiere evaluación
- **CVEs:** GHSA-26hh-7cqf-hhc6 (middleware bypass), GHSA-vfv6-92ff-j949 (cache poisoning), GHSA-mg66-mrh9-m8jx (DoS)
- **Nota:** El fix requiere `npm audit fix --force` que puede actualizar Next.js a una versión con breaking changes. Evaluar si hay una versión 16.1.x o 16.2.x que resuelva estos CVEs sin breaking changes.
- **Cómo resolver:** `npm install next@latest` o evaluar la versión mínima con los fixes y actualizar específicamente.
