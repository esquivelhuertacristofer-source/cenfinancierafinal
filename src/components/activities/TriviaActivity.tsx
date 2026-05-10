'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TriviaActivityData } from '../../types/activities';
import { Trophy, Timer, Zap, CheckCircle2, XCircle, Star, Sparkles, Flame } from 'lucide-react';

interface Props {
  data: TriviaActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function TriviaActivity({ data, onComplete, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(data.tiempo_por_pregunta);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const currentQuestion = data.preguntas[currentIdx];

  // Generar opciones mezcladas para la pregunta actual
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [...currentQuestion.incorrectas, currentQuestion.respuesta_correcta]
      .sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  useEffect(() => {
    if (isFinished) return;
    if (timeLeft <= 0) {
      handleNext(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }

    if (currentIdx < data.preguntas.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(data.tiempo_por_pregunta);
    } else {
      setIsFinished(true);
    }
  };

  const finalPercent = Math.round((score / data.preguntas.length) * 100);

  if (isFinished) {
    return (
      <div className="flex items-center justify-center p-4 animate-in fade-in zoom-in duration-1000 min-h-[600px] relative z-50">
         <div className="max-w-xl w-full bg-white/[0.05] border border-white/10 rounded-[60px] p-20 text-center relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-12">
               <div className="flex justify-center relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-[#FF8C00] text-black rounded-[45px] flex items-center justify-center relative z-10 shadow-2xl animate-bounce-slow">
                     <Star size={64} fill="currentColor" />
                  </div>
               </div>
               <div className="space-y-4">
                  <h2 className="text-7xl font-black tracking-tighter italic uppercase text-white drop-shadow-2xl">Grand Prix Finalizado</h2>
                  <p className="text-white/40 text-2xl font-medium italic">Dominio Total de Velocidad</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-10 bg-white/5 rounded-[45px] border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 mb-4 opacity-70">Precisión</div>
                     <div className="text-7xl font-black text-white italic tracking-tighter">{finalPercent}%</div>
                  </div>
                  <div className="p-10 bg-white/5 rounded-[45px] border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 opacity-70">Combo Máx</div>
                     <div className="text-7xl font-black text-white italic tracking-tighter">x{maxStreak}</div>
                  </div>
               </div>
               <button 
                 onClick={() => onComplete && onComplete(finalPercent)}
                 className="w-full py-10 bg-white text-black rounded-[45px] font-black text-sm uppercase tracking-[0.6em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
               >
                  Registrar Puntuación Élite
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative font-sans perspective-1000 p-4 md:p-8">
      
      {/* HUD DE VELOCIDAD */}
      <header className="flex justify-between items-center mb-16 relative z-20 px-6">
         <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
               <Timer className={`transition-colors duration-300 ${timeLeft < 5 ? 'text-rose-500 animate-ping' : 'text-[#FF8C00]'}`} size={16} />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em] italic">Reto de Velocidad Diamond</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white">{data.titulo}</h1>
         </div>

         <div className="flex items-center gap-10">
            {/* TIMER CIRCULAR NEÓN */}
            <div className="relative w-24 h-24 flex items-center justify-center">
               <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * timeLeft) / data.tiempo_por_pregunta}
                    className={`transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'text-rose-500 shadow-[0_0_15px_#F43F5E]' : 'text-yellow-400 shadow-[0_0_15px_#FACC15]'}`}
                  />
               </svg>
               <span className={`text-4xl font-black italic tracking-tighter ${timeLeft < 5 ? 'text-rose-500' : 'text-white'}`}>{timeLeft}s</span>
            </div>

            <div className={`w-20 h-20 rounded-[30px] border-2 flex flex-col items-center justify-center backdrop-blur-2xl transition-all duration-500
               ${streak >= 3 ? 'bg-yellow-400 border-yellow-300 text-black shadow-[0_0_40px_rgba(250,204,21,0.3)] scale-110 rotate-6' : 'bg-white/[0.03] border-white/10 text-white/40'}`}>
               {streak >= 3 ? <Flame size={28} className="animate-pulse" /> : <Zap size={24} />}
               <span className="text-xs font-black italic">x{streak}</span>
            </div>
         </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-10 relative z-10 flex flex-col justify-center animate-in slide-in-from-right-12 duration-700">
         <div className="space-y-12">
            <div className="text-center space-y-6">
               <div className="text-[10px] font-black uppercase tracking-[0.8em] opacity-30 italic">Pregunta {currentIdx + 1} de {data.preguntas.length}</div>
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight italic uppercase text-white drop-shadow-2xl">
                 {currentQuestion.pregunta}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {shuffledOptions.map((opcion, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleNext(opcion === currentQuestion.respuesta_correcta)}
                   className="p-10 rounded-[50px] bg-white/[0.03] border-2 border-white/5 hover:border-white text-white/80 hover:text-white transition-all duration-300 text-left group relative overflow-hidden transform-style-3d hover:scale-105 active:scale-95 shadow-2xl"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-[20px] flex items-center justify-center text-xs font-black group-hover:bg-white group-hover:text-black transition-colors">{String.fromCharCode(65 + idx)}</div>
                       <span className="text-2xl font-black italic uppercase tracking-tighter">{opcion}</span>
                    </div>
                 </button>
               ))}
            </div>
         </div>
      </main>

      {/* EFECTO DE PULSACIÓN POR TIEMPO */}
      {timeLeft < 5 && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-rose-500/5 animate-pulse" />
      )}
    </div>
  );
}
