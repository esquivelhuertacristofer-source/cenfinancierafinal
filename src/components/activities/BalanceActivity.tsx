'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, Trophy, Target, Sparkles, Coins, X } from 'lucide-react';

interface Props {
  data: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function BalanceActivity({ data, onComplete, onClose }: Props) {
  const [skills, setSkills] = useState(0);
  const [workHours, setWorkHours] = useState(0);
  const [money, setMoney] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [status, setStatus] = useState<'idle' | 'charging' | 'success'>('idle');

  // Lógica Financiera: El dinero crece según el trabajo multiplicado por las habilidades
  useEffect(() => {
    let interval: any;
    if (status === 'charging' && !isFinished) {
      interval = setInterval(() => {
        const hourlyRate = (skills / 100) + 0.1;
        setMoney(prev => {
          const next = prev + (0.5 * hourlyRate);
          if (next >= 100) {
            setIsFinished(true);
            setTimeout(() => onComplete?.(100), 3000);
            return 100;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status, skills, isFinished]);

  const charge = (type: 'skills' | 'work') => {
    if (isFinished) return;
    setStatus('charging');
    if (type === 'skills') setSkills(prev => Math.min(prev + 1, 100));
    else setWorkHours(prev => Math.min(prev + 1.2, 100));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-transparent select-none overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 text-[#FF8C00] font-black tracking-[0.4em] uppercase text-xs"
        >
          <Target size={16} /> Misión de Sincronización Financiera
        </motion.div>
        <h1 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
          {data.titulo}
        </h1>
        <p className="text-2xl text-white/40 font-medium italic max-w-2xl mx-auto">
          "Entre más aprendas, ¡más valdrá tu tiempo de trabajo!"
        </p>
      </div>

      <div className="relative w-full max-w-5xl aspect-[16/9] flex items-center justify-center">
        
        {/* LA BALANZA (VISUAL LIMPIO) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-[80%] h-4 bg-white/10 rounded-full relative flex items-center justify-between px-10">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] z-20 flex items-center justify-center">
                 <div className="w-4 h-4 bg-black rounded-full" />
              </div>
              
              <div className="w-32 h-32 bg-blue-500/20 border-2 border-blue-400/50 rounded-[40px] -mt-40 flex items-center justify-center backdrop-blur-xl relative">
                 <BookOpen size={48} className="text-blue-400" />
                 <div className="absolute -bottom-12 font-black text-blue-400 text-xl whitespace-nowrap">HABILIDADES: {Math.floor(skills)}%</div>
              </div>

              <div className="w-32 h-32 bg-orange-500/20 border-2 border-orange-400/50 rounded-[40px] -mt-40 flex items-center justify-center backdrop-blur-xl relative">
                 <Zap size={48} className="text-orange-400" />
                 <div className="absolute -bottom-12 font-black text-orange-400 text-xl whitespace-nowrap">TRABAJO: {Math.floor(workHours)}%</div>
              </div>
           </div>
        </div>

        {/* ALCANCÍA CENTRAL */}
        <div className="relative z-30">
           <motion.div 
             animate={{ 
               scale: [1, 1.05, 1],
               boxShadow: skills < 30 ? "0 0 50px rgba(255, 255, 255, 0.1)" : "0 0 100px rgba(255, 215, 0, 0.4)"
             }}
             transition={{ duration: 2, repeat: Infinity }}
             className={`w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center transition-colors duration-500 bg-white/5 border-yellow-500/50`}
           >
              <Coins size={80} className="text-yellow-400" />
              <div className="mt-4 flex flex-col items-center">
                <span className="text-xs font-black uppercase tracking-widest text-white/40">Tu Ahorro</span>
                <span className="text-5xl font-black text-white italic">
                  ${Math.floor(money * 10)}
                </span>
              </div>
           </motion.div>
           
           <AnimatePresence>
             {skills < 50 && status === 'charging' && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 className="absolute -bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-[0_20px_40px_rgba(37,99,235,0.4)]"
               >
                 <Sparkles size={20} /> ¡Estudia más para ganar más dinero!
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="mt-24 grid grid-cols-2 gap-40 relative z-40">
         <div className="flex flex-col items-center gap-6">
            <motion.button 
              onMouseDown={() => {
                const interval = setInterval(() => charge('skills'), 50);
                window.addEventListener('mouseup', () => { clearInterval(interval); setStatus('idle'); }, { once: true });
              }}
              onTouchStart={() => {
                const interval = setInterval(() => charge('skills'), 50);
                window.addEventListener('touchend', () => { clearInterval(interval); setStatus('idle'); }, { once: true });
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-32 h-32 rounded-full bg-blue-500 text-white shadow-[0_20px_60px_rgba(59,130,246,0.5)] border-none flex items-center justify-center cursor-pointer group"
            >
               <BookOpen size={48} className="group-active:scale-125 transition-transform" />
            </motion.button>
            <span className="font-black text-blue-400 uppercase tracking-widest italic">Aumentar Habilidades</span>
         </div>

         <div className="flex flex-col items-center gap-6">
            <motion.button 
              onMouseDown={() => {
                const interval = setInterval(() => charge('work'), 50);
                window.addEventListener('mouseup', () => { clearInterval(interval); setStatus('idle'); }, { once: true });
              }}
              onTouchStart={() => {
                const interval = setInterval(() => charge('work'), 50);
                window.addEventListener('touchend', () => { clearInterval(interval); setStatus('idle'); }, { once: true });
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-32 h-32 rounded-full bg-orange-500 text-white shadow-[0_20px_60px_rgba(249,115,22,0.5)] border-none flex items-center justify-center cursor-pointer group"
            >
               <Zap size={48} className="group-active:scale-125 transition-transform" />
            </motion.button>
            <span className="font-black text-orange-400 uppercase tracking-widest italic">Trabajar (Ganar Dinero)</span>
         </div>
      </div>

      {/* OVERLAY DE ÉXITO */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-20"
          >
             <div className="text-center space-y-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-48 h-48 bg-emerald-500 rounded-[60px] flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.5)]"
                >
                   <Trophy size={100} className="text-white" />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="text-8xl font-black text-white italic uppercase tracking-tighter">Misión Cumplida</h2>
                  <p className="text-3xl text-white/60 font-medium italic">Has entendido que el conocimiento multiplica tu valor.</p>
                </div>
                <div className="text-5xl font-black text-emerald-400 italic">AHORRO TOTAL: ${Math.floor(money * 10)}</div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
