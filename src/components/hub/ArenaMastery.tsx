'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  X, 
  Crown,
  ChevronRight,
  Sparkles,
  Timer
} from 'lucide-react';
import { QuizQuestion } from '@/lib/hub';

interface ArenaMasteryProps {
  grade: number;
  schoolLevel: string;
  quiz: QuizQuestion[];
  isDark: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export default function ArenaMastery({ 
  grade, 
  schoolLevel, 
  quiz, 
  isDark, 
  onClose, 
  onComplete 
}: ArenaMasteryProps) {
  const [step, setStep] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);

  const currentQuestion = quiz[currentIndex];
  const progress = ((currentIndex + 1) / quiz.length) * 100;

  // Cinematic Timer
  useEffect(() => {
    if (step === 'playing' && !isAnswered && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Timeout as wrong answer
    }
  }, [step, isAnswered, timeLeft]);

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    
    if (optionIdx === currentQuestion.correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setStep('results');
    }
  };

  const getRank = (finalScore: number) => {
    const pct = (finalScore / quiz.length) * 100;
    if (pct >= 90) return { title: 'DIAMOND MASTER', color: 'text-[#42E8E0]', icon: <Crown className="w-12 h-12" />, bg: 'bg-[#42E8E0]/10' };
    if (pct >= 70) return { title: 'ESTRATEGIA MAESTRA', color: 'text-[#FFD700]', icon: <Trophy className="w-12 h-12" />, bg: 'bg-[#FFD700]/10' };
    if (pct >= 50) return { title: 'ANALISTA EXPERTO', color: 'text-[#C0C0C0]', icon: <Target className="w-12 h-12" />, bg: 'bg-[#C0C0C0]/10' };
    return { title: 'NOVATO FINANCIERO', color: 'text-orange-400', icon: <Zap className="w-12 h-12" />, bg: 'bg-orange-400/10' };
  };

  return (
    <div className={`fixed inset-0 z-[4000] flex flex-col overflow-hidden ${isDark ? 'bg-[#011126]' : 'bg-[#F4F1EA]'}`}>
      {/* HUD Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header HUD */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <ShieldCheck className="w-6 h-6 text-[#42E8E0]" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">Arena de Maestría</h2>
            <p className="text-sm font-medium text-white">Grado {grade} • {schoolLevel}</p>
          </div>
        </div>

        {step === 'playing' && (
          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Racha</span>
              <span className="text-xl font-black text-[#FFD700] italic">x{streak}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Puntos</span>
              <span className="text-xl font-black text-white">{score * 150}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white/60" />
            </button>
          </div>
        )}
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#42E8E0]/20 blur-3xl rounded-full" />
                <Trophy className="w-24 h-24 text-[#42E8E0] relative z-10 mx-auto" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tight">
                  EL DESAFÍO <span className="text-[#42E8E0]">DIAMOND</span>
                </h1>
                <p className="text-xl text-white/60 max-w-lg mx-auto">
                  Demuestra tu dominio financiero en el examen final del año. 
                  Solo los mejores alcanzarán el rango Diamond.
                </p>
              </div>
              <button
                onClick={() => setStep('playing')}
                className="group relative px-12 py-5 bg-[#42E8E0] text-[#011126] font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <span className="relative flex items-center gap-3 text-lg">
                  INICIAR BATALLA <ArrowRight className="w-6 h-6" />
                </span>
              </button>
            </motion.div>
          )}

          {step === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-8"
            >
              {/* Question Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-[#42E8E0] uppercase tracking-widest">
                    Pregunta {currentIndex + 1} de {quiz.length}
                  </span>
                  <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white/60'}`}>
                    <Timer className="w-4 h-4" />
                    00:{timeLeft.toString().padStart(2, '0')}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[#42E8E0] to-blue-500 shadow-[0_0_15px_rgba(66,232,224,0.5)]"
                  />
                </div>

                <h3 className="text-3xl font-bold text-white leading-tight">
                  {currentQuestion.q}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  let status = 'default';
                  if (isAnswered) {
                    if (idx === currentQuestion.correct) status = 'correct';
                    else if (idx === selectedOption) status = 'incorrect';
                    else status = 'dimmed';
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!isAnswered ? { x: 10, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={`relative p-6 text-left rounded-2xl border transition-all duration-300 ${
                        status === 'correct' ? 'bg-emerald-500/20 border-emerald-500 text-white' :
                        status === 'incorrect' ? 'bg-red-500/20 border-red-500 text-white' :
                        status === 'dimmed' ? 'bg-white/5 border-white/5 opacity-40' :
                        'bg-white/5 border-white/10 text-white/80 hover:border-[#42E8E0]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{option}</span>
                        {status === 'correct' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                        {status === 'incorrect' && <AlertCircle className="w-6 h-6 text-red-400" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Pedagogical Feedback */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl border ${
                      selectedOption === currentQuestion.correct 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-orange-500/10 border-orange-500/30'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        selectedOption === currentQuestion.correct ? 'bg-emerald-500/20' : 'bg-orange-500/20'
                      }`}>
                        {selectedOption === currentQuestion.correct ? <Sparkles className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-orange-400" />}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-sm font-bold uppercase tracking-wider ${
                          selectedOption === currentQuestion.correct ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {selectedOption === currentQuestion.correct ? '¡Excelente Dominio!' : 'Lección de Maestría'}
                        </p>
                        <p className="text-white/80 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={nextQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-[#011126] font-bold rounded-xl hover:scale-105 transition-transform"
                      >
                        {currentIndex === quiz.length - 1 ? 'Ver Resultados' : 'Siguiente'} <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl text-center space-y-10"
            >
              <div className="relative">
                <div className={`absolute inset-0 blur-3xl rounded-full ${getRank(score).bg}`} />
                <div className="relative p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="mb-6 flex justify-center">{getRank(score).icon}</div>
                  <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.3em] mb-2">Rango Obtenido</h4>
                  <h2 className={`text-5xl font-black mb-8 ${getRank(score).color}`}>{getRank(score).title}</h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <span className="block text-xs font-bold text-white/30 uppercase mb-1">Aciertos</span>
                      <span className="text-4xl font-black text-white">{score} <span className="text-xl text-white/20">/ {quiz.length}</span></span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <span className="block text-xs font-bold text-white/30 uppercase mb-1">Puntaje Total</span>
                      <span className="text-4xl font-black text-[#42E8E0]">{score * 150}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={onClose}
                  className="px-10 py-5 rounded-2xl font-black border border-white/10 text-white hover:bg-white/5 transition-all"
                >
                  SALIR DEL ARENA
                </button>
                <button
                  onClick={() => onComplete(score)}
                  className="px-10 py-5 rounded-2xl font-black bg-[#42E8E0] text-[#011126] hover:scale-105 transition-all"
                >
                  REGISTRAR VICTORIA
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer HUD Decor */}
      <div className="relative z-10 p-4 border-t border-white/5 text-center">
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">
          CEN Mastery Arena System v2.0 • Diamond Protocol Active
        </span>
      </div>
    </div>
  );
}
