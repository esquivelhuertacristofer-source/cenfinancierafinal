'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WifiOff, ChevronLeft, LogIn } from 'lucide-react';
import {
  getPillarsForGrade,
  getGradeMetadata,
  getPillarProgress,
  getGuestCompletedActivities,
  markGuestActivityComplete,
} from '../../lib/hub';
import type { PillarMeta } from '../../lib/hub';
import UnitTimeline from '../../components/hub/UnitTimeline';

const GUEST_PROFILE_KEY = 'cen_guest_profile';

const NIVELES = [
  { label: 'Primaria', value: 'Primaria', grados: [1, 2, 3, 4, 5, 6] },
  { label: 'Secundaria', value: 'Secundaria', grados: [1, 2, 3] },
];

interface GuestProfileChoice {
  nivel: string; // 'Primaria' | 'Secundaria'
  grado: number;
}

function loadGuestChoice(): GuestProfileChoice {
  if (typeof window === 'undefined') return { nivel: 'Primaria', grado: 4 };
  try {
    const saved = localStorage.getItem(GUEST_PROFILE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.nivel && parsed?.grado) return parsed;
    }
  } catch {
    // ignore
  }
  return { nivel: 'Primaria', grado: 4 };
}

export default function PracticaPage() {
  const [choice, setChoice] = useState<GuestProfileChoice>({ nivel: 'Primaria', grado: 4 });
  const [pillars, setPillars] = useState<PillarMeta[]>([]);
  const [gradeMeta, setGradeMeta] = useState<any>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activePillar, setActivePillar] = useState<PillarMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setChoice(loadGuestChoice());
    setCompleted(getGuestCompletedActivities());
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const schoolLevel = `${choice.nivel} ${choice.grado}`;

    (async () => {
      const [gradePillars] = await Promise.all([
        getPillarsForGrade(choice.grado, schoolLevel),
      ]);
      if (cancelled) return;
      setPillars(gradePillars);
      setGradeMeta(getGradeMetadata(choice.grado, schoolLevel));
      setLoading(false);
    })();

    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(choice));
    return () => {
      cancelled = true;
    };
  }, [choice.nivel, choice.grado]);

  const handleComplete = (activityId: string) => {
    markGuestActivityComplete(activityId);
    setCompleted((prev) => new Set([...prev, activityId]));
  };

  const nivelActivo = NIVELES.find((n) => n.value === choice.nivel) ?? NIVELES[0];

  return (
    <div className="min-h-screen bg-[#010A19] text-white font-['Epilogue']">
      {/* Aviso de modo práctica */}
      <div className="w-full bg-[#FF8C00] text-[#011C40] px-4 py-2.5 text-sm font-bold flex items-center justify-center gap-2 flex-wrap text-center">
        <WifiOff size={16} className="shrink-0" />
        <span>Estás en Modo Práctica sin conexión. Tu avance se guarda solo en este dispositivo.</span>
        <Link href="/log-in" className="underline decoration-2 underline-offset-2 hover:opacity-80 inline-flex items-center gap-1">
          <LogIn size={14} /> Iniciar sesión con tu cuenta real
        </Link>
      </div>

      <header className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft size={16} /> Volver al inicio
        </Link>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Modo Práctica</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Explora el contenido y marca actividades como practicadas mientras no puedas iniciar sesión.
          Cuando tengas acceso a tu cuenta real, tu progreso de este dispositivo se sumará automáticamente.
        </p>
      </header>

      {/* Selector de nivel/grado */}
      <div className="max-w-6xl mx-auto px-6 mb-8 flex flex-wrap items-end gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Nivel</label>
          <div className="flex gap-2">
            {NIVELES.map((n) => (
              <button
                key={n.value}
                onClick={() => setChoice((c) => ({ nivel: n.value, grado: n.grados[0] }))}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  choice.nivel === n.value ? 'bg-[#FF8C00] text-[#011C40]' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Grado</label>
          <div className="flex gap-2 flex-wrap">
            {nivelActivo.grados.map((g) => (
              <button
                key={g}
                onClick={() => setChoice((c) => ({ ...c, grado: g }))}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                  choice.grado === g ? 'bg-[#FF8C00] text-[#011C40]' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {gradeMeta && (
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-[#011C40] to-[#011126]">
            <h2 className="text-xl font-black" style={{ color: gradeMeta.accentColor ?? '#FF8C00' }}>
              {gradeMeta.title}
            </h2>
            <p className="text-white/60 text-sm mt-1">{gradeMeta.objective}</p>
          </div>
        </div>
      )}

      {/* Grid de pilares */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <p className="text-white/40">Cargando contenido…</p>
        ) : pillars.length === 0 ? (
          <p className="text-white/40">No hay contenido disponible para este grado todavía.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p) => {
              const { done, total, pct } = getPillarProgress(p, completed);
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(p)}
                  className="text-left rounded-3xl p-6 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                  style={{ boxShadow: pct === 100 ? `0 0 0 1px ${p.ring}55` : undefined }}
                >
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h3 className="font-bold text-white leading-snug">{p.title}</h3>
                  <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: p.ring }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-white/40">{done}/{total} practicadas</div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Vista de detalle del pilar */}
      {activePillar && (
        <div className="fixed inset-0 z-[5000] overflow-y-auto bg-[#011126] text-white">
          <div className="max-w-3xl mx-auto px-6 py-10">
            <button
              onClick={() => setActivePillar(null)}
              className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors"
            >
              <ChevronLeft size={16} /> Volver a los pilares
            </button>
            <h2 className="text-2xl font-black mb-1">{activePillar.title}</h2>
            <p className="text-white/50 text-sm mb-8">Modo práctica — tu avance se guarda en este dispositivo.</p>
            <UnitTimeline
              pillar={activePillar}
              completed={completed}
              userId="guest_user"
              globalOffset={0}
              onComplete={handleComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
}
