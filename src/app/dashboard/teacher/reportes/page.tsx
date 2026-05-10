"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/dashboard/Sidebar";
import PerformanceChart from "../../../../components/dashboard/PerformanceChart";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Target, 
  Download, 
  Calendar,
  Sparkles,
  Zap,
  ShieldCheck,
  Layout,
  Activity,
  Sun,
  Moon
} from "lucide-react";

export default function ReportesPage() {
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/log-in"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setTeacher(profile);
      setLoading(false);
    };
    init();
  }, [router]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (loading) return null;

  return (
    <div className={`flex min-h-screen font-['Epilogue'] relative overflow-hidden transition-colors duration-1000 ${theme === 'dark' ? 'bg-[#011C40]' : 'bg-[#F4F1EA]'}`}>
      
      {/* CINEMATIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 right-0 w-[1400px] h-[1400px] rounded-full blur-[200px] -mr-80 -mt-80 animate-pulse transition-opacity duration-1000 ${theme === 'dark' ? 'bg-[#FF8C00]/5 opacity-100' : 'bg-[#FF8C00]/10 opacity-60'}`} />
        <div className={`absolute bottom-0 left-[300px] w-[1200px] h-[1200px] rounded-full blur-[180px] -ml-80 -mb-80 transition-opacity duration-1000 ${theme === 'dark' ? 'bg-[#42E8E0]/5 opacity-100' : 'bg-[#42E8E0]/10 opacity-60'}`} />
        
        {/* Subtle HUD Grid */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.05]'}`} 
             style={{ backgroundImage: `linear-gradient(${theme === 'dark' ? '#ffffff' : '#011C40'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#ffffff' : '#011C40'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <Sidebar teacherName={teacher?.full_name} groupId={teacher?.group_id} />

      <main className="flex-1 ml-[260px] relative z-10 custom-scrollbar overflow-y-auto h-screen flex flex-col">
        
        {/* HUD STATUS BAR */}
        <div className={`sticky top-0 z-50 backdrop-blur-3xl border-b px-12 py-5 flex items-center justify-between transition-all duration-700 ${theme === 'dark' ? 'bg-[#011C40]/80 border-white/5 shadow-2xl' : 'bg-[#F4F1EA]/80 border-[#011C40]/5 shadow-lg shadow-[#011C40]/5'}`}>
          <div className="flex items-center gap-12">
             <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)] ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-white/50' : 'text-[#011C40]/40'}`}>ANALÍTICA ACTIVA</span>
             </div>
             
             <div className="h-6 w-px bg-current opacity-10" />
             
             <div className="hidden xl:flex items-center gap-10">
                <div className="flex items-center gap-3 group cursor-default">
                  <Activity className="w-4 h-4 text-[#FF8C00]" />
                  <div className="flex flex-col">
                     <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Integridad</span>
                     <span className={`text-[10px] font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>100% Verified</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <button 
                onClick={toggleTheme}
                className={`relative flex items-center p-1 rounded-full transition-all duration-500 group shadow-inner ${theme === 'dark' ? 'bg-white/5 border border-white/10 w-24' : 'bg-[#011C40]/5 border border-[#011C40]/10 w-24'}`}
             >
                <div className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl ${theme === 'dark' ? 'translate-x-12 bg-[#FF8C00]' : 'translate-x-0 bg-[#011C40]'}`}>
                   {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                </div>
                <div className="w-full flex justify-between px-3">
                   <Sun className={`w-4 h-4 ${theme === 'light' ? 'opacity-0' : 'text-white/20'}`} />
                   <Moon className={`w-4 h-4 ${theme === 'dark' ? 'opacity-0' : 'text-[#011C40]/20'}`} />
                </div>
             </button>

             <div className={`h-10 w-px bg-current opacity-10`} />

             <button 
               className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                 theme === 'dark' ? 'bg-[#FF8C00] text-white shadow-[0_10px_30px_rgba(255,140,0,0.3)]' : 'bg-[#011C40] text-white'
               } hover:scale-105 active:scale-95`}
             >
               <Download className="w-4 h-4" />
               Reporte SEP
             </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-12 space-y-16 flex-1">
          
          {/* HEADER SECTION */}
          <div className="space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000">
             <div className="flex items-center gap-4">
                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] ${
                  theme === 'dark' ? 'bg-[#42E8E0]/10 text-[#42E8E0]' : 'bg-[#42E8E0]/20 text-[#011C40]'
                }`}>
                  Centro de Inteligencia
                </span>
                <div className="h-px w-20 bg-current opacity-10" />
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>
                  Métricas Diamond
                </span>
             </div>
             
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <h1 className={`text-7xl font-black tracking-tighter leading-none mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>
                     Reportes <span className={`italic font-serif ${theme === 'dark' ? 'text-[#FF8C00]' : 'text-[#FF8C00]'}`}>Académicos</span>
                   </h1>
                   <p className={`text-lg font-medium max-w-xl ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                     Analiza el desempeño de tu grupo con datos verificados y genera informes para la coordinación.
                   </p>
                </div>
             </div>
          </div>

          {/* BENTO GRID: ANALYTICS */}
          <div className="grid grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            
            {/* MAIN PERFORMANCE CHART */}
            <div className="col-span-12 lg:col-span-8">
               <PerformanceChart isDark={theme === 'dark'} />
            </div>

            {/* SIDE METRICS */}
            <div className="col-span-12 lg:col-span-4 space-y-10">
               {/* TARGET CARD */}
               <div className={`rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl transition-all duration-700 ${
                 theme === 'dark' ? 'bg-[#011C40] border border-white/5' : 'bg-white border border-slate-100'
               }`}>
                  <div className={`absolute bottom-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform ${theme === 'dark' ? 'text-[#42E8E0]' : 'text-[#011C40]'}`}>
                    <Target className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#42E8E0]/10 text-[#42E8E0]' : 'bg-[#42E8E0]/20 text-[#011C40]'}`}>
                          <Zap className="w-6 h-6" />
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Meta Alcanzada</p>
                     </div>
                     <p className={`text-6xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>84<span className="text-[#42E8E0]">%</span></p>
                     <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                       Tu grupo está superando el <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>promedio institucional</span> por 12 puntos.
                     </p>
                  </div>
               </div>

               {/* PIE DISTRIBUTION CARD */}
               <div className={`rounded-[3rem] p-10 border transition-all duration-700 shadow-xl ${
                 theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'
               }`}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#FF8C00]/10 text-[#FF8C00]' : 'bg-[#FFF1D6] text-[#FF8C00]'}`}>
                      <PieChart className="w-6 h-6" />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Distribución de Misiones</p>
                  </div>
                  <div className="space-y-6">
                     {[
                       { label: 'Ahorro', val: 40, color: 'bg-[#FF8C00]' },
                       { label: 'Inversión', val: 30, color: 'bg-[#011C40]' },
                       { label: 'Emprendimiento', val: 30, color: 'bg-[#42E8E0]' }
                     ].map(item => (
                       <div key={item.label} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className={theme === 'dark' ? 'text-white/50' : 'text-slate-400'}>{item.label}</span>
                             <span className={theme === 'dark' ? 'text-white' : 'text-[#011C40]'}>{item.val}%</span>
                          </div>
                          <div className={`h-2.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                             <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* BOTTOM QUICK STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-20">
             <div className={`rounded-[2.5rem] p-8 border flex items-center gap-6 transition-all ${
               theme === 'dark' ? 'bg-white/5 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-lg'
             }`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-[#F4F1EA]'}`}>
                   <Calendar className={`w-8 h-8 ${theme === 'dark' ? 'text-white/20' : 'text-[#011C40]/20'}`} />
                </div>
                <div>
                   <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Próximo Reporte</p>
                   <p className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>15 Mayo, 2024</p>
                </div>
             </div>
             
             <div className={`rounded-[2.5rem] p-8 border flex items-center gap-6 transition-all ${
               theme === 'dark' ? 'bg-white/5 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-lg'
             }`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-[#F4F1EA]'}`}>
                   <ShieldCheck className={`w-8 h-8 ${theme === 'dark' ? 'text-[#42E8E0]/40' : 'text-[#42E8E0]/40'}`} />
                </div>
                <div>
                   <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Estatus SEP</p>
                   <p className="text-xl font-black text-emerald-500">Validado ✓</p>
                </div>
             </div>

             <div className="bg-gradient-to-br from-[#FF8C00] to-[#E87A00] rounded-[2.5rem] p-8 text-white shadow-2xl flex items-center justify-between group cursor-pointer hover:scale-105 transition-all">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Soporte Premium</p>
                   <p className="text-xl font-black">Hablar con Tutor AI</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                   <Sparkles className="w-7 h-7 text-white" />
                </div>
             </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(1, 28, 64, 0.08)'};
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
