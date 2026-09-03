'use client';

import React, { useState, useMemo, useRef } from 'react';
import { SimulatorActivityData } from '../../types/activities';
import { TrendingUp, Zap, Sparkles, CheckCircle2, AlertCircle, Info, Calculator, ArrowRight, BarChart3, X } from 'lucide-react';
import { solveFormula } from '../../lib/math-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: SimulatorActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
  /** Color del pilar al que pertenece la unidad. Sin él, todos los
   *  simuladores de la plataforma se veían exactamente iguales. */
  accent?: string;
}

export default function SimulatorActivity({ data, onComplete, onClose, accent }: Props) {
  const acento = accent || '#FF8C00';
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    (data.inputs || []).forEach(input => {
      initial[input.id] = input.default;
    });
    return initial;
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const hasCompletedRef = useRef(false);

  const result = useMemo(() => {
    return solveFormula(data.formula, inputs);
  }, [inputs, data.formula]);

  const activeScenario = useMemo(() => {
    return (data.escenarios || []).find(s => {
      const res = solveFormula(s.condicion, { resultado: result, ...inputs });
      return Number(res) === 1 || (res as unknown) === true;
    });
  }, [result, inputs, data.escenarios]);

  // Score real basado en el resultado de la simulación: se usa el tipo de
  // escenario alcanzado (éxito/advertencia/peligro) según las decisiones del
  // alumno en los inputs, en vez de un valor fijo. Los JSON usan indistintamente
  // los nombres en inglés y en español, así que se normalizan aquí.
  const escenarioTipo = useMemo(() => {
    switch (activeScenario?.tipo) {
      case 'success': case 'exito': return 'exito';
      case 'warning': case 'advertencia': return 'advertencia';
      case 'danger': case 'peligro': return 'peligro';
      case 'info': return 'info';
      default: return null;
    }
  }, [activeScenario]);

  const simulationScore = useMemo(() => {
    switch (escenarioTipo) {
      case 'exito': return 100;
      case 'info': return 75;
      case 'advertencia': return 60;
      case 'peligro': return 30;
      default: return 50; // sin escenario coincidente: resultado neutro
    }
  }, [escenarioTipo]);

  // Proyección determinista: se recalcula la fórmula moviendo el input temporal
  // (o, si no hay ninguno, el primero numérico) a lo largo de su rango. Antes
  // esta gráfica era ruido aleatorio, que en un simulador financiero es
  // desinformación: mostraba curvas distintas para los mismos datos.
  const ejeX = useMemo(() => {
    const numericos = (data.inputs || []).filter(i => i.type === 'slider' || i.type === 'number');
    return numericos.find(i => /anio|año|ano_|plazo|meses|tiempo|edad|periodo/i.test(i.id + ' ' + i.label)) || numericos[0] || null;
  }, [data.inputs]);
  const ejeLabel = ejeX?.label ?? null;

  // Los ejes mostraban cifras completas (204500, 404000…) que se encimaban
  // entre sí y no se podían leer.
  const compacto = (v: number | string) => {
    const n = Number(v);
    if (!isFinite(n)) return String(v);
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
    if (abs >= 1_000) return `${Math.round(n / 100) / 10}k`;
    return String(Math.round(n * 10) / 10);
  };

  const chartData = useMemo(() => {
    const eje = ejeX;
    if (!eje) return [{ name: '1', valor: result }];
    const min = Number(eje.min ?? 0);
    const max = Number(eje.max ?? (Number(inputs[eje.id]) || 10));
    const pasos = 10;
    return [...Array(pasos)].map((_, i) => {
      const v = min + ((max - min) * (i + 1)) / pasos;
      const valor = solveFormula(data.formula, { ...inputs, [eje.id]: v });
      return { name: `${Math.round(v * 10) / 10}`, valor };
    });
  }, [inputs, ejeX, data.formula, result]);

  const handleInputChange = (id: string, value: any) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete && onComplete(simulationScore);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-full bg-transparent text-white flex flex-col relative overflow-hidden font-sans"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div style={{ backgroundColor: acento, opacity: 0.1 }} className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-20 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-16 relative z-10">
        
        {/* CONTROLES */}
        <section className="lg:col-span-5 space-y-12">
           <header className="space-y-4">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full"
              >
                 <Zap size={14} style={{ color: acento }} />
                 <span className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em]">{data.tipo} DIAMOND</span>
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none"
              >
                {data.titulo}
              </motion.h1>
              <p className="text-xl text-white/40 font-medium leading-relaxed max-w-md">{data.descripcion}</p>
           </header>

           <div className="space-y-8 p-5 md:p-10 bg-white/[0.02] border border-white/10 rounded-[32px] md:rounded-[60px] backdrop-blur-3xl">
              {(data.inputs || []).map((input, idx) => (
                <motion.div 
                  key={input.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-6"
                >
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{input.label}</label>
                         {input.type === 'select' && <div className="text-sm font-bold" style={{ color: acento }}>{inputs[input.id]}</div>}
                      </div>
                      <div className="text-3xl font-black tracking-tighter">
                        <span className="opacity-50 text-xl mr-1" style={{ color: acento }}>{input.unit === '$' ? '$' : ''}</span>
                        <motion.span animate={{ opacity: [0.5, 1] }}>
                          {typeof inputs[input.id] === 'number' ? inputs[input.id].toLocaleString() : ''}
                        </motion.span>
                        <span className="text-sm opacity-30 ml-1">{input.unit !== '$' ? input.unit : ''}</span>
                      </div>
                   </div>

                   {input.type === 'slider' && (
                     <div className="relative group">
                        <input
                           type="range"
                           min={input.min}
                           max={input.max}
                           step={input.step}
                           value={inputs[input.id]}
                           onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value))}
                           className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                        />
                        <motion.div
                          style={{ background: `linear-gradient(to right, ${acento}, ${acento}cc)` }}
                          className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full pointer-events-none"
                          animate={{ width: `${((inputs[input.id] - (input.min ?? 0)) / ((input.max ?? 100) - (input.min ?? 0))) * 100}%` }}
                        />
                     </div>
                   )}

                   {/* Los desplegables no tenían control: el alumno veía la etiqueta
                       pero no podía cambiar el valor, y la simulación se quedaba
                       congelada en el default. */}
                   {input.type === 'select' && (
                     <select
                        value={String(inputs[input.id] ?? '')}
                        onChange={(e) => {
                          const bruto = e.target.value;
                          const num = Number(bruto);
                          handleInputChange(input.id, bruto !== '' && !isNaN(num) ? num : bruto);
                        }}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-3xl px-6 py-5 text-base font-bold text-white outline-none focus:border-white/40 transition-all cursor-pointer [&>option]:bg-[#05010D]"
                     >
                        {(input.opciones || []).map(op => {
                          const valor = typeof op === 'string' ? op : op.value;
                          const etiqueta = typeof op === 'string' ? op : op.label;
                          return <option key={String(valor)} value={String(valor)}>{etiqueta}</option>;
                        })}
                     </select>
                   )}

                   {input.referencia && (
                     <p className="text-xs text-white/30 font-medium leading-relaxed">{input.referencia}</p>
                   )}
                </motion.div>
              ))}
           </div>

           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setIsCompleted(true)}
             style={{ backgroundColor: acento, boxShadow: `0 20px 80px ${acento}4d` }}
             className="w-full py-8 text-black rounded-[36px] font-black text-xs uppercase tracking-[0.25em] md:tracking-[0.5em] flex items-center justify-center gap-4 group"
           >
              Finalizar Simulación <ArrowRight className="group-hover:translate-x-2 transition-transform" />
           </motion.button>
        </section>

        {/* VISUALIZACIÓN DE DATOS */}
        <section className="lg:col-span-7 space-y-8">
           <div className="bg-white/[0.01] border border-white/5 rounded-[80px] p-6 md:p-12 relative overflow-hidden flex flex-col min-h-[500px]">
              <div style={{ background: `linear-gradient(to top right, ${acento}0d, transparent 60%)` }} className="absolute inset-0 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                 {/* Antes aquí había un "LIVE_FEED_01" decorativo, del tamaño de
                     un titular, que no significaba nada. En su lugar va lo que
                     de verdad hace falta para leer la gráfica: qué se está
                     moviendo en el eje horizontal. */}
                 <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                       <BarChart3 size={16} style={{ color: acento }} />
                       <span className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/40">{data.output_label}</span>
                    </div>
                    {ejeLabel && (
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/25">
                        según {ejeLabel}
                      </span>
                    )}
                 </div>

                 <div className="w-full" style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                          <defs>
                             <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={acento} stopOpacity={0.35}/>
                                <stop offset="95%" stopColor={acento} stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="name"
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                            tickLine={false}
                            interval={Math.max(1, Math.ceil(chartData.length / 5)) - 1}
                            tickFormatter={compacto}
                          />
                          <YAxis
                            width={64}
                            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={compacto}
                          />
                          <Area type="monotone" dataKey="valor" stroke={acento} strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#05010D', borderColor: acento, borderRadius: '20px' }}
                            labelFormatter={(v) => `${ejeLabel ?? ''}: ${v}`}
                            formatter={(v) => [`${data.output_prefix ?? ''}${Math.round(Number(v)).toLocaleString()}${data.output_suffix ?? ''}`, data.output_label] as [string, string]}
                          />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 {/* El prefijo y el sufijo iban en una línea aparte debajo del
                     número, así que un resultado en pesos se leía "5,625" y un
                     "$" suelto dos renglones más abajo. Ahora van pegados a la
                     cifra, que es como se lee una cantidad. */}
                 <div className="text-center mt-8">
                    <motion.div
                      key={result}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-black tracking-tighter leading-none italic text-white  flex items-baseline justify-center gap-1"
                    >
                       {data.output_prefix && (
                         <span className="text-[clamp(2rem,4vw,3.5rem)]" style={{ color: acento }}>{data.output_prefix}</span>
                       )}
                       <span className="text-[clamp(3.5rem,9vw,7rem)]">
                         {/* Los resultados en porcentaje o en años suelen tener decimales
                             significativos; redondearlos a entero borraba la diferencia
                             entre 3.4% y 3.9%. */}
                         {Math.abs(result) < 100 && !Number.isInteger(result)
                           ? (Math.round(result * 10) / 10).toLocaleString()
                           : Math.round(result).toLocaleString()}
                       </span>
                       {data.output_suffix && (
                         <span className="text-[clamp(2rem,4vw,3.5rem)]" style={{ color: acento }}>{data.output_suffix}</span>
                       )}
                    </motion.div>
                 </div>
              </div>
           </div>

           <AnimatePresence mode="wait">
              {activeScenario && (
                <motion.div 
                  key={activeScenario.mensaje}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-5 md:p-10 rounded-[28px] md:rounded-[50px] border-2 backdrop-blur-3xl shadow-2xl
                    ${escenarioTipo === 'exito' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      escenarioTipo === 'advertencia' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                      escenarioTipo === 'peligro' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                      'bg-sky-500/10 border-sky-500/30 text-sky-400'}`}
                >
                   <div className="flex items-start gap-6">
                      <div className="p-4 bg-white/10 rounded-2xl">
                         <Info size={32} />
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-40">Analítica Diamond 2026</div>
                         <p className="text-3xl font-black italic uppercase leading-tight tracking-tighter">{activeScenario.mensaje}</p>
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </section>
      </main>

      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[2500] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8"
          >
             <button
               onClick={handleClose}
               aria-label="Cerrar"
               className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
             >
                <X size={24} />
             </button>
             <div className="max-w-xl w-full bg-white/[0.03] border border-white/10 rounded-[80px] p-8 md:p-20 text-center space-y-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ backgroundColor: acento, boxShadow: `0 0 80px ${acento}80` }} className="w-32 h-32 text-black rounded-[24px] md:rounded-[40px] flex items-center justify-center mx-auto">
                   <CheckCircle2 size={64} />
                </motion.div>
                <div className="space-y-4">
                   <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Simulación Validada</h2>
                   <p className="text-white/40 text-xl font-medium leading-relaxed">Has superado los desafíos técnicos de <br/> <span className="text-white">&quot;{data.titulo}&quot;</span></p>
                </div>
                <button
                  onClick={() => {
                    if (hasCompletedRef.current) return;
                    hasCompletedRef.current = true;
                    onComplete && onComplete(simulationScore);
                  }}
                  className="w-full py-10 bg-white text-black rounded-[24px] md:rounded-[40px] font-black text-xs uppercase tracking-[0.28em] md:tracking-[0.6em] hover:scale-105 transition-all"
                >
                   Finalizar Misión
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
