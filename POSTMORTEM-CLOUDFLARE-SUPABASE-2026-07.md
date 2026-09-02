# Postmortem: migración y optimización Cloudflare + Supabase — CEN Financiera (julio 2026)

Documento de lecciones aprendidas para la **próxima plataforma educativa** que se construya sobre el mismo stack (Next.js + Supabase + Cloudflare Workers vía OpenNext). Objetivo: que la próxima vez esta optimización tome días, no semanas.

Stack de referencia en este proyecto: Next.js 16.2.9 (App Router), React 19.2.3, `@opennextjs/cloudflare` 1.20.1, Wrangler 4.107, Supabase (`@supabase/ssr`).

---

## 1. Qué se hizo (cronología resumida)

1. **Migración forzada Vercel → Cloudflare** (2026-07-08): se perdió el acceso a la cuenta de Vercel de producción. El DNS de los dominios estaba en Hostinger, independiente de esa cuenta, así que la migración fue viable sin tiempo de inactividad de dominio.
2. **Adaptación a Workers**: instalación de `@opennextjs/cloudflare` + Wrangler, forzar build con webpack, mover los ~4 MB de JSON de currículo/actividades fuera del bundle del servidor hacia `public/` + binding `ASSETS`, eliminar Sentry/Vercel Analytics inertes, reducir el bundle final de 6.7 MB a 1.7 MB gzip (límite free: 3 MB gzip).
3. **Vinculación de dominio custom** y validación end-to-end con Playwright contra la URL real.
4. **Hardening de resiliencia** (13 ítems): que ninguna escuela quede bloqueada si Supabase satura su cuota o si Cloudflare falla — rate limiter, JWT local en middleware, modo `/practica` offline, banner de estado de Supabase, etc.
5. **Plan de reducción de consumo BD/backend** (4 fases, para que la cuenta gratuita de Supabase alcance para miles de alumnos reales): RPC de agregación en Postgres, deduplicación de intentos, batch de sync offline, cache compartido en cliente.
6. **Incidente crítico julio 2026**: alta de escuelas no asignaba bien roles/grupos (profesores quedaban con rol de alumno), un RPC crítico faltaba en producción, el currículo completo desapareció de `/hub` para todos los grados, y la tarjeta del juego bono aparecía duplicada. Todo corregido, verificado en vivo con Playwright autenticado, y desplegado.
7. **Deploy final bloqueado por un placeholder** (`RATE_LIMIT_KV` sin ID real en `wrangler.jsonc`) — namespace creado y referenciado, deploy verificado en producción real.

---

## 2. En qué nos equivocamos (causa raíz + cómo prevenirlo desde el diseño)

### 2.1 Bundle del Worker: imágenes de convención de metadata reventaron el límite de tamaño
**Qué pasó:** `opengraph-image.png`, `twitter-image.png`, `icon.png` puestos como archivos de convención dentro de `src/app/` se compilan como *rutas* con el PNG **incrustado en base64 dentro del propio Worker**. Esto solo, sin comprimir bien en gzip, representaba ~1.66 MB gzip — la mitad del límite free completo. Se encontró tras una auditoría byte a byte del bundle final, no fue obvio de entrada.
**Cómo prevenirlo:** en cualquier proyecto Next.js + OpenNext/Cloudflare, las imágenes de metadata (`opengraph-image`, `twitter-image`, `icon`, `apple-icon`) van **siempre** en `public/` con declaración explícita en `metadata` de `layout.tsx`, nunca como archivo-convención en `src/app/`. Regla de oro desde el día 1, no un hallazgo de auditoría tardía.

### 2.2 JSON de contenido importado en código de servidor
**Qué pasó:** ~4 MB de currículo/actividades importados directamente en módulos de servidor se empaquetaban dentro del Worker, contando contra el límite de 3 MB gzip.
**Cómo prevenirlo:** cualquier dataset de contenido "grande" (>100 KB) va en `public/` desde el inicio del proyecto y se lee vía el binding `ASSETS` (o fetch relativo), nunca `import`/`require` directo en código de servidor. Establecer esta convención en el `CLAUDE.md`/README del proyecto antes de escribir la primera línea de contenido.

### 2.3 `getAssetJson()` sin fallback — currículo vacío en producción
**Qué pasó:** la función que lee JSON de `public/data/` ramificaba en `if (NODE_ENV === 'development')` → filesystem, si no → **únicamente** binding `ASSETS` de Cloudflare, sin ningún fallback si `getCloudflareContext()` fallaba (throw silenciosamente capturado → `return null`). Cuando esa llamada fallaba en producción (consistente con una limitación conocida de OpenNext-Cloudflare: `getCloudflareContext()` depende de `AsyncLocalStorage` y puede perder el contexto de la request en ciertas rutas de ejecución), el resultado era `null` sin ningún aviso — el currículo de **todos los grados** desaparecía de `/hub` silenciosamente, sin error visible.
**Cómo prevenirlo:**
- Nunca ramificar una función de acceso a datos por `NODE_ENV`. En vez de eso: **intentar el camino primario (Cloudflare ASSETS) primero, y si falla por lo que sea, caer siempre a un fallback (filesystem)** — sin importar el entorno. Es el patrón que quedó implementado y es el que hay que copiar tal cual la próxima vez.
- Cualquier función que dependa de `null` como "no encontrado" necesita loguear el error real (no tragarlo en un `catch {}` vacío) para que un fallo así se detecte en horas, no cuando un usuario real se queja.
- Agregar un smoke test que corra contra el **deploy real** (no solo `wrangler dev` local) verificando que el contenido no esté vacío — esto se hizo recién al final, debería ser parte del pipeline de deploy desde el principio.

### 2.4 Tarjeta duplicada por refactor incompleto
**Qué pasó:** al añadir una tarjeta especial nueva ("JUEGO ESPECIAL CARD") en `/hub`, quedó sin eliminar el bloque JSX anterior que renderizaba lo mismo — duplicado visible para todos los usuarios.
**Cómo prevenirlo:** ningún fix de proceso especial aquí más allá de lo básico — revisar el diff completo (no solo el bloque añadido) antes de dar por cerrado un cambio de UI, y en componentes de layout grandes, preferir extraer la tarjeta a su propio componente con un único punto de renderizado en vez de JSX inline repetible.

### 2.5 Alta de escuelas: el trigger de Supabase no hacía lo que el código asumía
**Qué pasó:** el trigger `handle_new_user` de Supabase siempre crea el `profile` con `role = 'student'`, sin excepción. El código de alta de profesores solo actualizaba `escuela_id`, nunca sobreescribía `role`. El alta de alumnos asumía que el mismo trigger los insertaba en `alumnos_grupos` — no lo hace, solo crea el `profile`. Resultado: profesores con rol de alumno, alumnos sin membresía de grupo (invisibles para su profesor).
**Cómo prevenirlo:** cuando se depende de un trigger de base de datos para lógica de negocio (asignación de roles, membresías), **documentar explícitamente qué hace y qué NO hace el trigger** en el mismo archivo de migración SQL, y escribir un test de integración que dé de alta un usuario end-to-end y verifique el estado final en las tres tablas relevantes (`profiles`, `alumnos_grupos`, la de rol), no solo que el `insert` no lance error.

### 2.6 RPC de Postgres documentado en el repo pero nunca aplicado a producción
**Qué pasó:** `get_intentos_stats.sql` existía como plantilla en `supabase/migrations/` desde antes, pero nunca se ejecutó en el SQL Editor de producción. El código ya llamaba al RPC (`supabase.rpc(...)`), el error `PGRST202` (función no encontrada) se absorbía silenciosamente, y los alumnos veían "0/20" de avance permanentemente sin ningún error visible.
**Cómo prevenirlo:** este proyecto **no tiene ningún mecanismo de DDL automatizado contra producción** (sin `DATABASE_URL`, sin `pg`, sin CLI de Supabase vinculado, sin RPC `exec_sql`) — aplicar SQL a producción es siempre manual, vía Dashboard → SQL Editor. Dado eso: mantener una única checklist/README en `supabase/migrations/` con el estado de cada archivo (☐ pendiente de aplicar / ☑ aplicado en producción, con fecha), y revisarla como parte de cualquier deploy que agregue una migración nueva — no confiar en la memoria de que "seguro ya se aplicó". Además, cualquier llamada a un RPC debe loguear (no tragar) un `PGRST202`, porque ese código de error específico casi siempre significa "la migración nunca se aplicó", y detectarlo en logs ahorra semanas de "0/20 misterioso".

### 2.7 Placeholder de configuración bloqueó el deploy final
**Qué pasó:** `wrangler.jsonc` traía `{ "binding": "RATE_LIMIT_KV", "id": "REPLACE_WITH_REAL_KV_NAMESPACE_ID" }` con un comentario explicando cómo arreglarlo — pero el deploy se intentó sin haber corrido ese paso, y falló con error 10042 de la API de Cloudflare.
**Cómo prevenirlo:** un placeholder de este tipo nunca debería poder llegar a `git push` a la rama principal sin al menos una advertencia automatizada. La próxima vez: un script `predeploy` (npm `pre` hook o chequeo en el propio `cf:deploy`) que haga `grep -r "REPLACE_WITH\|PLACEHOLDER\|TODO_REPLACE"` sobre los archivos de config de Cloudflare y aborte el deploy si encuentra alguno, en vez de descubrirlo tras un build completo de ~1-2 minutos.

### 2.8 Verificación local insuficiente para bugs específicos de Cloudflare Workers
**Qué pasó:** el bug del currículo vacío (2.3) solo se manifiesta cuando el camino primario de `getCloudflareContext()` falla — algo que **no se reproduce corriendo `next dev` en local** (que usa Node plano, rama de desarrollo del código viejo) ni necesariamente con `wrangler dev` (que sí tiene el binding real). El bug se coló hasta producción real con escuelas reales.
**Cómo prevenirlo:** para cualquier función que dependa de un binding específico de Cloudflare (`ASSETS`, KV, D1, etc.), diseñarla con fallback desde el primer commit (ver 2.3) en vez de confiar en que el entorno de testing local siempre tiene el binding disponible. Adicionalmente, correr al menos un smoke test contra el **deploy real de producción** (no solo `wrangler dev`) antes de considerar cerrado un cambio que toque estas funciones — así se hizo al final de este ciclo (login real + Playwright contra el dominio productivo) y es lo que debe ser el estándar desde el principio, no el último paso de una sesión de emergencia.

---

## 3. Qué funcionó bien (patrones a reutilizar tal cual)

- **`next build --webpack` obligatorio en Windows.** Turbopack no genera `middleware.js.nft.json` y rompe el build standalone de OpenNext en Windows. Configurar `buildCommand: 'npx next build --webpack'` en `open-next.config.ts` desde el inicio del proyecto si el desarrollo ocurre en Windows.
- **Auditoría de bundle byte a byte cuando el límite de tamaño es ajustado.** El script de auditoría (decodificador VLQ propio sobre los source maps de Wrangler, porque `source-map-explorer` no los soporta) encontró el problema real (imágenes en base64) que ningún chequeo superficial hubiera detectado. Vale la pena escribir esta herramienta una sola vez y reutilizarla en cada proyecto Workers con límite de tamaño ajustado.
- **`SECURITY INVOKER` (no `DEFINER`) en los RPC de Postgres.** Deja que la política RLS existente se aplique fila por fila dentro de la función, así no hay que duplicar lógica de scoping/autorización dentro de cada RPC nuevo.
- **Verificación con Playwright autenticado contra la URL real de producción**, no solo curl/API checks. Varios de estos bugs (currículo vacío) son invisibles a nivel HTTP 200/API — solo se ven renderizados en el DOM real de un usuario logueado. Automatizar esto como parte del proceso de deploy, no como respuesta a una queja.
- **Middleware edge, no Node.** `src/middleware.ts` (edge) funciona en Workers; el `proxy.ts` de Next 16 en modo Node no. JWT local + rate limiter en el middleware evita que Supabase sea un punto único de fallo para decisiones de auth básicas.
- **Modo offline (`/practica`) y banner de estado de Supabase** como red de seguridad: si Supabase satura su cuota o cae, ninguna escuela queda completamente bloqueada — hay una experiencia degradada pero funcional.
- **DNS independiente de la cuenta de hosting.** Tener el DNS en un registrador separado (Hostinger) de la cuenta de deploy (Vercel/Cloudflare) fue lo que hizo viable esta migración de emergencia sin downtime de dominio. Mantener esto como práctica estándar en cualquier proyecto nuevo.

---

## 4. Checklist para la próxima plataforma educativa (Next.js + Supabase + Cloudflare)

Aplicar esto **desde el commit inicial**, no como optimización tardía:

- [ ] `open-next.config.ts` con `buildCommand: 'npx next build --webpack'` si se desarrolla en Windows.
- [ ] Imágenes de metadata (`opengraph-image`, `icon`, etc.) siempre en `public/`, nunca como archivo-convención en `src/app/`.
- [ ] Cualquier dataset de contenido >100 KB va en `public/` + binding `ASSETS`, nunca `import` en código de servidor.
- [ ] Toda función que use un binding de Cloudflare (ASSETS/KV/D1) implementa **try camino primario → catch con fallback**, nunca ramifica por `NODE_ENV`. Loguea el error real, no lo traga en un `catch {}` vacío.
- [ ] `wrangler.jsonc`/`.dev.vars` sin ningún placeholder tipo `REPLACE_WITH_*` llega a `git push` — agregar un chequeo `predeploy` que haga grep de esos patrones y aborte.
- [ ] Cada trigger de Supabase usado para lógica de negocio (roles, membresías) documentado en el propio archivo SQL: qué hace y qué NO hace. Test de integración end-to-end del alta de usuario, no solo "no lanzó error".
- [ ] `supabase/migrations/` con un README/checklist de qué está aplicado en producción y qué no — porque no hay forma de automatizar el DDL contra producción en este stack (solo Dashboard → SQL Editor manual).
- [ ] Llamadas a RPC de Postgres loguean explícitamente `PGRST202` (función no encontrada) — casi siempre significa migración pendiente de aplicar.
- [ ] Smoke test con Playwright autenticado contra la **URL real de producción** después de cada deploy que toque contenido o datos — no solo verificar HTTP 200/API.
- [ ] DNS del dominio en un registrador independiente de la cuenta de hosting/deploy, desde el día 1.
- [ ] Auditoría de bundle (`npx wrangler deploy --dry-run` + herramienta de decodificación de source maps) apenas el proyecto se acerque al 70% del límite gratuito de tamaño (3 MiB gzip), no cuando ya lo exceda.

---

## Referencias

- Migración completa y decisiones de arquitectura: `docs/` (varios informes técnicos preexistentes del proyecto).
- Diagnóstico y fixes puntuales de julio 2026: [`DIAGNOSTICO-Y-OPTIMIZACION-2026-07.md`](DIAGNOSTICO-Y-OPTIMIZACION-2026-07.md).
- Fix del fallback de assets: [`src/lib/data-assets.ts`](src/lib/data-assets.ts).
- Config de Cloudflare: [`wrangler.jsonc`](wrangler.jsonc), [`open-next.config.ts`](open-next.config.ts).
