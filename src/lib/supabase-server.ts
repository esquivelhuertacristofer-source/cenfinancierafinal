import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components cannot set cookies — safe to ignore in read-only contexts
          }
        },
      },
    }
  )
}

/**
 * Race a promise against a timeout. Rejects (rather than resolving to a
 * fallback) so callers can distinguish "operation hung/failed" from a
 * genuine result — needed for auth checks and writes, where silently
 * substituting a value would be incorrect.
 */
export function withServerTimeout<T>(promise: PromiseLike<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms)
    promise.then(
      (value) => { clearTimeout(timer); resolve(value) },
      (err) => { clearTimeout(timer); reject(err) }
    )
  })
}

export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient()

  let userResult
  try {
    userResult = await withServerTimeout(
      supabase.auth.getUser(),
      10000,
      'SUPABASE_UNAVAILABLE: tiempo de espera agotado al verificar la sesión'
    )
  } catch (err: any) {
    if (err?.message?.startsWith('SUPABASE_UNAVAILABLE')) throw err
    throw new Error('SUPABASE_UNAVAILABLE: no se pudo verificar la sesión')
  }
  const { data: { user }, error: userError } = userResult

  if (userError || !user) {
    throw new Error('UNAUTHORIZED: no hay sesión válida')
  }

  let profileResult
  try {
    profileResult = await withServerTimeout(
      supabase.from('profiles').select('id, role').eq('id', user.id).single(),
      10000,
      'SUPABASE_UNAVAILABLE: tiempo de espera agotado al verificar el perfil'
    )
  } catch (err: any) {
    if (err?.message?.startsWith('SUPABASE_UNAVAILABLE')) throw err
    throw new Error('SUPABASE_UNAVAILABLE: no se pudo verificar el perfil')
  }
  const { data: profile, error: profileError } = profileResult

  if (profileError || !profile) {
    throw new Error('FORBIDDEN: perfil no encontrado')
  }

  if (!['admin', 'super_admin'].includes(profile.role)) {
    throw new Error('FORBIDDEN: rol insuficiente')
  }

  return {
    user,
    profile,
    isAdmin: true,
    isSuperAdmin: profile.role === 'super_admin',
  }
}
