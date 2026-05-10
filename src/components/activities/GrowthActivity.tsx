'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Wallet, BookOpen, Gift, Rocket, ChevronRight, Zap, Target } from 'lucide-react';

interface Props {
  data: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function GrowthActivity({ data, onComplete, onClose }: Props) {
  const [balance, setBalance] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [events, setEvents] = useState<{ id: number, text: string, type: 'plus' | 'minus' }[]>([]);
  const targetGoal = data.meta_objetivo || 500;

  // Lógica de crecimiento automático
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setBalance(prev => {
        const next = prev + (1 * multiplier);
        if (next >= targetGoal) {
          setIsFinished(true);
          setTimeout(() => onComplete?.(100), 4000);
          return targetGoal;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [multiplier, isFinished, targetGoal]);

  const addEvent = (text: string, type: 'plus' | 'minus') => {
    const id = Math.random();
    setEvents(prev => [{ id, text, type }, ...prev].slice(0, 3));
    setTimeout(() => setEvents(prev => prev.filter(e => e.id !== id)), 2000);
  };

  const handleInvest = () => {
    if (balance >= 30) {
      setBalance(prev => prev - 30);
      setMultiplier(prev => prev + 0.5);
      addEvent("¡Invertiste en Conocimiento! Multiplicador x" + (multiplier + 0.5), 'plus');
    } else {
      addEvent("No tienes suficiente para invertir", 'minus');
    }
  };

  const handleSpend = () => {
    if (balance >= 50) {
       setBalance(prev => prev - 50);
       addEvent("¡Gastaste en un deseo! El ahorro bajó.", 'minus');
    }
  };

  return (
    <div className="w-full h-full min-h-[750px] bg-transparent relative flex flex-col items-center justify-center font-sans overflow-visible select-none">
      
      {/* HUD SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 p-12 flex justify-between items-start z-50">
         <div className="space-y-2">
            <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter">Bóveda de Maestría</h1>
            <p className="text-xl text-white/40 font-bold uppercase tracking-widest italic">{data.descripcion || "Haz crecer tu capital estratégicamente"}</p>
         </div>
         
         <div className="p-8 bg-emerald-500/10 border border-emerald-500/40 rounded-[40px] backdrop-blur-3xl text-center min-w-[240px]">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Meta Objetivo</div>
            <div className="text-5xl font-black text-white">${targetGoal}</div>
         </div>
      </div>

      {/* NÚCLEO CENTRAL - LA BÓVEDA HOLOGRÁFICA */}
      <div className="relative flex items-center justify-center w-full max-w-4xl aspect-square">
         
         {/* Círculos de energía */}
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute w-[600px] h-[600px] border border-white/5 rounded-full"
         />
         <motion.div 
           animate={{ rotate: -360 }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute w-[500px] h-[500px] border border-emerald-500/10 rounded-full border-dashed"
         />

         {/* Visualización de Capital */}
         <div className="relative text-center z-10 space-y-4">
            <motion.div 
              key={balance}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-[12rem] font-black text-white tracking-tighter leading-none drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
               ${Math.floor(balance)}
            </motion.div>
            <div className="flex items-center justify-center gap-4">
               <div className="px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-400 font-black text-xs uppercase tracking-widest">
                  Multiplicador: x{multiplier.toFixed(1)}
               </div>
               <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-white/40 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} /> Crecimiento Activo
               </div>
            </div>
         </div>

         {/* EVENTOS FLOTANTES */}
         <div className="absolute top-1/2 left-full -translate-y-1/2 ml-10 space-y-4 w-64">
            <AnimatePresence>
               {events.map(event => (
                 <motion.div
                   key={event.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.5 }}
                   className={`p-4 rounded-2xl border text-xs font-bold ${event.type === 'plus' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}
                 >
                    {event.text}
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>

      {/* BOTONES DE ACCIÓN - ESTRATEGIA */}
      <div className="absolute bottom-12 flex gap-8 z-50">
         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleInvest}
           className="px-12 py-8 bg-emerald-500 text-white rounded-[35px] flex flex-col items-center gap-2 shadow-2xl shadow-emerald-500/20 border border-emerald-400/50"
         >
            <BookOpen size={32} />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Invertir en Saber (-$30)</span>
            <span className="text-[8px] opacity-60">Aumenta Multiplicador</span>
         </motion.button>

         <motion.button
           whileHover={{ scale: 1.05, y: -5 }}
           whileTap={{ scale: 0.95 }}
           onClick={handleSpend}
           className="px-12 py-8 bg-white/5 hover:bg-white/10 text-white rounded-[35px] flex flex-col items-center gap-2 border border-white/10 backdrop-blur-xl"
         >
            <Gift size={32} className="text-pink-400" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Comprar Antojo (-$50)</span>
            <span className="text-[8px] opacity-40">Reduce tu Capital</span>
         </motion.button>
      </div>

      {/* OVERLAY DE ÉXITO */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-3xl flex items-center justify-center p-20"
          >
             <div className="text-center space-y-12">
                <motion.div 
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-40 h-40 bg-emerald-500 rounded-[50px] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.5)]"
                >
                   <Rocket size={80} className="text-white" />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="text-8xl font-black text-white italic uppercase tracking-tighter leading-none">Meta Alcanzada</h2>
                  <p className="text-2xl text-white/40 font-medium italic">¡Tu paciencia y sabiduría han llenado la bóveda!</p>
                </div>
                <div className="text-5xl font-black text-emerald-400 italic">CRECIMIENTO FINAL: x{multiplier.toFixed(1)}</div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
