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
| Deploy | Vercel (auto-deploy en push a `main`) |

---

## Variables de Entorno Requeridas

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
```

**Importante:** Nunca versionar `.env.local`. Está en `.gitignore`.

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

El proyecto usa **Vercel** con auto-deploy desde GitHub:

1. Push a rama `main` → Vercel hace el deploy automáticamente
2. Verificar que las env vars estén configuradas en Vercel Dashboard → Settings → Environment Variables

Para deploy manual:
```bash
npx vercel --prod
```

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
