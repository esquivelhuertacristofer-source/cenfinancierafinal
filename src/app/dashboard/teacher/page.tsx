"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Clock, 
  BarChart3,
  Layout,
  Sun,
  Moon,
  ChevronRight
} from "lucide-react";

import Sidebar from "../../../components/dashboard/Sidebar";
import WelcomeBanner from "../../../components/dashboard/WelcomeBanner";
import MetricCards from "../../../components/dashboard/MetricCards";
import TopAlumnos from "../../../components/dashboard/TopAlumnos";
import LatestDeliveries from "../../../components/dashboard/LatestDeliveries";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  group_id: string;
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState<Profile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedLevel, setSelectedLevel] = useState<'primaria' | 'secundaria'>('secundaria');
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/log-in"); return; }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profile || profile.role !== "teacher") {
          router.push("/");
          return;
        }
        setTeacherData(profile);
        // Autodetect level based on group_id or profile metadata if available
        if (profile.group_id?.toLowerCase().includes('p')) setSelectedLevel('primaria');
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [router]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center font-['Epilogue'] transition-colors duration-700 ${theme === 'dark' ? 'bg-[#011C40]' : 'bg-[#F4F1EA]'}`}>
      <div className="flex flex-col items-center gap-8 relative">
        <div className={`absolute inset-0 rounded-full blur-3xl animate-pulse ${theme === 'dark' ? 'bg-[#FF8C00]/20' : 'bg-[#FF8C00]/10'}`} />
        <div className={`relative w-24 h-24 border-8 rounded-full animate-spin shadow-2xl ${theme === 'dark' ? 'border-white/10 border-t-[#FF8C00]' : 'border-[#011C40]/10 border-t-[#FF8C00]'}`} />
        <div className="text-center space-y-2">
          <p className={`text-sm font-black uppercase tracking-[0.4em] animate-pulse ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>Iniciando Portal</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diamond State Experience</p>
        </div>
      </div>
    </div>
  );

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

      <Sidebar 
        teacherName={teacherData?.full_name} 
        groupId={teacherData?.group_id} 
        currentLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />

      <main className="flex-1 ml-[260px] relative z-10 custom-scrollbar overflow-y-auto h-screen flex flex-col">
        
        {/* HUD STATUS BAR (THEME AWARE) */}
        <div className={`sticky top-0 z-50 backdrop-blur-3xl border-b px-12 py-5 flex items-center justify-between transition-all duration-700 ${theme === 'dark' ? 'bg-[#011C40]/80 border-white/5 shadow-2xl' : 'bg-[#F4F1EA]/80 border-[#011C40]/5 shadow-lg shadow-[#011C40]/5'}`}>
          <div className="flex items-center gap-12">
             <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)] ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-white/50' : 'text-[#011C40]/40'}`}>SISTEMA ONLINE</span>
             </div>
             
             <div className="h-6 w-px bg-current opacity-10" />
             
             <div className="hidden xl:flex items-center gap-10">
                {[
                  { label: "Tráfico", val: "Optimizado", icon: Activity, color: theme === 'dark' ? "text-[#FF8C00]" : "text-[#FF8C00]" },
                  { label: "Sync", val: "12ms", icon: Zap, color: theme === 'dark' ? "text-[#42E8E0]" : "text-[#011C40]" },
                  { label: "Cifrado", val: "AES-256", icon: ShieldCheck, color: "text-emerald-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-default">
                    <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                    <div className="flex flex-col">
                       <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>{item.label}</span>
                       <span className={`text-[10px] font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>{item.val}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-8">
             {/* THEME TOGGLE (PREMIUM) */}
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

             <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border shadow-inner transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/50' : 'text-[#011C40]/60'}`}>
                  LUN 4 MAY
                </span>
             </div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="p-12 space-y-24 flex-1">
          
          {/* WELCOME SECTION */}
          <div className="animate-in fade-in slide-in-from-top-12 duration-1000">
             <WelcomeBanner teacherName={teacherData?.full_name} isDark={theme === 'dark'} currentLevel={selectedLevel} />
          </div>

          {/* ANALYTICS SECTION */}
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center shadow-2xl transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                      <BarChart3 className={`w-8 h-8 ${theme === 'dark' ? 'text-[#FF8C00]' : 'text-[#011C40]'}`} />
                   </div>
                   <div>
                      <h2 className={`text-4xl font-black tracking-tighter leading-none mb-2 transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>Resumen Ejecutivo</h2>
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-[#42E8E0]' : 'bg-[#FF8C00]'}`} />
                         <p className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Panel de Inteligencia Académica</p>
                      </div>
                   </div>
                </div>
                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-4 transition-all shadow-sm ${theme === 'dark' ? 'bg-[#42E8E0]/10 border-[#42E8E0]/20' : 'bg-white border-slate-200'}`}>
                   <Layout className={`w-4 h-4 ${theme === 'dark' ? 'text-[#42E8E0]' : 'text-[#011C40]'}`} />
                   <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-[#42E8E0]' : 'text-[#011C40]'}`}>V3.5 Diamond State</span>
                </div>
             </div>
             
             <MetricCards groupId={teacherData?.group_id} isDark={theme === 'dark'} />
          </div>

          {/* BENTO GRID: FEED & RANKING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch pb-20 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
            {/* PANEL IZQUIERDO: ACTIVIDAD */}
            <div className="lg:col-span-7">
               <LatestDeliveries groupId={teacherData?.group_id} isDark={theme === 'dark'} />
            </div>
            
            {/* PANEL DERECHO: NARANJA PREMIUM (RANKING) */}
            <div className="lg:col-span-5">
               <TopAlumnos groupId={teacherData?.group_id} isDark={theme === 'dark'} />
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(1, 28, 64, 0.15)'};
        }
        
        .premium-shadow {
          box-shadow: ${theme === 'dark' ? '0 50px 100px rgba(0,0,0,0.5)' : '0 50px 100px rgba(1, 28, 64, 0.08)'};
        }
      `}</style>
    </div>
  );
}
