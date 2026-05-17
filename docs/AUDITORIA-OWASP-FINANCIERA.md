# Auditoría OWASP Top 10 (2021) — CEN Educación Financiera

**Fecha:** 2026-05-17
**Auditor:** Claude Sonnet 4.6 (análisis automatizado + fixes aplicados)
**Repo:** https://github.com/esquivelhuertacristofer-source/cenfinancierafinal.git
**Rama:** main

---

## Resumen ejecutivo

| Categoría | Hallazgos | Críticos | Altos | Medios | Bajos | Estado |
|-----------|-----------|----------|-------|--------|-------|--------|
| A01 Broken Access Control | 4 | 0 | 2 | 1 | 1 | Resuelto (requireAdminSession + JWT proxy 2026-05-17) |
| A02 Cryptographic Failures | 3 | 0 | 1 | 2 | 0 | Resuelto |
| A03 Injection | 2 | 0 | 1 | 1 | 0 | Resuelto (path traversal) + Documentado |
| A04 Insecure Design | 1 | 0 | 1 | 0 | 0 | Resuelto (loginAction + dual rate limit 2026-05-17) |
| A05 Security Misconfiguration | 4 | 0 | 2 | 2 | 0 | Resuelto |
| A06 Vulnerable Components | 6 | 0 | 4 | 2 | 0 | Resuelto (xlsx eliminado 2026-05-17, migración CSV) |
| A07 Auth Failures | 2 | 0 | 1 | 1 | 0 | Resuelto (PKCE + JWT proxy + cen_session eliminado 2026-05-17) |
| A08 Data Integrity | 0 | 0 | 0 | 0 | 0 | N/A — No issues |
| A09 Logging & Monitoring | 1 | 0 | 0 | 1 | 0 | Resuelto |
| A10 SSRF | 0 | 0 | 0 | 0 | 0 | N/A — No issues |

**Totales:** 23 hallazgos | 0 críticos | 12 altos | 8 medios | 3 bajos
**Resueltos en sesión:** 16 | **Resueltos post-sesión:** 4 (SEC-001, SEC-002, SEC-003, SEC-004) | **Documentados como deuda:** 3

---

## A01:2021 — Broken Access Control

### Hallazgo 1.1 — Path Traversal en /api/activity/[activityId]
- **Severidad:** ALTA
- **Archivo:** `src/app/api/activity/[activityId]/route.ts`
- **Descripción:** El parámetro `activityId` se usaba directamente en `path.join()` sin validar que no contenga `../`. Un atacante podría enviar `ACT-../../../etc/passwd-x-x` y leer archivos arbitrarios del servidor.
- **Fix:** Whitelist regex `/^[a-z0-9-]+$/i` aplicada antes del procesamiento.
- **Commit:** incluido en `fix(security): OWASP audit — path traversal, CSP, cookies, rate limit`
- **Estado:** ✅ RESUELTO

### Hallazgo 1.2 — Path Traversal en /api/curriculum/[levelGrade]
- **Severidad:** ALTA
- **Archivo:** `src/app/api/curriculum/[levelGrade]/route.ts`
- **Descripción:** Mismo patrón que 1.1. El `level` y `grade` se usaban en `path.join()` sin sanitizar.
- **Fix:** Whitelist regex `/^[a-z0-9]+-[a-z0-9]+$/i` aplicada.
- **Estado:** ✅ RESUELTO

### Hallazgo 1.3 — adminActions.ts sin verificación de caller (DEUDA ARQUITECTURAL)
- **Severidad:** ALTA
- **Archivo:** `src/app/actions/adminActions.ts`
- **Descripción:** Las Server Actions `onboardInstitutionalUsers`, `createGrupo`, `getGrupos` usan `SUPABASE_SERVICE_ROLE_KEY` (que bypasea RLS) pero no verifican que el caller tenga rol admin. Un usuario autenticado podría invocar estas acciones directamente.
- **Bloqueador:** Sin `@supabase/ssr`, no hay forma de leer la sesión server-side sin refactorizar la arquitectura de auth. Migración estimada: 2–3h.
- **Estado:** ⏳ DEUDA — ver SEGURIDAD-PENDIENTES.md

### Hallazgo 1.4 — cen_session cookie trivialmente forgeable (DEUDA ARQUITECTURAL)
- **Severidad:** MEDIA
- **Archivo:** `src/proxy.ts`, `src/app/log-in/page.tsx`
- **Descripción:** El proxy auth guard verifica solo la existencia de `cen_session=1`. Cualquier usuario puede ejecutar `document.cookie = "cen_session=1"` y bypasear el redirect de /hub y /dashboard. **La data real está protegida por Supabase RLS**, pero la UI protegida es accesible.
- **Mitigación actual:** RLS en Supabase protege los datos; el bypass solo afecta navegación UI.
- **Estado:** ⏳ DEUDA — ver SEGURIDAD-PENDIENTES.md

---

## A02:2021 — Cryptographic Failures

### Hallazgo 2.1 — Cookie sin flag Secure
- **Severidad:** ALTA
- **Archivo:** `src/app/log-in/page.tsx` (líneas 27 y 66)
- **Descripción:** `cen_session=1; SameSite=Lax` sin flag `Secure`. En HTTP (redes sin TLS), la cookie se transmite en claro.
- **Fix:** Cambiado a `SameSite=Strict; Secure`. También cambiado `SameSite=Lax` → `Strict` para prevenir envío cross-site.
- **Estado:** ✅ RESUELTO

### Hallazgo 2.2 — flowType 'implicit' en lugar de PKCE
- **Severidad:** MEDIA
- **Archivo:** `src/lib/supabase-browser.ts`
- **Descripción:** `flowType: 'implicit'` expone el access token en el hash URL tras OAuth. Con PKCE, el token se intercambia en un paso server-side adicional, previniendo token leakage vía referrer headers y historial de navegador.
- **Fix:** Cambiado a `flowType: 'pkce'`.
- **Estado:** ✅ RESUELTO

### Hallazgo 2.3 — Anon key en git history vía CREDENCIALES_MAESTRAS.md
- **Severidad:** BAJA (riesgo real)
- **Archivo:** `docs/CREDENCIALES_MAESTRAS.md` — en git history
- **Descripción:** El Supabase anon key (JWT) está commitado en `CREDENCIALES_MAESTRAS.md`. La anon key es pública por diseño (`NEXT_PUBLIC_`), pero es mala práctica documentar valores de credenciales en git.
- **Fix:** Archivo removido de git tracking (`git rm --cached`), .gitignore actualizado con `docs/CREDENCIALES*.md`. El historial git persiste — no se reescribió sin autorización del usuario.
- **Nota:** La service_role key fue explícitamente removida del documento previamente (indicado en el propio doc).
- **Estado:** ✅ RESUELTO (parcial — historial histórico persiste, valuar rotación de keys)

---

## A03:2021 — Injection

### Hallazgo 3.1 — Path Traversal en API routes (ver A01.1 y A01.2)
- **Estado:** ✅ RESUELTO (documentado en A01)

### Hallazgo 3.2 — new Function() en math-engine y BuilderActivity
- **Severidad:** MEDIA
- **Archivos:** `src/lib/math-engine.ts:23`, `src/components/activities/BuilderActivity.tsx:42,48,62`
- **Descripción:** Se usa `new Function()` para evaluar fórmulas matemáticas. Las fórmulas provienen de archivos JSON developer-controlled (`src/data/actividades/`), no de input de usuario. En BuilderActivity, los valores de usuario se pasan como argumentos de función (no interpolados en el string), lo que es seguro. En math-engine.ts, los valores se interpolan pero pasan por sanitización regex.
- **Riesgo real:** Bajo en el estado actual. El riesgo sería alto si las fórmulas vinieran de input de usuario o de la base de datos sin validación.
- **Recomendación:** Reemplazar con `mathjs` library para eliminar el riesgo completamente.
- **Estado:** 📋 DOCUMENTADO como deuda MEDIA — no fix inmediato por riesgo acotado

### Hallazgo 3.3 — dangerouslySetInnerHTML
- **Resultado:** Sin instancias encontradas. ✅

### Hallazgo 3.4 — eval()
- **Resultado:** Sin instancias en código de producción. ✅

---

## A04:2021 — Insecure Design

### Hallazgo 4.1 — Sin rate limiting real en login
- **Severidad:** ALTA
- **Descripción:** El flujo de login llamaba directamente a `supabase.auth.signInWithPassword()` desde el cliente, sin pasar por ningún endpoint server-side donde aplicar rate limiting.
- **Fix:** Login migrado a Server Action exclusiva `loginAction` en `src/app/actions/authActions.ts`. Rate limit doble: 5 req/min por IP + 10 req/5min por email. `supabase.auth.signInWithPassword()` sólo se llama desde el servidor.
- **Limitación documentada:** Rate limiter in-memory — no compartido entre instancias Vercel serverless. Migrar a Upstash Redis para entornos multi-instancia.
- **Estado:** ✅ RESUELTO (2026-05-17)

---

## A05:2021 — Security Misconfiguration

### Hallazgo 5.1 — Sin Content-Security-Policy
- **Severidad:** ALTA
- **Archivo:** `src/proxy.ts`
- **Descripción:** El proxy ya tenía X-Content-Type-Options, X-Frame-Options, HSTS, etc., pero faltaba CSP. Sin CSP, XSS exitoso puede exfiltrar datos libremente.
- **Fix:** CSP añadida con política restrictiva: `default-src 'self'`, scripts limitados a self + inline (necesario para Tailwind), connect limitado a Supabase + Sentry + Vercel Analytics.
- **Nota:** `'unsafe-inline'` en `script-src` es necesario para los inline scripts de Next.js/Turbopack. Migrar a nonce-based CSP en una siguiente iteración elimina este vector.
- **Estado:** ✅ RESUELTO

### Hallazgo 5.2 — HSTS condicional (solo HTTPS)
- **Severidad:** MEDIA
- **Descripción:** HSTS estaba dentro de un `if (protocol === 'https:')`. Vercel siempre sirve HTTPS, pero la condición era innecesariamente frágil.
- **Fix:** HSTS ahora se aplica siempre (en producción Vercel siempre es HTTPS).
- **Estado:** ✅ RESUELTO

### Hallazgo 5.3 — /hello route expuesta en producción
- **Severidad:** MEDIA
- **Archivo:** `src/app/hello/page.tsx`
- **Descripción:** Página de debug "🚀 Conexión Exitosa" accesible públicamente en producción.
- **Fix:** Archivo eliminado.
- **Estado:** ✅ RESUELTO

### Hallazgo 5.4 — /api/test-sentry accesible en producción
- **Severidad:** ALTA
- **Archivo:** `src/app/api/test-sentry/route.ts`
- **Descripción:** El endpoint aceptaba `?test=true` en producción si `NEXT_PUBLIC_SENTRY_DSN` estaba configurado. Podía disparar errores artificiales en Sentry, polluting el dashboard de alertas y potencialmente ocultando errores reales.
- **Fix:** Añadido `if (process.env.NODE_ENV === 'production') return 403` como primera verificación.
- **Estado:** ✅ RESUELTO

---

## A06:2021 — Vulnerable and Outdated Components

**Resultado de `npm audit` antes del fix:** 6 vulnerabilidades (4 high, 2 moderate)

### Vulnerabilidades resueltas (npm audit fix)
| Paquete | Severidad | CVE | Fix |
|---------|-----------|-----|-----|
| flatted | High | GHSA-rf6f-7fwh-wjgh | Actualizado automáticamente |
| picomatch | High | GHSA-c2c7-rcm5-vvqj | Actualizado automáticamente |
| PostCSS | Moderate | GHSA-qx2v-qp2m-jg93 | Actualizado automáticamente |

### Vulnerabilidades pendientes (sin fix disponible)
| Paquete | Severidad | CVE | Situación |
|---------|-----------|-----|-----------|
| xlsx | High | GHSA-4r6h-8v6p-xvw6 | Prototype Pollution — sin fix en community edition |
| xlsx | High | GHSA-5pgg-2g8v-p4x9 | ReDoS — sin fix en community edition |
| xlsx | Moderate | — | Sin fix disponible |

**Estado después de fix:** 3 vulnerabilidades (todas en `xlsx`)
**Estado:** ⚠️ PARCIAL — xlsx documentado en SEGURIDAD-PENDIENTES.md

---

## A07:2021 — Identification and Authentication Failures

### Hallazgo 7.1 — Ver 2.1 (cookie Secure + SameSite) y 2.2 (PKCE)
- **Estado:** ✅ RESUELTO

### Hallazgo 7.2 — cen_session forgeable (ver A01.4)
- **Estado:** ⏳ DEUDA arquitectural

### Verificaciones adicionales
- **Flujo PKCE:** ✅ Cambiado a `pkce`
- **Supabase rate limiting nativo:** Verificar configuración en dashboard (Auth > Rate Limits)
- **JWT expiry:** Manejado por Supabase (default 1h access token, refresh token con rotación)
- **Logout server-side:** Usa `supabase.auth.signOut()` que invalida el refresh token en el servidor
- **Password reset:** Tokens single-use manejados por Supabase

---

## A08:2021 — Software and Data Integrity Failures

### Verificaciones realizadas
- **package-lock.json:** ✅ Presente y commiteado
- **CI usa `npm ci`:** ✅ Confirmado en `.github/workflows/ci.yml`
- **Scripts externos sin SRI:** ✅ Sin instancias encontradas (`<script src="...">` externo)
- **CI ejecuta código no confiable:** ✅ No — solo `npm ci`, `npm test`, `npm run build`
- **Estado:** ✅ SIN HALLAZGOS

---

## A09:2021 — Security Logging and Monitoring

### Hallazgo 9.1 — Sin logging estructurado de eventos de seguridad
- **Severidad:** MEDIA
- **Descripción:** No existía un módulo de logging específico para eventos de seguridad (intentos de login fallido, accesos 401/403, acciones administrativas).
- **Fix:** Creado `src/lib/security-logger.ts` con función `logSecurityEvent()` que emite JSON estructurado a console (recogido por Vercel logs y Sentry).
- **Estado:** ✅ RESUELTO (módulo base — integración en flujos individuales como deuda de baja prioridad)

### Verificaciones adicionales
- **Sentry configurado:** ✅ `sentry.client.config.ts`, `sentry.server.config.ts` presentes
- **PII en logs:** ✅ No se loguean passwords ni tokens en el código revisado

---

## A10:2021 — Server-Side Request Forgery (SSRF)

### Verificaciones realizadas
- **fetch() con parámetros de usuario:** ✅ Sin instancias en `src/app/api/`
- **axios/http.get con parámetros de usuario:** ✅ N/A (no se usa axios)
- **IPs internas en requests:** ✅ Sin instancias
- **Estado:** ✅ SIN HALLAZGOS

---

## Archivos modificados en esta auditoría

| Archivo | Cambio |
|---------|--------|
| `src/app/actions/authActions.ts` | NUEVO — loginAction + logoutAction con rate limiting |
| `src/app/api/activity/[activityId]/route.ts` | Whitelist regex anti-path-traversal |
| `src/app/api/curriculum/[levelGrade]/route.ts` | Whitelist regex anti-path-traversal |
| `src/app/api/test-sentry/route.ts` | Bloqueo 403 en producción |
| `src/app/log-in/page.tsx` | Cookie: `Secure; SameSite=Strict` |
| `src/lib/supabase-browser.ts` | `flowType: 'pkce'` |
| `src/lib/rate-limiter.ts` | Función genérica `rateLimit({ key, max, windowMs })` |
| `src/lib/security-logger.ts` | Campos `email`, `action`; tipo `logout_success` añadidos |
| `src/proxy.ts` | CSP header + rate limit hook + HSTS siempre |
| `src/app/hello/page.tsx` | ELIMINADO |
| `scripts/audit-rls.ts` | NUEVO — script de auditoría RLS |
| `.gitignore` | Añadido `docs/CREDENCIALES*.md` |
| `package-lock.json` | Actualizado (npm audit fix) |
