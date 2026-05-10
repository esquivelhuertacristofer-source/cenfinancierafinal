'use client';

import React from 'react';
import { X, Target, Zap, Clock, BookOpen, ChevronRight, Sparkles, Play } from 'lucide-react';
import type { Unit } from '../../lib/hub';

interface MissionFichaProps {
  unit: Unit;
  onClose: () => void;
  onStart: () => void;
}

export default function MissionFicha({ unit, onClose, onStart }: MissionFichaProps) {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-700">
      {/* FONDO CINEMÁTICO */}
      <div className="absolute inset-0 bg-[#010A19]/80 backdrop-blur-[60px]" onClick={onClose}>
         {/* Orbes de luz dinámicos */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF8C00]/10 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#42E8E0]/5 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>
      
      <div className="relative w-full max-w-6xl bg-[#011C40] rounded-[4rem] overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-20 duration-1000 fill-mode-both">
        
        {/* SIDE DECOR (VIBRANT ORANGE SECTION) */}
        <div className="w-full lg:w-[400px] bg-[#FF8C00] p-16 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
           {/* Patrón de rejilla técnico */}
           <div className="absolute inset-0 opacity-[0.1]" 
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div className="absolute top-0 right-0 p-12 opacity-30 rotate-12 transition-transform hover:scale-110">
              <Zap size={240} className="text-white" />
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="px-4 py-1.5 bg-white/20 border border-white/30 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nivel Diamond</span>
                 </div>
              </div>
              <div className="text-8xl font-black tracking-tighter leading-none">{unit.code}</div>
           </div>

           <div className="relative z-10 mt-auto">
              <h3 className="text-4xl font-black leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">{unit.title}</h3>
              
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 px-5 py-3 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-md">
                    <Clock size={18} className="text-white/60" />
                    <span className="text-xs font-black uppercase tracking-widest">60 Minutos</span>
                 </div>
              </div>
           </div>
        </div>

        {/* CONTENT AREA (DARK PREMIUM SECTION) */}
        <div className="flex-1 p-16 lg:p-24 flex flex-col bg-gradient-to-br from-[#011C40] to-[#010D1F] relative">
           {/* Botón Cerrar Ultra-Premium */}
           <button 
             onClick={onClose} 
             className="absolute top-12 right-12 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-500 z-50"
           >
              <X size={24} />
           </button>

           <div className="flex-1 space-y-16">
              {/* Header con Badge */}
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-[#FF8C00]">
                    <Target size={28} className="animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">Misión Pedagógica</span>
                 </div>
                 <p className="text-3xl lg:text-4xl font-medium leading-relaxed text-white tracking-tight">
                    {unit.objective}
                 </p>
              </div>

              {/* Bento Grid de Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-all duration-500">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-3">
                       <BookOpen size={14} /> Contenidos del Módulo
                    </div>
                    <div className="flex flex-wrap gap-4">
                       {unit.contents.map((c, i) => (
                          <div 
                            key={i} 
                            className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 transition-transform hover:scale-110 hover:border-[#FF8C00]/40"
                            title={c.label}
                          >
                             <Play size={20} fill={c.type === 'video' ? '#FF8C00' : 'transparent'} className={c.type === 'video' ? 'text-[#FF8C00]' : 'text-white/60'} />
                          </div>
                       ))}
                       <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20">
                          <Sparkles size={20} />
                       </div>
                    </div>
                 </div>

                 <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-all duration-500">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-3">
                       <Zap size={14} /> Desafío Académico
                    </div>
                    <div className="space-y-2">
                       <div className="text-2xl font-black text-[#FF8C00] tracking-tight">
                          {unit.code.startsWith('S3') ? 'Diamond Elite Plus' : 
                           unit.code.startsWith('S') ? 'Diamond Advanced' : 'Diamond Junior Core'}
                       </div>
                       <p className="text-xs text-white/40 font-medium">Complejidad adaptada a nivel {unit.code.substring(0,2)}</p>
                    </div>
                 </div>
              </div>

              {/* Competencias / Tags */}
              <div className="flex flex-wrap gap-3">
                 {(unit.metadata?.competencies || ['Pensamiento Crítico', 'Análisis Financiero', 'Toma de Decisiones']).map((tag: string, idx: number) => (
                    <span key={idx} className="px-6 py-2.5 rounded-2xl bg-[#42E8E0]/10 border border-[#42E8E0]/20 text-[#42E8E0] text-[10px] font-black uppercase tracking-widest">
                       {tag}
                    </span>
                 ))}
              </div>
           </div>

           {/* Botón de Acción Principal (Diamond Style) */}
           <div className="mt-12 pt-12 border-t border-white/5">
              <button 
                onClick={onStart}
                className="group relative w-full h-24 rounded-[2.5rem] bg-white overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
              >
                 {/* Efecto Shimmer */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF8C00]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 
                 <div className="relative z-10 flex items-center justify-center gap-6">
                    <span className="text-[#011C40] font-black text-2xl uppercase tracking-[0.2em]">Desbloquear Misión</span>
                    <div className="w-12 h-12 bg-[#011C40] rounded-2xl flex items-center justify-center text-white transition-transform group-hover:translate-x-3">
                       <ChevronRight size={24} />
                    </div>
                 </div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
