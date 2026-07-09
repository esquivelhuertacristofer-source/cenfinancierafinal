import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Librerías que solo se ejecutan en el navegador, excluidas del bundle
      // del servidor (límite 3 MiB gzip del Worker en plan free de Cloudflare):
      // - jspdf: solo se instancia en handlers de click (descargas de PDF).
      // - mathjs/recharts: solo en SimulatorActivity/BuilderActivity, que se
      //   montan con dynamic(..., { ssr: false }).
      config.resolve.alias = {
        ...config.resolve.alias,
        jspdf: false,
        mathjs: false,
        recharts: false,
      };
    }
    return config;
  },
};

// Sentry eliminado (2026-07-08): nunca tuvo DSN configurado (inerte) y su SDK
// de servidor (+OpenTelemetry) inflaba el Worker de Cloudflare por encima del
// límite de 3 MiB gzip del plan free.
export default nextConfig;
