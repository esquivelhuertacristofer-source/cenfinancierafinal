'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Activity } from '@/types/curriculum';

// ─── CONTENT SHAPE ───────────────────────────────────────────────────────────

interface JobBenefit {
  name: string;
  emoji: string;
  value: number;
}

interface Job {
  id: string;
  company: string;
  title: string;
  emoji: string;
  initial_salary: number;
  max_salary: number;
  benefits: JobBenefit[];
}

interface NegotiationOption {
  label: string;
  type: 'salary_increase' | 'vacation' | 'training' | 'accept';
  value: number;
  success_rate: number;
}

interface NegociaSueldoContent {
  jobs: Job[];
  negotiation_options: NegotiationOption[];
}

// ─── GAME STATE TYPES ────────────────────────────────────────────────────────

type Phase = 'start' | 'offers' | 'negotiation' | 'projection' | 'results';

interface NegotiationRound {
  optionType: NegotiationOption['type'];
  optionLabel: string;
  success: boolean;
  salaryGained: number;
  benefitGained: string | null;
}

interface NegotiationState {
  currentSalary: number;
  rounds: NegotiationRound[];
  roundNumber: number;
  lastCompanyResponse: string | null;
  thingsNegotiated: number;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function formatPesos(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function calcIMSS(salary: number): number {
  return Math.round(salary * 0.0175);
}

function calcAguinaldo(salary: number): number {
  return Math.round((salary / 365) * 15);
}

function calcFondoAhorro(salary: number): number {
  return Math.round(salary * 0.08);
}

function calcINFONAVIT(salary: number): number {
  return Math.round(salary * 0.05);
}

function calcProjection(
  baseSalary: number,
  negotiatedSalary: number,
  years: number = 5,
  annualRaise: number = 0.05
): { base: number[]; negotiated: number[] } {
  const base: number[] = [];
  const negotiated: number[] = [];
  for (let i = 0; i < years; i++) {
    base.push(Math.round(baseSalary * Math.pow(1 + annualRaise, i)));
    negotiated.push(Math.round(negotiatedSalary * Math.pow(1 + annualRaise, i)));
  }
  return { base, negotiated };
}

function calcAccumulatedDiff(base: number[], negotiated: number[]): number {
  return negotiated.reduce((acc, val, i) => acc + (val - base[i]) * 12, 0);
}

// Computes the final 0-100 score from real negotiation outcomes: salary
// improvement vs. the initial offer (up to 60pts) plus extra benefits
// successfully negotiated (up to 40pts). Guards against a 0 initial_salary
// (division by zero → NaN) and floors the result at 0 so onComplete always
// receives an honest 0-100 value.
function computeNegotiationScore(
  initialSalary: number,
  finalSalary: number,
  thingsNegotiated: number
): number {
  const improvement = initialSalary > 0 ? (finalSalary - initialSalary) / initialSalary : 0;
  const improvementScore = Math.min(improvement * 400, 60);
  const thingsScore = Math.min(thingsNegotiated * 20, 40);
  return Math.max(0, Math.min(Math.round(improvementScore + thingsScore), 100));
}

function getCompanyResponse(option: NegotiationOption, success: boolean, job: Job): string {
  if (option.type === 'accept') {
    return '¡Perfecto! Bienvenido/a al equipo. Nos da gusto tenerte con nosotros. 🤝';
  }
  if (success) {
    const messages: Record<NegotiationOption['type'], string> = {
      salary_increase: `¡Muy bien! Aceptamos aumentar tu sueldo. Valoramos tu seguridad. 💪`,
      vacation: `¡Claro que sí! Te damos los días extras de vacaciones. ¡Mereces descansar! 🏖️`,
      training: `¡Excelente iniciativa! Cubriremos tu capacitación. Apostamos a tu desarrollo. 🎓`,
      accept: '',
    };
    return messages[option.type];
  } else {
    const messages: Record<NegotiationOption['type'], string> = {
      salary_increase: `Hmm, por ahora el presupuesto no nos da para eso. Te ofrecemos quedarnos en ${formatPesos(job.initial_salary)} y revisarlo en 6 meses. 🤔`,
      vacation: `En este momento no podemos agregar más días, pero podemos hablar de un bono de productividad. 😅`,
      training: `La capacitación extra está fuera del presupuesto ahora, pero tienes acceso a nuestra plataforma interna. 📚`,
      accept: '',
    };
    return messages[option.type];
  }
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function BarChart({
  baseValues,
  negotiatedValues,
  labels,
}: {
  baseValues: number[];
  negotiatedValues: number[];
  labels: string[];
}) {
  const maxVal = Math.max(...baseValues, ...negotiatedValues) || 1;
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-end gap-2 justify-center h-40">
        {labels.map((label, i) => {
          const baseH = Math.round((baseValues[i] / maxVal) * 100);
          const negH = Math.round((negotiatedValues[i] / maxVal) * 100);
          return (
            <div key={label} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-32">
                <div
                  className="rounded-t-lg bg-white/20 transition-all duration-700 min-w-[16px]"
                  style={{ height: `${baseH}%` }}
                  title={`Sin negociar: ${formatPesos(baseValues[i])}`}
                />
                <div
                  className="rounded-t-lg bg-emerald-400 transition-all duration-700 min-w-[16px]"
                  style={{ height: `${negH}%` }}
                  title={`Negociado: ${formatPesos(negotiatedValues[i])}`}
                />
              </div>
              <span className="text-[10px] text-white/50 font-bold">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 justify-center mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-white/20" />
          <span className="text-[10px] text-white/60 font-bold">Sin negociar</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-400" />
          <span className="text-[10px] text-emerald-300 font-bold">Negociado</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function NegociaSueldo({
  activity,
  onComplete,
}: {
  activity: Activity;
  onComplete: (score: number) => void;
}) {
  const content = activity.content as unknown as NegociaSueldoContent;

  const [phase, setPhase] = useState<Phase>('start');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [negotiation, setNegotiation] = useState<NegotiationState>({
    currentSalary: 0,
    rounds: [],
    roundNumber: 1,
    lastCompanyResponse: null,
    thingsNegotiated: 0,
  });
  const [showResponse, setShowResponse] = useState(false);
  const [pendingRound, setPendingRound] = useState<NegotiationRound | null>(null);
  const [score, setScore] = useState(0);
  const [projectionData, setProjectionData] = useState<{
    base: number[];
    negotiated: number[];
    diff: number;
  } | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [phase]);

  const handleSelectJob = useCallback(
    (job: Job) => {
      setSelectedJob(job);
      setNegotiation({
        currentSalary: job.initial_salary,
        rounds: [],
        roundNumber: 1,
        lastCompanyResponse: `¡Hola! Nos alegra tenerte aquí. Te ofrecemos ${formatPesos(job.initial_salary)} mensuales como ${job.title}. ¿Qué te parece? 😊`,
        thingsNegotiated: 0,
      });
      setPhase('negotiation');
    },
    []
  );

  const handleNegotiationOption = useCallback(
    (option: NegotiationOption) => {
      if (!selectedJob) return;

      const success = option.type === 'accept' ? true : Math.random() < option.success_rate;
      let salaryGained = 0;
      let benefitGained: string | null = null;

      if (success) {
        if (option.type === 'salary_increase') {
          const newSalary = Math.min(
            negotiation.currentSalary + option.value,
            selectedJob.max_salary
          );
          salaryGained = newSalary - negotiation.currentSalary;
        } else if (option.type === 'vacation') {
          benefitGained = '🏖️ Días de vacaciones extra';
        } else if (option.type === 'training') {
          benefitGained = '🎓 Capacitación pagada';
        }
      }

      const round: NegotiationRound = {
        optionType: option.type,
        optionLabel: option.label,
        success,
        salaryGained,
        benefitGained,
      };

      const companyResponse = getCompanyResponse(option, success, selectedJob);
      const newSalary = success && option.type === 'salary_increase'
        ? negotiation.currentSalary + salaryGained
        : negotiation.currentSalary;
      const newThings = success && option.type !== 'accept'
        ? negotiation.thingsNegotiated + 1
        : negotiation.thingsNegotiated;

      setPendingRound(round);
      setNegotiation((prev) => ({
        ...prev,
        currentSalary: newSalary,
        rounds: [...prev.rounds, round],
        lastCompanyResponse: companyResponse,
        roundNumber: prev.roundNumber + 1,
        thingsNegotiated: newThings,
      }));
      setShowResponse(true);
    },
    [selectedJob, negotiation]
  );

  const handleContinueAfterResponse = useCallback(() => {
    setShowResponse(false);
    setPendingRound(null);

    const isAccept = pendingRound?.optionType === 'accept';
    const maxRounds = 3;
    const currentRound = negotiation.roundNumber;

    if (isAccept || currentRound > maxRounds) {
      // Move to projection phase
      if (selectedJob) {
        const proj = calcProjection(selectedJob.initial_salary, negotiation.currentSalary);
        const diff = calcAccumulatedDiff(proj.base, proj.negotiated);
        setProjectionData({ ...proj, diff });

        // Calculate score
        const finalScore = computeNegotiationScore(
          selectedJob.initial_salary,
          negotiation.currentSalary,
          negotiation.thingsNegotiated
        );
        setScore(finalScore);
      }
      setPhase('projection');
    }
  }, [pendingRound, negotiation, selectedJob]);

  // Guard against onComplete firing more than once per attempt (double-click).
  const hasFinishedRef = useRef(false);
  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    onComplete(score);
  }, [onComplete, score]);

  // ── PHASE: START ─────────────────────────────────────────────────────────

  if (phase === 'start') {
    return (
      <div
        className={`w-full min-h-[500px] flex flex-col items-center justify-center gap-8 p-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="text-center space-y-3">
          <div className="text-6xl animate-bounce">💼</div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
            Negocia tu<br />
            <span className="text-purple-300">Primer Sueldo</span>
          </h1>
          <p className="text-white/70 font-bold text-lg max-w-sm mx-auto leading-snug">
            Aprende a negociar como un profesional y descubre cuánto puedes ganar en 5 años 🚀
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
          {[
            { emoji: '🏢', label: 'Elige empresa' },
            { emoji: '🤝', label: 'Negocia' },
            { emoji: '📈', label: 'Proyecta' },
          ].map((step) => (
            <div
              key={step.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
            >
              <div className="text-2xl mb-1">{step.emoji}</div>
              <p className="text-[11px] font-black text-white/70 uppercase tracking-wider">
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase('offers')}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 active:scale-95 min-h-[52px]"
        >
          ¡Empezar! 🎯
        </button>
      </div>
    );
  }

  // ── PHASE: OFFERS ────────────────────────────────────────────────────────

  if (phase === 'offers') {
    return (
      <div
        className={`w-full flex flex-col gap-6 p-4 md:p-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="text-center space-y-1">
          <div className="text-3xl">🏢</div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Elige una oferta para negociar
          </h2>
          <p className="text-white/60 text-sm font-bold">
            Selecciona la empresa que más te interese
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => handleSelectJob(job)}
              className="rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/60 hover:bg-purple-900/20 p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{job.emoji}</span>
                <div>
                  <p className="font-black text-white text-base leading-tight">{job.company}</p>
                  <p className="text-purple-300 text-xs font-bold uppercase tracking-wider">
                    {job.title}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-0.5">
                  Sueldo inicial
                </p>
                <p className="text-emerald-300 font-black text-xl">
                  {formatPesos(job.initial_salary)}
                  <span className="text-white/40 text-xs font-bold"> /mes</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {job.benefits.slice(0, 3).map((benefit) => (
                  <span
                    key={benefit.name}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold text-white/70"
                  >
                    {benefit.emoji} {benefit.name}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest group-hover:underline">
                  Seleccionar →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── PHASE: NEGOTIATION ───────────────────────────────────────────────────

  if (phase === 'negotiation' && selectedJob) {
    const maxRounds = 3;
    const canContinue = negotiation.roundNumber <= maxRounds;

    return (
      <div
        className={`w-full flex flex-col gap-5 p-4 md:p-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedJob.emoji}</span>
            <div>
              <p className="font-black text-white text-base">{selectedJob.company}</p>
              <p className="text-purple-300 text-xs font-bold">{selectedJob.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
              Ronda {Math.min(negotiation.roundNumber, maxRounds)} / {maxRounds}
            </p>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: maxRounds }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-all ${i < negotiation.roundNumber - 1 ? 'bg-purple-400' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Current offer */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-900/10 p-4 text-center">
          <p className="text-[11px] text-emerald-300 font-black uppercase tracking-widest mb-1">
            Oferta actual en mesa
          </p>
          <p className="text-3xl font-black text-white">
            {formatPesos(negotiation.currentSalary)}
            <span className="text-white/40 text-sm font-bold"> /mes</span>
          </p>
          {negotiation.currentSalary > selectedJob.initial_salary && (
            <p className="text-emerald-400 text-xs font-bold mt-1">
              ↑ +{formatPesos(negotiation.currentSalary - selectedJob.initial_salary)} sobre la oferta inicial 🎉
            </p>
          )}
        </div>

        {/* Prestaciones */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] text-white/40 font-black uppercase tracking-widest mb-3">
            📋 Prestaciones de ley desglosadas
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: 'IMSS',
                emoji: '🏥',
                value: calcIMSS(negotiation.currentSalary),
                hint: 'Seguro médico',
              },
              {
                label: 'Aguinaldo',
                emoji: '🎄',
                value: calcAguinaldo(negotiation.currentSalary),
                hint: '15 días / año',
              },
              {
                label: 'Fondo de Ahorro',
                emoji: '🐷',
                value: calcFondoAhorro(negotiation.currentSalary),
                hint: '8% mensual',
              },
              {
                label: 'INFONAVIT',
                emoji: '🏠',
                value: calcINFONAVIT(negotiation.currentSalary),
                hint: 'Vivienda',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white/5 border border-white/10 p-2.5"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span>{item.emoji}</span>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p className="text-emerald-300 font-black text-sm">
                  {formatPesos(item.value)}
                  <span className="text-white/30 text-[9px] font-bold"> /mes</span>
                </p>
                <p className="text-[9px] text-white/30 font-bold">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company chat bubble */}
        {negotiation.lastCompanyResponse && !showResponse && (
          <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🏢</span>
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">
                Empresa dice:
              </span>
            </div>
            <p className="text-white font-bold text-sm leading-snug">
              {negotiation.lastCompanyResponse}
            </p>
          </div>
        )}

        {/* Response screen (after choosing option) */}
        {showResponse && pendingRound && (
          <div
            className={`rounded-3xl border p-5 text-center ${pendingRound.success ? 'border-emerald-500/40 bg-emerald-900/20' : 'border-red-500/30 bg-red-900/10'}`}
          >
            <div className="text-4xl mb-2">
              {pendingRound.success ? '🎉' : '😅'}
            </div>
            <p
              className={`font-black text-lg mb-2 ${pendingRound.success ? 'text-emerald-300' : 'text-red-300'}`}
            >
              {pendingRound.success ? '¡Lo lograste!' : 'No esta vez...'}
            </p>
            <p className="text-white/70 text-sm font-bold mb-1">
              {negotiation.lastCompanyResponse}
            </p>
            {pendingRound.success && pendingRound.salaryGained > 0 && (
              <p className="text-emerald-400 font-black text-base mt-2">
                +{formatPesos(pendingRound.salaryGained)} a tu sueldo 💪
              </p>
            )}
            {pendingRound.success && pendingRound.benefitGained && (
              <p className="text-emerald-400 font-black text-base mt-2">
                {pendingRound.benefitGained} ganada! ✅
              </p>
            )}
            <button
              onClick={handleContinueAfterResponse}
              className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 active:scale-95 min-h-[44px]"
            >
              {pendingRound.optionType === 'accept' || negotiation.roundNumber > maxRounds
                ? 'Ver proyección →'
                : 'Continuar negociando →'}
            </button>
          </div>
        )}

        {/* Negotiation options */}
        {!showResponse && canContinue && (
          <div className="space-y-2">
            <p className="text-[11px] text-white/40 font-black uppercase tracking-widest text-center">
              ¿Qué quieres hacer?
            </p>
            <div className="grid grid-cols-1 gap-2">
              {content.negotiation_options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleNegotiationOption(option)}
                  className={`w-full px-5 py-3.5 rounded-2xl border text-left font-bold text-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] min-h-[52px]
                    ${option.type === 'accept'
                      ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white/80'
                      : 'border-purple-500/30 bg-purple-900/20 hover:bg-purple-800/30 text-white'
                    }`}
                >
                  <span className="mr-2">
                    {option.type === 'salary_increase' && '💰'}
                    {option.type === 'vacation' && '🏖️'}
                    {option.type === 'training' && '🎓'}
                    {option.type === 'accept' && '✅'}
                  </span>
                  {option.label}
                  {option.type !== 'accept' && (
                    <span className="ml-2 text-[10px] text-white/30 font-black">
                      ({Math.round(option.success_rate * 100)}% éxito)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skip to projection if max rounds reached and no pending response */}
        {!showResponse && !canContinue && (
          <div className="text-center">
            <p className="text-white/60 font-bold text-sm mb-3">
              ¡Terminaste las rondas de negociación!
            </p>
            <button
              onClick={() => {
                if (selectedJob) {
                  const proj = calcProjection(selectedJob.initial_salary, negotiation.currentSalary);
                  const diff = calcAccumulatedDiff(proj.base, proj.negotiated);
                  setProjectionData({ ...proj, diff });
                  setScore(
                    computeNegotiationScore(
                      selectedJob.initial_salary,
                      negotiation.currentSalary,
                      negotiation.thingsNegotiated
                    )
                  );
                }
                setPhase('projection');
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 active:scale-95 min-h-[44px]"
            >
              Ver proyección a 5 años →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── PHASE: PROJECTION ────────────────────────────────────────────────────

  if (phase === 'projection' && selectedJob && projectionData) {
    const yearLabels = ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'];

    return (
      <div
        className={`w-full flex flex-col gap-5 p-4 md:p-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="text-center space-y-1">
          <div className="text-4xl">📈</div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            Proyección a 5 años
          </h2>
          <p className="text-white/60 text-sm font-bold">
            Así crece tu sueldo con incrementos del 5% anual
          </p>
        </div>

        {/* Chart */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <BarChart
            baseValues={projectionData.base}
            negotiatedValues={projectionData.negotiated}
            labels={yearLabels}
          />
        </div>

        {/* Year 1 vs Year 5 comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
              Año 1 — Negociado
            </p>
            <p className="text-emerald-300 font-black text-lg">
              {formatPesos(projectionData.negotiated[0])}
            </p>
            <p className="text-[10px] text-white/30 font-bold">
              vs {formatPesos(projectionData.base[0])} sin negociar
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
              Año 5 — Negociado
            </p>
            <p className="text-emerald-300 font-black text-lg">
              {formatPesos(projectionData.negotiated[4])}
            </p>
            <p className="text-[10px] text-white/30 font-bold">
              vs {formatPesos(projectionData.base[4])} sin negociar
            </p>
          </div>
        </div>

        {/* Accumulated difference */}
        <div
          className={`rounded-3xl border p-5 text-center ${projectionData.diff > 0 ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-white/10 bg-white/5'}`}
        >
          <p className="text-[11px] text-white/50 font-black uppercase tracking-widest mb-1">
            Diferencia acumulada en 5 años
          </p>
          {projectionData.diff > 0 ? (
            <>
              <p className="text-3xl font-black text-emerald-300">
                +{formatPesos(projectionData.diff)}
              </p>
              <p className="text-white/60 font-bold text-sm mt-1">
                ¡Eso es lo que ganas extra por negociar! 🤑
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black text-white/60">
                {formatPesos(0)} de diferencia
              </p>
              <p className="text-white/40 font-bold text-sm mt-1">
                Aceptaste la oferta inicial. ¡La próxima vez negocia! 💪
              </p>
            </>
          )}
        </div>

        {/* Rounds summary */}
        {negotiation.rounds.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-3">
              🗒️ Resumen de negociación
            </p>
            <div className="space-y-2">
              {negotiation.rounds.map((round, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded-xl ${round.success ? 'bg-emerald-900/20' : 'bg-white/5'}`}
                >
                  <span className="text-lg">
                    {round.success ? '✅' : '❌'}
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-xs font-bold leading-tight">
                      {round.optionLabel}
                    </p>
                    {round.success && round.salaryGained > 0 && (
                      <p className="text-emerald-400 text-[10px] font-bold">
                        +{formatPesos(round.salaryGained)} ganados
                      </p>
                    )}
                    {round.success && round.benefitGained && (
                      <p className="text-emerald-400 text-[10px] font-bold">
                        {round.benefitGained}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setPhase('results')}
          className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[52px]"
        >
          Ver mis resultados 🏆
        </button>
      </div>
    );
  }

  // ── PHASE: RESULTS ───────────────────────────────────────────────────────

  if (phase === 'results' && selectedJob) {
    const starCount =
      score >= 85 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;

    const getMessage = () => {
      if (score >= 85)
        return {
          emoji: '🏆',
          title: '¡Eres un negociador experto!',
          body: 'Lograste mejorar tu oferta significativamente y asegurar prestaciones extras. En el mundo real, esto puede valer cientos de miles de pesos.',
          color: 'text-yellow-300',
        };
      if (score >= 60)
        return {
          emoji: '🌟',
          title: '¡Muy bien negociado!',
          body: 'Lograste mejorar tu oferta. Con más práctica puedes llegar a ser un experto en negociación salarial.',
          color: 'text-emerald-300',
        };
      if (score >= 30)
        return {
          emoji: '💪',
          title: 'Buen intento',
          body: 'Negociar da miedo al principio. Recuerda: las empresas esperan que negocies. ¡La práctica hace al maestro!',
          color: 'text-purple-300',
        };
      return {
        emoji: '📚',
        title: 'Oportunidad de mejorar',
        body: 'Aceptaste la primera oferta. En México, el 75% de las personas no negocia su sueldo. ¡Tú puedes ser diferente!',
        color: 'text-white/70',
      };
    };

    const msg = getMessage();

    return (
      <div
        className={`w-full flex flex-col gap-6 p-4 md:p-6 items-center transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="text-center space-y-3">
          <div className="text-6xl animate-bounce">{msg.emoji}</div>
          <h2 className={`text-2xl font-black uppercase tracking-tight ${msg.color}`}>
            {msg.title}
          </h2>

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((star) => (
              <span
                key={star}
                className={`text-3xl transition-all duration-500 ${star <= starCount ? 'text-yellow-400 scale-110' : 'text-white/20'}`}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Score circle */}
          <div className="relative w-28 h-28 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={score >= 85 ? '#facc15' : score >= 60 ? '#34d399' : score >= 30 ? '#a78bfa' : '#ffffff30'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 264} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{score}</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                pts
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 max-w-sm w-full text-center">
          <p className="text-white font-bold text-sm leading-relaxed">{msg.body}</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-wider mb-1">
              Empresa elegida
            </p>
            <p className="text-white font-black text-sm">
              {selectedJob.emoji} {selectedJob.company}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-wider mb-1">
              Sueldo final
            </p>
            <p className="text-emerald-300 font-black text-sm">
              {formatPesos(negotiation.currentSalary)}/mes
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-wider mb-1">
              Cosas negociadas
            </p>
            <p className="text-purple-300 font-black text-xl">
              {negotiation.thingsNegotiated}
            </p>
          </div>
          {projectionData && projectionData.diff > 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4 text-center">
              <p className="text-[10px] text-emerald-300 font-black uppercase tracking-wider mb-1">
                Ganancia extra 5 años
              </p>
              <p className="text-emerald-300 font-black text-sm">
                +{formatPesos(projectionData.diff)}
              </p>
            </div>
          )}
        </div>

        {/* Key lesson */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4 max-w-sm w-full">
          <p className="text-[10px] text-purple-300 font-black uppercase tracking-widest mb-2">
            💡 Lo que aprendiste hoy
          </p>
          <p className="text-white/80 font-bold text-sm leading-relaxed">
            Negociar tu sueldo es una habilidad que se aprende. Las prestaciones de ley (IMSS,
            aguinaldo, fondo de ahorro, INFONAVIT) son parte de tu compensación total y valen
            mucho dinero. ¡Siempre conócelas!
          </p>
        </div>

        <button
          onClick={handleFinish}
          className="w-full max-w-sm px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-h-[52px]"
        >
          Finalizar 🎓
        </button>
      </div>
    );
  }

  // Fallback
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-8">
      <p className="text-white/40 font-bold text-center">Cargando juego...</p>
    </div>
  );
}
