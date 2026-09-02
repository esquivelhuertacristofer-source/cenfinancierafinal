"use server";

import { createClient } from "@supabase/supabase-js";
import { requireAdminSession, withServerTimeout } from "@/lib/supabase-server";

// Admin client con service_role — solo en Server Actions, nunca en el cliente.
// (Mismo patrón que src/app/actions/adminActions.ts — no se comparte instancia
// entre archivos para no acoplar este módulo a otro que otro agente edita en paralelo.)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada en variables de entorno.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Cualquier llamada individual a Supabase puede quedarse colgada indefinidamente
// si el servicio está saturado o caído. Sin este límite, la UI de "buscando..."
// o "guardando..." giraría para siempre sin dar ningún error visible al admin.
const OP_TIMEOUT_MS = 15000;
function withOpTimeout<T>(promise: PromiseLike<T>, label: string): Promise<T> {
  return withServerTimeout(promise, OP_TIMEOUT_MS, `SUPABASE_UNAVAILABLE: tiempo de espera agotado (${label})`);
}

const VALID_ROLES = ["student", "teacher", "admin", "super_admin"] as const;
export type ProfileRole = (typeof VALID_ROLES)[number];

const MAX_SEARCH_RESULTS = 25;

export interface AdminUserSearchResult {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  school_level: string | null;
  group_id: string | null;
  grupo_nombre: string | null;
  escuela_id: string | null;
  escuela_nombre: string | null;
  // Para alumnos: indica si además de profiles.group_id existe la fila
  // correspondiente en alumnos_grupos (el vínculo "real" que usa el resto
  // de la plataforma para RLS y reportes). Si es false, el alumno tiene
  // school_level/group_id pero quedó huérfano de ese vínculo.
  vinculo_confirmado: boolean;
  created_at: string;
}

// El operador .or() de PostgREST usa comas y paréntesis como separadores de
// condiciones — si el término de búsqueda los trae, rompe el filtro. Los
// quitamos en vez de intentar escaparlos.
function sanitizeSearchTerm(raw: string): string {
  return raw.replace(/[,()%]/g, " ").trim();
}

// ─── Búsqueda ─────────────────────────────────────────────────────────────────

export async function searchUsers(rawTerm: string): Promise<AdminUserSearchResult[]> {
  const session = await requireAdminSession();

  const term = sanitizeSearchTerm(rawTerm ?? "");
  if (term.length < 2) {
    throw new Error("Escribe al menos 2 caracteres para buscar.");
  }

  const admin = getAdminClient();
  const pattern = `%${term}%`;

  let data, error;
  try {
    let query = admin
      .from("profiles")
      .select("id, full_name, email, role, school_level, group_id, escuela_id, created_at, escuelas(nombre)")
      .or(`full_name.ilike.${pattern},email.ilike.${pattern}`);
    // Un admin de escuela solo puede buscar usuarios de su propia escuela;
    // super_admin ve la plataforma completa.
    if (!session.isSuperAdmin) {
      query = query.eq("escuela_id", session.profile.escuela_id);
    }
    ({ data, error } = await withOpTimeout(
      query.order("full_name").limit(MAX_SEARCH_RESULTS),
      "buscar usuarios"
    ));
  } catch (err: any) {
    console.error('[adminUserActions] searchUsers timeout/conexión:', err?.message);
    throw new Error("No se pudo buscar usuarios: falla de conexión con la base de datos.");
  }
  if (error) {
    console.error('[adminUserActions] searchUsers error:', error.message);
    throw new Error("No se pudo buscar usuarios.");
  }

  const rows = (data ?? []) as any[];
  if (rows.length === 0) return [];

  // group_id en profiles es texto libre (sin FK declarada), así que no se
  // puede resolver por embedding de PostgREST — se resuelve aparte.
  const groupIds = [...new Set(rows.map((r) => r.group_id).filter(Boolean))] as string[];
  const grupoMap = new Map<string, string>();
  if (groupIds.length > 0) {
    try {
      const { data: gruposData, error: gruposErr } = await withOpTimeout(
        admin.from("grupos").select("id, nombre").in("id", groupIds),
        "resolver nombres de grupo"
      );
      if (!gruposErr) {
        for (const g of gruposData ?? []) grupoMap.set(g.id, g.nombre);
      }
    } catch {
      // No crítico: si falla, simplemente no se muestra el nombre del grupo.
    }
  }

  // Verificar si el vínculo real en alumnos_grupos existe para cada alumno.
  const studentIds = rows.filter((r) => r.role === "student" && r.group_id).map((r) => r.id);
  const linkedSet = new Set<string>();
  if (studentIds.length > 0) {
    try {
      const { data: linksData, error: linksErr } = await withOpTimeout(
        admin.from("alumnos_grupos").select("id_alumno, id_grupo").in("id_alumno", studentIds),
        "verificar vínculos alumno-grupo"
      );
      if (!linksErr) {
        for (const l of linksData ?? []) linkedSet.add(`${l.id_alumno}||${l.id_grupo}`);
      }
    } catch {
      // No crítico: si falla, se asume "sin vínculo confirmado" (más seguro
      // avisar de más que ocultar un problema real).
    }
  }

  return rows.map((r) => {
    const esAlumnoConGrupo = r.role === "student" && !!r.group_id;
    return {
      id: r.id,
      full_name: r.full_name,
      email: r.email,
      role: r.role,
      school_level: r.school_level,
      group_id: r.group_id,
      grupo_nombre: r.group_id ? grupoMap.get(r.group_id) ?? null : null,
      escuela_id: r.escuela_id,
      escuela_nombre: r.escuelas?.nombre ?? null,
      vinculo_confirmado: esAlumnoConGrupo ? linkedSet.has(`${r.id}||${r.group_id}`) : true,
      created_at: r.created_at,
    };
  });
}

// ─── Restablecer contraseña ────────────────────────────────────────────────────

export async function resetUserPassword(userId: string, newPassword: string): Promise<{ success: true }> {
  const session = await requireAdminSession();

  if (!userId) throw new Error("Falta el identificador del usuario.");
  const pw = (newPassword ?? "").trim();
  if (pw.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");

  const admin = getAdminClient();

  // Un admin de escuela solo puede restablecer contraseñas de usuarios de su
  // propia escuela, y nunca de otro admin/super_admin — de lo contrario
  // cualquier admin podría tomar el control de la cuenta de otro
  // administrador (o de un admin de otra escuela) con solo conocer su id.
  if (!session.isSuperAdmin) {
    let targetProfile, targetErr;
    try {
      ({ data: targetProfile, error: targetErr } = await withOpTimeout(
        admin.from("profiles").select("role, escuela_id").eq("id", userId).single(),
        "verificar perfil objetivo"
      ));
    } catch (err: any) {
      console.error('[adminUserActions] resetUserPassword target lookup timeout/conexión:', err?.message);
      throw new Error("No se pudo restablecer la contraseña: falla de conexión con la base de datos.");
    }
    if (targetErr || !targetProfile) {
      throw new Error("Usuario no encontrado.");
    }
    if (targetProfile.escuela_id !== session.profile.escuela_id) {
      throw new Error("FORBIDDEN: no puedes modificar usuarios de otra escuela.");
    }
    if (["admin", "super_admin"].includes(targetProfile.role)) {
      throw new Error("FORBIDDEN: no tienes permisos para restablecer la contraseña de un administrador.");
    }
  }

  let error;
  try {
    ({ error } = await withOpTimeout(
      admin.auth.admin.updateUserById(userId, { password: pw }),
      "restablecer contraseña"
    ));
  } catch (err: any) {
    console.error('[adminUserActions] resetUserPassword timeout/conexión:', err?.message);
    throw new Error("No se pudo restablecer la contraseña: falla de conexión con la base de datos.");
  }
  if (error) {
    console.error('[adminUserActions] resetUserPassword error:', error.message);
    throw new Error("No se pudo restablecer la contraseña.");
  }

  return { success: true };
}

// ─── Reparar perfil (escuela / rol / grupo) ────────────────────────────────────

export interface RepairProfileUpdates {
  escuelaId?: string | null;
  role?: ProfileRole;
  groupId?: string | null;
}

export interface RepairProfileResult {
  success: true;
  vinculoAlumnosGrupos: boolean;
  vinculoProfesorGrupo: boolean;
}

export async function repairUserProfile(
  userId: string,
  updates: RepairProfileUpdates
): Promise<RepairProfileResult> {
  const session = await requireAdminSession();

  if (!userId) throw new Error("Falta el identificador del usuario.");
  if (updates.role !== undefined && !VALID_ROLES.includes(updates.role)) {
    throw new Error("Rol inválido.");
  }
  // Solo un super_admin puede otorgar el rol super_admin — de lo contrario un
  // admin de escuela podría auto-promoverse (o promover a cualquier usuario)
  // a super_admin llamando esta Server Action directamente con ese payload.
  if (updates.role === 'super_admin' && !session.isSuperAdmin) {
    throw new Error("No tienes permisos para asignar el rol super_admin.");
  }

  const admin = getAdminClient();

  // Se reutiliza (si ya se consultó abajo) para no repetir el SELECT al
  // validar más adelante que el grupo destino pertenezca a la escuela final.
  let targetProfileEscuelaId: string | null | undefined;

  // Un admin de escuela solo puede reparar perfiles de su propia escuela, y
  // no puede reasignar un usuario a una escuela distinta a la suya — de lo
  // contrario podría "robar" alumnos/profesores de otra escuela con solo
  // conocer su id.
  if (!session.isSuperAdmin) {
    let targetProfile, targetErr;
    try {
      ({ data: targetProfile, error: targetErr } = await withOpTimeout(
        admin.from("profiles").select("escuela_id").eq("id", userId).single(),
        "verificar escuela del perfil objetivo"
      ));
    } catch (err: any) {
      console.error('[adminUserActions] repairUserProfile target lookup timeout/conexión:', err?.message);
      throw new Error("No se pudo actualizar el perfil: falla de conexión con la base de datos.");
    }
    if (targetErr || !targetProfile) {
      throw new Error("Usuario no encontrado.");
    }
    if (targetProfile.escuela_id !== session.profile.escuela_id) {
      throw new Error("FORBIDDEN: no puedes modificar usuarios de otra escuela.");
    }
    if (updates.escuelaId !== undefined && updates.escuelaId !== session.profile.escuela_id) {
      throw new Error("FORBIDDEN: no puedes asignar usuarios a otra escuela.");
    }
    targetProfileEscuelaId = targetProfile.escuela_id;
  }

  // Fix MEDIO: profiles.group_id es un campo TEXT libre sin FK (ver
  // schema.sql:21 — admite varios ids separados por coma para profesores),
  // así que nada a nivel de base de datos impide asignar aquí un grupo que
  // exista pero pertenezca a OTRA escuela. Un super_admin no está sujeto al
  // guard de escuela de arriba, así que sin este chequeo podría dejar un
  // perfil con escuela_id de la escuela A pero group_id/alumnos_grupos
  // apuntando a un grupo de la escuela B.
  if (updates.groupId !== undefined && updates.groupId !== null) {
    let finalEscuelaId: string | null;
    if (updates.escuelaId !== undefined) {
      finalEscuelaId = updates.escuelaId;
    } else if (targetProfileEscuelaId !== undefined) {
      finalEscuelaId = targetProfileEscuelaId;
    } else {
      // Camino de super_admin sin escuelaId en el payload: targetProfileEscuelaId
      // nunca se consultó arriba (ese SELECT solo corre para admins de escuela),
      // así que hay que resolver la escuela actual del perfil objetivo aquí.
      const { data: currentProfile, error: currentErr } = await withOpTimeout(
        admin.from("profiles").select("escuela_id").eq("id", userId).single(),
        "verificar escuela actual del perfil"
      );
      if (currentErr || !currentProfile) {
        throw new Error("Usuario no encontrado.");
      }
      finalEscuelaId = currentProfile.escuela_id;
    }

    const { data: grupo, error: grupoErr } = await withOpTimeout(
      admin.from("grupos").select("escuela_id").eq("id", updates.groupId).single(),
      "verificar grupo destino"
    );
    if (grupoErr || !grupo) {
      throw new Error("El grupo seleccionado no existe.");
    }
    if (grupo.escuela_id !== finalEscuelaId) {
      throw new Error("El grupo seleccionado pertenece a otra escuela.");
    }
  }

  const updatePayload: Record<string, unknown> = {};
  if (updates.escuelaId !== undefined) updatePayload.escuela_id = updates.escuelaId;
  if (updates.role !== undefined) updatePayload.role = updates.role;
  if (updates.groupId !== undefined) updatePayload.group_id = updates.groupId;

  if (Object.keys(updatePayload).length > 0) {
    let error;
    try {
      ({ error } = await withOpTimeout(
        admin.from("profiles").update(updatePayload).eq("id", userId),
        "actualizar perfil"
      ));
    } catch (err: any) {
      console.error('[adminUserActions] repairUserProfile update timeout/conexión:', err?.message);
      throw new Error("No se pudo actualizar el perfil: falla de conexión con la base de datos.");
    }
    if (error) {
      console.error('[adminUserActions] repairUserProfile update error:', error.message);
      throw new Error("No se pudo actualizar el perfil.");
    }
  }

  // Releer el estado final del perfil (puede haber cambiado por esta llamada
  // o ya venir correcto de antes) para decidir si falta vincular en
  // alumnos_grupos, que es la tabla que realmente usan RLS y los reportes.
  let profile, profileErr;
  try {
    ({ data: profile, error: profileErr } = await withOpTimeout(
      admin.from("profiles").select("role, group_id").eq("id", userId).single(),
      "verificar perfil actualizado"
    ));
  } catch (err: any) {
    console.error('[adminUserActions] repairUserProfile reread timeout/conexión:', err?.message);
    throw new Error("El perfil se actualizó, pero no se pudo verificar el vínculo de grupo: falla de conexión con la base de datos.");
  }
  if (profileErr || !profile) {
    console.error('[adminUserActions] repairUserProfile reread error:', profileErr?.message);
    throw new Error("El perfil se actualizó, pero no se pudo leer su estado final.");
  }

  let vinculoAlumnosGrupos = false;
  if (profile.role === "student" && profile.group_id) {
    let existing, existingErr;
    try {
      ({ data: existing, error: existingErr } = await withOpTimeout(
        admin
          .from("alumnos_grupos")
          .select("id_alumno")
          .eq("id_alumno", userId)
          .eq("id_grupo", profile.group_id)
          .maybeSingle(),
        "verificar vínculo alumno-grupo"
      ));
    } catch (err: any) {
      console.error('[adminUserActions] repairUserProfile check link timeout/conexión:', err?.message);
      throw new Error("El perfil se actualizó, pero no se pudo verificar alumnos_grupos: falla de conexión con la base de datos.");
    }
    if (existingErr) {
      console.error('[adminUserActions] repairUserProfile check link error:', existingErr.message);
      throw new Error("El perfil se actualizó, pero no se pudo verificar alumnos_grupos.");
    }

    if (!existing) {
      const { error: insertErr } = await withOpTimeout(
        admin.from("alumnos_grupos").insert({ id_alumno: userId, id_grupo: profile.group_id }),
        "vincular alumno al grupo"
      );
      if (insertErr) {
        console.error('[adminUserActions] repairUserProfile insert link error:', insertErr.message);
        throw new Error("El perfil se actualizó, pero no se pudo crear el vínculo alumno-grupo.");
      }
    }
    vinculoAlumnosGrupos = true;
  }

  // Mismo problema que tenía onboardEscuela antes de su fix CRÍTICO: un
  // profesor con profiles.group_id correcto pero grupos.id_profesor sin
  // asignar queda invisible para sí mismo en /dashboard/teacher/alumnos, que
  // resuelve el roster exclusivamente a partir de grupos.id_profesor. A
  // diferencia de assign_teacher_to_group() (pensado para altas concurrentes,
  // "primer profesor gana"), aquí un admin está corrigiendo explícitamente la
  // asignación de un profesor ya existente, así que se sobreescribe sin
  // condición — es una acción intencional y no concurrente.
  let vinculoProfesorGrupo = false;
  if (profile.role === "teacher" && profile.group_id) {
    const { error: assignErr } = await withOpTimeout(
      admin.from("grupos").update({ id_profesor: userId }).eq("id", profile.group_id),
      "vincular profesor al grupo"
    );
    if (assignErr) {
      console.error('[adminUserActions] repairUserProfile assign teacher error:', assignErr.message);
      throw new Error("El perfil se actualizó, pero no se pudo vincular al profesor con su grupo.");
    }
    vinculoProfesorGrupo = true;
  }

  return { success: true, vinculoAlumnosGrupos, vinculoProfesorGrupo };
}
