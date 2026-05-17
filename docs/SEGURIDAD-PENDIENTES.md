# Deuda de Seguridad — CEN Educación Financiera

**Última actualización:** 2026-05-17
**Fuente:** Auditoría OWASP Top 10 (2021) — ver `docs/AUDITORIA-OWASP-FINANCIERA.md`

---

## ALTA PRIORIDAD

### SEC-001 — adminActions.ts sin verificación de rol del caller
- **Categoría:** A01 Broken Access Control
- **Severidad:** Alta
- **Archivos:** `src/app/actions/adminActions.ts`
- **Descripción:** Las Server Actions que usan `SUPABASE_SERVICE_ROLE_KEY` (`onboardInstitutionalUsers`, `createGrupo`, `getGrupos`) no verifican que el usuario autenticado tenga rol `admin` o `super_admin` antes de ejecutar operaciones privilegiadas. Cualquier usuario con acceso al cliente podría invocarlas.
- **Por qué no se resolvió:** Requiere instalar `@supabase/ssr` y migrar el flujo de autenticación a cookies SSR. Sin eso, no hay forma de leer la sesión en Server Actions sin cambiar la arquitectura.
- **Estimado de resolución:** 2–3 horas
- **Cómo resolver:**
  1. `npm install @supabase/ssr`
  2. Crear `src/lib/supabase-server.ts` usando `createServerClient` de `@supabase/ssr`
  3. En cada Server Action, llamar `requireAdminSession()` antes de `getAdminClient()`
  4. Migrar `supabase-browser.ts` a `createBrowserClient` de `@supabase/ssr` para cookie-based sessions

### SEC-002 — cen_session cookie es trivialmente forgeable
- **Categoría:** A07 Auth Failures / A01 Access Control
- **Severidad:** Media-Alta
- **Archivo:** `src/proxy.ts`, `src/app/log-in/page.tsx`
- **Descripción:** El proxy auth guard verifica solo `if (!request.cookies.get('cen_session'))`. Cualquier usuario puede ejecutar `document.cookie = "cen_session=1"` en el navegador para bypasear el redirect. Los datos reales están protegidos por Supabase RLS, pero la UI de /hub y /dashboard es accesible sin autenticación real.
- **Por qué no se resolvió:** Requiere el mismo refactor de `@supabase/ssr` que SEC-001.
- **Cómo resolver:** Después de implementar SEC-001, reemplazar el check de `cen_session` en `proxy.ts` por validación del JWT de Supabase usando `createServerClient`.

### SEC-003 — Rate limiting real en login
- **Categoría:** A04 Insecure Design
- **Severidad:** Alta
- **Descripción:** El rate limiter actual (in-memory, proxy) intercepta POSTs a `/log-in` (la página), no la llamada real a Supabase auth. El flujo real de login va directo desde el cliente al servidor de Supabase vía SDK, sin pasar por nuestro proxy. Supabase tiene rate limiting nativo pero no controlamos sus umbrales.
- **Cómo resolver:**
  1. Migrar `supabase.auth.signInWithPassword()` a una Server Action que primero aplique rate limiting
  2. O configurar rate limits específicos en el dashboard de Supabase: Auth > Rate Limits > Limit signups per IP

---

## MEDIA PRIORIDAD

### SEC-004 — xlsx con vulnerabilidades sin fix disponible
- **Categoría:** A06 Vulnerable Components
- **Severidad:** Alta (en el paquete) / Media (en contexto de uso)
- **Paquete:** `xlsx@0.18.5` (SheetJS Community Edition)
- **CVEs:** GHSA-4r6h-8v6p-xvw6 (Prototype Pollution), GHSA-5pgg-2g8v-p4x9 (ReDoS)
- **Contexto de uso:** Se usa para exportar reportes (generación), no para parsear archivos subidos por usuarios. El riesgo real de prototype pollution se activa principalmente al *parsear* archivos no confiables.
- **Cómo resolver:** Reemplazar `xlsx` con `exceljs` (MIT, mantenido activamente, sin CVEs conocidos)

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
