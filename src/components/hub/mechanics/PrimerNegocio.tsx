'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── Content shape ────────────────────────────────────────────────────────────

interface PriceOption {
  label: string;
  price: number;
}

interface InventoryOption {
  label: string;
  units: number;
  cost: number;
}

interface Location {
  name: string;
  emoji: string;
  description: string;
  base_demand_per_day: number;
}

interface DailyEvent {
  emoji: string;
  description: string;
  demand_modifier: number;
}

interface PrimerNegocioContent {
  product: string;
  capital: number;
  unit_cost: number;
  unit_price_options: PriceOption[];
  inventory_options: InventoryOption[];
  locations: Location[];
  daily_events: DailyEvent[];
}

// ─── Game state types ─────────────────────────────────────────────────────────

type Phase = 'start' | 'plan_inventory' | 'plan_price' | 'plan_location' | 'operation' | 'results';

interface DayResult {
  day: number;
  event: DailyEvent;
  unitsSold: number;
  unitsWasted: number;
  revenue: number;
  wasStockedOut: boolean;
}

interface Plan {
  inventory: InventoryOption | null;
  price: PriceOption | null;
  location: Location | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PrimerNegocio({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  // `activity.content` can be missing/malformed — fall back to safe defaults
  // so the game never crashes on undefined property access (matches the
  // defensive pattern used by the other mechanics in this family).
  const rawContent = activity.content as unknown as Partial<PrimerNegocioContent> | null | undefined;
  const content: PrimerNegocioContent = {
    product: rawContent?.product ?? 'tu producto',
    capital: rawContent?.capital && rawContent.capital > 0 ? rawContent.capital : 100,
    unit_cost: rawContent?.unit_cost ?? 0,
    unit_price_options: rawContent?.unit_price_options ?? [],
    inventory_options: rawContent?.inventory_options ?? [],
    locations: rawContent?.locations ?? [],
    daily_events:
      rawContent?.daily_events && rawContent.daily_events.length > 0
        ? rawContent.daily_events
        : [{ emoji: '📅', description: 'Un día normal en el mercado.', demand_modifier: 1 }],
  };

  const TOTAL_DAYS = 5;

  // Phase
  const [phase, setPhase] = useState<Phase>('start');

  // Planning
  const [plan, setPlan] = useState<Plan>({ inventory: null, price: null, location: null });

  // Operation
  const [currentDay, setCurrentDay] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<DailyEvent | null>(null);
  const [dayResults, setDayResults] = useState<DayResult[]>([]);
  const [unitsRemaining, setUnitsRemaining] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showingDayAnim, setShowingDayAnim] = useState(false);
  const [dayAnimStep, setDayAnimStep] = useState<'event' | 'selling' | 'summary'>('event');
  const [pendingDay, setPendingDay] = useState<DayResult | null>(null);

  // Results
  const [finalScore, setFinalScore] = useState(0);

  // Guards against a timer leak (delayed operation start) and duplicate
  // onComplete/XP calls if the "Finalizar" button is clicked more than once.
  const startOperationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (startOperationTimeoutRef.current) {
        clearTimeout(startOperationTimeoutRef.current);
      }
    };
  }, []);

  // ─── Score calculation ────────────────────────────────────────────────────

  const calculateFinalScore = useCallback(
    (revenue: number, inventoryCost: number): number => {
      const profit = revenue - inventoryCost;
      // Guard against division by zero if capital is ever 0/undefined.
      const capital = content.capital > 0 ? content.capital : 1;
      const raw = (profit / capital) * 100 + 50;
      return Math.round(clamp(raw, 0, 100));
    },
    [content.capital]
  );

  // ─── Simulate a single day ─────────────────────────────────────────────────

  const simulateDay = useCallback(
    (dayNum: number, remaining: number, event: DailyEvent): DayResult => {
      const location = plan.location!;
      const priceOpt = plan.price!;

      // Price modifier: barato => more demand, caro => less demand
      const priceOptions = content.unit_price_options;
      const minPrice = Math.min(...priceOptions.map((p) => p.price));
      const maxPrice = Math.max(...priceOptions.map((p) => p.price));
      const priceRange = maxPrice - minPrice || 1;
      // 0.8..1.3 modifier — cheaper sells more
      const priceModifier = 1.3 - ((priceOpt.price - minPrice) / priceRange) * 0.5;

      const rawDemand = location.base_demand_per_day * priceModifier * event.demand_modifier;
      const demandInt = Math.round(rawDemand + (Math.random() - 0.5) * rawDemand * 0.3);
      const demand = Math.max(0, demandInt);

      const unitsSold = Math.min(demand, remaining);
      const wasStockedOut = demand > remaining;
      const unitsWasted = Math.max(0, remaining - demand);

      const revenue = unitsSold * priceOpt.price;

      return {
        day: dayNum,
        event,
        unitsSold,
        unitsWasted,
        revenue,
        wasStockedOut,
      };
    },
    [plan, content.unit_price_options]
  );

  // ─── Start operation phase ────────────────────────────────────────────────

  const startOperation = useCallback(() => {
    setUnitsRemaining(plan.inventory!.units);
    setTotalRevenue(0);
    setDayResults([]);
    setCurrentDay(1);
    setPhase('operation');
    const event = pickRandom(content.daily_events);
    setCurrentEvent(event);
    setDayAnimStep('event');
    setShowingDayAnim(false);
  }, [plan, content.daily_events]);

  // ─── Advance day animation ────────────────────────────────────────────────

  const handleDayAnimAdvance = useCallback(() => {
    if (dayAnimStep === 'event') {
      setDayAnimStep('selling');
    } else if (dayAnimStep === 'selling') {
      // Compute result
      const result = simulateDay(currentDay, unitsRemaining, currentEvent!);
      setPendingDay(result);
      setDayAnimStep('summary');
    } else if (dayAnimStep === 'summary') {
      // Commit result
      const result = pendingDay!;
      const newRemaining = Math.max(0, unitsRemaining - result.unitsSold);
      const newRevenue = totalRevenue + result.revenue;
      setUnitsRemaining(newRemaining);
      setTotalRevenue(newRevenue);
      setDayResults((prev) => [...prev, result]);

      if (currentDay >= TOTAL_DAYS || newRemaining === 0) {
        // End of operation — check if we have to waste remaining
        const finalRevenue = newRevenue;
        const inventoryCost = plan.inventory!.cost;
        const score = calculateFinalScore(finalRevenue, inventoryCost);
        setFinalScore(score);
        setPhase('results');
      } else {
        // Next day
        const nextDay = currentDay + 1;
        setCurrentDay(nextDay);
        const event = pickRandom(content.daily_events);
        setCurrentEvent(event);
        setDayAnimStep('event');
        setPendingDay(null);
      }
    }
  }, [
    dayAnimStep,
    currentDay,
    currentEvent,
    unitsRemaining,
    totalRevenue,
    pendingDay,
    simulateDay,
    plan,
    calculateFinalScore,
    content.daily_events,
  ]);

  // ─── Computed totals for results ─────────────────────────────────────────

  const totalUnitsWasted = dayResults.reduce((s, d) => s + d.unitsWasted, 0);
  const totalUnitsSold = dayResults.reduce((s, d) => s + d.unitsSold, 0);
  const inventoryCost = plan.inventory?.cost ?? 0;
  const profit = totalRevenue - inventoryCost;

  // ─── Progress bar width ───────────────────────────────────────────────────

  const progressPct =
    plan.inventory
      ? Math.round(((plan.inventory.units - unitsRemaining) / plan.inventory.units) * 100)
      : 0;

  // ─── Render helpers ───────────────────────────────────────────────────────

  const PhaseIndicator = () => (
    <div className="flex gap-2 justify-center mb-4">
      {(['plan_inventory', 'plan_price', 'plan_location', 'operation', 'results'] as Phase[]).map(
        (p, i) => {
          const isDone =
            (p === 'plan_inventory' &&
              ['plan_price', 'plan_location', 'operation', 'results'].includes(phase)) ||
            (p === 'plan_price' &&
              ['plan_location', 'operation', 'results'].includes(phase)) ||
            (p === 'plan_location' && ['operation', 'results'].includes(phase)) ||
            (p === 'operation' && phase === 'results');
          const isCurrent = phase === p;
          return (
            <div
              key={p}
              className={`h-2 rounded-full transition-all duration-500 ${
                isDone
                  ? 'bg-emerald-400 w-8'
                  : isCurrent
                  ? 'bg-purple-400 w-8 animate-pulse'
                  : 'bg-white/20 w-4'
              }`}
            />
          );
        }
      )}
    </div>
  );

  // ─── START SCREEN ─────────────────────────────────────────────────────────

  if (phase === 'start') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="text-8xl mb-4 animate-bounce">🥤</div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-widest">
            Mi Primer Negocio
          </h1>
          <p className="text-purple-300 font-bold text-lg mb-2">Temporada Alta</p>
          <p className="text-white/70 font-bold text-sm mb-6">
            El Día del Niño se acerca y quieres vender {content.product}. ¡Tienes{' '}
            <span className="text-emerald-300">${content.capital}</span> para empezar!
          </p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 text-left">
            <h2 className="text-purple-300 font-black text-sm uppercase tracking-widest mb-3">
              ¿Cómo se juega?
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <p className="text-white/70 text-sm font-bold">
                  <span className="text-white">Fase 1:</span> Planea tu negocio — elige cuánto
                  comprar, a qué precio vender y dónde poner tu puesto.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏪</span>
                <p className="text-white/70 text-sm font-bold">
                  <span className="text-white">Fase 2:</span> ¡5 días de ventas! Cada día trae
                  sorpresas — lluvias, fiestas, competidores...
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <p className="text-white/70 text-sm font-bold">
                  <span className="text-white">Fase 3:</span> Ve cuánto ganaste y aprende las
                  lecciones del negocio.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('plan_inventory')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-lg rounded-2xl px-6 py-4 transition-all duration-300 min-h-[56px]"
          >
            ¡Abrir Mi Negocio! 🚀
          </button>
        </div>
      </div>
    );
  }

  // ─── PLAN: INVENTORY ──────────────────────────────────────────────────────

  if (phase === 'plan_inventory') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-start p-6 pt-8">
        <div className="max-w-lg w-full">
          <PhaseIndicator />
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📦</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              Paso 1 de 3
            </h2>
            <p className="text-purple-300 font-bold text-sm mt-1">¿Cuánto producto vas a comprar?</p>
            <p className="text-white/40 text-xs mt-1 font-bold">
              Tienes <span className="text-emerald-300">${content.capital}</span> de capital inicial
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {content.inventory_options.map((opt) => {
              const canAfford = opt.cost <= content.capital;
              return (
                <button
                  key={opt.label}
                  disabled={!canAfford}
                  onClick={() => {
                    setPlan((p) => ({ ...p, inventory: opt }));
                    setPhase('plan_price');
                  }}
                  className={`w-full text-left rounded-3xl border p-5 transition-all duration-300 min-h-[72px] ${
                    canAfford
                      ? 'border-purple-500/30 bg-white/5 hover:bg-purple-600/20 hover:border-purple-400/60 cursor-pointer'
                      : 'border-white/10 bg-white/2 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-lg">{opt.label}</p>
                      <p className="text-white/70 text-sm font-bold">
                        {opt.units} unidades
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-black text-xl ${
                          canAfford ? 'text-emerald-300' : 'text-red-400'
                        }`}
                      >
                        ${opt.cost}
                      </p>
                      <p className="text-white/40 text-xs font-bold">costo total</p>
                    </div>
                  </div>
                  {!canAfford && (
                    <p className="text-red-400 text-xs font-black mt-1">
                      ❌ No tienes suficiente capital
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">
              Consejo 💡
            </p>
            <p className="text-white/70 text-sm font-bold">
              Si compras poco, te puedes quedar sin producto. Si compras mucho, lo que no vendas se
              echa a perder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAN: PRICE ─────────────────────────────────────────────────────────

  if (phase === 'plan_price') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-start p-6 pt-8">
        <div className="max-w-lg w-full">
          <PhaseIndicator />
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🏷️</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              Paso 2 de 3
            </h2>
            <p className="text-purple-300 font-bold text-sm mt-1">
              ¿A qué precio vas a vender cada {content.product.toLowerCase().split(' ')[0]}?
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {content.unit_price_options.map((opt, idx) => {
              const emojis = ['😊', '👍', '💎'];
              const colors = [
                'border-blue-500/40 hover:border-blue-400/70 hover:bg-blue-600/20',
                'border-purple-500/40 hover:border-purple-400/70 hover:bg-purple-600/20',
                'border-yellow-500/40 hover:border-yellow-400/70 hover:bg-yellow-600/20',
              ];
              const textColors = ['text-blue-300', 'text-purple-300', 'text-yellow-300'];
              return (
                <button
                  key={opt.label}
                  onClick={() => {
                    setPlan((p) => ({ ...p, price: opt }));
                    setPhase('plan_location');
                  }}
                  className={`w-full text-left rounded-3xl border bg-white/5 p-5 transition-all duration-300 min-h-[72px] ${colors[idx]} cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{emojis[idx]}</span>
                      <div>
                        <p className="text-white font-black text-lg">{opt.label}</p>
                        <p className="text-white/40 text-xs font-bold">
                          {idx === 0
                            ? 'Atraes más clientes'
                            : idx === 1
                            ? 'Equilibrio perfecto'
                            : 'Menos clientes, más ganancia por vaso'}
                        </p>
                      </div>
                    </div>
                    <p className={`font-black text-2xl ${textColors[idx]}`}>${opt.price}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">
              Consejo 💡
            </p>
            <p className="text-white/70 text-sm font-bold">
              Si cobras muy barato, vendes mucho pero ganas poco. Si cobras muy caro, ganas más por
              vaso pero vienen menos clientes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAN: LOCATION ───────────────────────────────────────────────────────

  if (phase === 'plan_location') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-start p-6 pt-8">
        <div className="max-w-lg w-full">
          <PhaseIndicator />
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📍</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">
              Paso 3 de 3
            </h2>
            <p className="text-purple-300 font-bold text-sm mt-1">
              ¿Dónde vas a poner tu puesto?
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {content.locations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => {
                  setPlan((p) => ({ ...p, location: loc }));
                  // Slight delay for UX
                  if (startOperationTimeoutRef.current) {
                    clearTimeout(startOperationTimeoutRef.current);
                  }
                  startOperationTimeoutRef.current = setTimeout(() => {
                    startOperationTimeoutRef.current = null;
                    startOperation();
                  }, 150);
                }}
                className="w-full text-left rounded-3xl border border-purple-500/30 bg-white/5 hover:bg-purple-600/20 hover:border-purple-400/60 p-5 transition-all duration-300 min-h-[80px] cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{loc.emoji}</span>
                  <div className="flex-1">
                    <p className="text-white font-black text-lg">{loc.name}</p>
                    <p className="text-white/70 text-sm font-bold">{loc.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-4 rounded-full ${
                              i < Math.round(loc.base_demand_per_day / (content.locations.reduce((a,b)=>a+b.base_demand_per_day,0)/content.locations.length) * 2.5)
                                ? 'bg-purple-400'
                                : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-white/40 text-xs font-black">demanda estimada</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">
              Tu plan hasta ahora 📋
            </p>
            <div className="flex gap-4 flex-wrap">
              {plan.inventory && (
                <span className="text-white/70 text-sm font-bold">
                  📦 {plan.inventory.label} ({plan.inventory.units} uds)
                </span>
              )}
              {plan.price && (
                <span className="text-white/70 text-sm font-bold">
                  🏷️ ${plan.price.price} c/u
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── OPERATION PHASE ─────────────────────────────────────────────────────

  if (phase === 'operation') {
    const inventoryTotal = plan.inventory!.units;
    const barPct = Math.round((unitsRemaining / inventoryTotal) * 100);

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-start p-6 pt-8">
        <div className="max-w-lg w-full">
          <PhaseIndicator />

          {/* Day counter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                    i + 1 < currentDay
                      ? 'bg-emerald-500 text-white'
                      : i + 1 === currentDay
                      ? 'bg-purple-500 text-white animate-pulse'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {i + 1 < currentDay ? '✓' : i + 1}
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs font-black">Inventario</p>
              <p className="text-emerald-300 font-black">
                {unitsRemaining}/{inventoryTotal}
              </p>
            </div>
          </div>

          {/* Inventory bar */}
          <div className="bg-white/10 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${barPct}%` }}
            />
          </div>

          {/* Day card */}
          <div className="bg-white/5 border border-purple-500/30 rounded-3xl p-6 mb-4 text-center min-h-[280px] flex flex-col items-center justify-between">
            <div>
              <p className="text-purple-300 font-black text-xs uppercase tracking-widest mb-3">
                Día {currentDay} de {TOTAL_DAYS}
              </p>

              {dayAnimStep === 'event' && currentEvent && (
                <div className="animate-bounce">
                  <div className="text-8xl mb-4">{currentEvent.emoji}</div>
                  <h3 className="text-white font-black text-xl mb-2">¡Evento del día!</h3>
                  <p className="text-white/70 font-bold text-base">{currentEvent.description}</p>
                  <div className="mt-3">
                    {currentEvent.demand_modifier >= 1.2 ? (
                      <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black px-3 py-1 rounded-full">
                        ↑ Más clientes hoy
                      </span>
                    ) : currentEvent.demand_modifier <= 0.6 ? (
                      <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black px-3 py-1 rounded-full">
                        ↓ Menos clientes hoy
                      </span>
                    ) : (
                      <span className="bg-white/10 border border-white/20 text-white/70 text-xs font-black px-3 py-1 rounded-full">
                        → Día normal
                      </span>
                    )}
                  </div>
                </div>
              )}

              {dayAnimStep === 'selling' && (
                <div>
                  <div className="text-7xl mb-3 animate-pulse">🏪</div>
                  <h3 className="text-white font-black text-xl mb-2">¡Vendiendo!</h3>
                  <div className="flex justify-center gap-2 flex-wrap mt-3">
                    {Array.from({ length: Math.min(8, unitsRemaining) }).map((_, i) => (
                      <span
                        key={i}
                        className="text-2xl"
                        style={{
                          animation: `pulse ${0.3 + i * 0.1}s ease-in-out infinite alternate`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      >
                        🥤
                      </span>
                    ))}
                    {unitsRemaining > 8 && (
                      <span className="text-white/40 font-black text-sm self-center">
                        +{unitsRemaining - 8} más
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm font-bold mt-3 animate-pulse">
                    Clientes llegando...
                  </p>
                </div>
              )}

              {dayAnimStep === 'summary' && pendingDay && (
                <div>
                  <div
                    className={`text-6xl mb-3 ${
                      pendingDay.wasStockedOut ? 'animate-bounce' : ''
                    }`}
                  >
                    {pendingDay.unitsSold === 0
                      ? '😔'
                      : pendingDay.wasStockedOut
                      ? '🎉'
                      : pendingDay.unitsWasted > pendingDay.unitsSold
                      ? '😬'
                      : '😊'}
                  </div>
                  <h3 className="text-white font-black text-xl mb-3">Resultado del Día</h3>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                      <p className="text-emerald-300 font-black text-xs uppercase tracking-widest">
                        Vendiste
                      </p>
                      <p className="text-white font-black text-2xl">{pendingDay.unitsSold}</p>
                      <p className="text-white/40 text-xs font-bold">unidades</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3">
                      <p className="text-purple-300 font-black text-xs uppercase tracking-widest">
                        Ganaste
                      </p>
                      <p className="text-white font-black text-2xl">${pendingDay.revenue}</p>
                      <p className="text-white/40 text-xs font-bold">hoy</p>
                    </div>
                    {pendingDay.unitsWasted > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 col-span-2">
                        <p className="text-red-300 font-black text-xs uppercase tracking-widest">
                          Se echaron a perder
                        </p>
                        <p className="text-white font-black text-xl">
                          {pendingDay.unitsWasted} unidades 😢
                        </p>
                      </div>
                    )}
                    {pendingDay.wasStockedOut && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-3 col-span-2">
                        <p className="text-yellow-300 font-black text-xs uppercase tracking-widest">
                          ¡Agotado! 🎉
                        </p>
                        <p className="text-white/70 font-bold text-sm">
                          Había más clientes pero ya no tenías producto
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleDayAnimAdvance}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl px-6 py-3 transition-all duration-300 min-h-[48px]"
            >
              {dayAnimStep === 'event'
                ? '¡A vender! 🏃'
                : dayAnimStep === 'selling'
                ? 'Ver resultados 📊'
                : currentDay >= TOTAL_DAYS || Math.max(0, unitsRemaining - (pendingDay?.unitsSold ?? 0)) === 0
                ? 'Ver ganancias totales 💰'
                : `Día ${currentDay + 1} → `}
            </button>
          </div>

          {/* Running totals */}
          {dayResults.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">
                Acumulado 💰
              </p>
              <div className="flex justify-between">
                <span className="text-white/70 font-bold text-sm">
                  Vendido: {dayResults.reduce((s, d) => s + d.unitsSold, 0)} uds
                </span>
                <span className="text-emerald-300 font-black">
                  ${dayResults.reduce((s, d) => s + d.revenue, 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS PHASE ────────────────────────────────────────────────────────

  if (phase === 'results') {
    const isProfit = profit > 0;
    const profitPct = inventoryCost > 0 ? Math.round((profit / inventoryCost) * 100) : 0;

    let lesson = '';
    let lessonEmoji = '';
    if (profit <= 0) {
      lesson =
        'Esta vez perdiste dinero. En los negocios, a veces las cosas no salen como esperamos. ¡Pero aprendiste muchísimo!';
      lessonEmoji = '📚';
    } else if (profitPct < 30) {
      lesson =
        'Ganaste un poco, ¡pero hay mucho margen para mejorar! Con mejor planeación puedes ganar mucho más.';
      lessonEmoji = '📈';
    } else if (profitPct < 70) {
      lesson =
        '¡Buen trabajo! Tu negocio fue rentable. Cuando ganas más de lo que inviertes, eso se llama utilidad.';
      lessonEmoji = '🎉';
    } else {
      lesson =
        '¡INCREÍBLE! Eres un empresario natural. Supiste comprar, poner el precio correcto y elegir el mejor lugar.';
      lessonEmoji = '🏆';
    }

    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-start p-6 pt-8 pb-16">
        <div className="max-w-lg w-full">
          <PhaseIndicator />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-7xl mb-3">{isProfit ? '🎊' : '😔'}</div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">
              {isProfit ? '¡Cerraste tu negocio!' : 'Fin de la Semana'}
            </h2>
            <p className="text-purple-300 font-bold text-sm mt-1">Estado de Resultados</p>
          </div>

          {/* Financial summary card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-4">
            <h3 className="text-white/40 font-black text-xs uppercase tracking-widest mb-4">
              Resumen Financiero
            </h3>

            <div className="space-y-3">
              {/* Revenue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💵</span>
                  <span className="text-white/70 font-bold">Ventas totales</span>
                </div>
                <span className="text-emerald-300 font-black text-xl">+${totalRevenue}</span>
              </div>

              {/* Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📦</span>
                  <span className="text-white/70 font-bold">Costo de inventario</span>
                </div>
                <span className="text-red-300 font-black text-xl">-${inventoryCost}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{isProfit ? '🏆' : '😢'}</span>
                    <span className="text-white font-black text-lg">
                      {isProfit ? 'GANANCIA' : 'PÉRDIDA'}
                    </span>
                  </div>
                  <span
                    className={`font-black text-2xl ${
                      isProfit ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {isProfit ? '+' : ''}${profit}
                  </span>
                </div>
                {isProfit && (
                  <p className="text-white/40 text-xs font-black text-right mt-1">
                    {profitPct}% de retorno sobre tu inversión
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <p className="text-white font-black text-xl">{totalUnitsSold}</p>
              <p className="text-white/40 text-xs font-black">Vendidas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <p className="text-red-300 font-black text-xl">{totalUnitsWasted}</p>
              <p className="text-white/40 text-xs font-black">Perdidas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <p className="text-purple-300 font-black text-xl">{TOTAL_DAYS}</p>
              <p className="text-white/40 text-xs font-black">Días</p>
            </div>
          </div>

          {/* Day-by-day breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">
              Historial de la semana
            </p>
            <div className="space-y-2">
              {dayResults.map((d) => (
                <div key={d.day} className="flex items-center gap-2">
                  <span className="text-lg w-6 text-center">{d.event.emoji}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${plan.inventory ? Math.min(100, (d.unitsSold / plan.inventory.units) * 100 * 2) : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-emerald-300 font-black text-sm w-14 text-right">
                    +${d.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson */}
          <div
            className={`border rounded-3xl p-5 mb-6 ${
              isProfit
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{lessonEmoji}</span>
              <div>
                <p
                  className={`font-black text-sm uppercase tracking-widest mb-1 ${
                    isProfit ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  Lección del negocio
                </p>
                <p className="text-white/70 font-bold text-sm">{lesson}</p>
              </div>
            </div>
          </div>

          {/* Score display */}
          <div className="text-center mb-6">
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">
              Tu puntaje
            </p>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={finalScore >= 70 ? '#10b981' : finalScore >= 40 ? '#a855f7' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - finalScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute text-center">
                <p
                  className={`font-black text-3xl ${
                    finalScore >= 70 ? 'text-emerald-300' : finalScore >= 40 ? 'text-purple-300' : 'text-red-300'
                  }`}
                >
                  {finalScore}
                </p>
                <p className="text-white/40 text-xs font-black">pts</p>
              </div>
            </div>
          </div>

          {/* Finalizar */}
          <button
            onClick={() => {
              if (hasFinishedRef.current) return;
              hasFinishedRef.current = true;
              onComplete(finalScore);
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-lg rounded-2xl px-6 py-4 transition-all duration-300 min-h-[56px] animate-pulse"
          >
            Finalizar 🎓
          </button>
        </div>
      </div>
    );
  }

  return null;
}
