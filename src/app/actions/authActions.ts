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

const LoginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
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
  const ip =
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
      error: authError?.message === 'Invalid login credentials'
        ? 'Credenciales incorrectas'
        : (authError?.message ?? 'Error de autenticación'),
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
