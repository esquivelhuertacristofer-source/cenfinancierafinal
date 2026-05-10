'use client';

import React, { useState, useMemo } from 'react';
import { SimulatorActivityData } from '../../types/activities';
import { TrendingUp, Zap, Sparkles, CheckCircle2, AlertCircle, Info, Calculator, ArrowRight, BarChart3 } from 'lucide-react';
import { solveFormula } from '../../lib/math-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: SimulatorActivityData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function SimulatorActivity({ data, onComplete, onClose }: Props) {
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    data.inputs.forEach(input => {
      initial[input.id] = input.default;
    });
    return initial;
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const result = useMemo(() => {
    return solveFormula(data.formula, inputs);
  }, [inputs, data.formula]);

  const activeScenario = useMemo(() => {
    return data.escenarios.find(s => {
      const res = solveFormula(s.condicion, { resultado: result, ...inputs });
      return Number(res) === 1 || (res as unknown) === true;
    });
  }, [result, inputs, data.escenarios]);

  // Generar datos ficticios pero reactivos para la gráfica
  const chartData = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      name: `T${i}`,
      valor: result * (0.8 + Math.random() * 0.4) * (i / 10 + 0.5)
    }));
  }, [result]);

  const handleInputChange = (id: string, value: any) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-full bg-transparent text-white flex flex-col relative overflow-hidden font-sans"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#FF8C00]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-8 md:p-20 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* CONTROLES */}
        <section className="lg:col-span-5 space-y-12">
           <header className="space-y-4">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full"
              >
                 <Zap size={14} className="text-[#FF8C00]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">{data.tipo} DIAMOND</span>
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

           <div className="space-y-8 p-10 bg-white/[0.02] border border-white/10 rounded-[60px] backdrop-blur-3xl">
              {data.inputs.map((input, idx) => (
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
                         {input.type === 'select' && <div className="text-sm font-bold text-[#FF8C00]">{inputs[input.id]}</div>}
                      </div>
                      <div className="text-3xl font-black tracking-tighter">
                        <span className="text-[#FF8C00] opacity-50 text-xl mr-1">{input.unit === '$' ? '$' : ''}</span>
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
                          className="absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-gradient-to-r from-[#FF8C00] to-yellow-400 rounded-full pointer-events-none" 
                          animate={{ width: `${((inputs[input.id] - (input.min ?? 0)) / ((input.max ?? 100) - (input.min ?? 0))) * 100}%` }}
                        />
                     </div>
                   )}
                </motion.div>
              ))}
           </div>

           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => { setIsCompleted(true); if (onComplete) onComplete(100); }}
             className="w-full py-10 bg-[#FF8C00] text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] shadow-[0_20px_80px_rgba(255,140,0,0.3)] flex items-center justify-center gap-4 group"
           >
              Finalizar Simulación <ArrowRight className="group-hover:translate-x-2 transition-transform" />
           </motion.button>
        </section>

        {/* VISUALIZACIÓN DE DATOS */}
        <section className="lg:col-span-7 space-y-8">
           <div className="bg-white/[0.01] border border-white/5 rounded-[80px] p-12 relative overflow-hidden flex flex-col min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF8C00]/5 via-transparent to-blue-500/5 opacity-50" />
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                       <BarChart3 size={16} className="text-[#FF8C00]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">{data.output_label}</span>
                    </div>
                    <div className="text-4xl font-black text-white italic tracking-tighter">
                       LIVE_FEED_01
                    </div>
                 </div>

                 <div className="flex-1 w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData}>
                          <defs>
                             <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#FF8C00" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="valor" stroke="#FF8C00" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                          <Tooltip contentStyle={{ backgroundColor: '#05010D', borderColor: '#FF8C00', borderRadius: '20px' }} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="text-center mt-10">
                    <motion.div 
                      key={result}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[10rem] font-black tracking-tighter leading-none italic text-white drop-shadow-[0_0_80px_rgba(255,140,0,0.3)]"
                    >
                       {Math.round(result).toLocaleString()}
                    </motion.div>
                    <div className="text-2xl font-black text-[#FF8C00] uppercase tracking-[0.4em] mt-4">
                       {data.output_prefix} {data.output_suffix}
                    </div>
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
                  className={`p-10 rounded-[50px] border-2 backdrop-blur-3xl shadow-2xl
                    ${activeScenario.tipo === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                      activeScenario.tipo === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                      'bg-sky-500/10 border-sky-500/30 text-sky-400'}`}
                >
                   <div className="flex items-start gap-6">
                      <div className="p-4 bg-white/10 rounded-2xl">
                         <Info size={32} />
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Analítica Diamond 2026</div>
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
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8"
          >
             <div className="max-w-xl w-full bg-white/[0.03] border border-white/10 rounded-[80px] p-20 text-center space-y-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 bg-[#FF8C00] text-black rounded-[40px] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(255,140,0,0.5)]">
                   <CheckCircle2 size={64} />
                </motion.div>
                <div className="space-y-4">
                   <h2 className="text-6xl font-black italic tracking-tighter uppercase">Simulación Validada</h2>
                   <p className="text-white/40 text-xl font-medium leading-relaxed">Has superado los desafíos técnicos de <br/> <span className="text-white">"{data.titulo}"</span></p>
                </div>
                <button 
                  onClick={() => onComplete && onComplete(100)}
                  className="w-full py-10 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] hover:scale-105 transition-all"
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
