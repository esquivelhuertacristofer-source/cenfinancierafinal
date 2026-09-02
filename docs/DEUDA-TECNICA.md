# Deuda Técnica — CEN Academy
> Última actualización: 2026-05-10 | Post Sprint 3

---

## Resuelto en Sprint 2

| # | Descripción | Sprint |
|---|-------------|--------|
| ✅ | `unit_title` incorrecto en 5 JSONs (ya estaban corregidos) | Sprint 2 |
| ✅ | BuilderActivity: `calculos_automaticos` sin implementar → Panel "Calculadora en Vivo" | Sprint 2 |
| ✅ | Recharts dimensiones negativas en SimulatorActivity | Sprint 2 |
| ✅ | SyncEngine: `getSyncQueue()` sin validación UUID | Sprint 2 |
| ✅ | `output: 'standalone'` en next.config.ts | Sprint 2 |

## Resuelto en Sprint 3

| # | Descripción | Sprint |
|---|-------------|--------|
| ✅ | `typescript.ignoreBuildErrors: true` eliminado (0 errores confirmados) | Sprint 3 |
| ✅ | Hub sidebar: colapsable en mobile (drawer) | Sprint 3 |
| ✅ | Hub pillars grid: `minmax(420px)` → grid responsivo 1/2/3 columnas | Sprint 3 |
| ✅ | Hub fuentes: `96px`, `44px`, `56px` → `clamp()` | Sprint 3 |
| ✅ | Teacher dashboard: `ml-[260px]` → `md:ml-[260px]` (6 páginas) | Sprint 3 |
| ✅ | Sidebar.tsx: `flex` → `hidden md:flex` (oculta en mobile) | Sprint 3 |
| ✅ | Vercel Analytics integrado en layout.tsx | Sprint 3 |
| ✅ | SyncEngine: logging con contexto (usuario, cantidad, resultado) | Sprint 3 |
| ✅ | SyncEngine: auto-discard items > 7 días en cola | Sprint 3 |
| ✅ | `supabase/security_triggers.sql` placeholder versionado | Sprint 3 |
| ✅ | `supabase/migrations/legacy_indexes.sql` generado (pendiente ejecución manual) | Sprint 3 |

---

## 🔴 Alta Prioridad (sin esto hay riesgos activos)

| # | Descripción | Esfuerzo | Acción requerida |
|---|-------------|----------|------------------|
| 1 | **Trigger `protect_sensitive_profile_fields` no versionado** — existe en Supabase pero no en código. Si el proyecto se migra, el control de seguridad se pierde silenciosamente. | 20 min | Usuario: copiar SQL desde Supabase Dashboard → pegar en `supabase/security_triggers.sql` → commit |
| 2 | **Ejecutar `supabase/migrations/legacy_indexes.sql`** — índices de performance generados pero no aplicados. | 5 min | Usuario: Supabase Dashboard → SQL Editor → pegar y ejecutar el archivo |
| 3 | **Sin aviso de privacidad ni consentimiento parental** — la plataforma maneja datos de menores. Requisito LFPDPPP México para escuelas reales. | 2-4h (legal + desarrollo) | Requiere decisión de producto + redacción legal |
| 4 | ~~**Sin monitoreo de errores en producción** — Sentry no completado.~~ **NO VIGENTE** — ver nota abajo. | — | — |

> **Nota (2026-07-08) — Sentry removido deliberadamente:** el ítem #4 de esta tabla y las instrucciones de `docs/SENTRY-SETUP-INSTRUCCIONES.md` son **históricas**. Durante la migración de Vercel a Cloudflare Workers, el SDK de Sentry (`@sentry/nextjs`) fue **removido intencionalmente** del proyecto — nunca llegó a tener un DSN configurado (estaba inerte) y su bundle de servidor (+ OpenTelemetry) hacía que el Worker superara el límite de 3 MiB gzip del plan free de Cloudflare. **No reinstalar el paquete ni seguir esas instrucciones como si siguieran vigentes.** Tener monitoreo de errores en producción (Sentry u otra alternativa compatible con Cloudflare Workers) sigue siendo deseable, pero reactivarlo es una **decisión de producto pendiente** — no algo a ejecutar automáticamente. Actualmente los errores de producción se ven en los logs del Worker (`wrangler tail` / dashboard de Cloudflare).

---

## 🟠 Media Prioridad

| # | Descripción | Esfuerzo |
|---|-------------|----------|
| 5 | `public/assets/extra/4.png` — placeholder (copia de 3.png). Imagen decorativa sin contenido real. | 5 min cuando esté disponible |
| 6 | `src/app/academia/**` — páginas de academia son stubs sin contenido real (bloque1–bloque7) | Variable |
| 7 | `docs/ACTIVIDADES_UPGRADE_V2.md` — 30 actividades mejoradas documentadas pero no aplicadas | 4-8h |
| 8 | Mobile responsive completo — los 3 fixes críticos se aplicaron en Sprint 3 pero verificación visual diferida. Ver `MOBILE-AUDIT-SPRINT2.md` para los 25 issues restantes. **Prioridad solo si se expande a B2C / uso doméstico en celular.** | Sprint completo |

---

## 🟡 Baja Prioridad

| # | Descripción | Esfuerzo |
|---|-------------|----------|
| 9 | RLS tabla `profiles` — solo se verificó `progress` en Sprint 2. Verificar manualmente en Supabase Dashboard. | 15 min |
| 10 | Sin tests automatizados (unitarios, integración o e2e). Toda la validación es manual + build. | Sprint completo |
| 11 | Sin staging environment — cambios van directo a producción desde el branch main. | Configuración Vercel |

---

## Acciones Manuales Pendientes del Usuario (ordenadas por urgencia)

1. **URGENTE** — Pegar SQL del trigger en `supabase/security_triggers.sql` → hacer commit
2. **IMPORTANTE** — Ejecutar `supabase/migrations/legacy_indexes.sql` en Supabase Dashboard SQL Editor
3. ~~**IMPORTANTE** — Completar setup de Sentry~~ **NO VIGENTE** — Sentry fue removido deliberadamente en la migración a Cloudflare (2026-07-08). Ver nota en la sección "Alta Prioridad" arriba y en `docs/SENTRY-SETUP-INSTRUCCIONES.md`.
4. **LEGAL** — Agregar aviso de privacidad antes de usuarios reales en escuelas

---

## Variables de Entorno Requeridas (Cloudflare — `wrangler secret put`)

> Actualizado (2026-07-08): el proyecto se despliega en Cloudflare Workers, no en Vercel. Las variables públicas no sensibles pueden ir en `wrangler.jsonc` (`vars`); los secretos se cargan con `wrangler secret put <NOMBRE>`. Ver `docs/SEGURIDAD-PENDIENTES.md` para el procedimiento completo.

- `NEXT_PUBLIC_SUPABASE_URL` — requerido
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — requerido
- `SUPABASE_SERVICE_ROLE_KEY` — requerido (solo servidor)
- `SUPABASE_JWT_SECRET` — requerido (verificación JWT local en middleware)
- ~~`SENTRY_DSN`~~ — **NO VIGENTE**, Sentry fue removido deliberadamente (ver nota arriba)

La `service_role key` de Supabase NO debe estar en variables de entorno del frontend.
