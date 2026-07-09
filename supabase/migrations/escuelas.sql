-- ============================================================
-- MIGRACIÓN: Sistema de Escuelas
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tabla escuelas
CREATE TABLE IF NOT EXISTS public.escuelas (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.escuelas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_gestiona_escuelas" ON public.escuelas
  FOR ALL USING (public.get_my_role() IN ('admin', 'super_admin'));

CREATE POLICY "autenticados_ven_su_escuela" ON public.escuelas
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Eliminar restricción UNIQUE global en grupos.nombre
--    (el nombre de grupo ahora puede repetirse entre escuelas)
ALTER TABLE public.grupos DROP CONSTRAINT IF EXISTS grupos_nombre_key;

-- 3. Agregar escuela_id a grupos
ALTER TABLE public.grupos ADD COLUMN IF NOT EXISTS escuela_id uuid REFERENCES public.escuelas(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_grupos_escuela ON public.grupos(escuela_id);

-- 4. Agregar FK a profiles.escuela_id (la columna ya existe, solo falta el constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'escuela_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN escuela_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_escuela_id_fkey' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_escuela_id_fkey
      FOREIGN KEY (escuela_id) REFERENCES public.escuelas(id) ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_profiles_escuela ON public.profiles(escuela_id);
