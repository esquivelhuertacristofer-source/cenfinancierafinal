'use client';

import React, { useState, useMemo } from 'react';
import { QuizActivityData } from '../../types/activities';
import { CheckCircle2, XCircle, Info, ChevronRight, Trophy, Zap, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: QuizActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function QuizActivity({ data, onComplete, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [streak, setStreak] = useState(0);

  const preguntas = data.preguntas || (data as any).questions || [];
  const currentQuestion = preguntas[currentIdx];

  const score = useMemo(() => {
    if (!preguntas.length) return 0;
    const correctCount = answers.filter((ans, i) => i < preguntas.length && ans === preguntas[i].correcta).length;
    return Math.round((correctCount / preguntas.length) * 100);
  }, [answers, preguntas]);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
    
    const isCorrect = idx === currentQuestion.correcta;
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIdx < data.preguntas.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };


  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (onComplete) onComplete(score);
    }, 500);
  };
  if (!preguntas.length || !currentQuestion) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-white/20 font-black italic uppercase tracking-widest">
         Sincronizando Banco de Preguntas...
      </div>
    );
  }

  if (isFinished) {
    const passed = score >= ((data.aprobacion_minima ?? 0.6) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center p-4 min-h-[600px] w-full relative z-50"
      >
         <div className="max-w-xl w-full bg-black/40 border border-white/10 rounded-[60px] p-10 md:p-16 text-center relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-10">
               <motion.div 
                 animate={{ rotate: passed ? [0, 10, -10, 0] : 0 }}
                 className="flex justify-center"
               >
                  <div className={`w-24 h-24 rounded-[35px] flex items-center justify-center shadow-2xl transition-all ${passed ? 'bg-emerald-500 text-black' : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'}`}>
                     {passed ? <Trophy size={48} /> : <XCircle size={48} />}
                  </div>
               </motion.div>

               <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-white leading-none">
                    {passed ? 'Certificación Lograda' : 'Revisión Necesaria'}
                  </h2>
                  <p className="text-white/40 text-lg md:text-xl font-medium italic">Resultado de la Evaluación Diamond</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 italic">Eficiencia</div>
                     <div className={`text-4xl md:text-5xl font-black italic tracking-tighter ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>{score}%</div>
                  </div>
                  <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF8C00] mb-3 italic">Recompensa</div>
                     <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">+{passed ? data.xp : 0}</div>
                  </div>
               </div>

               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={handleFinalize}
                 disabled={isSubmitting}
                 className={`w-full py-8 md:py-10 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]
                   ${isSubmitting ? 'opacity-50' : ''}`}
               >
                  {isSubmitting ? 'Sincronizando...' : 'Finalizar Certificación'}
               </motion.button>
            </div>
         </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full relative font-sans perspective-1000 p-4 md:p-8 overflow-hidden">
      
      {/* HUD DE PROGRESO */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 relative z-20 px-6">
         <div className="flex flex-col text-center md:text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 justify-center md:justify-start mb-2">
               <Sparkles className="text-yellow-400 animate-pulse" size={14} />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em] italic">Evaluación Técnica Diamond</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-white leading-none">{data.titulo}</h1>
         </div>

         <div className="flex items-center gap-6 md:gap-10">
            {streak > 0 && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full"
              >
                 <Flame size={16} className="text-orange-500" />
                 <span className="text-sm font-black text-orange-400 italic">Racha x{streak}</span>
              </motion.div>
            )}
            <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-[25px] flex flex-col items-center justify-center backdrop-blur-2xl">
               <span className="text-xl font-black italic text-white/80">{currentIdx + 1}</span>
               <div className="w-4 h-px bg-white/10 my-0.5" />
               <span className="text-[10px] font-black opacity-30">{data.preguntas.length}</span>
            </div>
         </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 md:px-10 pb-20 relative z-10">
         <AnimatePresence mode="wait">
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-[#FF8C00]">
                     <Zap size={14} /> Pregunta ACT_{currentIdx + 1}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1.1] italic uppercase text-white">
                    {currentQuestion.texto}
                  </h2>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {(currentQuestion.opciones || []).map((opcion, idx) => {
                    const isSelected = answers[currentIdx] === idx;
                    const isCorrectOption = idx === currentQuestion.correcta;
                    
                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showFeedback ? { scale: 1.02, x: 10 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(idx)}
                        disabled={showFeedback}
                        className={`p-8 md:p-10 rounded-[35px] border-2 text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden
                          ${showFeedback 
                             ? (isCorrectOption ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : (isSelected ? 'border-rose-500/40 bg-rose-500/10 text-rose-400' : 'opacity-20 scale-95'))
                             : (isSelected ? 'border-white bg-white text-black shadow-2xl scale-[1.02]' : 'border-white/5 bg-white/[0.02] text-white/60')}`}
                      >
                         <span className="text-xl md:text-2xl font-black italic uppercase tracking-tighter relative z-10">{opcion}</span>
                         {showFeedback && isCorrectOption && <CheckCircle2 className="text-emerald-400" size={28} />}
                         {showFeedback && isSelected && !isCorrectOption && <XCircle className="text-rose-400" size={28} />}
                      </motion.button>
                    );
                  })}
               </div>

               <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-10"
                    >
                       <div className="p-8 bg-[#FF8C00]/5 border border-[#FF8C00]/20 rounded-[45px] backdrop-blur-3xl flex gap-8 items-start">
                          <div className="p-4 bg-[#FF8C00] rounded-2xl text-black">
                             <Info size={32} />
                          </div>
                          <div className="space-y-1">
                             <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF8C00]">Fundamento Diamond</div>
                             <p className="text-xl md:text-2xl font-black italic uppercase text-white/90">"{currentQuestion.explicacion}"</p>
                          </div>
                       </div>

                       <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          className="w-full py-8 md:py-10 bg-[#FF8C00] text-black rounded-[40px] font-black text-sm uppercase tracking-[0.6em] shadow-[0_25px_80px_rgba(255,140,0,0.3)] flex items-center justify-center gap-4"
                       >
                          {currentIdx < data.preguntas.length - 1 ? 'Siguiente Pregunta' : 'Consolidar Misión'}
                          <ChevronRight />
                       </motion.button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>
         </AnimatePresence>
      </main>
    </div>
  );
}
