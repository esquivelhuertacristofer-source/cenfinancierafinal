'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MatchingActivityData, MemoryPair } from '@/types/activities';
import { ArrowLeft, CheckCircle2, Trophy, RefreshCw } from 'lucide-react';

interface Card {
  id: string; // "pairId-type" (e.g., "p1-term" or "p1-def")
  pairId: string;
  content: string;
  type: 'term' | 'def';
  isFlipped: boolean;
  isMatched: boolean;
}

interface Props {
  data: MatchingActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function MatchingActivity({ data, onComplete, onClose }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Inicializar cartas
  useEffect(() => {
    const allCards: Card[] = [];
    data.pares.forEach(p => {
      allCards.push({ id: `${p.id}-term`, pairId: p.id, content: p.termino, type: 'term', isFlipped: false, isMatched: false });
      allCards.push({ id: `${p.id}-def`, pairId: p.id, content: p.definicion, type: 'def', isFlipped: false, isMatched: false });
    });
    setCards(allCards.sort(() => Math.random() - 0.5));
  }, [data.pares]);

  const handleCardClick = (card: Card) => {
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newCards = cards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    setFlippedCards(prev => [...prev, card]);

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCard = flippedCards[0];
      
      if (firstCard.pairId === card.pairId) {
        // MATCH!
        setTimeout(() => {
          setCards(prev => prev.map(c => c.pairId === card.pairId ? { ...c, isMatched: true } : c));
          setFlippedCards([]);
          // Check if finished
          if (newCards.every(c => c.isMatched || c.pairId === card.pairId)) {
            setIsFinished(true);
            if (onComplete) onComplete(100);
          }
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstCard.id || c.id === card.id ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="w-full h-full bg-transparent flex items-center justify-center p-8 animate-in zoom-in duration-700">
         <div className="max-w-xl w-full bg-white/[0.02] border border-white/10 rounded-[60px] p-16 text-center space-y-10">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[35px] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.3)]">
               <Trophy size={48} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter">¡MEMORIA DE ÉLITE!</h2>
            <div className="p-10 bg-white/5 rounded-3xl border border-white/5">
               <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Movimientos Totales</div>
               <div className="text-6xl font-black text-emerald-400">{moves}</div>
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
           <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">Movimientos:</span>
              <span className="text-xl font-black">{moves}</span>
           </div>
           <button onClick={() => window.location.reload()} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
              <RefreshCw size={20} />
           </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-12">
         <header className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter leading-tight">{data.titulo}</h1>
            <p className="text-white/40 font-medium">Encuentra los pares correspondientes para limpiar el tablero.</p>
         </header>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={card.isMatched}
                className={`aspect-[4/3] rounded-3xl border-2 transition-all duration-500 transform perspective-1000 relative
                  ${card.isFlipped ? 'rotate-y-180 scale-100' : 'hover:scale-105 hover:border-white/20'}
                  ${card.isMatched ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}
                  ${card.isFlipped ? 'bg-white/10 border-white/30 shadow-2xl' : 'bg-white/5 border-white/5'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                 {/* Cara Frontal (Oculta) */}
                 <div className={`absolute inset-0 flex items-center justify-center backface-hidden ${card.isFlipped ? 'hidden' : 'block'}`}>
                    <div className="w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse" />
                    <span className="text-4xl font-black text-white/10 italic">CEN</span>
                 </div>

                 {/* Cara Trasera (Contenido) */}
                 <div className={`absolute inset-0 flex items-center justify-center p-6 text-center backface-hidden ${card.isFlipped ? 'block' : 'hidden'}`}>
                    <span className={`font-bold leading-tight ${card.type === 'term' ? 'text-2xl text-[#FF8C00]' : 'text-sm text-white/80'}`}>
                       {card.content}
                    </span>
                 </div>
              </button>
            ))}
         </div>
      </main>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
