import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware applies security headers to every response.
 * Route protection is handled at the page level via getCurrentProfile()
 * because Supabase stores the session in localStorage (not cookies).
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers for enterprise compliance
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Only add HSTS on HTTPS (Vercel/production)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  // Apply to all routes except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
};
