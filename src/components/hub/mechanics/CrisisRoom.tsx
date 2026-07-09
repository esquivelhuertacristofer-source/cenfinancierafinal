'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── CONTENT SHAPE ───────────────────────────────────────────────────────────

interface PolicyEffects {
  gdp_growth_delta: number;
  inflation_delta: number;
  unemployment_delta: number;
  exchange_rate_delta: number;
}

interface PolicyOption {
  label: string;
  description: string;
  effects: PolicyEffects;
}

interface CrisisRound {
  situation: string;
  options: PolicyOption[];
}

interface HistoricalOutcome {
  description: string;
  gdp_growth: number;
  inflation: number;
  unemployment: number;
  exchange_rate: number;
}

interface StartingIndicators {
  gdp_growth: number;
  inflation: number;
  unemployment: number;
  exchange_rate: number;
}

interface CrisisRoomContent {
  crisis_year: number;
  crisis_name: string;
  briefing: string;
  starting_indicators: StartingIndicators;
  rounds: CrisisRound[];
  historical_outcome: HistoricalOutcome;
}

// ─── INDICATOR STATE ──────────────────────────────────────────────────────────

interface Indicators {
  gdp_growth: number;
  inflation: number;
  unemployment: number;
  exchange_rate: number;
}

interface IndicatorDelta {
  gdp_growth: number;
  inflation: number;
  unemployment: number;
  exchange_rate: number;
}

// ─── GAME PHASES ─────────────────────────────────────────────────────────────

type GamePhase = 'start' | 'playing' | 'feedback' | 'results';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Normalized gauge fill: for GDP (higher better), inflation (lower better),
 * unemployment (lower better), exchange rate is shown as a number.
 */
function gdpFill(val: number): number {
  // range: -10% to +10%
  return clamp((val + 10) / 20, 0, 1);
}
function inflationFill(val: number): number {
  // range: 0 to 100%; lower is better (green)
  return clamp(1 - val / 100, 0, 1);
}
function unemploymentFill(val: number): number {
  // range: 0 to 30%; lower is better
  return clamp(1 - val / 30, 0, 1);
}

function gdpColor(val: number): string {
  if (val >= 2) return '#22c55e';
  if (val >= 0) return '#eab308';
  return '#ef4444';
}
function inflationColor(val: number): string {
  if (val <= 5) return '#22c55e';
  if (val <= 20) return '#eab308';
  return '#ef4444';
}
function unemploymentColor(val: number): string {
  if (val <= 4) return '#22c55e';
  if (val <= 8) return '#eab308';
  return '#ef4444';
}

function formatDelta(val: number, prefix = ''): string {
  if (val > 0) return `${prefix}+${val.toFixed(1)}`;
  return `${prefix}${val.toFixed(1)}`;
}

function formatSigned(val: number): string {
  return val >= 0 ? `+${val.toFixed(1)}` : `${val.toFixed(1)}`;
}

// Fallback used when content is missing starting_indicators/historical_outcome
// so numeric fields are never undefined (which would crash .toFixed() calls).
const DEFAULT_INDICATORS: Indicators = { gdp_growth: 0, inflation: 0, unemployment: 0, exchange_rate: 0 };

/**
 * Score: compare player indicators to historical outcome.
 * Each indicator contributes 25 points. Closer = more points.
 */
function computeScore(player: Indicators, historical: HistoricalOutcome): number {
  const gdpDiff = Math.abs(player.gdp_growth - historical.gdp_growth);
  const infDiff = Math.abs(player.inflation - historical.inflation);
  const uneDiff = Math.abs(player.unemployment - historical.unemployment);
  const fxDiff = Math.abs(player.exchange_rate - historical.exchange_rate);

  const gdpScore = Math.max(0, 25 - gdpDiff * 3);
  const infScore = Math.max(0, 25 - infDiff * 0.8);
  const uneScore = Math.max(0, 25 - uneDiff * 4);
  const fxScore = Math.max(0, 25 - fxDiff * 1.5);

  return Math.round(gdpScore + infScore + uneScore + fxScore);
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

interface GaugeBarProps {
  label: string;
  emoji: string;
  value: number;
  fill: number;
  color: string;
  unit: string;
  delta?: number;
  animate?: boolean;
}

function GaugeBar({ label, emoji, value, fill, color, unit, delta, animate }: GaugeBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-black text-white/60 uppercase tracking-widest flex items-center gap-1">
          {emoji} {label}
        </span>
        <div className="flex items-center gap-1">
          {delta !== undefined && delta !== 0 && (
            <span
              className={`text-xs font-black ${delta > 0 ? 'text-emerald-400' : 'text-red-400'} animate-bounce`}
            >
              {formatSigned(delta)}
            </span>
          )}
          <span className="text-base font-black text-white">
            {value.toFixed(1)}{unit}
          </span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${animate ? 'animate-pulse' : ''}`}
          style={{ width: `${fill * 100}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

interface IndicatorPanelProps {
  indicators: Indicators;
  deltas?: Partial<IndicatorDelta>;
  animating?: boolean;
}

function IndicatorPanel({ indicators, deltas, animating }: IndicatorPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-black text-purple-300 uppercase tracking-widest">📊 Indicadores en Vivo</span>
      </div>
      <GaugeBar
        label="PIB"
        emoji="📈"
        value={indicators.gdp_growth}
        fill={gdpFill(indicators.gdp_growth)}
        color={gdpColor(indicators.gdp_growth)}
        unit="%"
        delta={deltas?.gdp_growth}
        animate={animating}
      />
      <GaugeBar
        label="Inflación"
        emoji="🔥"
        value={indicators.inflation}
        fill={inflationFill(indicators.inflation)}
        color={inflationColor(indicators.inflation)}
        unit="%"
        delta={deltas?.inflation}
        animate={animating}
      />
      <GaugeBar
        label="Desempleo"
        emoji="👷"
        value={indicators.unemployment}
        fill={unemploymentFill(indicators.unemployment)}
        color={unemploymentColor(indicators.unemployment)}
        unit="%"
        delta={deltas?.unemployment}
        animate={animating}
      />
      <div className="flex items-center justify-between mt-1 rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
        <span className="text-xs font-black text-white/60 uppercase tracking-widest">💱 Tipo de Cambio</span>
        <div className="flex items-center gap-2">
          {deltas?.exchange_rate !== undefined && deltas.exchange_rate !== 0 && (
            <span className={`text-xs font-black ${deltas.exchange_rate > 0 ? 'text-red-400' : 'text-emerald-400'} animate-bounce`}>
              {formatSigned(deltas.exchange_rate)}
            </span>
          )}
          <span className="text-2xl font-black text-white">{indicators.exchange_rate.toFixed(2)}</span>
          <span className="text-xs text-white/40 font-black">MXN/USD</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function CrisisRoom({ activity, onComplete }: { activity: Activity; onComplete: (score: number) => void }) {
  const content = activity.content as unknown as CrisisRoomContent;

  // Defensive fallbacks: if content is malformed (missing rounds/indicators),
  // fall back to safe defaults instead of crashing on `.length`/`.toFixed()`.
  const safeRounds: CrisisRound[] = content?.rounds ?? [];
  const safeStartingIndicators: Indicators = content?.starting_indicators ?? DEFAULT_INDICATORS;
  const safeHistoricalOutcome: HistoricalOutcome =
    content?.historical_outcome ?? { description: '', ...DEFAULT_INDICATORS };

  const [phase, setPhase] = useState<GamePhase>('start');
  const [roundIndex, setRoundIndex] = useState(0);
  const [indicators, setIndicators] = useState<Indicators>({ ...safeStartingIndicators });
  const [lastDeltas, setLastDeltas] = useState<IndicatorDelta | null>(null);
  const [lastOption, setLastOption] = useState<PolicyOption | null>(null);
  const [animating, setAnimating] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const hasCompletedRef = useRef(false);

  const totalRounds = safeRounds.length;
  const currentRound = safeRounds[roundIndex] ?? null;

  // Reset animating after a short delay
  useEffect(() => {
    if (animating) {
      const t = setTimeout(() => setAnimating(false), 1200);
      return () => clearTimeout(t);
    }
  }, [animating]);

  const handleStart = useCallback(() => {
    setPhase('playing');
    setRoundIndex(0);
    setIndicators({ ...safeStartingIndicators });
    setLastDeltas(null);
    setLastOption(null);
    setSelectedOptionIdx(null);
  }, [safeStartingIndicators]);

  const handleChooseOption = useCallback((optionIdx: number) => {
    if (!currentRound) return;
    const chosen = currentRound.options[optionIdx];
    if (!chosen) return;

    setSelectedOptionIdx(optionIdx);

    const deltas: IndicatorDelta = {
      gdp_growth: chosen.effects.gdp_growth_delta,
      inflation: chosen.effects.inflation_delta,
      unemployment: chosen.effects.unemployment_delta,
      exchange_rate: chosen.effects.exchange_rate_delta,
    };
    setLastDeltas(deltas);
    setLastOption(chosen);
    setAnimating(true);

    setIndicators(prev => ({
      gdp_growth: parseFloat((prev.gdp_growth + chosen.effects.gdp_growth_delta).toFixed(2)),
      inflation: parseFloat((prev.inflation + chosen.effects.inflation_delta).toFixed(2)),
      unemployment: parseFloat((prev.unemployment + chosen.effects.unemployment_delta).toFixed(2)),
      exchange_rate: parseFloat((prev.exchange_rate + chosen.effects.exchange_rate_delta).toFixed(2)),
    }));

    setPhase('feedback');
  }, [currentRound]);

  const handleNextRound = useCallback(() => {
    setLastDeltas(null);
    setLastOption(null);
    setSelectedOptionIdx(null);

    const next = roundIndex + 1;
    if (next >= totalRounds) {
      // Game over — compute score
      setIndicators(prev => {
        const score = computeScore(prev, safeHistoricalOutcome);
        setFinalScore(score);
        return prev;
      });
      setPhase('results');
    } else {
      setRoundIndex(next);
      setPhase('playing');
    }
  }, [roundIndex, totalRounds, safeHistoricalOutcome]);

  const handleFinalize = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete(finalScore);
  }, [finalScore, onComplete]);

  // ─── SCREEN: START ──────────────────────────────────────────────────────────

  if (phase === 'start') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a1a] p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-red-900/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40">
            <span className="text-red-400 text-xs font-black uppercase tracking-widest animate-pulse">🚨 Alerta Máxima</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            Crisis Room<br />
            <span className="text-purple-400">{content.crisis_name}</span>
          </h1>

          {/* Year badge */}
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/30 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">Año</span>
            <span className="text-3xl font-black text-white">{content.crisis_year}</span>
          </div>

          {/* Briefing */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <p className="text-base md:text-lg font-bold text-white/80 leading-relaxed">
              🇲🇽 {content.briefing}
            </p>
          </div>

          {/* Mission summary */}
          <div className="w-full rounded-3xl border border-purple-500/30 bg-purple-900/20 p-5 text-left space-y-2">
            <p className="text-xs font-black text-purple-300 uppercase tracking-widest">Tu misión:</p>
            <ul className="space-y-1">
              <li className="text-sm text-white/70 font-bold">📊 Monitorea 4 indicadores económicos en tiempo real</li>
              <li className="text-sm text-white/70 font-bold">⚡ Toma <span className="text-white font-black">{totalRounds} decisiones críticas</span> de política económica</li>
              <li className="text-sm text-white/70 font-bold">🏆 Compara tus resultados con lo que ocurrió históricamente</li>
            </ul>
          </div>

          {/* Starting indicators preview */}
          <div className="w-full">
            <IndicatorPanel indicators={safeStartingIndicators} />
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 font-black text-white uppercase tracking-widest text-base transition-all duration-300 shadow-[0_0_40px_rgba(147,51,234,0.4)]"
          >
            🚀 Asumir el Mando
          </button>
        </div>
      </div>
    );
  }

  // ─── SCREEN: PLAYING ────────────────────────────────────────────────────────

  if (phase === 'playing' && currentRound) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#0a0a1a] p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-900/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-purple-300 uppercase tracking-widest">Crisis Room</p>
              <h2 className="text-lg font-black text-white">{content.crisis_name} · {content.crisis_year}</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Decisión</span>
              <span className="text-2xl font-black text-white">{roundIndex + 1}</span>
              <span className="text-sm text-white/30 font-black">/ {totalRounds}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((roundIndex) / totalRounds) * 100}%` }}
            />
          </div>

          {/* Live indicators */}
          <IndicatorPanel indicators={indicators} animating={animating} />

          {/* Situation card */}
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">🚨</span>
              <div>
                <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Situación Urgente</p>
                <p className="text-base md:text-lg font-black text-white leading-snug">{currentRound.situation}</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-black text-white/40 uppercase tracking-widest text-center">
              ⚡ Elige una política económica:
            </p>
            {currentRound.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleChooseOption(idx)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 hover:bg-purple-700/30 hover:border-purple-500/50 active:scale-[0.98] p-5 text-left transition-all duration-300 min-h-[80px] group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors">
                    <span className="text-sm font-black text-purple-300">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-black text-white group-hover:text-purple-200 transition-colors">{option.label}</p>
                    <p className="text-xs text-white/50 font-bold mt-0.5 leading-snug">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SCREEN: FEEDBACK ───────────────────────────────────────────────────────

  if (phase === 'feedback' && lastOption && lastDeltas) {
    const deltaEntries: Array<{ label: string; emoji: string; value: number; positive_is_good: boolean }> = [
      { label: 'PIB', emoji: '📈', value: lastDeltas.gdp_growth, positive_is_good: true },
      { label: 'Inflación', emoji: '🔥', value: lastDeltas.inflation, positive_is_good: false },
      { label: 'Desempleo', emoji: '👷', value: lastDeltas.unemployment, positive_is_good: false },
      { label: 'Tipo de cambio', emoji: '💱', value: lastDeltas.exchange_rate, positive_is_good: false },
    ];

    return (
      <div className="min-h-screen w-full flex flex-col bg-[#0a0a1a] p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-purple-300 uppercase tracking-widest">Crisis Room</p>
              <h2 className="text-lg font-black text-white">{content.crisis_name} · {content.crisis_year}</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-black text-white/50 uppercase">Decisión</span>
              <span className="text-2xl font-black text-white">{roundIndex + 1}</span>
              <span className="text-sm text-white/30 font-black">/ {totalRounds}</span>
            </div>
          </div>

          {/* Updated indicators */}
          <IndicatorPanel indicators={indicators} deltas={lastDeltas} animating={true} />

          {/* Chosen policy */}
          <div className="rounded-3xl border border-purple-500/30 bg-purple-900/20 p-5">
            <p className="text-xs font-black text-purple-300 uppercase tracking-widest mb-2">✅ Decisión Tomada:</p>
            <p className="text-base font-black text-white">{lastOption.label}</p>
            <p className="text-sm text-white/60 font-bold mt-1">{lastOption.description}</p>
          </div>

          {/* Effects breakdown */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-3">📊 Efectos Inmediatos:</p>
            <div className="grid grid-cols-2 gap-3">
              {deltaEntries.map(({ label, emoji, value, positive_is_good }) => {
                const isGood = positive_is_good ? value > 0 : value < 0;
                const isNeutral = value === 0;
                return (
                  <div
                    key={label}
                    className={`rounded-2xl p-3 border flex items-center gap-2 ${
                      isNeutral
                        ? 'bg-white/5 border-white/10'
                        : isGood
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <div>
                      <p className="text-xs font-black text-white/50 uppercase tracking-widest">{label}</p>
                      <p
                        className={`text-lg font-black ${
                          isNeutral ? 'text-white/40' : isGood ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatDelta(value, '')}
                        {label !== 'Tipo de cambio' ? '%' : ' MXN'}
                        {!isNeutral && (isGood ? ' ✅' : ' ⚠️')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation note */}
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">¿Por qué cambiaron los indicadores?</p>
              <p className="text-sm text-white/70 font-bold leading-relaxed">
                {lastDeltas.gdp_growth > 0 && 'El PIB creció porque la política impulsó la economía. '}
                {lastDeltas.gdp_growth < 0 && 'El PIB bajó como efecto del ajuste económico. '}
                {lastDeltas.inflation > 0 && 'La inflación aumentó por mayor demanda o gasto. '}
                {lastDeltas.inflation < 0 && 'La inflación bajó por menor demanda o control monetario. '}
                {lastDeltas.unemployment > 0 && 'El desempleo subió porque las empresas se ajustaron. '}
                {lastDeltas.unemployment < 0 && 'El desempleo bajó gracias a mayor actividad económica. '}
                {lastDeltas.exchange_rate > 0 && 'El peso se depreció frente al dólar. '}
                {lastDeltas.exchange_rate < 0 && 'El peso se fortaleció frente al dólar. '}
                {lastDeltas.gdp_growth === 0 && lastDeltas.inflation === 0 && lastDeltas.unemployment === 0 && lastDeltas.exchange_rate === 0
                  && 'Los indicadores se mantuvieron estables con esta decisión.'}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={handleNextRound}
            className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 font-black text-white uppercase tracking-widest text-base transition-all duration-300 shadow-[0_0_30px_rgba(147,51,234,0.35)]"
          >
            {roundIndex + 1 >= totalRounds ? '🏁 Ver Resultados Finales' : `⚡ Siguiente Decisión (${roundIndex + 2}/${totalRounds})`}
          </button>
        </div>
      </div>
    );
  }

  // ─── SCREEN: RESULTS ────────────────────────────────────────────────────────

  if (phase === 'results') {
    const hist = safeHistoricalOutcome;

    const comparisons: Array<{
      label: string;
      emoji: string;
      player: number;
      real: number;
      unit: string;
      positive_is_good: boolean;
    }> = [
      { label: 'PIB', emoji: '📈', player: indicators.gdp_growth, real: hist.gdp_growth, unit: '%', positive_is_good: true },
      { label: 'Inflación', emoji: '🔥', player: indicators.inflation, real: hist.inflation, unit: '%', positive_is_good: false },
      { label: 'Desempleo', emoji: '👷', player: indicators.unemployment, real: hist.unemployment, unit: '%', positive_is_good: false },
      { label: 'Tipo de cambio', emoji: '💱', player: indicators.exchange_rate, real: hist.exchange_rate, unit: ' MXN/USD', positive_is_good: false },
    ];

    const scoreEmoji = finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🌟' : finalScore >= 40 ? '💪' : '📚';
    const scoreMsgTitle = finalScore >= 80 ? '¡Economista Élite!' : finalScore >= 60 ? '¡Buen Trabajo!' : finalScore >= 40 ? '¡Vas Bien!' : '¡Sigue Aprendiendo!';
    const scoreMsgBody = finalScore >= 80
      ? 'Tus decisiones se acercaron mucho al resultado histórico real. ¡Eres un gran asesor económico!'
      : finalScore >= 60
      ? 'Tomaste decisiones sólidas. La economía es compleja y lo hiciste bastante bien.'
      : finalScore >= 40
      ? 'Algunas decisiones funcionaron. La economía tiene muchas variables que aprender a manejar.'
      : 'Las crisis económicas son muy difíciles. Lo importante es entender qué pasó realmente.';

    return (
      <div className="min-h-screen w-full flex flex-col bg-[#0a0a1a] p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-900/30 rounded-full blur-[120px]" />
          {finalScore >= 70 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px]" />
          )}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto w-full flex flex-col gap-5">
          {/* Score hero */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-purple-600/20 border-2 border-purple-500/40 flex items-center justify-center text-4xl">
              {scoreEmoji}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{scoreMsgTitle}</h2>
            <p className="text-white/60 font-bold text-sm leading-relaxed max-w-md">{scoreMsgBody}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-black text-white/40 uppercase tracking-widest">Puntaje Final:</span>
              <span className="text-4xl font-black text-purple-300">{finalScore}</span>
              <span className="text-sm text-white/30 font-black">/ 100</span>
            </div>
            {/* Score bar */}
            <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${finalScore}%`,
                  background: finalScore >= 70
                    ? 'linear-gradient(90deg, #22c55e, #86efac)'
                    : finalScore >= 40
                    ? 'linear-gradient(90deg, #eab308, #fde047)'
                    : 'linear-gradient(90deg, #ef4444, #fca5a5)',
                  boxShadow: finalScore >= 70 ? '0 0 12px #22c55e80' : finalScore >= 40 ? '0 0 12px #eab30880' : '0 0 12px #ef444480',
                }}
              />
            </div>
          </div>

          {/* Historical comparison */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇲🇽</span>
              <div>
                <p className="text-xs font-black text-purple-300 uppercase tracking-widest">¿Qué hizo realmente México?</p>
                <p className="text-sm font-bold text-white/60 leading-snug">{hist.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {comparisons.map(({ label, emoji, player, real, unit, positive_is_good }) => {
                const diff = player - real;
                const close = Math.abs(diff) <= 2;
                const playerBetter = positive_is_good ? player > real : player < real;

                return (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest flex items-center gap-1">
                        {emoji} {label}
                      </span>
                      {close ? (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
                          ✅ Muy Cercano
                        </span>
                      ) : playerBetter ? (
                        <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full px-2 py-0.5">
                          💪 Lo Superaste
                        </span>
                      ) : (
                        <span className="text-xs font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2 py-0.5">
                          📚 Diferente
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-purple-900/30 border border-purple-500/20 p-3 text-center">
                        <p className="text-xs font-black text-purple-300 uppercase tracking-widest mb-1">Tú</p>
                        <p className="text-2xl font-black text-white">{player.toFixed(1)}{unit}</p>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                        <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Historia Real</p>
                        <p className="text-2xl font-black text-white/70">{real.toFixed(1)}{unit}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key takeaway */}
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 flex gap-3">
            <span className="text-3xl flex-shrink-0">📖</span>
            <div>
              <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">Lección Económica</p>
              <p className="text-sm text-white/80 font-bold leading-relaxed">
                Durante la crisis de {content.crisis_year}, {hist.description.toLowerCase()}.
                Las decisiones de política económica tienen consecuencias reales para millones de mexicanos.
                Cada indicador refleja el bienestar de las familias del país.
              </p>
            </div>
          </div>

          {/* Finalizar */}
          <button
            onClick={handleFinalize}
            className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 font-black text-white uppercase tracking-widest text-base transition-all duration-300 shadow-[0_0_40px_rgba(147,51,234,0.4)]"
          >
            🏁 Finalizar Misión
          </button>
        </div>
      </div>
    );
  }

  // ─── FALLBACK ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a1a] p-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center max-w-md">
        <p className="text-white/40 text-lg font-bold mb-6">Error: datos de actividad incompletos.</p>
        <button
          onClick={() => {
            if (hasCompletedRef.current) return;
            hasCompletedRef.current = true;
            onComplete(0);
          }}
          className="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 font-black text-white uppercase tracking-widest text-sm transition-all duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
