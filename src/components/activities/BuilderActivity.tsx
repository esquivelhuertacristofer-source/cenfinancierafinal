'use client';

import React, { useState, useMemo, useRef } from 'react';
import { evaluate } from 'mathjs';
import { normalizeFormula } from '../../lib/math-engine';
import { BuilderActivityData, BuilderField, CalcAutomatico } from '../../types/activities';
import { ArrowLeft, ChevronRight, ChevronLeft, ChevronDown, CheckCircle2, Calculator, Sparkles, Zap, FileText, X } from 'lucide-react';

interface Props {
  data: BuilderActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
  /** Color del pilar al que pertenece la unidad. Sin él, todos los
   *  constructores de la plataforma se veían exactamente iguales. */
  accent?: string;
}

export default function BuilderActivity({ data, onComplete, onClose, accent }: Props) {
  const acento = accent || '#10B981';
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  // Sliders y selects arrancan con un valor: si no, sus fórmulas dependientes
  // evalúan con variables indefinidas y muestran 0 hasta que el alumno los toca.
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const inicial: Record<string, any> = {};
    for (const paso of data.pasos || []) {
      for (const campo of paso.campos || []) {
        if (campo.type === 'slider') {
          inicial[campo.id] = campo.default ?? campo.min ?? 0;
        } else if (campo.type === 'select') {
          const primera = (campo.opciones || [])[0];
          const valor = campo.default ?? (typeof primera === 'string' ? primera : primera?.value);
          if (valor !== undefined) inicial[campo.id] = valor;
        }
      }
    }
    return inicial;
  });
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = data.pasos?.[currentStepIdx];
  const hasCompletedRef = useRef(false);

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

  const liveCalcs = useMemo(() => {
    if (!data.calculos_automaticos?.length) return [];
    const keys = Object.keys(formData);
    const vals = Object.values(formData);
    const scope = Object.fromEntries(keys.map((k, i) => [k, vals[i]]));
    return data.calculos_automaticos.map((calc: CalcAutomatico) => {
      try {
        const result = evaluate(normalizeFormula(calc.formula), scope);
        const num = Number(result);
        const computed = isFinite(num) ? num : null;
        let alertActive = false;
        if (calc.alerta_si && computed !== null) {
          try {
            alertActive = !!evaluate(normalizeFormula(calc.alerta_si), scope);
          } catch { /* condición no evaluable aún */ }
        }
        return { ...calc, computed, alertActive };
      } catch {
        return { ...calc, computed: null as number | null, alertActive: false };
      }
    });
  }, [formData, data.calculos_automaticos]);

  const getFieldValue = (field: BuilderField) => {
    if (field.type === 'calculated' && field.formula) {
      try {
        const result = evaluate(normalizeFormula(field.formula), formData);
        const num = Number(result);
        return isNaN(num) ? 0 : num;
      } catch {
        return 0;
      }
    }
    return formData[field.id] || '';
  };

  // Score real: combina (1) qué porcentaje de los campos obligatorios ("requerido")
  // fueron llenados por el alumno y (2) qué porcentaje de las alertas financieras
  // (calculos_automaticos.alerta_si) NO están activas al finalizar, es decir, qué tan
  // sana quedó la estrategia construida. Ambas señales existen ya en el modelo de datos.
  const finalScore = useMemo(() => {
    const allFields = (data.pasos || []).flatMap(p => p.campos || []);
    const requiredFields = allFields.filter(f => f.requerido && f.type !== 'calculated');
    const filledCount = requiredFields.filter(f => {
      const val = formData[f.id];
      if (f.type === 'number') return typeof val === 'number' && isFinite(val);
      return val !== undefined && val !== null && String(val).trim() !== '';
    }).length;
    const fieldsRatio = requiredFields.length > 0 ? filledCount / requiredFields.length : 1;

    const alertCount = liveCalcs.filter(c => c.alertActive).length;
    const alertsRatio = liveCalcs.length > 0 ? (liveCalcs.length - alertCount) / liveCalcs.length : 1;

    return Math.round(((fieldsRatio + alertsRatio) / 2) * 100);
  }, [data.pasos, formData, liveCalcs]);

  const reportCompletion = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete?.(finalScore);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      reportCompletion();
    }
  };

  if (isFinished) {
    return (
      <div className="w-full h-full bg-transparent flex items-center justify-center p-8 animate-in zoom-in duration-1000 font-sans">
         <div className="max-w-4xl w-full bg-white/[0.03] border border-white/10 rounded-[80px] p-8 md:p-20 text-center relative overflow-hidden">
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
            >
               <X size={24} />
            </button>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
               <div className="flex justify-center">
                  <div style={{ backgroundColor: acento, boxShadow: `0 0 80px ${acento}66` }} className="w-32 h-32 text-black rounded-[24px] md:rounded-[40px] flex items-center justify-center">
                     <CheckCircle2 size={64} />
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic text-white uppercase">¡Estrategia Creada!</h2>
                  <p className="text-white/40 text-2xl font-medium">Has completado tu plan de: <br/> <span className="text-white">&quot;{data.titulo}&quot;</span></p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {(data.pasos || []).map(step => (
                    <div key={step.id} className="p-8 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[40px] space-y-4 backdrop-blur-xl">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em]" style={{ color: acento }}>{step.titulo}</h4>
                       <div className="space-y-3">
                          {(step.campos || []).map(field => (
                            <div key={field.id} className="flex justify-between gap-4 text-sm">
                               <span className="opacity-30 leading-snug">{field.label}</span>
                               <span className="font-bold text-white/80 text-right shrink-0 max-w-[55%] truncate">
                                 {field.type === 'calculated'
                                   // No todos los calculados son pesos: hay porcentajes, meses y años.
                                   ? `${field.unit === '$' ? '$' : ''}${getFieldValue(field).toLocaleString()}${field.unit && field.unit !== '$' ? ` ${field.unit}` : ''}`
                                   : (formData[field.id] ?? '---')}
                               </span>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>

               <button
                 onClick={reportCompletion}
                 className="w-full py-10 bg-white text-black rounded-[24px] md:rounded-[40px] font-black text-xs uppercase tracking-[0.28em] md:tracking-[0.6em] hover:scale-105 transition-all shadow-2xl"
               >
                  Finalizar Misión Diamond
               </button>
            </div>
         </div>
      </div>
    );
  }

  // Blindaje: si el contenido llega mal formado (pasos vacío), evita el crash
  // de acceder a currentStep.titulo/campos sobre un índice inexistente.
  if (!currentStep) {
    return null;
  }

  return (
    <div className="w-full h-full bg-transparent text-white flex flex-col relative overflow-hidden font-sans">

      {/* HUD DE PROGRESO */}
      <header className="shrink-0 px-4 md:px-16 py-6 md:py-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 relative z-20">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] md:tracking-[0.8em] mb-2">Constructor de Misión</span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">{currentStep.titulo}</h1>
         </div>

         <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-2">
               {data.pasos.map((_, i) => (
                 <div 
                   key={i} 
                   style={i <= currentStepIdx ? { backgroundColor: acento, boxShadow: `0 0 15px ${acento}80` } : undefined}
                   className={`h-1.5 w-16 rounded-full transition-all duration-700 ${i <= currentStepIdx ? '' : 'bg-white/10'}`}
                 />
               ))}
            </div>
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex flex-col items-center justify-center">
               <span className="text-[10px] font-black" style={{ color: acento }}>{currentStepIdx + 1}</span>
               <div className="w-6 h-px bg-white/20 my-1" />
               <span className="text-[10px] font-black opacity-30">{data.pasos.length}</span>
            </div>
         </div>
      </header>

      {/* min-h-0 + overflow-y-auto: sin esto, un paso con cuatro campos se
          recortaba contra el borde inferior y el botón de continuar quedaba
          fuera de la pantalla, sin forma de llegar a él. */}
      <main className="flex-1 min-h-0 overflow-y-auto w-full px-8 md:px-16 pb-16 relative z-10 animate-in slide-in-from-bottom-12 duration-1000">
         <div className="max-w-5xl mx-auto w-full space-y-10">
            <div className="space-y-4">
               <div style={{ backgroundColor: `${acento}1a`, borderColor: `${acento}40`, color: acento }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 border rounded-full">
                  <Zap size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Paso Estratégico</span>
               </div>
               <p className="text-2xl text-white/40 leading-relaxed font-medium">{currentStep.descripcion}</p>
            </div>

            {/* Cada campo vive en su propia celda con el mismo marco, para que
                texto, número, barra y desplegable se lean como una sola familia.
                Antes cada tipo tenía su propia caja (o ninguna) y la pantalla
                parecía un formulario a medio armar flotando en el vacío. */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[44px] p-6 md:p-8 backdrop-blur-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {(currentStep.campos || []).map(field => {
                 // Los controles anchos (texto largo, desplegable, barra y
                 // resultado) ocupan la fila entera: a media fila el desplegable
                 // recortaba sus etiquetas y la barra quedaba descolgada.
                 const anchoCompleto = field.type !== 'text' && field.type !== 'number';
                 const min = field.min ?? 0;
                 const max = field.max ?? 100;
                 const valorSlider = Number(formData[field.id] ?? min);
                 const avance = max > min ? ((valorSlider - min) / (max - min)) * 100 : 0;
                 const opciones = field.opciones || [];

                 return (
                 <div
                   key={field.id}
                   style={field.type === 'calculated' ? { backgroundColor: acento + '14', borderColor: acento + '40' } : undefined}
                   className={`${anchoCompleto ? 'md:col-span-2' : ''} group flex flex-col gap-4 rounded-[32px] border p-7 transition-all ${
                     field.type === 'calculated' ? '' : 'bg-white/[0.03] border-white/[0.08] focus-within:bg-white/[0.05]'
                   }`}
                 >
                    <label
                      style={field.type === 'calculated' ? { color: acento } : undefined}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] leading-[1.7] ${field.type === 'calculated' ? '' : 'text-white/35'}`}
                    >
                      {field.type === 'calculated' ? 'Resultado · ' : ''}{field.label}
                    </label>

                    {field.type === 'text' && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-white/10 pb-3 focus:border-white/40 outline-none transition-all font-bold text-xl placeholder:text-white/15 placeholder:font-medium"
                      />
                    )}

                    {field.type === 'number' && (
                      <div className="flex items-baseline gap-3 border-b border-white/10 pb-3 focus-within:border-white/40 transition-colors">
                         {field.unit === '$' && <span className="text-2xl font-black text-white/25">$</span>}
                         <input
                           type="number"
                           placeholder={field.placeholder || '0'}
                           value={formData[field.id] ?? ''}
                           onChange={(e) => {
                             const n = parseFloat(e.target.value);
                             handleFieldChange(field.id, isNaN(n) ? undefined : n);
                           }}
                           className="flex-1 min-w-0 bg-transparent border-0 outline-none font-black text-3xl tracking-tight placeholder:text-white/15 placeholder:font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                         />
                         {/* Solo se rotula la unidad que el campo declara: antes se
                             ponía "MXN" por defecto y aparecía pegado a campos que
                             eran horas o porcentajes. */}
                         {field.unit && field.unit !== '$' && (
                           <span className="shrink-0 text-[10px] font-black text-white/25 uppercase tracking-widest">{field.unit}</span>
                         )}
                      </div>
                    )}

                    {/* Sliders y selects no tenían control: el alumno veía la
                        etiqueta y nada más, y los campos calculados que dependían
                        de ellos se quedaban en 0. */}
                    {field.type === 'slider' && (
                      <div className="space-y-4">
                         <div className="text-2xl md:text-4xl font-black italic tracking-tighter leading-none">
                           {field.unit === '$' && '$'}
                           {valorSlider.toLocaleString()}
                           {field.unit && field.unit !== '$' && <span className="text-base not-italic opacity-30 ml-2 tracking-normal">{field.unit}</span>}
                         </div>
                         <input
                           type="range"
                           min={min}
                           max={max}
                           step={field.step ?? 1}
                           value={valorSlider}
                           onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
                           style={{ background: `linear-gradient(to right, ${acento} ${avance}%, rgba(255,255,255,0.1) ${avance}%)` }}
                           className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white  [&::-webkit-slider-thumb]:cursor-grab"
                         />
                         <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                            <span>{min.toLocaleString()}</span>
                            <span>{max.toLocaleString()}</span>
                         </div>
                      </div>
                    )}

                    {field.type === 'select' && (
                      <div className="relative">
                        <select
                          value={String(formData[field.id] ?? '')}
                          onChange={(e) => {
                            const bruto = e.target.value;
                            const num = Number(bruto);
                            handleFieldChange(field.id, bruto !== '' && !isNaN(num) ? num : bruto);
                          }}
                          className="w-full appearance-none bg-transparent border-0 border-b border-white/10 pb-3 pr-10 focus:border-white/40 outline-none transition-all font-bold text-lg md:text-xl truncate cursor-pointer [&>option]:bg-[#05010D] [&>option]:text-base [&>option]:font-medium"
                        >
                          {opciones.map(op => {
                            const valor = typeof op === 'string' ? op : op.value;
                            const etiqueta = typeof op === 'string' ? op : op.label;
                            return <option key={String(valor)} value={String(valor)}>{etiqueta}</option>;
                          })}
                        </select>
                        <ChevronDown size={20} style={{ color: acento }} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
                      </div>
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        rows={4}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full bg-black/20 border border-white/[0.06] rounded-3xl p-6 focus:border-white/30 outline-none transition-all font-medium text-lg leading-relaxed placeholder:text-white/15 resize-none"
                      />
                    )}

                    {field.type === 'calculated' && (
                      <div className="flex items-end justify-between gap-6">
                         <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">
                            {field.unit === '$' && '$'}
                            {getFieldValue(field).toLocaleString()}
                            {field.unit && field.unit !== '$' && <span className="text-lg not-italic opacity-40 ml-2 tracking-normal">{field.unit}</span>}
                         </span>
                         <Calculator size={36} className="shrink-0 opacity-25" style={{ color: acento }} />
                      </div>
                    )}

                    {field.ayuda && (
                      <p className="text-xs text-white/30 font-medium leading-relaxed">{field.ayuda}</p>
                    )}
                 </div>
                 );
               })}
              </div>
            </div>

            {liveCalcs.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] md:rounded-[50px] p-5 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/30">Calculadora en Vivo</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {liveCalcs.map(calc => (
                    <div key={calc.id} className={`p-6 rounded-[30px] border transition-colors ${calc.alertActive ? 'border-orange-500/40 bg-orange-500/10' : 'border-white/10 bg-white/5'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">{calc.label}</span>
                      <span className={`text-2xl font-black tracking-tighter ${calc.alertActive ? 'text-orange-400' : 'text-white'}`}>
                        {calc.computed === null
                          ? '—'
                          : `${calc.prefix || ''}${calc.computed.toLocaleString('es-MX', { maximumFractionDigits: 2 })}${calc.suffix || ''}`}
                      </span>
                      {calc.alertActive && calc.alerta_mensaje && (
                        <p className="text-[9px] text-orange-400/80 mt-2 leading-tight">{calc.alerta_mensaje}</p>
                      )}
                      {!calc.alertActive && calc.ayuda && (
                        <p className="text-[9px] text-white/20 mt-2 leading-tight">{calc.ayuda}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center gap-6 pt-4">
               <button
                  onClick={handleBack}
                  disabled={currentStepIdx === 0}
                  className={`flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all ${currentStepIdx === 0 ? 'opacity-0 pointer-events-none' : 'text-white/40 hover:text-white'}`}
               >
                  <ChevronLeft size={20} /> Atrás
               </button>
               <button
                  onClick={handleNext}
                  className="px-6 md:px-12 py-7 bg-white text-black rounded-[32px] font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] flex items-center gap-4 group"
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
