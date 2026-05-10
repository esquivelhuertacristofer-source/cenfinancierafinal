'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  Target, 
  Lock, 
  ArrowRight, 
  Award,
  X,
  Sun,
  Moon,
  Medal,
  PlayCircle
} from 'lucide-react';
import UnitTimeline from '../../../components/hub/UnitTimeline';
import {
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

export default function MissionPage() {
  const [pillarId, setPillarId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [pillar, setPillar] = useState<any | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [showProject, setShowProject] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setPillarId(id || 'primeros_pasos_hacia_el_ahorro');
    }
  }, []);

  useEffect(() => {
    if (!pillarId) return;

    async function load() {
      try {
        const profile = await Promise.race([
          getCurrentProfile(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 100))
        ]);

        const effectiveProfile = profile || FALLBACK_PROFILE;
        const progressData = await getCompletedActivities(effectiveProfile.id);
        const found = await getPillarById(pillarId!, effectiveProfile.grade, effectiveProfile.school_level ?? 'primary');

        setPillar(found);
        setUserId(effectiveProfile.id);
        setCompleted(progressData);
      } catch (err) {
        const errPillar = await getPillarById(pillarId!, FALLBACK_PROFILE.grade, FALLBACK_PROFILE.school_level ?? 'primary');
        setPillar(errPillar);
      }
    }
    load();
  }, [pillarId]);

  const handleComplete = useCallback((activityId: string) => {
    setCompleted(prev => new Set([...prev, activityId]));
  }, []);

  if (!pillar) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#011126] text-white p-24 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-black mb-4">Iniciando Portal...</h2>
          <p className="opacity-60 mb-8">Preparando datos para: <br/><code className="text-[#FF8C00]">{pillarId}</code></p>
          <div className="w-8 h-8 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const { total, pct } = getPillarProgress(pillar, completed);
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

        .badge-entry {
          position: absolute; top: 40px; right: 40px; transform: rotate(15deg);
        }
      `}</style>

      <nav className="p-nav">
        <div className="back-link cursor-pointer" onClick={() => window.location.assign('/hub')}>
          <ChevronLeft size={18} /> Volver al Hub
        </div>
        <div className="flex items-center gap-6">
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
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
      
      <header className="p-hero">
        <img src={cfg.image} alt={pillar.title} className="hero-img" />
        <div className="hero-content">
          <span className="hero-tag">Misión de Aprendizaje</span>
          <h1 className="hero-h1">{pillar.title}</h1>
          <div className="hero-prog">
             <div className="prog-track">
                <div className="prog-fill" style={{ width: `${pct}%`, background: cfg.accent }} />
             </div>
             <div className="prog-val" style={{ color: cfg.accent }}>{pct}%</div>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center lg:items-end relative z-20">
           <div className="video-holder group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="play-btn shadow-2xl">
                 <PlayCircle size={48} fill="currentColor" />
              </div>
              <div className="absolute bottom-10 left-10 text-left">
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">Video Introductorio</div>
                 <div className="text-xs font-black text-white/80 uppercase tracking-widest">Explicación de Unidades</div>
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

        <section className={`project-card ${isCompleted ? '' : 'locked'}`}>
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest mb-6 text-white/80">
              <Award size={24} /> Desafío Supremo
            </div>
            <h3 className="text-6xl font-black tracking-tighter mb-6 text-white">Proyecto Integrador</h3>
            <p className="text-xl font-bold text-white/90 leading-relaxed">
              {isCompleted 
                ? '¡Certificación disponible! Aplica todo lo aprendido en el simulador de vida real.' 
                : `Completa las misiones para desbloquear este nivel final.`}
            </p>
          </div>
          {isCompleted ? (
            <button className="btn-proj shadow-2xl" onClick={() => setShowProject(true)}>
              Iniciar Entrega <ArrowRight className="inline ml-2" />
            </button>
          ) : (
            <div className="flex items-center gap-3 font-black text-white/40 bg-black/10 px-6 py-3 rounded-2xl">
              <Lock size={20} /> Bloqueado
            </div>
          )}
        </section>
      </main>

      {showProject && (
        <div className="fixed inset-0 z-[500] bg-[#011126]/90 backdrop-filter blur-2xl flex items-center justify-center p-8" onClick={() => setShowProject(false)}>
          <div className="w-full max-w-4xl bg-[#011C40] border border-white/10 rounded-[4rem] p-16 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <button className="absolute top-10 right-10 text-white/30 hover:text-white" onClick={() => setShowProject(false)}><X size={40} /></button>
            <h2 className="text-7xl font-black tracking-tighter mb-12 text-white">Certificación</h2>
            <button onClick={() => setShowProject(false)} className="w-full py-8 bg-[#FF8C00] text-white rounded-3xl font-black uppercase text-xl shadow-2xl">Empezar Proyecto</button>
          </div>
        </div>
      )}
    </div>
  );
}
