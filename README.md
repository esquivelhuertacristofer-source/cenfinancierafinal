# CEN Academy — Plataforma de Educación Financiera

Plataforma web para educación financiera dirigida a estudiantes de Primaria (P1–P6) y Secundaria (S1–S3) en México.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Frontend | React 19.2.3, Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Backend | Supabase v2 (PostgreSQL + RLS + Auth) |
| Deploy | Cloudflare Workers vía OpenNext (`@opennextjs/cloudflare` + `wrangler`) |

---

## Variables de Entorno Requeridas

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
```

**Importante:** Nunca versionar `.env.local`. Está en `.gitignore`.

Para desarrollo local contra el runtime de Cloudflare (`npm run cf:preview`), las variables/secretos se leen desde un archivo `.dev.vars` en la raíz (también gitignored) en vez de `.env.local`. En producción, los secretos (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.) se cargan con `wrangler secret put <NOMBRE>` — nunca se escriben en `wrangler.jsonc`. Ver `docs/SEGURIDAD-PENDIENTES.md` para el procedimiento completo de rotación de secretos.

---

## Cómo Correr en Local

```bash
# Instalar dependencias
npm install

# Desarrollo (Turbopack)
npm run dev

# Build de producción con webpack (recomendado para verificar antes de deploy)
npx next build --webpack

# Servidor de producción local
npm start
```

---

## Cómo Deployar

> **Migración:** el proyecto se movió de Vercel a **Cloudflare Workers** el 2026-07-08 (se perdió el acceso a la cuenta de Vercel). El build usa [OpenNext](https://opennext.js.org/cloudflare) para adaptar Next.js al runtime de Cloudflare Workers, y `wrangler` para publicar. No hay auto-deploy desde GitHub configurado todavía — el deploy es manual vía CLI.

1. Verificar que las variables de entorno estén configuradas (ver sección siguiente).
2. Build + deploy en un solo paso:
   ```bash
   npm run cf:deploy
   ```
   Esto ejecuta `opennextjs-cloudflare build` (compila Next.js y genera el Worker) seguido de `opennextjs-cloudflare deploy` (publica con `wrangler`).
3. Otros comandos útiles:
   ```bash
   # Solo build (sin publicar), útil para inspeccionar el Worker generado
   npm run cf:build

   # Build + servidor local que simula el runtime de Cloudflare
   npm run cf:preview
   ```
4. Configuración del Worker (nombre, rutas de dominio custom, bindings de KV, etc.) vive en `wrangler.jsonc`.
5. **Rollback:** si un deploy introduce un problema en producción, revertir a la versión anterior con:
   ```bash
   npx wrangler rollback
   ```
   Este comando vuelve al último deployment estable sin necesidad de rehacer el build. Ver también `docs/SEGURIDAD-PENDIENTES.md` para el procedimiento detallado de rollback y rotación de secretos.

**Nota histórica:** el `vercel.json` que pueda seguir presente en el repo es un remanente de la configuración anterior en Vercel y ya no tiene efecto en el flujo de deploy actual.

---

## Estructura de Carpetas

```
src/
├── app/                    # Rutas Next.js (App Router)
│   ├── page.tsx            # Landing page
│   ├── log-in/             # Autenticación (redirige por rol)
│   ├── hub/                # Dashboard del estudiante
│   │   ├── page.tsx        # Hub principal
│   │   ├── actividad/[id]/ # Renderer de actividad individual
│   │   ├── portal/         # Portal de entrada
│   │   ├── logros/         # Logros
│   │   ├── library/        # Biblioteca
│   │   └── mission/        # Misiones
│   ├── dashboard/
│   │   ├── teacher/        # Dashboard del profesor (requiere rol teacher)
│   │   ├── primary/        # Redirect al hub
│   │   └── secondary/      # Redirect al hub
│   ├── admin/               # Administración multi-escuela (ver sección propia abajo)
│   │   ├── escuelas/        # Onboarding de escuelas nuevas
│   │   └── usuarios/        # Gestión de usuarios y grupos por escuela
│   ├── actions/
│   │   └── adminActions.ts  # Server Actions de administración (validan rol server-side)
│   └── api/
│       ├── curriculum/[levelGrade]/ # GET currículum por grado
│       └── activity/[activityId]/  # GET actividad por ID
├── components/
│   ├── activities/         # 14 renderers de actividad
│   ├── dashboard/          # Componentes teacher
│   ├── hub/                # Componentes hub estudiante
│   ├── landing/            # Landing page
│   └── ui/                 # Genéricos
├── data/
│   ├── pedagogia/          # JSONs curriculares (p1-p6, s1-s3)
│   └── actividades/        # 364 actividades JSON
├── lib/
│   ├── supabase.ts         # Cliente Supabase
│   └── hub.ts              # SyncEngine + funciones de progreso
└── types/
    └── activities.ts       # TypeScript types
```

---

## Tipos de Actividad (14 implementados)

`SIMULADOR` · `QUIZ` · `TRIVIA` · `ARRASTRA` · `DECIDE` · `CONSTRUCTOR` · `JUEGO` · `RULETA` · `RELLENA` · `MEMORIA` · `BALANCE` · `RADAR` · `CRECIMIENTO` · `CONTROL`

Cada tipo tiene un componente renderer en `src/components/activities/`.

---

## Flujo de Usuario

1. **Landing** → `/` — Selección de nivel educativo
2. **Login** → `/log-in` — Redirección automática por rol:
   - `teacher` → `/dashboard/teacher`
   - `student` → `/hub`
3. **Hub** → `/hub` — 4 pilares temáticos con actividades
4. **Actividad** → `/hub/actividad/[id]`

---

## Administración Multi-Escuela

La plataforma incluye un panel de administración institucional en `src/app/admin/`, orientado a operar varias escuelas desde una sola instancia:

- **`/admin/escuelas`** — Onboarding de escuelas nuevas: alta de la escuela, carga masiva de alumnos/profesores vía CSV (plantilla descargable), creación automática de cuentas y generación de un PDF de credenciales (usuario/contraseña) listo para repartir por grupo. También muestra estadísticas por escuela (alumnos, profesores, grupos).
- **`/admin/usuarios`** — Gestión de usuarios y grupos dentro de una escuela: alta individual o masiva (CSV) de alumnos/profesores, creación de grupos por grado, y exportación de credenciales en PDF.

Las acciones sensibles (`onboardInstitutionalUsers`, `createGrupo`, `getGrupos`, `getEscuelas`, `onboardEscuela`) están implementadas como Server Actions en `src/app/actions/adminActions.ts` y validan la sesión y el rol del usuario en el servidor (`requireAdminSession()`, ver `src/lib/supabase-server.ts`) antes de tocar la `service_role key` de Supabase — el cliente nunca recibe esa key.

---

## Cuentas de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `profesor.prueba@cen.edu` | `diamondmaster` | teacher |
| `estudiante.prueba@cen.edu` | `diamondmaster` | student |

---

## Paleta de Marca

| Nombre | Hex | Uso |
|--------|-----|-----|
| Azul CEN | `#011C40` | Color principal, títulos |
| Naranja CEN | `#FF8C00` | CTAs, acentos activos |
| Cyan CEN | `#42E8E0` | Detalles tecnológicos |
| Fondo CEN | `#F4F1EA` | Fondo general |

---

## Bugs Conocidos

1. **BuilderActivity**: `calculos_automaticos` no ejecuta en tiempo real (ver `docs/DEUDA-TECNICA.md`)
2. **Turbopack**: Usar `--webpack` para builds locales de verificación
3. **Academia**: Rutas `/academia/*/bloque*` son stubs sin contenido

---

## Documentación

- [`docs/DESIGN_STYLE_GUIDE.md`](docs/DESIGN_STYLE_GUIDE.md) — Sistema de diseño
- [`docs/AUDITORIA-PEDAGOGICA.md`](docs/AUDITORIA-PEDAGOGICA.md) — Estado del contenido pedagógico
- [`docs/DEUDA-TECNICA.md`](docs/DEUDA-TECNICA.md) — Deuda técnica pendiente
- [`docs/ACTIVIDADES_UPGRADE_V2.md`](docs/ACTIVIDADES_UPGRADE_V2.md) — Mejoras de actividades planificadas
- [`supabase/schema.sql`](supabase/schema.sql) — Schema de base de datos
