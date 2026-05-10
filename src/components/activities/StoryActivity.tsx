'use client';

import React, { useState, useMemo } from 'react';
import { StoryActivityData } from '../../types/activities';
import { ChevronRight, Award, Sparkles, BookOpen, Star, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: StoryActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function StoryActivity({ data, onComplete, onClose }: Props) {
  const [currentNodeId, setCurrentNodeId] = useState(data.nodo_inicial);
  const [totalBonus, setTotalBonus] = useState(0);
  const [lastConsequence, setLastConsequence] = useState<string | null>(null);

  const currentNode = useMemo(() => data.nodos[currentNodeId], [currentNodeId, data.nodos]);

  const handleChoice = (choiceId: string) => {
    const choice = currentNode.opciones?.find(o => o.id === choiceId);
    if (!choice) return;

    setLastConsequence(choice.consecuencia);
    setTotalBonus(prev => prev + (choice.xp_bonus || 0));
    setCurrentNodeId(choice.siguiente_nodo);
  };

  const handleFinish = () => {
    if (onComplete) onComplete(100);
  };

  // Fallback de imagen para asegurar que NADA se vea roto
  const characterImage = "/assets/png/ceny-guide.png";

  if (!currentNode) return null;

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col relative z-10">
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
         
         {/* PERSONAJE */}
         <section className="lg:col-span-5 relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={currentNodeId}
              className="relative aspect-[4/5] bg-white/[0.03] border border-white/10 rounded-[60px] md:rounded-[80px] p-8 md:p-12 flex flex-col items-center justify-center overflow-hidden backdrop-blur-3xl shadow-2xl"
            >
               <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{data.personaje_principal}</span>
               </div>

               <motion.img 
                  src={currentNode.imagen || characterImage} 
                  alt="Escenario" 
                  className="w-full h-full object-cover rounded-[40px] md:rounded-[60px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               />

               <AnimatePresence>
                 {lastConsequence && !currentNode.es_final && (
                   <motion.div 
                     initial={{ y: 50, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -50, opacity: 0 }}
                     className="absolute bottom-8 left-8 right-8 p-6 md:p-8 bg-blue-600/20 backdrop-blur-3xl border border-blue-400/30 rounded-[40px] shadow-2xl"
                   >
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                         <Award size={14} /> Impacto de Decisión
                      </div>
                      <p className="text-lg md:text-xl text-white font-black italic leading-tight tracking-tight">"{lastConsequence}"</p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>
         </section>

         {/* NARRATIVA */}
         <section className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-[#FF8C00]"
               >
                  {currentNode.es_final ? 'Final de Misión' : 'Secuencia de Decisión'}
               </motion.div>
               
               <motion.div 
                 key={currentNodeId}
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="relative"
               >
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] italic uppercase text-white drop-shadow-2xl">
                    {currentNode.texto}
                  </h2>
               </motion.div>

               {currentNode.es_final && (
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="p-10 bg-[#FF8C00]/10 border-2 border-[#FF8C00]/30 rounded-[50px] space-y-4"
                 >
                    <div className="flex items-center gap-4 text-[#FF8C00]">
                       <BookOpen size={32} />
                       <span className="text-xl font-black uppercase tracking-widest italic">Lección Consolidada</span>
                    </div>
                    <p className="text-2xl text-white font-black italic tracking-tighter leading-tight uppercase">{currentNode.reflexion_final}</p>
                 </motion.div>
               )}
            </div>

            <div className="grid grid-cols-1 gap-4">
               {!currentNode.es_final ? (
                 currentNode.opciones?.map((opcion, idx) => (
                   <motion.button
                     key={opcion.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     whileHover={{ x: 15, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => handleChoice(opcion.id)}
                     className="w-full p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left transition-colors group flex justify-between items-center relative overflow-hidden"
                   >
                      <div className="relative z-10 flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-40 group-hover:text-black mb-2">DECISIÓN_ID_{idx + 1}</span>
                         <span className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">{opcion.texto}</span>
                      </div>
                      <ChevronRight size={32} className="relative z-10" />
                   </motion.button>
                 ))
               ) : (
                 <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinish}
                    className="w-full py-10 bg-white text-black rounded-[50px] font-black text-xs uppercase tracking-[0.8em] shadow-[0_20px_80px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4 group"
                 >
                    Finalizar Certificación <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                 </motion.button>
               )}
            </div>

            <footer className="flex items-center gap-12 pt-8 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Misión</span>
                  <span className="text-xs font-black text-white/50 uppercase italic tracking-tighter">{data.unit_title}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-widest mb-1 italic">XP Acumulado</span>
                  <span className="text-xs font-black text-white/50 uppercase italic tracking-tighter">+{totalBonus} XP DIAMOND</span>
               </div>
            </footer>
         </section>
      </main>
    </div>
  );
}
