# PROJECT BRIEF: CEN Academy v2.0
## AI Integration & Evaluation Document

Este documento proporciona el contexto completo para que Claude Code u otros asistentes puedan evaluar y continuar el desarrollo de la plataforma.

---

### 1. RESUMEN EJECUTIVO
- **Producto**: CEN Academy v2.0 (Plataforma de Educación Financiera).
- **Propietario**: Luminar Studio (Software White-label).
- **Meta**: Reemplazar MVP de Framer con una arquitectura escalable en Next.js y Supabase v2.
- **Estética**: "Refined Classic" (Institucional, Blanco, Azul #011C40, Naranja #FF8C00).

---

### 2. ARQUITECTURA TÉCNICA
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Supabase v2 (PostgreSQL + RLS + Auth).
- **Assets**: Mascotas 3D Soft (CENy) e iconografía personalizada para tipos de contenido.
- **Contenido**: Modular (~360 lecciones), organizado por Grado (Primaria 1-6, Secundaria 1-3).

---

### 3. FLUJO DE USUARIO (UX PATH)
1. **Landing Page**: Publica, con Bento Grid para selección de nivel educativo.
2. **Login Auth**: Redirección basada en `school_level` y `grade`.
3. **Exercise Hub**: Dashboard con Cards de lecciones. Cada card tiene 4 iconos de acceso rápido:
   - 🎥 **Video**: YouTube Embed.
   - 📖 **Lectura**: Visor de PDF/Digital.
   - 🖨️ **Imprimible**: Recursos descargables.
   - 📘 **Guía**: Material de soporte.
4. **Learning Player**: Vista simplificada para consumo de contenido con navegación "Anterior/Siguiente".

---

### 4. ESQUEMA DE DATOS (SUPABASE)
- **`public.profiles`**: `id`, `full_name`, `school_level` (enum), `grade`.
- **`public.lessons`**: `id`, `title`, `level`, `grade`, `unit_number`.
- **`public.lesson_contents`**: `id`, `lesson_id`, `category` (video, didactic, printable, guide), `url`, `config`.
- **`public.user_progress`**: `user_id`, `content_id`, `completed` (boolean), `score`.

---

### 5. ESTADO ACTUAL DEL PROYECTO
- **Landing Page**: Maqueta visual completa en el estilo "Refined Classic".
- **Branding**: Logo y Mascota CENy integrados.
- **Base de Datos**: Script `supabase/schema.sql` definido (listo para ejecutar).
- **Redirección**: Lógica de Hub con iconos implementada en las grillas de la Landing.

---

### 6. PRÓXIMOS PASOS RECOMENDADOS
1. Implementar `src/app/log-in/page.tsx` con la lógica de redirección por nivel.
2. Construir el componente `ExerciseHub` que renderice las lecciones según el grado del perfil.
3. Desarrollar el `ContentModal` o `PlayerView` para mostrar los videos de YouTube y PDFs.
4. Configurar el sistema de guardado de progreso en Supabase.
