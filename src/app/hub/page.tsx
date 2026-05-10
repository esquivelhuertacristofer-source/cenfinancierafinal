'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Book,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Target,
  Star,
  Compass,
  X,
  Library,
  Sparkles,
  Sun,
  Moon,
  Coins,
  Medal,
  Play,
  Cloud
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  getPillarsForGrade,
  getCompletedActivities,
  getCurrentProfile,
  getPillarProgress,
  getGradeMetadata,
  getArenaQuiz,
  QuizQuestion,
  FALLBACK_PROFILE
} from '../../lib/hub';
import UnitTimeline from '../../components/hub/UnitTimeline';
import MissionFicha from '../../components/hub/MissionFicha';
import ContentModal from '../../components/hub/ContentModal';
import OnboardingTour from '../../components/hub/OnboardingTour';
import ArenaMastery from '../../components/hub/ArenaMastery';

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

// SFX System
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
};

export default function StudentHubV19() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [pillars, setPillars] = useState<any[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gradeMeta, setGradeMeta] = useState<any>(null);
  const [activePillar, setActivePillar] = useState<any>(null);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [selectedUnitForFicha, setSelectedUnitForFicha] = useState<any>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeUnit, setActiveUnit] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);

  const [totalXP, setTotalXP] = useState(0);
  const [arenaQuiz, setArenaQuiz] = useState<QuizQuestion[]>([]);
  const [showArena, setShowArena] = useState(false);
  const [score, setScore] = useState(0);
  const [showPresentation, setShowPresentation] = useState(false);
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
    const rescue = setTimeout(() => {
      setLoading(false);
    }, 5000);

    async function loadData() {
      try {
        let p = await getCurrentProfile();
        if (!p) {
          p = { ...FALLBACK_PROFILE };
        }
        setProfile(p);
        if (p) {
          setTotalXP(parseInt(localStorage.getItem(`cen_xp_${p.id}`) ?? '0', 10));
          const progress = await getCompletedActivities(p.id);
          setCompleted(progress);
          const gradePillars = await getPillarsForGrade(p.grade, p.school_level ?? 'primary');
          setPillars(gradePillars);
          
          // Sincronización crítica de metadatos del grado
          const meta = getGradeMetadata(p.grade, p.school_level ?? 'primary');
          setGradeMeta(meta);
          
          // Procesar cola de sincronización pendiente al iniciar
          const { processSyncQueue } = await import('../../lib/hub');
          processSyncQueue();
          
          // --- URL SYNC INICIAL (Diamond State Persistence) ---
          const params = new URLSearchParams(window.location.search);
          const pId = params.get('pillar');
          const uId = params.get('unit');
          if (pId) {
            const pillarMatch = gradePillars.find(pl => pl.id === pId);
            if (pillarMatch) {
              setActivePillar(pillarMatch);
              if (uId) {
                const unitMatch = pillarMatch.units.find((un: any) => un.code === uId);
                if (unitMatch) {
                  setTimeout(() => {
                    setActiveUnit(unitMatch);
                    setShowContentModal(true);
                  }, 800);
                }
              }
            }
          } else {
            setActivePillar(null);
          }
        }
      } catch {
        // silent
      } finally {
        clearTimeout(rescue);
        setLoading(false);
      }
    }
    loadData();

    // Sincronización periódica cada 30 segundos si hay conexión
    const syncInterval = setInterval(async () => {
      if (typeof window !== 'undefined' && navigator.onLine) {
        setIsSyncing(true);
        try {
          const { processSyncQueue } = await import('../../lib/hub');
          await processSyncQueue();
        } catch {
          // silent
        } finally {
          setTimeout(() => setIsSyncing(false), 2000); // Dar tiempo visual al usuario
        }
      }
    }, 30000);

    // Listener para cambios en localStorage (simulador de grado)
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(syncInterval);
    };
  }, [router]);

  const startArena = async () => {
    if (!profile) return;
    playSFX('click');
    const questions = await getArenaQuiz(profile.grade, profile.school_level ?? 'primary');
    setArenaQuiz(questions);
    setShowArena(true);
  };


  // --- PERSISTENCIA DE ESTADO HACIA LA URL ---
  useEffect(() => {
    if (loading) return;
    const url = new URL(window.location.href);
    if (activePillar) {
      url.searchParams.set('pillar', activePillar.id);
      if (activeUnit && showContentModal) {
        url.searchParams.set('unit', activeUnit.code);
      } else {
        url.searchParams.delete('unit');
      }
    } else {
      url.searchParams.delete('pillar');
      url.searchParams.delete('unit');
    }
    window.history.replaceState({}, '', url.toString());
  }, [activePillar, activeUnit, showContentModal, loading]);

  if (loading) return (
    <div className={`min-h-screen font-['Epilogue'] transition-colors duration-1000 ${isDark ? 'bg-[#010A19]' : 'bg-[#F4F1EA]'}`}>
      <div className="p-12 lg:p-20 space-y-16">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-6">
              <div className={`w-40 h-6 rounded-full animate-pulse ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
              <div className={`w-full max-w-[600px] h-24 rounded-3xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
              <div className={`w-full max-w-[400px] h-6 rounded-full animate-pulse ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
           </div>
           <div className={`w-32 h-32 rounded-[2.5rem] animate-pulse ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
        </div>

        {/* Pillars Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-12">
           {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-[600px] rounded-[4rem] border animate-pulse flex flex-col justify-between p-16 ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                 <div className="space-y-6">
                    <div className={`w-24 h-6 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    <div className={`w-full h-16 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                 </div>
                 <div className="space-y-4">
                    <div className={`w-32 h-12 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    <div className={`w-full h-4 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );

  const totalDone = pillars.reduce((acc, p) => acc + getPillarProgress(p, completed).done, 0);
  const totalUnits = pillars.reduce((acc, p) => acc + p.units.length, 0);
  const totalPct = totalUnits > 0 ? Math.round((totalDone / totalUnits) * 100) : 0;

  return (
    <div className={`hub-v19-canvas ${isDark ? 'theme-dark' : 'theme-light'}`}
         style={{ 
           '--grade-accent': gradeMeta?.accentColor || '#FF8C00',
           '--grade-secondary': gradeMeta?.secondaryColor || '#FFD700'
         } as any}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Epilogue:wght@400;500;700;800;900&display=swap');

        .theme-dark {
          --bg-main: #011126;
          --bg-side: #011C40;
          --text-main: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.4);
          --border: rgba(255, 255, 255, 0.08);
          --card-bg: rgba(255, 255, 255, 0.02);
          --glass-bg: rgba(1, 28, 64, 0.85);
          --grad-1: rgba(255, 140, 0, 0.15);
          --grad-2: rgba(66, 232, 224, 0.15);
          --badge-bg: rgba(255, 255, 255, 0.05);
          --nav-hover: rgba(255, 255, 255, 0.05);
          --header-overlay: rgba(1, 17, 38, 0.6);
        }

        .theme-light {
          --bg-main: #F4F1EA;
          --bg-side: #ffffff;
          --text-main: #011C40;
          --text-muted: #64748b;
          --border: rgba(1, 28, 64, 0.08);
          --card-bg: #ffffff;
          --glass-bg: rgba(255, 255, 255, 0.7);
          --grad-1: rgba(255, 140, 0, 0.1);
          --grad-2: rgba(66, 232, 224, 0.1);
          --badge-bg: rgba(1, 28, 64, 0.03);
          --nav-hover: rgba(1, 28, 64, 0.03);
          --header-overlay: rgba(244, 241, 234, 0.4);
        }

        .hub-v19-canvas {
          min-height: 100vh; background: var(--bg-main);
          font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text-main); display: flex; overflow: hidden;
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* NEBULOSA DINÁMICA (Diamond Mesh) */
        .mesh-background {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: var(--bg-main); overflow: hidden;
        }
        .mesh-orb {
          position: absolute; border-radius: 50%; filter: blur(100px);
          opacity: 0.15; animation: mesh-float 20s infinite ease-in-out;
        }
        .orb-1 { width: 600px; height: 600px; background: #FF8C00; top: -10%; left: -10%; animation-delay: 0s; }
        .orb-2 { width: 500px; height: 500px; background: #42E8E0; bottom: -10%; right: -10%; animation-delay: -5s; }
        .orb-3 { width: 400px; height: 400px; background: #4ADE80; top: 40%; left: 50%; animation-delay: -10s; }

        @keyframes mesh-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 50px) scale(1.1); }
          66% { transform: translate(-50px, 100px) scale(0.9); }
        }

        .side-hud {
          width: 320px; background: var(--bg-side); border-right: 1px solid var(--border);
          backdrop-filter: blur(40px); display: flex; flex-direction: column; padding: 48px 24px; z-index: 50;
        }

        .brand-container { margin-bottom: 60px; padding: 0 10px; }
        .brand-top { font-size: 44px; font-family: 'Epilogue', sans-serif; font-weight: 900; letter-spacing: -0.06em; color: var(--text-main); line-height: 1; }
        .brand-sub { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.35em; color: #FF8C00; margin-top: 8px; opacity: 0.9; }

        .nav-link {
          display: flex; align-items: center; gap: 16px; padding: 18px 24px; border-radius: 24px; color: var(--text-muted);
          font-weight: 700; font-size: 14px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; margin-bottom: 8px;
        }
        .nav-link.active { background: #FF8C00; color: white; box-shadow: 0 12px 30px rgba(255, 140, 0, 0.3); transform: scale(1.02); }
        .nav-link:not(.active):hover { background: var(--nav-hover); color: var(--text-main); transform: translateX(6px); }

        .main-stage { flex: 1; height: 100vh; overflow-y: auto; padding: 0; position: relative; scroll-behavior: smooth; }

        .grade-briefing {
          padding: 80px 80px; background: radial-gradient(circle at center, var(--glass-bg) 0%, var(--bg-main) 100%);
          position: relative; border-bottom: 1px solid var(--border);
          /* Remove overflow: hidden to allow grade switcher to be visible */
          overflow: visible; 
        }
        .gb-illustration {
          position: absolute; inset: 0; 
          background-image: url('https://www.transparenttextures.com/patterns/graphy.png');
          opacity: 0.08; pointer-events: none; mix-blend-mode: overlay;
        }
        .gb-glow { position: absolute; top: -50%; left: -20%; width: 60%; height: 200%; background: radial-gradient(circle, var(--grade-accent) 0.15, transparent 70%); pointer-events: none; opacity: 0.15; }
        .gb-tag { font-size: 10px; font-weight: 900; color: var(--grade-accent); text-transform: uppercase; letter-spacing: 0.4em; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; }
        .gb-title { font-size: 96px; font-family: 'Epilogue', sans-serif; font-weight: 900; letter-spacing: -0.06em; margin-bottom: 24px; line-height: 0.85; color: var(--text-main); }
        .gb-description { font-size: 20px; line-height: 1.8; color: var(--text-muted); max-width: 850px; margin-bottom: 60px; font-weight: 500; }

        .malla-btn {
          display: inline-flex; align-items: center; gap: 12px; padding: 18px 36px; background: var(--badge-bg);
          border: 1px solid var(--border); border-radius: 24px; font-weight: 800; font-size: 13px;
          text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s; color: var(--text-main);
        }
        .malla-btn:hover { background: #FF8C00; color: white; border-color: transparent; box-shadow: 0 15px 30px rgba(255, 140, 0, 0.3); transform: translateY(-4px); }

        .gb-grade-badge {
          position: absolute; right: 80px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; align-items: center; 
          pointer-events: auto; /* Enable clicks */
          z-index: 100;
        }
        .gb-grade-num { font-size: 280px; font-family: 'Epilogue', sans-serif; font-weight: 900; line-height: 0.7; color: var(--text-main); letter-spacing: -0.05em; opacity: 0.08; user-select: none; pointer-events: none; }
        .gb-grade-level { font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 1em; color: #FF8C00; margin-top: -10px; opacity: 0.6; user-select: none; pointer-events: none; }

        .pillars-section { padding: 80px; width: 100%; }
        .section-header { margin-bottom: 60px; }
        .section-header h2 { font-size: 56px; font-family: 'Epilogue', sans-serif; font-weight: 900; tracking: -0.06em; margin-bottom: 12px; }
        
        .pillars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 48px; width: 100%; }
        .p-card-v16 {
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 56px; padding: 56px; height: 600px; position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: space-between; transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer; box-shadow: 0 30px 60px rgba(0,0,0,0.04);
        }
        .p-card-v16:hover { border-color: var(--accent); background: var(--bg); transform: translateY(-20px) scale(1.02); box-shadow: 0 40px 100px rgba(0,0,0,0.1); }
        
        .p-image-v16 { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.08; filter: grayscale(1); transition: all 1s ease; }
        .p-card-v16:hover .p-image-v16 { opacity: 0.25; filter: grayscale(0); transform: scale(1.15); }

        .p-badge { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; color: var(--accent); margin-bottom: 24px; }
        .p-title { font-size: 40px; font-weight: 900; line-height: 1.1; margin-bottom: 24px; font-family: 'Epilogue', sans-serif; color: var(--text-main); }
        
        /* Premium Badge (Improvement #2) */
        .p-achievement-badge {
          position: absolute; top: 56px; right: 56px; width: 80px; height: 80px;
          background: radial-gradient(circle, #FFD700 0%, #FF8C00 100%);
          border-radius: 24px; display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: 0 15px 40px rgba(255, 140, 0, 0.4);
          transform: rotate(12deg) scale(0); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 30;
        }
        .p-card-v16.completed .p-achievement-badge { transform: rotate(12deg) scale(1); }
        .badge-glow { position: absolute; inset: -10px; background: #FF8C00; filter: blur(20px); opacity: 0.3; border-radius: 50%; animation: pulse-badge 2s infinite; }
        @keyframes pulse-badge { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.5; } }

        .p-unit-dot { width: 32px; height: 8px; border-radius: 10px; background: var(--badge-bg); transition: all 0.4s; }

        .p-progress-wrap { position: relative; z-index: 10; }
        .p-pct { font-size: 56px; font-weight: 900; font-family: 'Epilogue', sans-serif; color: var(--accent); margin-bottom: 12px; }
        .p-bar-bg { height: 14px; background: var(--badge-bg); border-radius: 20px; overflow: hidden; }
        .p-bar-fill { height: 100%; background: var(--accent); border-radius: 20px; transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

        .theme-toggle {
          position: fixed; top: 40px; right: 40px; z-index: 100;
          width: 72px; height: 72px; border-radius: 24px; background: var(--bg-side);
          border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          box-shadow: 0 15px 40px rgba(0,0,0,0.1); color: var(--text-main);
        }
        .theme-toggle:hover { transform: scale(1.1) rotate(15deg); background: #FF8C00; color: white; border-color: transparent; }

        .bg-ornament { position: fixed; pointer-events: none; z-index: 0; filter: blur(3px) grayscale(0.5); opacity: 0.06; }

        @keyframes float-ornament { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-40px) rotate(10deg); } 100% { transform: translateY(0) rotate(0deg); } }
        @keyframes float-ornament-alt { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(30px) rotate(-15deg); } 100% { transform: translateY(0) rotate(0deg); } }

        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

        .malla-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1400px;
          margin-top: 40px;
        }

        .malla-unit-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          min-height: 280px;
        }
        .malla-unit-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: #FF8C00;
          transform: translateY(-8px);
        }
        .theme-light .malla-unit-card {
          background: white;
          border-color: rgba(1, 28, 64, 0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }
        .theme-light .malla-unit-card:hover {
          box-shadow: 0 20px 50px rgba(1, 28, 64, 0.05);
        }
      `}</style>

      {/* NEBULOSA DINÁMICA DE FONDO */}
      <div className="mesh-background">
        <div className="mesh-orb orb-1" />
        <div className="mesh-orb orb-2" />
        <div className="mesh-orb orb-3" />
      </div>

      {/* THEME TOGGLE */}
      <button 
        className="theme-toggle" 
        onClick={() => { setIsDark(!isDark); playSFX('click'); }}
        onMouseEnter={() => playSFX('hover')}
      >
         {isDark ? <Sun size={28} /> : <Moon size={28} />}
      </button>

      {/* BACKGROUND ORNAMENTS (DIAMOND 3D ATMOSPHERE) */}
      <div className="bg-ornament" style={{ top: '5%', left: '2%', width: '180px', animation: 'float-ornament 18s infinite ease-in-out', opacity: isDark ? 0.06 : 0.1, filter: 'blur(1px)' }}>
        <img src="/assets/landing-v3/money.png" alt="" className="w-full h-auto rotate-[15deg]" />
      </div>
      <div className="bg-ornament" style={{ top: '40%', right: '8%', width: '120px', animation: 'float-ornament-alt 12s infinite ease-in-out', opacity: isDark ? 0.04 : 0.08, filter: 'blur(3px)' }}>
        <img src="/assets/landing-v3/money.png" alt="" className="w-full h-auto rotate-[110deg]" />
      </div>
      <div className="bg-ornament" style={{ bottom: '5%', left: '10%', width: '250px', animation: 'float-ornament 25s infinite ease-in-out', opacity: isDark ? 0.05 : 0.09, filter: 'blur(2px)' }}>
        <img src="/assets/landing-v3/money.png" alt="" className="w-full h-auto -rotate-[45deg]" />
      </div>
      <div className="bg-ornament" style={{ bottom: '15%', right: '2%', width: '300px', animation: 'float-ornament-alt 20s infinite ease-in-out', opacity: isDark ? 0.03 : 0.07, filter: 'blur(5px)' }}>
        <img src="/assets/landing-v3/money.png" alt="" className="w-full h-auto rotate-[160deg]" />
      </div>
      <div className="bg-ornament" style={{ top: '20%', left: '50%', width: '60px', animation: 'float-ornament 10s infinite ease-in-out', opacity: isDark ? 0.1 : 0.15 }}>
        <img src="/assets/landing-v3/money.png" alt="" className="w-full h-auto rotate-[80deg]" />
      </div>

      {/* SIDEBAR */}
      <aside className="side-hud">
        <div className="brand-container">
          <div className="brand-top">CEN</div>
          <div className="brand-sub">Educación Financiera</div>
        </div>
        
        <nav className="flex-1">
          <div className={`nav-link ${!activePillar ? 'active' : ''} cursor-pointer`} onMouseEnter={() => playSFX('hover')} onClick={() => { playSFX('click'); setActivePillar(null); if(window.location.pathname !== '/hub') router.push('/hub'); }}><LayoutDashboard size={20} /><span>Portal de Misiones</span></div>
          <div className={`nav-link cursor-pointer ${window.location.pathname.includes('/library') ? 'active' : ''}`} onMouseEnter={() => playSFX('hover')} onClick={() => { playSFX('click'); router.push('/hub/library'); }}><Library size={20} /><span>Biblioteca</span></div>
          <div className={`nav-link cursor-pointer ${window.location.pathname.includes('/logros') ? 'active' : ''}`} onMouseEnter={() => playSFX('hover')} onClick={() => { playSFX('click'); router.push('/hub/logros'); }}><Trophy size={20} /><span>Mis Logros</span></div>
        </nav>
        
        <button 
          className="nav-link mt-auto opacity-30 hover:opacity-100" 
          onMouseEnter={() => playSFX('hover')} 
          onClick={async () => { 
            try { 
              playSFX('click'); 
              localStorage.removeItem('cen_test_profile'); // Clear virtual session
              const { supabase } = await import('../../lib/supabase');
              await supabase.auth.signOut();
              window.location.href = '/log-in'; 
            } catch(e){
              window.location.href = '/log-in';
            } 
          }}
        >
          <LogOut size={20} /><span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-stage custom-scrollbar">
        
        {/* HEADER / BRIEFING */}
        <header className="grade-briefing">
          <div className="gb-illustration" />
          <div className="gb-glow" />
          
          {/* NÚCLEO HOLOGRÁFICO (CENTRO DE ENERGÍA DIAMOND) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] left-0 md:left-[15%] lg:left-[20%] flex items-center justify-center">
                
                {/* Resplandor de Fondo (Atmósfera Tenue) */}
                <div className="absolute inset-0 blur-[100px] opacity-10" style={{ backgroundColor: 'var(--grade-accent)' }} />
                
                {/* Anillos Orbitales */}
                <div className="absolute w-[350px] h-[100px] border rounded-[100%] rotate-[35deg] animate-[spin_20s_linear_infinite] opacity-10" style={{ borderColor: 'var(--grade-accent)' }} />
                <div className="absolute w-[400px] h-[120px] border rounded-[100%] -rotate-[25deg] animate-[spin_25s_linear_infinite] opacity-10" style={{ borderColor: 'var(--grade-secondary)' }} />

                {/* El Orbe de Energía (LIBERADO) */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                   {/* Aura de Energía Detrás */}
                   <div className="absolute inset-0 opacity-15 blur-[40px]" style={{ background: `radial-gradient(circle, var(--grade-accent), var(--grade-secondary), transparent)` }} />
                   
                   {/* OBJETO 3D / PORTAL DEL GRADO */}
                   <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-[#011126]">
                      <img 
                        src={gradeMeta?.coreImage || "/assets/png/coin-portal.png"} 
                        className="w-full h-full object-cover scale-110"
                        style={{ 
                          maskImage: 'radial-gradient(circle at center, black 60%, transparent 98%)',
                          WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 98%)'
                        }}
                      />
                      {/* Reflejo de Cristal Superior */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                   </div>
                   
                   {/* Brillo Central (Destello) */}
                   <div className="absolute w-8 h-8 bg-white blur-3xl opacity-10" />
                </div>

                {/* Partículas Orbitantes */}
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-float-slow"
                    style={{
                      left: `${50 + Math.cos(i * 45) * 40}%`,
                      top: `${50 + Math.sin(i * 45) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                      opacity: 0.4
                    }}
                  />
                ))}
             </div>
          </div>

          <div className="relative z-10">
            <div className="gb-tag"><Coins size={16} style={{ color: 'var(--grade-accent)' }} /> Formación Diamond • Grado {profile?.grade}</div>
            <h1 className="gb-title">{gradeMeta?.title}</h1>
            <p className="gb-description">{gradeMeta?.briefing}</p>
            
            <div className="flex items-center gap-8">
              <button 
                className="malla-btn" 
                onMouseEnter={() => playSFX('hover')}
                onClick={() => { setShowCurriculum(true); playSFX('click'); }}
              >
                <Target size={18} /> Consultar Objetivos de Aprendizaje
              </button>
              
              {/* BOTÓN DE PRESENTACIÓN DINÁMICO */}
              <button 
                className="px-10 py-5 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all group overflow-hidden relative shadow-2xl"
                style={{ 
                  backgroundColor: gradeMeta?.accentColor || '#FF8C00',
                  boxShadow: `0 20px 40px ${gradeMeta?.accentColor}44` 
                }}
                onMouseEnter={() => playSFX('hover')}
                onClick={() => { setShowPresentation(true); playSFX('click'); }}
              >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <Sparkles size={18} className="animate-pulse" />
                <span className="relative z-10">Descubrir mi año</span>
              </button>
              <div className="h-16 w-px bg-white/10" />
              <div className="flex gap-12">
                <div>
                   <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">Dominio Global</div>
                   <div className="text-4xl font-black text-[#4ADE80]">{totalPct}%</div>
                </div>
                <div>
                   <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">Unidades</div>
                   <div className="text-4xl font-black">{totalUnits}</div>
                </div>
                <div>
                   <div className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">XP Total</div>
                   <div className="text-4xl font-black text-[#FF8C00]">{totalXP.toLocaleString()}</div>
                </div>
                <div className="h-12 w-px bg-white/10 mx-2 self-center" />
                <div className="flex flex-col justify-center">
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-700 ${isSyncing ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-white/20'}`}>
                      <Cloud size={14} className={isSyncing ? 'animate-bounce' : ''} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {isSyncing ? 'Sincronizando...' : 'Nube Activa'}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gb-grade-badge group relative">
             <div className="gb-grade-num">{profile?.grade}</div>
              <div className="gb-grade-level" style={{ color: isDark ? 'var(--grade-accent)' : '#011C40' }}>
                {profile?.school_level?.toLowerCase().includes('secundar') ? 'Secundaria' : 'Primaria'}
              </div>
             
             {/* GRADE SWITCHER - MODERNO Y VISIBLE */}
             <div className="absolute top-full left-0 mt-6 z-[1000]">
                <div className="flex flex-col gap-2">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Simulador de Grado</div>
                   <div className="flex flex-wrap gap-2 max-w-[240px]">
                      {[1,2,3,4,5,6].map(g => (
                        <button key={`p${g}`} onClick={() => {
                          const p = { id: `test_p${g}`, email: `primaria${g}@cen.edu`, full_name: `Test P${g}`, role: 'student', school_level: `Primaria ${g}`, group_id: 'test', grade: g };
                          localStorage.setItem('cen_test_profile', JSON.stringify(p));
                          window.location.reload();
                        }} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[var(--grade-accent)] hover:text-white transition-all text-xs font-bold">P{g}</button>
                      ))}
                      {[1,2,3].map(g => (
                        <button key={`s${g}`} onClick={() => {
                          const p = { id: `test_s${g}`, email: `secundaria${g}@cen.edu`, full_name: `Test S${g}`, role: 'student', school_level: `Secundaria ${g}`, group_id: 'test', grade: g };
                          localStorage.setItem('cen_test_profile', JSON.stringify(p));
                          window.location.reload();
                        }} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[var(--grade-accent)] hover:text-white transition-all text-xs font-bold">S{g}</button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </header>

        {/* PILLARS SECTION */}
        <section className="pillars-section">
          <div className="section-header">
            <h2>Ejes de Formación</h2>
            <p className="text-2xl opacity-40 font-medium">Explora las unidades maestras alineadas al temario oficial CEN.</p>
          </div>

          <div className="pillars-grid">
            {pillars.map((p) => {
              const { done, total, pct } = getPillarProgress(p, completed);
              const cfg = PILLAR_CONFIG[p.id] || PILLAR_CONFIG[Object.keys(PILLAR_CONFIG)[0]];
              const isCompleted = pct === 100;

              return (
                <div 
                  key={p.id} 
                  className={`p-card-v16 ${isCompleted ? 'completed' : ''}`} 
                  onMouseEnter={() => playSFX('hover')}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try { playSFX('click'); } catch(err){}
                    setActivePillar(p);
                  }}
                  style={{ 
                    '--accent': cfg.accent, 
                    '--bg': cfg.bg, 
                    cursor: 'pointer', 
                    zIndex: 10, 
                    position: 'relative' 
                  } as any}
                >
                  <img src={cfg.image} className="p-image-v16" alt="" />
                  
                  {/* Improvement #2: Premium Achievement Badge */}
                  <div className="p-achievement-badge">
                    <div className="badge-glow" />
                    <Medal size={40} className="relative z-10" />
                  </div>

                  <div className="relative z-20">
                    <div className="p-badge">{p.units.length} Misiones</div>
                    <h3 className="p-title">{p.title}</h3>
                    <div className="flex gap-2">
                       {p.units.map((_: any, idx: number) => (
                         <div key={idx} className="p-unit-dot" style={{ background: idx < done ? cfg.accent : 'var(--badge-bg)' }} />
                       ))}
                    </div>
                  </div>

                  <div className="p-progress-wrap relative z-20">
                    <div className="p-pct">{pct}%</div>
                    <div className="flex justify-between items-end mb-4 text-[10px] font-black opacity-40 uppercase tracking-widest">
                       <span>Progreso</span>
                       <span>{done} / {total}</span>
                    </div>
                    <div className="p-bar-bg">
                      <div className="p-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ARENA CARD */}
          <div 
            className="mt-48 p-24 bg-gradient-to-br from-[#011C40] to-[#011126] rounded-[72px] flex items-center justify-between shadow-2xl relative overflow-hidden border border-white/5 cursor-pointer"
            onMouseEnter={() => playSFX('hover')}
            onClick={startArena}
          >
             <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.05] blur-[80px] md:blur-[120px] -mr-40 -mt-40" style={{ backgroundColor: 'var(--grade-accent)' }} />
             <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3 font-black uppercase text-xs tracking-[0.4em] mb-8" style={{ color: 'var(--grade-accent)' }}>
                  <Star size={24} style={{ fill: 'var(--grade-accent)', color: 'var(--grade-accent)' }} /> Arena de Desafío Élite
                </div>
                <h2 className="text-7xl font-black text-white tracking-tighter mb-10 leading-none">Arena de Maestría</h2>
                <p className="text-2xl font-bold text-white/50 leading-relaxed mb-12">
                  Pon a prueba tus conocimientos globales. Una evaluación de 10 preguntas aleatorias que certificará tu dominio real sobre el grado.
                </p>
                <div className="inline-block px-12 py-6 bg-[#FF8C00] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(255,140,0,0.3)]">
                   Iniciar Desafío Maestro
                </div>
             </div>
             <div className="hidden 2xl:block opacity-20 transform rotate-12">
                <Trophy size={300} className="text-white" />
             </div>
          </div>
        </section>

      </main>

      {/* MALLA CURRICULAR MODAL */}
      {showCurriculum && (
        <div className="fixed inset-0 z-[4000] p-32 flex flex-col items-center justify-start overflow-y-auto animate-in fade-in zoom-in duration-500">
          <div className="fixed inset-0 bg-[#011126]/95 backdrop-blur-3xl" onClick={() => setShowCurriculum(false)} />
          
          <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
            <div className="flex w-full justify-between items-center mb-20">
                <div className="text-left">
                  <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 text-white">Objetivos de Aprendizaje • Aprendizajes Esperados</h2>
                  <div className="text-sm font-black uppercase tracking-[0.4em] text-[#FF8C00]">Grado {profile?.grade} • CEN Educación Financiera</div>
                </div>
                <button onClick={() => setShowCurriculum(false)} className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF8C00] transition-all group">
                   <X size={32} className="text-white group-hover:rotate-90 transition-transform" />
                </button>
            </div>
             <div className="malla-body custom-scrollbar">
                <div className="mb-20 p-12 bg-white/5 rounded-[56px] border border-white/10">
                   <h3 className="text-3xl font-black text-[#FF8C00] mb-8 flex items-center gap-4">
                     <Target size={32} /> Objetivo Central del Grado
                   </h3>
                   <p className="text-2xl opacity-90 leading-relaxed font-medium">{gradeMeta.objective}</p>
                </div>

                <h3 className="text-3xl font-black text-[#FF8C00] mb-12 flex items-center gap-4">
                  <Sparkles size={32} /> Objetivos por Unidad Diamond
                </h3>
                
                <div className="malla-grid">
                  {pillars.flatMap(p => p.units).map((unit: any) => (
                    <div 
                      key={unit.code} 
                      className="malla-unit-card cursor-pointer group"
                      onClick={() => {
                         setSelectedUnitForFicha(unit);
                      }}
                    >
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-[10px] font-black opacity-40 uppercase tracking-widest">{unit.code}</div>
                          <div className="w-8 h-8 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center text-[#FF8C00]">
                            <Book size={14} />
                          </div>
                        </div>
                        <h4 className="text-2xl font-black mb-4 group-hover:text-[#FF8C00] transition-colors leading-tight">{unit.title}</h4>
                        
                        {/* Concept Chips in Malla */}
                        <div className="flex flex-wrap gap-2 mb-6">
                           {(unit.metadata?.competencies?.slice(0, 3) || ['Teoría', 'Análisis', 'Práctica']).map((concept: string, idx: number) => (
                              <div key={idx} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C00]" />
                                 <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{concept}</span>
                              </div>
                           ))}
                        </div>

                        <p className="mb-6 opacity-60 text-base leading-relaxed line-clamp-3">{unit.objective}</p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase opacity-40">Ver Ficha Académica</span>
                           <ChevronRight size={16} className="text-[#FF8C00] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MISSION OVERLAY — inline, zero navigation */}
      {activePillar && (() => {
        const cfg = PILLAR_CONFIG[activePillar.id] || PILLAR_CONFIG[Object.keys(PILLAR_CONFIG)[0]];
        const { pct } = getPillarProgress(activePillar, completed);
        return (
          <div className={`fixed inset-0 z-[5000] overflow-y-auto ${isDark ? 'bg-[#011126] text-white' : 'bg-[#F4F1EA] text-[#011C40]'}`}>
            {/* NAV */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-16 py-6 border-b"
              style={{ background: isDark ? 'rgba(1,17,38,0.9)' : 'rgba(244,241,234,0.9)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
              <button
                className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                onClick={() => { try { playSFX('click'); } catch(e){} setActivePillar(null); }}
              >
                <ChevronLeft size={18} /> Volver al Hub
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-black opacity-30 tracking-widest uppercase">Eje de Formación</div>
                  <div className="text-sm font-black">{activePillar.title}</div>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg" style={{ background: cfg.accent }}>{activePillar.icon}</div>
              </div>
            </div>

            {/* HERO ATMOSFÉRICO XL CON DECORACIÓN MASIVA */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 px-10 lg:px-20 py-32 relative overflow-hidden bg-[#011226] border-b border-white/5 min-h-[650px] w-full mx-auto">
              {/* Elementos Decorativos (Lluvia de Billetes y Objetos) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <img src="/assets/landing-v3/money.png" alt="" className="absolute -top-10 left-10 w-40 rotate-12 blur-[1px] animate-bounce-slow" />
                <img src="/assets/landing-v3/money.png" alt="" className="absolute top-1/4 right-10 w-32 -rotate-12 blur-[2px] animate-pulse" />
                <img src="/assets/landing-v3/money.png" alt="" className="absolute top-1/2 right-1/4 w-36 rotate-45 blur-[1px]" />
                <img src="/assets/landing-v3/crate.png" alt="" className="absolute bottom-20 left-20 w-32 rotate-12 opacity-40 blur-[2px]" />
              </div>

              {/* Portal Circular Integrado */}
              <div className="relative z-10 w-[350px] h-[350px] lg:w-[480px] lg:h-[480px] shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full blur-[120px] animate-pulse" style={{ background: cfg.accent, opacity: 0.15 }} />
                <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                  <img 
                    src={cfg.image} 
                    alt="" 
                    className="w-full h-full object-cover scale-110" 
                    style={{ 
                      maskImage: 'radial-gradient(circle at center, black 50%, transparent 98%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 98%)' 
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011226]/80 via-transparent to-transparent" />
                </div>
              </div>

              <div className="relative z-10 flex-1">
                <div className="text-sm font-black uppercase tracking-[1em] mb-8" style={{ color: cfg.accent }}>
                  Academia Diamond • Misión Educativa
                </div>
                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-white" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                  {activePillar.title}
                </h1>

                {/* PILLAR CONCEPT CHIPS (Diamond v3 - Dynamic) */}
                <div className="flex flex-wrap gap-4 mb-12">
                  {(activePillar.units[0]?.metadata?.competencies?.slice(0, 3) || ['Estrategia', 'Análisis', 'Ejecución']).map((tag: string, idx: number) => (
                    <div key={idx} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-3 group/tag hover:border-[#FF8C00]/40 transition-all cursor-default shadow-xl">
                      <div className="w-2 h-2 rounded-full bg-[#FF8C00] shadow-[0_0_15px_#FF8C00]" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/60 group-hover/tag:text-white transition-colors">{tag}</span>
                    </div>
                  ))}
                </div>

                <div className="max-w-xl bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative z-10">
                    <div className="flex justify-between mb-5">
                      <span className="text-sm font-black opacity-30 uppercase tracking-widest">Nivel de Maestría</span>
                      <span className="text-3xl font-black" style={{ color: cfg.accent }}>{pct}%</span>
                    </div>
                    <div className="w-full h-6 rounded-full overflow-hidden bg-white/10 p-1.5">
                      <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_30px_rgba(255,140,0,0.8)]" style={{ width: `${pct}%`, background: cfg.accent }} />
                    </div>
                  </div>
                </div>
              </div>

                {/* VIDEO HOLDER HOLOGRÁFICO (Diamond v3) — Rediseño Premium */}
                {activePillar.videoUrl && (
                  <div 
                    className="relative z-10 w-full lg:w-[560px] h-[360px] shrink-0 bg-[#000]/40 rounded-[60px] border border-white/10 backdrop-blur-3xl flex items-center justify-center group cursor-pointer overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] transition-all duration-700 hover:scale-[1.05] hover:border-[#FF8C00]/40 hover:shadow-[#FF8C00]/20"
                    onClick={() => { setActiveVideo(activePillar.videoUrl!); }}
                  >
                    {/* Background Texture & Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/10 via-transparent to-indigo-500/10 opacity-30" />
                    
                    {/* Scanning Bar Animation */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF8C00]/40 to-transparent top-0 animate-pulse pointer-events-none" />

                    {/* Corner Accents */}
                    <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-[#FF8C00]/40 rounded-tl-lg" />
                    <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-[#FF8C00]/40 rounded-br-lg" />

                    {/* Play Button Core */}
                    <div className="relative z-10 flex flex-col items-center gap-6">
                      <div className="relative w-32 h-32 bg-white text-black rounded-[45px] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-[#FF8C00] group-hover:text-white">
                         <Play fill="currentColor" size={48} className="ml-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">Pilar Multimedia</div>
                        <div className="text-xl font-black text-white uppercase tracking-widest group-hover:text-[#FF8C00] transition-colors">Ver Masterclass</div>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* TIMELINE (IMAX FULL-WIDTH) */}
            <div className="w-full px-10 lg:px-20 py-24">
              <div className="flex items-center gap-6 mb-20">
                <div className="w-4 h-4 rounded-full bg-[#FF8C00] shadow-[0_0_15px_#FF8C00]" />
                <span className="text-3xl font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Epilogue, sans-serif' }}>Ruta de Aprendizaje</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <UnitTimeline
                pillar={activePillar}
                completed={completed}
                userId={profile?.id ?? null}
                globalOffset={(() => {
                  const idx = pillars.findIndex(p => p.id === activePillar.id);
                  if (idx === -1) return 0;
                  return pillars.slice(0, idx).reduce((acc, p) => acc + p.units.length, 0);
                })()}
                onComplete={async (id) => {
                  console.log("Activity completed:", id);
                  setCompleted(prev => new Set([...prev, id]));
                  if (profile?.id) {
                    try {
                      const { markActivityComplete } = await import('../../lib/hub');
                      await markActivityComplete(profile.id, id);
                    } catch {
                      // silent
                    }
                  }
                }}
              />
            </div>
          </div>
        );
      })()}

      {/* QUIZ ARENA (CINEMATIC BOSS BATTLE) */}
      {showArena && (
        <ArenaMastery 
          grade={profile?.grade || 4}
          schoolLevel={profile?.school_level || 'Primaria'}
          quiz={arenaQuiz}
          isDark={isDark}
          onClose={() => setShowArena(false)}
          onComplete={async (finalScore) => {
            setScore(finalScore);
            setShowArena(false);
            // Registrar éxito en la base de datos si es necesario
            if (profile?.id) {
               try {
                 const { markActivityComplete } = await import('../../lib/hub');
                 await markActivityComplete(profile.id, `ARENA-G${profile.grade}`);
               } catch (e) {
                 console.error("Error al registrar victoria en arena", e);
               }
            }
            playSFX('complete');
            alert(`¡Felicidades! Has completado el desafío con ${finalScore} aciertos.`);
          }}
        />
      )}
      {/* FICHA DE PRESENTACIÓN DEL CICLO (VIDEO + RESUMEN) */}
      {showPresentation && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-8 lg:p-20 animate-in fade-in zoom-in duration-500">
          <div className="fixed inset-0 bg-[#011126]/95 backdrop-blur-3xl" onClick={() => setShowPresentation(false)} />
          
          <div className="relative z-10 w-full max-w-7xl bg-white/[0.02] border border-white/10 rounded-[60px] overflow-hidden flex flex-col lg:flex-row h-[85vh] shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
             {/* Glows Decorativos */}
             <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF8C00] blur-[150px] opacity-20 pointer-events-none" />
             <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#4ADE80] blur-[150px] opacity-10 pointer-events-none" />

             {/* Columna Izquierda: Video (Reproductor) */}
             <div className="flex-1 p-12 lg:p-20 flex flex-col">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Play size={24} fill="white" />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black text-white tracking-tighter">Bienvenido a {gradeMeta?.title}</h2>
                      <p className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: 'var(--grade-accent)' }}>Presentación del Ciclo • Grado {profile?.grade}</p>
                   </div>
                </div>

                {/* Contenedor del Video / Poster de Presentación */}
                <div className="flex-1 bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-inner relative group">
                   <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent" />
                   <img 
                      src={gradeMeta?.coreImage || "/assets/png/coin-portal.png"} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[10s]" 
                      alt="Presentación"
                   />
                   <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-24 h-24 bg-[#FF8C00] rounded-full flex items-center justify-center text-white mb-8 animate-pulse shadow-[0_0_50px_#FF8C00]">
                         <Play size={40} fill="white" />
                      </div>
                      <h3 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">Misión {profile?.grade}00</h3>
                      <p className="text-xl text-white/60 font-medium max-w-md">Contenido audiovisual en proceso de renderizado Diamond.</p>
                   </div>
                   <div className="absolute inset-0 pointer-events-none border-[10px] border-white/5 rounded-[40px] z-30" />
                </div>
             </div>

             {/* Columna Derecha: Resumen del Ciclo */}
             <div className="w-full lg:w-[450px] bg-white/[0.03] border-l border-white/5 p-12 lg:p-20 flex flex-col">
                <button 
                  onClick={() => setShowPresentation(false)}
                  className="self-end w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-500 transition-all group mb-12"
                >
                   <X size={24} className="text-white group-hover:rotate-90 transition-transform" />
                </button>

                <div className="space-y-12 overflow-y-auto custom-scrollbar pr-4">
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: 'var(--grade-accent)' }}>Lo que aprenderás</div>
                      <h3 className="text-4xl font-black text-white mb-6 leading-tight">{gradeMeta?.title}</h3>
                      <p className="text-lg text-white/50 leading-relaxed font-medium">
                        {gradeMeta?.briefing}
                      </p>
                   </div>

                   <div className="space-y-6">
                      {gradeMeta?.skills?.map((skill: string, idx: number) => (
                        <div key={idx} className="flex gap-5 p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                           <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${gradeMeta?.accentColor}22`, color: 'var(--grade-accent)' }}>
                              {idx === 0 ? <Target size={24} /> : idx === 1 ? <Coins size={24} /> : <Compass size={24} />}
                           </div>
                           <div>
                              <div className="text-base font-black text-white">{skill}</div>
                              <p className="text-xs text-white/40 mt-1">Especialidad de {profile?.school_level}</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="pt-10 mt-auto">
                      <button 
                        onClick={() => setShowPresentation(false)}
                        className="w-full py-6 bg-white text-[#0A0118] rounded-[30px] font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                      >
                         ¡Empezar ahora!
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MISSION FICHA MODAL */}
      {selectedUnitForFicha && (
        <MissionFicha 
          unit={selectedUnitForFicha}
          onClose={() => setSelectedUnitForFicha(null)}
          onStart={() => {
            const p = pillars.find((p: any) => p.units.some((u: any) => u.code === selectedUnitForFicha.code));
            if (p) {
              setActiveUnit(selectedUnitForFicha);
              setActivePillar(p);
              setSelectedUnitForFicha(null);
              setShowCurriculum(false);
              setShowContentModal(true);
            }
          }}
        />
      )}

      {/* CONTENT MODAL (DIRECT ACCESS) */}
      {showContentModal && activeUnit && activePillar && (
        <ContentModal 
          unit={activeUnit}
          pillar={activePillar}
          completed={completed}
          userId={profile?.id ?? null}
          onComplete={async (id) => {
            setCompleted(prev => new Set([...prev, id]));
            if (profile?.id) {
              setTotalXP(parseInt(localStorage.getItem(`cen_xp_${profile.id}`) ?? '0', 10));
            }
          }}
          onClose={() => setShowContentModal(false)}
        />
      )}
      {/* VIDEO PLAYER MODAL (CEN CINEMA XL) */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[7000] flex items-center justify-center p-4 lg:p-20 animate-in fade-in duration-700"
          style={{ background: 'radial-gradient(circle at center, rgba(1, 10, 25, 0.98) 0%, #000 100%)' }}
        >
          {/* Capas Atmosféricas */}
          <div className="absolute inset-0 backdrop-blur-[30px] opacity-40" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
          
          {/* Partículas de Luz Flotantes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-20"
                     style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDelay: `${i*0.3}s` }} />
             ))}
          </div>

          {/* BOTÓN CERRAR PREMIUM */}
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-12 right-12 z-[7010] w-20 h-20 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-[24px] flex items-center justify-center text-white/40 hover:text-red-500 transition-all duration-500 group"
          >
            <X size={32} className="group-hover:rotate-90 transition-transform duration-700" />
          </button>

          {/* FRAME DEL REPRODUCTOR (DIAMOND CINEMA) */}
          <div className="relative w-full max-w-7xl aspect-video rounded-[60px] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,1),0_0_60px_rgba(255,140,0,0.1)] animate-in zoom-in-90 slide-in-from-bottom-20 duration-1000 fill-mode-both">
            
            {/* Marco de Lujo */}
            <div className="absolute inset-0 pointer-events-none border-[20px] border-black/60 z-20" />
            <div className="absolute inset-0 pointer-events-none border border-white/10 z-30" />
            
            <iframe
              src={`${activeVideo}${activeVideo.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full relative z-10"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />

            {/* OVERLAY ESTÉTICO DE CINE */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40 z-20" />
            
            {/* LÍNEAS DE ESCANEO HOLOGRÁFICO */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-30" 
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)' }} />

            {/* INFO PANEL INFERIOR */}
            <div className="absolute bottom-16 left-16 z-40 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF8C00] rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#FF8C00]/40 animate-pulse">
                <Play fill="white" size={28} className="ml-1" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-3 mb-2">
                   <div className="px-4 py-1.5 bg-white/10 border border-white/10 rounded-lg backdrop-blur-md">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">IMAX Experience</span>
                   </div>
                   <div className="h-px w-12 bg-white/20" />
                </div>
                <div className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                   {activePillar?.title || 'CEN Cinema'}
                   <span className="text-white/20">•</span>
                   <span className="text-[#FF8C00] opacity-80">Capítulo Maestro</span>
                </div>
              </div>
            </div>

            {/* ESQUINA DE SEGURIDAD */}
            <div className="absolute top-16 left-16 z-40">
               <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Rec Recording</span>
               </div>
            </div>
          </div>

          {/* EFECTO DE RESPLANDOR AMBIENTAL XL */}
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[90%] h-80 bg-[#FF8C00]/10 blur-[150px] rounded-full pointer-events-none" />
        </div>
      )}
      {/* TOUR DE BIENVENIDA */}
      <OnboardingTour />

      {/* BANNER MODO INVITADO */}
      {profile?.id === 'guest_user' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9000] flex items-center gap-4 px-6 py-4 bg-[#011C40] border border-[#FF8C00]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in slide-in-from-bottom duration-700">
          <div className="w-8 h-8 rounded-full bg-[#FF8C00]/20 flex items-center justify-center text-[#FF8C00] text-lg font-black flex-shrink-0">!</div>
          <p className="text-white/70 text-sm font-semibold">Modo Invitado — tu progreso no se guarda.</p>
          <button
            onClick={() => router.push('/log-in')}
            className="ml-2 px-4 py-2 bg-[#FF8C00] text-black text-xs font-black rounded-xl hover:scale-105 transition-all flex-shrink-0"
          >
            Crear cuenta
          </button>
        </div>
      )}
    </div>
  );
}
