import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: 'standalone',
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

export default withSentryConfig(nextConfig, {
  // Silent during CI to avoid noise
  silent: !process.env.CI,

  // Use tunnel to bypass ad blockers
  tunnelRoute: "/monitoring",

  // Source maps: upload to Sentry, then delete from the build to prevent exposure
  sourcemaps: {
    disable: false,
    deleteSourcemapsAfterUpload: true,
  },

  // Annotate React components for better error context
  reactComponentAnnotation: {
    enabled: true,
  },

  // Don't auto-instrument Vercel Cron (we manage that manually)
  automaticVercelMonitors: false,
});
