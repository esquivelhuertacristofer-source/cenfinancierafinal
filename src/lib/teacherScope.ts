import type { SupabaseClient } from "@supabase/supabase-js";

// Resuelve el roster de un profesor (nuevo esquema institucional
// `alumnos_grupos` o legacy `profiles.group_id`) a una lista de IDs de
// alumno. Único punto de esta lógica: antes estaba duplicada idéntica en
// TopAlumnos.tsx y LatestDeliveries.tsx, con riesgo de que un tercer sitio
// la reimplementara mal (como pasó en WelcomeBanner.tsx, sin scoping).
export async function getScopedStudentIds(
  supabase: SupabaseClient,
  { groupId, teacherGroupIds }: { groupId?: string; teacherGroupIds?: string[] }
): Promise<string[]> {
  const useNewSchema = !!teacherGroupIds && teacherGroupIds.length > 0;
  const groups = useNewSchema
    ? teacherGroupIds!
    : groupId
      ? groupId.split(",").map((g) => g.trim())
      : [];

  if (useNewSchema) {
    const { data: memberships } = await supabase
      .from("alumnos_grupos")
      .select("id_alumno")
      .in("id_grupo", groups);
    return memberships?.map((m: any) => m.id_alumno) ?? [];
  }

  if (groups.length > 0) {
    const { data: studentsInGroup } = await supabase
      .from("profiles")
      .select("id")
      .in("group_id", groups);
    return studentsInGroup?.map((s: any) => s.id) ?? [];
  }

  return [];
}
