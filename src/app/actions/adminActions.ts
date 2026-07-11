"use server";

import { createClient } from "@supabase/supabase-js";
import { requireAdminSession, withServerTimeout } from "@/lib/supabase-server";

// Admin client con service_role — solo en Server Actions, nunca en el cliente
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada en variables de entorno.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Cualquier llamada individual a Supabase dentro de un lote puede quedarse
// colgada indefinidamente si el servicio está saturado o caído. Sin este
// límite, un solo item atorado congela el lote completo sin dar ningún
// error visible al admin (su UI de "procesando" giraría para siempre).
const OP_TIMEOUT_MS = 15000;
function withOpTimeout<T>(promise: PromiseLike<T>, label: string): Promise<T> {
  return withServerTimeout(promise, OP_TIMEOUT_MS, `SUPABASE_UNAVAILABLE: tiempo de espera agotado (${label})`);
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

// ─── Tipos existentes ────────────────────────────────────────────────────────

export interface OnboardResult {
  success: { name: string; email: string }[];
  errors:  { name: string; message: string }[];
}

// ─── Tipos nuevos ────────────────────────────────────────────────────────────

export interface EscuelaOnboardEntry {
  nombre: string;
  grupo: string;
  grado: string;
  rol: "student" | "teacher";
}

export interface EscuelaOnboardResult {
  escuelaId: string;
  escuelaNombre: string;
  results: { name: string; email: string; grupo: string; grado: string; rol: "student" | "teacher" }[];
  errors:  { name: string; mensaje: string }[];
}

export interface EscuelaStats {
  id: string;
  nombre: string;
  created_at: string;
  grupos_count: number;
  alumnos_count: number;
}

// ─── Acciones existentes ─────────────────────────────────────────────────────

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
      const { error: authError } = await withOpTimeout(
        admin.auth.admin.createUser({
          email,
          password: pw,
          email_confirm: true,
          user_metadata: {
            full_name:    name,
            role:         role,
            school_level: schoolLevel,
            group_id:     groupId ?? null,
          },
        }),
        `crear cuenta de ${name}`
      );

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
  let data, error;
  try {
    ({ data, error } = await withOpTimeout(
      admin.from("grupos").insert({ nombre, grado, id_profesor: idProfesor ?? null }).select("id, nombre").single(),
      "crear grupo"
    ));
  } catch (err: any) {
    console.error('[adminActions] createGrupo timeout/conexión:', err?.message);
    throw new Error("No se pudo crear el grupo: falla de conexión con la base de datos. Intente de nuevo.");
  }

  if (error) {
    console.error('[adminActions] createGrupo error:', error.message);
    throw new Error("No se pudo crear el grupo. Intente de nuevo.");
  }
  return data;
}

export async function getGrupos(): Promise<{ id: string; nombre: string; grado: string }[]> {
  await requireAdminSession();

  const admin = getAdminClient();
  let data, error;
  try {
    ({ data, error } = await withOpTimeout(
      admin.from("grupos").select("id, nombre, grado").order("nombre"),
      "cargar grupos"
    ));
  } catch (err: any) {
    console.error('[adminActions] getGrupos timeout/conexión:', err?.message);
    throw new Error("No se pudieron cargar los grupos: falla de conexión con la base de datos.");
  }
  if (error) {
    console.error('[adminActions] getGrupos error:', error.message);
    throw new Error("No se pudieron cargar los grupos.");
  }
  return data ?? [];
}

// ─── Nuevas acciones: Escuelas ────────────────────────────────────────────────

export async function getEscuelas(): Promise<EscuelaStats[]> {
  await requireAdminSession();
  const admin = getAdminClient();

  let data, error;
  try {
    ({ data, error } = await withOpTimeout(
      admin.from("escuelas").select("id, nombre, created_at, grupos(id)").order("created_at", { ascending: false }),
      "cargar escuelas"
    ));
  } catch (err: any) {
    console.error('[adminActions] getEscuelas timeout/conexión:', err?.message);
    throw new Error("No se pudieron cargar las escuelas: falla de conexión con la base de datos.");
  }
  if (error || !data) {
    console.error('[adminActions] getEscuelas error:', error?.message);
    throw new Error("No se pudieron cargar las escuelas.");
  }

  const results: EscuelaStats[] = [];
  for (const e of data as any[]) {
    const grupoIds: string[] = (e.grupos ?? []).map((g: any) => g.id);
    let alumnos_count = 0;
    if (grupoIds.length > 0) {
      let count;
      try {
        ({ count } = await withOpTimeout(
          admin.from("alumnos_grupos").select("*", { count: "exact", head: true }).in("id_grupo", grupoIds),
          `conteo de alumnos de ${e.nombre}`
        ));
      } catch (err: any) {
        console.error('[adminActions] getEscuelas conteo timeout/conexión:', err?.message);
        throw new Error(`No se pudo cargar el conteo de alumnos de '${e.nombre}': falla de conexión con la base de datos.`);
      }
      alumnos_count = count ?? 0;
    }
    results.push({
      id: e.id,
      nombre: e.nombre,
      created_at: e.created_at,
      grupos_count: grupoIds.length,
      alumnos_count,
    });
  }
  return results;
}

export async function onboardEscuela(
  escuelaNombre: string,
  entries: EscuelaOnboardEntry[],
  password: string
): Promise<EscuelaOnboardResult> {
  await requireAdminSession();

  if (!escuelaNombre.trim()) throw new Error("El nombre de la escuela es requerido.");
  if (!password || password.trim().length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");

  const EMAIL_DOMAIN = process.env.INSTITUTIONAL_EMAIL_DOMAIN ?? "cenfinanciera.com";
  const admin = getAdminClient();
  const pw = password.trim();
  const usedEmails = new Set<string>();
  const result: EscuelaOnboardResult = {
    escuelaId: "",
    escuelaNombre: escuelaNombre.trim(),
    results: [],
    errors: [],
  };

  // 1. Crear escuela
  let escuela, escuelaErr;
  try {
    ({ data: escuela, error: escuelaErr } = await withOpTimeout(
      admin.from("escuelas").insert({ nombre: escuelaNombre.trim() }).select("id, nombre").single(),
      "crear escuela"
    ));
  } catch (err: any) {
    throw new Error(`No se pudo crear la escuela: falla de conexión con la base de datos (${err?.message ?? "sin detalle"}).`);
  }

  if (escuelaErr || !escuela) {
    throw new Error(`No se pudo crear la escuela: ${escuelaErr?.message}`);
  }
  result.escuelaId = escuela.id;

  // 2. Agrupar entradas por (grupo, grado)
  const groupMap = new Map<string, EscuelaOnboardEntry[]>();
  for (const entry of entries) {
    const key = `${entry.grupo.trim()}||${entry.grado.trim().toUpperCase()}`;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(entry);
  }

  // 3. Procesar cada grupo
  for (const [key, members] of groupMap.entries()) {
    const [grupoNombre, grado] = key.split("||");
    const schoolLevel = GRADO_A_SCHOOL_LEVEL[grado] ?? grado;

    // Crear grupo
    let grupo, grupoErr;
    try {
      ({ data: grupo, error: grupoErr } = await withOpTimeout(
        admin.from("grupos").insert({ nombre: grupoNombre, grado, escuela_id: escuela.id }).select("id").single(),
        `crear grupo ${grupoNombre}`
      ));
    } catch (err: any) {
      for (const m of members) {
        result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': falla de conexión con la base de datos (${err?.message ?? "sin detalle"}).` });
      }
      continue;
    }

    if (grupoErr || !grupo) {
      for (const m of members) {
        result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': ${grupoErr?.message ?? "error"}` });
      }
      continue;
    }
    const grupoId = grupo.id;

    const teachers = members.filter((m) => m.rol === "teacher");
    const students = members.filter((m) => m.rol === "student");

    // Crear profesores primero (su ID se asigna como id_profesor del grupo)
    for (const t of teachers) {
      const name = t.nombre.trim();
      if (!name) continue;
      const email = generateEmail(name, usedEmails, EMAIL_DOMAIN);
      try {
        const { data: authData, error: authErr } = await withOpTimeout(
          admin.auth.admin.createUser({
            email,
            password: pw,
            email_confirm: true,
            user_metadata: { full_name: name, role: "teacher", school_level: schoolLevel, group_id: grupoId },
          }),
          `crear cuenta de ${name}`
        );
        if (authErr || !authData?.user) {
          result.errors.push({ name, mensaje: authErr?.message ?? "Error al crear cuenta" });
          continue;
        }
        const tid = authData.user.id;
        // Asignar como profesor del grupo (primer profesor del grupo gana)
        const { data: g } = await withOpTimeout(
          admin.from("grupos").select("id_profesor").eq("id", grupoId).single(),
          `verificar profesor del grupo ${grupoNombre}`
        );
        if (!g?.id_profesor) {
          await withOpTimeout(
            admin.from("grupos").update({ id_profesor: tid }).eq("id", grupoId),
            `asignar profesor al grupo ${grupoNombre}`
          );
        }
        // Vincular a la escuela (el trigger handle_new_user siempre crea el profile con role='student')
        await withOpTimeout(
          admin.from("profiles").update({ escuela_id: escuela.id, role: "teacher" }).eq("id", tid),
          `vincular perfil de ${name}`
        );
        result.results.push({ name, email, grupo: grupoNombre, grado, rol: "teacher" });
      } catch (err: any) {
        result.errors.push({ name, mensaje: err?.message ?? "Error desconocido" });
      }
    }

    // Crear alumnos
    for (const s of students) {
      const name = s.nombre.trim();
      if (!name) continue;
      const email = generateEmail(name, usedEmails, EMAIL_DOMAIN);
      try {
        const { data: authData, error: authErr } = await withOpTimeout(
          admin.auth.admin.createUser({
            email,
            password: pw,
            email_confirm: true,
            user_metadata: { full_name: name, role: "student", school_level: schoolLevel, group_id: grupoId },
          }),
          `crear cuenta de ${name}`
        );
        if (authErr || !authData?.user) {
          result.errors.push({ name, mensaje: authErr?.message ?? "Error al crear cuenta" });
          continue;
        }
        // Vincular a la escuela y al grupo (el trigger handle_new_user NO inserta en alumnos_grupos)
        await withOpTimeout(
          admin.from("profiles").update({ escuela_id: escuela.id }).eq("id", authData.user.id),
          `vincular perfil de ${name}`
        );
        await withOpTimeout(
          admin.from("alumnos_grupos").insert({ id_alumno: authData.user.id, id_grupo: grupoId }),
          `vincular ${name} al grupo ${grupoNombre}`
        );
        result.results.push({ name, email, grupo: grupoNombre, grado, rol: "student" });
      } catch (err: any) {
        result.errors.push({ name, mensaje: err?.message ?? "Error desconocido" });
      }
    }
  }

  return result;
}
