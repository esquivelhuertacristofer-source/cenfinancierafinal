'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Clock, Coins, Play, RotateCcw, Trophy, X, Check, Lightbulb } from 'lucide-react';
import {
  CONFIG_JORNADA_POR_DEFECTO,
  estadoInicialJornada,
  bloquesRestantes,
  oficiosDisponibles,
  jornadaTerminada,
  elegirOficio,
  mejorJornada,
  puntuarJornada,
  metaLograda,
  type ConfigJornada,
  type EstadoJornada,
  type Oficio,
} from '@/lib/activities/jornada-sim';

/**
 * JornadaActivity — "El Día de Trabajo de Ceny"
 *
 * Motor de asignación de tiempo para la unidad P1-1-3 («de dónde vienen los
 * pesos»). El alumno reparte las horas de un día entre oficios distintos.
 * No hay reflejos: solo decisiones, y cada decisión se puede razonar en voz
 * alta con el maestro.
 *
 * 100% configurable desde JSON y con valores por defecto, para que una
 * actividad que solo traiga `titulo` siga funcionando.
 */

type Fase = 'briefing' | 'jugando' | 'cierre';

interface Props {
  data: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

const OFICIOS_POR_DEFECTO: Oficio[] = [
  { id: 'cartel', nombre: 'Pintar un cartel para la tienda', emoji: '🎨', bloques: 3, paga: 50 },
  { id: 'panaderia', nombre: 'Ayudar en la panadería', emoji: '🥐', bloques: 2, paga: 30 },
  { id: 'biblioteca', nombre: 'Acomodar libros en la biblioteca', emoji: '📚', bloques: 2, paga: 25 },
  { id: 'perro', nombre: 'Pasear al perro de la vecina', emoji: '🐕', bloques: 1, paga: 15 },
  { id: 'vivero', nombre: 'Regar las plantas del vivero', emoji: '🌱', bloques: 1, paga: 10 },
  { id: 'ropa', nombre: 'Doblar la ropa limpia', emoji: '🧺', bloques: 1, paga: 8 },
];

export default function JornadaActivity({ data, onComplete, onClose }: Props) {
  const menosMovimiento = useReducedMotion();

  const oficios = useMemo<Oficio[]>(
    () => (Array.isArray(data?.oficios) && data.oficios.length ? data.oficios : OFICIOS_POR_DEFECTO),
    [data],
  );
  const cfg = useMemo<ConfigJornada>(
    () => ({ ...CONFIG_JORNADA_POR_DEFECTO, ...(data?.config || {}) }),
    [data],
  );
  const etiquetas = useMemo(() => ({
    horas: data?.metadata?.recurso_label || 'Horas del día',
    monedas: data?.metadata?.moneda_label || 'Pesos ganados',
    meta: data?.metadata?.meta_label || 'la meta',
  }), [data]);

  const [fase, setFase] = useState<Fase>('briefing');
  const [estado, setEstado] = useState<EstadoJornada>(estadoInicialJornada);
  const [aviso, setAviso] = useState<string | null>(null);

  const optimo = useMemo(() => mejorJornada(oficios, cfg), [oficios, cfg]);
  const restantes = bloquesRestantes(estado, cfg);
  const disponibles = oficiosDisponibles(oficios, estado, cfg);
  const xp = Number(data?.xp) || 0;

  const tomar = useCallback((o: Oficio) => {
    setEstado((prev) => {
      const r = elegirOficio(prev, oficios, cfg, o.id);
      if (!r.ok) {
        setAviso(r.motivo === 'sin_tiempo'
          ? `Ya no te quedan ${o.bloques} horas libres para eso.`
          : 'Ese oficio ya lo hiciste hoy.');
        return prev;
      }
      setAviso(null);
      if (jornadaTerminada(oficios, r.estado, cfg)) {
        const p = puntuarJornada(r.estado, oficios, cfg);
        setFase('cierre');
        onComplete?.(p);
      }
      return r.estado;
    });
  }, [oficios, cfg, onComplete]);

  const terminarDia = useCallback(() => {
    const p = puntuarJornada(estado, oficios, cfg);
    setFase('cierre');
    onComplete?.(p);
  }, [estado, oficios, cfg, onComplete]);

  const reiniciar = useCallback(() => {
    setEstado(estadoInicialJornada());
    setAviso(null);
    setFase('jugando');
  }, []);

  const puntaje = useMemo(
    () => (fase === 'cierre' ? puntuarJornada(estado, oficios, cfg) : 0),
    [fase, estado, oficios, cfg],
  );
  const logro = metaLograda(estado, cfg);

  // ─── Briefing ─────────────────────────────────────────────────────────────
  if (fase === 'briefing') {
    return (
      <div className="w-full flex flex-col items-center px-4 sm:px-8 py-10 sm:py-16 text-center">
        <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
          <div className="flex items-center justify-center gap-3 text-[#FF8C00] font-black tracking-[0.16em] md:tracking-[0.3em] uppercase text-[10px] sm:text-xs">
            <Clock size={14} aria-hidden /> El día de trabajo
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight leading-none">
            {data?.titulo || 'El Día de Trabajo de Ceny'}
          </h1>
          {data?.descripcion && (
            <p className="text-base sm:text-xl text-white/60 font-medium leading-relaxed">{data.descripcion}</p>
          )}
          {data?.instruccion && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 text-left space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/40">Cómo se juega</p>
              <p className="text-sm sm:text-lg text-white/80 leading-relaxed">{data.instruccion}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4 text-left">
              <Clock className="text-sky-300 mb-2" size={22} aria-hidden />
              <p className="text-sky-200 font-black text-2xl">{cfg.bloques}</p>
              <p className="text-white/50 text-xs">{etiquetas.horas.toLowerCase()}</p>
            </div>
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-left">
              <Coins className="text-amber-300 mb-2" size={22} aria-hidden />
              <p className="text-amber-200 font-black text-2xl">${cfg.metaMonedas}</p>
              <p className="text-white/50 text-xs">necesarios para {etiquetas.meta}</p>
            </div>
          </div>
          <button
            onClick={() => setFase('jugando')}
            className="inline-flex items-center gap-3 px-5 md:px-10 sm:px-16 py-5 sm:py-6 bg-white text-black rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 transition-transform"
          >
            <Play size={16} aria-hidden /> Empezar el día
          </button>
        </div>
      </div>
    );
  }

  // ─── Jornada ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full px-3 sm:px-8 py-6 sm:py-10">
      {/* Marcadores */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">{etiquetas.horas}</p>
          <div className="flex items-center gap-2 flex-wrap" aria-hidden>
            {Array.from({ length: cfg.bloques }).map((_, i) => (
              <div
                key={i}
                className={`h-7 w-7 sm:h-9 sm:w-9 rounded-lg border-2 transition-colors ${
                  i < restantes ? 'bg-sky-500 border-sky-400' : 'bg-white/5 border-white/10'}`}
              />
            ))}
          </div>
          <p className="mt-2 text-white/60 text-xs sm:text-sm">
            Te quedan <strong className="text-sky-300">{restantes}</strong> de {cfg.bloques} horas
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">{etiquetas.monedas}</p>
          <p className="text-3xl sm:text-4xl font-black text-amber-300 italic tabular-nums">${estado.monedas}</p>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              animate={{ width: `${Math.min(100, (estado.monedas / cfg.metaMonedas) * 100)}%` }}
              transition={{ duration: menosMovimiento ? 0 : 0.35 }}
            />
          </div>
          <p className="mt-1.5 text-white/50 text-xs">meta: ${cfg.metaMonedas}</p>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Llevas {estado.monedas} pesos de {cfg.metaMonedas} y te quedan {restantes} horas.
      </p>

      {aviso && (
        <p className="max-w-4xl mx-auto mb-4 text-center text-amber-300 text-sm font-bold">{aviso}</p>
      )}

      {/* Oficios */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {oficios.map((o) => {
          const hecho = estado.elegidos.includes(o.id);
          const cabe = disponibles.some((d) => d.id === o.id);
          const deshabilitado = fase !== 'jugando' || hecho || !cabe;
          return (
            <button
              key={o.id}
              type="button"
              disabled={deshabilitado}
              onClick={() => tomar(o)}
              className={`text-left rounded-3xl border p-4 sm:p-5 transition-all ${
                hecho
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : deshabilitado
                    ? 'border-white/5 bg-white/[0.02] opacity-40'
                    : 'border-white/10 bg-white/5 hover:border-[#FF8C00]/60 hover:bg-white/10 active:scale-95'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden text-3xl">
                  {o.imagen
                    ? <img src={o.imagen} alt="" className="w-full h-full object-contain" />
                    : <span aria-hidden>{o.emoji || '🧰'}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white text-sm sm:text-base leading-tight">{o.nombre}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 text-sky-300 font-bold">
                      <Clock size={13} aria-hidden /> {o.bloques} {o.bloques === 1 ? 'hora' : 'horas'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                      <Coins size={13} aria-hidden /> ${o.paga}
                    </span>
                  </div>
                  {hecho && (
                    <p className="mt-2 inline-flex items-center gap-1 text-emerald-300 text-xs font-black uppercase tracking-widest">
                      <Check size={13} aria-hidden /> Hecho
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {fase === 'jugando' && estado.elegidos.length > 0 && (
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <button
            onClick={terminarDia}
            className="px-8 py-4 rounded-full border border-white/20 text-white/70 font-black text-[10px] uppercase tracking-[0.16em] md:tracking-[0.3em] hover:bg-white/10 transition-colors"
          >
            Terminar el día
          </button>
        </div>
      )}

      {/* Cierre */}
      <AnimatePresence>
        {fase === 'cierre' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[2500] bg-black/92 backdrop-blur-2xl flex items-start sm:items-center justify-center p-4 sm:p-10 overflow-y-auto"
            role="dialog" aria-modal="true"
          >
            <button
              onClick={() => (onClose ? onClose() : onComplete?.(puntaje))}
              aria-label="Cerrar"
              className="fixed top-5 right-5 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-full max-w-xl space-y-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-[36px] flex items-center justify-center mx-auto ${logro ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                {logro ? <Trophy size={58} className="text-white" /> : <RotateCcw size={58} className="text-white" />}
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight leading-none">
                  {logro ? '¡Lo lograste!' : 'No alcanzó'}
                </h2>
                <p className="text-lg sm:text-xl text-white/60 font-medium">
                  Ganaste <strong className="text-amber-300">${estado.monedas}</strong> trabajando{' '}
                  {estado.elegidos.length} {estado.elegidos.length === 1 ? 'oficio' : 'oficios'} en {estado.bloquesUsados} horas.
                </p>
              </div>

              {/* El momento didáctico: con las MISMAS horas se podía ganar más */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left space-y-3">
                <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-[#FF8C00]">
                  <Lightbulb size={14} aria-hidden /> Con las mismas {cfg.bloques} horas
                </p>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  El mejor día posible daba <strong className="text-amber-300">${optimo.monedas}</strong>:{' '}
                  {optimo.ids.map((id) => oficios.find((o) => o.id === id)?.nombre).filter(Boolean).join(', ')}.
                </p>
                <p className="text-white/40 text-xs sm:text-sm">
                  No todos los oficios pagan igual por cada hora. Escoger bien en qué gastas tu tiempo cambia
                  cuánto ganas al final del día.
                </p>
              </div>

              <div className="flex items-center justify-center gap-5 md:gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/30">Puntaje</p>
                  <p className="text-2xl md:text-4xl font-black text-emerald-400 italic tabular-nums">{puntaje}</p>
                </div>
                {xp > 0 && logro && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/30">XP</p>
                    <p className="text-2xl md:text-4xl font-black text-amber-400 italic tabular-nums">{xp}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={reiniciar}
                  className="px-9 py-4 rounded-full border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.16em] md:tracking-[0.3em] hover:bg-white/10 transition-colors"
                >
                  Intentar otro día
                </button>
                <button
                  onClick={() => (onClose ? onClose() : onComplete?.(puntaje))}
                  className="px-9 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.16em] md:tracking-[0.3em] hover:scale-105 transition-transform"
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
