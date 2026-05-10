import { createClient } from '@supabase/supabase-js';
// Final deployment pulse - Author verification - Diamond State v3

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    persistSession: true,
    detectSessionInUrl: true,
  }
});