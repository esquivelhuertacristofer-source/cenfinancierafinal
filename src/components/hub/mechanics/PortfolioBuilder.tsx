'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── CONTENT SHAPE ──────────────────────────────────────────────────────────

interface StageChoice {
  label: string;
  description: string;
  monthly_income_delta: number;
  monthly_expense_delta: number;
  annual_savings_rate: number;
  annual_return: number;
}

interface Stage {
  age_start: number;
  age_end: number;
  title: string;
  emoji: string;
  description: string;
  choices: StageChoice[];
}

interface PortfolioContent {
  stages: Stage[];
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function formatMXN(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}k`;
  }
  return `$${Math.round(value).toLocaleString('es-MX')}`;
}

interface NetWorthPoint {
  age: number;
  netWorth: number;
}

function projectNetWorth(
  choices: (StageChoice | null)[],
  stages: Stage[],
  savingsSlider: number,
  startingNetWorth = 0
): NetWorthPoint[] {
  const points: NetWorthPoint[] = [];
  let netWorth = startingNetWorth;
  let monthlyIncome = 0;
  let monthlyExpenses = 0;
  let annualReturn = 0.06;
  let savingsRate = 0.1;

  points.push({ age: 15, netWorth: 0 });

  stages.forEach((stage, stageIdx) => {
    const choice = choices[stageIdx];
    if (choice) {
      monthlyIncome += choice.monthly_income_delta;
      monthlyExpenses += choice.monthly_expense_delta;
      savingsRate = stageIdx === stages.length - 1
        ? savingsSlider / 100
        : choice.annual_savings_rate;
      annualReturn = choice.annual_return;
    }

    const years = stage.age_end - stage.age_start;
    for (let y = 1; y <= years; y++) {
      const income = monthlyIncome * 12;
      const expenses = monthlyExpenses * 12;
      const disposable = income - expenses;
      const saved = Math.max(0, disposable * savingsRate);
      netWorth = netWorth * (1 + annualReturn) + saved;
      points.push({ age: stage.age_start + y, netWorth: Math.max(0, netWorth) });
    }
  });

  return points;
}

function pickBestChoice(stage: Stage): StageChoice | null {
  if (!stage.choices || stage.choices.length === 0) return null;
  return stage.choices.reduce((a, b) =>
    (b.monthly_income_delta - b.monthly_expense_delta) * b.annual_savings_rate + b.annual_return >
    (a.monthly_income_delta - a.monthly_expense_delta) * a.annual_savings_rate + a.annual_return
      ? b : a
  );
}

function pickWorstChoice(stage: Stage): StageChoice | null {
  if (!stage.choices || stage.choices.length === 0) return null;
  return stage.choices.reduce((a, b) =>
    (b.monthly_income_delta - b.monthly_expense_delta) * b.annual_savings_rate + b.annual_return <
    (a.monthly_income_delta - a.monthly_expense_delta) * a.annual_savings_rate + a.annual_return
      ? b : a
  );
}

function computeBestWorst(stages: Stage[]): { best: number; worst: number } {
  const bestChoices = stages.map(pickBestChoice);
  const worstChoices = stages.map(pickWorstChoice);

  const bestPoints = projectNetWorth(bestChoices, stages, 80);
  const worstPoints = projectNetWorth(worstChoices, stages, 10);

  return {
    best: bestPoints[bestPoints.length - 1]?.netWorth ?? 0,
    worst: worstPoints[worstPoints.length - 1]?.netWorth ?? 0,
  };
}

// ─── MINI LINE CHART (pure SVG, no d3) ───────────────────────────────────────

interface LineChartProps {
  points: NetWorthPoint[];
  bestPoints: NetWorthPoint[];
  worstPoints: NetWorthPoint[];
  currentAge: number;
}

function LineChart({ points, bestPoints, worstPoints, currentAge }: LineChartProps) {
  const W = 600;
  const H = 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const allValues = [...points, ...bestPoints, ...worstPoints].map(p => p.netWorth);
  const minAge = 15;
  const maxAge = 30;
  const maxVal = Math.max(...allValues, 1);

  const toX = (age: number) => PAD.left + ((age - minAge) / (maxAge - minAge)) * innerW;
  const toY = (val: number) => PAD.top + innerH - (val / maxVal) * innerH;

  const pathD = (pts: NetWorthPoint[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.age).toFixed(1)},${toY(p.netWorth).toFixed(1)}`).join(' ');

  const areaD = (pts: NetWorthPoint[]) => {
    if (pts.length === 0) return '';
    const line = pathD(pts);
    const lastX = toX(pts[pts.length - 1].age);
    const firstX = toX(pts[0].age);
    const baseY = toY(0);
    return `${line} L${lastX},${baseY} L${firstX},${baseY} Z`;
  };

  const yTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];
  const ageTicks = [15, 18, 20, 22, 25, 28, 30];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ overflow: 'visible' }}
      aria-label="Gráfica de patrimonio neto proyectado"
    >
      <defs>
        <linearGradient id="pb-main-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
        <filter id="pb-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            y1={toY(v)}
            x2={PAD.left + innerW}
            y2={toY(v)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={toY(v) + 4}
            textAnchor="end"
            fill="rgba(255,255,255,0.3)"
            fontSize="10"
            fontFamily="sans-serif"
          >
            {formatMXN(v)}
          </text>
        </g>
      ))}

      {/* Age ticks */}
      {ageTicks.map(age => (
        <g key={age}>
          <line
            x1={toX(age)}
            y1={PAD.top}
            x2={toX(age)}
            y2={PAD.top + innerH}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={toX(age)}
            y={PAD.top + innerH + 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="10"
            fontFamily="sans-serif"
          >
            {age}
          </text>
        </g>
      ))}

      {/* Worst scenario */}
      {worstPoints.length > 1 && (
        <path
          d={pathD(worstPoints)}
          fill="none"
          stroke="rgba(239,68,68,0.3)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
      )}

      {/* Best scenario */}
      {bestPoints.length > 1 && (
        <path
          d={pathD(bestPoints)}
          fill="none"
          stroke="rgba(52,211,153,0.4)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
      )}

      {/* Main area fill */}
      {points.length > 1 && (
        <path d={areaD(points)} fill="url(#pb-main-grad)" />
      )}

      {/* Main line */}
      {points.length > 1 && (
        <path
          d={pathD(points)}
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#pb-glow)"
        />
      )}

      {/* Current age indicator */}
      {currentAge > 15 && currentAge <= 30 && points.length > 0 && (
        <>
          <line
            x1={toX(currentAge)}
            y1={PAD.top}
            x2={toX(currentAge)}
            y2={PAD.top + innerH}
            stroke="rgba(168,85,247,0.6)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {(() => {
            const pt = points.find(p => p.age === currentAge) ?? points[points.length - 1];
            return (
              <circle
                cx={toX(pt.age)}
                cy={toY(pt.netWorth)}
                r="5"
                fill="#a855f7"
                stroke="#fff"
                strokeWidth="2"
                filter="url(#pb-glow)"
              />
            );
          })()}
        </>
      )}

      {/* Legend */}
      <g transform={`translate(${PAD.left + innerW - 140}, ${PAD.top})`}>
        <line x1="0" y1="6" x2="16" y2="6" stroke="#a855f7" strokeWidth="2" />
        <text x="20" y="10" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif">Tu trayectoria</text>
        <line x1="0" y1="22" x2="16" y2="22" stroke="rgba(52,211,153,0.6)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="20" y="26" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="sans-serif">Mejor escenario</text>
        <line x1="0" y1="38" x2="16" y2="38" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="20" y="42" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="sans-serif">Peor escenario</text>
      </g>
    </svg>
  );
}

// ─── COMPOUND INTEREST EXPLAINER ─────────────────────────────────────────────

interface CompoundExplainerProps {
  savingsRate: number;
  annualReturn: number;
  monthlyIncome: number;
}

function futureValueOfAnnuity(monthlyContribution: number, annualReturn: number, years: number): number {
  // Guard against division by zero when a choice has 0% annual return —
  // the compound-interest formula degenerates to simple accumulation in that case.
  if (Math.abs(annualReturn) < 1e-9) {
    return monthlyContribution * 12 * years;
  }
  return monthlyContribution * 12 * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
}

function CompoundExplainer({ savingsRate, annualReturn, monthlyIncome }: CompoundExplainerProps) {
  const monthly = monthlyIncome * savingsRate;
  const now5 = futureValueOfAnnuity(monthly, annualReturn, 5);
  const later5 = futureValueOfAnnuity(monthly, annualReturn, 3);
  const diff = now5 - later5;

  if (monthly <= 0) return null;

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-purple-900/20 p-4 text-xs space-y-2">
      <p className="text-purple-300 font-black uppercase tracking-widest text-xs">
        ⚡ El poder del interés compuesto
      </p>
      <p className="text-white/70 leading-relaxed">
        Si inviertes <span className="text-emerald-300 font-black">{formatMXN(monthly)}/mes</span> HOY,
        en 5 años tendrás <span className="text-emerald-300 font-black">{formatMXN(now5)}</span>.
        Si esperas 2 años, perderás <span className="text-red-300 font-black">~{formatMXN(Math.max(0, diff))}</span> de ganancia potencial.
      </p>
    </div>
  );
}

// ─── SCREEN TYPES ────────────────────────────────────────────────────────────

type Screen = 'start' | 'game' | 'results';

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PortfolioBuilder({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = activity.content as unknown as PortfolioContent;
  const stages: Stage[] = content?.stages ?? [];

  const [screen, setScreen] = useState<Screen>('start');
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<(StageChoice | null)[]>(
    () => stages.map(() => null)
  );
  const [savingsSlider, setSavingsSlider] = useState(20);
  const [choiceAnimKey, setChoiceAnimKey] = useState(0);
  const [showChoiceFeedback, setShowChoiceFeedback] = useState(false);
  const [feedbackChoice, setFeedbackChoice] = useState<StageChoice | null>(null);
  const [netWorthPoints, setNetWorthPoints] = useState<NetWorthPoint[]>([{ age: 15, netWorth: 0 }]);
  const [bestPoints, setBestPoints] = useState<NetWorthPoint[]>([]);
  const [worstPoints, setWorstPoints] = useState<NetWorthPoint[]>([]);
  const [finalNetWorth, setFinalNetWorth] = useState(0);
  const [score, setScore] = useState(0);

  // Guards against timer leaks and duplicate onComplete/XP calls.
  const pendingChoiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (pendingChoiceTimeoutRef.current) {
        clearTimeout(pendingChoiceTimeoutRef.current);
      }
    };
  }, []);

  const currentStage = stages[currentStageIdx];
  const isLastStage = currentStageIdx === stages.length - 1;

  // Pre-compute best/worst for the chart reference lines
  useEffect(() => {
    if (stages.length === 0) return;
    const { best, worst } = computeBestWorst(stages);

    // Fill best/worst full trajectories for reference
    const bestChoicesFull = stages.map(pickBestChoice);
    const worstChoicesFull = stages.map(pickWorstChoice);

    setBestPoints(projectNetWorth(bestChoicesFull, stages, 80));
    setWorstPoints(projectNetWorth(worstChoicesFull, stages, 10));
  }, [stages]);

  // Recompute net worth whenever choices or savings slider change
  useEffect(() => {
    const pts = projectNetWorth(selectedChoices, stages, savingsSlider);
    setNetWorthPoints(pts);
  }, [selectedChoices, stages, savingsSlider]);

  const handleChoiceSelect = useCallback(
    (choice: StageChoice) => {
      setFeedbackChoice(choice);
      setShowChoiceFeedback(true);

      if (pendingChoiceTimeoutRef.current) {
        clearTimeout(pendingChoiceTimeoutRef.current);
      }
      pendingChoiceTimeoutRef.current = setTimeout(() => {
        pendingChoiceTimeoutRef.current = null;
        const newChoices = [...selectedChoices];
        newChoices[currentStageIdx] = choice;
        setSelectedChoices(newChoices);
        setShowChoiceFeedback(false);
        setChoiceAnimKey(k => k + 1);

        if (!isLastStage) {
          setCurrentStageIdx(i => i + 1);
        }
      }, 1200);
    },
    [selectedChoices, currentStageIdx, isLastStage]
  );

  const handleFinishGame = useCallback(() => {
    const pts = projectNetWorth(selectedChoices, stages, savingsSlider);
    const final = pts[pts.length - 1]?.netWorth ?? 0;

    const bestChoicesFull = stages.map(pickBestChoice);
    const bestFinal = projectNetWorth(bestChoicesFull, stages, 80);
    const bestMax = bestFinal[bestFinal.length - 1]?.netWorth ?? 1;

    const pct = Math.min(1, final / Math.max(bestMax, 1));
    const computedScore = Math.round(pct * 100);

    setFinalNetWorth(final);
    setScore(computedScore);
    setScreen('results');
  }, [selectedChoices, stages, savingsSlider]);

  const lastDecidedAge = (() => {
    let age = 15;
    for (let i = 0; i < selectedChoices.length; i++) {
      if (selectedChoices[i] !== null) {
        age = stages[i]?.age_end ?? age;
      }
    }
    return age;
  })();

  const currentNetWorth = netWorthPoints[netWorthPoints.length - 1]?.netWorth ?? 0;

  // ── MONTHLY INCOME for compound explainer
  let totalMonthlyIncome = 0;
  let totalAnnualReturn = 0.06;
  selectedChoices.forEach(c => {
    if (c) {
      totalMonthlyIncome += c.monthly_income_delta;
      totalAnnualReturn = c.annual_return;
    }
  });

  // ── SCORE LABEL
  const scoreLabel =
    score >= 90
      ? '🏆 Genio Financiero'
      : score >= 70
      ? '⭐ Excelente Estratega'
      : score >= 50
      ? '💪 Buen Comienzo'
      : '📚 Hay Espacio para Crecer';

  const scoreBg =
    score >= 90
      ? 'from-yellow-500/20 to-yellow-900/10 border-yellow-400/30'
      : score >= 70
      ? 'from-emerald-500/20 to-emerald-900/10 border-emerald-400/30'
      : score >= 50
      ? 'from-blue-500/20 to-blue-900/10 border-blue-400/30'
      : 'from-purple-500/20 to-purple-900/10 border-purple-400/30';

  // ── BEST/WORST FINAL VALUES for result comparison
  const bestFinalVal = bestPoints[bestPoints.length - 1]?.netWorth ?? 0;
  const worstFinalVal = worstPoints[worstPoints.length - 1]?.netWorth ?? 0;

  // ─── START SCREEN ──────────────────────────────────────────────────────────

  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full text-center space-y-8">
          {/* Big emoji hero */}
          <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
            🗺️
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-purple-400">
              Secundaria 3 — Finanzas
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Portfolio Builder
            </h1>
            <p className="text-lg font-bold text-purple-300">
              Tu Mapa Financiero de Vida
            </p>
          </div>

          {/* Intro card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left space-y-4">
            <p className="text-white font-bold text-lg leading-relaxed">
              💬 Tienes{' '}
              <span className="text-purple-300 font-black">15 años</span>.
              Cada decisión que tomes ahora va a afectar tu patrimonio a los{' '}
              <span className="text-emerald-300 font-black">30</span>.
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              Vas a tomar decisiones reales sobre estudios, trabajo, dónde vivir
              e inversiones. La gráfica cambiará en tiempo real con cada elección.
            </p>
            <p className="text-white font-black text-base">
              ¿Estás listo para construir tu futuro? 🚀
            </p>
          </div>

          {/* What to expect */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🎓', label: 'Decisiones reales' },
              { emoji: '📈', label: 'Gráfica en vivo' },
              { emoji: '💰', label: 'Interés compuesto' },
              { emoji: '🏆', label: 'Compara escenarios' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-white/70 text-xs font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setScreen('game')}
            className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest px-6 py-4 text-sm transition-all duration-300 min-h-[56px] shadow-lg shadow-purple-900/40"
          >
            ¡Comenzar mi viaje! 🗺️
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ────────────────────────────────────────────────────────

  if (screen === 'results') {
    const bestDiff = bestFinalVal - finalNetWorth;
    const worstDiff = finalNetWorth - worstFinalVal;

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full space-y-6 py-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-6xl mb-2">
              {score >= 70 ? '🏆' : score >= 50 ? '⭐' : '📚'}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Tu Resultado a los 30 años
            </h1>
            <p className="text-purple-300 font-bold">{scoreLabel}</p>
          </div>

          {/* Score ring + patrimony */}
          <div className={`rounded-3xl border bg-gradient-to-br p-6 ${scoreBg} text-center space-y-2`}>
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              Patrimonio Neto Proyectado a los 30
            </p>
            <p className="text-5xl md:text-6xl font-black text-white">
              {formatMXN(finalNetWorth)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div
                className="h-3 rounded-full bg-purple-500 transition-all duration-700"
                style={{ width: `${score}%`, maxWidth: '200px' }}
              />
              <span className="text-white font-black text-sm">{score}/100</span>
            </div>
          </div>

          {/* Comparison bars */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-white font-black text-base uppercase tracking-widest">
              📊 Comparación de Escenarios
            </h2>

            {[
              {
                label: '🟢 Mejor escenario posible',
                value: bestFinalVal,
                pct: 100,
                color: 'bg-emerald-500',
              },
              {
                label: '🟣 Tu trayectoria',
                value: finalNetWorth,
                pct: Math.round((finalNetWorth / Math.max(bestFinalVal, 1)) * 100),
                color: 'bg-purple-500',
              },
              {
                label: '🔴 Peor escenario',
                value: worstFinalVal,
                pct: Math.round((worstFinalVal / Math.max(bestFinalVal, 1)) * 100),
                color: 'bg-red-500',
              },
            ].map(row => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-xs font-bold">{row.label}</span>
                  <span className="text-white font-black text-xs">{formatMXN(row.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color} transition-all duration-700`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Key lessons */}
          <div className="rounded-3xl border border-purple-500/30 bg-purple-900/20 p-6 space-y-3">
            <h2 className="text-purple-300 font-black text-base uppercase tracking-widest">
              ⚡ La Lección Clave: Interés Compuesto
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              La diferencia entre el mejor y el peor escenario es de{' '}
              <span className="text-emerald-300 font-black">
                {formatMXN(Math.max(0, bestFinalVal - worstFinalVal))}
              </span>
              . Esto se debe principalmente a{' '}
              <span className="text-purple-300 font-black">cuándo empezaste a invertir</span>{' '}
              y cuánto ahorraste cada mes.
            </p>
            {bestDiff > 0 && (
              <p className="text-white/70 text-sm leading-relaxed">
                Con mejores decisiones podrías haber acumulado{' '}
                <span className="text-emerald-300 font-black">{formatMXN(bestDiff)}</span>{' '}
                más. ¡El tiempo es tu activo más valioso! ⏰
              </p>
            )}
            {worstDiff > 0 && (
              <p className="text-white/70 text-sm leading-relaxed">
                Tus decisiones te pusieron{' '}
                <span className="text-emerald-300 font-black">{formatMXN(worstDiff)}</span>{' '}
                por encima del peor escenario. ¡Bien hecho! 💪
              </p>
            )}
          </div>

          {/* Decisions recap */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h2 className="text-white font-black text-base uppercase tracking-widest">
              🗺️ Tus Decisiones
            </h2>
            {stages.map((stage, idx) => {
              const choice = selectedChoices[idx];
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-2xl">{stage.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                      {stage.age_start}–{stage.age_end} años · {stage.title}
                    </p>
                    <p className="text-white font-bold text-sm truncate">
                      {choice?.label ?? '—'}
                    </p>
                    {idx === stages.length - 1 && (
                      <p className="text-purple-300 text-xs font-bold">
                        Ahorro: {savingsSlider}% del ingreso
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Finalizar button */}
          <button
            onClick={() => {
              if (hasFinishedRef.current) return;
              hasFinishedRef.current = true;
              onComplete(score);
            }}
            className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest px-6 py-4 text-sm transition-all duration-300 min-h-[56px] shadow-lg shadow-purple-900/40"
          >
            Finalizar 🎓
          </button>
        </div>
      </div>
    );
  }

  // ─── GAME SCREEN ───────────────────────────────────────────────────────────

  const allChosen = selectedChoices.every(c => c !== null);
  const stageCompleted = selectedChoices[currentStageIdx] !== null;

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full p-4 md:p-6 flex flex-col gap-5 pb-8">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-purple-400">
              Portfolio Builder
            </p>
            <p className="text-white/50 text-xs font-bold">
              Etapa {currentStageIdx + 1} de {stages.length}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {stages.map((s, idx) => (
              <div
                key={idx}
                title={s.title}
                className={`transition-all duration-300 rounded-full flex items-center justify-center text-base
                  ${idx < currentStageIdx || selectedChoices[idx] !== null
                    ? 'w-8 h-8 bg-purple-600 shadow-lg shadow-purple-900/50'
                    : idx === currentStageIdx
                    ? 'w-8 h-8 bg-purple-500/40 border-2 border-purple-400 animate-pulse'
                    : 'w-6 h-6 bg-white/10 border border-white/10'
                  }`}
              >
                {(idx < currentStageIdx || selectedChoices[idx] !== null) ? '✓' : (idx === currentStageIdx ? s.emoji : '')}
              </div>
            ))}
          </div>

          {/* Current net worth badge */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-900/30 px-3 py-2 text-right">
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Patrimonio</p>
            <p className="text-purple-300 font-black text-base">{formatMXN(currentNetWorth)}</p>
          </div>
        </div>

        {/* PERSISTENT CHART */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              📈 Patrimonio Neto Proyectado — Edad 15→30
            </p>
            <p className="text-purple-300 font-black text-sm">{formatMXN(currentNetWorth)}</p>
          </div>
          <div style={{ height: '200px' }}>
            <LineChart
              points={netWorthPoints}
              bestPoints={bestPoints}
              worstPoints={worstPoints}
              currentAge={lastDecidedAge}
            />
          </div>
        </div>

        {/* Compound interest explainer — shows when relevant */}
        {totalMonthlyIncome > 0 && (
          <CompoundExplainer
            savingsRate={savingsSlider / 100}
            annualReturn={totalAnnualReturn}
            monthlyIncome={totalMonthlyIncome}
          />
        )}

        {/* STAGE CARD */}
        {currentStage && (
          <div
            key={`stage-${currentStageIdx}-${choiceAnimKey}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 space-y-4"
            style={{ animation: 'pb-fadein 0.4s ease' }}
          >
            {/* Stage header */}
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentStage.emoji}</div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  Edad {currentStage.age_start}–{currentStage.age_end}
                </p>
                <h2 className="text-white font-black text-lg md:text-xl">
                  {currentStage.title}
                </h2>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              {currentStage.description}
            </p>

            {/* Savings slider — only for last stage */}
            {isLastStage && (
              <div className="space-y-3 rounded-2xl border border-purple-500/20 bg-purple-900/20 p-4">
                <div className="flex justify-between items-center">
                  <p className="text-purple-300 font-black text-sm uppercase tracking-widest">
                    💰 ¿Cuánto ahorras?
                  </p>
                  <p className="text-white font-black text-xl">{savingsSlider}%</p>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={savingsSlider}
                  onChange={e => setSavingsSlider(Number(e.target.value))}
                  className="w-full h-3 rounded-full cursor-pointer accent-purple-500"
                  style={{ accentColor: '#a855f7' }}
                />
                <div className="flex justify-between text-white/30 text-xs font-bold">
                  <span>5% (mínimo)</span>
                  <span>30% (recomendado)</span>
                  <span>50% (máximo)</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Los expertos recomiendan ahorrar al menos el{' '}
                  <span className="text-purple-300 font-black">20%</span> de tus ingresos.
                  {savingsSlider < 15
                    ? ' ⚠️ Con menos del 15% te costará mucho alcanzar tus metas.'
                    : savingsSlider >= 30
                    ? ' 🌟 ¡Excelente! Alta tasa de ahorro = más libertad financiera.'
                    : ' ✅ Buen balance entre ahorro y calidad de vida.'}
                </p>
              </div>
            )}

            {/* Choice feedback overlay */}
            {showChoiceFeedback && feedbackChoice && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/20 p-4 text-center space-y-2"
                style={{ animation: 'pb-fadein 0.3s ease' }}>
                <div className="text-3xl">✅</div>
                <p className="text-emerald-300 font-black text-base">{feedbackChoice.label}</p>
                <p className="text-white/60 text-xs leading-relaxed">{feedbackChoice.description}</p>
                {feedbackChoice.monthly_income_delta > 0 && (
                  <p className="text-emerald-300 text-xs font-bold">
                    +{formatMXN(feedbackChoice.monthly_income_delta)}/mes de ingreso adicional
                  </p>
                )}
                {feedbackChoice.monthly_expense_delta > 0 && (
                  <p className="text-red-300 text-xs font-bold">
                    +{formatMXN(feedbackChoice.monthly_expense_delta)}/mes de gasto adicional
                  </p>
                )}
              </div>
            )}

            {/* Choices */}
            {!showChoiceFeedback && !stageCompleted && (
              <div className="grid grid-cols-1 gap-3">
                {currentStage.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoiceSelect(choice)}
                    className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-purple-900/30 hover:border-purple-500/40 transition-all duration-300 p-4 min-h-[56px] group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/20 flex items-center justify-center text-purple-300 font-black text-xs flex-shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:border-purple-400 transition-all duration-300">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-sm">{choice.label}</p>
                        <p className="text-white/50 text-xs mt-1 leading-relaxed">{choice.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {choice.monthly_income_delta !== 0 && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${choice.monthly_income_delta > 0 ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'}`}>
                              {choice.monthly_income_delta > 0 ? '+' : ''}{formatMXN(choice.monthly_income_delta)}/mes
                            </span>
                          )}
                          {choice.monthly_expense_delta !== 0 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-900/40 text-red-300">
                              -{formatMXN(choice.monthly_expense_delta)}/mes gasto
                            </span>
                          )}
                          {choice.annual_return > 0 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300">
                              {(choice.annual_return * 100).toFixed(0)}% retorno anual
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Stage completed — show next or finish button */}
            {stageCompleted && !showChoiceFeedback && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-purple-500/20 bg-purple-900/20 p-4 flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-white font-black text-sm">{selectedChoices[currentStageIdx]?.label}</p>
                    <p className="text-white/50 text-xs">{selectedChoices[currentStageIdx]?.description}</p>
                  </div>
                </div>

                {!isLastStage && !allChosen && (
                  <button
                    onClick={() => {
                      setCurrentStageIdx(i => i + 1);
                      setChoiceAnimKey(k => k + 1);
                    }}
                    className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest px-6 py-4 text-sm transition-all duration-300 min-h-[56px]"
                  >
                    Siguiente etapa →
                  </button>
                )}

                {(isLastStage || allChosen) && (
                  <button
                    onClick={handleFinishGame}
                    className="w-full rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest px-6 py-4 text-sm transition-all duration-300 min-h-[56px] shadow-lg shadow-purple-900/40 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  >
                    Ver mis resultados a los 30 años 🏆
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation — jump to any decided stage */}
        {selectedChoices.some(c => c !== null) && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">
              Revisar etapas
            </p>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage, idx) => {
                const decided = selectedChoices[idx] !== null;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (decided || idx <= currentStageIdx) {
                        setCurrentStageIdx(idx);
                        setChoiceAnimKey(k => k + 1);
                      }
                    }}
                    disabled={!decided && idx > currentStageIdx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200
                      ${currentStageIdx === idx
                        ? 'bg-purple-600 text-white'
                        : decided
                        ? 'bg-white/10 text-white/70 hover:bg-white/15'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                  >
                    <span>{stage.emoji}</span>
                    <span>{stage.age_start}–{stage.age_end}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CSS animation keyframes injected via style tag */}
      <style>{`
        @keyframes pb-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
