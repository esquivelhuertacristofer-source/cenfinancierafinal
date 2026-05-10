# Deuda Técnica — CEN Academy
> Inventario generado automáticamente el 2026-05-10

No se encontraron comentarios `// TODO`, `// FIXME` ni `// HACK` en el código fuente.
Los ítems a continuación son deuda técnica identificada durante el proceso de estabilización.

---

## Alta Prioridad

| # | Archivo | Descripción | Esfuerzo |
|---|---------|-------------|----------|
| 1 | `src/data/actividades/p5/act-p5-1-1-a.json` | `unit_title` incorrecto ("El sistema financiero global" → "El Banco de México...") | 5 min |
| 2 | `src/data/actividades/s2/act-s2-4-1-a.json` | `unit_title` incorrecto | 5 min |
| 3 | `src/data/actividades/s3/act-s3-2-4-a.json` | `unit_title` incorrecto | 5 min |
| 4 | `src/data/actividades/s2/act-s2-1-5-a.json` | `unit_title` incorrecto | 5 min |
| 5 | `src/data/actividades/p5/act-p5-4-5-a.json` | `unit_title` incorrecto ("Mi Portafolio" → "Shark Tank CEN") | 5 min |

## Media Prioridad

| # | Archivo | Descripción | Esfuerzo |
|---|---------|-------------|----------|
| 6 | `src/components/activities/BuilderActivity.tsx` | No renderiza `calculos_automaticos` de CONSTRUCTOR — los campos se muestran pero los cálculos en vivo no funcionan | 2h |
| 7 | `src/app/hub/page.tsx` | Recharts `width/height` puede ser -1 en mount inicial si el contenedor no tiene dimensiones | 30 min |
| 8 | `src/lib/hub.ts` | `getSyncQueue()` no valida que los items existentes sean UUIDs válidos al cargar la página | 30 min |
| 9 | Supabase | Verificar manualmente que trigger `protect_sensitive_profile_fields` sigue activo | 15 min |

## Baja Prioridad

| # | Archivo | Descripción | Esfuerzo |
|---|---------|-------------|----------|
| 10 | `public/assets/extra/4.png` | Reemplazar placeholder (copia de 3.png) con imagen real | 5 min |
| 11 | `src/app/dashboard/*/page.tsx` | Componentes de teacher usan `font-serif` (serif del navegador). Considerar usar `dashboard-serif-premium` (Playfair Display) explícitamente si se desea consistencia | 30 min |
| 12 | `docs/ACTIVIDADES_UPGRADE_V2.md` | Las versiones mejoradas de 30 actividades están documentadas pero no aplicadas al código | 4-8h |
| 13 | `next.config.ts` | Usar `output: 'standalone'` en producción para mejorar imagen Docker/Vercel | 15 min |
| 14 | `src/app/academia/**` | Páginas de academia (bloque1–bloque7) son stubs — sin contenido real | Variable |

---

## Seguridad Pendiente de Verificación Manual

Estos ítems requieren acceso al panel de Supabase:

1. **Trigger `protect_sensitive_profile_fields`**: Verificar que previene que un estudiante actualice `role` a `admin` via REST
2. **RLS en tabla `progress`**: Verificar que `anon` no puede leer, `authenticated` solo ve su propia data
3. **RLS en tabla `profiles`**: Verificar que `authenticated` solo puede actualizar campos no-críticos de su propio perfil

---

## Variables de Entorno en Vercel

Verificar en Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` — requerido
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — requerido

La `service_role key` de Supabase NO debe estar en variables de entorno del frontend.
