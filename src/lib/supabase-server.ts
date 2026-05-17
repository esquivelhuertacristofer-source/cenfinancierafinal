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

export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('UNAUTHORIZED: no hay sesión válida')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, escuela_id')
    .eq('id', user.id)
    .single()

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
