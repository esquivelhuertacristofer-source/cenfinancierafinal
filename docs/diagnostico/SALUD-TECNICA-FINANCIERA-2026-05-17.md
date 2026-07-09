# Diagnóstico de Salud Técnica — CEN Educación Financiera
**Fecha:** 2026-05-17
**Auditor:** Claude Sonnet 4.6 (diagnóstico automatizado, solo lectura)
**Repo local:** `cen-financiera-cierre-100-2026-05-11-1916`
**Repo GitHub:** `esquivelhuertacristofer-source/cenfinancierafinal`
**Estado del repo:** 25 commits, rama `main`, up to date con origin

---

## Resumen Ejecutivo

| Severidad | Cantidad | Descripción breve |
|-----------|----------|-------------------|
| 🔴 CRÍTICO | 3 | Sentry no operativo, `super_admin` sin constraint en DB, signOut no usa logoutAction |
| 🟠 ALTO | 6 | No hay `.env.example`, CI sin lint, CI sin coverage, build logs trackeados en git, índices DB no aplicados, `dev-verify.log` sin ignorar |
| 🟡 MEDIO | 7 | README obsoleto, `as any` × 19, 5 archivos >500 líneas, academia stubs sin nota al usuario, role constraint mismatch, logoutAction no adoptada en 4 lugares, NO staging env |
| 🔵 BAJO | 5 | Next.js 16.1.6 → 16.2.6 disponible, `security_triggers.sql` sin verificar aplicación, `migration_v2.sql` sin gestión formal, jspdf en producción sin verificar, `INSTITUTIONAL_EMAIL_DOMAIN` sin documentar |
| ⚪ OBSERVACIÓN | 4 | 5 build logs históricos trackeados, docs/ muy voluminoso, `_pre-fix-backup-fase2/` sin limpiar, test `--passWithNoTests` en CI |

### Top 5 problemas más serios

1. **Sentry no tiene DSN → monitoreo de producción es 100% ciego.** Está configurado en el código, instalado, en CI se pasa DSN vacío, pero nadie lo ha activado. Errores en producción son completamente invisibles.
2. **`super_admin` existe en código pero NO en el CHECK constraint de la DB.** `requireAdminSession()` acepta `super_admin` como rol válido, pero la tabla `profiles` tiene `CHECK (role IN ('student', 'teacher', 'admin'))`. Cualquier intento de crear un `super_admin` via SQL rompería el constraint. Es un bug de schema vs código latente.
3. **4 signOut directos al SDK de Supabase + logoutAction ignorada.** Se creó `logoutAction()` como parte de SEC-003, se integró en `authActions.ts`, pero los 4 lugares donde se hace logout real (`admin/usuarios`, `dashboard/page`, `hub/page`, `Sidebar`) siguen llamando `supabase.auth.signOut()` directamente. El logging de `logout_success` nunca se dispara en producción.
4. **CI no corre lint — errores de ESLint llegan silenciosamente a producción.** El workflow tiene `test` y `build` pero no `lint`. El build usa `ignoreBuildErrors: false` pero ESLint no bloquea ningún PR.
5. **No existe `.env.example` — incorporar a un desarrollador nuevo requiere adivinar variables.** Hay 6 variables de entorno requeridas, una de ellas (`SUPABASE_SERVICE_ROLE_KEY`) es un secreto de alta sensibilidad, y ninguna está documentada con formato `.env.example`.

### Nivel general: **6.5 / 10**

**Justificación:** La base estructural es sólida (TypeScript strict, App Router correcto, RLS aplicado, 80 tests pasando, build reproducible). Las deudas OWASP más graves fueron cerradas. Sin embargo, el sistema de monitoreo está roto (Sentry sin DSN), el CI es incompleto (sin lint, sin coverage gates), y hay inconsistencias entre código y schema DB que son bombas de tiempo silenciosas. Para una plataforma que maneja datos de menores de edad, el nivel actual es aceptable para piloto pero requiere trabajo antes de producción real.

---

## Hallazgos por Categoría

---

### 1. Pipeline y Deploy

#### ✅ Lo que está bien
- CI en GitHub Actions ejecuta `npm ci && npm test && npm run build` en cada push a `main`
- Build falla si TypeScript falla (`ignoreBuildErrors` eliminado en Sprint 3)
- Vercel auto-deploya en push a `main`
- `npm ci` garantiza reproducibilidad de dependencias

#### ❌ Lo que está mal

**[ALTO] CI no corre lint.**
```yaml
# ci.yml — hay test + build, pero NO hay paso de lint
jobs:
  test: ...
    run: npm test -- --ci --passWithNoTests
  build: ...
    run: npm run build
# ← no hay: npm run lint
```
ESLint puede tener errores o warnings nuevos y ningún PR falla por eso.

**[ALTO] CI corre tests con `--passWithNoTests`.**
```yaml
run: npm test -- --ci --passWithNoTests
```
Si todos los archivos de test se borraran accidentalmente, el CI pasaría en verde. Supuesto no validado: "si el CI pasa, los tests corrieron".

**[MEDIO] CI no corre con coverage ni hay thresholds.**
`jest.config.ts` define `collectCoverageFrom` pero el CI no pasa `--coverage`. Los thresholds no se evalúan en CI. Coverage real medido manualmente hoy: **35.4% statements, 28.1% branches, 21.6% functions**. Esto no bloquea ningún merge.

**[BAJO] No hay healthcheck post-deploy ni rollback automático.**
Vercel despliega y no hay verificación de que la app responde después del deploy. Si el deploy rompe algo en runtime (ej. variable de entorno faltante), nadie se entera hasta que un usuario lo reporta.

**[BAJO] No hay staging environment.**
Todo push a `main` va directo a producción. Confirmado en `DEUDA-TECNICA.md` como deuda conocida.

#### Requiere decisión humana
- ¿Se agrega lint al CI o se acepta la deuda? (Hay muchos warnings pre-existentes que fallarían si lint fuera bloqueante — ver categoría 6)
- ¿Se crea un Vercel Preview environment para PRs?

---

### 2. Sincronización Entorno Local vs Producción

#### ✅ Lo que está bien
- `.gitignore` excluye correctamente `.env*`
- `.env.local` nunca fue commiteado (verificado en git history)
- La `service_role key` nunca apareció en commits (solo como `${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}` en CI y referencias en docs de texto)

#### ❌ Lo que está mal

**[ALTO] No existe `.env.example`.**
Las 6 variables de producción requeridas son:
```
NEXT_PUBLIC_SUPABASE_URL         # en .env.local ✓
NEXT_PUBLIC_SUPABASE_ANON_KEY    # en .env.local ✓
SUPABASE_SERVICE_ROLE_KEY        # en .env.local ✓ — SECRETO ALTO VALOR
NEXT_PUBLIC_SENTRY_DSN           # ← NO EN .env.local (vacío en CI)
INSTITUTIONAL_EMAIL_DOMAIN       # ← NO EN .env.local (tiene default hardcodeado)
NODE_ENV                         # implícito
```
`NEXT_PUBLIC_SENTRY_DSN` no está en `.env.local` ni documentado. `INSTITUTIONAL_EMAIL_DOMAIN` tampoco (usa `"cenfinanciera.com"` como default silencioso).

**[ALTO — véase Cat. 7] Sentry DSN ausente en .env.local y en Vercel (inferido).**
La variable `NEXT_PUBLIC_SENTRY_DSN` no aparece en `.env.local`. En CI se setea explícitamente como `''`. Sentry está configurado con `enabled: process.env.NODE_ENV === 'production'`, lo que significa que en Vercel (que sí es NODE_ENV=production) intentará inicializar con DSN vacío — lo que silenciosamente deshabilita el monitoreo.

**[BAJO] README documenta variables incompletas.**
`README.md` lista solo 2 variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). `SUPABASE_SERVICE_ROLE_KEY` e `INSTITUTIONAL_EMAIL_DOMAIN` no están mencionadas.

#### Requiere decisión humana
- ¿Se crea un `.env.example` con todos los valores requeridos (sin valores reales)?
- ¿El `INSTITUTIONAL_EMAIL_DOMAIN` default debería ser vacío (fallar ruidoso) en lugar de `"cenfinanciera.com"` (fallar silencioso)?

---

### 3. Estado de la Rama `main`

#### ✅ Lo que está bien
- Rama sincronizada con origin (0 commits behind/ahead)
- `.env.local` correctamente untracked
- `_pre-fix-backup-fase2/` untracked (excluido vía `.gitignore`)
- No hay archivos `.pem`, `.key`, o credenciales reales trackeados

#### ❌ Lo que está mal

**[ALTO] 5 build logs trackeados en git en `docs/`.**
```
docs/_build-check-alumnos.log     ← trackeado, 4858 bytes
docs/_build-check-etapa3b.log     ← trackeado, 4858 bytes
docs/_build-check-limpieza.log    ← trackeado, 4858 bytes
docs/_build-final-restored.log    ← trackeado, 4858 bytes
docs/_build-hub-fix.log           ← trackeado, 4858 bytes
```
El `.gitignore` tiene `_build-*.log` pero estos archivos están en `docs/_build-*.log` — el patrón en `.gitignore` aplica a la raíz, no a subdirectorios. Están efectivamente trackeados. Contenido: outputs de builds de desarrollo, sin valor histórico.

**[ALTO] `dev-verify.log` untracked pero sin ignorar.**
El archivo `dev-verify.log` aparece como untracked en `git status` pero no está en `.gitignore`. Si alguien hace `git add .`, se commitea accidentalmente.

**[MEDIO] `docs/CREDENCIALES_MAESTRAS.md` existe en disco con credenciales.**
El archivo está en `.gitignore` (`docs/CREDENCIALES*.md`) y NO está trackeado. Sin embargo, existe en disco con el anon key activo y la URL del proyecto. Si alguien cambia accidentalmente el patrón en `.gitignore`, se commitea. La anon key en este archivo es **la misma** que está en `.env.local` y en git history (commit `eca456b`). No hay confirmación de que se rotó.

**[OBSERVACIÓN] `docs/` tiene 30+ archivos trackeados de sprint reports, auditorías, logs históricos.**
La mayoría son documentos legítimos de proyecto. Pero el directorio es ruidoso y podría contener datos sensibles en alguno de ellos. No se revisaron todos.

---

### 4. Dependencias

#### ✅ Lo que está bien
- `package-lock.json` presente y commiteado
- CI usa `npm ci` (reproducible)
- `ignoreBuildErrors: false` (TypeScript real en build)
- No hay `@ts-ignore` ni `@ts-nocheck` en código de producción (verificado)

#### ❌ Lo que está mal

**[CRÍTICO — categorizado en Cat. 7/Seg] `super_admin` no está en el constraint de DB — ver Cat. 5.**

**[ALTO] Next.js 16.1.6 tiene 19 CVEs según `npm audit`.**
```
next  9.3.4-canary.0 - 16.3.0-canary.5
- GHSA-26hh-7cqf-hhc6 — Middleware bypass (ya documentado como SEC-009)
- GHSA-vfv6-92ff-j949 — Cache poisoning
- GHSA-mg66-mrh9-m8jx — DoS via Server Components
- GHSA-ffhc-5mcf-pf4q — XSS en CSP nonces ← NUEVO, relevante para SEC-006
- GHSA-492v-c6pp-mqqv — Middleware bypass vía dynamic route parameter
- ...y 14 más
```
Fix disponible: `npm audit fix --force` instala `next@16.2.6`. Total actual: **2 vulnerabilidades** (1 high en next, 1 moderate en postcss).

**[MEDIO] 13 paquetes desactualizados.**
Notable: `next@16.1.6` (16.2.6 disponible, resuelve CVEs), `@supabase/supabase-js@2.98.0` (2.105.4 disponible — 7 versiones menores), `react@19.2.3` (19.2.6 disponible).

**[BAJO] `jspdf@4.2.1` en `dependencies` (no devDependencies).**
Se usa solo para generación de PDFs de credenciales en el cliente (`admin/usuarios` y `dashboard/teacher/alumnos`). Es una dependencia de producción legítima, pero es una librería pesada (~300KB) que podría cargarse lazy si el feature no es crítico.

#### Requiere decisión humana
- ¿Se actualiza Next.js a 16.2.6? (Resuelve CVEs, potencialmente breaking changes menores)
- El aviso `GHSA-ffhc-5mcf-pf4q` ("XSS en CSP nonces") podría afectar la implementación de SEC-006. Requiere revisión.

---

### 5. Base de Datos

#### ✅ Lo que está bien
- RLS habilitado en todas las tablas conocidas: `profiles`, `lessons`, `lesson_contents`, `user_progress`, `progress`, `grupos`, `alumnos_grupos`, `intentos`
- Políticas cubren SELECT/INSERT/UPDATE/DELETE (algunas via `FOR ALL`)
- Trigger `handle_new_user` para auto-creación de perfil
- `security_triggers.sql` versionado (trigger `protect_sensitive_profile_fields` documentado)
- Grupo piloto y cuentas confirmadas como aplicadas (según `CREDENCIALES-FINANCIERA-PILOTO-001.md`, verificado programáticamente 2026-05-11)
- Índices documentados en `supabase/indexes.sql`

#### ❌ Lo que está mal

**[CRÍTICO] `super_admin` no existe en el CHECK constraint de `profiles.role`.**
```sql
-- supabase/schema.sql (línea 18):
CHECK (role IN ('student', 'teacher', 'admin'))
-- migration_v2.sql (línea 9):
CHECK (role IN ('student', 'teacher', 'admin'))
```
Pero en `src/lib/supabase-server.ts`:
```ts
if (!['admin', 'super_admin'].includes(profile.role)) throw new Error('FORBIDDEN')
return { ..., isSuperAdmin: profile.role === 'super_admin' }
```
Intentar insertar un usuario con `role='super_admin'` violaría el constraint. La feature es dead code — nunca puede funcionar con el schema actual. **Decisión requerida.**

**[ALTO] `supabase/indexes.sql` generado pero pendiente de aplicar en producción.**
Confirmado en `DEUDA-TECNICA.md` (ítem #2). Sin estos índices, queries de progreso y grupos hacen full table scan. A escala pequeña es invisible; con 100+ usuarios activos empieza a ser perceptible.

**[MEDIO] 3 archivos SQL en `supabase/` sin gestión formal de migraciones.**
`schema.sql` = schema inicial, `migration_v2.sql` = parche v2, `migrations/institutional_full.sql` = sprint institucional. No hay herramienta de migración (Supabase CLI, Flyway, etc.). No hay certeza de qué archivos están aplicados en producción sin revisar el dashboard manualmente. Los archivos son `IF NOT EXISTS` / `OR REPLACE`, entonces son re-ejecutables, pero la trazabilidad es nula.

**[BAJO] `security_triggers.sql` capturado pero sin confirmación de que es el estado actual de producción.**
`DEUDA-TECNICA.md` ítem #1 dice "existe en Supabase pero no en código". El archivo fue generado/versionado en Sprint 3, pero no hay confirmación de que coincide con lo que realmente está en la DB hoy.

#### Requiere decisión humana
- ¿Se agrega `super_admin` al CHECK constraint, o se elimina del código?
- ¿Se ejecuta `indexes.sql` en producción? (No es destructivo, solo agrega índices)
- ¿Se adopta Supabase CLI para gestión formal de migraciones?

---

### 6. Estructura del Código

#### ✅ Lo que está bien
- `tsconfig.json` con `"strict": true` — TypeScript strict mode activado
- No hay `@ts-ignore` ni `@ts-nocheck` en código de producción
- `next.config.ts` sin `ignoreBuildErrors` — build falla en errores TypeScript reales
- Estructura de carpetas clara y consistente con App Router
- `src/data/` con JSONs de actividades y currículum bien organizados

#### ❌ Lo que está mal

**[ALTO] ESLint con errores pre-existentes en archivos de producción.**
12 archivos tienen `as any`, con 19 instancias totales. El CI no corre lint (ver Cat. 1). Archivos más afectados: `src/lib/hub.ts`, `src/app/hub/page.tsx`, `src/app/dashboard/teacher/alumnos/page.tsx`.

**[MEDIO] 5 archivos >500 líneas.**
```
src/app/hub/page.tsx                          1253 líneas
src/components/hub/ContentModal.tsx            845 líneas
src/app/dashboard/teacher/alumnos/page.tsx     780 líneas
src/lib/hub.ts                                 731 líneas
src/app/admin/usuarios/page.tsx                590 líneas
```
`hub/page.tsx` a 1253 líneas es un god component. Difícil de testear, refactorizar o revisar.

**[MEDIO] `signOut` disperso en 4 lugares sin pasar por `logoutAction`.**
```
src/app/admin/usuarios/page.tsx:66    ← supabase.auth.signOut() directo
src/app/admin/usuarios/page.tsx:292   ← supabase.auth.signOut() directo
src/app/dashboard/page.tsx:64         ← supabase.auth.signOut() directo
src/app/hub/page.tsx:538              ← supabase.auth.signOut() directo
src/components/dashboard/Sidebar.tsx:154 ← supabase.auth.signOut() directo
```
`logoutAction()` en `authActions.ts` existe y loguea `logout_success`, pero nadie la llama. El evento de logout nunca se registra en producción.

**[BAJO] README referencia `src/lib/supabase.ts` (no existe).**
```markdown
# README.md línea 96:
│   ├── supabase.ts         # Cliente Supabase
```
El cliente real está en `src/lib/supabase-browser.ts` y `src/lib/supabase-server.ts`. Staleness de docs.

**[BAJO] README documenta comando no válido.**
```bash
# README.md línea 43:
npx next build --webpack
```
Next.js 16 Turbopack no tiene flag `--webpack`. El comando falla con error. Un desarrollador nuevo intentándolo se confunde.

**[OBSERVACIÓN] Academia pages tienen contenido real (200+ líneas cada una) aunque README las llama "stubs".**
26 páginas de academia están construidas con contenido HTML estático real. No son stubs. README y DEUDA-TECNICA.md dicen que "son stubs sin contenido" — esto es contradictorio con la realidad. Estas páginas son estáticas (no usan el sistema de actividades del hub), no tienen analytics de progreso, y probablemente no están integradas al flujo pedagógico.

---

### 7. Tests

#### ✅ Lo que está bien
- 80 tests pasando, 8 suites
- Tests de acceso a Server Actions (control de acceso real)
- Tests de `requireAdminSession` con 100% cobertura de ese módulo
- `jest.config.ts` tiene `collectCoverageFrom` configurado

#### ❌ Lo que está mal

**[ALTO] Coverage real: 35.4% statements / 28.1% branches / 21.6% functions.**
```
Statements   : 35.37% ( 266/752 )
Branches     : 28.13% ( 186/661 )
Functions    : 21.6%  ( 35/162 )
Lines        : 38.23% ( 252/659 )
```
Nota: `collectCoverageFrom` solo cubre `src/lib/**/*.ts` y `src/app/actions/**/*.ts` y `src/components/dashboard/**/*.tsx`. Si se expandiera a toda la app, el porcentaje sería mucho menor.

**[ALTO] CI no corre con `--coverage` y no hay thresholds que fallen el build.**
El jest.config no tiene `coverageThreshold`. El CI corre `npm test -- --ci --passWithNoTests` sin `--coverage`. Si la cobertura cae a 0%, el CI sigue verde.

**[ALTO] `--passWithNoTests` en CI es una bandera roja.**
Si los archivos de test se borraran, el CI reportaría "0 tests, passed". Este flag debería no estar en CI.

**[MEDIO] Hub/page.tsx (1253 líneas) y ContentModal.tsx (845 líneas) sin ningún test.**
Estos son los componentes más complejos de la app. La lógica de progreso del hub, el SyncEngine, y el sistema de actividades no tienen cobertura de tests.

**[BAJO] Test de flujo institucional (`flow-institucional.test.ts`) usa `it.skip` — verificar.**
El archivo aparece en los resultados del grep de `it.skip`. Si hay tests deshabilitados, podrían enmascarar comportamientos rotos.

---

### 8. Seguridad

#### ✅ Lo que está bien
- OWASP Top 10 (2021) auditado y 20/23 hallazgos resueltos en código
- JWT proxy con `@supabase/ssr` (reemplaza cookie forgeable)
- `requireAdminSession()` en todas las Server Actions admin
- Nonce-based CSP en proxy.ts (pendiente validación en browser)
- No hay credenciales reales en git history (`.env.local` nunca commiteado, `service_role` nunca expuesta)
- `.gitignore` excluye `docs/CREDENCIALES*.md`
- `mathjs` reemplazó `new Function()` (SEC-005)

#### ❌ Lo que está mal

**[CRÍTICO] Sentry sin DSN = monitoreo en producción inoperativo.**
Sentry está instalado, configurado, con `enabled: process.env.NODE_ENV === 'production'`. Pero `NEXT_PUBLIC_SENTRY_DSN` no está en `.env.local` y en CI se pasa como `''`. Si tampoco está en las variables de Vercel (inferido — no se puede verificar sin acceso al dashboard), los errores de producción son completamente invisibles.

**[ALTO] Anon key activa en git history (commit `eca456b`).**
El commit `eca456b` (`fix(security): OWASP Top 10 audit`) contiene en su diff la anon key completa dentro del documento `CREDENCIALES_MAESTRAS.md`. El archivo fue removido del tracking pero el historial persiste. Acción documentada como SEC-007, pendiente rotación manual por usuario.

**[MEDIO] 4 lugares con `supabase.auth.signOut()` directo no usan `logoutAction`.**
No es un riesgo de seguridad per se (signOut invalida tokens en Supabase correctamente), pero los eventos de seguridad `logout_success` nunca se registran, lo que degrada el logging.

**[MEDIO] `/api/activity/[activityId]` y `/api/curriculum/[levelGrade]` son públicos sin auth.**
```ts
// src/app/api/activity/[activityId]/route.ts
// No hay verificación de sesión — cualquier request anónima retorna datos
```
Los datos son JSONs del repositorio (públicos de facto), pero el endpoint podría ser enumerado para scraping. La decisión de si requieren auth es de producto.

**[BAJO] Demo credentials en `README.md` son incorrectas.**
```markdown
| `profesor.prueba@cen.edu` | `diamondmaster` | teacher |
| `estudiante.prueba@cen.edu` | `diamondmaster` | student |
```
Las cuentas reales en `CREDENCIALES_MAESTRAS.md` tienen password `password123`, no `diamondmaster`. El README público en GitHub tiene credenciales que probablemente no funcionan — o si funcionan, es una exposición de credenciales.

#### Requiere decisión humana
- ¿Se activa Sentry con un DSN real en Vercel?
- ¿Las API de actividades/currículum deberían requerir auth?
- ¿Se rotan las demo credentials? ¿Se documenta en README cuál es la fuente de verdad?

---

### 9. Datos y Contenido

#### ✅ Lo que está bien
- 364 actividades JSON en `src/data/actividades/` (content is rich)
- Grupo piloto `GRUPO-FINANCIERA-PILOTO-001` creado y verificado (2026-05-11)
- 10 cuentas de alumno + 1 profesor creados y verificados
- Trigger `handle_new_user` funcionando para auto-populación

#### ❌ Lo que está mal

**[ALTO] Estado de cuentas demo DESCONOCIDO actualmente.**
Las cuentas se crearon el 2026-05-11. No hay certeza de que:
- Las cuentas aún existen en Supabase (no se hizo reset)
- Las contraseñas no fueron cambiadas
- El grupo piloto sigue asignado
No se pudo verificar (requeriría acceso al dashboard o llamadas a la API).

**[MEDIO] `seeds.sql` no existe — datos demo no son idempotentes ni reproducibles.**
Las cuentas del piloto se crearon manualmente vía `onboardInstitutionalUsers`. Si la DB se resetea, no hay manera automatizada de recrearlos.

**[MEDIO] Academia (26 páginas) tiene contenido estático independiente del sistema pedagógico.**
Las páginas de academia son HTML estático, sin integración con el sistema de actividades del hub, sin progreso tracking, sin autenticación requerida. Su estado respecto a los datos esperados es desconocido.

---

### 10. Documentación

#### ✅ Lo que está bien
- `README.md` existe en raíz con estructura básica
- `docs/AUDITORIA-OWASP-FINANCIERA.md` actualizado y completo
- `docs/SEGURIDAD-PENDIENTES.md` actualizado
- `docs/DEUDA-TECNICA.md` honesto sobre las deudas
- `supabase/schema.sql` + migraciones versionadas

#### ❌ Lo que está mal

**[MEDIO] README con 3 errores de hecho.**
1. `src/lib/supabase.ts` no existe (es `supabase-browser.ts` + `supabase-server.ts`)
2. `npx next build --webpack` no es un comando válido en Next.js 16
3. Demo credentials (`diamondmaster`) probablemente incorrectas

**[MEDIO] Variables de entorno documentadas de forma incompleta.**
README lista 2 vars, se requieren 6. `SUPABASE_SERVICE_ROLE_KEY` e `INSTITUTIONAL_EMAIL_DOMAIN` no están mencionadas.

**[BAJO] No hay documentación de arquitectura ni de flujo de datos.**
`docs/MANUAL-TECNICO.md` existe — no fue revisado en detalle. `docs/DESIGN_STYLE_GUIDE.md` existe. Pero no hay documentación del flujo de autenticación post-migración a `@supabase/ssr`, ni del SyncEngine, ni del sistema de actividades.

**[OBSERVACIÓN] `docs/` tiene 5 build logs históricos trackeados que polutan el historial.**
Ver categoría 3.

---

### 11. Operación

#### ✅ Lo que está bien
- `src/lib/security-logger.ts` existe con `logSecurityEvent()`
- Logging de login/logout en `authActions.ts` (para los casos que lo usan)
- Vercel Analytics integrado
- `@sentry/nextjs` instalado y configurado con replica correcta

#### ❌ Lo que está mal

**[CRÍTICO] Sentry sin DSN → 0% visibilidad de errores en producción.**
La config está en `sentry.client.config.ts` y `sentry.server.config.ts`. `enabled: process.env.NODE_ENV === 'production'` está correcto. Pero sin DSN, Sentry se inicializa sin destino. Los errores no van a ningún lado.

**[ALTO] Security logger no integrado en admin actions ni API routes.**
`logSecurityEvent()` solo se llama desde `authActions.ts` (login/logout). `requireAdminSession()` que lanza `UNAUTHORIZED`/`FORBIDDEN` no loguea. Los API routes que retornan 403 no loguean.

**[ALTO] `signOut` en 4 lugares no usa `logoutAction` → logout no se loguea.**
Ver Categoría 8.

**[BAJO] No hay backups verificados de DB.**
Supabase tiene backups automáticos en el plan gratuito (point-in-time recovery limitado), pero no hay documentación de política de backups, frecuencia, ni procedimiento de restore.

**[BAJO] Capacidad estimada: desconocida.**
La app usa Supabase free tier (inferido — no hay mención de plan paid). Límites del free tier: 500MB storage, 2GB bandwidth/mes, 50MB DB. Para un piloto pequeño es suficiente. Para escala, requiere evaluación.

---

## Mapa de Cosas Latentes (Bombas de Tiempo)

| # | Problema | Probabilidad | Impacto | Cuándo abordar |
|---|----------|-------------|---------|----------------|
| 1 | **Sentry sin DSN** — errores de prod invisibles | Alta (ya está roto) | Alto — bug grave puede estar activo hoy | URGENTE |
| 2 | **`super_admin` en código pero no en DB** — feature rota | Media (si se intenta usar) | Alto — error de constraint en prod | Pre-producción |
| 3 | **Next.js 16.1.6 CVEs** — middleware bypass activo | Media | Alto — bypass de auth en app con datos de menores | Antes del próximo sprint |
| 4 | **`--passWithNoTests` en CI** — tests pueden desaparecer sin alerta | Baja | Medio — pérdida de red de seguridad silenciosa | Próximo sprint |
| 5 | **Índices DB no aplicados** — performance degradará con escala | Media | Medio — timeouts a 500+ usuarios | Pre-demo/escala |
| 6 | **4 signOut directos** — logging incompleto | Alta (ya está mal) | Bajo — logs de seguridad incompletos | Próximo sprint |
| 7 | **CSP nonce sin validar en browser** — puede romper hidratación Next.js | Media (depende de Turbopack) | Alto — app blanca para todos los usuarios | Antes del próximo deploy |
| 8 | **Rate limiter in-memory** — bypass en multi-instancia | Baja (poco tráfico) | Medio — bruteforce efectivo a escala | Pre-producción real |
| 9 | **Demo credentials inconsistentes en README** — nuevos devs confundidos | Alta | Bajo | Próximo sprint |
| 10 | **Anon key en git history** — rotación pendiente | Baja (anon key es pública) | Bajo real | Cuando haya tiempo |

---

## Hallazgos Comparables al Diagnóstico de Bachillerato

En el diagnóstico de Bachillerato se detectaron: deploy nunca ejecutado, seeds no aplicados, assets faltantes en git, coverage no medido en CI, monitoring configurado pero no implementado.

### Análogo exacto: monitoring configurado pero no implementado
**Sentry está completamente configurado en el código — y completamente inoperativo porque no tiene DSN.** Este es idéntico al patrón de Bachillerato: se implementó la infraestructura de monitoreo pero nunca se terminó la integración real.

### Análogo parcial: coverage no medido en CI
El CI de Financiera corre los tests pero sin coverage. El número de 80 tests es real, pero la cobertura del 35% es un supuesto no validado en CI.

### Diferencia crítica vs Bachillerato: el deploy SÍ está ejecutado
A diferencia de Bachillerato, Financiera sí tiene deploy en producción (Vercel, auto-deploy). El mayor riesgo aquí no es "nunca fue a producción" sino "fue a producción con monitoring roto".

---

## Contradicciones con Reportes Previos

| Reporte previo | Afirmación | Realidad actual |
|----------------|-----------|-----------------|
| `DEUDA-TECNICA.md` | "src/app/academia/**` — páginas son stubs sin contenido" | Las 26 páginas de academia tienen entre 200-253 líneas de contenido HTML real |
| `README.md` | Demo password: `diamondmaster` | `CREDENCIALES_MAESTRAS.md` dice `password123` — una de las dos está mal |
| `DEUDA-TECNICA.md` ítem #10 | "Sin tests automatizados" (pre-sprint) | Hay 80 tests (post-sprint OWASP), pero el doc no fue actualizado |
| `SEGURIDAD-PENDIENTES.md` | SEC-006 (CSP nonce) marcado como "✅ Resuelto" | Marcado correctamente pero con nota "requiere validación en browser" — no verificado en runtime |
| `REPORTE-SPRINT3-CLAUDE.md` (inferido) | Sentry "configurado" | Configurado en código, pero sin DSN = no operativo |

---

## Opinión Honesta

### ¿Cuán sólida está la base?

**Sólida para un piloto controlado, insuficiente para producción con usuarios reales.**

El core técnico es correcto: TypeScript strict, App Router, RLS, tests, build reproducible. Las decisiones arquitecturales son buenas. Lo que falta son las capas operacionales: monitoring, CI completo, gestión formal de migraciones, staging environment.

### ¿Qué priorizaría arreglar antes de cualquier otra cosa?

1. **Sentry DSN** (30 minutos) — sin esto, cualquier bug de producción es invisible
2. **CSP nonce validación en browser** (1 hora con acceso al deploy) — antes del próximo deploy
3. **Actualizar Next.js a 16.2.6** (1-2 horas) — resuelve el CVE de middleware bypass
4. **Añadir lint al CI + quitar `--passWithNoTests`** (30 minutos) — red de seguridad real
5. **Resolver `super_admin` inconsistency** (30 minutos) — agregar a constraint o eliminar del código
6. **Integrar `logoutAction`** en los 4 lugares (1 hora) — logging completo

### ¿Hay algo que recomendaría PARAR para arreglar primero?

No recomendaría parar el desarrollo actual, pero sí **no deployar nuevas features hasta que Sentry tenga DSN activo**. Deployar features sobre monitoring roto es construir sobre arena — si algo se rompe en producción, no hay forma de saberlo hasta que un usuario lo reporta.

El segundo blocker pre-deploy es la **validación del CSP nonce en browser**. Si los scripts de hidratación de Next.js quedan bloqueados por la CSP, la app entrega una pantalla blanca a todos los usuarios. Esto se introdujo en la sesión de hoy y no fue verificado en runtime.

---

## Acciones Manuales Pendientes del Usuario (ordenadas por urgencia)

1. **URGENTE** — Activar Sentry: crear DSN real → agregar `NEXT_PUBLIC_SENTRY_DSN` a Vercel env vars
2. **PRE-DEPLOY** — Verificar CSP nonce en browser con staging deploy (abrir DevTools → Console → buscar errores CSP)
3. **IMPORTANTE** — Ejecutar `supabase/indexes.sql` en Supabase Dashboard → SQL Editor
4. **IMPORTANTE** — Rotar anon key en Supabase Dashboard (SEC-007)
5. **IMPORTANTE** — Decidir: `super_admin` en DB constraint o eliminar del código
6. **RECOMENDADO** — Actualizar Next.js a 16.2.6 (`npm install next@16.2.6`)
7. **RECOMENDADO** — Verificar contraseñas de cuentas demo y actualizar README
