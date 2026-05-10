"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/dashboard/Sidebar";
import { 
  Search, 
  Clock, 
  GraduationCap, 
  BarChart, 
  Zap, 
  FileText, 
  Target, 
  Lightbulb, 
  Download, 
  Monitor,
  CheckCircle2,
  ListTodo,
  BookOpen,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { pedagogiaData } from "../../../../data/pedagogia/hub";

export default function PlaneamientoPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("p1");
  const [activeTab, setActiveTab] = useState<"estrategia" | "teoria" | "evaluacion">("estrategia");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGradeData = (grade: string) => {
    if (grade.startsWith('s')) return (pedagogiaData.secundaria as any)[grade];
    return (pedagogiaData.primaria as any)[grade];
  };

  const currentData = getGradeData(selectedGrade);
  const [activeUnit, setActiveUnit] = useState<any>(Object.values(currentData)[0]);

  useEffect(() => {
    setActiveUnit(Object.values(currentData)[0]);
  }, [selectedGrade]);

  if (!mounted) return null;

  const units = Object.values(currentData).map((u: any) => ({
    code: u.code,
    title: u.title,
    duration: u.duration
  }));

  const filteredUnits = units.filter(u => 
    u.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-['Epilogue'] text-[#011C40]">
      <Sidebar teacherName="Profesor CEN" groupId={`${selectedGrade.toUpperCase()}-A`} />

      <main className="flex-1 ml-[260px] flex h-screen overflow-hidden">
        
        {/* LEFT PANEL: UNIT SELECTOR (Bento Sidebar) */}
        <div className="w-[380px] bg-white/50 backdrop-blur-xl border-r border-white/40 flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.02)] relative z-10">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#011C40] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <ListTodo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-xs uppercase tracking-widest text-[#011C40]">Plan Maestro</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Diamond State v2.0</p>
                </div>
              </div>
              <div className="relative">
                <select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as any)}
                  className="appearance-none bg-[#FF8C00] text-white text-[11px] font-black uppercase px-4 py-2 pr-8 rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer outline-none hover:bg-[#e67e00] transition-colors"
                >
                  {["p1","p2","p3","p4","p5","p6","s1","s2","s3"].map(g => (
                    <option key={g} value={g}>{g.toUpperCase()}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-white rotate-45" />
                </div>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF8C00] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar en el currículo..."
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-white rounded-2xl text-xs font-medium focus:ring-4 focus:ring-[#FF8C00]/10 focus:border-[#FF8C00] outline-none transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-3 custom-scrollbar">
            {filteredUnits.map((u) => (
              <button
                key={u.code}
                onClick={() => setActiveUnit((currentData as any)[u.code])}
                className={`w-full text-left p-5 rounded-[22px] transition-all relative overflow-hidden group ${
                  activeUnit?.code === u.code 
                  ? "bg-[#011C40] text-white shadow-[0_20px_40px_rgba(1,28,64,0.2)] scale-[1.02] -translate-y-1" 
                  : "bg-white hover:bg-[#FFF1D6]/30 border border-transparent hover:border-[#FFE3BF]"
                }`}
              >
                {activeUnit?.code === u.code && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                )}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${activeUnit?.code === u.code ? "text-[#42E8E0]" : "text-[#FF8C00]"}`}>
                      {u.code}
                    </span>
                    <div className="flex items-center gap-1 opacity-60">
                      <Clock className="w-3 h-3" />
                      <span className="text-[9px] font-bold">{u.duration}</span>
                    </div>
                  </div>
                  <p className={`font-black text-sm leading-snug tracking-tight ${activeUnit?.code === u.code ? "text-white" : "text-[#011C40]"}`}>
                    {u.title}
                  </p>
                  <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold transition-all ${activeUnit?.code === u.code ? "text-white/40" : "text-slate-400 opacity-0 group-hover:opacity-100"}`}>
                    Ver planeamiento completo <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: MAIN CONTENT (Bento Grid Layout) */}
        <div className="flex-1 overflow-y-auto bg-[#F4F1EA] custom-scrollbar">
          
          {/* PREMIUM TOP NAV */}
          <div className="sticky top-0 z-30 bg-[#F4F1EA]/80 backdrop-blur-xl px-12 py-6 flex items-center justify-between border-b border-[#011C40]/5">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#F4F1EA] bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="text-[#011C40] font-black">24 Profesores</span> utilizando esta guía hoy
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white border border-white rounded-2xl shadow-sm text-slate-400 hover:text-[#011C40] hover:shadow-md transition-all">
                <Monitor className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-3 px-6 py-3.5 bg-[#011C40] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">
                <Download className="w-4 h-4 text-[#42E8E0]" />
                Exportar para SEP
              </button>
            </div>
          </div>

          <div className="p-12 space-y-12">
            
            {/* HERO SECTION (Bento Style) */}
            <div className="grid grid-cols-12 gap-6">
              {/* Main Title Card */}
              <div className="col-span-12 lg:col-span-8 bento-card p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE3BF]/30 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-[#FFF1D6] text-[#FF8C00] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                      Nivel: {activeUnit?.level}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      ID: {activeUnit?.code}
                    </span>
                  </div>
                  <h1 className="text-6xl font-black text-[#011C40] leading-[1.1] tracking-tighter">
                    {activeUnit?.title.split(':')[0]}
                    <span className="block premium-gradient-text mt-2 italic font-serif-premium opacity-90">
                      {activeUnit?.title.split(':')[1] || ""}
                    </span>
                  </h1>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
                <div className="col-span-1 bg-[#011C40] rounded-[32px] p-6 text-white flex flex-col justify-between shadow-xl shadow-blue-900/10">
                  <Clock className="w-6 h-6 text-[#42E8E0]" />
                  <div>
                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">Duración</p>
                    <p className="text-xl font-black">{activeUnit?.duration}</p>
                  </div>
                </div>
                <div className="col-span-1 bg-white rounded-[32px] p-6 border border-white flex flex-col justify-between shadow-sm">
                  <BarChart className="w-6 h-6 text-[#FF8C00]" />
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Dificultad</p>
                    <p className="text-xl font-black text-[#011C40]">{activeUnit?.difficulty}</p>
                  </div>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-[#42E8E0] to-[#011C40] rounded-[32px] p-6 text-white relative overflow-hidden group">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase opacity-60 mb-1">Metodología</p>
                      <p className="text-lg font-black tracking-tight">Diamond State V2</p>
                    </div>
                    <Sparkles className="w-8 h-8 text-white/30 group-hover:rotate-12 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION (Premium Pill) */}
            <div className="flex justify-center">
              <div className="bg-white/50 backdrop-blur-md p-2 rounded-[32px] border border-white shadow-xl flex gap-2">
                {[
                  { id: "estrategia", label: "Estrategia", icon: Zap },
                  { id: "teoria", label: "Marco Teórico", icon: BookOpen },
                  { id: "evaluacion", label: "Evaluación", icon: CheckCircle2 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-10 py-5 rounded-[24px] text-[12px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeTab === tab.id 
                      ? "bg-[#011C40] text-white shadow-2xl scale-105" 
                      : "text-slate-500 hover:bg-white hover:text-[#011C40]"
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-[#42E8E0]" : "text-slate-400"}`} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN CONTENT BENTO GRID */}
            <div className="grid grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Main Tab Content */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                {activeTab === "estrategia" && (
                  <div className="space-y-6">
                    {activeUnit?.strategy.phases.map((phase: any, i: number) => (
                      <div key={i} className="group relative bento-card p-10 overflow-hidden">
                        <div className={`absolute top-0 left-0 w-2 h-full ${i === 0 ? "bg-[#FF8C00]" : i === 1 ? "bg-[#011C40]" : "bg-[#42E8E0]"}`} />
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white ${i === 0 ? "bg-[#FF8C00]" : i === 1 ? "bg-[#011C40]" : "bg-[#42E8E0]"}`}>
                                {i + 1}
                              </span>
                              <h4 className="text-xl font-black text-[#011C40] tracking-tight">{phase.title}</h4>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium text-lg">
                              {phase.description}
                            </p>
                            <div className="bg-[#F4F1EA] p-6 rounded-[24px] border border-black/5 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Zap className="w-12 h-12" />
                              </div>
                              <p className="text-[10px] font-black text-[#FF8C00] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <Info className="w-3 h-3" /> Actividad Sugerida
                              </p>
                              <p className="text-sm font-bold text-[#011C40] leading-relaxed">
                                {phase.activity}
                              </p>
                            </div>
                          </div>
                          <div className="md:w-32 flex md:flex-col items-center gap-3 shrink-0">
                            <div className="bg-slate-50 px-4 py-3 rounded-2xl text-center w-full border border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tiempo</p>
                              <p className="text-sm font-black text-[#011C40]">{phase.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "teoria" && (
                  <div className="bento-card p-16 space-y-12 animate-in fade-in zoom-in duration-500">
                    <div className="space-y-6">
                      <div className="w-16 h-1 bg-[#42E8E0] rounded-full" />
                      <h2 className="text-4xl font-black text-[#011C40] leading-tight">
                        Introducción al <span className="premium-gradient-text">Marco Teórico</span>
                      </h2>
                      <p className="text-2xl text-slate-500 font-medium leading-relaxed italic">
                        "{activeUnit?.theory.introduction}"
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {activeUnit?.theory.sections.map((section: any, i: number) => (
                        <div key={i} className="space-y-4 group">
                          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[#011C40] group-hover:text-white transition-all">
                            <span className="text-xs font-black">0{i+1}</span>
                          </div>
                          <h4 className="text-xl font-black text-[#011C40] group-hover:text-[#FF8C00] transition-colors">{section.subtitle}</h4>
                          <p className="text-slate-600 leading-relaxed font-medium">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "evaluacion" && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-white rounded-[48px] p-12 border border-white shadow-xl space-y-10">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                        <h4 className="text-2xl font-black text-[#011C40]">Banco de Evaluación</h4>
                        <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          Auditado Diamond State
                        </div>
                      </div>
                      <div className="space-y-6">
                        {activeUnit?.evaluation.exam_questions.map((q: any, i: number) => (
                          <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100/50 space-y-6 hover:border-[#FF8C00]/20 transition-all">
                            <p className="text-xl font-black text-[#011C40] flex gap-4">
                              <span className="text-[#FF8C00]">Q{i+1}.</span> {q.question}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt: string, j: number) => (
                                <div key={j} className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                                  opt === q.correct 
                                  ? "bg-emerald-50 border-emerald-500/20 text-emerald-800 shadow-[0_10px_20px_rgba(16,185,129,0.1)]" 
                                  : "bg-white border-transparent text-slate-500"
                                }`}>
                                  <div className={`w-2 h-2 rounded-full ${opt === q.correct ? "bg-emerald-500" : "bg-slate-200"}`} />
                                  <span className="text-sm font-bold">{opt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Rubric Card */}
                    <div className="bg-[#011C40] rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Target className="w-48 h-48" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#42E8E0] rounded-2xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-[#011C40]" />
                          </div>
                          <h4 className="text-2xl font-black uppercase tracking-widest">Rúbrica de Éxito</h4>
                        </div>
                        <p className="text-2xl text-slate-300 leading-relaxed font-light">
                          {activeUnit?.evaluation.rubric}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Metadata & Tips (Sticky Bento) */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                
                {/* Ficha Técnica Premium Card */}
                <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-white relative overflow-hidden group">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#42E8E0]/10 rounded-full -mb-16 -mr-16 blur-2xl" />
                  <div className="space-y-10 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#011C40] rounded-2xl flex items-center justify-center shadow-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-widest text-[#011C40]">Ficha Técnica</h3>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8C00]">Objetivo Pedagógico</p>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                          {activeUnit?.metadata.objective}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8C00]">Competencias</p>
                        <div className="flex flex-wrap gap-2">
                          {activeUnit?.metadata.competencies.map((c: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-slate-50 text-[#011C40] border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8C00]">Recursos Necesarios</p>
                        <div className="grid grid-cols-1 gap-2">
                          {activeUnit?.metadata.materials.map((m: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-[#F4F1EA]/50 rounded-2xl border border-white/50">
                              <div className="w-2 h-2 bg-[#42E8E0] rounded-full" />
                              <span className="text-[11px] font-bold text-[#011C40]">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Tips Floating Card */}
                <div className="bg-[#FFF1D6] rounded-[40px] p-10 border border-[#FFE3BF] relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <Lightbulb className="w-20 h-20 text-[#FF8C00]" />
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-[#011C40]">Consejo de Expertos</h3>
                    </div>
                    <div className="space-y-4">
                      {activeUnit?.teacher_tips.map((tip: string, i: number) => (
                        <p key={i} className="text-sm font-bold text-[#011C40]/70 leading-relaxed italic">
                          "{tip}"
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Call to action card */}
                <div className="bg-gradient-to-br from-[#011C40] to-[#042a5e] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer">
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Monitor className="w-8 h-8 text-[#42E8E0]" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight leading-tight">¿Listo para proyectar esta sesión?</h4>
                    <p className="text-xs text-white/50 font-medium">Inicia el modo interactivo para que tus alumnos sigan la clase en vivo.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(1, 28, 64, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(1, 28, 64, 0.2);
        }
      `}</style>
    </div>
  );
}
