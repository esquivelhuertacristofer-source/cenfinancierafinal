'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── Content shape ────────────────────────────────────────────────────────────

interface PriceSpike {
  at_second: number;
  new_price: number;
}

interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  base_price: number;
  is_on_list: boolean;
  price_spike: PriceSpike | null;
}

interface SupermercadoContent {
  budget: number;
  time_limit: number;
  items: ShopItem[];
}

// ─── Runtime state for each item ─────────────────────────────────────────────

interface RuntimeItem extends ShopItem {
  current_price: number;
  spiked: boolean;
  spike_flash: boolean; // true for 2s after spike
}

interface CartEntry {
  item_id: string;
  name: string;
  emoji: string;
  price_paid: number;
  is_on_list: boolean;
}

type Screen = 'start' | 'game' | 'results';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toFixed(2);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SupermercadoCaos({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = activity.content as unknown as SupermercadoContent;
  const budget = content?.budget ?? 150;
  const timeLimit = content?.time_limit ?? 90;
  const sourceItems: ShopItem[] = content?.items ?? [];

  // ── Screens ──
  const [screen, setScreen] = useState<Screen>('start');

  // ── Timer ──
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Shop items with runtime state ──
  const [shopItems, setShopItems] = useState<RuntimeItem[]>([]);

  // ── Cart ──
  const [cart, setCart] = useState<CartEntry[]>([]);

  // ── Feedback toasts ──
  const [toasts, setToasts] = useState<{ id: number; msg: string; color: string }[]>([]);

  // ── Over-budget flash ──
  const [overBudgetFlash, setOverBudgetFlash] = useState(false);

  // ── Guard against double-clicking "Finalizar" and firing onComplete twice ──
  const hasFinishedRef = useRef(false);

  // ── Computed ──
  const spent = cart.reduce((s, e) => s + e.price_paid, 0);
  const remaining = budget - spent;
  const isOverBudget = remaining < 0;

  const listItems = sourceItems.filter((i) => i.is_on_list);
  const cartListItems = cart.filter((e) => e.is_on_list);
  const listItemsBought = new Set(cartListItems.map((e) => e.item_id));

  // ── Init shop ──
  const initShop = useCallback(() => {
    const runtime: RuntimeItem[] = sourceItems.map((item) => ({
      ...item,
      current_price: item.base_price,
      spiked: false,
      spike_flash: false,
    }));
    setShopItems(runtime);
    setCart([]);
    setTimeLeft(timeLimit);
    setToasts([]);
    setOverBudgetFlash(false);
  }, [sourceItems, timeLimit]);

  // ── Start game ──
  const startGame = useCallback(() => {
    initShop();
    setScreen('game');
  }, [initShop]);

  // ── Add toast ──
  const addToast = useCallback((msg: string, color: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, color }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  }, []);

  // ── Timer logic ──
  useEffect(() => {
    if (screen !== 'game') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setScreen('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  // ── Price spike logic ──
  useEffect(() => {
    if (screen !== 'game') return;

    setShopItems((prev) =>
      prev.map((item) => {
        if (item.price_spike && !item.spiked) {
          const elapsed = timeLimit - timeLeft;
          if (elapsed >= item.price_spike.at_second) {
            addToast(`📈 ¡${item.name} subio de precio!`, '#ef4444');
            return {
              ...item,
              current_price: item.price_spike.new_price,
              spiked: true,
              spike_flash: true,
            };
          }
        }
        return item;
      })
    );
  }, [timeLeft, screen, timeLimit, addToast]);

  // ── Clear spike_flash after 2s ──
  useEffect(() => {
    const flashing = shopItems.filter((i) => i.spike_flash);
    if (flashing.length === 0) return;

    const timer = setTimeout(() => {
      setShopItems((prev) => prev.map((i) => ({ ...i, spike_flash: false })));
    }, 2000);

    return () => clearTimeout(timer);
  }, [shopItems]);

  // ── Buy item ──
  const buyItem = useCallback(
    (item: RuntimeItem) => {
      if (screen !== 'game') return;

      // Check if already in cart (prevent double-buy of same item on list)
      if (item.is_on_list && listItemsBought.has(item.id)) {
        addToast('Ya lo tienes en tu carrito!', '#a855f7');
        return;
      }

      const newSpent = spent + item.current_price;
      if (newSpent > budget + 0.001) {
        // Over budget
        setOverBudgetFlash(true);
        setTimeout(() => setOverBudgetFlash(false), 600);
        addToast('No te alcanza el dinero!', '#ef4444');
        return;
      }

      setCart((prev) => [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          emoji: item.emoji,
          price_paid: item.current_price,
          is_on_list: item.is_on_list,
        },
      ]);

      if (item.is_on_list) {
        addToast(`${item.emoji} +${item.name}`, '#22c55e');
      } else {
        addToast(`${item.emoji} Extra: ${item.name}`, '#f59e0b');
      }

      // Check if list complete
      const newListBought = new Set([...listItemsBought, item.id]);
      const allDone = listItems.every((li) => newListBought.has(li.id));
      if (allDone) {
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          setScreen('results');
        }, 600);
      }
    },
    [screen, listItemsBought, spent, budget, listItems, addToast]
  );

  // ── Score calculation ──
  const calcScore = useCallback((): number => {
    const totalListItems = listItems.length;
    if (totalListItems === 0) return 100;

    const boughtCount = listItems.filter((li) => listItemsBought.has(li.id)).length;
    const completionRatio = boughtCount / totalListItems;

    // Savings bonus: compare what was spent on list items vs spike prices
    const spentOnList = cart
      .filter((e) => e.is_on_list)
      .reduce((s, e) => s + e.price_paid, 0);
    const maxListCost = listItems.reduce((s, li) => {
      const spikedPrice = li.price_spike ? li.price_spike.new_price : li.base_price;
      return s + spikedPrice;
    }, 0);
    const savings = maxListCost > 0 ? clamp(1 - spentOnList / maxListCost, 0, 1) : 0;

    // Penalty for buying non-list items (traps)
    const trapsBought = cart.filter((e) => !e.is_on_list).length;
    const trapPenalty = clamp(trapsBought * 5, 0, 20);

    const raw = completionRatio * 80 + savings * 20 - trapPenalty;
    return clamp(Math.round(raw), 0, 100);
  }, [listItems, listItemsBought, cart]);

  // ── Handle final button ──
  const handleFinalizar = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    onComplete(calcScore());
  }, [onComplete, calcScore]);

  // ── Timer color ──
  const timerColor =
    timeLeft <= 10
      ? '#ef4444'
      : timeLeft <= 30
      ? '#f59e0b'
      : '#22c55e';

  // ── Percentage width for timer bar ──
  const timerPct = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // START SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === 'start') {
    return (
      <div className="min-h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-white">
        {/* Big icon */}
        <div className="text-8xl mb-4 animate-bounce">🛒</div>

        <h1 className="text-3xl font-black uppercase tracking-widest text-center text-purple-300 mb-2">
          Supermercado
        </h1>
        <h2 className="text-4xl font-black uppercase tracking-widest text-center text-white mb-6">
          del Caos
        </h2>

        {/* Rules card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 max-w-sm w-full mb-8 space-y-3">
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-2xl">💰</span>
            <span>
              Presupuesto:{' '}
              <span className="text-emerald-300 font-black">${budget} pesos</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-2xl">⏱️</span>
            <span>
              Tiempo:{' '}
              <span className="text-purple-300 font-black">{timeLimit} segundos</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-2xl">📋</span>
            <span>
              Compra:{' '}
              <span className="text-yellow-300 font-black">{listItems.length} artículos</span> de
              la lista
            </span>
          </div>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-2xl">📈</span>
            <span className="text-white/70">¡Cuidado! Los precios pueden subir</span>
          </div>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="text-2xl">⚠️</span>
            <span className="text-white/70">Hay productos trampa con descuento falso</span>
          </div>
        </div>

        <button
          onClick={startGame}
          className="rounded-2xl font-black uppercase tracking-widest px-8 py-4 text-lg bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300 min-h-[56px] shadow-lg shadow-purple-900/50 active:scale-95"
        >
          ¡Empezar! 🚀
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RESULTS SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === 'results') {
    const finalScore = calcScore();
    const boughtListCount = listItems.filter((li) => listItemsBought.has(li.id)).length;
    const totalListCount = listItems.length;

    const spentOnList = cart.filter((e) => e.is_on_list).reduce((s, e) => s + e.price_paid, 0);
    const cheapestListCost = listItems.reduce((s, li) => s + li.base_price, 0);
    const expensiveListCost = listItems.reduce((s, li) => {
      const spikedPrice = li.price_spike ? li.price_spike.new_price : li.base_price;
      return s + spikedPrice;
    }, 0);
    const savedVsExpensive = Math.max(0, expensiveListCost - spentOnList);

    const trapsBought = cart.filter((e) => !e.is_on_list).length;

    const emoji =
      finalScore >= 80
        ? '🏆'
        : finalScore >= 50
        ? '😊'
        : '😅';

    const message =
      finalScore >= 80
        ? '¡Excelente comprador! Eres un genio del ahorro.'
        : finalScore >= 50
        ? '¡Bien hecho! La proxima lo haces mejor.'
        : 'Sigue practicando. ¡Tu puedes!';

    return (
      <div className="min-h-screen w-full bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-white">
        <div className="text-7xl mb-3">{emoji}</div>

        <h2 className="text-3xl font-black uppercase tracking-widest text-purple-300 mb-1">
          ¡Resultado!
        </h2>
        <p className="text-white/70 font-bold mb-6 text-center">{message}</p>

        {/* Score circle */}
        <div
          className="w-28 h-28 rounded-full flex flex-col items-center justify-center mb-6 border-4"
          style={{
            borderColor: finalScore >= 80 ? '#22c55e' : finalScore >= 50 ? '#f59e0b' : '#ef4444',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <span className="text-4xl font-black leading-none">{finalScore}</span>
          <span className="text-xs font-bold text-white/50 uppercase tracking-widest">puntos</span>
        </div>

        {/* Stats card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 max-w-sm w-full mb-6 space-y-4">
          {/* List progress */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-bold text-white/70">Artículos de lista</span>
              <span className="text-sm font-black text-emerald-300">
                {boughtListCount}/{totalListCount}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${totalListCount > 0 ? (boughtListCount / totalListCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">
                Gastaste
              </div>
              <div className="text-xl font-black text-white">${fmt(spent)}</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">
                Sobraron
              </div>
              <div
                className="text-xl font-black"
                style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444' }}
              >
                ${fmt(Math.max(0, remaining))}
              </div>
            </div>
          </div>

          {savedVsExpensive > 0 && (
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
              <div className="text-xs text-emerald-300/70 font-bold uppercase tracking-widest mb-1">
                Ahorraste vs precio caro
              </div>
              <div className="text-2xl font-black text-emerald-300">
                🎉 ${fmt(savedVsExpensive)}
              </div>
            </div>
          )}

          {trapsBought > 0 && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-center">
              <div className="text-xs text-red-300/70 font-bold uppercase tracking-widest mb-1">
                Trampas compradas
              </div>
              <div className="text-xl font-black text-red-300">⚠️ {trapsBought}</div>
            </div>
          )}
        </div>

        {/* Cart summary */}
        {cart.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 max-w-sm w-full mb-6">
            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">
              Tu carrito
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {cart.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.emoji}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: entry.is_on_list ? '#fff' : '#f59e0b' }}
                    >
                      {entry.name}
                      {!entry.is_on_list && (
                        <span className="ml-1 text-xs text-yellow-400/70">(extra)</span>
                      )}
                    </span>
                  </div>
                  <span className="text-sm font-black text-white/70">
                    ${fmt(entry.price_paid)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleFinalizar}
          className="rounded-2xl font-black uppercase tracking-widest px-8 py-4 text-lg bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300 min-h-[56px] shadow-lg shadow-purple-900/50 active:scale-95"
        >
          Finalizar 🎓
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GAME SCREEN
  // ─────────────────────────────────────────────────────────────────────────────

  const listRequired = listItems.map((li) => ({
    ...li,
    bought: listItemsBought.has(li.id),
  }));

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[#0a0a1a] text-white overflow-x-hidden"
      style={{ fontFamily: 'inherit' }}
    >
      {/* ── HUD ── */}
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-2 flex flex-col gap-2"
        style={{ background: '#0a0a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Row 1: Budget + Timer */}
        <div className="flex items-center gap-3">
          {/* Budget */}
          <div
            className="flex-1 rounded-2xl border p-3 transition-all duration-300"
            style={{
              background: isOverBudget || overBudgetFlash ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.08)',
              borderColor: isOverBudget || overBudgetFlash ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.3)',
            }}
          >
            <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-0.5">
              Presupuesto
            </div>
            <div
              className="text-2xl font-black transition-all duration-300"
              style={{
                color:
                  overBudgetFlash || isOverBudget
                    ? '#ef4444'
                    : remaining < 20
                    ? '#f59e0b'
                    : '#22c55e',
              }}
            >
              ${fmt(remaining)}
            </div>
          </div>

          {/* Timer */}
          <div
            className="rounded-2xl border p-3 min-w-[80px] text-center transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: timeLeft <= 10 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-0.5">
              Tiempo
            </div>
            <div
              className="text-2xl font-black transition-all duration-300"
              style={{
                color: timerColor,
                animation: timeLeft <= 10 ? 'pulse 1s infinite' : undefined,
              }}
            >
              {timeLeft}s
            </div>
          </div>

          {/* Cart count */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 min-w-[64px] text-center">
            <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-0.5">
              Carrito
            </div>
            <div className="text-2xl font-black text-purple-300">{cart.length}</div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${timerPct}%`,
              background: timerColor,
            }}
          />
        </div>

        {/* Shopping list mini */}
        <div className="flex gap-2 flex-wrap">
          {listRequired.map((li) => (
            <div
              key={li.id}
              className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-xs font-bold border transition-all duration-300"
              style={{
                background: li.bought ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                borderColor: li.bought ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)',
                color: li.bought ? '#86efac' : '#ffffff99',
                textDecoration: li.bought ? 'line-through' : 'none',
                opacity: li.bought ? 0.7 : 1,
              }}
            >
              <span className="text-base">{li.emoji}</span>
              <span>{li.name}</span>
              {li.bought && <span>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Toast area ── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl px-4 py-2 font-black text-sm text-white shadow-lg animate-bounce"
            style={{ background: t.color + 'ee', minWidth: 120 }}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── Shop grid ── */}
      <div className="flex-1 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-3 text-center">
          Estantes del supermercado — toca para comprar
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shopItems.map((item) => {
            const alreadyBought = item.is_on_list && listItemsBought.has(item.id);
            const canAfford = remaining >= item.current_price;

            return (
              <button
                key={item.id}
                onClick={() => buyItem(item)}
                disabled={alreadyBought}
                className="rounded-3xl border p-4 flex flex-col items-center gap-2 transition-all duration-300 active:scale-95 min-h-[120px] relative overflow-hidden"
                style={{
                  background: alreadyBought
                    ? 'rgba(34,197,94,0.08)'
                    : item.spike_flash
                    ? 'rgba(239,68,68,0.15)'
                    : !item.is_on_list
                    ? 'rgba(245,158,11,0.06)'
                    : 'rgba(255,255,255,0.04)',
                  borderColor: alreadyBought
                    ? 'rgba(34,197,94,0.4)'
                    : item.spike_flash
                    ? 'rgba(239,68,68,0.6)'
                    : !canAfford
                    ? 'rgba(255,255,255,0.05)'
                    : !item.is_on_list
                    ? 'rgba(245,158,11,0.3)'
                    : 'rgba(255,255,255,0.1)',
                  opacity: alreadyBought ? 0.6 : !canAfford ? 0.5 : 1,
                  cursor: alreadyBought ? 'default' : 'pointer',
                }}
              >
                {/* Spike flash banner */}
                {item.spike_flash && (
                  <div
                    className="absolute top-0 left-0 right-0 text-center text-xs font-black py-1 text-white animate-pulse"
                    style={{ background: '#ef4444' }}
                  >
                    📈 ¡SUBE EL PRECIO!
                  </div>
                )}

                {/* "Not on list" badge */}
                {!item.is_on_list && (
                  <div
                    className="absolute top-1 right-1 text-xs font-black px-2 py-0.5 rounded-xl"
                    style={{ background: 'rgba(245,158,11,0.8)', color: '#fff' }}
                  >
                    Extra
                  </div>
                )}

                {/* Bought checkmark */}
                {alreadyBought && (
                  <div className="absolute top-1 left-1 text-lg">✅</div>
                )}

                {/* Emoji */}
                <span
                  className="text-4xl"
                  style={{ marginTop: item.spike_flash ? 16 : 0 }}
                >
                  {item.emoji}
                </span>

                {/* Name */}
                <span className="text-xs font-bold text-center text-white/80 leading-tight">
                  {item.name}
                </span>

                {/* Price */}
                <div className="flex flex-col items-center">
                  <span
                    className="text-base font-black"
                    style={{
                      color: item.spike_flash
                        ? '#ef4444'
                        : item.spiked
                        ? '#f97316'
                        : canAfford
                        ? '#22c55e'
                        : '#ef4444',
                    }}
                  >
                    ${fmt(item.current_price)}
                  </span>
                  {item.spiked && (
                    <span className="text-xs text-white/30 line-through">
                      ${fmt(item.base_price)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom: finish early button ── */}
      <div className="p-4 pt-0">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setScreen('results');
          }}
          className="w-full rounded-2xl font-black uppercase tracking-widest px-6 py-3 text-sm border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 min-h-[48px]"
        >
          Terminar compra 🛒
        </button>
      </div>
    </div>
  );
}
