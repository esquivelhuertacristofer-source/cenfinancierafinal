'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  BookOpen, 
  Search,
  Filter,
  ArrowRight,
  X,
  Target,
  CheckCircle2,
  BookMarked,
  Layout,
  MessageSquareQuote
} from 'lucide-react';
import { 
  getCurrentProfile, 
  getPillarsForGrade,
  getGradeMetadata,
  Unit
} from '../../../lib/hub';
import DiamondConceptCarousel from '../../../components/hub/DiamondConceptCarousel';

export default function LibraryPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [pillars, setPillars] = useState<any[]>([]);
  const [gradeMeta, setGradeMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getCurrentProfile();
        if (!p) { router.replace('/log-in'); return; }
        setProfile(p);

        const gradePillars = await getPillarsForGrade(p.grade, p.school_level ?? 'primary');
        setPillars(gradePillars);
        setGradeMeta(getGradeMetadata(p.grade, p.school_level ?? 'primary'));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#011126]">
       <div className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const allUnits = pillars.flatMap(p => p.units.map((u: any) => ({ ...u, pillarName: p.title })));
  const filteredUnits = allUnits.filter(u => 
    u.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.pillarName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="library-canvas animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Epilogue:wght@400;500;700;800;900&display=swap');

        .library-canvas {
          min-height: 100vh; background: #05010D; font-family: 'Plus Jakarta Sans', sans-serif; color: white; padding: 60px 0;
          background-image: radial-gradient(circle at 50% 0%, rgba(255, 140, 0, 0.03) 0%, transparent 70%);
        }

        .lib-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 60px; padding: 0 100px; }
        .back-btn { display: flex; align-items: center; gap: 12px; padding: 12px 24px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; font-size: 11px; font-weight: 800; color: white; text-decoration: none; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.1em; }
        .back-btn:hover { background: white; color: #011C40; }

        .lib-header-content { padding: 0 100px; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .lib-h1 { font-size: 140px; font-family: 'Epilogue', sans-serif; font-weight: 900; letter-spacing: -0.06em; margin-bottom: 8px; line-height: 0.8; text-transform: uppercase; font-style: italic; }
        .lib-p { font-size: 24px; color: rgba(255, 255, 255, 0.3); margin-bottom: 60px; max-width: 900px; font-weight: 500; line-height: 1.4; }

        .search-container { padding: 0 100px; }
        .search-bar {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px; padding: 24px 40px; display: flex; align-items: center; gap: 24px;
          margin-bottom: 100px; backdrop-filter: blur(20px);
        }
        .search-input { background: transparent; border: none; outline: none; color: white; font-size: 20px; width: 100%; font-weight: 600; }

        .lib-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 40px; padding: 0 100px; }
        
        .resource-card {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 48px; padding: 48px; display: flex; flex-direction: column;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); cursor: pointer; position: relative; overflow: hidden;
        }
        .resource-card:hover { transform: translateY(-12px); background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.15); box-shadow: 0 40px 80px rgba(0,0,0,0.6); }

        .res-type { font-size: 11px; font-weight: 900; color: #FF8C00; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 24px; }
        .res-title { font-size: 32px; font-family: 'Epilogue', sans-serif; font-weight: 900; margin-bottom: 16px; line-height: 1; }
        .res-pillar { font-size: 14px; font-weight: 700; opacity: 0.3; margin-bottom: 40px; }
        
        .btn-view {
          margin-top: auto; padding: 20px 32px; background: rgba(255, 140, 0, 0.1); border: 1px solid rgba(255, 140, 0, 0.2);
          border-radius: 20px; font-size: 13px; font-weight: 900; color: #FF8C00; text-transform: uppercase;
          letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 12px;
        }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(1, 17, 38, 0.98); backdrop-filter: blur(40px);
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 60px;
        }

        .modal-content {
          width: 100%; max-width: 1100px; max-height: 90vh; background: #011C40;
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 64px;
          overflow-y: auto; padding: 100px; position: relative;
        }

        .close-btn { position: absolute; top: 60px; right: 60px; width: 70px; height: 70px; border-radius: 24px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .close-btn:hover { background: white; color: #011C40; transform: rotate(90deg); }

        .theory-block { margin-bottom: 60px; }
        .theory-label { font-size: 12px; font-weight: 900; color: #FF8C00; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        .theory-text { font-size: 20px; line-height: 1.8; color: rgba(255, 255, 255, 0.7); font-weight: 500; }

        .section-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 48px; border-radius: 40px; margin-bottom: 32px; }
        .section-card h4 { font-family: 'Epilogue', sans-serif; font-size: 28px; font-weight: 900; margin-bottom: 20px; color: #FF8C00; }
        .section-card p { font-size: 18px; line-height: 1.8; opacity: 0.6; white-space: pre-line; }

        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>

      <nav className="lib-nav">
        <div 
          className="back-btn cursor-pointer" 
          onClick={() => window.location.assign('/hub')}
        >
          <ChevronLeft size={16} /> Volver al Hub
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-black opacity-30 tracking-widest uppercase">Repositorio Académico</div>
            <div className="text-sm font-black">{gradeMeta?.title}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FF8C00] flex items-center justify-center font-black text-xl">
            <BookOpen size={24} />
          </div>
        </div>
      </nav>

      <header className="lib-header-content mb-20">
        <h1 className="lib-h1">Biblioteca</h1>
        <p className="lib-p">
          Explora los fundamentos técnicos y estratégicos de cada unidad del temario. Estos contenidos son la base para tus evaluaciones en la Arena.
        </p>
      </header>

      {/* 3D CONCEPT CAROUSEL (MEMORAMA) */}
      <section className="mb-20">
        <DiamondConceptCarousel />
      </section>

      <div className="search-container">
        <div className="section-title mb-16 flex items-center gap-6">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Explorador de Temario</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="search-bar">
          <Search size={28} className="opacity-20" />
          <input 
            type="text" className="search-input" 
            placeholder="Busca un concepto del temario..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter size={28} className="opacity-20 cursor-pointer" />
        </div>
      </div>

      <main className="lib-grid">
        {filteredUnits.map((u) => (
          <div key={u.code} className="resource-card" onClick={() => setSelectedUnit(u as any)}>
            <div className="res-type">Unidad {u.code}</div>
            <h3 className="res-title">{u.title}</h3>
            <div className="res-pillar">{u.pillarName}</div>
            
            <p className="text-lg opacity-40 line-clamp-3 mb-10 leading-relaxed font-medium">
              {u.theory?.introduction || u.theory?.description || u.theory?.concept || "Explora el marco teórico profundo de esta unidad estratégica."}
            </p>

            <div className="btn-view">Explorar Conceptos <ArrowRight size={18} /></div>
          </div>
        ))}
      </main>

      {selectedUnit && (
        <div className="modal-overlay" onClick={() => setSelectedUnit(null)}>
          <div className="modal-content custom-scrollbar" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedUnit(null)}><X size={32} /></button>

            <div className="mb-20">
              <div className="text-[#FF8C00] font-black uppercase text-xs tracking-[0.5em] mb-4">Temario CEN • {selectedUnit.code}</div>
              <h2 className="text-7xl font-black tracking-tighter mb-8 leading-[0.9]">{selectedUnit.title}</h2>
              <div className="h-2 w-32 bg-[#FF8C00] rounded-full" />
            </div>

            {(selectedUnit.theory?.introduction || selectedUnit.theory?.concept || selectedUnit.theory?.description) && (
              <div className="theory-block">
                <div className="theory-label"><MessageSquareQuote size={20} /> Introducción al Concepto</div>
                <div className="theory-text">
                  {selectedUnit.theory?.introduction || selectedUnit.theory?.concept || selectedUnit.theory?.description}
                </div>
              </div>
            )}

            {selectedUnit.theory?.sections && (
              <div className="theory-block">
                <div className="theory-label"><Layout size={20} /> Desarrollo Teórico</div>
                <div className="grid grid-cols-1 gap-8">
                  {selectedUnit.theory.sections.map((s: any, idx: number) => (
                    <div key={idx} className="section-card">
                      <h4>{s.subtitle || s.title}</h4>
                      <p>{s.content || s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUnit.theory?.key_points && (
              <div className="theory-block">
                <div className="theory-label"><Target size={20} /> Puntos de Dominio</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedUnit.theory.key_points.map((kp: any, idx: number) => (
                    <div key={idx} className="bg-white/5 p-8 rounded-3xl border border-white/10 flex gap-6">
                      <div className="text-[#FF8C00]"><CheckCircle2 size={24} /></div>
                      <div>
                        <div className="font-black text-lg mb-2">{kp.point || kp.title}</div>
                        <div className="text-sm opacity-50 leading-relaxed">{kp.description || kp.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUnit.theory?.glossary && (
              <div className="theory-block">
                <div className="theory-label"><BookMarked size={20} /> Glosario Técnico</div>
                <div className="bg-[#011126] border border-white/10 rounded-[40px] p-12 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                  {Object.entries(selectedUnit.theory.glossary).map(([term, def]: [string, any], idx: number) => (
                    <div key={idx}>
                      <div className="text-[#FF8C00] font-black text-xl mb-2">{term}</div>
                      <div className="text-sm opacity-40 leading-relaxed font-medium">{def}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-20 pt-20 border-t border-white/10 flex justify-between items-center">
              <div className="opacity-30 text-xs font-black uppercase tracking-widest">© CEN Educación Financiera • Sistema de Formación Diamond</div>
              <button onClick={() => setSelectedUnit(null)} className="px-12 py-6 bg-white text-[#011C40] rounded-2xl font-black uppercase tracking-widest hover:bg-[#FF8C00] hover:text-white transition-all shadow-xl">Cerrar Biblioteca</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
