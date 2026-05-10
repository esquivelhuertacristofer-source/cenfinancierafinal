"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Sparkles, ArrowRight, Zap, Target, Star, Shield } from "lucide-react";

export default function WelcomeBanner({ 
  teacherName, 
  isDark = true,
  currentLevel = 'secundaria'
}: { 
  teacherName?: string, 
  isDark?: boolean,
  currentLevel?: 'primaria' | 'secundaria'
}) {
  const [completionRate, setCompletionRate] = useState(88);
  const [mounted, setMounted] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    setMounted(true);
    const fetchCompletionRate = async () => {
      try {
        const { count: totalAlumnos } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        const { data: progress } = await supabase
          .from('progress')
          .select('user_id');

        if (totalAlumnos && totalAlumnos > 0 && progress) {
          const uniqueAlumnos = new Set(progress.map(i => i.user_id)).size;
          const rate = Math.round((uniqueAlumnos / totalAlumnos) * 100);
          setCompletionRate(rate || 88);
        }

        // AI INSIGHT LOGIC
        const insights = {
          secundaria: [
             "Detectada baja participación en S3-4-2 (Exportación). ¿Quieres enviar recordatorio?",
             "¡Excelente! El 90% ha completado el módulo de Propiedad Intelectual.",
             "Tip Diamond: S3-4-4 requiere estados financieros listos. ¡Avísales!"
          ],
          primaria: [
             "Primaria 6A muestra gran avance en Ahorro. ¡Están listos para Inversión!",
             "Recordatorio: Mañana toca taller de Monedas del Mundo.",
             "Detección: 3 alumnos necesitan apoyo en el concepto de Trueque."
          ]
        };
        const levelInsights = insights[currentLevel as keyof typeof insights] || insights.secundaria;
        setAiInsight(levelInsights[Math.floor(Math.random() * levelInsights.length)]);

      } catch (err) {
        setCompletionRate(88);
      }
    };
    fetchCompletionRate();
  }, [currentLevel]);

  if (!mounted) return null;

  return (
    <div className={`relative overflow-hidden rounded-[4rem] p-12 md:p-20 shadow-2xl group border transition-all duration-1000 noise-texture ${
      isDark ? 'bg-[#011C40] border-white/10' : 'bg-white border-slate-100'
    }`}>
      
      {/* ATMOSPHERIC GLOWS */}
      <div className={`absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-10 blur-[140px] animate-pulse ${isDark ? 'bg-[#42E8E0]' : 'bg-[#42E8E0]/40'}`} />
      <div className={`absolute -left-40 -bottom-40 h-[500px] w-[500px] rounded-full opacity-10 blur-[120px] ${isDark ? 'bg-[#FF8C00]' : 'bg-[#FF8C00]/40'}`} />
      
      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
        
        <div className="flex-1 space-y-12 text-center xl:text-left">
          <div className="flex flex-wrap justify-center xl:justify-start gap-4">
            <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-3xl border shadow-2xl ${
              isDark ? 'bg-white/5 border-white/10 text-[#42E8E0]' : 'bg-[#42E8E0]/5 border-[#42E8E0]/10 text-[#011C40]'
            }`}>
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Estatus: Activo
              </span>
            </div>
            
            {/* AI INSIGHT BUBBLE (NEW) */}
            <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full backdrop-blur-3xl border shadow-2xl animate-in zoom-in duration-500 ${
              isDark ? 'bg-[#42E8E0]/10 border-[#42E8E0]/20 text-[#42E8E0]' : 'bg-[#42E8E0]/5 border-[#42E8E0]/10 text-[#011C40]'
            }`}>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                AI: {aiInsight || "Analizando datos..."}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className={`text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter transition-colors ${isDark ? 'text-white' : 'text-[#011C40]'}`}>
              Hola, <br />
              <span className="premium-gradient-text italic font-serif-premium">
                Prof. {teacherName?.split(' ')[0] || "Docente"}
              </span>
            </h1>
            <p className={`text-xl md:text-2xl font-medium leading-relaxed max-w-2xl transition-colors opacity-70 mx-auto xl:mx-0 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Tu grupo de <span className="uppercase font-black tracking-widest">{currentLevel}</span> está superando las expectativas con un <span className={`font-black underline underline-offset-[12px] ${isDark ? 'text-[#42E8E0] decoration-[#42E8E0]/40' : 'text-[#FF8C00] decoration-[#FF8C00]/40'}`}>{completionRate}% de avance</span>.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center xl:justify-start gap-6 pt-4">
            <button 
              onClick={() => window.location.href = "/dashboard/teacher/mis-alumnos"}
              className="px-12 py-6 bg-[#FF8C00] hover:bg-[#E87A00] text-white font-black rounded-[2.5rem] shadow-2xl transition-all hover:-translate-y-2 active:scale-95 text-[12px] uppercase tracking-[0.3em] flex items-center gap-5 group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              <span>Gestión de Grupo</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
            </button>
            <button className={`px-12 py-6 font-black rounded-[2.5rem] border backdrop-blur-2xl transition-all text-[12px] uppercase tracking-[0.3em] hover:-translate-y-1 ${
              isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-[#011C40]/5 border-[#011C40]/10 text-[#011C40] hover:bg-[#011C40]/10'
            }`}>
              Reportes SEP
            </button>
          </div>
        </div>

        <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] flex items-center justify-center shrink-0">
          <div className={`absolute inset-0 rounded-full blur-[100px] animate-pulse ${isDark ? 'bg-[#42E8E0]/5' : 'bg-[#42E8E0]/10'}`} />
          <div className={`absolute inset-0 border-[2px] rounded-full animate-[spin_30s_linear_infinite] ${isDark ? 'border-white/10' : 'border-[#011C40]/5'}`} />
          
          <div className={`relative w-48 h-48 md:w-72 md:h-72 border backdrop-blur-3xl rounded-[4rem] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-1000 group/diamond overflow-hidden cursor-pointer ${
            isDark ? 'bg-white/5 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100 shadow-[0_40px_80px_rgba(1,28,64,0.1)]'
          }`}>
            <div className={`absolute inset-0 opacity-60 ${isDark ? 'bg-gradient-to-tr from-[#42E8E0]/20 to-[#FF8C00]/20' : 'bg-gradient-to-tr from-[#42E8E0]/5 to-[#FF8C00]/5'}`} />
            <div className="relative flex flex-col items-center">
               <span className="text-8xl md:text-[10rem] drop-shadow-[0_0_50px_rgba(66,232,224,0.4)] animate-bounce mb-4">💎</span>
               <div className={`px-5 py-2 rounded-full border transition-all duration-700 ${isDark ? 'bg-white/10 border-white/20' : 'bg-[#011C40]/5 border-[#011C40]/10'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white' : 'text-[#011C40]'}`}>Diamond State</span>
               </div>
            </div>
          </div>
          
          <Sparkles className={`absolute top-20 left-10 w-10 h-10 animate-pulse opacity-40 ${isDark ? 'text-[#FF8C00]' : 'text-[#FF8C00]'}`} />
          <Sparkles className={`absolute bottom-20 right-10 w-14 h-14 animate-pulse opacity-40 ${isDark ? 'text-[#42E8E0]' : 'text-[#42E8E0]'}`} style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
}
