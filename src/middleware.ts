import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { checkLoginRateLimit } from './lib/rate-limiter';

// NOTA: convención middleware.ts (edge) en lugar de proxy.ts (Node) —
// OpenNext/Cloudflare Workers no soporta el middleware con runtime Node de Next 16.

const PROTECTED_PREFIXES = ['/hub', '/dashboard', '/admin'];

// Rutas de alto volumen (cada navegación de cada alumno/profesor): se verifican
// localmente contra SUPABASE_JWT_SECRET en vez de pagar un round-trip de red a
// Supabase Auth en cada request. /admin se queda con getUser() (ver más abajo)
// porque ahí sí importa detectar en el momento a un usuario baneado/eliminado.
const LOCAL_VERIFY_PREFIXES = ['/hub', '/dashboard'];

let cachedJwtSecretKey: Uint8Array | null = null;
function getJwtSecretKey(): Uint8Array | null {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) return null;
  if (!cachedJwtSecretKey) cachedJwtSecretKey = new TextEncoder().encode(secret);
  return cachedJwtSecretKey;
}

// Verifica firma HS256 + expiración + audience sin llamar a Supabase Auth.
// Trade-off aceptado: no detecta revocación instantánea (ban/borrado) — el
// token sigue siendo válido localmente hasta que expira (~1h). Aceptable para
// navegación en /hub y /dashboard; por eso /admin no usa esta ruta.
async function verifyAccessTokenLocally(accessToken: string): Promise<boolean> {
  const secretKey = getJwtSecretKey();
  if (!secretKey) return false;
  try {
    const { payload } = await jwtVerify(accessToken, secretKey, { algorithms: ['HS256'] });
    return payload.aud === 'authenticated';
  } catch {
    return false;
  }
}

function buildCSP(isLocalhost: boolean): string {
  return [
    "default-src 'self'",
    // unsafe-eval removed (SEC-006 gain). Nonce approach abandoned: browsers ignore
    // 'unsafe-inline' when a nonce is also present (CSP Level 3), which re-breaks
    // Next.js hydration. Plain 'unsafe-inline' is required until nonce propagation
    // is properly wired through the RSC layout.
    // static.cloudflareinsights.com: beacon de Cloudflare Web Analytics que el
    // proxy inyecta automáticamente en el HTML de la zona (reporta a
    // cloudflareinsights.com vía connect-src).
    // 'unsafe-eval' SOLO en desarrollo: Fast Refresh de Next (webpack dev) compila
    // con eval(), y sin este permiso el bundle del cliente lanza EvalError y la app
    // NO hidrata — 'next dev' queda completamente inerte, sin un solo clic que
    // funcione. Producción conserva el endurecimiento de SEC-006 intacto.
    [
      "script-src 'self' 'unsafe-inline'",
      ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
      'https://static.cloudflareinsights.com',
    ].join(' '),
    // Google Fonts loaded via @import in globals.css requires googleapis.com in style-src
    // and gstatic.com in font-src.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com",
    "media-src 'self' https://assets.mixkit.co",
    "object-src 'none'",
    // 'self' es indispensable: el Juego Financiero (GDevelop) se sirve desde
    // /games/juego-financiero/ y se monta en un iframe del hub.
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // upgrade-insecure-requests rompe iframes/redirects locales al forzar
    // https://localhost, que no existe. Solo aplica fuera de localhost.
    ...(isLocalhost ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

function applySecurityHeaders(response: NextResponse, isProtectedRoute: boolean, isLocalhost: boolean): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Content-Security-Policy', buildCSP(isLocalhost));
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, private');
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Canónica www: el apex redirige a www (paridad con el hosting anterior;
  // metadataBase y las URLs públicas usan www).
  const host = request.headers.get('host');
  if (host === 'cenplataformaeducacionfinanciera.com.mx') {
    const url = request.nextUrl.clone();
    url.host = 'www.cenplataformaeducacionfinanciera.com.mx';
    return NextResponse.redirect(url, 308);
  }

  // Generate per-request nonce for CSP.
  // The nonce is forwarded as x-nonce in the request headers so that
  // layout.tsx (and any async Server Component) can read it via headers().
  // btoa (not Buffer): edge/Workers-safe, randomUUID is ASCII.
  const nonce = btoa(crypto.randomUUID());

  // Build a mutable copy of request headers containing the nonce.
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('x-nonce', nonce);

  // Rate-limit login POSTs to mitigate brute-force (legacy guard — the real
  // rate limiting is in loginAction Server Action, see authActions.ts).
  if (pathname === '/log-in' && request.method === 'POST') {
    // cf-connecting-ip es inyectado por el borde de Cloudflare y no puede ser
    // falsificado por el cliente (a diferencia de x-forwarded-for, que
    // Cloudflare solo APPEND-ea, así que un cliente puede anteponer valores
    // arbitrarios para que split(',')[0] devuelva una IP falsa y así rotar
    // el bucket de rate limiting en cada intento).
    const ip = request.headers.get('cf-connecting-ip')
      ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? 'unknown';
    const { allowed } = await checkLoginRateLimit(`login:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera 15 minutos.' },
        { status: 429 }
      );
    }
  }

  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const hostname = request.nextUrl.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  // Páginas públicas (marketing, /log-in, /academia, etc.) nunca necesitan
  // sesión: nos saltamos por completo el round-trip a Supabase para que no
  // dependan de su disponibilidad/latencia. Esto también evita que un
  // crawler de vista previa (WhatsApp/Facebook) se quede esperando la
  // respuesta y descarte la miniatura por timeout.
  if (!isProtectedRoute) {
    const response = NextResponse.next({ request: { headers: reqHeaders } });
    applySecurityHeaders(response, false, isLocalhost);
    return response;
  }

  // Supabase session passthrough: propagates cookie refreshes across the response.
  // IMPORTANT: do not add logic between createServerClient and getUser().
  // We pass reqHeaders (with x-nonce) so that the layout can read the nonce.
  let supabaseResponse = NextResponse.next({ request: { headers: reqHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // secure: true — ver comentario en src/lib/supabase-server.ts. Debe
      // coincidir en los 3 sitios que instancian un cliente Supabase con
      // cookies (aquí, supabase-server.ts y supabase-browser.ts) o el
      // navegador podría rechazar un refresh de cookie escrito con una
      // combinación de atributos distinta a la que ya tiene guardada.
      cookieOptions: { secure: true },
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

  // Validar sesión — redirige a usuarios no autenticados fuera de rutas protegidas.
  // /hub y /dashboard: verificación JWT local (sin red) si SUPABASE_JWT_SECRET está
  // configurado. /admin, o si el secret aún no está provisionado: getUser() de red
  // (más lento, pero detecta revocación al instante — ver comentario arriba).
  const isLocalVerifyRoute = LOCAL_VERIFY_PREFIXES.some(prefix => pathname.startsWith(prefix));
  let authenticated: boolean;

  if (isLocalVerifyRoute && getJwtSecretKey()) {
    const { data: { session } } = await supabase.auth.getSession();
    authenticated = session ? await verifyAccessTokenLocally(session.access_token) : false;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    authenticated = !!user;
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  applySecurityHeaders(supabaseResponse, true, isLocalhost);
  return supabaseResponse;
}

export const config = {
  // games/ excluido: son estáticos del juego GDevelop; si el middleware les
  // aplicara X-Frame-Options: DENY / frame-ancestors 'none', el navegador
  // rechazaría montarlos en el iframe del hub.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/|games/).*)'],
};
