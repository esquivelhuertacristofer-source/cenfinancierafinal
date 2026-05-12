-- user_consents: records each user's acceptance of privacy policy + terms at login time
-- Execute in Supabase SQL Editor (Dashboard → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS public.user_consents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address    TEXT,
  user_agent    TEXT,
  version       TEXT NOT NULL DEFAULT '2026-05'  -- bump this whenever privacy/terms change
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS user_consents_user_id_idx ON public.user_consents(user_id);

-- RLS: users can only insert their own consent; no reads needed from client
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own consent"
  ON public.user_consents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all consents
CREATE POLICY "Admins read all consents"
  ON public.user_consents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
