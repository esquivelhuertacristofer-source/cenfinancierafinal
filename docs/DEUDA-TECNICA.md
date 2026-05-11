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
| ✅ | `supabase/indexes.sql` generado (pendiente ejecución manual) | Sprint 3 |

---

## 🔴 Alta Prioridad (sin esto hay riesgos activos)

| # | Descripción | Esfuerzo | Acción requerida |
|---|-------------|----------|------------------|
| 1 | **Trigger `protect_sensitive_profile_fields` no versionado** — existe en Supabase pero no en código. Si el proyecto se migra, el control de seguridad se pierde silenciosamente. | 20 min | Usuario: copiar SQL desde Supabase Dashboard → pegar en `supabase/security_triggers.sql` → commit |
| 2 | **Ejecutar `supabase/indexes.sql`** — índices de performance generados pero no aplicados. | 5 min | Usuario: Supabase Dashboard → SQL Editor → pegar y ejecutar el archivo |
| 3 | **Sin aviso de privacidad ni consentimiento parental** — la plataforma maneja datos de menores. Requisito LFPDPPP México para escuelas reales. | 2-4h (legal + desarrollo) | Requiere decisión de producto + redacción legal |
| 4 | **Sin monitoreo de errores en producción** — Sentry no completado. Errores en producción son invisibles. | 30 min | Usuario: crear cuenta en sentry.io → crear proyecto Next.js → ejecutar `npx @sentry/wizard@latest -i nextjs` → agregar DSN a Vercel env vars |

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
2. **IMPORTANTE** — Ejecutar `supabase/indexes.sql` en Supabase Dashboard SQL Editor
3. **IMPORTANTE** — Completar setup de Sentry (ver instrucciones en REPORTE-SPRINT3-CLAUDE.md)
4. **LEGAL** — Agregar aviso de privacidad antes de usuarios reales en escuelas

---

## Variables de Entorno Requeridas (Vercel Dashboard)

- `NEXT_PUBLIC_SUPABASE_URL` — requerido
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — requerido
- `SENTRY_DSN` — pendiente (cuando se complete setup de Sentry)

La `service_role key` de Supabase NO debe estar en variables de entorno del frontend.
