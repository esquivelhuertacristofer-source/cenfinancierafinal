# Auditoría Mobile Responsive — Sprint 2
> Generado: 2026-05-10 | Viewport de referencia: 375px (iPhone SE)
> Estado: Documentación — NO se aplicaron fixes. Son insumos para el próximo sprint de UX.

---

## Resumen Ejecutivo

| Página | Issues críticos | Impacto |
|--------|----------------|---------|
| `hub/page.tsx` (Hub del estudiante) | 10 | 🔴 CRÍTICO — sidebar de 320px excede el viewport completo |
| `dashboard/teacher/page.tsx` | 6 | 🟠 ALTO — `ml-[260px]` deja solo 115px de contenido visible |
| `log-in/page.tsx` | 6 | 🟡 MEDIO — funcional pero comprimido |
| `LandingPageV3.tsx` | 5 | 🟡 MEDIO — desbordamiento de imágenes decorativas |

---

## Hub del Estudiante (`src/app/hub/page.tsx`) — CRÍTICO

### Issue 1 — Sidebar no colapsa en mobile
- `.side-hud { width: 320px }` — fijo, sin breakpoint mobile
- En 375px: la sidebar sola ocupa casi todo el viewport, el contenido principal queda invisible
- **Fix sugerido**: `@media (max-width: 768px) { .side-hud { display: none } }` + botón hamburguesa para abrir drawer

### Issue 2 — Grid de pilares con `minmax(420px, 1fr)`
- `.pillars-grid { grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)) }`
- 420px mínimo > 375px viewport → overflow horizontal inevitable
- **Fix sugerido**: `minmax(min(420px, 100%), 1fr)` o breakpoint explícito a `minmax(300px, 1fr)` en mobile

### Issue 3 — Fuentes fijas gigantes sin clamp()
- `.gb-title { font-size: 96px }` y `.brand-top { font-size: 44px }`
- En mobile: desbordamiento horizontal de texto
- **Fix sugerido**: `font-size: clamp(2rem, 8vw, 6rem)` para gb-title

### Issue 4 — Padding masivo sin ajuste mobile
- `.grade-briefing { padding: 80px 80px }` y `.pillars-section { padding: 80px }`
- Consume 160px horizontales en un viewport de 375px
- **Fix sugerido**: `@media (max-width: 768px) { padding: 24px 20px }`

### Issue 5 — Imagen circular de 480px de ancho
- `w-[480px] lg:w-[480px]` — el breakpoint `lg:` solo activa en ≥1024px, no en ≤375px
- La imagen tiene 480px fijos en mobile
- **Fix sugerido**: `w-full max-w-[480px]`

### Issues adicionales (menor prioridad)
- 6. Modal con `p-32` — desbordamiento en overlay de actividad
- 7. `.gb-grade-badge` con `right: 80px` absoluto — badge fuera de pantalla
- 8. Theme toggle `position: fixed; top: 40px; right: 40px` — puede solaparse con notch iOS
- 9. Botón "Iniciar Desafío Maestro" con `px-12` sin ajuste mobile
- 10. `section-header h2 { font-size: 56px }` sin clamp()

---

## Dashboard del Profesor (`src/app/dashboard/teacher/page.tsx`) — ALTO

### Issue 1 — `ml-[260px]` deja 115px de ancho en mobile
- El contenido principal asume sidebar de 260px siempre visible
- En 375px: `375 - 260 = 115px` para todo el contenido → inutilizable
- **Fix sugerido**: En mobile, ocultar sidebar y resetear el margin-left

### Issue 2 — HUD status bar con `px-12 py-5` fijo
- Sin breakpoint mobile, el status bar desborda en 375px

### Issue 3 — Bento grid con `lg:col-span-7` / `lg:col-span-5`
- Sin clase base de col-span, el grid puede no apilarse correctamente en mobile

### Issues adicionales
- 4. Íconos de tamaño fijo en status bar
- 5. Theme toggle position sin safe-area-inset
- 6. Padding `p-12` en contenido principal (48px)

---

## Login (`src/app/log-in/page.tsx`) — MEDIO

### Issue 1 — Sidebar izquierda oculta correctamente
- `hidden lg:flex` — bien implementado, no se muestra en mobile ✅

### Issue 2 — Formulario comprimido pero funcional
- `max-w-[440px]` con `p-6` en mobile → 375 - 48 = 327px de contenido, funcional aunque justo

### Issue 3 — Logo con `mb-12` consume 13% del viewport antes del form
- En pantallas cortas (iPhone SE: 667px altura), el logo empuja el form hacia abajo

### Issues adicionales
- 4. Input con `pl-12 pr-5` — deja poco espacio para texto en email largo
- 5. Botón submit puede wrappear texto en 375px si hay spinner visible
- 6. "Acceder como Invitado" puede truncar en 375px

---

## Landing (`src/components/landing/LandingPageV3.tsx`) — MEDIO

### Issue 1 — Imagen hero con `width: 165%`
- El retrato usa `position: absolute; width: 165%` — desborda el contenedor a propósito en desktop, pero en 375px crea scroll horizontal

### Issue 2 — Floaters absolutamente posicionados sin visibilidad mobile
- `.f1`, `.f2`, `.f3` (badges flotantes decorativos) no tienen `@media` rule para ocultarse en mobile
- Se superponen sobre el texto en 375px

### Issue 3 — Breakpoints solo a 680px y 1100px
- No hay reglas para 375px–480px, la franja de phones más común
- Cards de primaria/secundaria con `padding: 32px` en grids sin columna única para ≤480px

### Issues adicionales
- 4. CTAs sin `min-height: 44px` explícito en mobile
- 5. Nav links ocultos en mobile pero sin menú hamburguesa visible

---

## Prioridades Recomendadas para Sprint 3 Mobile

**Urgente (bloqueante en producción):**
1. Hub sidebar: ocultar en mobile + drawer
2. Hub pillars-grid: corregir minmax
3. Teacher dashboard: resetear ml-[260px] en mobile

**Importante (UX degradada):**
4. Hub fuentes: clamp() en gb-title y brand-top
5. Hub paddings: reducir a 20-24px en mobile
6. Landing floaters: `display: none` en ≤680px

**Nice-to-have:**
7. Login logo margin
8. Dashboard bento grid apilado
9. Landing breakpoint a 480px
