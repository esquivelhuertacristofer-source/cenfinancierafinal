import { createClient } from '@supabase/supabase-js';

// Browser-side Supabase singleton.
// Import this in all client components and hooks.
// For server actions that need service_role, use adminActions.ts instead.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    detectSessionInUrl: true,
  }
});
