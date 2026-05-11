"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Trophy, Star, ArrowRight, Zap } from "lucide-react";

interface TopAlumnoReal {
  name: string;
  score: number;
  initials: string;
  color: string;
}

export default function TopAlumnos({
  groupId,
  teacherGroupIds,
  isDark = true,
}: {
  groupId?: string;
  teacherGroupIds?: string[];
  isDark?: boolean;
}) {
  const [topList, setTopList] = useState<TopAlumnoReal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchTop() {
      setLoading(true);
      try {
        const useNewSchema = teacherGroupIds && teacherGroupIds.length > 0;
        const groups = useNewSchema
          ? teacherGroupIds!
          : groupId ? groupId.split(",").map((g) => g.trim()) : [];

        let studentIds: string[] = [];

        if (useNewSchema) {
          const { data: memberships } = await supabase
            .from("alumnos_grupos")
            .select("id_alumno")
            .in("id_grupo", groups);
          studentIds = memberships?.map((m: any) => m.id_alumno) ?? [];
        } else if (groups.length > 0) {
          const { data: studentsInGroup } = await supabase
            .from("profiles")
            .select("id")
            .in("group_id", groups);
          studentIds = studentsInGroup?.map((s: any) => s.id) ?? [];
        }

        if (studentIds.length === 0) { setLoading(false); return; }

        // Load profiles + intentos count in parallel
        const [profilesRes, intentosRes] = await Promise.all([
          supabase.from("profiles").select("id, full_name").in("id", studentIds),
          supabase
            .from("intentos")
            .select("user_id, score")
            .in("user_id", studentIds)
            .eq("status", "completed"),
        ]);

        const profiles = profilesRes.data ?? [];
        const intentos = intentosRes.data ?? [];

        // Aggregate score per student: completed count * 10 + avg score bonus
        const scoreMap: Record<string, number> = {};
        const countMap: Record<string, number> = {};
        for (const intento of intentos as any[]) {
          scoreMap[intento.user_id] = (scoreMap[intento.user_id] ?? 0) + (intento.score ?? 50);
          countMap[intento.user_id] = (countMap[intento.user_id] ?? 0) + 1;
        }

        const COLORS = isDark
          ? ["bg-white", "bg-white/90", "bg-white/80", "bg-white/70", "bg-white/60"]
          : ["bg-[#011C40]", "bg-[#FF8C00]", "bg-[#42E8E0]", "bg-[#011C40]/90", "bg-[#FF8C00]/90"];

        const processed = profiles
          .map((p: any) => {
            const totalXp = (countMap[p.id] ?? 0) * 10 + Math.round((scoreMap[p.id] ?? 0) / Math.max(countMap[p.id] ?? 1, 1));
            const initials = p.full_name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "??";
            return { name: p.full_name || "Estudiante", score: totalXp, initials, color: "" };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map((a, i) => ({ ...a, color: COLORS[i % COLORS.length] }));

        setTopList(processed);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, [groupId, teacherGroupIds, isDark]);

  if (!mounted) return null;

  return (
    <div
      className={`rounded-[4rem] p-12 flex flex-col h-full relative overflow-hidden group/main animate-in fade-in slide-in-from-right-8 duration-1000 shadow-2xl border noise-texture transition-colors ${
        isDark ? "bg-[#FF8C00] border-white/20" : "bg-[#FF8C00] border-[#FF8C00]"
      }`}
    >
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white opacity-10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#011C40] opacity-10 rounded-full blur-[120px]" />

      <div className="mb-14 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-white/20 backdrop-blur-3xl text-white shadow-2xl border border-white/30 group-hover/main:scale-110 group-hover/main:rotate-[-8deg] transition-all duration-700">
            <Trophy className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 leading-none pb-2 flex items-center gap-3">
              <Zap className="w-3.5 h-3.5 text-white fill-white" /> LIDERAZGO
            </h3>
            <p className="text-3xl font-black text-white tracking-tighter">Hall of Fame</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Auditando Ranking...</p>
          </div>
        ) : topList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Trophy className="w-12 h-12 text-white/20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Sin actividad aún</p>
          </div>
        ) : (
          topList.map((alumno, i) => (
            <div
              key={i}
              className="flex items-center gap-6 rounded-[2.5rem] p-5 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 border border-transparent hover:border-white/10 group/item relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.5rem] text-lg font-black shadow-2xl transition-all group-hover/item:scale-110 relative overflow-hidden bg-white text-[#FF8C00]">
                  {alumno.initials}
                </div>
                {i < 3 && (
                  <div className="absolute -top-3 -right-3 bg-white rounded-2xl p-2 shadow-2xl border border-white/50 scale-110 z-20">
                    {i === 0 && <span className="text-xl">🥇</span>}
                    {i === 1 && <span className="text-xl">🥈</span>}
                    {i === 2 && <span className="text-xl">🥉</span>}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-lg font-black text-white tracking-tight group-hover/item:text-white transition-colors leading-none mb-2">
                  {alumno.name}
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-2.5 h-2.5 ${idx < 5 - i ? "fill-white text-white" : "text-white/20"}`}
                      />
                    ))}
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                    Nivel {5 - i} Maestría
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-4xl font-black text-white leading-none tracking-tighter">{alumno.score}</p>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">XP</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-10 py-6 bg-white/10 hover:bg-white text-white hover:text-[#FF8C00] font-black rounded-[2.5rem] border border-white/20 text-[12px] uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-4 group/btn shadow-xl backdrop-blur-xl">
        <span>Auditores Completos</span>
        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
      </button>
    </div>
  );
}
