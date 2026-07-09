'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── Content shape ────────────────────────────────────────────────────────────

interface InvestmentOption {
  label: string;
  description: string;
  multiplier: number;
  explanation: string;
}

interface Crisis {
  year: number;
  name: string;
  context: string;
  options: InvestmentOption[];
}

interface BancoDelTiempoContent {
  starting_amount: number;
  crises: Crisis[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getMultiplierEmoji(m: number): string {
  if (m >= 2.0) return '🚀';
  if (m >= 1.5) return '📈';
  if (m >= 1.1) return '✅';
  if (m >= 0.95) return '😐';
  if (m >= 0.7) return '⚠️';
  return '💸';
}

function getMultiplierLabel(m: number): string {
  if (m >= 2.0) return '¡Ganancia enorme!';
  if (m >= 1.5) return '¡Muy buena ganancia!';
  if (m >= 1.1) return 'Ganancia moderada';
  if (m >= 0.95) return 'Casi sin cambios';
  if (m >= 0.7) return 'Pérdida moderada';
  return 'Gran pérdida';
}

function getAmountColor(current: number, starting: number): string {
  const ratio = current / starting;
  if (ratio >= 2.5) return 'text-emerald-300';
  if (ratio >= 1.2) return 'text-green-300';
  if (ratio >= 0.9) return 'text-yellow-300';
  if (ratio >= 0.6) return 'text-orange-300';
  return 'text-red-300';
}

// ─── Screen types ─────────────────────────────────────────────────────────────

type Screen = 'start' | 'game' | 'result' | 'traveling';

// ─── Component ────────────────────────────────────────────────────────────────

export default function BancoDelTiempo({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = activity.content as unknown as BancoDelTiempoContent;
  const crises: Crisis[] = content?.crises ?? [];
  // Use `||` (not `??`) so a malformed/zero starting_amount doesn't lead to
  // division-by-zero (0/0 = NaN) in the score and ratio calculations below.
  const startingAmount: number = content?.starting_amount || 1000;

  const [screen, setScreen] = useState<Screen>('start');
  const [crisisIndex, setCrisisIndex] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(startingAmount);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<
    Array<{ year: number; name: string; option: InvestmentOption; amountBefore: number; amountAfter: number }>
  >([]);
  const [travelYear, setTravelYear] = useState<number>(0);
  const [travelYears, setTravelYears] = useState<number[]>([]);
  const [travelIdx, setTravelIdx] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const travelIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompletedRef = useRef(false);

  const currentCrisis = crises[crisisIndex] ?? null;

  // Clear any in-flight travel animation interval on unmount so it doesn't
  // keep firing setState calls after the component is gone.
  useEffect(() => {
    return () => {
      if (travelIntervalRef.current) {
        clearInterval(travelIntervalRef.current);
        travelIntervalRef.current = null;
      }
    };
  }, []);

  // Generate travel animation years between current year and next year
  const startTravelAnimation = useCallback((fromYear: number, toYear: number, onDone: () => void) => {
    const steps: number[] = [];
    const diff = toYear - fromYear;
    const stepCount = Math.min(Math.abs(diff), 8);
    for (let i = 1; i <= stepCount; i++) {
      steps.push(Math.round(fromYear + (diff * i) / stepCount));
    }
    setTravelYears(steps);
    setTravelIdx(0);
    setTravelYear(fromYear);
    setScreen('traveling');

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) {
        setTravelIdx(idx);
        setTravelYear(steps[idx]);
      } else {
        clearInterval(interval);
        travelIntervalRef.current = null;
        onDone();
      }
    }, 150);
    travelIntervalRef.current = interval;
  }, []);

  const handleStart = () => {
    setCurrentAmount(startingAmount);
    setCrisisIndex(0);
    setHistory([]);
    setSelectedOption(null);
    setShowResult(false);
    setScreen('game');
  };

  const handleSelectOption = (optionIdx: number) => {
    if (showResult) return;
    setSelectedOption(optionIdx);
  };

  const handleConfirm = () => {
    if (selectedOption === null || !currentCrisis) return;
    const option = currentCrisis.options[selectedOption];
    const amountBefore = currentAmount;
    const amountAfter = amountBefore * option.multiplier;

    setCurrentAmount(amountAfter);
    setHistory((prev) => [
      ...prev,
      {
        year: currentCrisis.year,
        name: currentCrisis.name,
        option,
        amountBefore,
        amountAfter,
      },
    ]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (!currentCrisis) return;
    const isLast = crisisIndex >= crises.length - 1;
    const fromYear = currentCrisis.year;
    const toYear = isLast ? currentCrisis.year + 5 : crises[crisisIndex + 1].year;

    setShowResult(false);
    setSelectedOption(null);

    startTravelAnimation(fromYear, toYear, () => {
      if (isLast) {
        // Calculate score
        const ratio = currentAmount / startingAmount;
        const score = Math.min(100, Math.round((ratio / 3) * 100));
        setFinalScore(score);
        setScreen('result');
      } else {
        setCrisisIndex((prev) => prev + 1);
        setScreen('game');
      }
    });
  };

  const handleFinalize = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete(finalScore);
  };

  // ── Traveling Screen ────────────────────────────────────────────────────────

  if (screen === 'traveling') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center relative overflow-hidden p-6">
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Warp lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-purple-500/20"
              style={{
                height: '1px',
                width: '60%',
                top: (i + 1) * (100 / 13) + '%',
                left: '20%',
                transform: 'scaleX(1)',
                animation: 'warp 0.3s linear infinite',
                animationDelay: i * 0.05 + 's',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center space-y-8">
          <div className="text-8xl animate-bounce">⏰</div>
          <h2 className="text-white font-black text-3xl uppercase tracking-widest">
            ¡Viajando en el tiempo!
          </h2>
          <div className="text-purple-300 font-black text-7xl tracking-widest tabular-nums animate-pulse">
            {travelYear}
          </div>
          <p className="text-white/50 font-bold text-lg uppercase tracking-widest">
            Ajustando la máquina del tiempo...
          </p>
          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-4">
            {travelYears.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i <= travelIdx ? 'bg-purple-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes warp {
            from { transform: scaleX(0); opacity: 0; left: 20%; }
            to { transform: scaleX(1); opacity: 1; left: 20%; }
          }
        `}</style>
      </div>
    );
  }

  // ── Start Screen ─────────────────────────────────────────────────────────────

  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-28 h-28 rounded-3xl bg-purple-700/40 border border-purple-500/30 flex items-center justify-center text-6xl animate-pulse">
              🕰️
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-white font-black text-4xl md:text-5xl uppercase tracking-widest leading-tight">
              El Banco
              <br />
              <span className="text-purple-300">del Tiempo</span>
            </h1>
            <p className="text-white/50 font-bold text-sm mt-3 uppercase tracking-widest">
              Máquina del tiempo financiera
            </p>
          </div>

          {/* Story */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇲🇽</span>
              <span className="text-purple-300 font-black text-sm uppercase tracking-widest">
                México 1990 — 2020
              </span>
            </div>
            <p className="text-white/80 font-bold leading-relaxed">
              Tienes <span className="text-emerald-300 font-black">{formatMXN(startingAmount)}</span> y una
              máquina del tiempo. Viaja a través de las crisis económicas de México y toma
              decisiones financieras inteligentes. ¿Podrás superar la inflación?
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-emerald-300 font-black text-lg">{formatMXN(startingAmount)}</div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                Inicio
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-purple-300 font-black text-lg">{crises.length}</div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                Crisis
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-yellow-300 font-black text-lg">100</div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                XP máx
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-lg transition-all duration-300 shadow-lg shadow-purple-900/50 min-h-[56px]"
          >
            🚀 ¡Activar Máquina del Tiempo!
          </button>

          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            {crises.length > 0
              ? `Año inicial: ${crises[0].year} · Año final: ${crises[crises.length - 1].year}`
              : 'Cargando datos históricos...'}
          </p>
        </div>
      </div>
    );
  }

  // ── Result Screen ─────────────────────────────────────────────────────────────

  if (screen === 'result') {
    const worstCase = startingAmount * 0.3; // keeping at home through all crises
    const ratio = currentAmount / startingAmount;
    const beatInflation = currentAmount > startingAmount * 1.5;
    const beatWorstCase = currentAmount > worstCase;

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
        {/* Background glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-30 ${
            beatInflation ? 'bg-emerald-500' : 'bg-orange-500'
          }`}
        />

        <div className="relative z-10 max-w-2xl w-full space-y-6 py-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="text-7xl">{finalScore >= 70 ? '🏆' : finalScore >= 40 ? '🎖️' : '💡'}</div>
            <h1 className="text-white font-black text-4xl md:text-5xl uppercase tracking-widest leading-tight">
              {finalScore >= 70 ? '¡Genio Financiero!' : finalScore >= 40 ? '¡Buen intento!' : 'Aprendiste algo'}
            </h1>
            <p className="text-white/50 font-bold text-sm uppercase tracking-widest">
              Resultado de tu viaje en el tiempo
            </p>
          </div>

          {/* Score ring */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  fill="none"
                  stroke={finalScore >= 70 ? '#10b981' : finalScore >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  strokeDasharray={`${(finalScore / 100) * 377} 377`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`font-black text-4xl ${
                    finalScore >= 70
                      ? 'text-emerald-300'
                      : finalScore >= 40
                      ? 'text-yellow-300'
                      : 'text-red-300'
                  }`}
                >
                  {finalScore}
                </span>
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">puntos</span>
              </div>
            </div>
          </div>

          {/* Money comparison */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-white/70 font-black text-xs uppercase tracking-widest">
              Comparando resultados
            </h2>
            <div className="space-y-3">
              {/* Your result */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕹️</span>
                  <span className="text-white font-bold text-sm">Tu resultado</span>
                </div>
                <span className={`font-black text-xl ${getAmountColor(currentAmount, startingAmount)}`}>
                  {formatMXN(currentAmount)}
                </span>
              </div>
              {/* Bar */}
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 bg-emerald-500"
                  style={{ width: `${Math.min(100, (currentAmount / (startingAmount * 4)) * 100)}%` }}
                />
              </div>

              {/* Worst case */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <span className="text-white/60 font-bold text-sm">Guardado en casa</span>
                </div>
                <span className="text-red-300 font-black text-xl">{formatMXN(worstCase)}</span>
              </div>
              {/* Bar */}
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${Math.min(100, (worstCase / (startingAmount * 4)) * 100)}%` }}
                />
              </div>
            </div>

            {beatWorstCase && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                <span className="text-emerald-300 font-black text-sm">
                  ✅ ¡Le ganaste {formatMXN(currentAmount - worstCase)} más que guardando en casa!
                </span>
              </div>
            )}
          </div>

          {/* History */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-white/70 font-black text-xs uppercase tracking-widest">
              Tu historial de decisiones
            </h2>
            <div className="space-y-3">
              {history.map((h, i) => {
                const gained = h.amountAfter > h.amountBefore;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 ${
                      gained
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-white/40 text-xs font-black uppercase tracking-widest">
                          {h.year} · {h.name}
                        </span>
                        <p className="text-white font-bold text-sm mt-0.5">{h.option.label}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-black text-sm ${gained ? 'text-emerald-300' : 'text-red-300'}`}>
                          {gained ? '+' : ''}{formatMXN(h.amountAfter - h.amountBefore)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lesson */}
          <div className="rounded-3xl border border-purple-500/30 bg-purple-600/10 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <span className="text-purple-300 font-black text-xs uppercase tracking-widest">
                Lección aprendida
              </span>
            </div>
            <p className="text-white/80 font-bold leading-relaxed">
              {ratio >= 2.5
                ? 'Eres un experto en finanzas. Diversificar y tomar decisiones basadas en información histórica es la clave del éxito financiero.'
                : ratio >= 1.2
                ? 'Hiciste buenas decisiones. La educación financiera te ayuda a proteger tu dinero de la inflación y las crisis.'
                : ratio >= 0.8
                ? 'La economía es difícil, pero ahora conoces las crisis históricas de México. ¡La próxima vez te irá mejor!'
                : 'Las crisis económicas pueden ser devastadoras. Tener dinero en diferentes lugares (diversificar) reduce el riesgo.'}
            </p>
          </div>

          {/* Finalizar button */}
          <button
            onClick={handleFinalize}
            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-lg transition-all duration-300 shadow-lg shadow-purple-900/50 min-h-[56px]"
          >
            🎓 Finalizar — {finalScore} puntos
          </button>
        </div>
      </div>
    );
  }

  // ── Game Screen ──────────────────────────────────────────────────────────────

  if (!currentCrisis) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <p className="text-white/40 font-black text-xl uppercase tracking-widest">
          Cargando crisis histórica...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col p-4 md:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto w-full space-y-5 py-2">

        {/* Top HUD */}
        <div className="flex items-center justify-between gap-4">
          {/* Progress */}
          <div className="flex items-center gap-2">
            {crises.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i < crisisIndex
                    ? 'bg-purple-400 w-6'
                    : i === crisisIndex
                    ? 'bg-purple-300 w-8 animate-pulse'
                    : 'bg-white/20 w-4'
                }`}
              />
            ))}
          </div>
          {/* Current amount */}
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 flex items-center gap-2 shrink-0">
            <span className="text-lg">💰</span>
            <span className={`font-black text-base ${getAmountColor(currentAmount, startingAmount)}`}>
              {formatMXN(currentAmount)}
            </span>
          </div>
        </div>

        {/* Time Machine Panel */}
        <div className="rounded-3xl border border-purple-500/30 bg-[#1a0533]/80 p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          {/* Year display */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white/40 text-xs font-black uppercase tracking-widest">
                Crisis #{crisisIndex + 1} de {crises.length}
              </span>
              <div className="text-purple-300 font-black text-5xl md:text-6xl tracking-widest mt-1">
                {currentCrisis.year}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl border border-purple-500/30 bg-purple-700/20 flex items-center justify-center text-3xl">
              ⏰
            </div>
          </div>

          {/* Crisis name */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-600/10 px-4 py-3">
            <span className="text-purple-300 font-black text-lg">
              📰 {currentCrisis.name}
            </span>
          </div>

          {/* Context */}
          <p className="text-white/70 font-bold leading-relaxed text-sm md:text-base">
            {currentCrisis.context}
          </p>
        </div>

        {/* Decision zone */}
        {!showResult ? (
          <div className="space-y-4">
            <h2 className="text-white font-black text-lg uppercase tracking-widest text-center">
              ¿Qué haces con tu dinero? 🤔
            </h2>

            <div className="space-y-3">
              {currentCrisis.options.map((option, i) => {
                const isSelected = selectedOption === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 min-h-[72px] ${
                      isSelected
                        ? 'border-purple-400 bg-purple-600/20 shadow-lg shadow-purple-900/30'
                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 active:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          isSelected ? 'border-purple-400 bg-purple-400' : 'border-white/30'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-black text-base">{option.label}</div>
                        <div className="text-white/50 font-bold text-sm mt-0.5 leading-snug">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <button
                onClick={handleConfirm}
                className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-base transition-all duration-200 shadow-lg shadow-purple-900/50 min-h-[56px] animate-pulse"
              >
                ✅ Confirmar Decisión
              </button>
            )}
          </div>
        ) : (
          /* Result of turn */
          <div className="space-y-4">
            {(() => {
              const option = currentCrisis.options[selectedOption!];
              const amountBefore = history[history.length - 1].amountBefore;
              const amountAfter = history[history.length - 1].amountAfter;
              const gained = amountAfter >= amountBefore;
              const diff = amountAfter - amountBefore;

              return (
                <>
                  {/* Result card */}
                  <div
                    className={`rounded-3xl border p-6 space-y-4 ${
                      gained
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white/50 text-xs font-black uppercase tracking-widest">
                          Resultado
                        </span>
                        <div className="text-white font-black text-xl mt-1">{option.label}</div>
                      </div>
                      <div className="text-4xl">{getMultiplierEmoji(option.multiplier)}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-white/40 text-xs font-black uppercase tracking-widest">
                          Tenías
                        </div>
                        <div className="text-white font-black text-lg">{formatMXN(amountBefore)}</div>
                      </div>
                      <div className="flex-1 text-center text-2xl">
                        {gained ? '→ 📈 →' : '→ 📉 →'}
                      </div>
                      <div className="text-center">
                        <div className="text-white/40 text-xs font-black uppercase tracking-widest">
                          Ahora tienes
                        </div>
                        <div
                          className={`font-black text-xl ${gained ? 'text-emerald-300' : 'text-red-300'}`}
                        >
                          {formatMXN(amountAfter)}
                        </div>
                      </div>
                    </div>

                    {/* Diff */}
                    <div
                      className={`rounded-2xl px-4 py-2 text-center ${
                        gained ? 'bg-emerald-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      <span
                        className={`font-black text-lg ${gained ? 'text-emerald-300' : 'text-red-300'}`}
                      >
                        {gained ? '+' : ''}{formatMXN(diff)} ({getMultiplierLabel(option.multiplier)})
                      </span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📚</span>
                      <span className="text-white/50 font-black text-xs uppercase tracking-widest">
                        ¿Por qué pasó esto?
                      </span>
                    </div>
                    <p className="text-white/80 font-bold leading-relaxed text-sm md:text-base">
                      {option.explanation}
                    </p>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-base transition-all duration-200 shadow-lg shadow-purple-900/50 min-h-[56px]"
                  >
                    {crisisIndex >= crises.length - 1
                      ? '🏁 Ver Resultados Finales'
                      : `⏩ Siguiente Crisis (${crises[crisisIndex + 1]?.year})`}
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
