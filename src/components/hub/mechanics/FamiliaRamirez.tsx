'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── Content shape ────────────────────────────────────────────────────────────

interface FixedExpense {
  label: string;
  amount: number;
}

interface EventChoice {
  label: string;
  cost: number;
  mood_effect: 'positive' | 'neutral' | 'negative';
}

interface DayEvent {
  day: number;
  emoji: string;
  description: string;
  choices: EventChoice[];
}

interface Emergency {
  day: number;
  emoji: string;
  description: string;
  cost: number;
}

interface FamiliaRamirezContent {
  family_name: string;
  monthly_income: number;
  fixed_expenses: FixedExpense[];
  events: DayEvent[];
  emergency: Emergency;
}

// ─── Decision log ─────────────────────────────────────────────────────────────

interface DecisionRecord {
  day: number;
  emoji: string;
  description: string;
  choiceLabel: string;
  cost: number;
  mood_effect: 'positive' | 'neutral' | 'negative';
}

// ─── Screens ──────────────────────────────────────────────────────────────────

type Screen = 'start' | 'game' | 'emergency' | 'results';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(amount: number): string {
  return `$${amount.toLocaleString('es-MX')}`;
}

function moodColor(effect: 'positive' | 'neutral' | 'negative'): string {
  if (effect === 'positive') return 'text-emerald-300';
  if (effect === 'negative') return 'text-red-300';
  return 'text-white/70';
}

function moodEmoji(effect: 'positive' | 'neutral' | 'negative'): string {
  if (effect === 'positive') return '😊';
  if (effect === 'negative') return '😟';
  return '😐';
}

function costColor(cost: number): string {
  if (cost === 0) return 'text-emerald-300';
  if (cost < 100) return 'text-yellow-300';
  return 'text-red-300';
}

// ─── Calendar dot ─────────────────────────────────────────────────────────────

function CalendarDots({
  totalDays,
  currentDay,
  emergencyDay,
}: {
  totalDays: number;
  currentDay: number;
  emergencyDay: number;
}) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {days.map((d) => {
        const done = d < currentDay;
        const active = d === currentDay;
        const isEmergency = d === emergencyDay;
        return (
          <div
            key={d}
            className={[
              'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300',
              done
                ? 'bg-purple-600 text-white'
                : active
                ? 'bg-yellow-400 text-black animate-pulse scale-125'
                : isEmergency
                ? 'bg-red-900/60 border border-red-500/50 text-red-300'
                : 'bg-white/10 text-white/30',
            ].join(' ')}
          >
            {isEmergency && !done ? '⚡' : d}
          </div>
        );
      })}
    </div>
  );
}

// ─── Emergency bar ────────────────────────────────────────────────────────────

function EmergencyBar({ balance, emergencyCost }: { balance: number; emergencyCost: number }) {
  const pct =
    emergencyCost > 0
      ? Math.min(100, Math.max(0, Math.round((balance / emergencyCost) * 100)))
      : 100;
  const safe = balance >= emergencyCost;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
          ⚡ Fondo de Emergencia
        </span>
        <span className={`text-[10px] font-black ${safe ? 'text-emerald-300' : 'text-red-300'}`}>
          {safe ? '✅ Listo' : `Faltan ${formatMXN(Math.max(0, emergencyCost - balance))}`}
        </span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${safe ? 'bg-emerald-400' : 'bg-red-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function FamiliaRamirez({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = activity.content as unknown as FamiliaRamirezContent;

  // ── Derived constants ──────────────────────────────────────────────────────

  const totalFixedExpenses = (content.fixed_expenses || []).reduce((s, e) => s + e.amount, 0);
  const initialBalance = content.monthly_income - totalFixedExpenses;
  const allEvents: DayEvent[] = content.events || [];
  const emergency = content.emergency;
  // Total calendar days = last event day or 30
  const totalCalendarDays = Math.max(30, ...allEvents.map((e) => e.day), emergency.day);

  // ── State ──────────────────────────────────────────────────────────────────

  const [screen, setScreen] = useState<Screen>('start');
  const [balance, setBalance] = useState(initialBalance);
  const [eventIndex, setEventIndex] = useState(0);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [hadEmergencyBonus, setHadEmergencyBonus] = useState(false);
  const [animateBalance, setAnimateBalance] = useState(false);
  const [emergencyHandled, setEmergencyHandled] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState<'covered' | 'debt' | null>(null);

  // Guards against duplicate onComplete calls (double-click) and stray timers.
  const hasFinalizedRef = useRef(false);
  const balanceAnimTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Score calculation ──────────────────────────────────────────────────────

  const computeScore = useCallback(
    (finalBalance: number, bonusEmergency: boolean): number => {
      const debt = Math.max(0, -finalBalance);
      const debtPct =
        content.monthly_income > 0
          ? Math.min(100, Math.round((debt / content.monthly_income) * 100))
          : 0;
      const bonus = bonusEmergency ? 20 : 0;
      return Math.max(0, Math.min(100, 100 - debtPct + bonus));
    },
    [content.monthly_income],
  );

  // ── Current event ──────────────────────────────────────────────────────────

  const currentEvent: DayEvent | null = allEvents[eventIndex] ?? null;

  // ── Trigger emergency screen when we hit that day ──────────────────────────

  useEffect(() => {
    if (screen === 'game' && currentEvent && currentEvent.day >= emergency.day && !emergencyHandled) {
      // Emergency fires before we show the next regular event
    }
  }, [currentEvent, emergency.day, emergencyHandled, screen]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const triggerBalanceAnimation = useCallback(() => {
    if (balanceAnimTimeoutRef.current) clearTimeout(balanceAnimTimeoutRef.current);
    setAnimateBalance(true);
    balanceAnimTimeoutRef.current = setTimeout(() => setAnimateBalance(false), 700);
  }, []);

  // Clear any pending balance-animation timeout on unmount to avoid setting
  // state on an unmounted component.
  useEffect(() => {
    return () => {
      if (balanceAnimTimeoutRef.current) clearTimeout(balanceAnimTimeoutRef.current);
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleStart() {
    setScreen('game');
    setBalance(initialBalance);
    setDecisions([]);
    setEventIndex(0);
    setCurrentDay(allEvents[0]?.day ?? 1);
    setSelectedChoice(null);
    setShowFeedback(false);
    setHadEmergencyBonus(false);
    setEmergencyHandled(false);
    setEmergencyResult(null);
  }

  function handleChoiceSelect(idx: number) {
    if (showFeedback) return;
    setSelectedChoice(idx);
  }

  function handleConfirmChoice() {
    if (selectedChoice === null || !currentEvent) return;

    const choice = currentEvent.choices[selectedChoice];
    const newBalance = balance - choice.cost;

    setBalance(newBalance);
    triggerBalanceAnimation();

    const record: DecisionRecord = {
      day: currentEvent.day,
      emoji: currentEvent.emoji,
      description: currentEvent.description,
      choiceLabel: choice.label,
      cost: choice.cost,
      mood_effect: choice.mood_effect,
    };
    setDecisions((prev) => [...prev, record]);

    // Feedback message
    if (choice.mood_effect === 'positive') {
      setFeedbackMsg('¡Excelente decision! 🌟 La familia esta feliz.');
    } else if (choice.mood_effect === 'negative') {
      setFeedbackMsg('Esa decision costo bastante... pero a veces es necesario. 💡');
    } else {
      setFeedbackMsg('Decision equilibrada. El balance sigue bien. 👍');
    }

    setShowFeedback(true);
  }

  function handleNextEvent() {
    setShowFeedback(false);
    setSelectedChoice(null);

    const nextIndex = eventIndex + 1;
    const nextEvent = allEvents[nextIndex];

    // Check if next event crosses the emergency day
    const nextDay = nextEvent?.day ?? totalCalendarDays;
    if (!emergencyHandled && nextDay >= emergency.day) {
      // Check emergency coverage BEFORE showing it
      const covered = balance >= emergency.cost;
      setHadEmergencyBonus(covered);
      setEmergencyHandled(true);
      setCurrentDay(emergency.day);
      setScreen('emergency');
      setEventIndex(nextIndex);
      return;
    }

    if (!nextEvent) {
      // No more events — go to results
      setScreen('results');
      return;
    }

    setEventIndex(nextIndex);
    setCurrentDay(nextEvent.day);
  }

  function handleEmergencyPay() {
    const newBalance = balance - emergency.cost;
    setBalance(newBalance);
    triggerBalanceAnimation();
    const covered = hadEmergencyBonus; // was already evaluated before screen change
    setEmergencyResult(covered ? 'covered' : 'debt');
  }

  function handleAfterEmergency() {
    const nextEvent = allEvents[eventIndex];
    if (!nextEvent) {
      setScreen('results');
      return;
    }
    setCurrentDay(nextEvent.day);
    setScreen('game');
  }

  function handleFinalize() {
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;
    const score = computeScore(balance, hadEmergencyBonus);
    onComplete(score);
  }

  // ── Lesson based on score ──────────────────────────────────────────────────

  function getLessonData(finalBalance: number, bonus: boolean): { emoji: string; title: string; message: string } {
    const score = computeScore(finalBalance, bonus);
    if (score >= 80) {
      return {
        emoji: '🏆',
        title: '¡Tesorero Estrella!',
        message:
          'Administraste muy bien el dinero de la Familia Ramirez. Tomaste decisiones inteligentes y hasta tuviste dinero para emergencias. ¡Eres un experto en presupuesto!',
      };
    } else if (score >= 50) {
      return {
        emoji: '👍',
        title: '¡Buen Trabajo!',
        message:
          'Manejaste el dinero de manera aceptable. Algunas decisiones fueron buenas, pero todavia hay oportunidad de ahorrar mas para las emergencias del hogar.',
      };
    } else {
      return {
        emoji: '📚',
        title: 'Hay que Aprender Mas',
        message:
          'La familia gasto demasiado y termino con deudas. Recuerda: siempre reserva una parte del dinero para emergencias antes de gastar en extras.',
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: START SCREEN
  // ──────────────────────────────────────────────────────────────────────────

  if (screen === 'start') {
    return (
      <div className="min-h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8">
          {/* Hero */}
          <div className="space-y-3">
            <div className="text-7xl animate-bounce">🏠</div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest leading-tight">
              {content.family_name}
            </h1>
            <p className="text-purple-300 font-bold text-lg">Mes Financiero</p>
          </div>

          {/* Role card */}
          <div className="rounded-3xl border border-purple-500/30 bg-white/5 p-6 space-y-4 text-left">
            <p className="text-white font-black text-base uppercase tracking-widest">
              🎖️ Tu rol: Tesorero Familiar
            </p>
            <p className="text-white/70 font-bold text-sm leading-relaxed">
              Ayuda a la Familia Ramirez a administrar su dinero durante 30 dias. Tomaras 10 decisiones
              importantes y debes llegar al final del mes sin deudas. ¡Cuidado con la emergencia del dia {emergency.day}!
            </p>
          </div>

          {/* Income breakdown */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/70 text-xs font-black uppercase tracking-widest">Finanzas del mes</p>
            <div className="flex justify-between items-center">
              <span className="text-white/70 font-bold text-sm">💵 Ingreso mensual</span>
              <span className="text-emerald-300 font-black text-lg">{formatMXN(content.monthly_income)}</span>
            </div>
            {(content.fixed_expenses || []).map((fe, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-white/50 font-bold text-sm">📌 {fe.label}</span>
                <span className="text-red-300 font-black text-sm">-{formatMXN(fe.amount)}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white font-black text-sm uppercase">💰 Saldo libre inicial</span>
              <span className="text-yellow-300 font-black text-xl">{formatMXN(initialBalance)}</span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest px-6 py-4 text-base transition-all duration-300 hover:scale-105 active:scale-95 min-h-[56px]"
          >
            ¡Comenzar! 🚀
          </button>

          <p className="text-white/30 text-xs font-bold">
            {allEvents.length} eventos · Dia de emergencia: {emergency.day}
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: EMERGENCY SCREEN
  // ──────────────────────────────────────────────────────────────────────────

  if (screen === 'emergency') {
    const covered = balance >= emergency.cost;
    return (
      <div className="min-h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Alert header */}
          <div className="text-center space-y-2">
            <div className="text-6xl animate-pulse">{emergency.emoji}</div>
            <div className="inline-block px-4 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-widest">
              ⚡ Emergencia del Hogar — Dia {emergency.day}
            </div>
          </div>

          {/* Event card */}
          <div className="rounded-3xl border border-red-500/30 bg-red-900/10 p-6 space-y-3">
            <p className="text-white font-black text-lg leading-snug">{emergency.description}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-white/60 font-bold text-sm">Costo obligatorio:</span>
              <span className="text-red-300 font-black text-2xl">{formatMXN(emergency.cost)}</span>
            </div>
          </div>

          {/* Balance status */}
          <div
            className={`rounded-3xl border p-5 space-y-2 ${
              covered
                ? 'border-emerald-500/30 bg-emerald-900/10'
                : 'border-red-500/30 bg-red-900/10'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-white/70 font-bold text-sm">Tu saldo actual:</span>
              <span className={`font-black text-xl ${balance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {formatMXN(balance)}
              </span>
            </div>
            {covered ? (
              <p className="text-emerald-300 font-black text-sm">
                🎉 ¡Tenias suficiente ahorrado! Bonus de 20 puntos por tu prevision.
              </p>
            ) : (
              <p className="text-red-300 font-bold text-sm">
                😬 No tienes suficiente... tendras que pagar con deuda. Esto baja tu puntaje.
              </p>
            )}
          </div>

          {/* Pay button or result */}
          {emergencyResult === null ? (
            <button
              onClick={handleEmergencyPay}
              className="w-full rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-6 py-4 text-base transition-all duration-300 hover:scale-105 active:scale-95 min-h-[56px]"
            >
              💸 Pagar la Emergencia
            </button>
          ) : (
            <div className="space-y-4">
              <div
                className={`rounded-3xl border p-5 text-center ${
                  emergencyResult === 'covered'
                    ? 'border-emerald-500/30 bg-emerald-900/10'
                    : 'border-red-500/30 bg-red-900/10'
                }`}
              >
                <p
                  className={`font-black text-2xl mb-1 ${
                    emergencyResult === 'covered' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {emergencyResult === 'covered' ? '✅ Pagado sin deuda' : '⚠️ Pagado con deuda'}
                </p>
                <p className="text-white/60 font-bold text-sm">Nuevo saldo: {formatMXN(balance)}</p>
              </div>
              <button
                onClick={handleAfterEmergency}
                className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest px-6 py-4 text-base transition-all duration-300 hover:scale-105 active:scale-95 min-h-[56px]"
              >
                Continuar el Mes →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: RESULTS SCREEN
  // ──────────────────────────────────────────────────────────────────────────

  if (screen === 'results') {
    const finalScore = computeScore(balance, hadEmergencyBonus);
    const lesson = getLessonData(balance, hadEmergencyBonus);
    const totalSpent = decisions.reduce((s, d) => s + d.cost, 0) + emergency.cost;

    return (
      <div className="min-h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Score hero */}
          <div className="text-center space-y-3">
            <div className="text-6xl">{lesson.emoji}</div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">{lesson.title}</h2>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600/20 border border-purple-500/30">
              <span className="text-purple-300 font-black text-xs uppercase tracking-widest">Puntaje final</span>
              <span className="text-white font-black text-2xl">{finalScore}</span>
              <span className="text-white/50 font-bold text-xs">/ 100</span>
            </div>
          </div>

          {/* Score bar */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="h-5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  finalScore >= 80
                    ? 'bg-emerald-400'
                    : finalScore >= 50
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${finalScore}%` }}
              />
            </div>
            {hadEmergencyBonus && (
              <p className="text-emerald-300 text-xs font-black">⚡ +20 puntos por tener fondo de emergencia 🎉</p>
            )}
          </div>

          {/* Summary numbers */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/50 text-xs font-black uppercase tracking-widest">Resumen del Mes</p>
            <div className="flex justify-between items-center">
              <span className="text-white/70 font-bold text-sm">💵 Ingreso total</span>
              <span className="text-emerald-300 font-black">{formatMXN(content.monthly_income)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 font-bold text-sm">📌 Gastos fijos</span>
              <span className="text-red-300 font-black">-{formatMXN(totalFixedExpenses)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 font-bold text-sm">🛒 Gastos por decisiones</span>
              <span className="text-yellow-300 font-black">-{formatMXN(totalSpent)}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-white font-black text-sm uppercase">Balance final</span>
              <span
                className={`font-black text-xl ${
                  balance >= 0 ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                {formatMXN(balance)}
              </span>
            </div>
          </div>

          {/* Decision log */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="text-white/50 text-xs font-black uppercase tracking-widest mb-3">Tus Decisiones</p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {decisions.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span className="text-xl flex-shrink-0">{d.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-wider">
                      Dia {d.day}
                    </p>
                    <p className="text-white font-bold text-xs truncate">{d.choiceLabel}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className={`font-black text-sm ${d.cost === 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      -{formatMXN(d.cost)}
                    </span>
                    <span>{moodEmoji(d.mood_effect)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson */}
          <div className="rounded-3xl border border-purple-500/30 bg-purple-900/10 p-5">
            <p className="text-purple-300 font-black text-xs uppercase tracking-widest mb-2">
              💡 Leccion Aprendida
            </p>
            <p className="text-white/80 font-bold text-sm leading-relaxed">{lesson.message}</p>
          </div>

          {/* Finalize button */}
          <button
            onClick={handleFinalize}
            className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest px-6 py-4 text-base transition-all duration-300 hover:scale-105 active:scale-95 min-h-[56px]"
          >
            Finalizar 🏁
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: GAME SCREEN
  // ──────────────────────────────────────────────────────────────────────────

  if (!currentEvent) {
    // No more events — go to results automatically
    return (
      <div className="min-h-screen w-full bg-[#0a0a1a] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-spin">⏳</div>
          <p className="text-white font-black text-xl">Calculando resultados...</p>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((eventIndex / allEvents.length) * 100);

  return (
    <div className="min-h-screen w-full bg-[#0a0a1a] flex flex-col p-4 pb-8">
      <div className="max-w-md w-full mx-auto space-y-4">

        {/* Top bar: saldo */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
            💰 Saldo Disponible
          </p>
          <p
            className={[
              'text-5xl font-black transition-all duration-300',
              balance >= 0 ? 'text-emerald-300' : 'text-red-400',
              animateBalance ? 'scale-110' : 'scale-100',
            ].join(' ')}
          >
            {formatMXN(balance)}
          </p>
        </div>

        {/* Calendar */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
          <CalendarDots
            totalDays={totalCalendarDays}
            currentDay={currentDay}
            emergencyDay={emergency.day}
          />
          <EmergencyBar balance={balance} emergencyCost={emergency.cost} />
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
            <span>Evento {eventIndex + 1} de {allEvents.length}</span>
            <span>{progressPct}% completado</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Event card */}
        {!showFeedback ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-4xl flex-shrink-0">{currentEvent.emoji}</div>
              <div>
                <p className="text-yellow-300 text-[10px] font-black uppercase tracking-widest mb-1">
                  Dia {currentEvent.day}
                </p>
                <p className="text-white font-black text-lg leading-snug">
                  {currentEvent.description}
                </p>
              </div>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {currentEvent.choices.map((choice, idx) => {
                const isSelected = selectedChoice === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleChoiceSelect(idx)}
                    className={[
                      'w-full text-left rounded-2xl border p-4 transition-all duration-200 min-h-[64px]',
                      'flex items-center gap-3',
                      isSelected
                        ? 'border-purple-400 bg-purple-600/20 scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 active:scale-95',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
                        isSelected
                          ? 'border-purple-400 bg-purple-500'
                          : 'border-white/20 bg-transparent',
                      ].join(' ')}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm leading-snug">{choice.label}</p>
                    </div>
                    <span className={`font-black text-base flex-shrink-0 ${costColor(choice.cost)}`}>
                      {choice.cost === 0 ? '¡Gratis!' : `-${formatMXN(choice.cost)}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirmChoice}
              disabled={selectedChoice === null}
              className={[
                'w-full rounded-2xl font-black uppercase tracking-widest px-6 py-4 text-base transition-all duration-300 min-h-[56px]',
                selectedChoice !== null
                  ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-white/10 text-white/40 cursor-not-allowed',
              ].join(' ')}
            >
              Confirmar Decision ✅
            </button>
          </div>
        ) : (
          /* Feedback card */
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5 animate-pulse">
            <div className="text-center space-y-2">
              <div className="text-5xl">
                {selectedChoice !== null
                  ? moodEmoji(currentEvent.choices[selectedChoice].mood_effect)
                  : '👍'}
              </div>
              <p className="text-white font-black text-lg">{feedbackMsg}</p>
            </div>

            {/* Chosen option recap */}
            {selectedChoice !== null && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
                  Elegiste
                </p>
                <p className="text-white font-bold text-sm">
                  {currentEvent.choices[selectedChoice].label}
                </p>
                <p
                  className={`font-black text-lg mt-1 ${
                    currentEvent.choices[selectedChoice].cost === 0
                      ? 'text-emerald-300'
                      : 'text-red-300'
                  }`}
                >
                  {currentEvent.choices[selectedChoice].cost === 0
                    ? '¡Sin costo! 🎉'
                    : `-${formatMXN(currentEvent.choices[selectedChoice].cost)}`}
                </p>
                <p
                  className={`text-xs font-black mt-1 ${moodColor(
                    currentEvent.choices[selectedChoice].mood_effect,
                  )}`}
                >
                  Estado de animo: {currentEvent.choices[selectedChoice].mood_effect === 'positive'
                    ? '😊 Contento'
                    : currentEvent.choices[selectedChoice].mood_effect === 'negative'
                    ? '😟 Preocupado'
                    : '😐 Normal'}
                </p>
              </div>
            )}

            <button
              onClick={handleNextEvent}
              className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest px-6 py-4 text-base transition-all duration-300 hover:scale-105 active:scale-95 min-h-[56px]"
            >
              Siguiente Dia →
            </button>
          </div>
        )}

        {/* Bottom: saldo + days remaining hint */}
        <div className="text-center">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
            {emergencyHandled ? '⚡ Emergencia resuelta' : `⚡ Emergencia en dia ${emergency.day}`}
          </p>
        </div>
      </div>
    </div>
  );
}
