"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase-browser";
import { getScopedStudentIds } from "@/lib/teacherScope";

// WelcomeBanner, TopAlumnos y LatestDeliveries montan simultáneamente en
// /dashboard/teacher y cada uno resolvía el mismo roster por su cuenta.
// useSWR dedupea las 3 llamadas concurrentes con la misma key en 1 sola
// consulta, y evita repetirla si el profesor navega dentro del TTL.
export function useScopedStudentIds(groupId?: string, teacherGroupIds?: string[]) {
  const key =
    teacherGroupIds && teacherGroupIds.length > 0
      ? `scoped-students:new:${teacherGroupIds.join(",")}`
      : groupId
        ? `scoped-students:legacy:${groupId}`
        : null;

  const { data, isLoading } = useSWR(
    key,
    () => getScopedStudentIds(supabase, { groupId, teacherGroupIds }),
    { dedupingInterval: 120000 }
  );

  return { studentIds: data ?? [], loading: key ? isLoading : false };
}
