"use client";

import { Users, LayoutGrid, TrendingUp, Loader2, Award, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MetricCards({ groupId, isDark = true }: { groupId?: string, isDark?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ alumnos: 0, grupos: 1, practicas: 0 });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    async function fetchStats() {
      setLoading(true);
      try {
        const groups = groupId ? groupId.split(',').map(g => g.trim()) : [];
        
        let studentQuery = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
        if (groups.length > 0) studentQuery = studentQuery.in('group_id', groups);
        const { count: aCount } = await studentQuery;
        
        let progressQuery = supabase.from('progress').select('*', { count: 'exact', head: true });
        if (groups.length > 0) {
            const { data: students } = await supabase.from('profiles').select('id').in('group_id', groups);
            if (students && students.length > 0) {
                progressQuery = progressQuery.in('user_id', students.map(s => s.id));
            }
        }
        const { count: pCount } = await progressQuery;

        setStats({ alumnos: aCount || 0, grupos: groups.length || 1, practicas: pCount || 0 });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [groupId, isDark]);

  if (!mounted) return null;
  
  const cards = [
    { 
      title: "Alumnos Activos", 
      value: stats.alumnos, 
      icon: Users, 
      color: isDark ? "text-white" : "text-[#011C40]", 
      bg: isDark ? "bg-white/5" : "bg-[#011C40]/5", 
      accent: isDark ? "bg-white" : "bg-[#011C40]",
      secondary: "Matriculados",
      trend: "+4.5%"
    },
    { 
      title: "Grupos", 
      value: stats.grupos, 
      icon: LayoutGrid, 
      color: isDark ? "text-[#42E8E0]" : "text-[#011C40]", 
      bg: isDark ? "bg-[#42E8E0]/10" : "bg-[#011C40]/5", 
      accent: isDark ? "bg-[#42E8E0]" : "bg-[#011C40]",
      secondary: "Enlace Directo",
      trend: "Estable"
    },
    { 
      title: "Logros SEP", 
      value: stats.practicas, 
      icon: Award, 
      color: "text-[#FF8C00]", 
      bg: "bg-[#FF8C00]/10", 
      accent: "bg-[#FF8C00]",
      secondary: "Unidades",
      trend: "+12.2%"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`group relative h-[240px] rounded-[3rem] border transition-all duration-700 flex flex-col p-10 overflow-hidden shadow-2xl ${
              isDark 
              ? 'bg-white/5 border-white/5 backdrop-blur-2xl hover:bg-white/10 hover:-translate-y-2' 
              : 'bg-white border-slate-200 hover:shadow-[0_40px_80px_rgba(1,28,64,0.12)] hover:-translate-y-2'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* HUD Corner Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity ${card.bg}`} />
            <div className={`absolute top-6 right-6 w-16 h-16 border-t border-r rounded-tr-3xl transition-all ${
              isDark ? 'border-white/20 opacity-30' : 'border-[#011C40]/10 opacity-60 group-hover:border-[#FF8C00]'
            }`} />

            <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-[#011C40]/5 border-[#011C40]/10'
                  } ${card.color} group-hover:scale-110 group-hover:rotate-6`}>
                     <Icon className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-end">
                     <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{card.secondary}</span>
                     <div className="flex items-center gap-1 mt-1.5">
                        <span className={`text-[11px] font-black ${card.color}`}>{card.trend}</span>
                        <ArrowUpRight className={`w-3.5 h-3.5 ${card.color} opacity-40`} />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col">
                  <div className="flex items-baseline gap-4">
                     {loading ? (
                       <div className={`h-16 w-32 rounded-2xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                     ) : (
                       <span className={`text-7xl font-black tracking-tighter leading-none group-hover:translate-x-1 transition-transform ${isDark ? 'text-white' : 'text-[#011C40]'}`}>
                          {card.value}
                       </span>
                     )}
                     <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-[#011C40]/40'}`}>{card.title}</span>
                  </div>
                  
                  {/* Segmented HUD Visualizer */}
                  <div className="mt-8 flex gap-1.5">
                     {[...Array(20)].map((_, j) => (
                        <div 
                          key={j} 
                          className={`h-2 w-full rounded-full transition-all duration-700 ${
                             j < 14 ? card.accent + (isDark ? ' opacity-20 group-hover:opacity-60' : ' opacity-10 group-hover:opacity-60') : (isDark ? 'bg-white/5' : 'bg-slate-100')
                          }`}
                          style={{ transitionDelay: `${j * 20}ms` }}
                        />
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
