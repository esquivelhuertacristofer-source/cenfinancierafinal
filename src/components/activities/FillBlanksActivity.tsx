'use client';

import React, { useState, useMemo } from 'react';
import { FillBlanksActivityData } from '@/types/activities';
import { ArrowLeft, CheckCircle2, XCircle, Info, ChevronRight, BookOpen } from 'lucide-react';

interface Props {
  data: FillBlanksActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function FillBlanksActivity({ data, onComplete, onClose }: Props) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Procesar el texto para encontrar los marcadores __ID__
  const textParts = useMemo(() => {
    const parts: { type: 'text' | 'blank', content: string, id?: string }[] = [];
    let remainingText = data.texto;

    // Buscar patrones tipo __blank_1__
    const regex = /__(.*?)__/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(data.texto)) !== null) {
      // Texto antes del blank
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: data.texto.substring(lastIndex, match.index) });
      }
      // El blank
      parts.push({ type: 'blank', content: '', id: match[1].toLowerCase() });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < data.texto.length) {
      parts.push({ type: 'text', content: data.texto.substring(lastIndex) });
    }

    return parts;
  }, [data.texto]);

  const score = useMemo(() => {
    let correct = 0;
    data.blanks.forEach(b => {
      if (userAnswers[b.id.toLowerCase()] === b.respuesta) correct++;
    });
    return Math.round((correct / data.blanks.length) * 100);
  }, [userAnswers, data.blanks]);

  const handleFinish = () => {
    setIsFinished(true);
    if (onComplete) onComplete(score);
  };

  if (isFinished) {
    return (
      <div className="w-full h-full bg-transparent flex items-center justify-center p-8 animate-in fade-in zoom-in duration-700">
         <div className="max-w-2xl w-full bg-white/[0.03] border border-white/10 rounded-[60px] p-16 text-center space-y-10">
            <div className="w-20 h-20 bg-[#FF8C00]/20 text-[#FF8C00] rounded-3xl flex items-center justify-center mx-auto">
               <BookOpen size={40} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter italic">TEXTO COMPLETADO</h2>
            <div className="p-10 bg-white/5 rounded-3xl border border-white/5">
               <div className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">Puntaje Diamond</div>
               <div className="text-6xl font-black text-[#FF8C00]">{score}%</div>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-8 bg-white text-[#0A0118] rounded-[30px] font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all"
            >
               Recoger XP y Salir
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-transparent text-white p-4 md:p-12">
      <nav className="max-w-5xl mx-auto w-full flex justify-between items-center mb-16">
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
           <ArrowLeft size={16} /> Salir
        </button>
        <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-widest">Comprensión Lectora Diamond</span>
      </nav>

      <main className="max-w-5xl mx-auto w-full bg-white/[0.02] border border-white/5 p-10 md:p-20 rounded-[60px] animate-in slide-in-from-bottom-10 duration-1000 relative">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <BookOpen size={200} />
         </div>

         <div className="space-y-12 relative z-10">
            <header className="space-y-4">
               <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">{data.titulo}</h1>
               <p className="text-white/40 font-medium italic">"{data.contexto}"</p>
            </header>

            <div className="text-xl md:text-3xl font-medium leading-[1.8] text-white/80">
               {textParts.map((part, i) => {
                 if (part.type === 'text') return <span key={i}>{part.content}</span>;
                 
                 const blank = data.blanks.find(b => b.id.toLowerCase() === part.id);
                 const currentVal = userAnswers[part.id!] || '';
                 const isCorrect = currentVal === blank?.respuesta;

                 return (
                   <span key={i} className="inline-block px-2">
                      <select
                        disabled={showFeedback}
                        value={currentVal}
                        onChange={(e) => setUserAnswers(prev => ({ ...prev, [part.id!]: e.target.value }))}
                        className={`min-w-[120px] bg-white/5 border-b-2 outline-none px-4 py-1 rounded-t-xl transition-all cursor-pointer text-center
                          ${showFeedback 
                            ? isCorrect ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-rose-500 text-rose-400 bg-rose-500/10'
                            : 'border-white/20 focus:border-[#FF8C00] hover:bg-white/10 text-[#FF8C00]'}`}
                      >
                         <option value="">[...]</option>
                         {blank?.opciones.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                   </span>
                 );
               })}
            </div>

            <div className="pt-12 flex justify-center">
               {!showFeedback ? (
                 <button 
                   onClick={() => setShowFeedback(true)}
                   className="px-16 py-8 bg-[#FF8C00] text-[#0A0118] rounded-[30px] font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-[#FF8C00]/20"
                 >
                    Verificar Lectura
                 </button>
               ) : (
                 <button 
                   onClick={handleFinish}
                   className="px-16 py-8 bg-white text-[#0A0118] rounded-[30px] font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
                 >
                    Finalizar Misión <ChevronRight className="inline ml-2" />
                 </button>
               )}
            </div>
         </div>
      </main>
    </div>
  );
}
