import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkLoginRateLimit } from './lib/rate-limiter';

const PROTECTED_PREFIXES = ['/hub', '/dashboard', '/admin'];

function buildCSP(nonce: string): string {
  return [
    "default-src 'self'",
    // 'unsafe-inline' required: Next.js hydration scripts receive nonce="$undefined"
    // (the layout doesn't forward x-nonce to the RSC payload), so 'strict-dynamic'
    // alone blocks all scripts. Keeping 'unsafe-eval' removed is the real gain of
    // SEC-006. The nonce is retained for forward compatibility once nonce propagation
    // is properly implemented in the layout.
    // https://vercel.live kept for Vercel deployment previews.
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://vercel.live`,
    // style-src keeps unsafe-inline: inline styles from Tailwind/Sonner are not
    // executable and the risk profile is much lower than script injection.
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
}

function applySecurityHeaders(response: NextResponse, nonce: string): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Content-Security-Policy', buildCSP(nonce));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate per-request nonce for CSP.
  // The nonce is forwarded as x-nonce in the request headers so that
  // layout.tsx (and any async Server Component) can read it via headers().
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Build a mutable copy of request headers containing the nonce.
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('x-nonce', nonce);

  // Rate-limit login POSTs to mitigate brute-force (legacy guard — the real
  // rate limiting is in loginAction Server Action, see authActions.ts).
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

  // Supabase session passthrough: propagates cookie refreshes across the response.
  // IMPORTANT: do not add logic between createServerClient and getUser().
  // We pass reqHeaders (with x-nonce) so that the layout can read the nonce.
  let supabaseResponse = NextResponse.next({ request: { headers: reqHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Preserve x-nonce when Supabase recreates the response for cookie refresh.
          supabaseResponse = NextResponse.next({ request: { headers: reqHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validate JWT — redirects unauthenticated users from protected routes.
  // Uses getUser() (not getSession()) because getSession() trusts unverified cookies.
  const { data: { user } } = await supabase.auth.getUser();

  if (PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    if (!user) {
      return NextResponse.redirect(new URL('/log-in', request.url));
    }
  }

  applySecurityHeaders(supabaseResponse, nonce);
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
};
