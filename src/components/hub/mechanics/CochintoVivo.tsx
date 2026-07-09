'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { BaseActivity } from '@/types/activities';

// ─── Content shape for CochintoVivo ──────────────────────────────────────────
interface CochintoContent {
  goal: number;
  goal_description: string;
  duration_days: number;
  deposit_amount: number;
}

// The Activity type as required by the spec
interface Activity extends BaseActivity {
  content: CochintoContent;
}

// ─── Coin animation item ──────────────────────────────────────────────────────
interface FlyingCoin {
  id: number;
  x: number;
}

// ─── Pig state config ─────────────────────────────────────────────────────────
interface PigState {
  emoji: string;
  label: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

const PIG_STATES: PigState[] = [
  { emoji: '😢', label: '¡Ayúdame!', bgClass: 'bg-red-900/40', borderClass: 'border-red-500/50', textClass: 'text-red-300' },
  { emoji: '😐', label: 'Voy poco a poco...', bgClass: 'bg-yellow-900/40', borderClass: 'border-yellow-500/50', textClass: 'text-yellow-300' },
  { emoji: '😊', label: '¡Ya casi!', bgClass: 'bg-green-900/40', borderClass: 'border-green-500/50', textClass: 'text-green-300' },
  { emoji: '🐷✨', label: '¡Lleno de monedas!', bgClass: 'bg-purple-900/40', borderClass: 'border-purple-400/60', textClass: 'text-purple-300' },
];

function getPigStateIndex(percent: number): number {
  if (percent < 0.25) return 0;
  if (percent < 0.5) return 1;
  if (percent < 0.75) return 2;
  return 3;
}

// ─── Confetti particle ────────────────────────────────────────────────────────
interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

function generateConfetti(count = 40): ConfettiParticle[] {
  const colors = ['#a855f7', '#22c55e', '#f59e0b', '#ec4899', '#3b82f6', '#f97316'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 2,
    size: 6 + Math.floor(Math.random() * 10),
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CochintoVivo({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = (activity.content as unknown as CochintoContent) ?? ({} as CochintoContent);
  // Defensive fallbacks: `content` could be missing fields (or `goal`/`deposit_amount`
  // could be 0), which would otherwise cause saved/goal divisions to yield NaN
  // and would leave the game unwinnable/unplayable.
  const goal = content?.goal || 100;
  const goal_description = content?.goal_description ?? 'tu meta';
  const duration_days = content?.duration_days ?? 30;
  const deposit_amount = content?.deposit_amount || 10;

  // ─── Game state ─────────────────────────────────────────────────────────────
  type Screen = 'start' | 'game' | 'results';
  const [screen, setScreen] = useState<Screen>('start');
  const [saved, setSaved] = useState(0);
  const [daysLeft, setDaysLeft] = useState(duration_days);
  const [flyingCoins, setFlyingCoins] = useState<FlyingCoin[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [pigBounce, setPigBounce] = useState(false);
  const coinIdRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const depositTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear any pending deposit/pig-bounce timeouts on unmount to avoid leaks
  // and setState-after-unmount calls.
  useEffect(() => {
    return () => {
      depositTimeoutsRef.current.forEach(clearTimeout);
      depositTimeoutsRef.current = [];
    };
  }, []);

  const percent = Math.min(saved / goal, 1);
  const pigStateIdx = getPigStateIndex(percent);
  const pigState = PIG_STATES[pigStateIdx];
  const reached = saved >= goal;
  const outOfDays = daysLeft <= 0 && !reached;
  const gameOver = reached || outOfDays;

  // ─── Trigger confetti when goal reached ──────────────────────────────────
  useEffect(() => {
    if (reached && screen === 'game') {
      setConfetti(generateConfetti(50));
      const t = setTimeout(() => setScreen('results'), 2200);
      return () => clearTimeout(t);
    }
  }, [reached, screen]);

  useEffect(() => {
    if (outOfDays && screen === 'game') {
      const t = setTimeout(() => setScreen('results'), 800);
      return () => clearTimeout(t);
    }
  }, [outOfDays, screen]);

  // ─── Score calculation ───────────────────────────────────────────────────
  const score = reached ? 100 : Math.round(percent * 100);

  // ─── Deposit handler ─────────────────────────────────────────────────────
  const handleDeposit = useCallback(() => {
    if (isAnimating || gameOver) return;

    setIsAnimating(true);

    // Spawn 1-3 flying coins at random x positions
    const newCoins: FlyingCoin[] = Array.from({ length: 1 }, () => {
      coinIdRef.current += 1;
      return {
        id: coinIdRef.current,
        x: 30 + Math.random() * 40,
      };
    });
    setFlyingCoins(prev => [...prev, ...newCoins]);

    // Update game state after coin animation begins
    const depositTimeout = setTimeout(() => {
      setSaved(prev => Math.min(prev + deposit_amount, goal));
      setDaysLeft(prev => Math.max(prev - 1, 0));
      setPigBounce(true);
      const bounceTimeout = setTimeout(() => setPigBounce(false), 400);
      depositTimeoutsRef.current.push(bounceTimeout);
    }, 400);

    // Remove coins after animation
    const cleanupTimeout = setTimeout(() => {
      setFlyingCoins(prev => prev.filter(c => !newCoins.find(n => n.id === c.id)));
      setIsAnimating(false);
    }, 800);

    depositTimeoutsRef.current.push(depositTimeout, cleanupTimeout);
  }, [isAnimating, gameOver, deposit_amount, goal]);

  // ─── Render: Start Screen ─────────────────────────────────────────────────
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full">
          {/* Title */}
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            El Cochinito Vivo 🐷
          </h1>
          <p className="text-purple-300 text-lg font-bold mb-8">
            ¡Aprende a ahorrar jugando!
          </p>

          {/* Mission card */}
          <div className="rounded-3xl border border-purple-500/30 bg-white/5 p-6 mb-8">
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-3">
              Tu misión
            </p>
            <p className="text-white text-2xl font-black mb-1">
              Ahorrar{' '}
              <span className="text-emerald-300">
                ${goal.toLocaleString()} pesos
              </span>
            </p>
            <p className="text-white/70 text-base font-bold mb-4">
              para {goal_description}
            </p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-purple-300 text-2xl font-black">{duration_days}</p>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">días</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-300 text-2xl font-black">+${deposit_amount}</p>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">por día</p>
              </div>
            </div>
          </div>

          {/* Big pig */}
          <div className="text-8xl mb-8 animate-bounce">😢</div>
          <p className="text-white/60 text-sm font-bold mb-6">
            ¡El cochinito necesita tu ayuda para llenarse de monedas!
          </p>

          <button
            onClick={() => setScreen('game')}
            className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all duration-300 font-black uppercase tracking-widest text-white text-xl py-4 px-6 min-h-[56px]"
          >
            ¡Empezar a Ahorrar! 🪙
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Results Screen ───────────────────────────────────────────────
  if (screen === 'results') {
    const won = saved >= goal;
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Confetti overlay */}
        {won && confetti.map(p => (
          <div
            key={p.id}
            className="absolute top-0 pointer-events-none"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            }}
          />
        ))}

        <style>{`
          @keyframes confettiFall {
            0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>

        <div className="max-w-sm w-full relative z-10">
          {/* Result emoji */}
          <div className="text-8xl mb-4">
            {won ? '🎉' : percent >= 0.7 ? '😊' : percent >= 0.4 ? '😐' : '😢'}
          </div>

          <h1 className="text-3xl font-black text-white mb-2">
            {won ? '¡Lo lograste!' : '¡Buen esfuerzo!'}
          </h1>

          <p className={`text-lg font-bold mb-6 ${won ? 'text-emerald-300' : 'text-white/70'}`}>
            {won
              ? `¡Ahorraste todo para ${goal_description}! 🐷✨`
              : `Ahorraste $${saved} de $${goal} para ${goal_description}`}
          </p>

          {/* Score card */}
          <div className={`rounded-3xl border p-6 mb-6 ${
            won
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-white/10 bg-white/5'
          }`}>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              Tu puntuación
            </p>
            <p className={`text-6xl font-black mb-1 ${won ? 'text-emerald-300' : 'text-purple-300'}`}>
              {score}
            </p>
            <p className="text-white/50 text-sm font-bold">de 100 puntos</p>

            {/* Progress bar */}
            <div className="mt-4 h-4 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  won ? 'bg-emerald-400' : 'bg-purple-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-emerald-300 text-xl font-black">${saved}</p>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">ahorrado</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-yellow-300 text-xl font-black">{duration_days - daysLeft}</p>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">días activos</p>
            </div>
          </div>

          {/* Lesson */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-900/20 p-4 mb-8">
            <p className="text-purple-300 text-sm font-bold">
              💡 {won
                ? '¡Ahorrar poco a poco nos ayuda a cumplir nuestros sueños!'
                : '¡Cada peso cuenta! Con constancia, ¡la próxima vez lo lograrás!'}
            </p>
          </div>

          <button
            onClick={() => {
              if (hasCompletedRef.current) return;
              hasCompletedRef.current = true;
              onComplete(score);
            }}
            className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all duration-300 font-black uppercase tracking-widest text-white text-xl py-4 px-6 min-h-[56px]"
          >
            Finalizar 🏆
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Game Screen ──────────────────────────────────────────────────
  const barPercent = Math.round(percent * 100);
  const canDeposit = !isAnimating && !gameOver;

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti overlay (goal reached, before transition) */}
      {reached && confetti.map(p => (
        <div
          key={p.id}
          className="absolute top-0 pointer-events-none z-50"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes coinDrop {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          60%  { transform: translateY(120px) scale(0.9); opacity: 0.8; }
          100% { transform: translateY(200px) scale(0.5); opacity: 0; }
        }
        @keyframes pigBounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.18) rotate(-4deg); }
          60%  { transform: scale(0.95) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>

      <div className="max-w-sm w-full flex flex-col gap-4 relative z-10">

        {/* Header row: days left + goal */}
        <div className="flex justify-between items-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
            <p className={`text-2xl font-black ${daysLeft <= 3 ? 'text-red-300 animate-pulse' : 'text-yellow-300'}`}>
              {daysLeft}
            </p>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
              {daysLeft === 1 ? 'día' : 'días'}
            </p>
          </div>

          <div className="text-center">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">meta</p>
            <p className="text-emerald-300 text-lg font-black">${goal.toLocaleString()}</p>
            <p className="text-white/40 text-xs font-bold">{goal_description}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
            <p className="text-purple-300 text-2xl font-black">{barPercent}%</p>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">lleno</p>
          </div>
        </div>

        {/* Pig + coin animations */}
        <div className={`relative rounded-3xl border ${pigState.borderClass} ${pigState.bgClass} p-6 flex flex-col items-center transition-all duration-500`}>
          {/* Flying coins */}
          {flyingCoins.map(coin => (
            <div
              key={coin.id}
              className="absolute text-3xl pointer-events-none z-20"
              style={{
                left: `${coin.x}%`,
                top: 0,
                animation: 'coinDrop 0.8s ease-in forwards',
              }}
            >
              🪙
            </div>
          ))}

          {/* Pig emoji */}
          <div
            className="text-8xl select-none leading-none"
            style={{
              animation: pigBounce ? 'pigBounce 0.4s ease-out forwards' : undefined,
              display: 'inline-block',
            }}
          >
            {pigState.emoji}
          </div>

          <p className={`mt-3 text-lg font-black ${pigState.textClass}`}>
            {pigState.label}
          </p>

          {/* Saved amount */}
          <p className="text-white text-3xl font-black mt-1">
            ${saved}
            <span className="text-white/40 text-lg font-bold"> / ${goal}</span>
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-6 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
              style={{
                width: `${barPercent}%`,
                background: barPercent >= 75
                  ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                  : barPercent >= 50
                    ? 'linear-gradient(90deg, #22c55e, #84cc16)'
                    : barPercent >= 25
                      ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                      : 'linear-gradient(90deg, #ef4444, #f97316)',
              }}
            >
              {/* Shimmer */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            </div>
            {/* Milestone marks */}
            {[25, 50, 75].map(m => (
              <div
                key={m}
                className="absolute top-0 bottom-0 w-0.5 bg-white/20"
                style={{ left: `${m}%` }}
              />
            ))}
          </div>

          {/* Milestone emojis */}
          <div className="flex justify-between mt-1 px-0.5">
            {['😢', '😐', '😊', '🐷✨'].map((e, i) => (
              <span
                key={i}
                className={`text-base transition-all duration-300 ${
                  pigStateIdx >= i ? 'opacity-100' : 'opacity-25'
                }`}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Deposit button */}
        <button
          onClick={handleDeposit}
          disabled={!canDeposit}
          className={`w-full rounded-2xl font-black uppercase tracking-widest text-white text-xl py-4 px-6 min-h-[64px] transition-all duration-300 ${
            canDeposit
              ? 'bg-yellow-500 hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/30'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {gameOver
            ? reached
              ? '🎉 ¡Meta alcanzada!'
              : '⏰ Sin días restantes'
            : `¡Depositar moneda! 🪙 +$${deposit_amount}`}
        </button>

        {/* Days warning */}
        {daysLeft <= 5 && !gameOver && (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-3 text-center">
            <p className="text-red-300 font-black text-sm animate-pulse">
              ⚠️ ¡Solo te quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'}! ¡Ahorra rápido!
            </p>
          </div>
        )}

        {/* Tip */}
        {!gameOver && (
          <p className="text-white/30 text-xs font-bold text-center">
            Deposita ${deposit_amount} por día • Quedan {daysLeft} días • Meta: ${goal}
          </p>
        )}
      </div>
    </div>
  );
}
