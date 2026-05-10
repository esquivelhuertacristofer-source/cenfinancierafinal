'use client';

import React, { useState, useMemo } from 'react';
import { DragDropActivityData } from '../../types/activities';
import { Trophy, Star, Sparkles, CheckCircle2, Zap, Flame, ChevronRight, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: DragDropActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function DragDropActivity({ data, onComplete, onClose }: Props) {
  const [items, setItems] = useState(data.items.map(item => ({ 
    ...item, 
    assignedCategoryId: null as string | null, 
    status: 'idle' as 'idle' | 'correct' | 'wrong' 
  })));
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState(true);

  const pendingItems = useMemo(() => items.filter(i => !i.assignedCategoryId), [items]);

  const handleItemClick = (id: string) => {
    setSelectedItemId(id);
    setFeedback(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (!selectedItemId) return;
    
    const item = items.find(i => i.id === selectedItemId);
    if (!item) return;

    const isCorrect = item.categoria_correcta === categoryId;
    setIsFeedbackCorrect(isCorrect);
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setFeedback(item.feedback || "¡Excelente elección! Has identificado el concepto correctamente.");
    } else {
      setStreak(0);
      setFeedback("¡Uh oh! El análisis sugiere que este elemento pertenece a otra categoría. ¡Prueba de nuevo!");
    }

    setItems(prev => prev.map(i => {
      if (i.id === selectedItemId) {
        return { ...i, assignedCategoryId: categoryId, status: isCorrect ? 'correct' : 'wrong' };
      }
      return i;
    }));

    setSelectedItemId(null);
    if (items.filter(i => !i.assignedCategoryId).length === 1) {
       setTimeout(() => setIsFinished(true), 3000);
    }
  };

  const finalScore = useMemo(() => {
    const correct = items.filter(i => i.assignedCategoryId === i.categoria_correcta).length;
    return Math.round((correct / items.length) * 100);
  }, [items]);

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-10">
         <div className="max-w-xl w-full bg-black/40 border border-white/10 rounded-[60px] p-20 text-center relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-12">
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="flex justify-center"
               >
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-[#FF8C00] text-black rounded-[45px] flex items-center justify-center shadow-2xl">
                     <Trophy size={64} />
                  </div>
               </motion.div>
               <div className="space-y-4">
                  <h2 className="text-7xl font-black tracking-tighter italic uppercase text-white">Misión Épica</h2>
                  <p className="text-white/40 text-2xl font-medium italic">Grado de Maestría: Diamond</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-10 bg-white/5 rounded-[45px] border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 mb-4 opacity-70">Puntaje</div>
                     <div className="text-7xl font-black text-white italic tracking-tighter">{finalScore}%</div>
                  </div>
                  <div className="p-10 bg-white/5 rounded-[45px] border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 opacity-70">Racha Máx</div>
                     <div className="text-7xl font-black text-white italic tracking-tighter">x{maxStreak}</div>
                  </div>
               </div>
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => onComplete && onComplete(finalScore)}
                 className="w-full py-10 bg-white text-black rounded-[45px] font-black text-sm uppercase tracking-[0.6em] shadow-[0_20px_50px_rgba(255,255,255,0.15)] group"
               >
                  Recibir Galardón <ChevronRight className="inline-block group-hover:translate-x-2 transition-transform" />
               </motion.button>
            </div>
         </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full relative font-sans perspective-1000 p-8 select-none">
      
      {/* HUD SUPERIOR */}
      <header className="flex justify-between items-end mb-16 relative z-20 px-6">
         <div className="flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
               <Sparkles className="text-yellow-400 animate-pulse" size={16} />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em] italic">Diamond Console v2.0</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-black tracking-tighter italic uppercase text-white"
            >
              {data.titulo}
            </motion.h1>
         </div>

         <div className="flex items-center gap-10 bg-white/[0.03] p-8 rounded-[50px] border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
            <AnimatePresence>
              {streak >= 3 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-orange-500/10"
                />
              )}
            </AnimatePresence>
            <div className="flex flex-col items-end gap-2 relative z-10">
               <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-widest italic flex items-center gap-2">
                  {streak >= 3 && <Flame size={12} className="animate-bounce" />} Multiplicador XP
               </span>
               <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ scale: i < streak % 5 ? [1, 1.2, 1] : 1 }}
                      className={`w-12 h-2 rounded-full transition-all duration-700 ${i < streak % 5 ? 'bg-yellow-400 shadow-[0_0_20px_#FACC15]' : (streak >= 5 ? 'bg-orange-500' : 'bg-white/10')}`} 
                    />
                  ))}
               </div>
            </div>
            <motion.div 
              animate={{ 
                scale: streak > 0 ? [1, 1.1, 1] : 1,
                rotate: streak >= 5 ? [0, 5, -5, 0] : 0
              }}
              className={`w-20 h-20 rounded-[30px] border-2 flex flex-col items-center justify-center transition-all duration-500 relative z-10
               ${streak >= 5 
                  ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_60px_#F97316]' 
                  : (streak > 0 ? 'bg-yellow-400 border-yellow-300 text-black' : 'bg-white/5 border-white/10 text-white/20')}`}>
               {streak >= 5 ? <Flame size={32} /> : <Zap size={28} />}
               <span className="text-xs font-black italic">x{streak}</span>
            </motion.div>
         </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
         <section className="lg:col-span-4 space-y-8">
            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Nodos Pendientes ({pendingItems.length})</span>
            </div>
            <div className="grid grid-cols-1 gap-6">
               <AnimatePresence mode="popLayout">
                  {pendingItems.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    >
                       <button
                         onClick={() => handleItemClick(item.id)}
                         className={`w-full p-8 rounded-[40px] border-2 text-left transition-all duration-500 flex items-center gap-6 group relative overflow-hidden
                           ${selectedItemId === item.id 
                              ? 'bg-white border-white text-black scale-105 shadow-[0_40px_100px_rgba(255,255,255,0.2)]' 
                              : 'bg-white/[0.03] border-white/5 hover:border-[#FF8C00]/40 text-white/80'}`}
                       >
                          <div className="text-5xl group-hover:rotate-12 transition-transform">{item.emoji}</div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">ITEM_LOG_{idx + 1}</span>
                             <span className="text-2xl font-black tracking-tighter italic uppercase leading-tight">{item.label}</span>
                          </div>
                       </button>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </section>

         <section className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {data.categorias.map((cat) => (
                 <motion.div 
                   key={cat.id}
                   whileHover={{ scale: selectedItemId ? 1.02 : 1 }}
                   onClick={() => handleCategoryClick(cat.id)}
                   className={`group relative p-12 rounded-[80px] border-2 transition-all duration-500 flex flex-col min-h-[500px] cursor-pointer overflow-hidden backdrop-blur-2xl
                     ${selectedItemId ? 'border-[#FF8C00]/40 bg-[#FF8C00]/5 animate-pulse' : 'border-white/5 bg-white/[0.01]'}
                   `}
                 >
                    <header className="relative z-10 flex flex-col items-center text-center mb-12">
                       <div className="w-24 h-24 rounded-[35px] bg-white/5 border border-white/10 flex items-center justify-center text-5xl mb-6">
                          {cat.emoji}
                       </div>
                       <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white">{cat.label}</h3>
                    </header>
                    <div className="relative z-10 flex-1 flex flex-wrap content-start justify-center gap-4">
                       {items.filter(i => i.assignedCategoryId === cat.id).map((item) => (
                         <motion.div 
                           key={item.id}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className={`px-6 py-4 rounded-[30px] border-2 text-xl font-black flex items-center gap-3
                             ${item.status === 'correct' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}
                         >
                            <span className="text-3xl">{item.emoji}</span>
                            <span className="italic uppercase tracking-tighter">{item.label}</span>
                         </motion.div>
                       ))}
                    </div>
                 </motion.div>
               ))}
            </div>

            <AnimatePresence mode="wait">
               {feedback && (
                 <motion.div 
                   key={feedback}
                   initial={{ opacity: 0, y: 30, scale: 0.95 }}
                   animate={{ 
                     opacity: 1, 
                     y: 0, 
                     scale: 1,
                     x: isFeedbackCorrect ? 0 : [0, -10, 10, -10, 10, 0]
                   }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-3xl flex items-center justify-center p-20"
                 >
                    <div className={`p-10 rounded-[40px] border-2 transition-colors duration-500 flex items-center gap-8
                      ${isFeedbackCorrect 
                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
                        : 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)]'}`}
                    >
                       {isFeedbackCorrect ? <CheckCircle2 size={36} /> : <Zap size={36} />}
                    </div>
                    <div className="space-y-1">
                       <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${isFeedbackCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isFeedbackCorrect ? 'Sincronización Académica' : 'Revisión Conceptual'}
                       </div>
                       <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">{feedback}</p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </section>
      </main>
    </div>
  );
}
