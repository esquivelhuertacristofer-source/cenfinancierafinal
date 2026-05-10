'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Timer, Star, PlayCircle, Zap } from 'lucide-react';

interface Props {
  data: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface GameObject {
  id: number;
  dataId: string;
  x: number;
  y: number;
  emoji: string;
  puntos: number;
  tipo: 'correcto' | 'incorrecto';
  label: string;
  speed: number;
  scale: number;
}

export default function GameActivity({ data, onComplete, onClose }: Props) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(data.duracion || 60);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [feedback, setFeedback] = useState<{ id: number, x: number, y: number, text: string, color: string } | null>(null);
  const requestRef = useRef<number>(0);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setTimeLeft(data.duracion || 60);
    setObjects([]);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const randomItem = data.items[Math.floor(Math.random() * data.items.length)];
      // VELOCIDAD MÍNIMA: Casi flotando para máxima facilidad
      const baseSpeed = 0.5; 
      const newObj: GameObject = {
        id: Date.now() + Math.random(),
        dataId: randomItem.id,
        x: Math.random() * 80 + 10,
        y: -10,
        emoji: randomItem.emoji,
        puntos: randomItem.puntos,
        tipo: randomItem.tipo,
        label: randomItem.label,
        speed: baseSpeed + (Math.random() * 0.2),
        scale: 1.4 // Objetos aún más grandes y fáciles de tocar
      };
      setObjects(prev => [...prev, newObj]);
    }, 2000); // Menos objetos a la vez

    const timerInterval = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
    };
  }, [gameState, data]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const update = () => {
      setObjects(prev => {
        const next = prev.map(obj => ({ ...obj, y: obj.y + obj.speed }));
        return next.filter(obj => obj.y < 110);
      });
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState]);

  const handleCatch = (obj: GameObject) => {
    if (gameState !== 'playing') return;
    
    if (obj.tipo === 'correcto') {
      setScore(prev => prev + obj.puntos);
      showFeedback(obj.x, obj.y, `+${obj.puntos}`, 'text-emerald-400');
    } else {
      setScore(prev => Math.max(0, prev - Math.abs(obj.puntos)));
      setLives(l => {
         const nextL = l - 1;
         if (nextL <= 0) setGameState('finished');
         return nextL;
      });
      showFeedback(obj.x, obj.y, `-${Math.abs(obj.puntos)}`, 'text-rose-400');
    }
    setObjects(prev => prev.filter(o => o.id !== obj.id));
  };

  const showFeedback = (x: number, y: number, text: string, color: string) => {
    const id = Date.now();
    setFeedback({ id, x, y, text, color });
    setTimeout(() => setFeedback(prev => prev?.id === id ? null : prev), 1000);
  };

  useEffect(() => {
    if (gameState === 'finished') {
      onComplete?.(100); // Siempre aprobar si termina por tiempo
    }
  }, [gameState, onComplete]);

  return (
    <div className="w-full h-full min-h-[600px] bg-transparent relative flex flex-col items-center justify-center font-sans overflow-visible select-none p-0">
      
      {/* HUD FLOTANTE - SIN BORDES DE CAJA */}
      <div className="absolute top-0 left-0 right-0 px-12 py-10 flex justify-between items-start z-[100] pointer-events-none">
         <div className="flex gap-4 pointer-events-auto">
            <div className="bg-[#0A0118]/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
               <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Misión</div>
               <div className={`text-4xl font-black italic tracking-tighter ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
               </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 px-10 backdrop-blur-xl shadow-2xl">
               <div className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.4em] mb-1">Tesoro</div>
               <div className="text-4xl font-black text-white italic tracking-tighter">{score}</div>
            </div>
         </div>

         <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 px-12 backdrop-blur-3xl shadow-2xl pointer-events-auto">
            <div className="flex gap-4">
               {[...Array(3)].map((_, i) => (
                 <Heart 
                   key={i} 
                   size={28} 
                   className={i < Math.floor(lives) ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_15px_#f43f5e]' : 'text-white/5'} 
                 />
               ))}
            </div>
         </div>
      </div>

      {/* ÁREA DE JUEGO TRANSPARENTE */}
      <div className="absolute inset-0 z-50">
         <AnimatePresence>
            {objects.map((obj) => (
              <motion.div
                key={obj.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: obj.scale, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                onPointerDown={() => handleCatch(obj)}
                className="absolute w-40 h-40 flex flex-col items-center justify-center cursor-pointer group active:scale-90 transition-transform"
              >
                 <div className="text-8xl drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform pointer-events-none">
                    {obj.emoji}
                 </div>
                 <div className={`mt-4 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-3xl pointer-events-none shadow-2xl
                    ${obj.tipo === 'correcto' ? 'bg-emerald-500/40 border-emerald-500/50 text-white' : 'bg-rose-500/40 border-rose-500/50 text-white'}`}>
                    {obj.label}
                 </div>
                 {/* ÁREA DE CONTACTO MASIVA PARA NIÑOS */}
                 <div className="absolute inset-0 scale-[1.8]" />
              </motion.div>
            ))}
            
            {feedback && (
              <motion.div
                key={feedback.id}
                initial={{ y: feedback.y + "%", x: feedback.x + "%", opacity: 1, scale: 1 }}
                animate={{ y: (feedback.y - 25) + "%", opacity: 0, scale: 3 }}
                className={`absolute z-[110] font-black text-7xl italic pointer-events-none drop-shadow-2xl ${feedback.color}`}
              >
                {feedback.text}
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* INTRODUCCIÓN GLASS */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[200] bg-[#0A0118]/60 backdrop-blur-2xl flex items-center justify-center p-10">
           <div className="max-w-xl text-center space-y-12">
              <div className="w-28 h-28 bg-white/10 rounded-[40px] flex items-center justify-center mx-auto border border-white/20">
                 <PlayCircle size={60} className="text-white" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none">{data.titulo}</h2>
                 <p className="text-2xl text-white/60 font-medium italic leading-relaxed">
                    ¡Toca los tesoros que caen para guardarlos en tu alcancía!
                 </p>
              </div>
              <button 
                onClick={startGame}
                className="w-full py-10 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.8em] hover:scale-105 transition-all shadow-2xl"
              >
                 ¡Empezar!
              </button>
           </div>
        </motion.div>
      )}

      {/* FINALIZACIÓN GLASS */}
      {gameState === 'finished' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-10">
           <div className="text-center space-y-12">
              <div className="w-48 h-48 bg-emerald-500 rounded-[60px] flex items-center justify-center mx-auto shadow-[0_0_150px_rgba(16,185,129,0.4)]">
                 <Trophy size={100} className="text-white" />
              </div>
              <div className="text-center space-y-3">
                 <h2 className="text-8xl font-black text-white italic uppercase tracking-tighter leading-none">¡Excelente!</h2>
                 <p className="text-2xl text-white/40 font-medium italic">Has completado tu entrenamiento de campo.</p>
              </div>
              <div className="text-7xl font-black text-emerald-400 italic tracking-tighter uppercase">¡Logrado!</div>
              <button 
                onClick={onClose}
                className="px-20 py-10 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-2xl"
              >
                 Cerrar Desafío
              </button>
           </div>
        </motion.div>
      )}

      {/* PIE SIN BORDES */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] italic">
         <Zap size={16} /> Diamond Engine v5.1
      </div>

    </div>
  );
}
