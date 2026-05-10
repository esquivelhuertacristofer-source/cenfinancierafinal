import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/activity/[activityId]': ['./src/data/actividades/**/*.json'],
    '/api/curriculum/[levelGrade]': ['./src/data/pedagogia/**/*.json'],
  },
};

export default nextConfig;
