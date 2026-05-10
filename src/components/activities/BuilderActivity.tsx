'use client';

import React, { useState, useMemo } from 'react';
import { BuilderActivityData, BuilderField } from '../../types/activities';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2, Calculator, Sparkles, Zap, FileText } from 'lucide-react';

interface Props {
  data: BuilderActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function BuilderActivity({ data, onComplete, onClose }: Props) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = data.pasos[currentStepIdx];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (currentStepIdx < data.pasos.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) setCurrentStepIdx(prev => prev - 1);
  };

  const getFieldValue = (field: BuilderField) => {
    if (field.type === 'calculated' && field.formula) {
      try {
        const func = new Function(...Object.keys(formData), `return ${field.formula}`);
        const result = func(...Object.values(formData));
        return isNaN(result) ? 0 : result;
      } catch (e) {
        return 0;
      }
    }
    return formData[field.id] || '';
  };

  if (isFinished) {
    return (
      <div className="w-full h-full bg-transparent flex items-center justify-center p-8 animate-in zoom-in duration-1000 font-sans">
         <div className="max-w-4xl w-full bg-white/[0.03] border border-white/10 rounded-[80px] p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
               <div className="flex justify-center">
                  <div className="w-32 h-32 bg-emerald-500 text-black rounded-[40px] flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)]">
                     <CheckCircle2 size={64} />
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-7xl font-black tracking-tighter italic text-white uppercase">¡Estrategia Creada!</h2>
                  <p className="text-white/40 text-2xl font-medium">Has completado tu plan de: <br/> <span className="text-white">"{data.titulo}"</span></p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {data.pasos.map(step => (
                    <div key={step.id} className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-4 backdrop-blur-xl">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">{step.titulo}</h4>
                       <div className="space-y-2">
                          {step.campos.map(field => (
                            <div key={field.id} className="flex justify-between text-sm">
                               <span className="opacity-30">{field.label}:</span>
                               <span className="font-bold text-white/80">
                                 {field.type === 'calculated' ? `$${getFieldValue(field).toLocaleString()}` : (formData[field.id] || '---')}
                               </span>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>

               <button 
                 onClick={() => onComplete && onComplete(100)}
                 className="w-full py-10 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-2xl"
               >
                  Finalizar Misión Diamond
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-transparent text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* HUD DE PROGRESO */}
      <header className="p-10 md:p-20 flex justify-between items-center relative z-20">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.8em] mb-2">Constructor de Misión</span>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">{currentStep.titulo}</h1>
         </div>

         <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-2">
               {data.pasos.map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-1.5 w-16 rounded-full transition-all duration-700 ${i <= currentStepIdx ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}
                 />
               ))}
            </div>
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex flex-col items-center justify-center">
               <span className="text-[10px] font-black text-emerald-400">{currentStepIdx + 1}</span>
               <div className="w-6 h-px bg-white/20 my-1" />
               <span className="text-[10px] font-black opacity-30">{data.pasos.length}</span>
            </div>
         </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-10 md:px-20 pb-20 relative z-10 flex flex-col justify-center animate-in slide-in-from-bottom-12 duration-1000">
         <div className="space-y-16">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                  <Zap size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Paso Estratégico</span>
               </div>
               <p className="text-2xl text-white/40 leading-relaxed font-medium">{currentStep.descripcion}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
               {currentStep.campos.map(field => (
                 <div key={field.id} className={`space-y-4 ${field.type === 'textarea' ? 'md:col-span-2' : ''} group`}>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-focus-within:text-emerald-400 transition-colors">{field.label}</label>

                    {field.type === 'text' && (
                      <input 
                        type="text"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 p-8 rounded-[35px] focus:border-emerald-500 focus:bg-white/5 outline-none transition-all font-black text-xl placeholder:text-white/10"
                      />
                    )}

                    {field.type === 'number' && (
                      <div className="relative">
                         <input 
                           type="number"
                           placeholder="0"
                           value={formData[field.id] || ''}
                           onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
                           className="w-full bg-white/[0.03] border border-white/10 p-8 rounded-[35px] focus:border-emerald-500 focus:bg-white/5 outline-none transition-all font-black text-3xl placeholder:text-white/10"
                         />
                         <span className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 font-black">USD</span>
                      </div>
                    )}

                    {field.type === 'textarea' && (
                      <textarea 
                        rows={4}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 p-10 rounded-[50px] focus:border-emerald-500 focus:bg-white/5 outline-none transition-all font-medium text-xl leading-relaxed placeholder:text-white/10"
                      />
                    )}

                    {field.type === 'calculated' && (
                      <div className="w-full bg-emerald-500/10 border-2 border-emerald-500/30 p-10 rounded-[40px] flex justify-between items-center shadow-[0_20px_60px_rgba(16,185,129,0.1)]">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest mb-2">Resultado Estimado</span>
                            <span className="text-5xl font-black text-white italic tracking-tighter">
                               {field.unit === '$' && '$'}
                               {getFieldValue(field).toLocaleString()}
                               {field.unit !== '$' && ` ${field.unit}`}
                            </span>
                         </div>
                         <Calculator size={48} className="text-emerald-500/20" />
                      </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="flex justify-between items-center pt-16">
               <button 
                  onClick={handleBack}
                  disabled={currentStepIdx === 0}
                  className={`flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.4em] transition-all ${currentStepIdx === 0 ? 'opacity-0 pointer-events-none' : 'text-white/40 hover:text-white'}`}
               >
                  <ChevronLeft size={20} /> Atrás
               </button>
               <button 
                  onClick={handleNext}
                  className="px-16 py-10 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] flex items-center gap-4 group"
               >
                  {currentStepIdx < data.pasos.length - 1 ? 'Continuar' : 'Construir Blueprint'}
                  <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </div>
      </main>
    </div>
  );
}
