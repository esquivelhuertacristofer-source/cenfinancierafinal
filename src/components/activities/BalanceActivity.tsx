'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Brain, Hammer, Trophy, X, AlertTriangle, Rocket, Play, RotateCcw } from 'lucide-react';
import {
  PRESETS_BALANCE,
  estadoInicial,
  avanzarBalance,
  puntuarBalance,
  resolverDificultad,
  clamp,
  type ConfigBalance,
} from '@/lib/activities/balance-sim';

/**
 * BalanceActivity — "El Calibrador de Sueños"
 *
 * Motor de equilibrio dinámico. El alumno alimenta dos fuerzas complementarias
 * (por defecto Sabiduría y Ejecución) y solo avanza hacia su meta mientras las
 * mantiene equilibradas. Si descuida una, la balanza se inclina, la meta se
 * drena y termina perdiendo carga.
 *
 * Implementa la mecánica que el contenido ya especificaba en `instruccion`
 * ("si una barra sube demasiado rápido y la otra se queda atrás, la balanza se
 * desequilibrará") y que la versión anterior nunca ejecutó.
 *
 * 100% configurable desde JSON y retrocompatible: cualquier actividad que solo
 * traiga `titulo` sigue funcionando con valores por defecto sensatos.
 */

type Fase = 'briefing' | 'jugando' | 'ganado' | 'perdido';

interface Props {
  data: any;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

export default function BalanceActivity({ data, onComplete, onClose }: Props) {
  const prefiereMenosMovimiento = useReducedMotion();

  // ─── Configuración derivada del JSON (retrocompatible) ────────────────────
  const dificultad = useMemo(() => resolverDificultad(data), [data]);
  const cfg = useMemo<ConfigBalance>(() => ({ ...PRESETS_BALANCE[dificultad], ...(data?.config || {}) }), [dificultad, data]);

  const etiquetas = useMemo(() => ({
    sabiduria: data?.metadata?.knowledge_label || 'Sabiduría (Estudio)',
    ejecucion: data?.metadata?.action_label || 'Ejecución (Trabajo)',
    meta: data?.metadata?.target_label || 'Tu Gran Meta',
  }), [data]);

  const imagenes = data?.imagenes || {};
  const xp = Number(data?.xp) || 0;

  // ─── Estado de simulación (refs para el bucle, state para pintar) ─────────
  const sim = useRef(estadoInicial());
  const teclas = useRef({ sabiduria: false, ejecucion: false });
  const rafRef = useRef<number | null>(null);
  const ultimoTs = useRef<number>(0);
  const yaCompletado = useRef(false);

  const [fase, setFase] = useState<Fase>('briefing');
  const [vista, setVista] = useState({ sabiduria: 0, ejecucion: 0, meta: 0, peligro: false, resbalones: 0, conflicto: false });
  const [puntaje, setPuntaje] = useState(0);
  const [avisoResbalon, setAvisoResbalon] = useState(0);

  const faseRef = useRef<Fase>('briefing');
  useEffect(() => { faseRef.current = fase; }, [fase]);

  // ─── Puntaje: mide equilibrio sostenido, no cuántas veces se picó el botón ──
  const calcularPuntaje = useCallback(() => puntuarBalance(sim.current), []);

  const reportar = useCallback((score: number) => {
    if (yaCompletado.current) return;
    yaCompletado.current = true;
    onComplete?.(score);
  }, [onComplete]);

  // ─── Bucle de simulación ──────────────────────────────────────────────────
  useEffect(() => {
    if (fase !== 'jugando') return;

    ultimoTs.current = 0;
    const paso = (ts: number) => {
      if (faseRef.current !== 'jugando') return;
      if (!ultimoTs.current) ultimoTs.current = ts;
      // Cap del delta: evita un salto enorme al volver de otra pestaña.
      const dt = Math.min(0.05, (ts - ultimoTs.current) / 1000);
      ultimoTs.current = ts;
      const s = sim.current;

      // Toda la mecánica vive en el módulo puro, que está cubierto por pruebas.
      const { enPeligro, conflicto, resbalo } = avanzarBalance(s, cfg, teclas.current, dt);
      if (resbalo) setAvisoResbalon(Date.now());

      setVista({
        sabiduria: s.sabiduria, ejecucion: s.ejecucion, meta: s.meta,
        peligro: enPeligro, resbalones: s.resbalones, conflicto,
      });

      // 4. Condiciones de término.
      if (s.meta >= cfg.umbralAprobacion || s.meta >= 100) {
        const p = calcularPuntaje();
        setPuntaje(p); setFase('ganado'); reportar(p);
        return;
      }
      if (cfg.duracionSegundos > 0 && s.transcurrido >= cfg.duracionSegundos) {
        const p = calcularPuntaje();
        setPuntaje(p); setFase('perdido');
        return;
      }
      rafRef.current = requestAnimationFrame(paso);
    };

    rafRef.current = requestAnimationFrame(paso);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [fase, cfg, calcularPuntaje, reportar]);

  // ─── Entrada por teclado (accesibilidad) ──────────────────────────────────
  useEffect(() => {
    if (fase !== 'jugando') return;
    const abajo = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') { teclas.current.sabiduria = true; e.preventDefault(); }
      if (k === 'arrowright' || k === 'd') { teclas.current.ejecucion = true; e.preventDefault(); }
    };
    const arriba = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') teclas.current.sabiduria = false;
      if (k === 'arrowright' || k === 'd') teclas.current.ejecucion = false;
    };
    // Si la ventana pierde el foco soltamos todo: evita que una tecla quede "pegada".
    const soltarTodo = () => { teclas.current.sabiduria = false; teclas.current.ejecucion = false; };
    window.addEventListener('keydown', abajo);
    window.addEventListener('keyup', arriba);
    window.addEventListener('blur', soltarTodo);
    return () => {
      window.removeEventListener('keydown', abajo);
      window.removeEventListener('keyup', arriba);
      window.removeEventListener('blur', soltarTodo);
      soltarTodo();
    };
  }, [fase]);

  const reiniciar = useCallback(() => {
    sim.current = estadoInicial();
    teclas.current = { sabiduria: false, ejecucion: false };
    setVista({ sabiduria: 0, ejecucion: 0, meta: 0, peligro: false, resbalones: 0, conflicto: false });
    setFase('jugando');
  }, []);

  const cerrar = useCallback(() => {
    if (onClose) onClose(); else reportar(puntaje || calcularPuntaje());
  }, [onClose, reportar, puntaje, calcularPuntaje]);

  // ─── Geometría de la balanza ──────────────────────────────────────────────
  const desequilibrio = vista.sabiduria - vista.ejecucion;
  const anguloViga = clamp(desequilibrio * 0.28, -16, 16);
  const alturaCol = (v: number) => 12 + (v / 100) * 88;
  const estadoEquilibrio = Math.abs(desequilibrio) <= cfg.tolerancia
    ? 'equilibrado'
    : Math.abs(desequilibrio) >= cfg.toleranciaPeligro ? 'peligro' : 'aviso';

  // ─── Briefing: por fin usa descripcion / instruccion del JSON ─────────────
  if (fase === 'briefing') {
    return (
      <div className="w-full flex flex-col items-center justify-center px-4 sm:px-8 py-10 sm:py-16 text-center">
        <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
          <div className="flex items-center justify-center gap-3 text-[#FF8C00] font-black tracking-[0.16em] md:tracking-[0.3em] uppercase text-[10px] sm:text-xs">
            <Rocket size={14} aria-hidden /> Calibrador de Sueños
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight leading-none">
            {data?.titulo || 'El Calibrador de Sueños'}
          </h1>
          {data?.descripcion && (
            <p className="text-base sm:text-xl text-white/60 font-medium leading-relaxed">{data.descripcion}</p>
          )}
          {data?.instruccion && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 text-left space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/40">Cómo se juega</p>
              <p className="text-sm sm:text-lg text-white/80 leading-relaxed">{data.instruccion}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left">
            <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4">
              <Brain className="text-blue-300 mb-2" size={22} aria-hidden />
              <p className="text-blue-200 font-black text-sm sm:text-base leading-tight">{etiquetas.sabiduria}</p>
              <p className="text-white/40 text-xs mt-1">Mantén presionado · tecla ←</p>
            </div>
            <div className="rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4">
              <Hammer className="text-orange-300 mb-2" size={22} aria-hidden />
              <p className="text-orange-200 font-black text-sm sm:text-base leading-tight">{etiquetas.ejecucion}</p>
              <p className="text-white/40 text-xs mt-1">Mantén presionado · tecla →</p>
            </div>
          </div>
          <p className="text-white/40 text-xs sm:text-sm italic">
            Las dos fuerzas bajan solas. Aliméntalas por turnos y mantenlas parejas: si una se dispara, {etiquetas.meta} se desploma.
          </p>
          <button
            onClick={() => setFase('jugando')}
            className="inline-flex items-center gap-3 px-5 md:px-10 sm:px-16 py-5 sm:py-6 bg-white text-black rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 transition-transform"
          >
            <Play size={16} aria-hidden /> Comenzar
          </button>
        </div>
      </div>
    );
  }

  const jugando = fase === 'jugando';

  return (
    <div className="w-full flex flex-col items-center px-3 sm:px-8 py-6 sm:py-10 select-none">
      {/* Cabecera */}
      <div className="text-center mb-6 sm:mb-10 space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-white italic uppercase tracking-tight leading-none">
          {data?.titulo || 'El Calibrador de Sueños'}
        </h1>
        <p className="text-white/40 text-xs sm:text-sm font-medium">
          Mantén las dos fuerzas parejas para hacer crecer {etiquetas.meta.toLowerCase()}
        </p>
      </div>

      {/* Medidor de la meta */}
      <div className="w-full max-w-3xl mb-6 sm:mb-10">
        <div className="flex items-end justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/50">{etiquetas.meta}</span>
          <span className="text-2xl sm:text-3xl font-black text-white italic tabular-nums">{Math.floor(vista.meta)}%</span>
        </div>
        <div className="h-5 sm:h-6 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${estadoEquilibrio === 'peligro' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
            animate={{ width: `${vista.meta}%` }}
            transition={{ duration: prefiereMenosMovimiento ? 0 : 0.12, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Narración accesible: no depende del color */}
      <p aria-live="polite" className="sr-only">
        {etiquetas.meta} al {Math.floor(vista.meta)} por ciento.
        {estadoEquilibrio === 'equilibrado'
          ? ' Balanza equilibrada, avanzando.'
          : estadoEquilibrio === 'peligro'
            ? ' Balanza desequilibrada, perdiendo avance.'
            : ' Balanza inclinada, corrige.'}
      </p>

      {/* La balanza: ahora sí se inclina */}
      <div className="relative w-full max-w-3xl h-52 sm:h-72 mb-6 sm:mb-10" aria-hidden>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3 h-32 sm:h-44 bg-white/10 rounded-t-full" />
        <div className="absolute left-1/2 bottom-28 sm:bottom-40 -translate-x-1/2 w-full max-w-2xl">
          <motion.div
            className="relative h-2.5 rounded-full bg-gradient-to-r from-blue-400/70 via-white/80 to-orange-400/70 origin-center"
            animate={{ rotate: anguloViga }}
            transition={prefiereMenosMovimiento
              ? { duration: 0 }
              : { type: 'spring', stiffness: 90, damping: 14 }}
          >
            <div className="absolute left-0 -translate-x-1/2 -top-1 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-blue-500/20 border-2 border-blue-400/50 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                {imagenes.sabiduria
                  ? <img src={imagenes.sabiduria} alt="" className="w-full h-full object-contain" />
                  : <Brain className="text-blue-300" size={30} />}
              </div>
            </div>
            <div className="absolute right-0 translate-x-1/2 -top-1 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-orange-500/20 border-2 border-orange-400/50 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                {imagenes.ejecucion
                  ? <img src={imagenes.ejecucion} alt="" className="w-full h-full object-contain" />
                  : <Hammer className="text-orange-300" size={30} />}
              </div>
            </div>
          </motion.div>
        </div>

        {/* La meta, sostenida por la balanza: se materializa conforme avanza */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <motion.div
            animate={prefiereMenosMovimiento ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-amber-400/40 bg-amber-500/10 flex items-center justify-center overflow-hidden"
            style={{ opacity: 0.35 + (vista.meta / 100) * 0.65 }}
          >
            {imagenes.objetivo
              ? <img src={imagenes.objetivo} alt="" className="w-full h-full object-contain" />
              : <Rocket className="text-amber-300" size={38} />}
          </motion.div>
        </div>

        <AnimatePresence>
          {vista.peligro && jugando && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap"
            >
              <AlertTriangle size={14} /> ¡Se está desequilibrando!
            </motion.div>
          )}
          {vista.conflicto && jugando && !vista.peligro && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap"
            >
              <AlertTriangle size={14} /> Solo puedes hacer una cosa a la vez
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Columnas + controles */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 sm:gap-10">
        {([
          { k: 'sabiduria' as const, valor: vista.sabiduria, etiqueta: etiquetas.sabiduria, Icono: Brain, tecla: '←', esAzul: true },
          { k: 'ejecucion' as const, valor: vista.ejecucion, etiqueta: etiquetas.ejecucion, Icono: Hammer, tecla: '→', esAzul: false },
        ]).map(({ k, valor, etiqueta, Icono, tecla, esAzul }) => (
          <div key={k} className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="w-full h-24 sm:h-32 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex items-end">
              <motion.div
                className={`w-full ${esAzul ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-orange-600 to-orange-400'}`}
                animate={{ height: `${alturaCol(valor)}%` }}
                transition={{ duration: prefiereMenosMovimiento ? 0 : 0.08, ease: 'linear' }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-white text-xl sm:text-2xl italic tabular-nums drop-shadow-lg">
                {Math.floor(valor)}%
              </span>
            </div>

            <button
              type="button"
              disabled={!jugando}
              aria-label={`Mantener presionado para aumentar ${etiqueta}`}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); teclas.current[k] = true; }}
              onPointerUp={() => { teclas.current[k] = false; }}
              onPointerCancel={() => { teclas.current[k] = false; }}
              onLostPointerCapture={() => { teclas.current[k] = false; }}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full ${esAzul ? 'bg-blue-500' : 'bg-orange-500'} text-white flex items-center justify-center touch-none active:scale-90 transition-transform disabled:opacity-40`}
            >
              <Icono size={34} aria-hidden />
            </button>

            <div className="text-center">
              <p className={`font-black uppercase tracking-wider text-[11px] sm:text-sm leading-tight ${esAzul ? 'text-blue-300' : 'text-orange-300'}`}>
                {etiqueta}
              </p>
              <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">tecla {tecla}</p>
            </div>
          </div>
        ))}
      </div>

      {vista.resbalones > 0 && (
        <p className="mt-6 text-red-300/70 text-xs sm:text-sm font-bold">
          Cargas perdidas por desequilibrio: {vista.resbalones}
        </p>
      )}

      <AnimatePresence>
        {avisoResbalon > 0 && jugando && (
          <motion.div
            key={avisoResbalon}
            initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            onAnimationComplete={() => setAvisoResbalon(0)}
            className="fixed left-1/2 top-1/3 -translate-x-1/2 z-[2400] text-red-400 font-black text-3xl sm:text-5xl italic pointer-events-none"
          >
            −{cfg.castigoResbalon}%
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cierre */}
      <AnimatePresence>
        {(fase === 'ganado' || fase === 'perdido') && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[2500] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-16"
            role="dialog" aria-modal="true"
          >
            <button
              onClick={cerrar} aria-label="Cerrar"
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
            <div className="text-center space-y-6 sm:space-y-8 max-w-lg">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`w-28 h-28 sm:w-40 sm:h-40 rounded-[24px] md:rounded-[40px] flex items-center justify-center mx-auto ${fase === 'ganado' ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                {fase === 'ganado'
                  ? <Trophy size={70} className="text-white" />
                  : <RotateCcw size={70} className="text-white" />}
              </motion.div>
              <h2 className="text-4xl sm:text-6xl font-black text-white italic uppercase tracking-tight leading-none">
                {fase === 'ganado' ? '¡Meta Alcanzada!' : 'Se Perdió el Equilibrio'}
              </h2>
              <p className="text-lg sm:text-2xl text-white/60 font-medium leading-snug">
                {fase === 'ganado'
                  ? `${etiquetas.meta} despegó porque mantuviste ${etiquetas.sabiduria.toLowerCase()} y ${etiquetas.ejecucion.toLowerCase()} trabajando juntas.`
                  : 'Una fuerza se adelantó demasiado y la carga se vino abajo. Aliméntalas por turnos.'}
              </p>
              <div className="flex items-center justify-center gap-8 sm:gap-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/30">Puntaje</p>
                  <p className="text-4xl sm:text-5xl font-black text-emerald-400 italic tabular-nums">{puntaje}</p>
                </div>
                {xp > 0 && fase === 'ganado' && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-white/30">XP</p>
                    <p className="text-4xl sm:text-5xl font-black text-amber-400 italic tabular-nums">{xp}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={reiniciar}
                  className="px-5 md:px-10 py-5 rounded-full border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.35em] hover:bg-white/10 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={cerrar}
                  className="px-5 md:px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.35em] hover:scale-105 transition-transform"
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
