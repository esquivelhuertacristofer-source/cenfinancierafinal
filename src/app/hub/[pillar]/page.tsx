'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Target, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Award,
  Activity,
  X,
  Sun,
  Moon,
  Medal,
  PlayCircle
} from 'lucide-react';
import UnitTimeline from '../../../components/hub/UnitTimeline';
import {
  getPillarsForGrade,
  getCompletedActivities,
  getCurrentProfile,
  getPillarProgress,
  getPillarById,
  FALLBACK_PROFILE
} from '../../../lib/hub';

const PILLAR_CONFIG: Record<string, { image: string; accent: string; bg: string }> = {
  primeros_pasos_hacia_el_ahorro: { image: '/assets/landing-v3/1.png', accent: '#FF8C00', bg: 'rgba(255, 140, 0, 0.05)' },
  construyendo_independencia: { image: '/assets/landing-v3/2.png', accent: '#4ADE80', bg: 'rgba(74, 222, 128, 0.05)' },
  planificacion_y_crecimiento: { image: '/assets/landing-v3/3.png', accent: '#42E8E0', bg: 'rgba(66, 232, 224, 0.05)' },
  planificacion_y_metas: { image: '/assets/landing-v3/3.png', accent: '#42E8E0', bg: 'rgba(66, 232, 224, 0.05)' },
  emprendimiento: { image: '/assets/landing-v3/4.png', accent: '#C084FC', bg: 'rgba(192, 132, 252, 0.05)' },
  ahorro: { image: '/assets/landing-v3/1.png', accent: '#FF8C00', bg: 'rgba(255, 140, 0, 0.05)' },
  consumo_inteligente: { image: '/assets/landing-v3/2.png', accent: '#4ADE80', bg: 'rgba(74, 222, 128, 0.05)' },
  inversion: { image: '/assets/landing-v3/3.png', accent: '#42E8E0', bg: 'rgba(66, 232, 224, 0.05)' },
};

const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
};

export default function PillarPageV19({ params }: { params: any }) {
  const router = useRouter();
  
  // Safe param resolution for Next.js 15+ vs 14 compatibility
  // PLUS Native URL extraction as the ultimate fallback for "Failed to fetch" errors
  const [pillarId, setPillarId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const idFromPath = pathSegments[pathSegments.length - 1];
      setPillarId(idFromPath);
    }
  }, []);

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProject, setShowProject] = useState(false);
  const [pillar, setPillar] = useState<any | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const playSFX = useCallback((key: keyof typeof SOUNDS) => {
    try {
      const audio = new Audio(SOUNDS[key]);
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (!pillarId) return;

    async function load() {
      // Emergency timeout to prevent infinite loading if DB hangs
      const timeout = setTimeout(async () => {
        if (loading) {
          const found = await getPillarById(pillarId!, FALLBACK_PROFILE.grade, FALLBACK_PROFILE.school_level ?? 'primary');
          setUserId(FALLBACK_PROFILE.id);
          setPillar(found);
          setLoading(false);
        }
      }, 1500);

      try {
        const profile = await getCurrentProfile();
        if (!profile) {
          router.replace('/log-in');
          return;
        }

        const progressData = await getCompletedActivities(profile.id);
        const found = await getPillarById(pillarId!, profile.grade, profile.school_level ?? 'primary');

        setPillar(found);
        setUserId(profile.id);
        setCompleted(progressData);
      } catch {
        const errPillar = await getPillarById(pillarId!, FALLBACK_PROFILE.grade, FALLBACK_PROFILE.school_level ?? 'primary');
        setPillar(errPillar);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    }
    load();
  }, [pillarId]);

  const handleComplete = useCallback((activityId: string) => {
    setCompleted(prev => new Set([...prev, activityId]));
    playSFX('complete');
  }, [playSFX]);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#011126] text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Desbloqueando Misión...</div>
      </div>
    </div>
  );

  if (!pillar) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#011126] text-white p-24 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-black mb-4">Misión No Encontrada</h2>
        <p className="opacity-60 mb-8">No pudimos localizar los datos pedagógicos para: <br/><code className="text-[#FF8C00]">{pillarId}</code></p>
        <button onClick={() => window.location.assign('/hub')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#FF8C00] transition-all">Volver al Hub</button>
      </div>
    </div>
  );

  const { done, total, pct } = getPillarProgress(pillar, completed);
  const cfg = PILLAR_CONFIG[pillar.id] || PILLAR_CONFIG[Object.keys(PILLAR_CONFIG)[0]];
  const isCompleted = pct === 100;

  return (
    <div className={`pillar-v19-canvas ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Epilogue:wght@400;500;700;800;900&display=swap');

        .theme-dark {
          --bg-main: #011126;
          --bg-nav: rgba(1, 17, 38, 0.8);
          --text-main: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.4);
          --border: rgba(255, 255, 255, 0.08);
          --card-bg: rgba(255, 255, 255, 0.02);
        }

        .theme-light {
          --bg-main: #F4F1EA;
          --bg-nav: rgba(244, 241, 234, 0.8);
          --text-main: #011C40;
          --text-muted: #64748b;
          --border: rgba(1, 28, 64, 0.08);
          --card-bg: #ffffff;
        }

        .pillar-v19-canvas {
          min-height: 100vh; background: var(--bg-main);
          font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text-main);
          background-image: radial-gradient(circle at 100% 0%, rgba(255, 140, 0, 0.05) 0%, transparent 40%);
          transition: all 0.5s ease;
        }

        .p-nav { 
          padding: 32px 80px; display: flex; align-items: center; justify-content: space-between; 
          position: sticky; top: 0; z-index: 100; background: var(--bg-nav); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .back-link { display: flex; align-items: center; gap: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; color: var(--text-muted); text-decoration: none; transition: all 0.3s; }
        .back-link:hover { color: var(--text-main); transform: translateX(-5px); }

        .p-hero { padding: 80px; display: flex; align-items: center; gap: 80px; position: relative; overflow: hidden; }
        .hero-img { width: 420px; height: 420px; object-fit: contain; filter: drop-shadow(0 40px 100px rgba(0,0,0,0.3)); position: relative; z-index: 10; transition: all 1s ease; }
        .hero-img:hover { transform: scale(1.05) rotate(3deg); }
        .hero-content { flex: 1; position: relative; z-index: 10; }
        .hero-tag { color: #FF8C00; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4em; margin-bottom: 24px; display: block; }
        .hero-h1 { font-family: 'Epilogue', sans-serif; font-size: 80px; font-weight: 900; line-height: 0.9; letter-spacing: -0.05em; margin-bottom: 32px; color: var(--text-main); }
        
        .hero-prog { display: flex; align-items: center; gap: 24px; max-width: 500px; }
        .prog-track { flex: 1; height: 12px; background: var(--border); border-radius: 10px; overflow: hidden; }
        .prog-fill { height: 100%; border-radius: 10px; transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1); }
        .prog-val { font-size: 32px; font-weight: 900; font-family: 'Epilogue', sans-serif; }

        .video-holder {
          width: 100%; max-width: 550px; height: 320px; 
          background: rgba(255, 255, 255, 0.02);
          border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative; overflow: hidden; backdrop-filter: blur(30px);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 50px 100px rgba(0,0,0,0.4);
        }
        .video-holder:hover { transform: scale(1.02) translateY(-10px); border-color: #FF8C00; box-shadow: 0 60px 120px rgba(255, 140, 0, 0.15); }
        .video-holder:hover .play-btn { transform: scale(1.1); background: #FF8C00; color: white; box-shadow: 0 0 40px #FF8C00; }
        .play-btn { 
          width: 90px; height: 90px; background: white; color: black; border-radius: 35px;
          display: flex; items-center; justify-center; transition: all 0.5s;
          z-index: 10;
        }

        .timeline-area { max-width: 1600px; margin: 0 auto; padding: 0 40px 100px; }
        .section-title { font-family: 'Epilogue', sans-serif; font-size: 32px; font-weight: 900; margin-bottom: 60px; display: flex; align-items: center; gap: 24px; color: var(--text-main); }
        .section-line { flex: 1; height: 1px; background: var(--border); }

        .project-card {
          background: linear-gradient(135deg, #FF8C00 0%, #FF5E00 100%);
          border-radius: 48px; padding: 64px; display: flex; align-items: center; justify-content: space-between;
          margin-top: 100px; position: relative; overflow: hidden; box-shadow: 0 40px 80px rgba(255, 140, 0, 0.2);
        }
        .project-card.locked { opacity: 0.15; filter: grayscale(1); cursor: not-allowed; }
        .btn-proj { background: var(--bg-main); color: var(--text-main); padding: 24px 48px; border-radius: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; border: none; cursor: pointer; }
        .btn-proj:hover { transform: scale(1.05); background: white; color: #FF8C00; }

        .theme-toggle {
          width: 48px; height: 48px; border-radius: 14px; background: var(--card-bg);
          border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s; color: var(--text-main);
        }
        .theme-toggle:hover { background: #FF8C00; color: white; border-color: transparent; transform: scale(1.1); }
      `}</style>

      <nav className="p-nav">
        <div 
          className="back-link cursor-pointer" 
          onMouseEnter={() => playSFX('hover')} 
          onClick={() => { try { playSFX('click'); } catch(e){} window.location.assign('/hub'); }}
        >
          <ChevronLeft size={18} /> Volver al Hub
        </div>
        <div className="flex items-center gap-6">
          <button className="theme-toggle" onClick={() => { setIsDark(!isDark); playSFX('click'); }} onMouseEnter={() => playSFX('hover')}>
             {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-[10px] font-black opacity-30 tracking-widest uppercase">Repositorio Académico</div>
                <div className="text-sm font-black">{pillar.title}</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#FF8C00] flex items-center justify-center text-2xl shadow-lg">{pillar.icon}</div>
          </div>
        </div>
      </nav>

      <header className="p-hero max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-12 lg:gap-24 items-center">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${cfg.accent} 0%, transparent 70%)` }} />
        <img src={cfg.image} className="hero-img" alt="" />
        
        <div className="hero-content">
          <span className="hero-tag">CEN Educación Financiera</span>
          <h1 className="hero-h1">{pillar.title}</h1>
          <div className="hero-prog">
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${pct}%`, backgroundColor: cfg.accent }} />
            </div>
            <div className="prog-val" style={{ color: cfg.accent }}>{pct}%</div>
          </div>
          <p className="mt-10 text-xl opacity-40 font-medium max-w-xl leading-relaxed">
            Explora las unidades clave y domina los fundamentos para desbloquear tu insignia Diamond.
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center lg:items-end relative z-20">
           <div 
             className="video-holder group"
             onClick={() => pillar.videoUrl && setActiveVideo(pillar.videoUrl)}
           >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="play-btn shadow-2xl">
                 <PlayCircle size={48} fill="currentColor" />
              </div>
              <div className="absolute bottom-10 left-10 text-left">
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">CEN CINEMA</div>
                 <div className="text-xs font-black text-white/80 uppercase tracking-widest">INTRODUCCIÓN A LAS UNIDADES</div>
              </div>
           </div>
           
           {isCompleted && (
             <div className="flex items-center gap-4 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 backdrop-blur-xl">
                <Medal size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Maestría Completada</span>
             </div>
           )}
        </div>
      </header>

      <main className="timeline-area">
        <div className="section-title">
          <Target className="text-[#FF8C00]" /> Unidades Académicas
          <div className="section-line" />
        </div>

        <UnitTimeline
          pillar={pillar}
          completed={completed}
          userId={userId}
          onComplete={handleComplete}
          globalOffset={0}
        />

        <section className={`project-card ${isCompleted ? '' : 'locked'}`} onMouseEnter={() => isCompleted && playSFX('hover')}>
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest mb-6 text-white/80">
              <Award size={24} /> Desafío Supremo
            </div>
            <h3 className="text-6xl font-black tracking-tighter mb-6 text-white">Proyecto Integrador</h3>
            <p className="text-xl font-bold text-white/90 leading-relaxed">
              {isCompleted 
                ? '¡Certificación disponible! Aplica todo lo aprendido en el simulador de vida real.' 
                : `Completa las ${total} misiones para desbloquear este nivel final.`}
            </p>
          </div>
          {isCompleted ? (
            <button className="btn-proj shadow-2xl" onClick={() => { setShowProject(true); playSFX('click'); }}>
              Iniciar Entrega <ArrowRight className="inline ml-2" />
            </button>
          ) : (
            <div className="flex items-center gap-3 font-black text-white/40 bg-black/10 px-6 py-3 rounded-2xl">
              <Lock size={20} /> Bloqueado
            </div>
          )}
          <div className="absolute -bottom-20 -right-20 opacity-10 rotate-12">
             <Trophy size={400} className="text-white" />
          </div>
        </section>
      </main>

      {/* PROJECT MODAL */}
      {showProject && (
        <div className="fixed inset-0 z-[500] bg-[#011126]/90 backdrop-filter blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-500" onClick={() => setShowProject(false)}>
          <div className="w-full max-w-4xl bg-[#011C40] border border-white/10 rounded-[4rem] p-16 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8C00] opacity-[0.05] blur-[100px]" />
            <button className="absolute top-10 right-10 text-white/30 hover:text-white" onClick={() => setShowProject(false)}><X size={40} /></button>
            <div className="text-[#FF8C00] font-black uppercase text-xs tracking-[0.5em] mb-8">Misión Integradora • {pillar.title}</div>
            <h2 className="text-7xl font-black tracking-tighter mb-12 text-white">Certificación de Pilar</h2>
            <div className="space-y-10 text-2xl font-medium text-white/60 leading-relaxed mb-16">
              <p>Has dominado el marco teórico. Ahora es momento de la práctica clínica:</p>
              <ul className="space-y-6">
                <li className="flex gap-4"><div className="w-2 h-2 bg-[#FF8C00] rounded-full mt-3" /><span>Diseña un plan de {pillar.shortTitle} basado en el caso adjunto.</span></li>
                <li className="flex gap-4"><div className="w-2 h-2 bg-[#FF8C00] rounded-full mt-3" /><span>Identifica riesgos sistémicos y oportunidades de escalabilidad.</span></li>
                <li className="flex gap-4"><div className="w-2 h-2 bg-[#FF8C00] rounded-full mt-3" /><span>Sube tu propuesta en PDF para validación académica.</span></li>
              </ul>
            </div>
            <button onClick={() => setShowProject(false)} className="w-full py-8 bg-[#FF8C00] text-white rounded-3xl font-black uppercase text-xl tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all">Empezar Proyecto</button>
          </div>
        </div>
      )}
      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-20 animate-in fade-in zoom-in duration-300"
          onClick={() => setActiveVideo(null)}
        >
          <button 
            className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
            onClick={() => setActiveVideo(null)}
          >
            <X size={48} />
          </button>
          
          <div className="w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            <iframe
              src={`${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Trophy({ size, className }: { size: number; className?: string }) {
  return <Award size={size} className={className} />;
}
