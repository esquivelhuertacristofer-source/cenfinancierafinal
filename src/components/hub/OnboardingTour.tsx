'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MousePointer2, Target, Trophy } from 'lucide-react';

const STEPS = [
  {
    id: 'profile',
    title: 'Tu Identidad Diamond',
    description: 'Aquí puedes ver tu rango actual y el progreso total de tu carrera financiera.',
    icon: <Target className="text-[#FF8C00]" size={32} />,
    position: 'top-left'
  },
  {
    id: 'pillars',
    title: 'Pilares del Saber',
    description: 'Selecciona el área que deseas dominar hoy. Cada pilar desbloquea nuevas medallas.',
    icon: <Trophy className="text-[#42E8E0]" size={32} />,
    position: 'top-center'
  },
  {
    id: 'timeline',
    title: 'Ruta de Aprendizaje',
    description: 'Completa las misiones en orden para avanzar. Las misiones bloqueadas se liberan al terminar la anterior.',
    icon: <MousePointer2 className="text-white" size={32} />,
    position: 'bottom-center'
  }
];

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('cen_tour_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('cen_tour_completed', 'true');
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0A0118]/80 backdrop-blur-md"
          onClick={handleComplete}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-lg bg-[#111827] border border-white/10 rounded-[40px] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8C00]/10 blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                {step.icon}
              </div>
              <button 
                onClick={handleComplete}
                className="p-3 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-10">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF8C00]">Paso {currentStep + 1} de {STEPS.length}</div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{step.title}</h2>
              <p className="text-white/50 text-lg leading-relaxed">{step.description}</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleNext}
                className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {currentStep === STEPS.length - 1 ? 'Empezar Misión' : 'Siguiente'}
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-[#FF8C00]' : 'w-2 bg-white/10'}`} 
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
