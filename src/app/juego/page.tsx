'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Medal } from 'lucide-react';

export default function JuegoPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem('cen_test_profile');
    if (profile) {
      try { setUserId(JSON.parse(profile).id); } catch {}
    }
  }, []);

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    if (userId && userId !== 'guest_user') {
      const key = `cen_xp_${userId}`;
      const current = parseInt(localStorage.getItem(key) ?? '0', 10);
      localStorage.setItem(key, String(current + 200));
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#000' }}>
      {/* Barra superior */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 flex-shrink-0"
           style={{ background: 'rgba(26,5,51,0.98)' }}>
        <div className="flex items-center gap-4">
          <span className="text-2xl">🎮</span>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-300">Actividad Bono · CEN Educación Financiera</div>
            <div className="text-xl font-black text-white">Juego Financiero</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!completed ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }}
            >
              <Medal size={18} /> Terminé el juego (+200 XP)
            </button>
          ) : (
            <div className="flex items-center gap-2 px-8 py-4 rounded-2xl text-emerald-300 text-sm font-black uppercase tracking-widest border"
                 style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }}>
              <Medal size={18} /> ¡Completado! +200 XP
            </div>
          )}
          <button
            onClick={() => router.push('/hub')}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all hover:bg-red-500"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Iframe del juego */}
      <iframe
        src="/games/juego-financiero/"
        className="flex-1 w-full border-none"
        allow="autoplay; fullscreen; gamepad"
        title="Juego Financiero CEN"
      />
    </div>
  );
}
