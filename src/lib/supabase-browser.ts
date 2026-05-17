import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase singleton.
// Uses cookie-based session storage so the Edge proxy can validate JWTs server-side.
// Import this in all client components and hooks.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce',
    },
  }
);
