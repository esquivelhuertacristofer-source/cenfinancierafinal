"use server";

import { createClient } from "@supabase/supabase-js";
import { requireAdminSession } from "@/lib/supabase-server";

// Admin client con service_role — solo en Server Actions, nunca en el cliente
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada en variables de entorno.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Mapa de grado a school_level legible
const GRADO_A_SCHOOL_LEVEL: Record<string, string> = {
  P1: "Primaria 1", P2: "Primaria 2", P3: "Primaria 3",
  P4: "Primaria 4", P5: "Primaria 5", P6: "Primaria 6",
  S1: "Secundaria 1", S2: "Secundaria 2", S3: "Secundaria 3",
};

function generateEmail(fullName: string, existing: Set<string>, domain: string): string {
  const base = fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, ".");

  let email = `${base}@${domain}`;
  let counter = 1;
  while (existing.has(email)) {
    email = `${base}${counter}@${domain}`;
    counter++;
  }
  existing.add(email);
  return email;
}

export interface OnboardResult {
  success: { name: string; email: string }[];
  errors:  { name: string; message: string }[];
}

export async function onboardInstitutionalUsers(
  names: string[],
  groupId: string | null,
  role: "student" | "teacher",
  grado: string,
  password: string
): Promise<OnboardResult> {
  await requireAdminSession();

  if (!password || password.trim().length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const EMAIL_DOMAIN = process.env.INSTITUTIONAL_EMAIL_DOMAIN ?? "cenfinanciera.com";
  const admin = getAdminClient();
  const pw = password.trim();
  const schoolLevel = GRADO_A_SCHOOL_LEVEL[grado] ?? grado;
  const usedEmails = new Set<string>();
  const results: OnboardResult = { success: [], errors: [] };

  for (const rawName of names) {
    const name = rawName.trim();
    if (!name) continue;

    const email = generateEmail(name, usedEmails, EMAIL_DOMAIN);

    try {
      const { error: authError } = await admin.auth.admin.createUser({
        email,
        password: pw,
        email_confirm: true,
        user_metadata: {
          full_name:    name,
          role:         role,
          school_level: schoolLevel,
          group_id:     groupId ?? null,
        },
      });

      if (authError) {
        results.errors.push({ name, message: authError.message });
        continue;
      }

      results.success.push({ name, email });
    } catch (err: any) {
      results.errors.push({ name, message: err?.message ?? "Error desconocido" });
    }
  }

  return results;
}

export async function createGrupo(
  nombre: string,
  grado: string,
  idProfesor: string | null
): Promise<{ id: string; nombre: string } | null> {
  await requireAdminSession();

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("grupos")
    .insert({ nombre, grado, id_profesor: idProfesor ?? null })
    .select("id, nombre")
    .single();

  if (error) {
    console.error('[adminActions] createGrupo error:', error.message);
    throw new Error("No se pudo crear el grupo. Intente de nuevo.");
  }
  return data;
}

export async function getGrupos(): Promise<{ id: string; nombre: string; grado: string }[]> {
  await requireAdminSession();

  const admin = getAdminClient();
  const { data, error } = await admin.from("grupos").select("id, nombre, grado").order("nombre");
  if (error) return [];
  return data ?? [];
}
