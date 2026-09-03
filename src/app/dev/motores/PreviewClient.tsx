'use client';

import React, { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { mensajeDeError } from '@/lib/errores';
import type { ActividadCruda } from '@/types/activities';

export interface ItemActividad {
  archivo: string;
  grado: string;
  tipo: string;
  titulo: string;
  unidad: string;
  edad: string;
  complejidad: string;
}

const cargando = () => (
  <div className="py-32 text-center text-white/30 font-black uppercase tracking-[0.3em] text-xs">cargando motor…</div>
);

const MOTORES = {
  BalanceActivity:        dynamic(() => import('@/components/activities/BalanceActivity'), { ssr: false, loading: cargando }),
  BuilderActivity:        dynamic(() => import('@/components/activities/BuilderActivity'), { ssr: false, loading: cargando }),
  DragDropActivity:       dynamic(() => import('@/components/activities/DragDropActivity'), { ssr: false, loading: cargando }),
  FillBlanksActivity:     dynamic(() => import('@/components/activities/FillBlanksActivity'), { ssr: false, loading: cargando }),
  GameActivity:           dynamic(() => import('@/components/activities/GameActivity'), { ssr: false, loading: cargando }),
  GrowthActivity:         dynamic(() => import('@/components/activities/GrowthActivity'), { ssr: false, loading: cargando }),
  MatchingActivity:       dynamic(() => import('@/components/activities/MatchingActivity'), { ssr: false, loading: cargando }),
  QuizActivity:           dynamic(() => import('@/components/activities/QuizActivity'), { ssr: false, loading: cargando }),
  RadarActivity:          dynamic(() => import('@/components/activities/RadarActivity'), { ssr: false, loading: cargando }),
  RouletteActivity:       dynamic(() => import('@/components/activities/RouletteActivity'), { ssr: false, loading: cargando }),
  ServiceControlActivity: dynamic(() => import('@/components/activities/ServiceControlActivity'), { ssr: false, loading: cargando }),
  SimulatorActivity:      dynamic(() => import('@/components/activities/SimulatorActivity'), { ssr: false, loading: cargando }),
  StoryActivity:          dynamic(() => import('@/components/activities/StoryActivity'), { ssr: false, loading: cargando }),
  TriviaActivity:         dynamic(() => import('@/components/activities/TriviaActivity'), { ssr: false, loading: cargando }),
  JornadaActivity:        dynamic(() => import('@/components/activities/JornadaActivity'), { ssr: false, loading: cargando }),
} as const;

type NombreMotor = keyof typeof MOTORES;

/** Mismos sinónimos que usa ContentModal, unificando sus dos pestañas. */
const SINONIMOS: Array<[NombreMotor, string[]]> = [
  ['SimulatorActivity',      ['SIMULADOR', 'SIMULATOR', 'CALCULADORA', 'CALCULA']],
  ['BuilderActivity',        ['BUILDER', 'CONSTRUCTOR', 'PLANIFICADOR', 'CONSTRUYE', 'PLANIFICA']],
  ['StoryActivity',          ['STORY', 'DECIDE', 'AVENTURA', 'CASO', 'HISTORIA', 'LEE', 'EXPLORA']],
  ['GameActivity',           ['GAME', 'JUEGO', 'DESAFIO', 'RETO', 'JUEGA']],
  ['DragDropActivity',       ['DRAG_DROP', 'ARRASTRE', 'CLASIFICAR', 'ARRASTRA', 'CLASIFICA']],
  ['MatchingActivity',       ['MATCHING', 'PAREJAS', 'RELACIONAR', 'RELACIONA', 'UNE', 'MEMORIA']],
  ['FillBlanksActivity',     ['FILL_BLANKS', 'COMPLETAR', 'COMPLETA', 'RELLENA']],
  ['RouletteActivity',       ['ROULETTE', 'RULETA', 'GIRA']],
  ['BalanceActivity',        ['BALANCE', 'EQUILIBRIO', 'CALIBRADOR', 'SINCRONIZA']],
  ['RadarActivity',          ['RADAR', 'ESCANEO', 'PRIORIDAD', 'CAZA']],
  ['GrowthActivity',         ['GROWTH', 'CRECIMIENTO', 'BOVEDA', 'SIMULADOR_AHORRO']],
  ['ServiceControlActivity', ['SERVICE_CONTROL', 'CONSOLA', 'SERVICIOS', 'CONTROL_GASTOS', 'CONTROL']],
  ['QuizActivity',           ['QUIZ', 'CUESTIONARIO', 'EXAMEN', 'EVALUACION']],
  ['TriviaActivity',         ['TRIVIA', 'RAPIDO']],
  ['JornadaActivity',        ['JORNADA', 'DIA_DE_TRABAJO', 'OFICIOS']],
];

function motorPara(tipo: string): NombreMotor | null {
  const t = tipo.toUpperCase().trim();
  for (const [motor, tipos] of SINONIMOS) if (tipos.includes(t)) return motor;
  return null;
}

export default function PreviewClient({ catalogo }: { catalogo: ItemActividad[] }) {
  const [filtro, setFiltro] = useState('');
  const [seleccion, setSeleccion] = useState<ItemActividad | null>(null);
  const [datos, setDatos] = useState<ActividadCruda | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);
  const [montaje, setMontaje] = useState(0); // fuerza remontar al reiniciar

  const porMotor = useMemo(() => {
    const m = new Map<string, ItemActividad[]>();
    for (const it of catalogo) {
      const motor = motorPara(it.tipo) || 'SIN MOTOR';
      const clave = `${motor} · ${it.tipo}`;
      if (!m.has(clave)) m.set(clave, []);
      m.get(clave)!.push(it);
    }
    return m;
  }, [catalogo]);

  const visibles = useMemo(() => {
    const q = filtro.toLowerCase().trim();
    if (!q) return porMotor;
    const m = new Map<string, ItemActividad[]>();
    for (const [clave, items] of porMotor) {
      const f = items.filter((i) =>
        `${clave} ${i.archivo} ${i.titulo} ${i.unidad} ${i.grado}`.toLowerCase().includes(q));
      if (f.length) m.set(clave, f);
    }
    return m;
  }, [porMotor, filtro]);

  const abrir = useCallback(async (item: ItemActividad) => {
    setSeleccion(item); setDatos(null); setError(null); setResultado(null);
    try {
      const r = await fetch(`/data/actividades/${item.grado}/${item.archivo}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setDatos(await r.json());
      setMontaje((n) => n + 1);
    } catch (e: unknown) {
      setError(mensajeDeError(e) || 'no se pudo cargar');
    }
  }, []);

  /* Cada motor declara su propio tipo de `data`, y la union de los catorce no tiene ningun campo en
     comun: TypeScript la reduce a `never` y no deja montar ninguno. Esta pantalla existe justamente
     para montar cualquiera de ellos con cualquier JSON —incluido uno mal formado, que es como se
     comprueba que un motor aguanta datos raros—, asi que aqui se le dice al compilador que el
     componente acepta lo que sea. Es la unica pantalla donde eso es correcto. */
  type MotorGenerico = React.ComponentType<{
    data: unknown;
    onComplete?: (puntaje?: number) => void;
    onClose?: () => void;
  }>;

  const Motor = (seleccion ? MOTORES[motorPara(seleccion.tipo) as NombreMotor] : null) as MotorGenerico | null;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col lg:flex-row">
      {/* Catálogo */}
      <aside className="lg:w-[380px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col max-h-[45vh] lg:max-h-screen">
        <div className="p-5 border-b border-white/10 space-y-3">
          <div>
            <h1 className="font-black uppercase tracking-[0.25em] text-xs text-[#FF8C00]">Banco de motores</h1>
            <p className="text-white/30 text-xs mt-1">{catalogo.length} actividades · solo desarrollo</p>
          </div>
          <input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="filtrar por motor, tipo, archivo, unidad…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FF8C00]/60 transition-colors"
          />
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-4">
          {[...visibles.entries()].map(([clave, items]) => (
            <div key={clave}>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 px-2 ${clave.startsWith('SIN MOTOR') ? 'text-red-400' : 'text-white/40'}`}>
                {clave} <span className="text-white/20">({items.length})</span>
              </p>
              <div className="space-y-0.5">
                {items.map((it) => {
                  const activo = seleccion?.archivo === it.archivo && seleccion?.grado === it.grado;
                  return (
                    <button
                      key={it.grado + it.archivo}
                      onClick={() => abrir(it)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activo ? 'bg-[#FF8C00] text-black font-bold' : 'hover:bg-white/5 text-white/70'}`}
                    >
                      <span className="font-mono opacity-60">{it.grado}</span> {it.titulo}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Escenario */}
      <main className="flex-1 flex flex-col min-w-0">
        {!seleccion && (
          <div className="flex-1 flex items-center justify-center p-10 text-center">
            <p className="text-white/25 text-lg max-w-md">
              Elige una actividad de la izquierda para probar su motor aislado, sin login ni navegación del hub.
            </p>
          </div>
        )}

        {seleccion && (
          <>
            <div className="border-b border-white/10 px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <span className="font-black text-sm">{seleccion.titulo}</span>
              <span className="text-white/40 font-mono">{seleccion.grado}/{seleccion.archivo}</span>
              <span className="px-2 py-0.5 rounded bg-white/10 font-black">{seleccion.tipo}</span>
              {seleccion.edad && <span className="text-white/40">edad: {seleccion.edad}</span>}
              {seleccion.complejidad && <span className="text-white/40">complejidad: {seleccion.complejidad}</span>}
              <button
                onClick={() => setMontaje((n) => n + 1)}
                className="ml-auto px-4 py-1.5 rounded-full border border-white/20 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors"
              >
                Reiniciar
              </button>
            </div>

            {resultado && (
              <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-bold">
                {resultado}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {error && <p className="p-10 text-red-400">Error al cargar: {error}</p>}
              {!error && !datos && cargando()}
              {datos && !Motor && (
                <div className="p-10 text-center space-y-3">
                  <p className="text-red-400 font-black text-xl">Sin motor para el tipo &quot;{seleccion.tipo}&quot;</p>
                  <p className="text-white/40 text-sm">Esta actividad caería en el fallback de &quot;Modo Compatibilidad&quot;.</p>
                </div>
              )}
              {datos && Motor && (
                <Motor
                  key={montaje}
                  data={datos}
                  onComplete={(s?: number) => setResultado(`onComplete(${s ?? 'sin puntaje'}) · ${new Date().toLocaleTimeString()}`)}
                  onClose={() => setResultado(`onClose() · ${new Date().toLocaleTimeString()}`)}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
