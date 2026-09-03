import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * `<img>` en vez de `next/image`, a proposito.
       *
       * La regla existe porque `next/image` convierte a webp/avif y redimensiona sobre la marcha.
       * Aqui eso no pasa: la plataforma corre en Cloudflare Workers con OpenNext, y su endpoint
       * `/_next/image` devuelve el archivo original tal cual. Comprobado el 2026-09-03 contra
       * produccion: pedir ceny-guide.png por el optimizador responde 200 con content-type
       * image/png, no image/webp.
       *
       * O sea que cambiar las 63 imagenes daria el mismo byte por la red, y a cambio habria que
       * ponerle `fill` y un padre posicionado a cada adorno de fondo, en una plataforma que ya
       * esta en manos de alumnos. Lo que si aportaria `next/image` —carga diferida y reserva de
       * espacio— ya lo dan el atributo `loading` y las clases de tamanio fijo de Tailwind.
       *
       * Si algun dia se activa Cloudflare Images (de pago) o se configura un loader propio, esta
       * decision cambia y la regla debe volver a encenderse.
       */
      '@next/next/no-img-element': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
