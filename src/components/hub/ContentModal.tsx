'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { 
  Play, 
  BookOpen, 
  Rocket, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Award,
  BookMarked,
  Brain, 
  Sparkles,
  Trophy,
  Lightbulb,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  Book,
  ArrowLeft,
  Map,
  Target,
  ShieldCheck,
  Activity,
  Cpu,
  Star,
  Gamepad2,
  Compass,
  Gift,
  MousePointer2,
  Telescope,
  Coins,
  ChevronRight,
  X
} from 'lucide-react';
import { markActivityComplete } from '../../lib/hub';
import { getActivityData, calculateXP } from '../../lib/activities';

// Importación de todos los motores de actividades Diamond State
import QuizActivity from '../activities/QuizActivity';
import TriviaActivity from '../activities/TriviaActivity';
import SimulatorActivity from '../activities/SimulatorActivity';
import BuilderActivity from '../activities/BuilderActivity';
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

import DiamondVideoPlayer from './DiamondVideoPlayer';
import { EXPERT_VIDEOS } from '../../lib/expertVideos';

import type { Unit, PillarMeta, ContentType } from '../../lib/hub';

interface ContentModalProps {
  unit: Unit;
  pillar: PillarMeta;
  completed: Set<string>;
  userId: string | null;
  onComplete: (activityId: string) => void;
  onClose: () => void;
  onNextUnit?: () => void;
}

const MODALITY_ICONS_MODERN: Record<string, any> = {
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

// ─── Componentes Optimizados con Memo ─────────────────────────────────────────

const AdventureBackground = memo(({ color, theme }: { color: string, theme: ThemeType }) => (
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
       <img 
          src="/assets/png/coin-portal.png" 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] animate-spin-slow mix-blend-screen grayscale brightness-150" 
          loading="lazy"
          decoding="async"
          style={{ animationDuration: '60s' }}
       />
       <img 
          src="/assets/png/coin-bill-friends.png" 
          className="absolute bottom-10 right-10 w-96 h-96 animate-float-slow opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" 
          loading="lazy"
          decoding="async"
       />
    </div>
    <div className="absolute inset-0 opacity-30">
      {[...Array(30)].map((_, i) => ( // Reducido de 60 a 30 para performance
        <div 
          key={i}
          className="absolute rounded-full bg-white animate-twinkle shadow-[0_0_10px_white]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  </div>
));

const ProgressEnergyBar = memo(({ progress }: { progress: number }) => (
  <div className="fixed top-0 left-0 w-full z-[2100]">
     <div className="absolute top-6 left-12 flex items-center gap-4 group animate-in slide-in-from-left duration-1000">
        <div className="relative">
           <div className="absolute inset-0 bg-[#FF8C00] blur-xl opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
           <img 
              src="/assets/png/ceny-guide.png" 
              className="w-16 h-16 relative z-10 drop-shadow-2xl animate-bounce-slow" 
              fetchPriority="high"
           />
        </div>
        <div className="px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col">
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

const FiscalSummaryCard = memo(({ unitCode }: { unitCode: string }) => {
  if (!unitCode.startsWith('S3')) return null;

  return (
    <div className="mt-20 mb-32 p-12 bg-gradient-to-br from-[#FF8C00]/20 to-yellow-500/10 border border-[#FF8C00]/30 rounded-[60px] backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Coins size={200} /></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="space-y-4 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF8C00] text-black rounded-full text-[10px] font-black uppercase tracking-widest">Contexto Fiscal 2026</div>
           <h4 className="text-5xl font-black text-white tracking-tighter italic uppercase">Indicadores Maestros</h4>
           <p className="text-xl text-white/40 font-medium max-w-sm">Datos oficiales actualizados para la simulación de tu vida adulta.</p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
           {[
             { label: 'Salario Mínimo', value: '$330.00', unit: 'MXN/Día', icon: Zap },
             { label: 'Valor UMA', value: '$122.00', unit: 'MXN', icon: Target },
             { label: 'Tasa CETES', value: '9.00%', unit: 'Anual', icon: Activity }
           ].map((stat, i) => (
             <div key={i} className="p-8 bg-white/5 rounded-[40px] border border-white/5 hover:border-white/10 transition-all">
                <stat.icon size={24} className="text-[#FF8C00] mb-4" />
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{stat.label}</div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold text-white/20 mt-1">{stat.unit}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
});

// ─── Pestañas Optimizadas ─────────────────────────────────────────────────────

const TheoryTab = memo(({ unit, onComplete, isDone, color, theme, onShowVideo, nextLabel }: { unit: Unit; onComplete: () => void; isDone: boolean; color: string; theme: ThemeType; onShowVideo: (show: boolean) => void; nextLabel?: string }) => {
  const [readingFinished, setReadingFinished] = useState(isDone);
  const sections = unit.theory?.sections || unit.strategy?.phases || [];
  const intro = unit.theory?.introduction || unit.theory?.concept || unit.theory?.description || unit.strategy?.objective || unit.objective;
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
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in duration-1000 relative z-10">
      <div className="relative mb-32">
         {/* HEADER CINEMÁTICO */}
         <div className="space-y-6 text-center lg:text-left mb-20">
            <div className="flex items-center justify-center lg:justify-start gap-4 text-[#FF8C00]">
               <Sparkles size={20} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">Módulo de Teoría Elite</span>
            </div>
            
            <h1 className="text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
               {unit.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? 'text-[#FF8C00]' : 'text-white'}>{word}{' '}</span>
               ))}
            </h1>
            
            <div className="h-2 w-40 bg-[#FF8C00] rounded-full mx-auto lg:mx-0 opacity-60" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 order-2 lg:order-1">
               <p className="text-3xl lg:text-4xl font-medium leading-snug text-white/80 tracking-tight italic">
                  "{intro}"
               </p>
               
               <div className="flex flex-wrap gap-4">
                  {(unit.metadata?.competencies?.slice(0, 3) || ['Teoría', 'Análisis', 'Práctica']).map((concept: string, idx: number) => (
                    <div key={idx} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse" />
                       <span className="text-xs font-black uppercase tracking-widest text-white/60">{concept}</span>
                    </div>
                  ))}
               </div>
               
               {/* INTEGRACIÓN DE VIDEO OFICIAL */}
               {unit.code.toLowerCase().includes('p1') && (
                 <button 
                   onClick={() => onShowVideo(true)}
                   className="group flex items-center gap-6 p-2 pr-12 bg-white text-[#0A0118] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)]"
                 >
                   <div className="w-16 h-16 bg-[#FF8C00] rounded-full flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                      <PlayCircle size={32} />
                   </div>
                   <span className="text-xl font-black uppercase tracking-widest">Ver Clase Magistral</span>
                 </button>
               )}
            </div>

            <div className="relative aspect-square order-1 lg:order-2 group/hero-img">
               <div className="absolute inset-0 bg-[#FF8C00]/20 rounded-[5rem] blur-[100px] animate-pulse" />
               
               {/* MARCO DECORATIVO DIAMOND */}
               <div className="absolute -inset-4 border border-white/10 rounded-[70px] pointer-events-none z-0 group-hover/hero-img:border-[#FF8C00]/20 transition-all duration-700" />
               <div className="absolute -inset-8 border border-white/5 rounded-[80px] pointer-events-none z-0 group-hover/hero-img:border-[#FF8C00]/10 transition-all duration-1000 delay-100" />
               
               <div className="relative w-full h-full rounded-[60px] overflow-hidden border-4 border-white/10 shadow-2xl z-10 transition-transform duration-1000 group-hover:scale-105">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {sections.map((section: any, i: number) => (
          <div key={i} className="group relative">
             <div className="h-full bg-white/[0.03] border border-white/5 p-12 rounded-[4rem] backdrop-blur-3xl flex flex-col gap-8 hover:bg-white/[0.06] hover:border-[#FF8C00]/30 transition-all duration-500">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#FF8C00] group-hover:scale-110 transition-transform">
                   {i % 2 === 0 ? <Zap size={28} /> : <Target size={28} />}
                </div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-white leading-tight">{section.subtitle || section.title}</h3>
                   <p className="text-xl text-white/50 leading-relaxed font-medium">{section.content || section.description}</p>
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
               <span className="text-3xl font-black text-[#0A0118] uppercase tracking-[0.3em]">{nextLabel ?? 'Continuar'}</span>
               <div className="w-12 h-12 bg-[#0A0118] rounded-2xl flex items-center justify-center text-white transition-transform group-hover:translate-x-3">
                  <ChevronRight size={24} />
               </div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-10 px-20 py-10 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] rounded-[3rem] animate-in zoom-in duration-700">
             <div className="w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-[0_0_40px_#10B981] animate-bounce">
                <CheckCircle2 size={40} />
             </div>
             <div className="text-left">
                <div className="text-xs font-black uppercase tracking-[0.5em] opacity-60 mb-2">Contenido Revisado</div>
                <div className="text-4xl font-black uppercase tracking-widest">Lectura Completada</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Función de normalización universal para evitar errores de carga por inconsistencias en JSONs
const normalizeActivityData = (data: any) => {
  if (!data) return null;
  const d = { ...data };
  
  // Normalizar Quizzes y Trivias
  if (!d.preguntas) {
    d.preguntas = d.questions || d.items || d.preguntas_quiz || [];
  }
  if (Array.isArray(d.preguntas)) {
    d.preguntas = d.preguntas.map((q: any) => ({
      ...q,
      texto: q.texto || q.pregunta || q.question || '',
      opciones: q.opciones || q.choices || q.answers || [],
      correcta: q.correcta !== undefined ? q.correcta : (q.correct_index !== undefined ? q.correct_index : 0),
      explicacion: q.explicacion || q.explanation || q.feedback || ''
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
    d.blanks = d.blanks.map((b: any) => ({
      ...b,
      id: (b.id || '').toString(),
      respuesta: b.respuesta || b.correcta || b.answer || ''
    }));
  }
  
  // Normalizar Decisiones (Decide)
  if (!d.nodos) d.nodos = d.nodes || d.escenas || {};

  return d;
};

const SimulatorTab = memo(({ unitCode, onComplete, isDone, color, theme }: { unitCode: string; onComplete: () => void; isDone: boolean; color: string; theme: any }) => {
  const [data, setData] = useState<any>(null);
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
       <p className="text-white/40 font-black uppercase tracking-[0.3em]">Cargando Laboratorio...</p>
    </div>
  );

  if (isFinishedLocal) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in zoom-in duration-700">
        <div className="w-40 h-40 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
           <CheckCircle2 size={80} className="animate-bounce" />
        </div>
        <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Práctica Completada ✓</h3>
        <p className="text-white/40 text-xl font-medium mb-12">Tus resultados han sido sincronizados con el Profesor.</p>
        <button
          onClick={() => onComplete()}
          className="px-16 py-6 bg-white text-[#0A0118] rounded-full font-black uppercase text-xs tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
        >
          Continuar al Quiz
        </button>
      </div>
    );
  }

  if (!data) return (
    <div className="text-center py-40">
       <p className="text-white/20 text-3xl font-black mb-8">Esta unidad utiliza el sistema de laboratorio clásico.</p>
       <button onClick={() => onComplete()} className="px-12 py-6 bg-white/5 text-white/40 rounded-full font-black uppercase hover:text-white transition-all">Completar Práctica</button>
    </div>
  );

  // Selector Universal de Motores de Actividades (A) con mapeo de sinónimos
  const activityType = (data.tipo || '').toUpperCase().trim();
  
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
  const isServiceControl = ['SERVICE_CONTROL', 'CONSOLA', 'SERVICIOS', 'CONTROL_GASTOS'].includes(activityType);

  const isKnown = isSimulator || isBuilder || isStory || isGame || isDragDrop || isMatching || isFillBlanks || isRoulette || isBalance || isRadar || isGrowth || isServiceControl;

  return (
    <div className="animate-in fade-in duration-1000">
      {isSimulator && <SimulatorActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isBuilder && <BuilderActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isStory && <StoryActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isGame && <GameActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isDragDrop && <DragDropActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isMatching && <MatchingActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isFillBlanks && <FillBlanksActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isRoulette && <RouletteActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isBalance && <BalanceActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isRadar && <RadarActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isGrowth && <GrowthActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      {isServiceControl && <ServiceControlActivity data={data} onComplete={() => { setIsFinishedLocal(true); onComplete(); }} />}
      
      {!isKnown && (
        <div className="text-center p-20 border border-white/5 bg-white/5 rounded-[40px]">
           <h3 className="text-white text-4xl font-black mb-4">Misión Especial Detectada</h3>
           <p className="text-white/40 text-xl mb-10">Este contenido requiere el visor Diamond v2.0 ({activityType})</p>
           <button onClick={() => { setIsFinishedLocal(true); onComplete(); }} className="px-10 py-5 bg-white text-black font-black uppercase rounded-full">Ejecutar en Modo Compatibilidad</button>
        </div>
      )}
    </div>
  );
});

const QuizTab = memo(({ unitCode, onComplete, isDone, theme }: { unitCode: string; onComplete: (score: number) => void; isDone: boolean; theme?: any }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFinishedLocal, setIsFinishedLocal] = useState(isDone);

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
       <p className="text-white/40 font-black uppercase tracking-[0.3em]">Sincronizando Desafío...</p>
    </div>
  );

  if (isFinishedLocal) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in zoom-in duration-700">
        <div className="w-40 h-40 rounded-full bg-[#FF8C00]/10 border border-[#FF8C00]/30 flex items-center justify-center text-[#FF8C00] mb-10 shadow-[0_0_50px_rgba(255,140,0,0.2)]">
           <Trophy size={80} className="animate-bounce" />
        </div>
        <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">¡Certificación Lograda!</h3>
        <p className="text-white/40 text-xl font-medium mb-12">Has demostrado dominio total de estos conceptos.</p>
        <button
          onClick={() => onComplete(100)}
          className="px-16 py-6 bg-[#FF8C00] text-black rounded-full font-black uppercase text-xs tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
        >
          Finalizar Misión
        </button>
      </div>
    );
  }

  if (!data) return (
    <div className="text-center py-40">
       <p className="text-white/20 text-3xl font-black mb-8">Esta unidad aún no tiene una evaluación industrializada.</p>
       <button onClick={() => onComplete(100)} className="px-12 py-6 bg-white/5 text-white/40 rounded-full font-black uppercase hover:text-white transition-all">Saltar Evaluación</button>
    </div>
  );

  const activityType = (data.tipo || '').toUpperCase().trim();
  const isTrivia = ['TRIVIA', 'DESAFIO', 'RAPIDO', 'RETO'].includes(activityType);
  const isGame = ['GAME', 'JUEGO', 'DESAFIO', 'RETO', 'JUEGA'].includes(activityType);
  const isQuiz = ['QUIZ', 'CUESTIONARIO', 'EXAMEN', 'EVALUACION'].includes(activityType);
  const isFillBlanks = ['RELLENA', 'FILL_BLANKS', 'COMPLETAR', 'COMPLETA'].includes(activityType);
  const isStory = ['DECIDE', 'STORY', 'HISTORIA', 'AVENTURA'].includes(activityType);
  const isDragDrop = ['ARRASTRA', 'DRAG_DROP', 'ARRASTRE', 'CLASIFICA'].includes(activityType);
  const isMatching = ['MEMORIA', 'MATCHING', 'PAREJAS', 'RELACIONA'].includes(activityType);
  const isRoulette = ['RULETA', 'ROULETTE', 'GIRA'].includes(activityType);

  return (
    <div className="animate-in fade-in duration-1000">
      {isTrivia && (
        <TriviaActivity
          data={data}
          onComplete={(score) => { if (score >= 60) { setIsFinishedLocal(true); onComplete(score); } }}
          onClose={() => {}}
        />
      )}
      {isGame && (
        <GameActivity
          data={data}
          onComplete={(score) => { if (score >= 50) { setIsFinishedLocal(true); onComplete(score); } }}
        />
      )}
      {isQuiz && (
        <QuizActivity
          data={data}
          onComplete={(score) => {
            if (score >= (data.aprobacion_minima * 100)) {
              setIsFinishedLocal(true);
              onComplete(score);
            }
          }}
        />
      )}
      {isFillBlanks && (
        <FillBlanksActivity
          data={data}
          onComplete={() => { setIsFinishedLocal(true); onComplete(100); }}
        />
      )}
      {isStory && (
        <StoryActivity
          data={data}
          onComplete={() => { setIsFinishedLocal(true); onComplete(100); }}
        />
      )}
      {isDragDrop && (
        <DragDropActivity
          data={data}
          onComplete={() => { setIsFinishedLocal(true); onComplete(100); }}
        />
      )}
      {isMatching && (
        <MatchingActivity
          data={data}
          onComplete={() => { setIsFinishedLocal(true); onComplete(100); }}
        />
      )}
      {isRoulette && (
        <RouletteActivity
          data={data}
          onComplete={() => { setIsFinishedLocal(true); onComplete(100); }}
        />
      )}
      {!isTrivia && !isGame && !isQuiz && !isFillBlanks && !isStory && !isDragDrop && !isMatching && !isRoulette && (
        <div className="text-center py-20 space-y-6">
           <p className="text-white/20 text-xl font-black italic">Formato de Evaluación no reconocido: {activityType}</p>
           <button onClick={() => onComplete(100)} className="px-10 py-4 bg-white/10 text-white rounded-full font-black uppercase text-xs tracking-widest">Omitir Evaluación</button>
        </div>
      )}
    </div>
  );
});

// ─── Componente Principal de la Misión ────────────────────────────────────────

export default function ContentModal({ unit, pillar, completed, userId, onComplete, onClose, onNextUnit }: ContentModalProps) {
  const [activeTab, setActiveTab] = useState<ContentType>(unit.contents[0].type);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rankUp, setRankUp] = useState<{ pillarTitle: string; rank: string; color: string } | null>(null);
  const [showUnitVideo, setShowUnitVideo] = useState(false);
  const theme = useMemo(() => getUnitTheme(unit), [unit]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleComplete = async (contentType: ContentType, score: number = 100) => {
    const id = getActivityId(unit.code, contentType);

    // Guardar copia del estado previo de completados para comparar rangos
    const oldCompleted = new Set(completed);

    if (userId && userId !== 'guest_user') {
      await markActivityComplete(userId, id);
      const actSuffix = contentType === 'quiz' ? 'B' : 'A';
      const actData = await getActivityData(`ACT-${unit.code}-${actSuffix}`);
      const xpEarned = calculateXP(score, actData?.xp ?? 150);
      const xpKey = `cen_xp_${userId}`;
      const current = parseInt(localStorage.getItem(xpKey) ?? '0', 10);
      localStorage.setItem(xpKey, String(current + xpEarned));
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
    const total = unit.contents.length;
    const done = unit.contents.filter(c => isDone(c.type)).length;
    return (done / total) * 100;
  }, [unit.contents, completed]);

  // Flujo pedagógico: teoria → práctica → quiz (sin marcar completa hasta pasar el quiz)
  const nextAfterTheory = unit.contents.find(c => c.type !== 'theory');
  const theoryNextLabel = nextAfterTheory?.type === 'simulator' ? 'Ir a la Práctica' : 'Ir al Cuestionario';

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0A0118] flex font-sans animate-in fade-in duration-700 overflow-hidden">
      <AdventureBackground color={pillar.color} theme={theme} />
      <ProgressEnergyBar progress={progressPercent} />

      {/* OVERLAY DE ÉXITO: MISIÓN CUMPLIDA */}
      {showSuccess && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
          <div className="fixed inset-0 bg-[#011126]/90 backdrop-blur-2xl" />
          <div className="relative z-10 w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-[60px] p-20 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
             <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64">
                <div className="absolute inset-0 bg-[#FF8C00] blur-3xl opacity-30 animate-pulse" />
                <img src="/assets/png/coin-bill-friends.png" className="w-full h-full relative z-10 animate-bounce-slow" />
             </div>
             
             <div className="mt-16 mb-12">
                <div className="text-xs font-black text-[#FF8C00] uppercase tracking-[0.4em] mb-4">Misión Desbloqueada</div>
                <h2 className="text-6xl font-black text-white tracking-tighter mb-6">¡Felicidades, Estudiante!</h2>
                <p className="text-xl text-white/50 font-medium leading-relaxed">
                   Has completado con éxito la misión: <br/>
                   <span className="text-white">"{unit.title}"</span>
                </p>
             </div>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={onClose}
                  className="w-full py-8 bg-white text-[#0A0118] rounded-[30px] font-black text-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                >
                   Volver al Hub
                </button>
                <button 
                  onClick={() => { setShowSuccess(false); onClose(); }}
                  className="w-full py-6 bg-white/5 text-white/40 rounded-[30px] font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                >
                   Ver Resumen de Insignias
                </button>
             </div>
          </div>
          
          {/* Confeti Visual (Simple) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {[...Array(20)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute w-4 h-4 bg-[#FF8C00] rounded-sm animate-bounce"
                 style={{ 
                   left: `${Math.random() * 100}%`, 
                   top: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 2}s`,
                   opacity: 0.3
                 }}
               />
             ))}
          </div>
        </div>
      )}

      {/* NAVEGACIÓN FLOTANTE - ELEVADA A Z-2200 PARA EVITAR BLOQUEOS */}
      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-[2200] flex flex-col gap-10 animate-in slide-in-from-left duration-1000 delay-300">
         <div className="p-5 bg-[#120526]/60 backdrop-blur-3xl border border-white/10 rounded-[60px] flex flex-col gap-8 shadow-2xl relative group">
            <div className="w-20 h-20 bg-[#FF8C00] rounded-[30px] flex items-center justify-center text-white text-4xl animate-pulse mb-4">💎</div>
            
            {unit.contents.map(c => {
               const IconComp = MODALITY_ICONS_MODERN[c.type] || FileText;
               const active = activeTab === c.type;
               const done = isDone(c.type);
               return (
                  <button 
                     key={c.type} 
                     className={`w-20 h-24 rounded-[30px] flex flex-col items-center justify-center gap-3 transition-all relative group/btn
                        ${active ? 'bg-white text-[#0A0118] scale-110 z-10' : 'text-white/20 hover:text-white/60 hover:bg-white/5'}
                     `}
                     onClick={() => setActiveTab(c.type)}
                  >
                     <IconComp size={active ? 36 : 28} />
                     {done && <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={12} /></div>}
                  </button>
               );
            })}
            
            <div className="mt-10 pt-10 border-t border-white/10">
               {/* BOTÓN REGRESAR - REFORZADO Y PRIORITARIO */}
               <button 
                  className="w-20 h-20 rounded-[30px] bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/exit cursor-pointer active:scale-90"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  title="Salir de la misión"
               >
                  <ArrowLeft size={40} className="group-hover/exit:-translate-x-2 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      <main className="flex-1 overflow-y-auto pl-48 pr-[100px] py-[80px] custom-scrollbar relative z-10 scroll-smooth">
        <div className="relative z-10 max-w-7xl mx-auto pb-60">
          {activeTab === 'theory' && (
            <TheoryTab
              unit={unit}
              isDone={isDone('theory')}
              onComplete={() => setActiveTab(nextAfterTheory?.type ?? 'quiz')}
              nextLabel={theoryNextLabel}
              color={pillar.color}
              theme={theme}
              onShowVideo={setShowUnitVideo}
            />
          )}
          {activeTab === 'simulator' && (
            <SimulatorTab
              unitCode={unit.code}
              isDone={isDone('simulator')}
              onComplete={() => { handleComplete('simulator'); setActiveTab('quiz'); }}
              color={pillar.color}
              theme={theme}
            />
          )}
          {activeTab === 'quiz' && (
            <QuizTab
              unitCode={unit.code}
              isDone={isDone('quiz')}
              onComplete={(score) => handleComplete('quiz', score)}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* FICHA DE VIDEO PREMIUM (MODAL) */}
      {showUnitVideo && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 md:p-20 animate-in fade-in zoom-in duration-500">
           <button 
             onClick={() => setShowUnitVideo(false)}
             className="absolute top-10 right-10 p-5 bg-white/5 rounded-full text-white hover:bg-red-500 transition-all z-[10100] border-none cursor-pointer"
           >
              <X size={40} />
           </button>
           
           <div className="w-full max-w-6xl aspect-video bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(255,140,0,0.3)] relative group">
              <iframe 
                src="https://www.youtube.com/embed/QOzt8F2nxm8?autoplay=1&rel=0"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
           </div>
        </div>
       )}
      {/* OVERLAY DE ASCENSO DE RANGO (ACHIEVEMENT) */}
      {rankUp && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
           <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl" />
           <div className="relative z-10 w-full max-w-lg bg-white/[0.03] border-2 border-white/20 rounded-[50px] p-12 text-center shadow-[0_0_100px_rgba(255,255,255,0.1)]">
              <div className="w-40 h-40 mx-auto mb-10 relative">
                 <div className="absolute inset-0 blur-3xl opacity-50 animate-pulse" style={{ backgroundColor: rankUp.color }} />
                 <div className="relative z-10 w-full h-full rounded-full flex items-center justify-center border-4 border-white/20" style={{ backgroundColor: `${rankUp.color}10` }}>
                    <Trophy size={80} style={{ color: rankUp.color }} className="animate-bounce" />
                 </div>
              </div>

              <div className="mb-10">
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">Nivel Alcanzado</div>
                 <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Rango: {rankUp.rank}</h2>
                 <div className="h-px w-20 bg-white/20 mx-auto mb-6" />
                 <p className="text-white/60 font-medium">Has desbloqueado el siguiente nivel de maestría en <br/> <span className="text-white font-bold">{rankUp.pillarTitle}</span></p>
              </div>

              <button 
                onClick={() => setRankUp(null)}
                className="px-12 py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:scale-105 transition-all w-full"
              >
                 Continuar
              </button>
           </div>
        </div>
      )}

    </div>
  );
}
