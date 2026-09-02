'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limiter';
import { logSecurityEvent } from '@/lib/security-logger';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain ?? '?'}`;
}

// Traduce los mensajes de error de Supabase Auth (en inglés y a menudo técnicos)
// a mensajes en español apropiados para usuarios finales (profesores/alumnos).
// Los mensajes conocidos y "accionables" se traducen de forma específica; el
// resto cae a un mensaje genérico para no filtrar detalles internos del backend.
// El mensaje técnico original siempre queda registrado vía logSecurityEvent.
const KNOWN_AUTH_ERRORS: Record<string, string> = {
  'Invalid login credentials': 'Credenciales incorrectas',
  'Email not confirmed': 'Debes confirmar tu correo electrónico antes de iniciar sesión',
  'User already registered': 'Ya existe una cuenta registrada con este correo electrónico',
  'Email rate limit exceeded': 'Se han solicitado demasiados correos. Espera unos minutos e inténtalo de nuevo',
  'Too many requests': 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Signup requires a valid password': 'La contraseña ingresada no es válida',
  'Unable to validate email address: invalid format': 'El formato del correo electrónico no es válido',
  'Token has expired or is invalid': 'El enlace ha expirado o no es válido. Solicita uno nuevo',
  'New password should be different from the old password': 'La nueva contraseña debe ser diferente a la anterior',
  'User not found': 'No existe una cuenta con este correo electrónico',
};

function translateAuthError(message: string | undefined): string {
  if (!message) return 'Error de autenticación. Inténtalo de nuevo.';
  return KNOWN_AUTH_ERRORS[message] ?? 'Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo más tarde.';
}

const LoginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  // Dos checks encadenados: min(1) distingue "campo vacío" de "campo lleno
  // pero corto" — Zod acumula ambos issues cuando el string está vacío y
  // loginAction usa issues[0], así que el orden aquí importa.
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginResult =
  | { success: true; role: string | null }
  | { success: false; error: string };

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  // Validate input
  const parsed = LoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const headerStore = await headers();
  // cf-connecting-ip: header inyectado por el borde de Cloudflare, no
  // falsificable por el cliente. x-forwarded-for es solo APPEND-eado por
  // Cloudflare (no reemplazado), así que un cliente puede anteponer una IP
  // arbitraria para que split(',')[0] devuelva un valor distinto en cada
  // intento y evada el rate limiting por IP de abajo.
  const ip =
    headerStore.get('cf-connecting-ip') ??
    headerStore.get('x-forwarded-for')?.split(',')[0].trim() ??
    headerStore.get('x-real-ip') ??
    'unknown';

  // Rate limit by IP: 5 attempts per minute
  const ipLimit = await rateLimit({ key: `login:ip:${ip}`, max: 5, windowMs: 60 * 1000 });
  if (!ipLimit.allowed) {
    logSecurityEvent({ event: 'login_rate_limited', ip, email: maskEmail(email), detail: 'IP limit exceeded' });
    return { success: false, error: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.' };
  }

  // Rate limit by email: 10 attempts per 5 minutes
  const emailKey = email.toLowerCase().trim();
  const emailLimit = await rateLimit({ key: `login:email:${emailKey}`, max: 10, windowMs: 5 * 60 * 1000 });
  if (!emailLimit.allowed) {
    logSecurityEvent({ event: 'login_rate_limited', ip, email: maskEmail(email), detail: 'email limit exceeded' });
    return { success: false, error: 'Demasiados intentos para esta cuenta. Espera 5 minutos.' };
  }

  // Authenticate server-side
  const supabase = await createSupabaseServerClient();
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (authError || !data.user) {
    logSecurityEvent({
      event: 'login_failure',
      ip,
      email: maskEmail(email),
      detail: authError?.message ?? 'no user returned',
    });
    return {
      success: false,
      error: translateAuthError(authError?.message),
    };
  }

  // Fetch role for redirect decision
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  logSecurityEvent({
    event: 'login_success',
    userId: data.user.id,
    ip,
    email: maskEmail(email),
  });

  return { success: true, role: profile?.role ?? null };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.auth.signOut();
  logSecurityEvent({ event: 'logout_success', userId: user?.id });
}
