'use client';

import React, { useState, useMemo } from 'react';
import { RouletteActivityData, RouletteScenario } from '@/types/activities';
import { ArrowLeft, RefreshCw, Zap, Star, AlertTriangle, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

interface Props {
  data: RouletteActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function RouletteActivity({ data, onComplete, onClose }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<RouletteScenario | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleSpin = () => {
    if (isSpinning || history.length >= data.giros) return;
    
    setIsSpinning(true);
    const newRotation = rotation + 1440 + Math.random() * 360;
    setRotation(newRotation);

    // Simular tiempo de giro
    setTimeout(() => {
      setIsSpinning(false);
      // Seleccionar un escenario aleatorio que no haya salido
      const available = data.escenarios.filter(s => !history.includes(s.id));
      const chosen = available[Math.floor(Math.random() * available.length)];
      setCurrentScenario(chosen);
      setHistory(prev => [...prev, chosen.id]);
    }, 3000);
  };

  const handleSelect = (idx: number) => {
    if (showFeedback || !currentScenario) return;
    setSelectedIdx(idx);
    setShowFeedback(true);
    
    if (idx === currentScenario.mejor_opcion) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextTurn = () => {
    if (history.length >= data.giros) {
      setIsFinished(true);
      if (onComplete) onComplete(Math.round((score / data.giros) * 100));
    } else {
      setCurrentScenario(null);
      setSelectedIdx(null);
      setShowFeedback(false);
    }
  };

  if (isFinished) {
    return (
      <div className="w-full h-full bg-transparent flex items-center justify-center p-8 animate-in zoom-in duration-700">
         <div className="max-w-2xl w-full bg-white/[0.02] border border-white/10 rounded-[60px] p-16 text-center space-y-10">
            <div className="w-24 h-24 bg-purple-500 text-white rounded-[35px] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(168,85,247,0.4)]">
               <Trophy size={48} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter">FIN DE LA RONDA</h2>
            <div className="p-10 bg-white/5 rounded-3xl border border-white/5">
               <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Decisiones Acertadas</div>
               <div className="text-6xl font-black text-purple-400">{score} / {data.giros}</div>
            </div>
            <button onClick={onClose} className="w-full py-8 bg-white text-[#050A10] rounded-[30px] font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all">
               Recoger XP y Salir
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-transparent text-white flex flex-col p-4 md:p-12 overflow-hidden">
      
      {/* HEADER */}
      <nav className="max-w-6xl mx-auto w-full flex justify-between items-center mb-12">
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
           <ArrowLeft size={16} /> Salir
        </button>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] font-black opacity-30 uppercase tracking-widest">Turnos</div>
              <div className="text-xl font-black">{history.length} / {data.giros}</div>
           </div>
           <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
              <RefreshCw size={24} className={isSpinning ? 'animate-spin' : ''} />
           </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
         
         {/* RUEDA (IZQUIERDA) */}
         <section className="flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-rose-500 z-20 clip-path-triangle animate-pulse" />
            <div 
              className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border-[10px] border-white/10 relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.15, 0, 0.15, 1)"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
               {/* Sectores de la ruleta */}
               {[...Array(8)].map((_, i) => (
                 <div 
                   key={i}
                   className="absolute top-0 left-1/2 w-1/2 h-full origin-left"
                   style={{ 
                     transform: `rotate(${i * 45}deg)`,
                     backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(168,85,247,0.1)'
                   }}
                 >
                    <div className="absolute top-10 left-10 rotate-45 opacity-20">
                       {i % 2 === 0 ? <Zap size={32} /> : <Star size={32} />}
                    </div>
                 </div>
               ))}
               <div className="absolute inset-0 bg-gradient-to-t from-[#050A10] to-transparent opacity-40" />
            </div>

            {!currentScenario && (
              <button 
                onClick={handleSpin}
                disabled={isSpinning || history.length >= data.giros}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-600 rounded-full font-black text-xl tracking-tighter hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(168,85,247,0.5)] z-30 disabled:opacity-30"
              >
                {isSpinning ? '...' : 'GIRAR'}
              </button>
            )}
         </section>

         {/* ESCENARIO (DERECHA) */}
         <section className="space-y-8 animate-in slide-in-from-right duration-1000">
            {currentScenario ? (
              <div className="space-y-10">
                 <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest">{currentScenario.categoria}</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{currentScenario.situacion}</h2>
                 </div>

                 <div className="space-y-4">
                    {currentScenario.opciones.map((opt, i) => {
                      const isSelected = selectedIdx === i;
                      const isCorrect = i === currentScenario?.mejor_opcion;
                      
                      let style = "bg-white/5 border-white/10 hover:bg-white/10 text-white/60";
                      if (showFeedback) {
                        if (isCorrect) style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
                        else if (isSelected) style = "bg-rose-500/10 border-rose-500/50 text-rose-400";
                        else style = "opacity-30";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(i)}
                          disabled={showFeedback}
                          className={`w-full p-8 rounded-[30px] border text-left transition-all font-bold text-lg ${style}`}
                        >
                           {opt}
                        </button>
                      );
                    })}
                 </div>

                 {showFeedback && (
                   <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex gap-6">
                         <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl h-fit">
                            <Info size={24} />
                         </div>
                         <p className="text-white/60 leading-relaxed font-medium">{currentScenario.explicacion}</p>
                      </div>
                      <button 
                        onClick={handleNextTurn}
                        className="w-full py-8 bg-white text-[#050A10] rounded-[30px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3"
                      >
                         {history.length >= data.giros ? 'Ver Resultados' : 'Siguiente Giro'} <ChevronRight size={16} />
                      </button>
                   </div>
                 )}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-6 opacity-30">
                 <RefreshCw size={64} className={isSpinning ? 'animate-spin' : ''} />
                 <p className="text-xl font-medium tracking-tight">Haz girar la ruleta para <br/>enfrentar un nuevo desafío financiero.</p>
              </div>
            )}
         </section>
      </main>

      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
      `}</style>
    </div>
  );
}

function Info({ size, className }: { size: number, className?: string }) {
  return (
    <div className={className}>
       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    </div>
  );
}
