"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, Clock, ChevronRight, X } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  school_level: string;
  group_id: string;
  total_minutes: number;
}

interface Progress {
  id: string;
  user_id: string;
  activity_id: string;
  completed_at: string;
}

type View = "overview" | "groups";

export default function TeacherDashboard() {
  const [view, setView] = useState<View>("overview");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Profile[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [selected, setSelected] = useState<(Profile & { count: number }) | null>(null);
  const [teacher, setTeacher] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/log-in"); return; }

      const { data: tp } = await supabase
        .from("profiles").select("*").eq("id", user.id).single() as { data: Profile | null };

      if (!tp || (tp.school_level !== "teacher" && tp.school_level !== "admin")) {
        router.replace("/hub"); return;
      }
      setTeacher(tp);

      const groups = tp.group_id ? tp.group_id.split(",").map(g => g.trim()) : [];

      const [{ data: studs }, { data: prog }] = await Promise.all([
        supabase.from("profiles").select("*").in("school_level", ["primary","secondary"]).in("group_id", groups).order("full_name"),
        supabase.from("progress").select("*").order("completed_at", { ascending: false }),
      ]);

      setStudents((studs ?? []) as Profile[]);
      setProgressList((prog ?? []) as Progress[]);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);

  const grouped = useMemo(() =>
    students.reduce<Record<string, Profile[]>>((acc, s) => {
      const k = s.group_id || "Sin grupo";
      if (!acc[k]) acc[k] = [];
      acc[k].push(s); return acc;
    }, {}), [students]);

  const stats = useMemo(() => {
    if (!students.length) return { pct: 0, minutes: 0, alerts: 0 };
    const done = progressList.filter(p => students.some(s => s.id === p.user_id)).length;
    const total = students.length * 20;
    return {
      pct: Math.round((done / total) * 100) || 0,
      minutes: students.reduce((s, st) => s + (st.total_minutes || 0), 0),
      alerts: students.filter(s => progressList.filter(p => p.user_id === s.id).length < 4).length,
    };
  }, [students, progressList]);

  if (loading) return (
    <div className="min-h-screen bg-cen-blue flex items-center justify-center font-epilogue">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        <p className="text-white/70 font-bold text-sm tracking-widest uppercase">Cargando sistema...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cen-bg font-epilogue flex">

      {/* Sidebar */}
      <aside className="w-64 bg-cen-blue text-white flex flex-col fixed h-full z-40 shadow-2xl">
        <div className="px-7 py-6 border-b border-white/10">
          <p className="text-xl font-black tracking-tighter">CEN <span className="text-cen-cyan">ACADEMY</span></p>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-0.5">Panel Docente</p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {([
            { id: "overview", label: "Inteligencia General", Icon: LayoutDashboard },
            { id: "groups",   label: "Mis Salones",          Icon: Users },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
                view === id
                  ? "bg-white/15 text-white shadow-inner"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Docente activo</p>
          <p className="text-sm font-black text-white mb-4 truncate">{teacher?.full_name}</p>
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-cen-blue tracking-tight">Panel de Gestión</h1>
            <p className="text-slate-500 font-medium mt-1">
              Seguimiento en tiempo real · Grupos: <span className="font-black text-cen-blue">{teacher?.group_id || "Sin asignar"}</span>
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-cen-blue hover:text-cen-blue transition-all"
          >
            Ir al inicio <ChevronRight size={14} />
          </Link>
        </div>

        {view === "overview" ? (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cen-blue/10 flex items-center justify-center">
                    <TrendingUp size={18} className="text-cen-blue" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avance curricular</p>
                </div>
                <p className="text-4xl font-black text-cen-blue mb-3">{stats.pct}%</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cen-blue rounded-full transition-all" style={{ width: `${stats.pct}%` }} />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-cen-cyan/20 flex items-center justify-center">
                    <Clock size={18} className="text-cen-blue" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiempo invertido</p>
                </div>
                <p className="text-4xl font-black text-cen-blue">{stats.minutes}<span className="text-xl font-medium text-slate-400 ml-1">min</span></p>
              </div>

              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alumnos en riesgo</p>
                </div>
                <p className="text-4xl font-black text-red-500">{stats.alerts}</p>
                <p className="text-xs text-slate-400 font-bold mt-1">Menos del 20% completado</p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-cen-blue text-lg">Logros Recientes</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{progressList.length} actividades</span>
              </div>
              <div className="divide-y divide-slate-50">
                {progressList.length === 0 ? (
                  <p className="px-7 py-10 text-center text-slate-400 font-bold italic">Sin actividad registrada aún.</p>
                ) : progressList.slice(0, 8).map((log, i) => (
                  <div key={i} className="flex items-center justify-between px-7 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cen-blue/10 flex items-center justify-center text-xs font-black text-cen-blue">
                        {students.find(s => s.id === log.user_id)?.full_name?.[0] ?? "?"}
                      </div>
                      <span className="font-bold text-sm text-slate-700">
                        {students.find(s => s.id === log.user_id)?.full_name ?? "Estudiante"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-cen-blue/10 text-cen-blue rounded-xl text-xs font-black">{log.activity_id}</span>
                      <span className="text-xs text-slate-400 font-bold hidden sm:block">
                        {new Date(log.completed_at).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          Object.keys(grouped).sort().map(groupKey => (
            <div key={groupKey} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
              <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-black text-cen-blue text-lg">Grupo: {groupKey}</h2>
                <span className="px-3 py-1 bg-cen-blue text-white rounded-xl text-xs font-black">{grouped[groupKey].length} estudiantes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Estudiante", "Progreso de actividades", "Avance", "Acción"].map(h => (
                        <th key={h} className="px-7 py-4 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {grouped[groupKey].map(student => {
                      const done = progressList.filter(p => p.user_id === student.id).map(p => p.activity_id);
                      const pct = Math.round((done.length / 20) * 100);
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-7 py-5">
                            <p className="font-black text-sm text-cen-blue">{student.full_name}</p>
                            <p className="text-xs text-slate-400 font-medium">{student.email}</p>
                          </td>
                          <td className="px-7 py-5">
                            <div className="flex gap-1.5 flex-wrap">
                              {Array.from({ length: 20 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 rounded-md transition-all ${
                                    i < done.length ? "bg-cen-blue shadow-sm" : "bg-slate-100"
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-2">
                              <span className={`font-black text-sm ${pct > 80 ? "text-emerald-600" : pct < 25 ? "text-red-500" : "text-cen-blue"}`}>
                                {pct}%
                              </span>
                              {pct < 25 && <AlertTriangle size={14} className="text-red-400" />}
                            </div>
                          </td>
                          <td className="px-7 py-5">
                            <button
                              onClick={() => setSelected({ ...student, count: done.length })}
                              className="px-4 py-2 bg-slate-100 hover:bg-cen-blue hover:text-white text-slate-600 rounded-xl text-xs font-black transition-all"
                            >
                              Ver expediente
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Student detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-cen-blue" />
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-cen-blue">{selected.full_name}</h2>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">Grupo: {selected.group_id} · {selected.email}</p>
                </div>
                <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-cen-bg rounded-2xl p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tiempo invertido</p>
                  <p className="text-2xl font-black text-cen-blue">{selected.total_minutes || 0}<span className="text-sm font-medium text-slate-400 ml-1">min</span></p>
                </div>
                <div className="bg-cen-bg rounded-2xl p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Unidades completadas</p>
                  <p className="text-2xl font-black text-emerald-600">{selected.count}<span className="text-slate-300 font-medium text-lg"> /20</span></p>
                </div>
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Bitácora de logros</p>
              <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                {progressList.filter(p => p.user_id === selected.id).length === 0 ? (
                  <p className="text-center text-slate-400 italic text-sm py-6">Sin actividad registrada.</p>
                ) : progressList.filter(p => p.user_id === selected.id).map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-black text-xs text-cen-blue">{p.activity_id}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(p.completed_at).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
