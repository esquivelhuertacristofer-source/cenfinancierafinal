'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, PlayCircle, X, Target } from 'lucide-react';
import UnitTimeline from '../../../components/hub/UnitTimeline';
import { getPillarById, FALLBACK_PROFILE } from '../../../lib/hub';

export default function MissionPage() {
  const [pillarId, setPillarId] = useState<string | null>(null);
  const [pillar, setPillar] = useState<any>(null);
  const [showExpertVideo, setShowExpertVideo] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setPillarId(id);
    getPillarById(id || 'p1', FALLBACK_PROFILE.grade, 'primary').then(setPillar);
  }, []);

  if (!pillar) return <div className="h-screen bg-[#011126]" />;

  return (
    <div className="min-h-screen bg-[#011126] text-white font-sans overflow-x-hidden">
      {/* DEPURACIÓN: Si ves este borde rojo, el archivo se actualizó */}
      <style>{`
        .debug-border { border: 2px solid red !important; }
        .force-visible-btn { 
          position: relative !important; 
          z-index: 9999 !important; 
          display: flex !important; 
          background: #FF8C00 !important;
          padding: 20px 40px !important;
          border-radius: 20px !important;
          font-weight: 900 !important;
          margin-top: 40px !important;
          cursor: pointer !important;
          border: none !important;
          color: white !important;
          text-transform: uppercase !important;
        }
      `}</style>

      <nav className="p-10 flex justify-between items-center border-b border-white/5">
        <div className="cursor-pointer opacity-50 hover:opacity-100 flex items-center gap-2" onClick={() => window.location.assign('/hub')}>
          <ChevronLeft /> VOLVER AL HUB
        </div>
        <div className="font-black text-sm uppercase tracking-widest">{pillar.title}</div>
      </nav>

      <header className="p-10 lg:p-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-in slide-in-from-left duration-1000">
            <span className="text-[#FF8C00] font-black text-xs tracking-[0.5em] block mb-6 uppercase opacity-50">CEN Academia Diamond</span>
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-none font-epilogue tracking-tighter">{pillar.title}</h1>

            {/* CONCEPT CHIPS (Diamond v3 - Dynamic) */}
            <div className="flex flex-wrap gap-4 mb-12">
              {(pillar.units[0]?.metadata?.competencies?.slice(0, 3) || ['Estrategia', 'Análisis', 'Ejecución']).map((tag: string, idx: number) => (
                <div key={idx} className="px-8 py-4 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl flex items-center gap-4 group/tag hover:border-[#FF8C00]/50 transition-all duration-500 shadow-2xl">
                  <div className="w-3 h-3 rounded-full bg-[#FF8C00] shadow-[0_0_20px_#FF8C00] group-hover/tag:scale-150 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-[0.3em] text-white/60 group-hover/tag:text-white transition-colors">{tag}</span>
                </div>
              ))}
            </div>
            
            <p className="text-2xl text-white/40 mb-12 max-w-xl leading-relaxed italic">"Desarrolla las competencias necesarias para dominar el ecosistema financiero del siglo XXI."</p>
            
            {pillar.videoUrl && (
              <button 
                onClick={() => setShowExpertVideo(true)}
                className="flex items-center gap-6 px-12 py-8 bg-[#FF8C00] text-white rounded-[32px] font-black text-xl uppercase tracking-widest hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,140,0,0.4)] active:scale-95 transition-all"
              >
                <PlayCircle size={32} /> Ver Masterclass de Misión
              </button>
            )}
          </div>
          <div className="hidden lg:flex justify-end animate-in fade-in zoom-in duration-1000">
            <div className="relative">
               <div className="absolute inset-0 bg-[#FF8C00]/20 blur-[120px] rounded-full animate-pulse" />
               <img src="/assets/landing-v3/Secundaria1.png" className="w-[500px] h-[500px] object-contain relative z-10" alt="" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-10 lg:px-20 py-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-16">
          <div className="w-4 h-4 rounded-full bg-[#FF8C00] shadow-[0_0_15px_#FF8C00]" />
          <span className="text-4xl font-black uppercase tracking-tighter text-white font-epilogue">Ruta Académica</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        
        <div className="bg-white/[0.02] rounded-[60px] p-12 lg:p-20 border border-white/5 backdrop-blur-3xl">
          <UnitTimeline
            pillar={pillar}
            completed={new Set()}
            userId={null}
            onComplete={() => {}}
            globalOffset={0}
          />
        </div>
      </main>

      {/* VIDEO PLAYER MODAL (CEN CINEMA XL) */}
      {showExpertVideo && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-20 animate-in fade-in duration-700"
          style={{ background: 'radial-gradient(circle at center, rgba(1, 10, 25, 0.98) 0%, #000 100%)' }}
        >
          <div className="absolute inset-0 backdrop-blur-[30px] opacity-40" />
          
          <button 
            onClick={() => setShowExpertVideo(false)}
            className="absolute top-12 right-12 z-[10010] w-20 h-20 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-[24px] flex items-center justify-center text-white/40 hover:text-red-500 transition-all duration-500 group"
          >
            <X size={32} className="group-hover:rotate-90 transition-transform duration-700" />
          </button>

          <div className="relative w-full max-w-7xl aspect-video rounded-[60px] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,1)] animate-in zoom-in-90 slide-in-from-bottom-20 duration-1000">
            <iframe 
              src={`${pillar.videoUrl}${pillar.videoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40" />
            <div className="absolute bottom-16 left-16 z-40 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF8C00] rounded-[24px] flex items-center justify-center shadow-2xl shadow-[#FF8C00]/40">
                <PlayCircle size={32} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">CEN Cinema • Masterclass</div>
                <div className="text-3xl font-black text-white uppercase tracking-tighter">{pillar.title}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
