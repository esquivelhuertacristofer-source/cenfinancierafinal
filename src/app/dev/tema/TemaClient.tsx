'use client';

import { useEffect, useMemo, useState } from 'react';
import ContentModal from '@/components/hub/ContentModal';
import { getPillarsForGrade, type PillarMeta, type Unit } from '@/lib/hub';

const GRADOS = [
  { id: 'p1', label: 'Primaria 1', grade: 1, level: 'primary' },
  { id: 'p2', label: 'Primaria 2', grade: 2, level: 'primary' },
  { id: 'p3', label: 'Primaria 3', grade: 3, level: 'primary' },
  { id: 'p4', label: 'Primaria 4', grade: 4, level: 'primary' },
  { id: 'p5', label: 'Primaria 5', grade: 5, level: 'primary' },
  { id: 'p6', label: 'Primaria 6', grade: 6, level: 'primary' },
  { id: 's1', label: 'Secundaria 1', grade: 1, level: 'secundaria' },
  { id: 's2', label: 'Secundaria 2', grade: 2, level: 'secundaria' },
  { id: 's3', label: 'Secundaria 3', grade: 3, level: 'secundaria' },
];

export default function TemaClient() {
  const [gradoId, setGradoId] = useState('s3');
  const [pilares, setPilares] = useState<PillarMeta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState<{ unit: Unit; pillar: PillarMeta } | null>(null);
  const [completados, setCompletados] = useState<Set<string>>(new Set());
  const [filtro, setFiltro] = useState('');

  const grado = useMemo(() => GRADOS.find(g => g.id === gradoId)!, [gradoId]);

  useEffect(() => {
    let vivo = true;
    /* Marcar la carga antes de pedir los datos: el efecto se vuelve a lanzar cuando cambia el
       grado y la pantalla tiene que volver al estado de espera. La alternativa que pide la
       regla es Suspense, que aqui obligaria a mover la carga fuera del componente. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    getPillarsForGrade(grado.grade, grado.level)
      .then(p => { if (vivo) { setPilares(p); setCargando(false); } })
      .catch(() => { if (vivo) { setPilares([]); setCargando(false); } });
    return () => { vivo = false; };
  }, [grado]);

  const unidades = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    return pilares.flatMap(p => p.units.map(u => ({ unit: u, pillar: p })))
      .filter(({ unit }) => !q || unit.title.toLowerCase().includes(q) || unit.code.toLowerCase().includes(q))
      .sort((a, b) => a.unit.code.localeCompare(b.unit.code, 'es', { numeric: true }));
  }, [pilares, filtro]);

  return (
    <div className="min-h-screen bg-[#05010D] text-white font-sans">
      <header className="border-b border-white/10 px-5 md:px-8 py-8 md:py-10 max-w-6xl mx-auto">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF8C00] mb-3">Solo desarrollo</div>
        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-3 break-words">Recorrido de un Tema</h1>
        <p className="text-white/40 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Abre cualquier unidad con su flujo completo: Marco Teórico, Laboratorio/Ejercicio y Evaluación.
          Es el mismo componente que usa el hub, sin necesidad de iniciar sesión.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10 space-y-6 md:space-y-8">
        <div className="flex flex-wrap gap-2">
          {GRADOS.map(g => (
            <button
              key={g.id}
              onClick={() => setGradoId(g.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                g.id === gradoId
                  ? 'bg-[#FF8C00] text-black'
                  : 'bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <input
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          placeholder="Filtrar por título o código de unidad…"
          className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-5 md:px-8 py-4 md:py-6 text-base md:text-lg font-bold outline-none focus:border-[#FF8C00] transition-all placeholder:text-white/20"
        />

        {cargando && <p className="text-white/30 font-black uppercase tracking-[0.3em] py-20 text-center">Cargando temario…</p>}

        {!cargando && unidades.length === 0 && (
          <p className="text-white/30 font-black uppercase tracking-[0.3em] py-20 text-center">Sin unidades para este grado</p>
        )}

        <div className="grid gap-3">
          {unidades.map(({ unit, pillar }) => {
            // Mismo id que usa ContentModal: sufijo B para la evaluación, A para el resto.
            const hechas = new Set(
              unit.contents
                .map(c => `ACT-${unit.code}-${c.type === 'quiz' ? 'B' : 'A'}`)
                .filter(id => completados.has(id))
            ).size;
            const totales = new Set(unit.contents.map(c => (c.type === 'quiz' ? 'B' : 'A'))).size;
            return (
              <button
                key={unit.code}
                onClick={() => setAbierto({ unit, pillar })}
                className="text-left w-full min-w-0 overflow-hidden bg-white/[0.03] border border-white/10 rounded-[24px] md:rounded-[32px] px-5 md:px-8 py-5 md:py-6 hover:border-[#FF8C00]/50 hover:bg-white/[0.06] transition-all group"
              >
                <div className="flex items-center justify-between gap-4 md:gap-6 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: pillar.color }}>
                        {unit.code}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 truncate">{pillar.title}</span>
                    </div>
                    <div className="text-lg md:text-2xl font-black tracking-tight truncate group-hover:text-[#FF8C00] transition-colors">{unit.title}</div>
                    {unit.objective && <p className="text-white/30 text-sm font-medium mt-2 line-clamp-2">{unit.objective}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Avance</div>
                    <div className="text-xl font-black">{hechas}/{totales}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {abierto && (
        <ContentModal
          unit={abierto.unit}
          pillar={abierto.pillar}
          completed={completados}
          userId="guest_user"
          onComplete={id => setCompletados(prev => new Set([...prev, id]))}
          onClose={() => setAbierto(null)}
        />
      )}
    </div>
  );
}
