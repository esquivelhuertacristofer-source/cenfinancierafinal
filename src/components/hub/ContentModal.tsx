'use client';

import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { Play, BookOpen, Printer, CheckCircle2, Zap, Sparkles, Trophy, PlayCircle, FileText, ArrowLeft, Target, Activity, Gamepad2, Compass, Coins, ChevronRight, X } from 'lucide-react';
import { markActivityComplete } from '../../lib/hub';
import { getActivityData, calculateXP, getAndUpdateRacha } from '../../lib/activities';

// Importación de todos los motores de actividades Diamond State
import QuizActivity from '../activities/QuizActivity';
import TriviaActivity from '../activities/TriviaActivity';
import StoryActivity from '../activities/StoryActivity';
import GameActivity from '../activities/GameActivity';
import DragDropActivity from '../activities/DragDropActivity';
import MatchingActivity from '../activities/MatchingActivity';
import FillBlanksActivity from '../activities/FillBlanksActivity';
import RouletteActivity from '../activities/RouletteActivity';
import BalanceActivity from '../activities/BalanceActivity';
import RadarActivity from '../activities/RadarActivity';
import GrowthActivity from '../activities/GrowthActivity';
import ServiceControlActivity from '../activities/ServiceControlActivity';

// ─── Importaciones dinámicas de mecánicas Supremo (lazy-loaded) ──────────────
import dynamic from 'next/dynamic';

// Simulator (recharts) y Builder (mathjs) se cargan solo en el navegador:
// sus librerías están excluidas del bundle del Worker (ver next.config.ts,
// límite 3 MiB gzip del plan free de Cloudflare) y renderizarlas en SSR
// crashearía con imports vacíos.
const SimulatorActivity = dynamic(() => import('../activities/SimulatorActivity'), { ssr: false });
const BuilderActivity = dynamic(() => import('../activities/BuilderActivity'), { ssr: false });
const JornadaActivity = dynamic(() => import('../activities/JornadaActivity'), { ssr: false });

const SupremoLoading = () => (
  <div className="flex items-center justify-center py-40 gap-4">
    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-white/40 font-black uppercase tracking-[0.16em] md:tracking-[0.3em] text-sm">Cargando Reto...</span>
  </div>
);

const CochintoVivo     = dynamic(() => import('./mechanics/CochintoVivo'),     { ssr: false, loading: () => <SupremoLoading /> });
const SupermercadoCaos = dynamic(() => import('./mechanics/SupermercadoCaos'), { ssr: false, loading: () => <SupremoLoading /> });
const FamiliaRamirez   = dynamic(() => import('./mechanics/FamiliaRamirez'),   { ssr: false, loading: () => <SupremoLoading /> });
const BancoDelTiempo   = dynamic(() => import('./mechanics/BancoDelTiempo'),   { ssr: false, loading: () => <SupremoLoading /> });
const InversorA10      = dynamic(() => import('./mechanics/InversorA10'),      { ssr: false, loading: () => <SupremoLoading /> });
const PrimerNegocio    = dynamic(() => import('./mechanics/PrimerNegocio'),    { ssr: false, loading: () => <SupremoLoading /> });
const NegociaSueldo    = dynamic(() => import('./mechanics/NegociaSueldo'),    { ssr: false, loading: () => <SupremoLoading /> });
const CrisisRoom       = dynamic(() => import('./mechanics/CrisisRoom'),       { ssr: false, loading: () => <SupremoLoading /> });
const PortfolioBuilder = dynamic(() => import('./mechanics/PortfolioBuilder'), { ssr: false, loading: () => <SupremoLoading /> });

import VideoFrame from './VideoFrame';
import { UNIT_VIDEOS, VIDEO_TITULOS, urlVideo } from '@/lib/videos-generados';
import { videosDeExperto } from '@/lib/expertVideos';

import type { Unit, PillarMeta, ContentType } from '../../lib/hub';
import type { FasePedagogica, SeccionTeorica } from '@/types/pedagogia';
import type { LucideIcon } from 'lucide-react';
import type { ActividadCruda as ActividadCrudaCompartida } from '@/types/activities';

interface ContentModalProps {
  unit: Unit;
  pillar: PillarMeta;
  completed: Set<string>;
  userId: string | null;
  onComplete: (activityId: string) => void;
  onClose: () => void;
}

const MODALITY_ICONS_MODERN: Record<string, LucideIcon> = {
  video: Play,
  reading: BookOpen,
  simulator: Gamepad2,
  printable: Printer,
  quiz: Trophy,
  theory: Sparkles,
  strategy: Compass,
};

type ThemeType = 'general' | 'emprendimiento' | 'deuda' | 'fuga-dinero' | 'imprevistos' | 'banco' | 'deseo' | 'planeacion-financiera' | 'guia-financiera' | 'ahorro';

function getUnitTheme(unit: Unit): ThemeType {
  const text = (unit.title + ' ' + (unit.objective || '')).toLowerCase();
  if (text.includes('emprend') || text.includes('negocio') || text.includes('idea') || text.includes('vender') || text.includes('empresa')) return 'emprendimiento';
  if (text.includes('deuda') || text.includes('prestam') || text.includes('interes') || text.includes('credit')) return 'deuda';
  if (text.includes('fuga') || text.includes('gastos') || text.includes('hormiga')) return 'fuga-dinero';
  if (text.includes('imprevist') || text.includes('emergencia') || text.includes('riesgo') || text.includes('seguro')) return 'imprevistos';
  if (text.includes('deseo') || text.includes('gusto') || text.includes('antojo') || text.includes('capricho')) return 'deseo';
  if (text.includes('plan') || text.includes('meta') || text.includes('presupuesto') || text.includes('futuro') || text.includes('organiz')) return 'planeacion-financiera';
  if (text.includes('ahorro') || text.includes('guardar') || text.includes('alcancia')) return 'ahorro';
  if (text.includes('banco') || text.includes('cuenta') || text.includes('cajero')) return 'banco';
  if (text.includes('guia') || text.includes('financiera') || text.includes('finanzas') || text.includes('conceptos')) return 'guia-financiera';
  return 'general';
}

function getActivityId(unitCode: string, type: ContentType) {
  const suffix = type === 'quiz' ? 'B' : 'A';
  return `ACT-${unitCode}-${suffix}`;
}

// Posiciones aleatorias para partículas decorativas (estrellas/confeti).
// Se calculan una sola vez vía useMemo, nunca inline en el JSX de render.
function generateSparklePositions(count: number) {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    width: Math.random() * 2 + 0.5,
    height: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
  }));
}

function generateConfettiPositions(count: number) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
  }));
}

// ─── Componentes Optimizados con Memo ─────────────────────────────────────────

const AdventureBackground = memo(({ color, theme }: { color: string, theme: ThemeType }) => {
  const sparkles = useMemo(() => generateSparklePositions(30), []);
  return (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#0F0225] via-[#0A0118] to-[#120526]">
    <div 
      className="absolute -top-[20%] -right-[10%] w-[100%] h-[100%] blur-[150px] rounded-full opacity-20 animate-pulse"
      style={{ 
        background: `radial-gradient(circle, ${
          theme === 'deuda' ? '#4F46E5' : 
          theme === 'emprendimiento' ? '#F59E0B' : 
          theme === 'planeacion-financiera' ? '#10B981' :
          theme === 'deseo' ? '#EC4899' :
          theme === 'ahorro' ? '#059669' :
          theme === 'guia-financiera' ? '#06B6D4' :
          color
        } 0%, transparent 70%)` 
      }}
    />
    <div className="absolute inset-0 z-10 opacity-20">
       {/* Adorno del fondo: no aporta informacion, asi que se marca como decorativa. */}
       <img 
          alt=""
          src="/assets/png/coin-portal.png" 
          className="absolute -top-24 -left-24 w-[340px] h-[340px] md:-top-40 md:-left-40 md:w-[600px] md:h-[600px] animate-spin-slow mix-blend-screen grayscale brightness-150" 
          loading="lazy"
          decoding="async"
          style={{ animationDuration: '60s' }}
       />
       <img 
          alt=""
          src="/assets/png/coin-bill-friends.png" 
          className="absolute bottom-10 right-10 w-56 h-56 md:w-96 md:h-96 animate-float-slow opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" 
          loading="lazy"
          decoding="async"
       />
    </div>
    <div className="absolute inset-0 opacity-30">
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle shadow-[0_0_10px_white]"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.width}px`,
            height: `${s.height}px`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}
    </div>
  </div>
  );
});
AdventureBackground.displayName = 'AdventureBackground';

const ProgressEnergyBar = memo(({ progress }: { progress: number }) => (
  <div className="fixed top-0 left-0 w-full z-[2100]">
     <div className="absolute top-3 left-3 md:top-6 md:left-12 flex items-center gap-2 md:gap-4 group animate-in slide-in-from-left duration-1000">
        <div className="relative">
           <div className="absolute inset-0 bg-[#FF8C00] blur-xl opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
           {/* La mascota acompania al texto de al lado; nombrarla lo repetiria. */}
           <img 
              alt=""
              src="/assets/png/ceny-guide.png" 
              className="w-10 h-10 md:w-16 md:h-16 relative z-10 drop-shadow-2xl animate-bounce-slow" 
              fetchPriority="high"
           />
        </div>
        <div className="px-3 py-1.5 md:px-5 md:py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl flex flex-col">
           <span className="text-[8px] font-black text-[#FF8C00] uppercase tracking-[0.2em] mb-0.5">Tu Guía CEN</span>
           <span className="text-[10px] font-black text-white uppercase tracking-widest">¡Vamos {progress >= 50 ? 'excelente' : 'por ello'}!</span>
        </div>
     </div>
     <div className="w-full h-1.5 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-[#FF8C00] to-[#FFD700] transition-all duration-1000 ease-out shadow-[0_0_25px_#FF8C00]"
          style={{ width: `${progress}%` }}
        />
     </div>
  </div>
));
ProgressEnergyBar.displayName = 'ProgressEnergyBar';

const FiscalSummaryCard = memo(({ unitCode }: { unitCode: string }) => {
  if (!unitCode.startsWith('S3')) return null;

  return (
    <div className="mt-12 mb-8 md:mb-16 md:mt-20 md:mb-32 p-6 md:p-12 bg-gradient-to-br from-[#FF8C00]/20 to-yellow-500/10 border border-[#FF8C00]/30 rounded-[32px] md:rounded-[60px] backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-5 md:p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Coins size={200} /></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <div className="space-y-4 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF8C00] text-black rounded-full text-[10px] font-black uppercase tracking-widest">Contexto Fiscal 2026</div>
           <h4 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase">Indicadores Maestros</h4>
           <p className="text-xl text-white/40 font-medium max-w-sm">Datos oficiales actualizados para la simulación de tu vida adulta.</p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
           {[
             { label: 'Salario Mínimo', value: '$330.00', unit: 'MXN/Día', icon: Zap },
             { label: 'Valor UMA', value: '$122.00', unit: 'MXN', icon: Target },
             { label: 'Tasa CETES', value: '9.00%', unit: 'Anual', icon: Activity }
           ].map((stat, i) => (
             <div key={i} className="p-8 bg-white/5 rounded-[24px] md:rounded-[40px] border border-white/5 hover:border-white/10 transition-all">
                <stat.icon size={24} className="text-[#FF8C00] mb-4" />
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{stat.label}</div>
                <div className="text-2xl md:text-4xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold text-white/20 mt-1">{stat.unit}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
});
FiscalSummaryCard.displayName = 'FiscalSummaryCard';

// ─── Pestañas Optimizadas ─────────────────────────────────────────────────────

const TheoryTab = memo(({ unit, onComplete, isDone, theme, onShowVideo, nextLabel }: { unit: Unit; onComplete: () => void; isDone: boolean; theme: ThemeType; onShowVideo: (video: { url: string; title: string }) => void; nextLabel?: string }) => {
  const [readingFinished, setReadingFinished] = useState(isDone);
  /* La ficha pinta el marco teorico si lo hay y, si no, las fases del plan de clase. Son dos
     formas distintas del mismo hueco —una trae `subtitle`/`content` y la otra `title`/`description`—
     y antes se leian con `a || b` sobre un `any`, que funciona por casualidad: si un dia una de las
     dos cambia de nombre de campo, el hueco se queda en blanco y nadie se entera. Con la union
     nombrada, cambiar un campo rompe la compilacion, que es justo lo que se quiere. */
  const sections: (SeccionTeorica | FasePedagogica)[] =
    unit.theory?.sections || unit.strategy?.phases || [];
  const intro = unit.theory?.introduction || unit.strategy?.objective || unit.objective;
  const unitNumber = parseInt(unit.code.match(/\d+/)?.[0] || '1');
  
  const getThemeImage = (idx: number) => {
    if (theme === 'general') return `/assets/extra/${(unitNumber + idx) % 18 || 1}.png`;
    const themeFolderMap: Record<string, string> = {
      'emprendimiento': 'emprendimiento', 'deuda': 'deuda', 'fuga-dinero': 'fuga-dinero',
      'imprevistos': 'imprevistos', 'banco': 'banco', 'deseo': 'deseo',
      'planeacion-financiera': 'planeacion-financiera', 'guia-financiera': 'guia-financiera', 'ahorro': 'ahorro'
    };
    const folder = themeFolderMap[theme] || 'extra';
    return `/assets/temas/${folder}/${(idx % 6) || 1}.png`;
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-12 animate-in fade-in duration-1000 relative z-10">
      <div className="relative mb-8 md:mb-16 md:mb-32">
         {/* HEADER CINEMÁTICO */}
         <div className="space-y-4 md:space-y-6 text-center lg:text-left mb-10 md:mb-20">
            <div className="flex items-center justify-center lg:justify-start gap-4 text-[#FF8C00]">
               <Sparkles size={20} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.5em]">Módulo de Teoría Elite</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-9xl font-black text-white leading-[0.95] md:leading-[0.9] tracking-tighter drop-shadow-2xl">
               {unit.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? 'text-[#FF8C00]' : 'text-white'}>{word}{' '}</span>
               ))}
            </h1>
            
            <div className="h-2 w-40 bg-[#FF8C00] rounded-full mx-auto lg:mx-0 opacity-60" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10 lg:gap-20 items-center">
            <div className="space-y-8 order-2 lg:order-1">
               <p className="text-xl md:text-3xl lg:text-4xl font-medium leading-snug text-white/80 tracking-tight italic">
                  &quot;{intro}&quot;
               </p>
               
               <div className="flex flex-wrap gap-4">
                  {(unit.metadata?.competencies?.slice(0, 3) || ['Teoría', 'Análisis', 'Práctica']).map((concept: string, idx: number) => (
                    <div key={idx} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse" />
                       <span className="text-xs font-black uppercase tracking-widest text-white/60">{concept}</span>
                    </div>
                  ))}
               </div>
               
               {/* CLASE MAGISTRAL: el video producido para esta unidad, si lo tiene. */}
               {UNIT_VIDEOS[unit.code] && (
                 <button
                   onClick={() => onShowVideo({
                     url: urlVideo(UNIT_VIDEOS[unit.code]),
                     title: VIDEO_TITULOS[UNIT_VIDEOS[unit.code]] || unit.title,
                   })}
                   className="group flex items-center gap-6 p-2 pr-12 bg-white text-[#0A0118] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)]"
                 >
                   <div className="w-16 h-16 bg-[#FF8C00] rounded-full flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                      <PlayCircle size={32} />
                   </div>
                   <span className="text-xl font-black uppercase tracking-widest">Ver Clase Magistral</span>
                 </button>
               )}

               {/* VIDEOS DE EXPERTO: los del autor en YouTube que traen asignada esta unidad.
                   No sustituyen a la clase magistral; se ofrecen al lado. */}
               {videosDeExperto(unit.code).map((video) => (
                 <button
                   key={video.id}
                   onClick={() => onShowVideo({ url: video.url, title: video.title })}
                   className="group flex w-full items-center gap-5 p-2 pr-8 bg-white/5 border border-white/10 text-white rounded-full transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-95 text-left"
                 >
                   <div className="w-14 h-14 shrink-0 bg-[#42E8E0]/15 border border-[#42E8E0]/30 rounded-full flex items-center justify-center text-[#42E8E0] group-hover:rotate-12 transition-transform">
                      <PlayCircle size={26} />
                   </div>
                   <span className="flex flex-col gap-0.5 min-w-0">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#42E8E0]/70">
                       Video del experto
                     </span>
                     <span className="text-base font-black tracking-tight leading-tight">{video.title}</span>
                     <span className="text-xs font-medium text-white/40 leading-tight">{video.description}</span>
                   </span>
                 </button>
               ))}
            </div>

            <div className="relative aspect-square order-1 lg:order-2 group/hero-img">
               <div className="absolute inset-0 bg-[#FF8C00]/20 rounded-[5rem] blur-[100px] animate-pulse" />
               
               {/* MARCO DECORATIVO DIAMOND */}
               <div className="absolute -inset-4 border border-white/10 rounded-[70px] pointer-events-none z-0 group-hover/hero-img:border-[#FF8C00]/20 transition-all duration-700" />
               <div className="absolute -inset-8 border border-white/5 rounded-[80px] pointer-events-none z-0 group-hover/hero-img:border-[#FF8C00]/10 transition-all duration-1000 delay-100" />
               
               <div className="relative w-full h-full rounded-[32px] md:rounded-[60px] overflow-hidden border-4 border-white/10 shadow-2xl z-10 transition-transform duration-1000 group-hover:scale-105">
                  <img 
                     src={getThemeImage(0)} 
                     className="w-full h-full object-cover animate-float-slow"
                     alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
               </div>
            </div>
         </div>
      </div>

      <FiscalSummaryCard unitCode={unit.code} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {sections.map((section, i: number) => (
          <div key={i} className="group relative">
             <div className="h-full bg-white/[0.03] border border-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] backdrop-blur-3xl flex flex-col gap-5 md:gap-8 hover:bg-white/[0.06] hover:border-[#FF8C00]/30 transition-all duration-500">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#FF8C00] group-hover:scale-110 transition-transform">
                   {i % 2 === 0 ? <Zap size={28} /> : <Target size={28} />}
                </div>
                <div className="space-y-4">
                   <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{tituloDeSeccion(section)}</h3>
                   <p className="text-base md:text-xl text-white/50 leading-relaxed font-medium">{cuerpoDeSeccion(section)}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-40 flex justify-center pb-40">
        {!readingFinished ? (
          <button
            className="group relative h-28 px-24 rounded-[2rem] transition-all hover:scale-[1.05] overflow-hidden bg-white"
            onClick={() => {
              setReadingFinished(true);
              onComplete();
            }}
          >
            <div className="flex items-center gap-6">
               <span className="text-3xl font-black text-[#0A0118] uppercase tracking-[0.16em] md:tracking-[0.3em]">{nextLabel ?? 'Continuar'}</span>
               <div className="w-12 h-12 bg-[#0A0118] rounded-2xl flex items-center justify-center text-white transition-transform group-hover:translate-x-3">
                  <ChevronRight size={24} />
               </div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-5 md:gap-10 px-20 py-10 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded-[1.75rem] md:rounded-[3rem] animate-in zoom-in duration-700">
             <div className="w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-[0_0_40px_#10B981] animate-bounce">
                <CheckCircle2 size={40} />
             </div>
             <div className="text-left">
                <div className="text-xs font-black uppercase tracking-[0.25em] md:tracking-[0.5em] opacity-60 mb-2">Contenido Revisado</div>
                <div className="text-2xl md:text-4xl font-black uppercase tracking-widest">Lectura Completada</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
});
TheoryTab.displayName = 'TheoryTab';

// Función de normalización universal para evitar errores de carga por inconsistencias en JSONs
/** Saca el encabezado de un hueco que puede ser seccion teorica o fase de clase. */
const tituloDeSeccion = (s: SeccionTeorica | FasePedagogica) =>
  'subtitle' in s ? s.subtitle : s.title;

/** Y su cuerpo. */
const cuerpoDeSeccion = (s: SeccionTeorica | FasePedagogica) =>
  'content' in s ? s.content : s.description;

/* El JSON de una actividad llega con la forma que le dio quien la escribio, y esta funcion existe
   precisamente para uniformarla, asi que aqui `unknown` es el tipo honesto: lo que entra no se
   conoce hasta que se mira. */
/**
 * El JSON de una actividad tal y como sale del archivo, antes de uniformarlo.
 *
 * `Record<string, unknown>` no es pereza: es el tipo honesto. Los 742 archivos de
 * `public/data/actividades/` se escribieron a lo largo del tiempo y el mismo dato aparece con
 * nombres distintos —`preguntas` o `questions` o `preguntas_quiz`, `respuesta` o `correcta` o
 * `answer`—, que es justo la razon de ser de la funcion de abajo. Declarar aqui una forma concreta
 * seria afirmar algo que los datos no cumplen. Los tipos buenos viven en `@/types/activities` y
 * empiezan a aplicar despues de normalizar, cuando cada componente de actividad recibe el suyo.
 */
type ActividadCruda = ActividadCrudaCompartida;

/** Un elemento suelto dentro de una actividad: una pregunta, un hueco, un item. */
type ElementoCrudo = Record<string, unknown>;

/** El primer valor con contenido de una lista de alias. */
const primero = (...valores: unknown[]) => valores.find((v) => v !== undefined && v !== null && v !== '');

const normalizeActivityData = (data: ActividadCruda | null | undefined): ActividadCruda | null => {
  if (!data) return null;
  const d: ActividadCruda = { ...data };

  // Normalizar Quizzes y Trivias
  if (!d.preguntas) {
    d.preguntas = d.questions || d.items || d.preguntas_quiz || [];
  }
  if (Array.isArray(d.preguntas)) {
    d.preguntas = (d.preguntas as ElementoCrudo[]).map((q) => ({
      ...q,
      texto: primero(q.texto, q.pregunta, q.question) ?? '',
      opciones: primero(q.opciones, q.choices, q.answers) ?? [],
      correcta: q.correcta !== undefined ? q.correcta : (q.correct_index !== undefined ? q.correct_index : 0),
      explicacion: primero(q.explicacion, q.explanation, q.feedback) ?? '',
    }));
  }

  // Normalizar Simuladores
  if (!d.inputs) d.inputs = d.controles || d.fields || [];

  // Normalizar Drag & Drop
  if (!d.items) d.items = d.elementos || d.objetos || [];
  if (!d.categorias) d.categorias = d.groups || d.categories || [];

  // Normalizar Rellena Blancos
  if (!d.blanks) d.blanks = d.espacios || d.huecos || [];
  if (Array.isArray(d.blanks)) {
    d.blanks = (d.blanks as ElementoCrudo[]).map((b) => ({
      ...b,
      id: String(b.id ?? ''),
      respuesta: primero(b.respuesta, b.correcta, b.answer) ?? '',
    }));
  }

  // Normalizar Decisiones (Decide)
  if (!d.nodos) d.nodos = d.nodes || d.escenas || {};

  return d;
};

// ─── Portada y escena de la actividad (imagenes del flujo Krea2) ─────────────
// Ambas son opcionales: si la actividad no las trae, no se renderiza nada.
/* Estas dos solo leen unos pocos campos de texto, asi que reciben esa forma y no `ActividadCruda`:
   un `unknown` no se puede meter en JSX, y ensancharlo aqui obligaria a castear en cada hueco. */
interface CamposDePortada {
  portada?: string;
  escena?: string;
  titulo?: string;
  complejidad?: string;
  objetivo?: string;
  descripcion?: string;
}

const PortadaActividad = memo(({ data }: { data: CamposDePortada | null }) => {
  if (!data?.portada) return null;
  return (
    <div className="relative w-full h-[200px] md:h-[280px] rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-10">
      <img src={data.portada} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
        <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-[0.2em] md:tracking-[0.4em] italic">
          {data.complejidad || 'Misión'}
        </span>
        <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mt-2 drop-shadow-2xl">
          {data.titulo}
        </h3>
      </div>
    </div>
  );
});
PortadaActividad.displayName = 'PortadaActividad';

const EscenaActividad = memo(({ data }: { data: CamposDePortada | null }) => {
  if (!data?.escena) return null;
  return (
    <div className="hidden md:block relative w-full rounded-[32px] overflow-hidden border border-white/10 mb-10">
      <img src={data.escena} alt="" className="w-full h-[190px] lg:h-[220px] object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0118] via-[#0A0118]/70 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center gap-2 p-8 max-w-2xl">
        {data.objetivo && (
          <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-[0.2em] md:tracking-[0.4em] italic">{data.objetivo}</span>
        )}
        {data.descripcion && (
          <p className="text-base lg:text-lg font-medium text-white/80 leading-snug">{data.descripcion}</p>
        )}
      </div>
    </div>
  );
});
EscenaActividad.displayName = 'EscenaActividad';

const SimulatorTab = memo(({ unitCode, onComplete, isDone, color, isSupremoUnit = false }: { unitCode: string; onComplete: (score?: number) => void; isDone: boolean; color: string; isSupremoUnit?: boolean }) => {
  const [data, setData] = useState<ActividadCruda | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinishedLocal, setIsFinishedLocal] = useState(isDone);

  useEffect(() => {
    const loadData = async () => {
      const activityId = `ACT-${unitCode}-A`;
      const activityData = await getActivityData(activityId);
      setData(normalizeActivityData(activityData));
      setLoading(false);
    };
    loadData();
  }, [unitCode]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-6">
       <div className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
       <p className="text-white/40 font-black uppercase tracking-[0.16em] md:tracking-[0.3em]">Cargando Laboratorio...</p>
    </div>
  );

  if (isFinishedLocal) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in zoom-in duration-700">
        <div className="w-40 h-40 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
           <CheckCircle2 size={80} className="animate-bounce" />
        </div>
        <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Práctica Completada ✓</h3>
        <p className="text-white/40 text-xl font-medium mb-12">Tus resultados han sido sincronizados con el Profesor.</p>
        <button
          onClick={() => onComplete()}
          className="px-8 md:px-16 py-5 md:py-6 bg-white text-[#0A0118] rounded-full font-black uppercase text-xs tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
        >
          {isSupremoUnit ? 'Finalizar Reto' : 'Continuar al Quiz'}
        </button>
      </div>
    );
  }

  if (!data) return (
    <div className="text-center py-40">
       <div className="text-4xl md:text-6xl mb-6">🔧</div>
       <p className="text-white/40 text-2xl font-black mb-4">Actividad no disponible</p>
       <p className="text-white/20 text-base font-medium mb-10">Esta práctica aún no está configurada.<br/>Puedes marcarla como completada y continuar.</p>
       <button onClick={() => onComplete()} className="px-8 md:px-12 py-5 md:py-6 bg-white/5 text-white/40 rounded-full font-black uppercase hover:text-white transition-all">Marcar como completada</button>
    </div>
  );

  // Selector Universal de Motores de Actividades (A) con mapeo de sinónimos
  /* Reparto a los motores. `data.tipo` viene del JSON y puede faltar o no ser cadena, asi que
     se normaliza aqui una vez; abajo, cada `data={data as never}` reconoce que quien decide el
     motor es esta bandera y no el compilador: los catorce declaran formas de `data` distintas
     y su interseccion es vacia. El hueco esta acotado al reparto en vez de dejar el tab entero
     en `any`, que es como estaba. */
  const activityType = String(data.tipo ?? '').toUpperCase().trim();
  
  // Mapeo de tipos (Máxima permisividad para evitar bloqueos)
  const isSimulator = ['SIMULADOR', 'SIMULATOR', 'CALCULADORA', 'CALCULA'].includes(activityType);
  const isBuilder = ['BUILDER', 'CONSTRUCTOR', 'PLANIFICADOR', 'CONSTRUYE', 'PLANIFICA'].includes(activityType);
  const isStory = ['STORY', 'DECIDE', 'AVENTURA', 'CASO', 'HISTORIA', 'LEE', 'EXPLORA'].includes(activityType);
  const isGame = ['GAME', 'JUEGO', 'DESAFIO', 'RETO', 'JUEGA'].includes(activityType);
  const isDragDrop = ['DRAG_DROP', 'ARRASTRE', 'CLASIFICAR', 'ARRASTRA', 'CLASIFICA'].includes(activityType);
  const isMatching = ['MATCHING', 'PAREJAS', 'RELACIONAR', 'RELACIONA', 'UNE'].includes(activityType);
  const isFillBlanks = ['FILL_BLANKS', 'COMPLETAR', 'COMPLETA', 'RELLENA'].includes(activityType);
  const isRoulette = ['ROULETTE', 'RULETA', 'GIRA'].includes(activityType);
  const isBalance = ['BALANCE', 'EQUILIBRIO', 'CALIBRADOR', 'SINCRONIZA'].includes(activityType);
  const isRadar = ['RADAR', 'ESCANEO', 'PRIORIDAD', 'CAZA'].includes(activityType);
  const isGrowth = ['GROWTH', 'CRECIMIENTO', 'BOVEDA', 'SIMULADOR_AHORRO'].includes(activityType);
  const isServiceControl = ['SERVICE_CONTROL', 'CONSOLA', 'SERVICIOS', 'CONTROL_GASTOS', 'CONTROL'].includes(activityType);
  const isTrivia = ['TRIVIA', 'RAPIDO'].includes(activityType);
  const isJornada = ['JORNADA', 'DIA_DE_TRABAJO', 'OFICIOS'].includes(activityType);
  const isQuizType = ['QUIZ', 'CUESTIONARIO', 'EXAMEN', 'EVALUACION'].includes(activityType);

  // ─── Mecánicas Supremo ────────────────────────────────────────────────────
  const rawTipo = String(data.tipo ?? data.type ?? '').toLowerCase().trim();
  const isCochintoVivo     = rawTipo === 'cochinito_vivo';
  const isSupermercadoCaos = rawTipo === 'supermercado_caos';
  const isFamiliaRamirez   = rawTipo === 'familia_ramirez';
  const isBancoDelTiempo   = rawTipo === 'banco_del_tiempo';
  const isInversorA10      = rawTipo === 'inversor_a10';
  const isPrimerNegocio    = rawTipo === 'primer_negocio';
  const isNegociaSueldo    = rawTipo === 'negocia_sueldo';
  const isCrisisRoom       = rawTipo === 'crisis_room';
  const isPortfolioBuilder = rawTipo === 'portfolio_builder';
  const isSupremo = isCochintoVivo || isSupermercadoCaos || isFamiliaRamirez || isBancoDelTiempo ||
                    isInversorA10 || isPrimerNegocio || isNegociaSueldo || isCrisisRoom || isPortfolioBuilder;

  const isKnown = isSimulator || isBuilder || isStory || isGame || isDragDrop || isMatching || isFillBlanks || isRoulette || isBalance || isRadar || isGrowth || isServiceControl || isTrivia || isQuizType || isJornada || isSupremo;

  return (
    <div className="animate-in fade-in duration-1000">
      <PortadaActividad data={data} />
      <EscenaActividad data={data} />
      {isSimulator && <SimulatorActivity data={data as never} accent={color} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isBuilder && <BuilderActivity data={data as never} accent={color} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isStory && <StoryActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isGame && <GameActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isDragDrop && <DragDropActivity data={data as never} accent={color} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isMatching && <MatchingActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isFillBlanks && <FillBlanksActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isRoulette && <RouletteActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isBalance && <BalanceActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isRadar && <RadarActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isGrowth && <GrowthActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isServiceControl && <ServiceControlActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isJornada && <JornadaActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isTrivia && <TriviaActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} onClose={() => {}} />}
      {isQuizType && <QuizActivity data={data as never} onComplete={(s: number) => { setIsFinishedLocal(true); onComplete(s); }} />}

      {/* ─── Mecánicas Supremo ─── */}
      {isCochintoVivo     && <CochintoVivo     activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isSupermercadoCaos && <SupermercadoCaos activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isFamiliaRamirez   && <FamiliaRamirez   activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isBancoDelTiempo   && <BancoDelTiempo   activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isInversorA10      && <InversorA10      activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isPrimerNegocio    && <PrimerNegocio    activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isNegociaSueldo    && <NegociaSueldo    activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isCrisisRoom       && <CrisisRoom       activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}
      {isPortfolioBuilder && <PortfolioBuilder activity={data as never} onComplete={(s) => { setIsFinishedLocal(true); onComplete(s); }} />}

      {!isKnown && (
        <div className="text-center p-8 md:p-20 border border-white/5 bg-white/5 rounded-[28px] md:rounded-[40px]">
           <h3 className="text-white text-2xl md:text-4xl font-black mb-4">Misión Especial Detectada</h3>
           <p className="text-white/40 text-xl mb-10">Este contenido requiere el visor Diamond v2.0 ({activityType})</p>
           <button onClick={() => { setIsFinishedLocal(true); onComplete(); }} className="px-5 md:px-10 py-5 bg-white text-black font-black uppercase rounded-full">Ejecutar en Modo Compatibilidad</button>
        </div>
      )}
    </div>
  );
});
SimulatorTab.displayName = 'SimulatorTab';

const QuizTab = memo(({ unitCode, onComplete, isDone, color }: { unitCode: string; onComplete: (score: number) => void; isDone: boolean; color?: string }) => {
  const [data, setData] = useState<ActividadCruda | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinishedLocal, setIsFinishedLocal] = useState(isDone);
  // Reintento de la evaluación. `intentoEval` remonta el motor desde cero;
  // `puntajeFallido` guarda el resultado que no alcanzó el mínimo para poder
  // explicárselo al alumno en vez de ignorarlo.
  const [intentoEval, setIntentoEval] = useState(0);
  const [puntajeFallido, setPuntajeFallido] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const activityId = `ACT-${unitCode}-B`;
      const quizData = await getActivityData(activityId);
      setData(normalizeActivityData(quizData));
      setLoading(false);
    };
    loadData();
  }, [unitCode]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-6">
       <div className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
       <p className="text-white/40 font-black uppercase tracking-[0.16em] md:tracking-[0.3em]">Sincronizando Desafío...</p>
    </div>
  );

  if (isFinishedLocal) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in zoom-in duration-700">
        <div className="w-40 h-40 rounded-full bg-[#FF8C00]/10 border border-[#FF8C00]/30 flex items-center justify-center text-[#FF8C00] mb-10 shadow-[0_0_50px_rgba(255,140,0,0.2)]">
           <Trophy size={80} className="animate-bounce" />
        </div>
        <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">¡Certificación Lograda!</h3>
        <p className="text-white/40 text-xl font-medium mb-12">Has demostrado dominio total de estos conceptos.</p>
        <button
          onClick={() => onComplete(100)}
          className="px-8 md:px-16 py-5 md:py-6 bg-[#FF8C00] text-black rounded-full font-black uppercase text-xs tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
        >
          Finalizar Misión
        </button>
      </div>
    );
  }

  if (!data) return (
    <div className="text-center py-40">
       <p className="text-white/20 text-3xl font-black mb-8">Esta unidad aún no tiene una evaluación industrializada.</p>
       <button onClick={() => onComplete(100)} className="px-8 md:px-12 py-5 md:py-6 bg-white/5 text-white/40 rounded-full font-black uppercase hover:text-white transition-all">Saltar Evaluación</button>
    </div>
  );

  /* Reparto a los motores. `data.tipo` viene del JSON y puede faltar o no ser cadena, asi que
     se normaliza aqui una vez; abajo, cada `data={data as never}` reconoce que quien decide el
     motor es esta bandera y no el compilador: los catorce declaran formas de `data` distintas
     y su interseccion es vacia. El hueco esta acotado al reparto en vez de dejar el tab entero
     en `any`, que es como estaba. */
  const activityType = String(data.tipo ?? '').toUpperCase().trim();
  const isTrivia = ['TRIVIA', 'DESAFIO', 'RAPIDO', 'RETO'].includes(activityType);
  const isGame = ['GAME', 'JUEGO', 'DESAFIO', 'RETO', 'JUEGA'].includes(activityType);
  const isQuiz = ['QUIZ', 'CUESTIONARIO', 'EXAMEN', 'EVALUACION'].includes(activityType);
  const isFillBlanks = ['RELLENA', 'FILL_BLANKS', 'COMPLETAR', 'COMPLETA'].includes(activityType);
  const isStory = ['DECIDE', 'STORY', 'HISTORIA', 'AVENTURA'].includes(activityType);
  const isDragDrop = ['ARRASTRA', 'DRAG_DROP', 'ARRASTRE', 'CLASIFICA'].includes(activityType);
  const isMatching = ['MEMORIA', 'MATCHING', 'PAREJAS', 'RELACIONA'].includes(activityType);
  const isRoulette = ['RULETA', 'ROULETTE', 'GIRA'].includes(activityType);
  const isBuilder = ['CONSTRUCTOR', 'BUILDER', 'PLANIFICADOR', 'CONSTRUYE', 'PLANIFICA'].includes(activityType);
  const isSimulator = ['SIMULADOR', 'SIMULATOR', 'CALCULADORA', 'CALCULA'].includes(activityType);

  const minimoAprobacion = Math.round((Number(data.aprobacion_minima) || 0.6) * 100);
  // Un puntaje bajo ya no se descarta: se le dice al alumno qué pasó y se le
  // ofrece repetir. Sin esto, la pestaña quedaba muerta tras el primer intento.
  const evaluar = (score: number) => {
    if (score >= minimoAprobacion) {
      setIsFinishedLocal(true);
      onComplete(score);
      return;
    }
    setPuntajeFallido(score);
  };

  return (
    <>
    <div key={intentoEval} className="animate-in fade-in duration-1000">
      <PortadaActividad data={data} />
      <EscenaActividad data={data} />
      {isTrivia && (
        <TriviaActivity
          data={data as never}
          onComplete={evaluar}
          onClose={() => {}}
        />
      )}
      {isGame && (
        <GameActivity
          data={data as never}
          onComplete={evaluar}
        />
      )}
      {isQuiz && (
        <QuizActivity
          data={data as never}
          onComplete={evaluar}
        />
      )}
      {isFillBlanks && (
        <FillBlanksActivity
          data={data as never}
          onComplete={evaluar}
        />
      )}
      {isStory && (
        <StoryActivity
          data={data as never}
          onComplete={evaluar}
        />
      )}
      {isDragDrop && (
        <DragDropActivity
          data={data as never}
          accent={color}
          onComplete={evaluar}
        />
      )}
      {isMatching && (
        <MatchingActivity
          data={data as never}
          onComplete={evaluar}
        />
      )}
      {isRoulette && (
        <RouletteActivity
          data={data as never}
          onComplete={evaluar}
        />
      )}
      {isBuilder && (
        <BuilderActivity
          data={data as never}
          accent={color}
          onComplete={evaluar}
        />
      )}
      {isSimulator && (
        <SimulatorActivity
          data={data as never}
          accent={color}
          onComplete={evaluar}
        />
      )}
      {!isTrivia && !isGame && !isQuiz && !isFillBlanks && !isStory && !isDragDrop && !isMatching && !isRoulette && !isBuilder && !isSimulator && (
        <div className="text-center py-20 space-y-6">
           <p className="text-white/20 text-xl font-black italic">Formato de Evaluación no reconocido: {activityType}</p>
           <button onClick={() => onComplete(100)} className="px-5 md:px-10 py-4 bg-white/10 text-white rounded-full font-black uppercase text-xs tracking-widest">Omitir Evaluación</button>
        </div>
      )}
    </div>

    {puntajeFallido !== null && (
      <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8" role="dialog" aria-modal="true" aria-labelledby="titulo-reintento">
        <div className="max-w-lg w-full bg-[#0a0a0a] border border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-12 text-center space-y-6 md:space-y-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="text-4xl md:text-6xl" aria-hidden="true">🎯</div>
          <div className="space-y-3">
            <h2 id="titulo-reintento" className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Casi lo logras</h2>
            <p className="text-white/50 text-lg font-medium leading-relaxed">
              Obtuviste <span className="text-[#FF8C00] font-black">{puntajeFallido}%</span> y para aprobar esta misión
              necesitas <span className="text-white font-black">{minimoAprobacion}%</span>.
            </p>
            <p className="text-white/30 text-sm">Repasa la teoría y vuelve a intentarlo: no se guarda ningún castigo.</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => { setPuntajeFallido(null); setIntentoEval((n) => n + 1); }}
              className="w-full py-6 bg-white text-black rounded-[32px] font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] hover:scale-[1.02] transition-transform"
            >
              Reintentar
            </button>
            {intentoEval >= 1 && (
              <button
                onClick={() => { const s = puntajeFallido; setPuntajeFallido(null); setIsFinishedLocal(true); onComplete(s); }}
                className="w-full py-4 text-white/30 hover:text-white/70 font-bold text-[11px] uppercase tracking-[0.16em] md:tracking-[0.3em] transition-colors"
              >
                Continuar de todos modos
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
});
QuizTab.displayName = 'QuizTab';

// ─── Componente Principal de la Misión ────────────────────────────────────────

export default function ContentModal({ unit, pillar, completed, userId, onComplete, onClose }: ContentModalProps) {
  const [activeTab, setActiveTab] = useState<ContentType>(unit.contents[0].type);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rankUp, setRankUp] = useState<{ pillarTitle: string; rank: string; color: string } | null>(null);
  /* Que video esta abierto, no solo si hay uno abierto: la unidad puede ofrecer la clase
     magistral producida para la plataforma y ademas uno o varios videos de experto. */
  const [videoAbierto, setVideoAbierto] = useState<{ url: string; title: string } | null>(null);
  const theme = useMemo(() => getUnitTheme(unit), [unit]);
  const tabStartRef = useRef<number>(Date.now());

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    tabStartRef.current = Date.now();
  }, [activeTab]);

  const handleComplete = async (contentType: ContentType, score: number = 100) => {
    const id = getActivityId(unit.code, contentType);

    // Prevenir doble-completado (doble clic, re-render, etc.)
    if (completed.has(id)) return;

    // Guardar copia del estado previo de completados para comparar rangos
    const oldCompleted = new Set(completed);
    const tiempo_segundos = Math.max(0, Math.round((Date.now() - tabStartRef.current) / 1000));

    if (userId && userId !== 'guest_user') {
      try {
        await markActivityComplete(userId, id, { score, tiempo_segundos });
        const actSuffix = contentType === 'quiz' ? 'B' : 'A';
        const actData = await getActivityData(`ACT-${unit.code}-${actSuffix}`);
        const racha = getAndUpdateRacha(userId);
        const xpEarned = calculateXP(score, actData?.xp ?? 150, racha);
        const xpKey = `cen_xp_${userId}`;
        const current = parseInt(localStorage.getItem(xpKey) ?? '0', 10);
        localStorage.setItem(xpKey, String(current + xpEarned));
      } catch {
        // Fallo de red — el flujo continúa; XP se reintentará en próxima sesión
      }
    }
    onComplete(id);
    
    // Detección de Rank Up
    const newCompleted = new Set([...completed, id]);
    const { checkRankUp } = await import('../../lib/hub');
    const newRank = checkRankUp(pillar, oldCompleted, newCompleted);
    if (newRank) {
      setRankUp(newRank);
    }
    
    // Si terminamos la última actividad, mostrar celebración
    const newDoneCount = unit.contents.filter(c => completed.has(getActivityId(unit.code, c.type)) || c.type === contentType).length;
    if (newDoneCount === unit.contents.length) {
      setTimeout(() => setShowSuccess(true), 800);
    }
  };

  const isDone = (type: ContentType) => completed.has(getActivityId(unit.code, type));

  const progressPercent = useMemo(() => {
    /* Se cuenta aqui en vez de llamar a `isDone`, que se recrea en cada render: asi las
       dependencias son las de verdad, incluido `unit.code`, que faltaba y hacia que el porcentaje
       se quedara con el de la unidad anterior al cambiar de unidad sin cerrar el modal. */
    const total = unit.contents.length;
    const done = unit.contents.filter(c => completed.has(getActivityId(unit.code, c.type))).length;
    return (done / total) * 100;
  }, [unit.contents, unit.code, completed]);

  /* `showSuccess` no se lee dentro, y por eso la regla lo marca; esta a proposito. Es lo que hace
     que el confeti caiga en sitios distintos cada vez que aparece la celebracion en lugar de repetir
     siempre el mismo dibujo. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const confettiPositions = useMemo(() => generateConfettiPositions(20), [showSuccess]);

  // Flujo pedagógico: teoria → práctica → quiz (sin marcar completa hasta pasar el quiz)
  const nextAfterTheory = unit.contents.find(c => c.type !== 'theory');
  const theoryNextLabel = nextAfterTheory?.type === 'simulator' ? 'Ir a la Práctica' : 'Ir al Cuestionario';

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0A0118] flex font-sans animate-in fade-in duration-700 overflow-hidden">
      <AdventureBackground color={pillar.color} theme={theme} />
      <ProgressEnergyBar progress={progressPercent} />

      {/* OVERLAY DE ÉXITO: MISIÓN CUMPLIDA */}
      {showSuccess && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-500">
          <div className="fixed inset-0 bg-[#011126]/90 backdrop-blur-2xl" />
          <div className="relative z-10 w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-[36px] md:rounded-[60px] p-8 md:p-20 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
             <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64">
                <div className="absolute inset-0 bg-[#FF8C00] blur-3xl opacity-30 animate-pulse" />
                <img src="/assets/png/coin-bill-friends.png" alt="" className="w-full h-full relative z-10 animate-bounce-slow" />
             </div>
             
             <div className="mt-16 mb-12">
                <div className="text-xs font-black text-[#FF8C00] uppercase tracking-[0.2em] md:tracking-[0.4em] mb-4">Misión Desbloqueada</div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">¡Felicidades, Estudiante!</h2>
                <p className="text-base md:text-xl text-white/50 font-medium leading-relaxed">
                   Has completado con éxito la misión: <br/>
                   <span className="text-white">&quot;{unit.title}&quot;</span>
                </p>
             </div>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={onClose}
                  className="w-full py-5 md:py-8 bg-white text-[#0A0118] rounded-[30px] font-black text-lg md:text-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                >
                   Volver al Hub
                </button>
                <button 
                  onClick={() => { setShowSuccess(false); onClose(); }}
                  className="w-full py-4 md:py-6 bg-white/5 text-white/40 rounded-[30px] font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                >
                   Ver Resumen de Insignias
                </button>
             </div>
          </div>
          
          {/* Confeti Visual (Simple) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {confettiPositions.map((p, i) => (
               <div
                 key={i}
                 className="absolute w-4 h-4 bg-[#FF8C00] rounded-sm animate-bounce"
                 style={{
                   left: `${p.left}%`,
                   top: `${p.top}%`,
                   animationDelay: `${p.delay}s`,
                   opacity: 0.3
                 }}
               />
             ))}
          </div>
        </div>
      )}

      {/* NAVEGACIÓN FLOTANTE - ELEVADA A Z-2200 PARA EVITAR BLOQUEOS */}
      <div className="fixed z-[2200] bottom-0 left-0 right-0 flex justify-center p-3 md:bottom-auto md:left-12 md:right-auto md:top-1/2 md:-translate-y-1/2 md:p-0 md:flex-col md:gap-10 animate-in slide-in-from-bottom md:slide-in-from-left duration-1000 delay-300" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
         <div className="p-2 md:p-5 bg-[#120526]/90 md:bg-[#120526]/60 backdrop-blur-3xl border border-white/10 rounded-[30px] md:rounded-[60px] flex items-center md:flex-col gap-2 md:gap-8 shadow-2xl relative group max-w-full overflow-x-auto no-scrollbar">
            <div className="hidden md:flex w-20 h-20 bg-[#FF8C00] rounded-[30px] items-center justify-center text-white text-2xl md:text-4xl animate-pulse mb-4">💎</div>
            
            {unit.contents.map(c => {
               const IconComp = MODALITY_ICONS_MODERN[c.type] || FileText;
               const active = activeTab === c.type;
               const done = isDone(c.type);
               return (
                  <button 
                     key={c.type} 
                     data-rail-tab={c.type}
                     className={`w-16 h-16 md:w-20 md:h-24 shrink-0 rounded-[22px] md:rounded-[30px] flex flex-col items-center justify-center gap-3 transition-all relative group/btn
                        ${active ? 'bg-white text-[#0A0118] md:scale-110 z-10' : 'text-white/30 md:text-white/20 hover:text-white/60 hover:bg-white/5'}
                     `}
                     onClick={() => setActiveTab(c.type)}
                  >
                     <><IconComp size={active ? 36 : 28} className="hidden md:block" /><IconComp size={active ? 26 : 22} className="md:hidden" /></>
                     {done && <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={12} /></div>}
                  </button>
               );
            })}
            
            <div className="pl-2 ml-1 border-l border-white/10 md:mt-10 md:pt-10 md:pl-0 md:ml-0 md:border-l-0 md:border-t">
               {/* BOTÓN REGRESAR - REFORZADO Y PRIORITARIO */}
               <button 
                  className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[22px] md:rounded-[30px] bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/exit cursor-pointer active:scale-90"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  title="Salir de la misión"
               >
                  <><ArrowLeft size={40} className="hidden md:block group-hover/exit:-translate-x-2 transition-transform" /><ArrowLeft size={24} className="md:hidden" /></>
               </button>
            </div>
         </div>
      </div>

      <main className="flex-1 overflow-y-auto px-5 pt-24 pb-44 md:px-0 md:pl-48 md:pr-[100px] md:py-[80px] custom-scrollbar relative z-10 scroll-smooth">
        <div className="relative z-10 max-w-7xl mx-auto pb-10 md:pb-60">
          {activeTab === 'theory' && (
            <TheoryTab
              unit={unit}
              isDone={isDone('theory')}
              onComplete={() => setActiveTab(nextAfterTheory?.type ?? 'quiz')}
              nextLabel={theoryNextLabel}
              theme={theme}
              onShowVideo={setVideoAbierto}
            />
          )}
          {activeTab === 'simulator' && (
            <SimulatorTab
              unitCode={unit.code}
              isDone={isDone('simulator')}
              onComplete={(score) => { handleComplete('simulator', score); if (!unit.code.includes('SUPREMO')) setActiveTab('quiz'); }}
              color={pillar.color}
              isSupremoUnit={unit.code.includes('SUPREMO')}
            />
          )}
          {activeTab === 'quiz' && (
            <QuizTab
              unitCode={unit.code}
              isDone={isDone('quiz')}
              onComplete={(score) => handleComplete('quiz', score)}
              color={pillar.color}
            />
          )}
        </div>
      </main>

      {/* FICHA DE VIDEO PREMIUM (MODAL) */}
      {videoAbierto && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 md:p-20 animate-in fade-in zoom-in duration-500">
           <button 
             onClick={() => setVideoAbierto(null)}
             className="absolute top-10 right-10 p-5 bg-white/5 rounded-full text-white hover:bg-red-500 transition-all z-[10100] border-none cursor-pointer"
           >
              <X size={40} />
           </button>
           
           <div className="w-full max-w-6xl aspect-video bg-black rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(255,140,0,0.3)] relative group">
              {/* El boton que abre esto ya trae la URL y el titulo: puede ser la clase magistral
                  producida para la unidad o uno de los videos de experto del autor. VideoFrame
                  decide solo si toca un mp4 nuestro o un embed de YouTube. */}
              <VideoFrame url={videoAbierto.url} title={videoAbierto.title} />
           </div>
        </div>
       )}
      {/* OVERLAY DE ASCENSO DE RANGO (ACHIEVEMENT) */}
      {rankUp && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
           <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl" />
           <div className="relative z-10 w-full max-w-lg bg-white/[0.03] border-2 border-white/20 rounded-[32px] md:rounded-[50px] p-6 md:p-12 text-center shadow-[0_0_100px_rgba(255,255,255,0.1)]">
              <div className="w-40 h-40 mx-auto mb-10 relative">
                 <div className="absolute inset-0 blur-3xl opacity-50 animate-pulse" style={{ backgroundColor: rankUp.color }} />
                 <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center border-4 border-white/20" style={{ backgroundColor: `${rankUp.color}10` }}>
                    <Trophy size={80} style={{ color: rankUp.color }} className="animate-bounce" />
                 </div>
              </div>

              <div className="mb-10">
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-40 mb-3">Nivel Alcanzado</div>
                 <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Rango: {rankUp.rank}</h2>
                 <div className="h-px w-20 bg-white/20 mx-auto mb-6" />
                 <p className="text-white/60 font-medium">Has desbloqueado el siguiente nivel de maestría en <br/> <span className="text-white font-bold">{rankUp.pillarTitle}</span></p>
              </div>

              <button 
                onClick={() => setRankUp(null)}
                className="px-6 md:px-12 py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] md:tracking-[0.4em] hover:scale-105 transition-all w-full"
              >
                 Continuar
              </button>
           </div>
        </div>
      )}

    </div>
  );
}
