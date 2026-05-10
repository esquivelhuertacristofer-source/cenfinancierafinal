# MANUAL TÉCNICO
## Campaña Educativa Nacional - Plataforma de Educación Financiera

**Derechos Patrimoniales**: CEN - Centro de Educación Nacional  
**Diseñada e implementada por**: Luminar Studio

---

## 1. Información del Proyecto

### 1.1 Descripción
La **Campaña Educativa Nacional** es una plataforma educativa digital modular, editable y adaptable a cualquier branding o label empresarial. Fue diseñada para la enseñanza de finanzas personales a estudiantes de educación media y superior en México.

### 1.2 Características Principales
- **Modular**: Arquitectura de componentes independientes
- **Editable**: Fácil personalización de contenidos
- **Adaptable**: Soporte para múltiples identidades visuales (branding)
- **Escalable**: Construida con Next.js 16 y Supabase

---

## 2. Arquitectura del Sistema

### 2.1 Visión General
CEN es una aplicación web desarrollada con **Next.js 16** utilizando el **App Router**, con autenticación y base de datos en **Supabase** (PostgreSQL).

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Navegador    │────▶│   Next.js 16    │────▶│    Supabase     │
│   (Frontend)   │◀────│   (Backend)     │◀────│  (DB + Auth)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 2.2 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | Next.js | 16.1.6 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.x |
| Base de datos | PostgreSQL (Supabase) | 15+ |
| Autenticación | Supabase Auth | - |
| Testing | Jest | 29.x |
| UI Testing | React Testing Library | 14.x |

---

## 3. Estructura del Proyecto

```
luminar-enterprise-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage (/)
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Estilos globales
│   │   ├── academia/          # Ruta de cursos
│   │   │   ├── [segmentoId]/ # Segmentos dinámicos
│   │   │   └── ...           # Páginas de bloques
│   │   ├── dashboard/         # Panel docente
│   │   └── log-in/           # Autenticación
│   ├── components/            # Componentes React
│   │   ├── Navbar.tsx       # Navegación principal
│   │   ├── BotonProgreso.tsx # Botón de progreso
│   │   └── SecureGame.tsx   # Juegos educativos
│   └── lib/                  # Utilidades
│       ├── supabase.ts       # Cliente Supabase
│       ├── accessibility.ts  # Utilidades WCAG
│       └── logger.ts        # Sistema de logging
├── public/                   # Archivos estáticos
├── docs/                    # Documentación
├── jest.config.ts          # Configuración de tests
├── jest.setup.ts           # Mocks para tests
├── next.config.ts          # Configuración de Next.js
├── tailwind.config.ts     # Configuración de Tailwind
└── tsconfig.json           # Configuración de TypeScript
```

---

## 4. Personalización y Branding

### 4.1 Sistema de Temas
La plataforma utiliza **Tailwind CSS** con variables de diseño que permiten personalización rápida:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#0980E8',    // Color principal
        secondary: '#22D3EE',  // Color secundario
        accent: '#FF9500',      // Color de acento
      },
    },
  },
}
```

### 4.2 Elementos Modificables
- **Colores**: Todos los colores definidos en Tailwind
- **Logos**: Archivos en `/public/`
- **Textos**: Contenido en páginas `app/`
- **Componentes**: Bloques de React reutilizables

### 4.3 Adaptación para Empresas
Para adaptar la plataforma a otro cliente:
1. Modificar `tailwind.config.ts` con colores corporativos
2. Reemplazar logos en `/public/`
3. Actualizar textos en las páginas
4. Configurar dominio y variables de entorno

---

## 5. Base de Datos (Supabase)

### 5.1 Esquema de Tablas

#### Tabla: `profiles`
Almacena información extendida de usuarios.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | FK a auth.users |
| `role` | text | 'student', 'teacher', 'admin' |
| `full_name` | text | Nombre completo |
| `group_id` | uuid | Grupo asignado |

#### Tabla: `progress`
Registra el progreso de estudiantes en lecciones.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | PK auto-generado |
| `user_id` | uuid | FK a auth.users |
| `activity_id` | text | ID de la actividad/lección |
| `created_at` | timestamp | Fecha de completación |

### 5.2 Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Política: usuarios ven solo su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política: usuarios registran solo su propio progreso
CREATE POLICY "Users create own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: docentes ven todo el progreso
CREATE POLICY "Teachers view all progress" ON progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );
```

---

## 6. Autenticación

### 6.1 Flujo de Autenticación
1. Usuario accede a `/log-in`
2. Sistema presenta formulario de login/registro
3. Supabase Auth valida credenciales
4. Sesión se guarda en cookies seguras
5. Redirección a página correspondiente

### 6.2 Roles de Usuario

| Rol | Acceso |
|-----|--------|
| `student` | Cursos, progreso propio |
| `teacher` | + Dashboard, ver progreso de estudiantes |
| `admin` | + Gestión de usuarios, configuración |

---

## 7. Componentes Principales

### 7.1 Navbar.tsx
Navegación principal con estado de autenticación.

```typescript
interface NavbarProps {
    activeSection?: "inicio" | "primeros-pasos" | 
                   "construyendo-independencia" | 
                   "planificacion" | "hora-de-emprender";
}
```

### 7.2 BotonProgreso.tsx
Botón para registrar completación de lecciones.

### 7.3 SecureGame.tsx
Contenedor seguro para juegos educativos con sandbox.

---

## 8. Rutas y Páginas

### 8.1 Estructura de Rutas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Static | Homepage |
| `/log-in` | Static | Login/Registro |
| `/dashboard` | Static | Panel docente |
| `/academia/[segmentoId]` | Dynamic | Contenido de segmento |
| `/academia/[segmentoId]/[leccionId]` | Dynamic | Contenido de lección |

### 8.2 Segmentos Disponibles
- `primeros-pasos` (7 bloques)
- `construyendo-independencia` (5 bloques)
- `planificacion` (3 bloques)
- `hora-de-emprender` (5 bloques)

---

## 9. Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Configuración
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 10. Sistema de Logging

### 10.1 Niveles
- `DEBUG`: Información detallada
- `INFO`: Eventos normales
- `WARN`: Situaciones anómalas
- `ERROR`: Errores

### 10.2 Contextos
- AUTH, DATABASE, API, UI, SECURITY, PROGRESS

---

## 11. Testing

```bash
# Instalar dependencias
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm run test

# Coverage
npm run test -- --coverage
```

---

## 12. Accesibilidad WCAG 2.1

- Roles ARIA válidos
- Labels para lectores de pantalla
- Skip links para navegación por teclado
- Regiones live para actualizaciones dinámicas

---

## 13. Build y Despliegue

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start
```

---

## 14. Seguridad

- Autenticación con Supabase Auth
- Row Level Security en todas las tablas
- Sandboxed iframes para contenido externo
- Variables de entorno para secrets

---

## 15. Mantenimiento

### Tareas Regulares
- Actualizar dependencias: `npm update`
- Ejecutar tests antes de cada release
- Revisar logs de producción
- Backup de base de datos (Supabase)

---

**Versión del documento**: 1.1  
**Plataforma**: Campaña Educativa Nacional - CEN  
**Desarrollada por**: Luminar Studio  
**Última actualización**: 2026
