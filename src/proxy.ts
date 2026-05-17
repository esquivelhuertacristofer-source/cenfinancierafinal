import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkLoginRateLimit } from './lib/rate-limiter';

const PROTECTED_PREFIXES = ['/hub', '/dashboard'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate-limit login page to mitigate brute-force
  if (pathname === '/log-in' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const { allowed } = checkLoginRateLimit(`login:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera 15 minutos.' },
        { status: 429 }
      );
    }
  }

  // Auth guard: redirect unauthenticated users away from protected routes.
  // cen_session is set in log-in/page.tsx after successful Supabase login.
  if (PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    if (!request.cookies.get('cen_session')) {
      return NextResponse.redirect(new URL('/log-in', request.url));
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://i.pravatar.cc",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://vitals.vercel-insights.com https://vercel.live",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
};
