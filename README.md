# CEN - Plataforma de Educación Financiera

## Descripción
Plataforma educativa para enseñanza de finanzas personales a estudiantes de educación media y superior en México.

## Tecnologías
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Testing**: Jest + React Testing Library

## Requisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start
```

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |

## Estructura del Proyecto

```
src/
├── app/                 # Páginas Next.js App Router
│   ├── academia/       # Ruta de cursos
│   ├── dashboard/      # Panel docente
│   └── log-in/         # Autenticación
├── components/         # Componentes React
│   ├── Navbar.tsx
│   ├── BotonProgreso.tsx
│   └── SecureGame.tsx
├── lib/               # Utilidades
│   ├── supabase.ts    # Cliente Supabase
│   ├── accessibility.ts # Utilidades WCAG
│   └── logger.ts      # Sistema de logging
```

## Testing

```bash
# Instalar dependencias de testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm run test

# Coverage
npm run test -- --coverage
```

## Accesibilidad
La plataforma implementa:
- Roles ARIA válidos
- Navegación por teclado
- Contraste de colores WCAG AA
- Skip links para lectores de pantalla

## Licencia
Propiedad de CEN - Centro de Educación Nacional
