# Evaluación Arquitectónica — Plantilla White-Label
## CEN Educación Financiera · Junio 2026

**Propósito:** Determinar si esta plataforma es viable como plantilla white-label para educación financiera institucional.  
**Metodología:** Análisis estático de 59 rutas, 48 componentes, 12 librerías, 6 migraciones SQL, y árbol de dependencias completo.  
**Calificación global: 6.5 / 10**

---

## Resumen Ejecutivo

La plataforma es una base **sólida y moderna** con arquitectura correcta en sus capas de seguridad, autenticación y modelo de progreso educativo. Sin embargo, tres áreas críticas para white-label están **sin implementar o incompletas**: el sistema de multi-tenencia no existe (solo hay código preparatorio), la marca está cosida directamente en el código fuente (1,336+ ocurrencias hardcoded), y no hay CMS — todo el contenido curricular requiere un despliegue de código para cambiar.

**Conclusión práctica:** Puede usarse como plantilla para un cliente nuevo, pero el esfuerzo de adaptación es de 3-4 semanas de desarrollo, no 2-3 días. Vale la pena hacerlo; la arquitectura subyacente lo justifica.

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión | Evaluación |
|------|-----------|---------|-----------|
| Framework | Next.js App Router | 16.2.9 | ✅ Moderno, RSC, standalone build |
| Runtime UI | React | 19.2.3 | ✅ Más reciente disponible |
| Lenguaje | TypeScript | 5.x | ✅ Tipado estricto |
| Base de datos | Supabase / PostgreSQL | SDK 2.98 | ✅ Managed, RLS nativo |
| Auth | Supabase Auth (PKCE) | SSR 0.10.3 | ✅ JWT server-side validated |
| Monitoreo | Sentry | 10.52.0 | ✅ Configurado, PII enmascarado |
| CSS | Tailwind CSS | 4.x | ✅ Utility-first, tokens definidos |
| Animaciones | Framer Motion | 12.38 | ✅ |
| Visualizaciones | Recharts | 3.8.1 | ✅ |
| Fórmulas | mathjs | 15.2 | ✅ Seguro (no eval) |
| Validación | Zod | 4.4.3 | ✅ |
| Exportación | jsPDF + PapaParse | 4.2 / 5.5 | ✅ Credenciales PDF, CSV |
| Analítica | Vercel Analytics | 2.0.1 | ✅ |
| Despliegue | Vercel / Docker standalone | — | ✅ Ambos soportados |

**Stack score: 9/10.** Elecciones tecnológicas correctas y actualizadas. Sin deuda técnica de dependencias después de la auditoría de seguridad previa.

---

## 2. Arquitectura de Aplicación

### 2.1 Estructura de Rutas (59 páginas)

```
/ (landing pública)
├── /log-in              — autenticación
├── /privacidad          — aviso de privacidad LFPDPPP
├── /terminos            — términos de uso
│
├── /hub/                — núcleo educativo (JWT requerido)
│   ├── portal           — enrutador por rol
│   ├── [pillar]/        — pilares del currículo
│   ├── actividad/[id]/  — reproductor de actividades
│   ├── logros/          — insignias y achievements
│   ├── mission/         — briefing de misión por grado
│   └── library/         — biblioteca de recursos
│
├── /dashboard/          — panel de control (JWT requerido)
│   ├── (router) → primary | secondary | teacher
│   ├── teacher/alumnos/ — lista de alumnos
│   ├── teacher/reportes/— analytics y progreso
│   └── teacher/modulos/ — gestión de contenido
│
├── /admin/              — administración institucional (rol admin)
│   └── usuarios/        — onboarding masivo, grupos
│
└── /api/                — endpoints internos
    ├── activity/[id]/   — sirve JSON de actividades
    └── curriculum/[g]/  — sirve metadatos de currículo
```

**Calidad arquitectónica:**
- Separación limpia entre rutas públicas, autenticadas y admin
- Server Components con Data Fetching en el servidor (no client-side fetch en rutas protegidas)
- Server Actions con `requireAdminSession()` en todas las mutaciones admin
- Rate limiting aplicado tanto en middleware como en Server Actions (doble capa)
- Error boundaries por sección (`hub/error.tsx`, `app/error.tsx`)

### 2.2 Middleware (`src/proxy.ts`)

El middleware actúa como guardián unificado:
- Valida JWT con `getUser()` (no `getSession()`, que es vulnerable a tokens expirados en caché)
- Aplica todos los headers de seguridad en cada respuesta
- Rate limiting de login a nivel de red
- Genera nonce por petición para scripts inline
- Aplica `Cache-Control: no-store, private` en rutas protegidas

**Esto es correcto.** La mayoría de plataformas aplican headers solo en algunas rutas o los dejan a Vercel.

### 2.3 Capas de la Aplicación

```
Browser
  ↓
Supabase Auth (cookies PKCE)
  ↓
src/proxy.ts — middleware (JWT + headers + rate limit)
  ↓
RSC / Server Components — data fetch server-side
  ↓
Server Actions ('use server') — mutaciones con requireAdminSession()
  ↓
Supabase PostgreSQL + RLS — última línea de defensa en datos
```

Cada capa tiene su propia validación. Un atacante que salte una capa encuentra la siguiente.

---

## 3. Modelo de Base de Datos

### 3.1 Tablas Identificadas

| Tabla | Propósito | RLS |
|-------|-----------|-----|
| `profiles` | Usuarios (rol, grado, grupo) | ✅ Por rol |
| `grupos` | Grupos/salones institucionales | ✅ Por profesor |
| `alumnos_grupos` | Membresía alumno-grupo | ✅ Por rol |
| `intentos` | Intentos de actividad (métricas) | ✅ Por usuario |
| `progress` | Actividades completadas | ✅ Por usuario |
| `lessons` | Unidades curriculares | ✅ Solo lectura |
| `lesson_contents` | Contenido dentro de unidades | ✅ Solo lectura |
| `user_progress` | Progreso formal por contenido | ✅ Por usuario |

### 3.2 Índices de Performance

```sql
idx_grupos_profesor             — grupos(id_profesor)
idx_alumnos_grupos_grupo        — alumnos_grupos(id_grupo)
idx_alumnos_grupos_alumno       — alumnos_grupos(id_alumno)
idx_intentos_user_id            — intentos(user_id)
idx_intentos_user_status        — intentos(user_id, status) compuesto
idx_progress_user_activity      — progress(user_id, activity_id) compuesto
idx_profiles_role_group         — profiles(role, group_id) compuesto
idx_profiles_school_level       — profiles(school_level)
```

Los índices cubren los patrones de consulta más frecuentes (progreso de alumno, lista de alumnos de un grupo). Bien planteados.

### 3.3 RLS (Row-Level Security)

```
Alumno    → solo sus propios registros
Docente   → alumnos en sus grupos (via alumnos_grupos + group_id)
Admin     → todos los registros de la plataforma
Super_admin → todos los registros (igual que admin, sin diferencia actual)
```

**Helper functions SECURITY DEFINER:**
- `get_my_role()` — evita recursión en RLS al consultar profiles
- `get_my_group_ids()` — array de grupos del docente autenticado
- `protect_user_profile_fields()` — impide auto-promoción de rol

---

## 4. Modelo de Contenido Educativo

### 4.1 Tipos de Actividades (14 tipos)

| Tipo | Descripción | Complejidad |
|------|-------------|-------------|
| QUIZ | Selección múltiple con retroalimentación | Media |
| SIMULADOR | Fórmulas financieras en vivo (mathjs) | Alta |
| STORY/DECIDE | Narrativa ramificada con consecuencias | Alta |
| TRIVIA | Preguntas rápidas con tiempo | Baja |
| DRAG_DROP | Clasificación arrastrando elementos | Media |
| FILL_BLANKS | Completar textos | Baja |
| ROULETTE | Ruleta de escenarios | Media |
| MATCHING | Memorama / pares | Baja |
| GAME | Mini-juego (catch/avoid con física) | Alta |
| BALANCE | Balance contable simplificado | Media |
| RADAR | Evaluación tipo radar/araña | Media |
| GROWTH | Visualización de crecimiento/interés | Media |
| BUILDER | Constructor paso a paso | Alta |
| CONTROL | Gestión de servicios | Media |

**14 tipos es un diferenciador fuerte.** La mayoría de plataformas EdTech solo tienen Quiz + Video.

### 4.2 Flujo de Datos del Currículo

```
API /api/curriculum/[grade-level]
         ↓
    JSON estructurado de unidades
         ↓
    getCurriculumData(grade, level)  — con cache en memoria + timeout 4s
         ↓
    getPillarsForGrade(grade, level) — 4-6 pilares por grado
         ↓
    Pillar → [Unit] → [Activity]
                           ↓
             /api/activity/[activityId]  — JSON de la actividad
                           ↓
             Componente dinámico según tipo
```

### 4.3 Estructura de Progreso

```
Alumno completa actividad
    ↓
markActivityComplete(userId, activityId)
    ├── Escribe en tabla 'intentos' (métricas: score, tiempo, pasos)
    ├── Escribe en tabla 'progress' (completado: booleano)
    ├── Si falla → addToSyncQueue() → localStorage (7 días, 3 reintentos)
    └── Cuando recupera red → processSyncQueue() automático
```

El sistema offline es robusto y con validación de UUID para evitar datos corruptos en la cola.

### 4.4 Sistema de Progresión (Gamificación)

- **XP:** `scoreBase × (score/100) + bonoPerfección(+50) + bonoRacha(+30/+100)`
- **Rangos:** Novato → Explorador → Experto → Maestro → Diamond (por porcentaje de pillar completado)
- **Arena Quiz:** 10 preguntas por grado, aleatorias, para evaluación del pillar
- **Logros:** Insignias por hitos (primera actividad, racha 5, perfección, etc.)

---

## 5. Evaluación White-Label

### 5.1 Multi-Tenencia — ⚠️ NO IMPLEMENTADA

**Estado actual: Plataforma de tenant único.**

El campo `escuela_id` aparece referenciado en `requireAdminSession()` pero **no existe en ninguna tabla del schema**. Es código preparatorio, no funcional.

**Consecuencia:** Un solo despliegue solo puede servir a una institución. Para dos clientes, se necesitan dos deployments separados (dos proyectos Supabase, dos proyectos Vercel).

**Para implementar multi-tenencia real se necesita:**
```sql
-- 1. Nueva tabla
CREATE TABLE instituciones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,  -- para routing por subdominio
  branding    JSONB,                 -- colores, logo, nombre
  dominio     TEXT,                  -- custom domain
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Columna en todas las tablas de datos
ALTER TABLE profiles  ADD COLUMN escuela_id UUID REFERENCES instituciones(id);
ALTER TABLE grupos    ADD COLUMN escuela_id UUID REFERENCES instituciones(id);
ALTER TABLE intentos  ADD COLUMN escuela_id UUID REFERENCES instituciones(id);
ALTER TABLE progress  ADD COLUMN escuela_id UUID REFERENCES instituciones(id);

-- 3. Actualizar todas las RLS policies para incluir escuela_id en el USING clause
-- 4. Cambiar 'admin' a ser institution-scoped (actualmente es global)
-- 5. Middleware: leer escuela_id del subdominio/cookie y propagarlo
```

**Estimado:** 1 semana de backend + pruebas.

### 5.2 Branding — ⚠️ HARDCODED

**Estado actual: Marca "CEN" cosida en 30+ archivos.**

| Tipo de hardcoding | Cantidad | Ejemplos |
|-------------------|----------|---------|
| Colores hex inline | ~1,336 | `bg-[#011C40]`, `text-[#FF8C00]` |
| Strings "CEN" / "Campaña Educativa" | 54 | Navbar, Footer, Sidebar, meta |
| URLs de assets | ~20 | `/assets/cen-logo-official.png` |
| Metadata hardcoded | 3 | `layout.tsx` title, OG, description |

**Paradoja:** `tailwind.config.ts` define el tema correctamente con tokens `cen.blue`, `cen.orange`, etc. Pero los componentes no los usan — usan hex directamente. El sistema de diseño existe pero no se aplica.

**Solución mínima para white-label:**
```typescript
// src/config/branding.ts — nuevo archivo
export const BRAND = {
  name:        process.env.NEXT_PUBLIC_BRAND_NAME       ?? 'CEN',
  tagline:     process.env.NEXT_PUBLIC_BRAND_TAGLINE    ?? 'Educación Financiera',
  logoPath:    process.env.NEXT_PUBLIC_BRAND_LOGO       ?? '/assets/cen-logo-official.png',
  primaryColor:   process.env.NEXT_PUBLIC_COLOR_PRIMARY    ?? '#011C40',
  accentColor:    process.env.NEXT_PUBLIC_COLOR_ACCENT     ?? '#FF8C00',
  legalEntity: process.env.NEXT_PUBLIC_LEGAL_ENTITY    ?? 'CEN — Campaña Educativa Nacional',
  contactEmail:process.env.NEXT_PUBLIC_CONTACT_EMAIL   ?? 'campanaeducativanacional@gmail.com',
};
```

**Estimado de refactoring de branding:** 3-4 días.

### 5.3 Gestión de Contenido — ⚠️ REQUIERE CÓDIGO

**Estado actual: No hay CMS. Todo el contenido es JSON/código.**

Para cambiar un quiz, agregar una unidad o modificar el texto de una actividad, se necesita:
1. Editar un archivo JSON o `hub.ts`
2. Hacer commit y push
3. Esperar el deploy en Vercel (~2 minutos)

**No hay interfaz de administración de contenido.** El panel admin (`/admin/usuarios`) solo gestiona usuarios y grupos, no contenido curricular.

Para una plantilla white-label viable, esto es el gap más costoso de resolver:
- Editor de actividades (quiz builder, configurador de simulador)
- CRUD de unidades y pilares desde el panel admin
- Gestión de videos por URL (ya hay estructura, falta UI)
- Preview antes de publicar

**Estimado:** 3-4 semanas para un CMS básico funcional.

### 5.4 Internacionalización — ❌ NO EXISTE

100% en español. No hay infraestructura i18n (no hay `next-intl`, `next-i18next`, ni archivos de traducción).

Si el cliente objetivo habla otro idioma, esto es un bloqueador. Si el mercado es hispanohablante, no es un problema.

### 5.5 Rate Limiting Distribuido — ⚠️ EN MEMORIA

`src/lib/rate-limiter.ts` usa un `Map` en memoria. En Vercel Edge Functions o cualquier deployment multi-instancia, cada instancia tiene su propio counter — el rate limiting no funciona correctamente.

**Fix:** Reemplazar con Upstash Redis (compatible con Edge, ~1 día de trabajo).

---

## 6. Robustez y Escalabilidad

### 6.1 Puntos Fuertes de Robustez

| Característica | Implementación | Impacto |
|----------------|----------------|---------|
| Offline sync | Cola localStorage + reintentos automáticos | Alto — crítico en redes escolares |
| Timeout en fetches | 4s curriculum, 3s profile | Medio — evita cuelgues indefinidos |
| Error boundaries | Por sección (hub, app) | Medio — fallos aislados |
| Fallback data | Perfiles y currículo hardcoded de reserva | Medio — pantalla nunca en blanco |
| Validación Zod | En todas las Server Actions | Alto — inputs nunca llegan al DB sucios |
| RLS como última línea | Políticas en DB independientes del código | Alto — seguridad incluso con bugs en app |

### 6.2 Limitaciones de Escalabilidad

| Limitación | Impacto | Solución |
|-----------|---------|---------|
| Rate limiter in-memory | Multi-instancia no funciona | Upstash Redis |
| Logger in-memory (max 1000) | Logs se pierden | Integrar con Sentry o log service externo |
| XP en localStorage | No sincroniza entre dispositivos | Mover a columna en profiles |
| Sin CDN para JSONs de actividades | Latencia en actividades | Supabase Storage o CDN |
| Sin paginación en dashboard teacher | Lento con >100 alumnos | Agregar `.range()` en queries |

### 6.3 Capacidad Estimada por Deployment

Con la configuración actual en Vercel + Supabase Free/Pro:

| Métrica | Estimado | Limitante |
|---------|----------|----------|
| Usuarios concurrentes | ~500-1,000 | Supabase connection pool |
| Alumnos por institución | Ilimitado | Solo base de datos |
| Actividades por grado | Ilimitado | JSON files / API |
| Docentes por deployment | Ilimitado | Solo lógica |

Para escalar a 10,000+ usuarios concurrentes: Supabase Pro + pgBouncer + CDN de assets.

---

## 7. Seguridad (Resumen Post-Auditoría)

Calificación de seguridad: **8.0 / 10** (ver `AUDITORIA-SEGURIDAD-2026-06.md` para detalle completo).

Los 5 hallazgos críticos y 8 altos fueron resueltos. Postura actual:
- OWASP Top 10: cubierto en A1 (Broken Access Control via IDOR fix + RLS), A2 (Cryptographic — HTTPS+HSTS), A3 (Injection — Zod+RLS), A5 (Config — headers CSP/CORP/COOP), A7 (Auth — rate limiting, PKCE, min 8 chars), A9 (Components — Next.js actualizado)
- CVE GHSA-mq59-m269-xvcx (CSRF bypass Server Actions): **resuelto** con Next.js 16.2.9
- Sentry PII masking: activo para usuarios menores

---

## 8. Evaluación por Dimensión

| Dimensión | Puntaje | Justificación |
|-----------|---------|---------------|
| **Stack tecnológico** | 9/10 | Moderno, bien elegido, sin deuda técnica |
| **Arquitectura de código** | 8/10 | Capas bien separadas, Server Actions con guards |
| **Seguridad** | 8/10 | Post-auditoría: OWASP cubierto, headers correctos |
| **Modelo educativo** | 8/10 | 14 tipos de actividad, offline, gamificación |
| **Base de datos** | 7/10 | RLS correcto, índices adecuados; le falta escuela_id |
| **White-label / Branding** | 3/10 | 1,336 colores hardcoded, 54 strings de marca |
| **Multi-tenencia** | 2/10 | Solo preparatoria (escuela_id no en schema) |
| **CMS / Admin de contenido** | 2/10 | No existe; todo requiere deploy |
| **Internacionalización** | 1/10 | No hay infraestructura i18n |
| **Documentación técnica** | 5/10 | Código auto-documentado; sin arquitectura escrita |

**Promedio ponderado: 6.5 / 10**

---

## 9. Roadmap para Convertirla en Plantilla White-Label

### Fase 1 — Branding Configurable (3-4 días)
- Crear `src/config/branding.ts` con variables de entorno
- Refactorizar `Navbar`, `Sidebar`, `Footer`, `layout.tsx` para leer de branding config
- Consolidar colores en CSS variables (eliminar hex inline)
- Parametrizar assets de logo via config

### Fase 2 — Multi-Tenencia Básica (1 semana)
- Agregar tabla `instituciones` con `branding` JSONB
- Agregar `escuela_id` a `profiles`, `grupos`, `intentos`, `progress`
- Actualizar todas las RLS policies para filtrar por `escuela_id`
- Middleware: extraer tenant del subdominio y propagarlo via header

### Fase 3 — Rate Limiting Distribuido (1 día)
- Reemplazar `src/lib/rate-limiter.ts` con cliente Upstash Redis

### Fase 4 — CMS Básico de Contenido (3-4 semanas)
- Editor de quizzes (CRUD de preguntas desde admin)
- Configurador de simuladores (fórmulas + variables)
- Gestión de unidades y pilares desde DB (no JSON/código)
- Preview de actividad antes de publicar

### Fase 5 — Onboarding de Nuevo Cliente (2-3 días por cliente)
- Script de migración para nuevo tenant (seed instituciones)
- Configuración de env vars por cliente
- Swap de assets de marca
- Configuración de dominio personalizado en Vercel

**Total para plantilla completa: 5-7 semanas**  
**Costo por cliente adicional después: 2-3 días**

---

## 10. Veredicto Final

**¿Vale la pena como plantilla?** Sí.

La arquitectura subyacente es sólida: stack moderno sin deuda técnica, seguridad correcta, modelo educativo rico (14 tipos de actividad), offline resilience, y una base de datos bien diseñada. Los gaps (branding hardcoded, multi-tenencia ausente, sin CMS) son importantes pero son gaps de funcionalidad — no de diseño. Se pueden agregar sin romper lo existente.

El riesgo principal al prospectar como white-label es subestimar el esfuerzo: no es una plataforma lista para white-label hoy, es una plataforma que puede convertirse en plantilla white-label en 5-7 semanas de trabajo focalizado.

---

*Evaluación realizada el 10 de junio de 2026. Análisis técnico asistido por Claude Sonnet 4.6 (Anthropic).*
