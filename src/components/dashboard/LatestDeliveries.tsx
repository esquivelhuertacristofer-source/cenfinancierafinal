"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Activity, Clock, CheckCircle2, ArrowUpRight, Zap, Sparkles } from "lucide-react";
import StudentRecordModal from "./StudentRecordModal";

interface DeliveryReal {
  id: string;
  user_id: string;
  name: string;
  initials: string;
  time: string;
  text: string;
  color: string;
}

export default function LatestDeliveries({ groupId, isDark = true }: { groupId?: string, isDark?: boolean }) {
  const [deliveries, setDeliveries] = useState<DeliveryReal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchLatest = async () => {
      try {
        const groups = groupId ? groupId.split(',').map(g => g.trim()) : [];
        
        let query = supabase
          .from('progress')
          .select(`
            id,
            activity_id,
            created_at,
            user_id
          `)
          .order('created_at', { ascending: false });

        if (groups.length > 0) {
          const { data: studentsInGroup } = await supabase
            .from('profiles')
            .select('id')
            .in('group_id', groups);
          
          if (studentsInGroup && studentsInGroup.length > 0) {
            query = query.in('user_id', studentsInGroup.map(s => s.id));
          } else {
            setDeliveries([]);
            setLoading(false);
            return;
          }
        }

        const { data: progressData } = await query.limit(5);

        if (progressData && progressData.length > 0) {
          const studentIds = progressData.map(d => d.user_id);
          const { data: students } = await supabase.from('profiles').select('id, full_name').in('id', studentIds);

          const COLORS = isDark 
            ? ["bg-white/10", "bg-[#FF8C00]/20", "bg-[#42E8E0]/20", "bg-white/5", "bg-[#FF8C00]/10"]
            : ["bg-[#011C40]", "bg-[#FF8C00]", "bg-[#42E8E0]", "bg-[#011C40]/80", "bg-[#FF8C00]/80"];
          
          const mapped = progressData.map((d: any, i) => {
            const student = students?.find(s => s.id === d.user_id);
            const name = student?.full_name || "Estudiante";
            const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
            
            const date = new Date(d.created_at);
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return {
              id: d.id,
              user_id: d.user_id,
              name,
              initials,
              time,
              text: `Completó el módulo de ${d.activity_id.toUpperCase()}`,
              color: COLORS[i % COLORS.length]
            };
          });
          setDeliveries(mapped as DeliveryReal[]);
        } else {
          setDeliveries([]);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();

    // SUSCRIPCIÓN EN TIEMPO REAL (DIAMOND ENGINE)
    const channel = supabase
      .channel('realtime_deliveries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'progress' },
        () => {
            fetchLatest(); // Recargamos para mantener la coherencia y el orden
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, isDark]);

  if (!mounted) return null;

  return (
    <div className={`rounded-[4rem] p-12 flex flex-col h-full relative overflow-hidden group/main animate-in fade-in slide-in-from-left-8 duration-1000 border transition-all ${
      isDark 
      ? 'bg-white/5 backdrop-blur-3xl border-white/5 shadow-2xl' 
      : 'bg-white border-slate-100 shadow-[0_40px_80px_rgba(1,28,64,0.06)]'
    }`}>
      
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-40 transition-opacity duration-1000 ${
        isDark ? 'bg-[#42E8E0]/5 group-hover/main:opacity-100' : 'bg-[#42E8E0]/10 group-hover/main:opacity-60'
      }`} />
      <div className="absolute inset-0 noise-texture opacity-[0.02] pointer-events-none" />

      <div className="mb-14 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
           <div className={`flex h-16 w-16 items-center justify-center rounded-[2rem] border shadow-2xl transition-all duration-700 group-hover/main:scale-110 group-hover/main:rotate-6 ${
             isDark ? 'bg-white/5 border-white/10 text-[#42E8E0]' : 'bg-[#011C40]/5 border-[#011C40]/10 text-[#011C40]'
           }`}>
             <Activity className="h-8 w-8" strokeWidth={2.5} />
           </div>
           <div>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] leading-none pb-2 flex items-center gap-3 transition-colors ${
                isDark ? 'text-white/30' : 'text-slate-400'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-[#FF8C00]" /> TIEMPO REAL
              </h3>
              <p className={`text-3xl font-black tracking-tighter transition-colors ${
                isDark ? 'text-white' : 'text-[#011C40]'
              }`}>Últimas Entregas</p>
           </div>
        </div>
        <button className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors group/audit ${
          isDark ? 'text-[#42E8E0] hover:text-white' : 'text-[#011C40]/40 hover:text-[#FF8C00]'
        }`}>
          Audit <ArrowUpRight className="w-4 h-4 group-hover/audit:translate-x-1 group-hover/audit:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-10 flex-1 relative z-10">
        {loading ? (
          <div className="space-y-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-6 animate-pulse">
                <div className={`w-16 h-16 rounded-[1.5rem] ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                <div className="flex-1 space-y-3">
                  <div className={`h-4 w-3/4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                  <div className={`h-3 w-1/4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : deliveries.map((delivery, i) => (
          <div 
            key={delivery.id} 
            className="flex gap-8 group/item relative animate-in fade-in slide-in-from-bottom-4 cursor-pointer" 
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={() => setSelectedStudent({ id: delivery.user_id, name: delivery.name })}
          >
            {/* Timeline Connector */}
            {i !== deliveries.length - 1 && (
              <div className={`absolute left-8 top-16 bottom-[-2.5rem] w-px transition-colors ${
                isDark ? 'bg-white/5' : 'bg-slate-100'
              }`} />
            )}
            
            <div
              className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.5rem] text-lg font-black text-white transition-all group-hover/item:scale-110 shadow-2xl z-10 relative overflow-hidden group/avatar border ${
                isDark ? 'border-white/5' : 'border-white'
              } ${delivery.color}`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
              {delivery.initials}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className={`text-lg font-black truncate tracking-tight transition-colors group-hover/item:text-[#FF8C00] ${
                  isDark ? 'text-white' : 'text-[#011C40]'
                }`}>
                  {delivery.name}
                </p>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black whitespace-nowrap transition-all ${
                  isDark 
                  ? 'bg-white/5 border-white/5 text-white/40 group-hover/item:text-[#42E8E0]' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 group-hover/item:text-[#011C40]'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {delivery.time}
                </div>
              </div>
              <div className="flex items-start gap-3 pt-1">
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                   isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
                 }`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                 </div>
                 <p className={`text-[14px] font-medium leading-relaxed max-w-sm transition-colors ${
                   isDark ? 'text-white/60' : 'text-slate-500'
                 }`}>
                   {delivery.text}
                 </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={`w-full mt-14 py-6 font-black rounded-[2.5rem] border text-[12px] uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-4 group/btn shadow-2xl backdrop-blur-xl ${
        isDark 
        ? 'bg-[#42E8E0]/10 border-[#42E8E0]/20 text-[#42E8E0] hover:bg-[#42E8E0] hover:text-[#011C40]' 
        : 'bg-[#011C40] border-[#011C40] text-white hover:bg-[#FF8C00] hover:border-[#FF8C00]'
      }`}>
         <span>Historial de Sesiones</span>
         <Zap className="w-5 h-5 group-hover/btn:fill-current" />
      </button>

      {/* MODAL DE EXPEDIENTE */}
      {selectedStudent && (
        <StudentRecordModal 
          studentId={selectedStudent.id} 
          studentName={selectedStudent.name} 
          isDark={isDark} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}
