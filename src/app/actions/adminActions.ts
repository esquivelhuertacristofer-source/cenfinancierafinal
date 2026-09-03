"use server";

import { createClient } from "@supabase/supabase-js";
import { requireAdminSession, withServerTimeout } from "@/lib/supabase-server";
import { mensajeDeError } from '@/lib/errores';

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

// Límite duro de filas por carga de onboarding institucional. Protege contra
// CSVs desproporcionados que saturen la API de Auth (sin endpoint de bulk) y
// contra timeouts largos sin retroalimentación para el admin.
const MAX_ONBOARD_ROWS = 300;

// Cuántas cuentas se crean en paralelo dentro de un lote. La API
// admin.auth.admin.createUser no tiene endpoint de bulk, así que se procesa
// en mini-lotes concurrentes en vez de una llamada secuencial a la vez.
const ONBOARD_CONCURRENCY = 5;

// Helper genérico de "pool" de concurrencia acotada: procesa `items` con a lo
// sumo `limit` llamadas a `worker` en vuelo al mismo tiempo, preservando en el
// arreglo de resultados el mismo orden que `items` (independientemente del
// orden real de finalización de cada promesa).
async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => runner()));
  return results;
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
  password: string,
  targetEscuelaId?: string | null
): Promise<OnboardResult> {
  const session = await requireAdminSession();

  if (!password || password.trim().length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  // Un admin de escuela SIEMPRE usa su propia escuela_id de sesión — nunca la
  // que mande el cliente, para que no pueda dar de alta usuarios en una
  // escuela ajena. Un super_admin no tiene escuela_id propia (su profile no
  // pertenece a ninguna escuela), así que debe indicar explícitamente a cuál
  // escuela pertenece este lote; sin este requisito, `escuelaId` quedaba en
  // NULL y las cuentas creadas (o sus vínculos a alumnos_grupos) quedaban
  // huérfanas de cualquier escuela.
  const escuelaId = session.isSuperAdmin
    ? (targetEscuelaId ?? null)
    : session.profile.escuela_id ?? null;
  if (!escuelaId) {
    throw new Error(
      session.isSuperAdmin
        ? "Como super_admin debes indicar a qué escuela pertenece este lote."
        : "Tu cuenta de administrador no está vinculada a ninguna escuela."
    );
  }

  const admin = getAdminClient();

  // Fix MEDIO: getGrupos() no acota por escuela para un super_admin (ve los
  // grupos de TODAS las escuelas), así que sin este chequeo un super_admin
  // podría enviar un `groupId` de una escuela distinta a `escuelaId` —
  // dejando profiles.escuela_id apuntando a una escuela y
  // alumnos_grupos/grupos.id_profesor a un grupo de otra. Se valida una sola
  // vez porque groupId/escuelaId son constantes para todo el lote.
  if (groupId) {
    const { data: grupo, error: grupoErr } = await withOpTimeout(
      admin.from("grupos").select("escuela_id").eq("id", groupId).single(),
      "verificar grupo destino del lote"
    );
    if (grupoErr || !grupo) {
      throw new Error("El grupo seleccionado no existe.");
    }
    if (grupo.escuela_id !== escuelaId) {
      throw new Error("El grupo seleccionado pertenece a otra escuela.");
    }
  }

  const EMAIL_DOMAIN = process.env.INSTITUTIONAL_EMAIL_DOMAIN ?? "cenfinanciera.com";
  const pw = password.trim();
  const schoolLevel = GRADO_A_SCHOOL_LEVEL[grado] ?? grado;
  const usedEmails = new Set<string>();
  const results: OnboardResult = { success: [], errors: [] };

  for (const rawName of names) {
    const name = rawName.trim();
    if (!name) continue;

    const email = generateEmail(name, usedEmails, EMAIL_DOMAIN);

    try {
      const { data: authData, error: authError } = await withOpTimeout(
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

      if (authError || !authData.user) {
        results.errors.push({ name, message: authError?.message ?? "Error desconocido" });
        continue;
      }

      // El trigger handle_new_user() solo llena profiles.group_id a partir del
      // metadata de auth — NUNCA inserta en alumnos_grupos. getScopedStudentIds()
      // (src/lib/teacherScope.ts) resuelve el roster de un profesor con esquema
      // institucional (grupos.id_profesor) EXCLUSIVAMENTE desde alumnos_grupos,
      // ignorando profiles.group_id por completo. Sin vincular también aquí, un
      // alumno dado de alta con un grupo existente queda invisible para su
      // profesor aunque su perfil luzca correcto (mismo patrón de reparación
      // que repairUserProfile en adminUserActions.ts:301-334).
      if (role === "student" && groupId) {
        // Vincula perfil (escuela_id) y alumnos_grupos en una sola transacción
        // — ver link_student_to_group() en 2026-07-14_link_student_to_group.sql.
        // Evita que un fallo en el segundo paso deje al alumno a medio
        // vincular tras el primero. `escuelaId` ya está garantizado no-nulo
        // (ver validación arriba), así que esta rama cubre siempre el caso
        // de alumno-con-grupo, incluyendo el de super_admin con escuela
        // explícita.
        const { error: linkError } = await withOpTimeout(
          admin.rpc("link_student_to_group", { p_user_id: authData.user.id, p_grupo_id: groupId, p_escuela_id: escuelaId }),
          `vincular ${name} a la escuela y al grupo`
        );
        if (linkError) {
          results.errors.push({ name, message: linkError.message });
          continue;
        }
      } else if (role === "teacher" && groupId) {
        // Mismo problema que tenía onboardEscuela antes de su fix CRÍTICO: si
        // aquí solo se vinculara profiles.escuela_id, el profesor quedaría
        // creado pero grupos.id_profesor nunca se asignaría — invisible para
        // sí mismo en /dashboard/teacher/alumnos, que resuelve el roster
        // exclusivamente a partir de grupos.id_profesor. Usa el mismo RPC
        // atómico (ver 2026-07-14_assign_teacher_to_group.sql).
        const { error: assignError } = await withOpTimeout(
          admin.rpc("assign_teacher_to_group", { p_user_id: authData.user.id, p_grupo_id: groupId, p_escuela_id: escuelaId }),
          `vincular ${name} a la escuela y al grupo`
        );
        if (assignError) {
          results.errors.push({ name, message: assignError.message });
          continue;
        }
      } else {
        // Profesor sin grupo, o alumno sin grupo (bloqueado normalmente por
        // la UI): solo vincula la escuela al perfil.
        const { error: updateError } = await withOpTimeout(
          admin.from("profiles").update({ escuela_id: escuelaId }).eq("id", authData.user.id),
          `vincular escuela de ${name}`
        );
        if (updateError) {
          results.errors.push({ name, message: updateError.message });
          continue;
        }
      }

      results.success.push({ name, email });
    } catch (err: unknown) {
      results.errors.push({ name, message: mensajeDeError(err) });
    }
  }

  return results;
}

export async function createGrupo(
  nombre: string,
  grado: string,
  idProfesor: string | null,
  targetEscuelaId?: string | null
): Promise<{ id: string; nombre: string } | null> {
  const session = await requireAdminSession();

  // Un admin de escuela SIEMPRE usa su propia escuela_id de sesión — nunca la
  // que mande el cliente, para no poder crear grupos en una escuela ajena. Un
  // super_admin no tiene escuela_id propia, así que debe indicar
  // explícitamente a qué escuela pertenece el grupo; sin este requisito, el
  // grupo se insertaba con escuela_id=NULL — huérfano, invisible para
  // cualquier escuela real.
  const escuelaId = session.isSuperAdmin
    ? (targetEscuelaId ?? null)
    : session.profile.escuela_id ?? null;
  if (!escuelaId) {
    throw new Error(
      session.isSuperAdmin
        ? "Como super_admin debes indicar a qué escuela pertenece el grupo."
        : "Tu cuenta de administrador no está vinculada a ninguna escuela."
    );
  }

  const admin = getAdminClient();
  let data, error;
  try {
    ({ data, error } = await withOpTimeout(
      admin.from("grupos").insert({ nombre, grado, id_profesor: idProfesor ?? null, escuela_id: escuelaId }).select("id, nombre").single(),
      "crear grupo"
    ));
  } catch (err: unknown) {
    console.error('[adminActions] createGrupo timeout/conexión:', mensajeDeError(err));
    throw new Error("No se pudo crear el grupo: falla de conexión con la base de datos. Intente de nuevo.");
  }

  if (error?.code === "23505") {
    throw new Error(`Ya existe un grupo llamado "${nombre}" en tu escuela. Usa otro nombre o selecciona el existente.`);
  }

  if (error) {
    console.error('[adminActions] createGrupo error:', error.message);
    throw new Error("No se pudo crear el grupo. Intente de nuevo.");
  }
  return data;
}

export async function getGrupos(): Promise<{ id: string; nombre: string; grado: string }[]> {
  const session = await requireAdminSession();

  const admin = getAdminClient();
  let data, error;
  try {
    let query = admin.from("grupos").select("id, nombre, grado");
    // Un admin de escuela solo ve los grupos de su propia escuela;
    // super_admin ve la plataforma completa.
    if (!session.isSuperAdmin) {
      query = query.eq("escuela_id", session.profile.escuela_id);
    }
    ({ data, error } = await withOpTimeout(
      query.order("nombre"),
      "cargar grupos"
    ));
  } catch (err: unknown) {
    console.error('[adminActions] getGrupos timeout/conexión:', mensajeDeError(err));
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
  const session = await requireAdminSession();
  const admin = getAdminClient();

  let data, error;
  try {
    let query = admin.from("escuelas").select("id, nombre, created_at, grupos(id)");
    // Un admin de escuela solo ve su propia escuela; super_admin ve todas.
    if (!session.isSuperAdmin) {
      query = query.eq("id", session.profile.escuela_id);
    }
    ({ data, error } = await withOpTimeout(
      query.order("created_at", { ascending: false }),
      "cargar escuelas"
    ));
  } catch (err: unknown) {
    console.error('[adminActions] getEscuelas timeout/conexión:', mensajeDeError(err));
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
      } catch (err: unknown) {
        console.error('[adminActions] getEscuelas conteo timeout/conexión:', mensajeDeError(err));
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
  if (entries.length > MAX_ONBOARD_ROWS) {
    throw new Error(
      `El lote tiene ${entries.length} registros y excede el máximo permitido de ${MAX_ONBOARD_ROWS} por carga. ` +
      `Divide el archivo en lotes más pequeños e inténtalo de nuevo.`
    );
  }

  const EMAIL_DOMAIN = process.env.INSTITUTIONAL_EMAIL_DOMAIN ?? "cenfinanciera.com";
  const admin = getAdminClient();
  const pw = password.trim();
  const usedEmails = new Set<string>();
  const nombreTrim = escuelaNombre.trim();
  const result: EscuelaOnboardResult = {
    escuelaId: "",
    escuelaNombre: nombreTrim,
    results: [],
    errors: [],
  };

  console.info(`[adminActions] onboardEscuela: iniciando procesamiento de ${entries.length} registro(s) para la escuela '${nombreTrim}'.`);

  // 1. Idempotencia: si ya existe una escuela con este nombre exacto, se
  // reutiliza su id en vez de insertar una fila duplicada. Esto permite que
  // un reintento tras un fallo parcial (p. ej. el navegador se cerró a medio
  // procesar el CSV) complete lo que faltó sin duplicar la escuela.
  let escuela: { id: string; nombre: string } | null | undefined;
  let escuelaErr: any;
  try {
    ({ data: escuela, error: escuelaErr } = await withOpTimeout(
      admin.from("escuelas").select("id, nombre").eq("nombre", nombreTrim).maybeSingle(),
      "buscar escuela existente"
    ));
  } catch (err: unknown) {
    console.error(`[adminActions] onboardEscuela: falla de conexión al buscar escuela existente '${nombreTrim}':`, mensajeDeError(err));
    throw new Error(`No se pudo verificar si la escuela ya existe: falla de conexión con la base de datos (${mensajeDeError(err)}).`);
  }
  if (escuelaErr) {
    console.error(`[adminActions] onboardEscuela: error al buscar escuela existente '${nombreTrim}':`, escuelaErr.message);
    throw new Error(`No se pudo verificar si la escuela ya existe: ${escuelaErr.message}`);
  }

  if (escuela) {
    console.info(`[adminActions] onboardEscuela: se reutiliza la escuela existente '${escuela.nombre}' (id=${escuela.id}) — no se crea una fila duplicada.`);
  } else {
    let created: { id: string; nombre: string } | null | undefined;
    let createErr: any;
    try {
      ({ data: created, error: createErr } = await withOpTimeout(
        admin.from("escuelas").insert({ nombre: nombreTrim }).select("id, nombre").single(),
        "crear escuela"
      ));
    } catch (err: unknown) {
      console.error(`[adminActions] onboardEscuela: falla de conexión al crear escuela '${nombreTrim}':`, mensajeDeError(err));
      throw new Error(`No se pudo crear la escuela: falla de conexión con la base de datos (${mensajeDeError(err)}).`);
    }

    // 23505 = unique_violation: otra llamada concurrente ganó la carrera y ya
    // insertó esta escuela entre nuestro SELECT y este INSERT (ver
    // 2026-07-14_add_unique_escuelas_nombre.sql). No es un error real — se
    // recupera la fila que la otra llamada acaba de crear y se continúa.
    if (createErr?.code === "23505") {
      console.info(`[adminActions] onboardEscuela: colisión de creación concurrente para '${nombreTrim}' — se reutiliza la escuela creada por la otra llamada.`);
      let raced: { id: string; nombre: string } | null | undefined;
      let racedErr: any;
      try {
        ({ data: raced, error: racedErr } = await withOpTimeout(
          admin.from("escuelas").select("id, nombre").eq("nombre", nombreTrim).maybeSingle(),
          "recuperar escuela tras colisión de creación"
        ));
      } catch (err: unknown) {
        throw new Error(`No se pudo recuperar la escuela tras una colisión de creación concurrente: falla de conexión con la base de datos (${mensajeDeError(err)}).`);
      }
      if (racedErr || !raced) {
        throw new Error(`No se pudo recuperar la escuela tras una colisión de creación concurrente: ${racedErr?.message ?? "no se encontró la fila"}.`);
      }
      created = raced;
      createErr = null;
    }

    if (createErr || !created) {
      console.error(`[adminActions] onboardEscuela: error al crear escuela '${nombreTrim}':`, createErr?.message);
      throw new Error(`No se pudo crear la escuela: ${createErr?.message}`);
    }
    escuela = created;
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

    // Crear grupo — idempotente: si ya existe uno con este nombre en esta
    // escuela (p. ej. reintento tras una falla parcial de un CSV previo), se
    // reutiliza en vez de crear un duplicado (ver
    // 2026-07-14_add_unique_grupos_nombre_escuela.sql).
    let grupo, grupoErr;
    try {
      ({ data: grupo, error: grupoErr } = await withOpTimeout(
        admin.from("grupos").select("id").eq("nombre", grupoNombre).eq("escuela_id", escuela.id).maybeSingle(),
        `buscar grupo existente ${grupoNombre}`
      ));
    } catch (err: unknown) {
      console.error(`[adminActions] onboardEscuela: falla de conexión al buscar grupo '${grupoNombre}' (escuela='${escuela.nombre}'):`, mensajeDeError(err));
      for (const m of members) {
        result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': falla de conexión con la base de datos (${mensajeDeError(err)}).` });
      }
      continue;
    }
    if (grupoErr) {
      console.error(`[adminActions] onboardEscuela: error al buscar grupo '${grupoNombre}' (escuela='${escuela.nombre}'):`, grupoErr?.message);
      for (const m of members) {
        result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': ${grupoErr?.message ?? "error"}` });
      }
      continue;
    }

    if (!grupo) {
      let created, createErr;
      try {
        ({ data: created, error: createErr } = await withOpTimeout(
          admin.from("grupos").insert({ nombre: grupoNombre, grado, escuela_id: escuela.id }).select("id").single(),
          `crear grupo ${grupoNombre}`
        ));
      } catch (err: unknown) {
        console.error(`[adminActions] onboardEscuela: falla de conexión al crear grupo '${grupoNombre}' (escuela='${escuela.nombre}'):`, mensajeDeError(err));
        for (const m of members) {
          result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': falla de conexión con la base de datos (${mensajeDeError(err)}).` });
        }
        continue;
      }

      // 23505 = unique_violation: otra llamada concurrente ganó la carrera y
      // ya creó este grupo entre nuestro SELECT y este INSERT — se recupera
      // la fila que la otra llamada acaba de crear (mismo patrón que
      // onboardEscuela usa para la propia escuela más arriba).
      if (createErr?.code === "23505") {
        console.info(`[adminActions] onboardEscuela: colisión de creación concurrente para el grupo '${grupoNombre}' — se reutiliza el grupo creado por la otra llamada.`);
        let raced, racedErr;
        try {
          ({ data: raced, error: racedErr } = await withOpTimeout(
            admin.from("grupos").select("id").eq("nombre", grupoNombre).eq("escuela_id", escuela.id).maybeSingle(),
            `recuperar grupo tras colisión ${grupoNombre}`
          ));
        } catch (err: unknown) {
          for (const m of members) {
            result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': no se pudo recuperar tras una colisión de creación concurrente (${mensajeDeError(err)}).` });
          }
          continue;
        }
        if (racedErr || !raced) {
          for (const m of members) {
            result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': no se pudo recuperar tras una colisión de creación concurrente.` });
          }
          continue;
        }
        created = raced;
        createErr = null;
      }

      if (createErr || !created) {
        console.error(`[adminActions] onboardEscuela: error al crear grupo '${grupoNombre}' (escuela='${escuela.nombre}'):`, createErr?.message);
        for (const m of members) {
          result.errors.push({ name: m.nombre, mensaje: `Grupo '${grupoNombre}': ${createErr?.message ?? "error"}` });
        }
        continue;
      }
      grupo = created;
    }
    const grupoId = grupo.id;

    const teachers = members.filter((m) => m.rol === "teacher");
    const students = members.filter((m) => m.rol === "student");

    // ── Profesores ────────────────────────────────────────────────────────
    // Las cuentas de Auth se crean con concurrencia acotada (no hay endpoint
    // de bulk). La asignación de "primer profesor del grupo" se procesa
    // después, en un segundo paso, en el orden original de `teachers` — ya no
    // depende de un check-then-set en JS para evitar condiciones de carrera
    // (assign_teacher_to_group() hace ese check-then-set atómico a nivel de
    // fila), pero se mantiene secuencial para que el orden final de
    // result.results/result.errors coincida con el orden del CSV.
    type TeacherCreation =
      | { ok: true; name: string; email: string; userId: string }
      | { ok: false; name: string; mensaje: string }
      | { ok: "skip" };

    const teacherCreations = await runWithConcurrency(teachers, ONBOARD_CONCURRENCY, async (t): Promise<TeacherCreation> => {
      const name = t.nombre.trim();
      if (!name) return { ok: "skip" };
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
          console.error(`[adminActions] onboardEscuela: error al crear cuenta de profesor '${name}' (grupo='${grupoNombre}'):`, authErr?.message);
          return { ok: false, name, mensaje: authErr?.message ?? "Error al crear cuenta" };
        }
        return { ok: true, name, email, userId: authData.user.id };
      } catch (err: unknown) {
        console.error(`[adminActions] onboardEscuela: excepción al crear cuenta de profesor '${name}' (grupo='${grupoNombre}'):`, mensajeDeError(err));
        return { ok: false, name, mensaje: mensajeDeError(err) };
      }
    });

    for (const outcome of teacherCreations) {
      if (outcome.ok === "skip") continue;
      if (!outcome.ok) {
        result.errors.push({ name: outcome.name, mensaje: outcome.mensaje });
        continue;
      }
      const { name, email, userId: tid } = outcome;
      try {
        // Asigna id_profesor (primer profesor del grupo gana, check-then-set
        // atómico) y promueve el profile a role='teacher'/escuela_id en una
        // sola transacción — ver assign_teacher_to_group() en
        // 2026-07-14_assign_teacher_to_group.sql.
        const { error: assignErr } = await withOpTimeout(
          admin.rpc("assign_teacher_to_group", { p_user_id: tid, p_grupo_id: grupoId, p_escuela_id: escuela.id }),
          `vincular profesor ${name} al grupo ${grupoNombre}`
        );
        if (assignErr) throw assignErr;
        result.results.push({ name, email, grupo: grupoNombre, grado, rol: "teacher" });
      } catch (err: unknown) {
        console.error(`[adminActions] onboardEscuela: error al vincular profesor '${name}' al grupo '${grupoNombre}':`, mensajeDeError(err));
        result.errors.push({ name, mensaje: mensajeDeError(err) });
      }
    }

    // ── Alumnos ───────────────────────────────────────────────────────────
    // Sin estado compartido entre alumnos, por lo que la creación de cuenta y
    // su vinculación a escuela/grupo se procesan juntas dentro del mismo
    // worker concurrente. El resultado se agrega en un segundo paso
    // secuencial, en el orden original de `students`, para que el orden final
    // de result.results/result.errors no dependa del orden de finalización.
    type StudentCreation =
      | { ok: true; name: string; email: string }
      | { ok: false; name: string; mensaje: string }
      | { ok: "skip" };

    const studentCreations = await runWithConcurrency(students, ONBOARD_CONCURRENCY, async (s): Promise<StudentCreation> => {
      const name = s.nombre.trim();
      if (!name) return { ok: "skip" };
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
          console.error(`[adminActions] onboardEscuela: error al crear cuenta de alumno '${name}' (grupo='${grupoNombre}'):`, authErr?.message);
          return { ok: false, name, mensaje: authErr?.message ?? "Error al crear cuenta" };
        }
        // Vincula perfil (escuela_id) y alumnos_grupos en una sola transacción
        // — ver link_student_to_group() en 2026-07-14_link_student_to_group.sql.
        // Reemplaza dos escrituras separadas sin chequeo de error, donde un
        // fallo silencioso en la segunda dejaba al alumno invisible para su
        // profesor pese a reportarse como éxito.
        const { error: linkErr } = await withOpTimeout(
          admin.rpc("link_student_to_group", { p_user_id: authData.user.id, p_grupo_id: grupoId, p_escuela_id: escuela.id }),
          `vincular ${name} a la escuela y al grupo ${grupoNombre}`
        );
        if (linkErr) {
          console.error(`[adminActions] onboardEscuela: error al vincular alumno '${name}' (grupo='${grupoNombre}'):`, linkErr.message);
          return { ok: false, name, mensaje: linkErr.message };
        }
        return { ok: true, name, email };
      } catch (err: unknown) {
        console.error(`[adminActions] onboardEscuela: excepción al procesar alumno '${name}' (grupo='${grupoNombre}'):`, mensajeDeError(err));
        return { ok: false, name, mensaje: mensajeDeError(err) };
      }
    });

    for (const outcome of studentCreations) {
      if (outcome.ok === "skip") continue;
      if (!outcome.ok) {
        result.errors.push({ name: outcome.name, mensaje: outcome.mensaje });
        continue;
      }
      result.results.push({ name: outcome.name, email: outcome.email, grupo: grupoNombre, grado, rol: "student" });
    }
  }

  console.info(
    `[adminActions] onboardEscuela: finalizado para '${result.escuelaNombre}' (id=${result.escuelaId}). ` +
    `Éxitos=${result.results.length}, Errores=${result.errors.length}.`
  );

  return result;
}
