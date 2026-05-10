'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Award, 
  Star, 
  ShieldCheck, 
  Sparkles,
  Trophy,
  Lock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  getPillarsForGrade, 
  getCompletedActivities, 
  getCurrentProfile, 
  getPillarProgress 
} from '../../../lib/hub';

const MEDAL_VARIANTS = [
  { label: 'Novato', color: '#CD7F32', min: 0 },
  { label: 'Experto', color: '#C0C0C0', min: 40 },
  { label: 'Maestro', color: '#FFD700', min: 70 },
  { label: 'Diamond', color: '#42E8E0', min: 100 },
];

export default function AchievementsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [pillars, setPillars] = useState<any[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const p = await getCurrentProfile();
      if (!p) { router.replace('/log-in'); return; }
      setProfile(p);

      const progress = await getCompletedActivities(p.id);
      setCompleted(progress);

      const gradePillars = await getPillarsForGrade(p.grade, p.school_level ?? 'primary');
      setPillars(gradePillars);
      setLoading(false);
    }
    loadData();
  }, [router]);

  if (loading) return null;

  return (
    <div className="achievements-canvas animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;700;800;900&display=swap');

        .achievements-canvas {
          min-height: 100vh;
          background: #011C40;
          font-family: 'Epilogue', sans-serif;
          color: white;
          padding: 60px 80px;
          overflow-x: hidden;
        }

        .ach-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 80px;
        }

        .back-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 24px; background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;
          font-size: 11px; font-weight: 900; text-transform: uppercase;
          letter-spacing: 0.1em; color: white; text-decoration: none;
          transition: all 0.3s;
        }
        .back-btn:hover { background: white; color: #011C40; }

        .ach-h1 { font-size: 56px; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 12px; }
        .ach-p { font-size: 18px; color: rgba(255, 255, 255, 0.4); margin-bottom: 60px; max-width: 600px; }

        .medals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .medal-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          padding: 40px;
          text-align: center;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .medal-card:hover { transform: translateY(-10px); border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.05); }

        .medal-icon-box {
          width: 120px; height: 120px;
          margin: 0 auto 32px;
          border-radius: 32px;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          z-index: 2;
        }

        .medal-glow {
          position: absolute; inset: 0; filter: blur(30px); opacity: 0.3;
          border-radius: 50%; z-index: 1;
        }

        .medal-title { font-size: 24px; font-weight: 900; margin-bottom: 8px; }
        .medal-status { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.4; }

        .medal-locked { filter: grayscale(1); opacity: 0.3; }

        .progress-pill {
          margin-top: 32px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          display: inline-flex;
          align-items: center; gap: 10px;
          font-size: 11px; font-weight: 900;
        }

        @media (max-width: 768px) {
          .achievements-canvas { padding: 40px 20px; }
          .ach-h1 { font-size: 36px; }
        }
      `}</style>

      <nav className="ach-nav">
        <Link href="/hub" className="back-btn">
          <ChevronLeft size={16} /> Volver al Hub
        </Link>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 900, opacity: 0.3, letterSpacing: '0.2em' }}>TROPHY ROOM</div>
          <div style={{ fontSize: 13, fontWeight: 900 }}>Vitrina de Logros</div>
        </div>
      </nav>

      <header>
        <h1 className="ach-h1">Mis Medallas</h1>
        <p className="ach-p">
          Completa las misiones de cada pilar para desbloquear las medallas Diamond. 
          Cada nivel alcanzado demuestra tu dominio en finanzas.
        </p>
      </header>

      <main className="medals-grid">
        {pillars.map((p) => {
          const { pct } = getPillarProgress(p, completed);
          const currentMedal = [...MEDAL_VARIANTS].reverse().find(m => pct >= m.min) || MEDAL_VARIANTS[0];
          const isLocked = pct === 0;

          return (
            <div key={p.id} className={`medal-card ${isLocked ? 'medal-locked' : ''}`}>
              <div className="medal-glow" style={{ backgroundColor: currentMedal.color }} />
              
              <div className="medal-icon-box" style={{ background: `${currentMedal.color}20`, border: `2px solid ${currentMedal.color}` }}>
                {isLocked ? (
                  <Lock size={48} className="text-white/20" />
                ) : (
                  <Trophy size={48} style={{ color: currentMedal.color }} />
                )}
              </div>

              <h3 className="medal-title">{p.shortTitle}</h3>
              <div className="medal-status" style={{ color: !isLocked ? currentMedal.color : undefined }}>
                {isLocked ? 'Por Desbloquear' : `Rango: ${currentMedal.label}`}
              </div>

              <div className="progress-pill">
                <Star size={12} className={!isLocked ? 'text-[#FF8C00]' : 'text-white/20'} />
                <span>{pct}% Completado</span>
              </div>

              {!isLocked && pct === 100 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                   <button className="w-full py-4 rounded-2xl bg-white text-[#011C40] font-black text-[11px] uppercase tracking-widest hover:bg-[#FF8C00] hover:text-white transition-all">
                      Descargar Certificado
                   </button>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <section className="mt-32 p-16 bg-[#FF8C00] rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_40px_100px_rgba(255,140,0,0.2)]">
         <div className="text-white">
            <h2 className="text-4xl font-black tracking-tighter mb-4">¿Buscas el Nivel Diamond?</h2>
            <p className="text-lg opacity-80 font-medium">Completa todos los pilares al 100% para obtener la Certificación de Honor CEN.</p>
         </div>
         <button onClick={() => router.push('/hub')} className="px-12 py-6 bg-[#011C40] text-white rounded-2xl font-black uppercase tracking-widest text-[13px] hover:scale-105 transition-all flex items-center gap-4 group">
            Ir a las Misiones <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
         </button>
      </section>
    </div>
  );
}
