"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/dashboard/Sidebar";
import {
  Users,
  Search,
  Printer,
  TrendingUp,
  Loader2,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  UserPlus,
  GraduationCap,
  Calendar,
  Zap,
  Star,
  Award,
  Clock,
  Layout,
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface ProgressEntry {
  activity_id: string;
  completed_at: string;
}

interface Student {
  id: string;
  full_name: string;
  email: string | null;
  school_level: string | null;
  group_id: string | null;
  progress_count: number;
  total_minutes?: number;
  history?: ProgressEntry[];
}

interface TeacherProfile {
  full_name: string;
  group_id: string;
}

export default function AlumnosPage() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Student | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/log-in"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, group_id")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "teacher") { router.push("/"); return; }
      setTeacher({ full_name: profile.full_name, group_id: profile.group_id });

      const groups = profile.group_id
        ? profile.group_id.split(",").map((g: string) => g.trim())
        : [];

      const fetchStudents = async () => {
        let q = supabase
          .from("profiles")
          .select("id, full_name, email, school_level, group_id, total_minutes")
          .eq("role", "student");
        if (groups.length > 0) q = q.in("group_id", groups);
        return q;
      };

      const [studentsRes, progressRes] = await Promise.all([
        fetchStudents(),
        supabase.from("progress").select("user_id")
      ]);

      const rawStudents = studentsRes.data;
      const progressData = progressRes.data;

      if (rawStudents && rawStudents.length > 0) {
        const countMap: Record<string, number> = {};
        (progressData || []).forEach((p: any) => {
          countMap[p.user_id] = (countMap[p.user_id] || 0) + 1;
        });

        const enriched: Student[] = rawStudents.map((s: any) => ({
          ...s,
          progress_count: countMap[s.id] || 0,
        }));

        setStudents(enriched);
        setFiltered(enriched);
      }
      setLoading(false);
    };
    init();
  }, [router]);

  // Fetch detailed history when a student is selected
  useEffect(() => {
    if (selected && !selected.history) {
      const fetchHistory = async () => {
        setLoadingDetails(true);
        const { data, error } = await supabase
          .from("progress")
          .select("activity_id, completed_at")
          .eq("user_id", selected.id)
          .order("completed_at", { ascending: false });

        if (!error && data) {
          const history = data.map(d => ({
            activity_id: d.activity_id,
            completed_at: d.completed_at
          }));
          
          setSelected(prev => prev ? { ...prev, history } : null);
          setStudents(prev => prev.map(s => s.id === selected.id ? { ...s, history } : s));
        }
        setLoadingDetails(false);
      };
      fetchHistory();
    }
  }, [selected]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      students.filter(
        (s) =>
          s.full_name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.group_id?.toLowerCase().includes(q)
      )
    );
  }, [search, students]);

  if (!mounted) return null;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const getLevelLabel = (level: string | null) => {
    if (!level) return "Sin nivel";
    if (level.startsWith("primary")) return `Primaria ${level.split("-")[1] || ""}`;
    if (level.startsWith("secondary")) return `Secundaria ${level.split("-")[1] || ""}`;
    return level;
  };

  const handlePrintPDF = (student: Student) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Reporte - ${student.full_name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #011C40; }
            h1 { border-bottom: 2px solid #FF8C00; padding-bottom: 10px; }
            .meta { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { background: #f8f9fa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <h1>Expediente Académico: ${student.full_name}</h1>
          <div class="meta">
            <p><strong>Nivel:</strong> ${getLevelLabel(student.school_level)}</p>
            <p><strong>Grupo:</strong> ${student.group_id}</p>
            <p><strong>Total Actividades:</strong> ${student.progress_count} / 20</p>
          </div>
          <h2>Historial de Entregas</h2>
          <table>
            <thead>
              <tr><th>Actividad</th><th>Fecha de Entrega</th><th>Estatus</th></tr>
            </thead>
            <tbody>
              ${(student.history || []).map(h => `
                <tr>
                  <td>${h.activity_id}</td>
                  <td>${new Date(h.completed_at).toLocaleString()}</td>
                  <td>Completado</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (loading) return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-['Epilogue']">
      <Sidebar teacherName="..." groupId="..." />
      <main className="flex-1 md:ml-[260px] p-12 space-y-16">
        <div className="h-64 bg-[#011C40] rounded-[4rem] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[400px] bg-white rounded-[3.5rem] border border-slate-100 animate-pulse p-12" />
          ))}
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-['Epilogue'] relative overflow-hidden">
      <Sidebar teacherName={teacher?.full_name} groupId={teacher?.group_id} />

      <main className="flex-1 md:ml-[260px] p-12 space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[4rem] bg-[#011C40] p-16 shadow-2xl animate-in fade-in slide-in-from-top-12 duration-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8C00]/10 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#42E8E0]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Gestión de Alumnado</span>
              </div>
              <h1 className="text-7xl font-black text-white leading-none tracking-tighter">
                Mis <span className="dashboard-gradient-orange italic">Alumnos</span>
              </h1>
              <p className="text-white/50 font-medium text-lg max-w-xl">Supervisa el avance individual, entrega de prácticas y desempeño académico en tiempo real.</p>
            </div>
            <div className="w-full xl:w-96 space-y-4">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FF8C00] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar alumno..."
                  className="w-full pl-16 pr-6 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-white focus:border-[#FF8C00] outline-none transition-all backdrop-blur-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filtered.map((student, i) => (
            <div
              key={student.id}
              onClick={() => setSelected(student)}
              className="group relative bg-white rounded-[3.5rem] p-12 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-slate-100 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 bg-[#011C40] rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:rotate-6 transition-transform">
                  {getInitials(student.full_name || "??")}
                </div>
                <div className="text-right">
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">Activo</span>
                  <p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">{student.group_id}</p>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="font-black text-[#011C40] text-2xl tracking-tighter group-hover:text-[#FF8C00] transition-colors line-clamp-1">{student.full_name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{student.email || "Sin correo"}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Avance de Actividades</span>
                    <span className="text-[#011C40]">{student.progress_count}/20</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className="h-full bg-gradient-to-r from-[#011C40] to-[#FF8C00] rounded-full transition-all duration-1000"
                      style={{ width: `${(student.progress_count / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.total_minutes || 0}m invertidos</span>
                </div>
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#011C40] group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* DETAILED MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#011C40]/90 backdrop-blur-md p-6 animate-in fade-in duration-300" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#F4F1EA] rounded-[4rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row relative" onClick={e => e.stopPropagation()}>
            
            {/* Modal Sidebar (Identity) */}
            <div className="w-full xl:w-[380px] bg-[#011C40] p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><GraduationCap className="w-48 h-48" /></div>
               <div className="relative z-10 space-y-10">
                 <div className="w-32 h-32 bg-white/10 rounded-[3rem] border border-white/20 flex items-center justify-center text-4xl font-black shadow-2xl">
                    {getInitials(selected.full_name || "")}
                 </div>
                 <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-[#42E8E0] text-[#011C40] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Expediente Oficial</span>
                    <h2 className="text-4xl font-black tracking-tighter leading-none">{selected.full_name}</h2>
                    <p className="text-[#FF8C00] font-black text-xs uppercase tracking-[0.3em]">{getLevelLabel(selected.school_level)}</p>
                 </div>
                 <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white/5 rounded-xl"><Users className="w-5 h-5 text-white/40" /></div>
                       <div>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Grupo Asignado</p>
                          <p className="text-sm font-black text-white">{selected.group_id || "Sin grupo"}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white/5 rounded-xl"><History className="w-5 h-5 text-white/40" /></div>
                       <div>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Último Acceso</p>
                          <p className="text-sm font-black text-white">
                            {selected.history?.[0] ? new Date(selected.history[0].completed_at).toLocaleDateString() : "Sin actividad"}
                          </p>
                       </div>
                    </div>
                 </div>
               </div>
               
               <button 
                onClick={() => handlePrintPDF(selected)}
                className="relative z-10 w-full py-6 bg-white text-[#011C40] rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#FF8C00] hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
               >
                 <Printer className="w-5 h-5" /> Exportar Expediente
               </button>
            </div>

            {/* Modal Main Content (Progress & History) */}
            <div className="flex-1 p-12 overflow-y-auto dashboard-scrollbar-thin space-y-12">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#011C40]/40">Analítica de Desempeño</h3>
                  <button onClick={() => setSelected(null)} className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#011C40] hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 shadow-sm"><X className="w-6 h-6" /></button>
               </div>

               {/* KPI Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col items-center text-center space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grado de Avance</p>
                     <p className="text-5xl font-black text-[#011C40]">{selected.progress_count}<span className="text-slate-200 text-3xl">/20</span></p>
                     <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div className="h-full bg-[#42E8E0] rounded-full transition-all duration-1000" style={{ width: `${(selected.progress_count / 20) * 100}%` }} />
                     </div>
                  </div>
                  <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col items-center text-center space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión de Tiempo</p>
                     <p className="text-5xl font-black text-[#FF8C00]">{selected.total_minutes || 0}<span className="text-slate-200 text-3xl">m</span></p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Tiempo total acumulado</p>
                  </div>
               </div>

               {/* PROGRESS DOTS (VISUAL PRACTICES) */}
               <div className="bg-white rounded-[2.5rem] p-10 border border-white shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-[#011C40] uppercase tracking-widest">Mapa de Prácticas Entregadas</p>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-[#42E8E0]" /> Entregado</div>
                       <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-slate-100" /> Pendiente</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
                    {Array.from({ length: 20 }, (_, idx) => {
                      const isDone = idx < selected.progress_count;
                      return (
                        <div key={idx} className={`aspect-square rounded-xl flex items-center justify-center transition-all ${isDone ? "bg-[#42E8E0] shadow-[0_10px_20px_rgba(66,232,224,0.3)] scale-105" : "bg-slate-50 border border-slate-100 opacity-50"}`}>
                           {isDone ? <CheckCircle2 className="w-5 h-5 text-[#011C40]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                        </div>
                      )
                    })}
                  </div>
               </div>

               {/* HISTORY LOG */}
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <History className="w-5 h-5 text-[#FF8C00]" />
                    <p className="text-[10px] font-black text-[#011C40] uppercase tracking-widest">Historial de Actividad Reciente</p>
                  </div>
                  
                  <div className="space-y-4">
                    {loadingDetails ? (
                      <div className="flex flex-col items-center py-10 gap-4">
                         <Loader2 className="w-8 h-8 text-[#011C40] animate-spin" />
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sincronizando datos...</p>
                      </div>
                    ) : selected.history && selected.history.length > 0 ? (
                      selected.history.map((log, i) => (
                        <div key={i} className="group bg-white rounded-3xl p-6 border border-white shadow-sm flex items-center justify-between hover:border-[#FF8C00]/20 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#011C40] font-black text-xs group-hover:bg-[#011C40] group-hover:text-white transition-all">
                                {log.activity_id.split("-").pop() || "U"}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-[#011C40] uppercase tracking-tight">{log.activity_id}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                   {new Date(log.completed_at).toLocaleString("es-MX", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                 </p>
                              </div>
                           </div>
                           <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3" /> ENTREGADO
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center py-12 gap-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                         <AlertCircle className="w-10 h-10 text-slate-200" />
                         <p className="text-sm font-bold text-slate-400 italic">No hay prácticas registradas en este ciclo.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
