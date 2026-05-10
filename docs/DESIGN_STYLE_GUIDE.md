# DESIGN SYSTEM: CEN Academy v2.0
## Estética "Refined Classic"

Este documento define las reglas visuales, conceptuales y estructurales para la reconstrucción total de la plataforma.

---

### 🚀 CONCEPTO DEL PROYECTO
**CEN Academy v2.0** es un ecosistema de inteligencia financiera diseñado específicamente para **niños (Primaria)** y **jóvenes (Secundaria)**. El objetivo es transformar conceptos complejos de economía en una experiencia de aprendizaje gamificada, visualmente impactante y fácil de digerir.

- **Público Objetivo**: Estudiantes de 6 a 15 años.
- **Tono**: Institucional Premium (genera confianza) pero Amigable y Vibrante (genera compromiso).
- **ADN**: "Refined Classic" – Una estética limpia que se aleja de los estilos oscuros/gaming para abrazar un look de software profesional educativo de alto nivel.

---

### 🏗️ ESTRUCTURA DEFINIDA (Product Layout)

El diseñador debe respetar este flujo y jerarquía visual:

1.  **Landing Page Elite**:
    *   **Hero**: Comunicación directa sobre el poder del dinero.
    *   **Bento Grid de Grados**: Acceso visual a 6 años de Primaria y 3 de Secundaria.
2.  **Hub de Ejercicios (Dashboard)**:
    *   Una galería de tarjetas (Cards) por cada unidad didáctica.
    *   **Navegación por Iconos**: Cada card debe presentar 4 iconos clave para acceso inmediato:
        - 🎥 (Video) | 📖 (Lectura) | 🖨️ (Imprimible) | 📘 (Guía)
3.  **Visualizador de Contenido (Player)**:
    *   Interfaz minimalista centrada en el contenido (YouTube embed o Visor PDF).
    *   Navegación secuencial: Botones claros de "Anterior" y "Siguiente".

---

---

### 1. PALETA DE COLORES (Institutional & Vibrant)
- **Primary Blue (Azul CEN)**: `#011C40`
  - Uso: Headers, Títulos principales, Botones primarios.
- **Action Orange (Naranja CEN)**: `#FF8C00`
  - Uso: CTAs, Acentos, Hover effects, Mascota.
- **Modern Cyan (Cian CEN)**: `#42E8E0`
  - Uso: Detalles tecnológicos, iconos secundarios, gradientes.
- **Neutral Background**: `#F9FAFB` (Fondo principal claro).
- **Surface/Cards**: `#FFFFFF` (Blanco puro con sombras suaves).

---

### 2. TIPOGRAFÍA (Modern & Bold)
- **Fuente Principal**: **Epilogue** (Google Fonts).
- **H1 (Hero)**: `font-black (900)`, `tracking-tighter`, `leading-[0.9]`.
- **H2/H3 (Cards)**: `font-black (800)`, `tracking-tight`.
- **Cuerpo**: `font-medium (500)`, color `text-cen-blue/60`.

---

### 3. ELEMENTOS DE UI (Premium Patterns)
- **Bordes**: `rounded-[2rem]` (32px) para contenedores y botones grandes.
- **Sombras**: 
  - `shadow-premium`: `0 20px 40px rgba(1, 28, 64, 0.08)`
  - `shadow-glow`: `0 0 20px rgba(66, 232, 224, 0.2)`
- **Efectos**:
  - **Glassmorphism**: `bg-white/70 backdrop-blur-xl border-white/20`.
  - **Grid Asimétrico**: Uso de Bento Grids con diferentes `col-span` (2x2, 2x1, 1x1).

---

### 4. ICONOGRAFÍA (Quick Action Hub)
Para el Hub de ejercicios, usar Lucide Icons con los siguientes colores:
- 🎥 **Video**: `text-cen-blue`
- 📖 **Lectura**: `text-cen-cyan`
- 🖨️ **Imprimible**: `text-cen-orange`
- 📘 **Guía**: `text-cen-blue/40`

---

### 5. TONO DE VOZ VISUAL
- **Institucional pero Divertido**: El uso de fondos blancos y tipografía pesada da seriedad, mientras que los activos 3D y el naranja dan la amigabilidad necesaria para el público infantil/juvenil.
