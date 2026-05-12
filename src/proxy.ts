import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/hub', '/dashboard'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth guard: redirect unauthenticated users away from protected routes.
  // cen_session is set in log-in/page.tsx after successful Supabase login.
  if (PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    if (!request.cookies.get('cen_session')) {
      return NextResponse.redirect(new URL('/log-in', request.url));
    }
  }

  const response = NextResponse.next();

  // Security headers for enterprise compliance
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
};
