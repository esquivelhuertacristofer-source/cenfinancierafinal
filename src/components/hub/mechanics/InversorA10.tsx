'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── Types ───────────────────────────────────────────────────────────────────

interface InvestmentOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  base_return_monthly: number;
  risk_level: 'low' | 'medium' | 'high';
  color: string;
}

interface MonthlyEvent {
  month: number;
  description: string;
  emoji: string;
  affected_option_id: string;
  return_modifier: number;
}

interface InversorContent {
  starting_capital: number;
  months: number;
  options: InvestmentOption[];
  events: MonthlyEvent[];
}

type Screen = 'start' | 'allocate' | 'simulation' | 'rebalance' | 'results';

interface PortfolioSnapshot {
  month: number;
  total: number;
  breakdown: Record<string, number>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RISK_LABELS: Record<string, string> = {
  low: 'Bajo riesgo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
};

const RISK_COLORS: Record<string, string> = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-red-300',
};

const RISK_BG: Record<string, string> = {
  low: 'bg-emerald-500/20 border-emerald-500/40',
  medium: 'bg-amber-500/20 border-amber-400/40',
  high: 'bg-red-500/20 border-red-500/40',
};

const OPTION_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
};

const OPTION_TEXT_COLORS: Record<string, string> = {
  emerald: 'text-emerald-300',
  blue: 'text-blue-300',
  amber: 'text-amber-300',
  purple: 'text-purple-300',
  red: 'text-red-300',
  cyan: 'text-cyan-300',
  pink: 'text-pink-300',
  indigo: 'text-indigo-300',
};

const OPTION_BAR_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-400',
  blue: 'bg-blue-400',
  amber: 'bg-amber-400',
  purple: 'bg-purple-400',
  red: 'bg-red-400',
  cyan: 'bg-cyan-400',
  pink: 'bg-pink-400',
  indigo: 'bg-indigo-400',
};

function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

function getBarColor(optionColor: string): string {
  return OPTION_BAR_COLORS[optionColor] ?? 'bg-purple-400';
}

function getTextColor(optionColor: string): string {
  return OPTION_TEXT_COLORS[optionColor] ?? 'text-purple-300';
}

// ─── Mini Line Chart (pure CSS/SVG, no external libs) ─────────────────────────

interface LineChartProps {
  portfolioHistory: PortfolioSnapshot[];
  baselineHistory: number[];
  startingCapital: number;
}

function LineChart({ portfolioHistory, baselineHistory, startingCapital }: LineChartProps) {
  if (portfolioHistory.length < 2) return null;

  const width = 320;
  const height = 140;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const allValues = [
    ...portfolioHistory.map((s) => s.total),
    ...baselineHistory,
    startingCapital,
  ];
  const minVal = Math.min(...allValues) * 0.97;
  const maxVal = Math.max(...allValues) * 1.03;
  const valueRange = maxVal - minVal;

  const toX = (i: number, total: number) => padL + (i / (total - 1)) * chartW;
  const toY = (v: number) =>
    padT + chartH - (valueRange > 0 ? ((v - minVal) / valueRange) * chartH : chartH / 2);

  const portfolioPoints = portfolioHistory.map((s, i) => `${toX(i, portfolioHistory.length)},${toY(s.total)}`).join(' ');
  const baselinePoints = baselineHistory.map((v, i) => `${toX(i, baselineHistory.length)},${toY(v)}`).join(' ');

  const finalPortfolio = portfolioHistory[portfolioHistory.length - 1].total;
  const finalBaseline = baselineHistory[baselineHistory.length - 1];
  const portfolioWins = finalPortfolio >= finalBaseline;

  // Y-axis ticks
  const ticks = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <svg width={width} height={height} className="w-full max-w-xs mx-auto">
      {/* Grid lines */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={padL}
          y1={toY(t)}
          x2={width - padR}
          y2={toY(t)}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Y labels */}
      {ticks.map((t, i) => (
        <text
          key={i}
          x={padL - 4}
          y={toY(t) + 4}
          textAnchor="end"
          fontSize="9"
          fill="rgba(255,255,255,0.4)"
        >
          ${Math.round(t)}
        </text>
      ))}
      {/* X labels */}
      {portfolioHistory.map((s, i) => (
        <text
          key={i}
          x={toX(i, portfolioHistory.length)}
          y={height - 4}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(255,255,255,0.4)"
        >
          M{s.month}
        </text>
      ))}
      {/* Baseline (alcancía) */}
      <polyline
        points={baselinePoints}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      {/* Portfolio line */}
      <polyline
        points={portfolioPoints}
        fill="none"
        stroke={portfolioWins ? '#34d399' : '#f87171'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots on portfolio */}
      {portfolioHistory.map((s, i) => (
        <circle
          key={i}
          cx={toX(i, portfolioHistory.length)}
          cy={toY(s.total)}
          r="4"
          fill={portfolioWins ? '#34d399' : '#f87171'}
          stroke="#0a0a1a"
          strokeWidth="1.5"
        />
      ))}
      {/* Legend */}
      <line x1={padL} y1={height - 16} x2={padL + 14} y2={height - 16} stroke={portfolioWins ? '#34d399' : '#f87171'} strokeWidth="2.5" />
      <text x={padL + 18} y={height - 12} fontSize="8" fill="rgba(255,255,255,0.7)">Tu portafolio</text>
      <line x1={padL + 90} y1={height - 16} x2={padL + 104} y2={height - 16} stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="3 2" />
      <text x={padL + 108} y={height - 12} fontSize="8" fill="rgba(255,255,255,0.5)">Solo alcancía</text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InversorA10({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = (activity as unknown as { content: InversorContent }).content;
  const { starting_capital, months, options, events } = content;

  // ── State ──
  const [screen, setScreen] = useState<Screen>('start');
  const [allocation, setAllocation] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    options.forEach((o) => (init[o.id] = 0));
    return init;
  });
  const [currentMonth, setCurrentMonth] = useState(0);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<PortfolioSnapshot[]>([]);
  const [baselineHistory, setBaselineHistory] = useState<number[]>([]);
  const [activeEvent, setActiveEvent] = useState<MonthlyEvent | null>(null);
  const [showEventBanner, setShowEventBanner] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasRebalanced, setHasRebalanced] = useState(false);
  const [rebalanceAllocation, setRebalanceAllocation] = useState<Record<string, number>>({});
  const [finalScore, setFinalScore] = useState(0);
  const [pulsingOptionId, setPulsingOptionId] = useState<string | null>(null);
  // Two separate timeout refs: one for hiding the event banner, one for the
  // month-advance completion. They used to share a single ref, which meant
  // the second assignment silently overwrote the first and its timeout could
  // never be cleared on unmount.
  const eventBannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFinishedRef = useRef(false);

  // ── Derived ──
  const totalAllocated = Object.values(allocation).reduce((a, b) => a + b, 0);
  const remaining = starting_capital - totalAllocated;
  const allocationValid = Math.abs(remaining) < 1;

  const totalPortfolio = Object.values(portfolio).reduce((a, b) => a + b, 0);

  // ── Score calculation ──
  // Guards against a zero starting_capital (division by zero → NaN) and
  // floors the result at 0 so onComplete always receives an honest 0-100
  // value even if the simulated portfolio somehow ended up at/below zero.
  const computeFinalScore = useCallback(
    (total: number): number => {
      if (!starting_capital || starting_capital <= 0) return 0;
      return Math.max(0, Math.min(100, Math.round((total / starting_capital) * 80)));
    },
    [starting_capital]
  );

  // ── Allocation helpers ──
  const setOptionAllocation = useCallback(
    (id: string, value: number) => {
      setAllocation((prev) => {
        const newVal = Math.max(0, Math.min(value, starting_capital));
        const newAlloc = { ...prev, [id]: newVal };
        const newTotal = Object.values(newAlloc).reduce((a, b) => a + b, 0);
        if (newTotal > starting_capital) {
          const excess = newTotal - starting_capital;
          newAlloc[id] = Math.max(0, newVal - excess);
        }
        return newAlloc;
      });
    },
    [starting_capital]
  );

  const distributeEvenly = useCallback(() => {
    const share = Math.floor(starting_capital / options.length);
    const remainder = starting_capital - share * options.length;
    const newAlloc: Record<string, number> = {};
    options.forEach((o, i) => {
      newAlloc[o.id] = share + (i === 0 ? remainder : 0);
    });
    setAllocation(newAlloc);
  }, [options, starting_capital]);

  const allocateAll = useCallback(
    (targetId: string) => {
      const newAlloc: Record<string, number> = {};
      options.forEach((o) => {
        newAlloc[o.id] = o.id === targetId ? starting_capital : 0;
      });
      setAllocation(newAlloc);
    },
    [options, starting_capital]
  );

  // ── Start simulation ──
  const startSimulation = useCallback(() => {
    const initialPortfolio: Record<string, number> = {};
    options.forEach((o) => {
      initialPortfolio[o.id] = allocation[o.id] ?? 0;
    });
    setPortfolio(initialPortfolio);
    const snapshot: PortfolioSnapshot = {
      month: 0,
      total: starting_capital,
      breakdown: { ...initialPortfolio },
    };
    setHistory([snapshot]);
    setBaselineHistory([starting_capital]);
    setCurrentMonth(0);
    setScreen('simulation');
  }, [allocation, options, starting_capital]);

  // ── Simulate one month ──
  const simulateMonth = useCallback(
    (
      currentPortfolio: Record<string, number>,
      monthNumber: number,
      currentEvents: MonthlyEvent[],
      currentOptions: InvestmentOption[]
    ): { newPortfolio: Record<string, number>; event: MonthlyEvent | null } => {
      const event = currentEvents.find((e) => e.month === monthNumber) ?? null;
      const newPortfolio: Record<string, number> = {};

      currentOptions.forEach((opt) => {
        const current = currentPortfolio[opt.id] ?? 0;
        let monthlyReturn = opt.base_return_monthly;

        // For high-risk options without an event, add some randomness
        if (opt.risk_level === 'high' && event?.affected_option_id !== opt.id) {
          // Small random fluctuation for high-risk options
          const rand = (Math.random() - 0.5) * 0.05;
          monthlyReturn += rand;
        }

        if (event && event.affected_option_id === opt.id) {
          monthlyReturn = monthlyReturn * event.return_modifier + monthlyReturn * (event.return_modifier - 1);
          // Simplified: just apply the modifier directly
          monthlyReturn = opt.base_return_monthly * event.return_modifier;
        }

        // Floor at 0: a simple non-leveraged investment can't be worth less
        // than nothing, but an extreme return_modifier could otherwise push
        // monthlyReturn below -1 and produce a negative balance.
        newPortfolio[opt.id] = Math.max(0, current * (1 + monthlyReturn));
      });

      return { newPortfolio, event };
    },
    []
  );

  // ── Advance month button ──
  const advanceMonth = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextMonth = currentMonth + 1;

    // Check if this is month 3 and rebalance hasn't been done
    if (nextMonth === 3 && !hasRebalanced) {
      // Set up rebalance allocation from current portfolio
      const totalCurrent = Object.values(portfolio).reduce((a, b) => a + b, 0);
      const rebalInit: Record<string, number> = {};
      options.forEach((o) => {
        rebalInit[o.id] = Math.round(portfolio[o.id] ?? 0);
      });
      setRebalanceAllocation(rebalInit);
      setCurrentMonth(nextMonth);
      setIsAnimating(false);
      setScreen('rebalance');
      return;
    }

    const { newPortfolio, event } = simulateMonth(portfolio, nextMonth, events, options);

    if (event) {
      setActiveEvent(event);
      setShowEventBanner(true);
      setPulsingOptionId(event.affected_option_id);
      eventBannerTimeoutRef.current = setTimeout(() => {
        setShowEventBanner(false);
        setPulsingOptionId(null);
      }, 3000);
    }

    setPortfolio(newPortfolio);
    setCurrentMonth(nextMonth);

    // Baseline: only alcancía (first option, 0% return)
    setBaselineHistory((prev) => [...prev, starting_capital]);

    const newTotal = Object.values(newPortfolio).reduce((a, b) => a + b, 0);
    const snapshot: PortfolioSnapshot = {
      month: nextMonth,
      total: newTotal,
      breakdown: { ...newPortfolio },
    };
    setHistory((prev) => [...prev, snapshot]);

    advanceTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      if (nextMonth >= months) {
        // Calculate score
        const score = computeFinalScore(newTotal);
        setFinalScore(score);
        setScreen('results');
      }
    }, event ? 3200 : 600);
  }, [
    isAnimating,
    currentMonth,
    hasRebalanced,
    portfolio,
    options,
    events,
    months,
    starting_capital,
    simulateMonth,
    computeFinalScore,
  ]);

  // ── Rebalance helpers ──
  const setRebalOption = useCallback(
    (id: string, value: number) => {
      setRebalanceAllocation((prev) => {
        const totalCurrent = Object.values(portfolio).reduce((a, b) => a + b, 0);
        const newVal = Math.max(0, Math.min(value, totalCurrent));
        const newAlloc = { ...prev, [id]: newVal };
        const newTotal = Object.values(newAlloc).reduce((a, b) => a + b, 0);
        if (newTotal > totalCurrent) {
          const excess = newTotal - totalCurrent;
          newAlloc[id] = Math.max(0, newVal - excess);
        }
        return newAlloc;
      });
    },
    [portfolio]
  );

  const confirmRebalance = useCallback(() => {
    const totalCurrent = Object.values(portfolio).reduce((a, b) => a + b, 0);
    const totalRebal = Object.values(rebalanceAllocation).reduce((a, b) => a + b, 0);
    // Normalize if needed
    const factor = totalCurrent / (totalRebal || 1);
    const normalized: Record<string, number> = {};
    options.forEach((o) => {
      normalized[o.id] = (rebalanceAllocation[o.id] ?? 0) * factor;
    });
    setPortfolio(normalized);
    setHasRebalanced(true);
    setScreen('simulation');
  }, [portfolio, rebalanceAllocation, options]);

  const skipRebalance = useCallback(() => {
    setHasRebalanced(true);
    setScreen('simulation');
  }, []);

  // Guard against onComplete firing more than once per attempt (double-click).
  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    onComplete(finalScore);
  }, [onComplete, finalScore]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      if (eventBannerTimeoutRef.current) clearTimeout(eventBannerTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  // ─── SCREEN: START ────────────────────────────────────────────────────────

  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-start p-4 pb-10">
        {/* Header */}
        <div className="text-center mt-6 mb-8">
          <div className="text-6xl mb-3 animate-bounce">💰</div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Inversor a los 10
          </h1>
          <p className="text-white/70 font-bold text-base max-w-sm mx-auto">
            ¡Tienes{' '}
            <span className="text-emerald-300 font-black">${starting_capital} pesos</span>{' '}
            virtuales! Invierte inteligente durante{' '}
            <span className="text-purple-300 font-black">{months} meses</span> y
            haz crecer tu dinero 🚀
          </p>
        </div>

        {/* Options preview */}
        <div className="w-full max-w-md space-y-3 mb-8">
          <h2 className="text-white/60 text-xs font-black uppercase tracking-widest text-center mb-4">
            Opciones de inversión
          </h2>
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`rounded-2xl border p-4 flex items-start gap-3 ${RISK_BG[opt.risk_level]}`}
            >
              <span className="text-3xl flex-shrink-0">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-black text-base">{opt.name}</span>
                  <span className={`text-xs font-bold ${RISK_COLORS[opt.risk_level]}`}>
                    {RISK_LABELS[opt.risk_level]}
                  </span>
                </div>
                <p className="text-white/60 text-xs font-bold leading-snug">
                  {opt.description}
                </p>
                {opt.base_return_monthly > 0 && (
                  <p className="text-white/40 text-xs mt-1">
                    Retorno mensual base:{' '}
                    <span className="text-emerald-400 font-black">
                      {(opt.base_return_monthly * 100).toFixed(2)}%
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setScreen('allocate')}
          className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black uppercase tracking-widest rounded-2xl px-8 py-4 text-lg transition-all duration-300 w-full max-w-md shadow-lg shadow-purple-900/50"
        >
          ¡Empezar a invertir! 💸
        </button>
      </div>
    );
  }

  // ─── SCREEN: ALLOCATE ─────────────────────────────────────────────────────

  if (screen === 'allocate') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center p-4 pb-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mt-6 mb-6">
            <div className="text-5xl mb-2">🎯</div>
            <h1 className="text-2xl font-black text-white mb-1">
              ¿Cómo inviertes tus ${starting_capital}?
            </h1>
            <p className="text-white/60 text-sm font-bold">
              Reparte tu dinero entre las opciones
            </p>
          </div>

          {/* Remaining pill */}
          <div
            className={`rounded-2xl px-4 py-3 mb-5 text-center border transition-all duration-300 ${
              allocationValid
                ? 'bg-emerald-500/20 border-emerald-500/40'
                : remaining < 0
                ? 'bg-red-500/20 border-red-500/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-white/60 text-sm font-bold">Disponible: </span>
            <span
              className={`text-xl font-black ${
                allocationValid
                  ? 'text-emerald-300'
                  : remaining < 0
                  ? 'text-red-300'
                  : 'text-white'
              }`}
            >
              {formatMoney(remaining)}
            </span>
            <span className="text-white/40 text-sm font-bold"> / ${starting_capital}</span>
          </div>

          {/* Sliders */}
          <div className="space-y-4 mb-6">
            {options.map((opt) => {
              const val = allocation[opt.id] ?? 0;
              const pct = (val / starting_capital) * 100;
              return (
                <div
                  key={opt.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <span className="text-white font-black text-sm">{opt.name}</span>
                        <span
                          className={`ml-2 text-xs font-bold ${RISK_COLORS[opt.risk_level]}`}
                        >
                          {RISK_LABELS[opt.risk_level]}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-lg font-black ${getTextColor(opt.color)}`}
                    >
                      {formatMoney(val)}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="h-3 bg-white/10 rounded-full mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getBarColor(opt.color)}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  {/* Slider */}
                  <input
                    type="range"
                    min={0}
                    max={starting_capital}
                    step={10}
                    value={val}
                    onChange={(e) =>
                      setOptionAllocation(opt.id, parseInt(e.target.value, 10))
                    }
                    className="w-full accent-purple-400 cursor-pointer"
                    style={{ height: '24px' }}
                  />
                  {/* Quick buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setOptionAllocation(opt.id, 0)}
                      className="text-xs text-white/40 font-bold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      $0
                    </button>
                    <button
                      onClick={() =>
                        setOptionAllocation(
                          opt.id,
                          Math.floor(starting_capital / 4 / 10) * 10
                        )
                      }
                      className="text-xs text-white/40 font-bold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      25%
                    </button>
                    <button
                      onClick={() =>
                        setOptionAllocation(
                          opt.id,
                          Math.floor(starting_capital / 2 / 10) * 10
                        )
                      }
                      className="text-xs text-white/40 font-bold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => allocateAll(opt.id)}
                      className="text-xs text-white/40 font-bold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      Todo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={distributeEvenly}
              className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 text-white/70 font-bold text-sm rounded-2xl px-4 py-3 transition-all duration-300"
            >
              ⚖️ Dividir partes iguales
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={startSimulation}
            disabled={!allocationValid}
            className={`w-full font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-base transition-all duration-300 ${
              allocationValid
                ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-900/50'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {allocationValid
              ? '¡Simular 6 meses! 🚀'
              : `Falta: ${formatMoney(Math.abs(remaining))}`}
          </button>
        </div>
      </div>
    );
  }

  // ─── SCREEN: SIMULATION ───────────────────────────────────────────────────

  if (screen === 'simulation') {
    const progressPct = (currentMonth / months) * 100;

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center p-4 pb-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mt-6 mb-5">
            <div>
              <h1 className="text-xl font-black text-white">
                {currentMonth === 0 ? '¡Comienza la simulación!' : `Mes ${currentMonth} de ${months}`}
              </h1>
              <p className="text-white/50 text-xs font-bold">
                {currentMonth < months
                  ? 'Avanza el tiempo para ver cómo crece tu dinero'
                  : '¡Simulación completada!'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50 font-bold uppercase">Total</div>
              <div
                className={`text-xl font-black ${
                  totalPortfolio >= starting_capital
                    ? 'text-emerald-300'
                    : 'text-red-300'
                }`}
              >
                {formatMoney(totalPortfolio || starting_capital)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Event banner */}
          {showEventBanner && activeEvent && (
            <div className="rounded-2xl border border-amber-400/40 bg-amber-500/20 p-4 mb-4 animate-pulse">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeEvent.emoji}</span>
                <div>
                  <div className="text-amber-300 font-black text-sm uppercase tracking-wide mb-1">
                    ¡Evento del mes!
                  </div>
                  <p className="text-white font-bold text-sm">{activeEvent.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio bars */}
          <div className="space-y-3 mb-6">
            {options.map((opt) => {
              const currentVal = portfolio[opt.id] ?? allocation[opt.id] ?? 0;
              const initialVal = allocation[opt.id] ?? 0;
              const barPct =
                starting_capital > 0
                  ? Math.min((currentVal / starting_capital) * 100, 100)
                  : 0;
              const diff = currentVal - initialVal;
              const isPulsing = pulsingOptionId === opt.id;

              return (
                <div
                  key={opt.id}
                  className={`rounded-2xl border p-4 transition-all duration-500 ${
                    isPulsing
                      ? 'border-amber-400/60 bg-amber-500/10 scale-[1.02]'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-white font-bold text-sm">{opt.name}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-black text-base ${getTextColor(opt.color)}`}
                      >
                        {formatMoney(currentVal)}
                      </span>
                      {initialVal > 0 && diff !== 0 && (
                        <div
                          className={`text-xs font-bold ${
                            diff >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {diff >= 0 ? '▲' : '▼'} {formatMoney(Math.abs(diff))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getBarColor(opt.color)}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rebalance hint for month 3 */}
          {currentMonth === 2 && !hasRebalanced && (
            <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-3 mb-4 text-center">
              <p className="text-purple-300 text-xs font-bold">
                💡 En el siguiente mes podrás <strong>re-balancear</strong> tu portafolio una vez
              </p>
            </div>
          )}

          {/* Advance button */}
          {currentMonth < months ? (
            <button
              onClick={advanceMonth}
              disabled={isAnimating}
              className={`w-full font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-base transition-all duration-300 ${
                isAnimating
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 active:scale-95 text-white shadow-lg shadow-purple-900/50'
              }`}
            >
              {isAnimating ? '⏳ Calculando...' : `Avanzar al mes ${currentMonth + 1} ⏩`}
            </button>
          ) : (
            <button
              onClick={() => {
                const score = computeFinalScore(totalPortfolio);
                setFinalScore(score);
                setScreen('results');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-base transition-all duration-300 shadow-lg shadow-emerald-900/50"
            >
              Ver mis resultados 🏆
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── SCREEN: REBALANCE ────────────────────────────────────────────────────

  if (screen === 'rebalance') {
    const totalCurrent = Object.values(portfolio).reduce((a, b) => a + b, 0);
    const totalRebal = Object.values(rebalanceAllocation).reduce((a, b) => a + b, 0);
    const rebalRemaining = totalCurrent - totalRebal;
    const rebalValid = Math.abs(rebalRemaining) < 2;

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center p-4 pb-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mt-6 mb-6">
            <div className="text-5xl mb-2">⚖️</div>
            <h1 className="text-2xl font-black text-white mb-2">
              ¡Rebalanceo al mes 3!
            </h1>
            <p className="text-white/60 text-sm font-bold max-w-xs mx-auto">
              Esta es tu única oportunidad de mover tu dinero. ¿Cómo quieres repartir{' '}
              <span className="text-emerald-300 font-black">{formatMoney(totalCurrent)}</span>?
            </p>
          </div>

          {/* Remaining */}
          <div
            className={`rounded-2xl px-4 py-3 mb-5 text-center border transition-all duration-300 ${
              rebalValid
                ? 'bg-emerald-500/20 border-emerald-500/40'
                : rebalRemaining < 0
                ? 'bg-red-500/20 border-red-500/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-white/60 text-sm font-bold">Disponible: </span>
            <span
              className={`text-xl font-black ${
                rebalValid
                  ? 'text-emerald-300'
                  : rebalRemaining < 0
                  ? 'text-red-300'
                  : 'text-white'
              }`}
            >
              {formatMoney(rebalRemaining)}
            </span>
          </div>

          {/* Sliders */}
          <div className="space-y-4 mb-6">
            {options.map((opt) => {
              const val = rebalanceAllocation[opt.id] ?? 0;
              const pct = (val / totalCurrent) * 100;
              return (
                <div
                  key={opt.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-white font-black text-sm">{opt.name}</span>
                    </div>
                    <span className={`text-lg font-black ${getTextColor(opt.color)}`}>
                      {formatMoney(val)}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getBarColor(opt.color)}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.ceil(totalCurrent)}
                    step={5}
                    value={val}
                    onChange={(e) =>
                      setRebalOption(opt.id, parseFloat(e.target.value))
                    }
                    className="w-full accent-purple-400 cursor-pointer"
                    style={{ height: '24px' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={confirmRebalance}
              disabled={!rebalValid}
              className={`w-full font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-base transition-all duration-300 ${
                rebalValid
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg shadow-emerald-900/50'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {rebalValid ? '¡Confirmar rebalanceo! ✅' : `Falta: ${formatMoney(Math.abs(rebalRemaining))}`}
            </button>
            <button
              onClick={skipRebalance}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 text-white/60 font-bold text-sm rounded-2xl px-6 py-3 transition-all duration-300"
            >
              Dejar igual (sin cambios)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SCREEN: RESULTS ──────────────────────────────────────────────────────

  if (screen === 'results') {
    const finalTotal = history.length > 0 ? history[history.length - 1].total : totalPortfolio;
    const profit = finalTotal - starting_capital;
    const profitPct = ((profit / starting_capital) * 100).toFixed(1);
    const won = profit >= 0;

    let scoreLabel = '';
    let scoreMoji = '';
    if (finalScore >= 85) {
      scoreLabel = '¡Inversor experto!';
      scoreMoji = '🏆';
    } else if (finalScore >= 70) {
      scoreLabel = '¡Muy bien hecho!';
      scoreMoji = '🌟';
    } else if (finalScore >= 55) {
      scoreLabel = '¡Buen intento!';
      scoreMoji = '👍';
    } else {
      scoreLabel = '¡Sigue aprendiendo!';
      scoreMoji = '💪';
    }

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center p-4 pb-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mt-6 mb-6">
            <div className="text-6xl mb-2 animate-bounce">{scoreMoji}</div>
            <h1 className="text-3xl font-black text-white mb-1">{scoreLabel}</h1>
            <div
              className={`text-5xl font-black mt-2 mb-1 ${
                won ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {formatMoney(finalTotal)}
            </div>
            <p className="text-white/50 text-sm font-bold">
              {won ? '¡Ganaste' : 'Resultado final'}
              {' '}
              <span
                className={`font-black ${won ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {won ? '+' : ''}{formatMoney(profit)} ({profitPct}%)
              </span>
            </p>
          </div>

          {/* Score pill */}
          <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4 mb-6 text-center">
            <div className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">
              Puntuación
            </div>
            <div className="text-4xl font-black text-purple-300">{finalScore}</div>
            <div className="text-white/40 text-xs font-bold">/ 100 puntos</div>
            {/* Mini progress bar */}
            <div className="h-3 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${finalScore}%` }}
              />
            </div>
          </div>

          {/* Chart */}
          {history.length >= 2 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 mb-5">
              <h3 className="text-white/70 text-xs font-black uppercase tracking-widest mb-3 text-center">
                Evolución de tu portafolio 📈
              </h3>
              <LineChart
                portfolioHistory={history}
                baselineHistory={baselineHistory}
                startingCapital={starting_capital}
              />
            </div>
          )}

          {/* Breakdown */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 mb-6">
            <h3 className="text-white/70 text-xs font-black uppercase tracking-widest mb-3">
              Resultado por inversión
            </h3>
            <div className="space-y-2">
              {options.map((opt) => {
                const finalVal = history.length > 0
                  ? (history[history.length - 1].breakdown[opt.id] ?? 0)
                  : (portfolio[opt.id] ?? 0);
                const initVal = allocation[opt.id] ?? 0;
                const diff = finalVal - initVal;
                if (initVal === 0 && finalVal === 0) return null;
                return (
                  <div key={opt.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{opt.emoji}</span>
                      <span className="text-white/70 text-xs font-bold">{opt.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black ${getTextColor(opt.color)}`}>
                        {formatMoney(finalVal)}
                      </span>
                      {initVal > 0 && (
                        <span
                          className={`ml-2 text-xs font-bold ${
                            diff >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {diff >= 0 ? '+' : ''}{formatMoney(diff)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lesson */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 mb-6">
            <div className="text-blue-300 text-xs font-black uppercase tracking-widest mb-2">
              💡 ¿Qué aprendiste?
            </div>
            <p className="text-white/70 text-sm font-bold leading-relaxed">
              {won
                ? 'Diversificar tu dinero entre varias opciones ayuda a crecer más seguros. ¡Las inversiones son una herramienta poderosa!'
                : 'Invertir tiene riesgos, pero también grandes oportunidades. Lo importante es aprender a diversificar y no poner todos los huevos en una canasta 🥚'}
            </p>
          </div>

          {/* Finalizar */}
          <button
            onClick={handleFinish}
            className="w-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-4 text-lg transition-all duration-300 shadow-lg shadow-purple-900/50"
          >
            Finalizar 🎓
          </button>
        </div>
      </div>
    );
  }

  return null;
}
