'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Zap, Heart, Star, Pizza, Briefcase, Plus, Sparkles } from 'lucide-react';

interface Item {
  id: number;
  label: string;
  type: 'need' | 'want';
  icon: any;
  pos: { x: number; y: number };
}

interface Props {
  data: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

const ICONS_MAP: Record<string, any> = {
  comida: Pizza,
  escuela: Briefcase,
  salud: Plus,
  diversion: Star,
  dulces: Heart,
  ropa: Zap
};

export default function RadarActivity({ data, onComplete, onClose }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [budget, setBudget] = useState(100);
  const [needsFound, setNeedsFound] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ text: string, type: 'good' | 'warn' } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const totalNeeds = data.items?.filter((i: any) => i.type === 'need').length || 4;

  useEffect(() => {
    const rawItems = data.items || [];
    const interval = setInterval(() => {
      if (items.length < 5 && !isFinished) {
        const source = rawItems[Math.floor(Math.random() * rawItems.length)];
        const newItem: Item = {
          id: Math.random(),
          label: source.label,
          type: source.type,
          icon: ICONS_MAP[source.icon_key] || Target,
          pos: {
            x: 10 + Math.random() * 80,
            y: 15 + Math.random() * 70
          }
        };
        setItems(prev => [...prev, newItem]);

        setTimeout(() => {
          setItems(prev => prev.filter(i => i.id !== newItem.id));
        }, 3000);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [items, isFinished, data.items]);

  const handleScan = (item: Item) => {
    if (item.type === 'need') {
      const nextNeedsFound = needsFound + 1;
      setNeedsFound(nextNeedsFound);
      setBudget(prev => Math.max(prev - 10, 0));
      setLastFeedback({ 
        text: `¡${item.label} es VITAL! Sabia decisión.`, 
        type: 'good' 
      });
      
      if (nextNeedsFound >= totalNeeds) {
         setIsFinished(true);
         setTimeout(() => onComplete?.(100), 5000);
      }
    } else {
      setBudget(prev => Math.max(prev - 20, 0));
      setShake(true);
      setLastFeedback({ 
        text: `¡Cuidado! ${item.label} es un DESEO. Gastaste de más.`, 
        type: 'warn' 
      });
      setTimeout(() => setShake(false), 500);
    }
    setItems(prev => prev.filter(i => i.id !== item.id));
    setTimeout(() => setLastFeedback(null), 2500);
  };

  const getRank = () => {
    if (budget >= 60) return { title: "Estratega Maestro", color: "text-emerald-400" };
    if (budget >= 30) return { title: "Comprador Inteligente", color: "text-yellow-400" };
    return { title: "Aprendiz de Prioridad", color: "text-orange-400" };
  };

  return (
    <motion.div 
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      className="w-full h-full min-h-[750px] bg-transparent relative flex flex-col items-center justify-center select-none overflow-visible font-sans"
    >
      
      {/* FONDO DE RADAR */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-emerald-500/10 rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/5 rounded-full" />
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-1 bg-gradient-to-r from-emerald-500/10 to-transparent origin-center"
         />
      </div>

      {/* HUD DE ESTADO */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start z-50 p-12">
         <div className="space-y-4">
            <h1 className="text-7xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">Misión: Prioridad Vital</h1>
            
            <AnimatePresence mode="wait">
              {lastFeedback && (
                <motion.div 
                  key={lastFeedback.text}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className={`flex items-center gap-3 px-6 py-2 rounded-full backdrop-blur-xl border ${lastFeedback.type === 'good' ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-pink-500/20 border-pink-500/40'}`}
                >
                  <Sparkles size={20} className={lastFeedback.type === 'good' ? 'text-emerald-400' : 'text-pink-400'} />
                  <span className={`text-xl font-black uppercase tracking-widest ${lastFeedback.type === 'good' ? 'text-emerald-400' : 'text-pink-400'}`}>
                    {lastFeedback.text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         <div className="flex gap-8">
            <div className={`p-8 border rounded-[40px] backdrop-blur-3xl text-center min-w-[240px] transition-all duration-500
               ${budget < 40 ? 'bg-red-500/20 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-white/5 border-white/10'}`}>
               <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Presupuesto</div>
               <div className="text-6xl font-black text-white">${budget}</div>
            </div>
         </div>
      </div>

      {/* ÁREA DE JUEGO */}
      <div className="relative w-full max-w-6xl aspect-video mt-20">
         <AnimatePresence>
            {items.map(item => (
              <motion.button
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleScan(item)}
                style={{ left: `${item.pos.x}%`, top: `${item.pos.y}%` }}
                className={`absolute p-10 rounded-[45px] border-2 backdrop-blur-3xl transition-all shadow-2xl cursor-pointer flex flex-col items-center gap-3
                  ${item.type === 'need' 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20' 
                    : 'bg-pink-500/10 border-pink-500/40 text-pink-400 shadow-pink-500/20'}
                `}
              >
                 <item.icon size={64} />
                 <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
              </motion.button>
            ))}
         </AnimatePresence>
      </div>

      {/* OVERLAY DE ÉXITO */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-3xl flex items-center justify-center p-20"
          >
             <div className="text-center space-y-16 max-w-5xl">
                <motion.div 
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-32 h-32 bg-emerald-500 rounded-[35px] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                >
                   <CheckCircle2 size={64} className="text-white" />
                </motion.div>
                
                <div className="space-y-4">
                  <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Misión<br/><span className="text-emerald-400 text-5xl tracking-normal">Completada</span></h2>
                  <p className="text-xl text-white/30 font-medium italic">Análisis de Prioridades Finalizado.</p>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-md">
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mb-2">Tu Calificación</div>
                      <div className={`text-3xl font-black italic uppercase ${getRank().color}`}>{getRank().title}</div>
                   </div>
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-md">
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mb-2">Capital Salvado</div>
                      <div className="text-5xl font-black text-white">${budget}</div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
