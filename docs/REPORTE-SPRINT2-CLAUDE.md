# Reporte Sprint 2 — CEN Academy
> Fecha: 2026-05-10 | Base: commit d8d2ceb | Nuevo commit: ver abajo

---

## Resumen Ejecutivo

Sprint nocturno completado. Se ejecutaron todas las fases planificadas. Build local limpio en todos los puntos de validación. Push a GitHub: ✅ completado.

**Archivos modificados:** 6 archivos fuente + 2 docs nuevos  
**Regresiones introducidas:** 0  
**Builds fallidos:** 0

---

## Resultado por Fase

### Fase 1 — Verificación de Seguridad ✅

| Test | Resultado |
|------|-----------|
| Trigger `protect_sensitive_profile_fields` — escalada de privilegios | ✅ Bloqueado (HTTP 400) |
| RLS tabla `progress` para `anon` | ✅ Array vacío `[]` — comportamiento correcto de Supabase con RLS activa |

Ambos controles de seguridad de la sesión anterior siguen activos. El sprint puede continuar.

---

### Fase 2 — Correcciones de Contenido ✅

#### 2.1 — unit_title en 5 JSONs
**Estado: todos ya estaban corregidos.** Los 5 archivos del DEUDA-TECNICA.md ya tenían títulos consistentes con los archivos pedagógicos (p5.json, s2.json, s3.json). La deuda documentaba el estado pre-estabilización. Sin cambios necesarios.

#### 2.2 — public/assets/extra/4.png
Sigue siendo el placeholder (copia de 3.png — 958,814 bytes). No hay imagen real disponible en el proyecto. Documentado. Sin cambios.

---

### Fase 3 — Bugs Funcionales ✅

#### 3.1 — Recharts dimensiones negativas
**Archivo:** `src/components/activities/SimulatorActivity.tsx`

El `ResponsiveContainer` estaba dentro de un div con `flex-1` que no tiene altura definida en el primer render, causando que Recharts reciba `height = 0` o `-1`.

**Fix aplicado:**
```diff
- <div className="flex-1 w-full min-h-[300px]">
+ <div className="w-full" style={{ height: '300px' }}>
```
El `ResponsiveContainer width="100%" height="100%"` ahora hereda exactamente 300px, eliminando el error de dimensiones negativas.

**Nota:** La deuda técnica mencionaba `hub/page.tsx` pero Recharts no se usa ahí — está exclusivamente en `SimulatorActivity.tsx`.

#### 3.2 — SyncEngine: sanitización de cola al cargar
**Archivo:** `src/lib/hub.ts`

`getSyncQueue()` hacía `JSON.parse()` directamente sin validar el contenido. Si el localStorage contenía datos corruptos o inyectados, se procesaban como válidos.

**Fix aplicado:** `getSyncQueue()` ahora:
1. Maneja `JSON.parse` con try/catch (retorna `[]` y limpia localStorage si el JSON es inválido)
2. Valida que cada item sea un objeto con `userId` UUID-válido y `activityId` string
3. Filtra items inválidos y actualiza localStorage si encontró elementos corruptos
4. Movió `UUID_REGEX` antes de `getSyncQueue` para que esté disponible en la validación

#### 3.3 — BuilderActivity: `calculos_automaticos` ⭐ Fix principal del sprint
**Archivos:** `src/components/activities/BuilderActivity.tsx`, `src/types/activities.ts`

El Shark Tank CEN (P5-4-5) y cualquier CONSTRUCTOR con `calculos_automaticos` mostraban los campos de entrada pero los cálculos financieros en vivo no funcionaban. Es la actividad más compleja de la plataforma.

**Cambios en `activities.ts`:**
- Agregado interface `CalcAutomatico` con campos `id`, `label`, `formula`, `prefix?`, `suffix?`, `alerta_si?`, `alerta_mensaje?`, `ayuda?`
- `BuilderActivityData.calculos_automaticos?: CalcAutomatico[]` agregado
- `output_type` cambiado de union estricta a `string` (el JSON de Shark Tank usa "Deck de Inversión CEN" que no estaba en la union)

**Cambios en `BuilderActivity.tsx`:**
- `useMemo` que re-evalúa todas las fórmulas de `calculos_automaticos` en tiempo real cuando `formData` cambia
- Usa `new Function(...Object.keys(formData), \`return ${formula}\`)` (mismo patrón ya existente en `getFieldValue`)
- Evalúa condiciones de alerta (`alerta_si`) para resaltar métricas en rojo/naranja cuando el número es problemático
- Panel "Calculadora en Vivo" que aparece solo cuando el JSON incluye `calculos_automaticos`:
  - Grid 2-3 columnas con tarjetas por métrica
  - Formato `es-MX` con prefijo/sufijo (ej: `$1,200,000` o `45.5%`)
  - Muestra `—` cuando la dependencia aún no tiene valor (no muestra 0 engañoso)
  - Alerta visual en naranja con mensaje explicativo cuando se activa `alerta_si`
  - Texto de ayuda en gris para métricas sin alerta

**Cálculos del Shark Tank CEN ahora funcionan:**
- Margen bruto por unidad y %
- Ingresos proyectados Año 1
- Utilidad bruta Año 1
- Valuación implícita de la empresa
- Múltiplo de valuación (con alerta si > 20x)

---

### Fase 4 — Configuración y Robustez ✅

#### 4.1 — `output: 'standalone'` en next.config.ts
```diff
+ output: 'standalone',
```
Build pasó sin errores. Reduce el tamaño del bundle de producción para Vercel/Docker.

#### 4.2 — Turbopack vs Webpack
No se cambió el script `build` en package.json. El deploy de Vercel usa Turbopack por defecto y el build de la sesión anterior pasó sin problemas. Se mantiene `--webpack` solo para validaciones locales.

#### 4.3 — Console.log DEBUG
Búsqueda completa en `src/**/*.ts,*.tsx`: cero instancias de `console.log('[DEBUG'` o patrones similares. Sin cambios necesarios.

---

### Fase 5 — UX y Polish ✅

#### 5.1 — Auditoría Mobile Responsive
Completada. Ver `docs/MOBILE-AUDIT-SPRINT2.md` para el inventario completo.

**Hallazgo crítico:** `hub/page.tsx` tiene un sidebar de 320px fijo — en un viewport de 375px el contenido principal queda completamente invisible. Este es el problema mobile más urgente de la plataforma.

**No se aplicaron fixes mobile en este sprint** — per instrucciones, solo documentación. Los fixes mobile requieren cambios de CSS de mayor alcance que el usuario debe revisar antes de aplicar.

#### 5.2 — SEO metadata en layout.tsx
```diff
  export const metadata = {
    title: "CEN | Plataforma de Educación Financiera",
-   description: "La plataforma educativa líder en inteligencia financiera para niños y jóvenes.",
+   description: "Plataforma educativa líder en inteligencia financiera para niños y jóvenes de 6 a 15 años...",
+   keywords: [...],
+   openGraph: { title, description, url, siteName, locale, type },
+   twitter: { card: "summary_large_image", ... },
+   robots: { index: true, follow: true },
  };
```

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/components/activities/SimulatorActivity.tsx` | Fix Recharts: wrapper con altura fija 300px |
| `src/lib/hub.ts` | SyncEngine: getSyncQueue() con validación y sanitización |
| `src/types/activities.ts` | CalcAutomatico interface + BuilderActivityData.calculos_automaticos |
| `src/components/activities/BuilderActivity.tsx` | Panel "Calculadora en Vivo" con useMemo |
| `next.config.ts` | `output: 'standalone'` |
| `src/app/layout.tsx` | SEO: openGraph, twitter, robots, keywords |
| `docs/MOBILE-AUDIT-SPRINT2.md` | Nuevo — auditoría mobile (25 issues documentados) |
| `docs/REPORTE-SPRINT2-CLAUDE.md` | Este archivo |

---

## Deuda Técnica Actualizada

### Resuelta en este sprint
- ✅ Bug Recharts dimensiones negativas
- ✅ SyncEngine cola no validada al cargar
- ✅ BuilderActivity calculos_automaticos sin implementar
- ✅ `output: 'standalone'` en next.config.ts

### Pendiente de verificación manual (requiere Supabase Dashboard)
- ⚠️ Trigger `protect_sensitive_profile_fields` — verificado como activo via API, pero revisar en panel para confirmar definición SQL completa
- ⚠️ RLS tabla `profiles` — solo se verificó `progress` en este sprint

### Pendiente para Sprint 3 — Mobile
- 🔴 Hub sidebar: ocultar en mobile + drawer (bloqueante en producción mobile)
- 🔴 Hub pillars-grid: `minmax(420px)` excede 375px viewport
- 🟠 Teacher dashboard: `ml-[260px]` en mobile
- 🟡 Landing floaters y breakpoints

### Pendiente para Sprint 3 — Contenido
- `public/assets/extra/4.png` — placeholder pendiente de imagen real
- `docs/ACTIVIDADES_UPGRADE_V2.md` — 30 actividades mejoradas sin aplicar
- Páginas `/academia/*/bloque*` — stubs sin contenido real

---

## Builds de Validación

| Momento | Archivos incluidos | Resultado |
|---------|-------------------|-----------|
| Post Recharts + SyncEngine | SimulatorActivity, hub.ts | ✅ Limpio |
| Post BuilderActivity | activities.ts, BuilderActivity | ✅ Limpio |
| Post next.config + SEO | next.config.ts, layout.tsx | ✅ Limpio |
| Build final | Todos | ✅ Limpio |
