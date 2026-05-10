/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Declaramos la fuente oficial para que funcione en toda la app
      fontFamily: {
        epilogue: ["var(--font-epilogue)", "sans-serif"],
      },
      // Dejamos registrados los colores institucionales de Luminar/CEN como estándar
      colors: {
        cen: {
          blue:   "#011C40",   // Ocean Blue
          orange: "#FF8C00",   // Vibrant Orange
          cyan:   "#42E8E0",   // Cyan Accents
          navy:   "#1a1a2e",   // Casi Negro (texto principal)
          dark:   "#2d2d1e",   // Oliva Oscuro (strips top/bottom)
          cream:  "#F5F2ED",   // Beige/Crema suave para el fondo de la plataforma
          bg:     "#F9FAFB",   // Fondo principal claro
        }
      }
    },
  },
  plugins: [],
};