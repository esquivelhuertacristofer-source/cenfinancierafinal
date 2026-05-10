'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CONCEPT_CARDS, ConceptCard } from '../../lib/concepts';

export default function DiamondConceptCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | ConceptCard['category']>('all');
  
  const filteredCards = filter === 'all' 
    ? CONCEPT_CARDS 
    : CONCEPT_CARDS.filter(c => c.category === filter);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="w-full relative flex flex-col items-center justify-center overflow-hidden py-10">
      {/* Cinematic Background - Reactivo pero sutil */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <img src={currentCard.image} className="w-full h-full object-cover blur-[100px] scale-125" alt="" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#05010D]/90" />
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-10 relative z-10 flex flex-col items-center">
        
        {/* Filter - Reposicionado con más aire */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-3xl mb-16 animate-in slide-in-from-top duration-1000">
          {['all', 'ahorro', 'inversion', 'gasto', 'banco', 'emprendimiento'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat as any); setCurrentIndex(0); }}
              className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all
                ${filter === cat ? 'bg-white text-black shadow-2xl' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}
              `}
            >
              {cat === 'all' ? 'Universal' : cat}
            </button>
          ))}
        </div>

        {/* Display Engine - Espaciado corregido */}
        <div className="relative w-full flex items-center justify-center min-h-[650px]">
          
          {/* Main Controls - Cinematic Floating */}
          <button 
            onClick={prev}
            className="absolute left-0 z-50 w-20 h-20 bg-white/5 hover:bg-white text-white hover:text-black rounded-full border border-white/10 flex items-center justify-center transition-all group backdrop-blur-xl"
          >
            <ChevronLeft size={40} />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-0 z-50 w-20 h-20 bg-white/5 hover:bg-white text-white hover:text-black rounded-full border border-white/10 flex items-center justify-center transition-all group backdrop-blur-xl"
          >
            <ChevronRight size={40} />
          </button>

          <div className="relative w-full max-w-4xl h-full flex items-center justify-center perspective-[2500px]">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, index) => {
                const isCenter = index === currentIndex;
                const isLeft = index === (currentIndex - 1 + filteredCards.length) % filteredCards.length;
                const isRight = index === (currentIndex + 1) % filteredCards.length;

                if (!isCenter && !isLeft && !isRight) return null;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: isCenter ? 1 : 0.25,
                      scale: isCenter ? 1 : 0.75,
                      x: isCenter ? 0 : isLeft ? -450 : 450,
                      rotateY: isCenter ? 0 : isLeft ? 35 : -35,
                      z: isCenter ? 0 : -400,
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 24 }}
                    className="absolute"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className={`w-[480px] aspect-[4/6] bg-black rounded-[40px] border-2 ${isCenter ? 'border-white' : 'border-white/5'} overflow-hidden shadow-2xl relative group`}>
                      <img 
                        src={card.image} 
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                        alt="" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6 flex items-center gap-3">
                         <div className="p-2 bg-white text-black rounded-xl">
                           <Sparkles size={14} />
                         </div>
                         <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white italic drop-shadow-lg">Diamond Concept</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Info Box - Alineación limpia */}
        <div className="mt-16 text-center w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="text-[#FF8C00] font-black uppercase text-[10px] tracking-[0.5em] mb-4">
                CONCEPT • {currentCard.category}
              </div>
              <h3 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-6">
                {currentCard.title}
              </h3>
              <p className="text-xl text-white/40 font-medium leading-relaxed italic max-w-xl">
                "{currentCard.description}"
              </p>
              
              <div className="mt-12 flex items-center gap-4">
                 <div className="h-[2px] w-12 bg-[#FF8C00]/20" />
                 <div className="text-[9px] font-black text-white/10 tracking-[0.8em] uppercase">Academic Insight</div>
                 <div className="h-[2px] w-12 bg-[#FF8C00]/20" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
