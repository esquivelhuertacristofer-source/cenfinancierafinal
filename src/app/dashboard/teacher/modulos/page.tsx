"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/dashboard/Sidebar";
import { getPillarsForGrade, PillarMeta, Unit } from "../../../../lib/hub";
import { 
  BookOpen, 
  ChevronRight, 
  Video, 
  FileText, 
  Printer, 
  HelpCircle, 
  Layers,
  ArrowLeft,
  Sparkles,
  Search,
  LayoutGrid,
  Library,
  ArrowRight,
  Sun,
  Moon,
  Activity
} from "lucide-react";

interface TeacherProfile {
  full_name: string;
  group_id: string;
}

const PREMIUM_GRADES = [
  // PRIMARIA
  { 
    key: "primary-1", 
    num: 1, 
    level: "Primaria", 
    label: "1° Primaria",
    title: "Conociendo el Dinero", 
    desc: "Identifica billetes y monedas, comprendiendo de dónde viene el dinero y su función básica.", 
    img: "/assets/landing-v3/Primaria1.png" 
  },
  { 
    key: "primary-2", 
    num: 2, 
    level: "Primaria", 
    label: "2° Primaria",
    title: "El Valor de las Cosas", 
    desc: "Diferencia entre deseos y necesidades, y aprende cómo el ahorro constante ayuda a alcanzar metas.", 
    img: "/assets/landing-v3/Primaria2.png" 
  },
  { 
    key: "primary-3", 
    num: 3, 
    level: "Primaria", 
    label: "3° Primaria",
    title: "Mi Primer Presupuesto", 
    desc: "Introducción a ingresos y egresos. Aprende a crear un presupuesto sencillo para administrar tus domingos.", 
    img: "/assets/landing-v3/Primaria3.png" 
  },
  { 
    key: "primary-4", 
    num: 4, 
    level: "Primaria", 
    label: "4° Primaria",
    title: "El Mundo de los Bancos", 
    desc: "Descubre qué es un banco, para qué sirven las cuentas de ahorro, el uso de cajeros y la inflación.", 
    img: "/assets/landing-v3/Primaria4.png" 
  },
  { 
    key: "primary-5", 
    num: 5, 
    level: "Primaria", 
    label: "5° Primaria",
    title: "Finanzas Cotidianas", 
    desc: "Entiende los créditos, la diferencia entre tarjetas de débito y crédito, y el impacto real de los intereses.", 
    img: "/assets/landing-v3/Primaria5.png" 
  },
  { 
    key: "primary-6", 
    num: 6, 
    level: "Primaria", 
    label: "6° Primaria",
    title: "Mi Futuro Financiero", 
    desc: "Conceptos avanzados explicados simple: qué es una AFORE, cómo funcionan las inversiones y las cripto.", 
    img: "/assets/landing-v3/Primaria6.png" 
  },
  // SECUNDARIA
  { 
    key: "secondary-1", 
    num: 1, 
    level: "Secundaria", 
    label: "1° Secundaria",
    title: "Dinero Real", 
    desc: "Banca digital, pagos en línea y tu primer presupuesto personal con visión de futuro.", 
    img: "/assets/landing-v3/Secundaria1.png" 
  },
  { 
    key: "secondary-2", 
    num: 2, 
    level: "Secundaria", 
    label: "2° Secundaria",
    title: "Inversión Joven", 
    desc: "CETES, fondos de inversión y cómo tu dinero puede trabajar para ti desde hoy.", 
    img: "/assets/landing-v3/Secundaria2.png" 
  },
  { 
    key: "secondary-3", 
    num: 3, 
    level: "Secundaria", 
    label: "3° Secundaria",
    title: "Emprendedor Pro", 
    desc: "Plan de negocio, financiamiento y escalabilidad. El último nivel para la libertad financiera.", 
    img: "/assets/landing-v3/Secundaria3.png" 
  },
];

const CONTENT_ICONS: Record<string, React.ElementType> = {
  video:     Video,
  reading:   FileText,
  printable: Printer,
  quiz:      HelpCircle,
  simulator: Layers,
  guide:     BookOpen,
};

export default function ModulosPage() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<PillarMeta | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/log-in"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, group_id")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "teacher") { router.push("/"); return; }
      setTeacher({ full_name: profile.full_name, group_id: profile.group_id });
      setLoading(false);
    };
    init();
  }, [router]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const [pillarsForGrade, setPillarsForGrade] = useState<PillarMeta[]>([]);
  useEffect(() => {
    if (!selectedGrade) { setPillarsForGrade([]); return; }
    const [level, numStr] = selectedGrade.split("-");
    getPillarsForGrade(parseInt(numStr), level).then(setPillarsForGrade);
  }, [selectedGrade]);

  const CONTENT_COLORS: Record<string, string> = {
    video:     `text-[#011C40] ${theme === 'dark' ? 'bg-white/10' : 'bg-[#011C40]/5'} border-current`,
    reading:   "text-[#42E8E0] bg-[#42E8E0]/10 border-[#42E8E0]/20",
    printable: "text-[#FF8C00] bg-[#FF8C00]/10 border-[#FF8C00]/20",
    quiz:      "text-violet-500 bg-violet-500/10 border-violet-500/20",
    simulator: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    guide:     `${theme === 'dark' ? 'text-white/40 bg-white/5 border-white/10' : 'text-slate-400 bg-slate-50 border-slate-100'}`,
  };

  if (!mounted) return null;

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center font-['Epilogue'] transition-colors duration-1000 ${theme === 'dark' ? 'bg-[#011C40]' : 'bg-[#F4F1EA]'}`}>
      <div className="flex flex-col items-center gap-6">
        <div className={`w-16 h-16 border-4 rounded-full animate-spin ${theme === 'dark' ? 'border-white/5 border-t-[#FF8C00]' : 'border-[#011C40]/10 border-t-[#FF8C00]'}`} />
        <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-white/40' : 'text-[#011C40]'}`}>Sincronizando Bóveda...</p>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen font-['Epilogue'] relative overflow-hidden transition-colors duration-1000 ${theme === 'dark' ? 'bg-[#011C40]' : 'bg-[#F4F1EA]'}`}>
      
      {/* CINEMATIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 right-0 w-[1400px] h-[1400px] rounded-full blur-[200px] -mr-80 -mt-80 animate-pulse transition-opacity duration-1000 ${theme === 'dark' ? 'bg-[#FF8C00]/5 opacity-100' : 'bg-[#FF8C00]/10 opacity-60'}`} />
        <div className={`absolute bottom-0 left-[300px] w-[1200px] h-[1200px] rounded-full blur-[180px] -ml-80 -mb-80 transition-opacity duration-1000 ${theme === 'dark' ? 'bg-[#42E8E0]/5 opacity-100' : 'bg-[#42E8E0]/10 opacity-60'}`} />
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.05]'}`} 
             style={{ backgroundImage: `linear-gradient(${theme === 'dark' ? '#ffffff' : '#011C40'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#ffffff' : '#011C40'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <Sidebar teacherName={teacher?.full_name} groupId={teacher?.group_id} />

      <main className="flex-1 ml-[260px] relative z-10 dashboard-scrollbar-thin overflow-y-auto h-screen flex flex-col">
        
        {/* HUD STATUS BAR */}
        <div className={`sticky top-0 z-50 backdrop-blur-3xl border-b px-12 py-5 flex items-center justify-between transition-all duration-700 ${theme === 'dark' ? 'bg-[#011C40]/80 border-white/5 shadow-2xl' : 'bg-[#F4F1EA]/80 border-[#011C40]/5 shadow-lg'}`}>
          <div className="flex items-center gap-12">
             <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,140,0,0.5)] bg-[#FF8C00]`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-white/50' : 'text-[#011C40]/40'}`}>CURRÍCULUM V3.1</span>
             </div>
             <div className="h-6 w-px bg-current opacity-10" />
             <div className="hidden xl:flex items-center gap-10">
                <div className="flex items-center gap-3 group cursor-default">
                  <Library className="w-4 h-4 text-[#42E8E0]" />
                  <div className="flex flex-col">
                     <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Bóveda</span>
                     <span className={`text-[10px] font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>240 Módulos</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="relative group w-72">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`} />
                <input 
                  type="text" 
                  placeholder="Buscar en la biblioteca..."
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all ${
                    theme === 'dark' 
                    ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-[#FF8C00]' 
                    : 'bg-[#011C40]/5 border border-[#011C40]/5 text-[#011C40] placeholder:text-slate-400 focus:bg-white focus:border-[#FF8C00] shadow-sm'
                  }`}
                />
             </div>

             <div className="h-10 w-px bg-current opacity-10" />

             <button 
                onClick={toggleTheme}
                className={`relative flex items-center p-1 rounded-full transition-all duration-500 group shadow-inner ${theme === 'dark' ? 'bg-white/5 border border-white/10 w-24' : 'bg-[#011C40]/5 border border-[#011C40]/10 w-24'}`}
             >
                <div className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl ${theme === 'dark' ? 'translate-x-12 bg-[#FF8C00]' : 'translate-x-0 bg-[#011C40]'}`}>
                   {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                </div>
                <div className="w-full flex justify-between px-3">
                   <Sun className={`w-4 h-4 ${theme === 'light' ? 'opacity-0' : 'text-white/20'}`} />
                   <Moon className={`w-4 h-4 ${theme === 'dark' ? 'opacity-0' : 'text-[#011C40]/20'}`} />
                </div>
             </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="p-12 space-y-16 flex-1">
          
          {!selectedGrade ? (
            <div className="space-y-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              
              {/* Header section when no grade selected */}
              <div className="space-y-4">
                 <h1 className={`text-7xl font-black tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>
                   Biblioteca <span className={`italic font-sans ${theme === 'dark' ? 'text-[#FF8C00]' : 'text-[#FF8C00]'}`}>CEN</span>
                 </h1>
                 <p className={`text-lg font-medium max-w-xl ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                   Explora los niveles académicos alineados con la visión de excelencia de CEN Academy.
                 </p>
              </div>

              {/* Primaria Grid */}
              <section className="space-y-10">
                <div className="flex items-center gap-4">
                   <h2 className={`text-4xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>
                     Academia <span className="text-[#FF8C00]">Primaria</span>
                   </h2>
                   <div className="h-px flex-1 bg-current opacity-10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {PREMIUM_GRADES.filter(g => g.level === "Primaria").map((grade, i) => (
                    <div
                      key={grade.key}
                      onClick={() => setSelectedGrade(grade.key)}
                      className={`group relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer ${
                        theme === 'dark' ? 'hover:shadow-[0_40px_90px_rgba(255,140,0,0.2)]' : 'hover:shadow-[0_40px_90px_rgba(1,28,64,0.2)]'
                      }`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <img src={grade.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${theme === 'dark' ? 'from-[#011C40] via-[#011C40]/80 to-transparent' : 'from-[#011C40] via-[#011C40]/60 to-transparent'}`} />
                      
                      <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 text-white">
                         <div className="flex items-start justify-between">
                            <div className="px-5 py-2 bg-[#FF8C00] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                              Grado {grade.num}
                            </div>
                            <span className="text-5xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">{grade.num}°</span>
                         </div>
                         <div className="space-y-6">
                            <div>
                               <h3 className="text-3xl font-black tracking-tighter leading-none mb-4 group-hover:text-[#FF8C00] transition-colors">{grade.title}</h3>
                               <p className="text-sm text-white/60 font-medium leading-relaxed line-clamp-3">{grade.desc}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                               <p className="text-[10px] font-black uppercase tracking-widest text-[#42E8E0]">20 Módulos</p>
                               <ArrowRight className="w-6 h-6 text-[#FF8C00] transition-transform group-hover:translate-x-2" />
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Secundaria Grid */}
              <section className="space-y-10">
                <div className="flex items-center gap-4">
                   <h2 className={`text-4xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>
                     Academia <span className="text-[#42E8E0]">Secundaria</span>
                   </h2>
                   <div className="h-px flex-1 bg-current opacity-10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-20">
                  {PREMIUM_GRADES.filter(g => g.level === "Secundaria").map((grade, i) => (
                    <div
                      key={grade.key}
                      onClick={() => setSelectedGrade(grade.key)}
                      className={`group relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer ${
                        theme === 'dark' ? 'hover:shadow-[0_40px_90px_rgba(66,232,224,0.2)]' : 'hover:shadow-[0_40px_90px_rgba(1,28,64,0.2)]'
                      }`}
                      style={{ animationDelay: `${(i+6) * 100}ms` }}
                    >
                      <img src={grade.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${theme === 'dark' ? 'from-[#011C40] via-[#011C40]/80 to-transparent' : 'from-[#011C40] via-[#011C40]/60 to-transparent'}`} />
                      
                      <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 text-white">
                         <div className="flex items-start justify-between">
                            <div className="px-5 py-2 bg-[#42E8E0] text-[#011C40] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                              Grado {grade.num}
                            </div>
                            <span className="text-5xl font-black tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">{grade.num}°</span>
                         </div>
                         <div className="space-y-6">
                            <div>
                               <h3 className="text-3xl font-black tracking-tighter leading-none mb-4 group-hover:text-[#42E8E0] transition-colors">{grade.title}</h3>
                               <p className="text-sm text-white/60 font-medium leading-relaxed line-clamp-3">{grade.desc}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                               <p className="text-[10px] font-black uppercase tracking-widest text-[#FF8C00]">20 Módulos</p>
                               <ArrowRight className="w-6 h-6 text-[#42E8E0] transition-transform group-hover:translate-x-2" />
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Vista de temario por grado (Bento Path) */
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5">
                <button
                  onClick={() => { setSelectedGrade(null); setSelectedPillar(null); }}
                  className={`flex items-center gap-4 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                    theme === 'dark' ? 'bg-white text-[#011C40] hover:bg-[#FF8C00] hover:text-white' : 'bg-[#011C40] text-white hover:bg-[#FF8C00]'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Biblioteca General
                </button>
                <div className="flex items-center gap-6 pr-6">
                   <div className="text-right">
                      <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-2 ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>Explorando Grado</p>
                      <p className={`text-3xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>
                        {PREMIUM_GRADES.find((g) => g.key === selectedGrade)?.label}
                      </p>
                   </div>
                   <div className="h-12 w-2 bg-[#FF8C00] rounded-full shadow-[0_0_15px_rgba(255,140,0,0.5)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Pillars list (Bento Sidebar) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-4 mb-6">
                     <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Pilares de Conocimiento</h3>
                     <div className="h-px flex-1 bg-current opacity-10" />
                  </div>
                  {pillarsForGrade.map((pillar) => (
                    <button
                      key={pillar.id}
                      onClick={() => setSelectedPillar(pillar)}
                      className={`w-full text-left p-8 rounded-[3rem] transition-all relative overflow-hidden group border ${
                        selectedPillar?.id === pillar.id 
                        ? (theme === 'dark' ? "bg-white text-[#011C40] border-white scale-[1.03] shadow-[0_20px_50px_rgba(255,255,255,0.1)]" : "bg-[#011C40] text-white border-[#011C40] scale-[1.03] shadow-2xl") 
                        : (theme === 'dark' ? "bg-white/5 border-white/5 text-white hover:bg-white/10" : "bg-white border-slate-100 text-[#011C40] hover:border-[#FF8C00] shadow-sm")
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <span className={`text-4xl transition-transform duration-700 ${selectedPillar?.id === pillar.id ? "scale-125 rotate-6" : "group-hover:scale-110"}`}>
                            {pillar.icon}
                          </span>
                          <div>
                            <p className="font-black text-lg tracking-tight leading-none mb-2">{pillar.title}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedPillar?.id === pillar.id ? (theme === 'dark' ? "text-[#FF8C00]" : "text-[#42E8E0]") : "text-slate-400"}`}>
                              {pillar.units.length} Unidades Pedagógicas
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-6 h-6 transition-transform duration-500 ${selectedPillar?.id === pillar.id ? "opacity-40 group-hover:translate-x-2" : "opacity-10"}`} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Units Detail (Bento Content) */}
                <div className="lg:col-span-7">
                  {selectedPillar ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
                      <div className={`rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-[#011C40] to-[#011C40]/40 border border-white/5' : 'bg-[#011C40] text-white'}`}>
                         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 transition-transform hover:scale-110">
                            <BookOpen className="w-48 h-48" />
                         </div>
                         <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-5">
                              <span className="text-5xl">{selectedPillar.icon}</span>
                              <div className="h-10 w-px bg-white/20" />
                              <h4 className="text-3xl font-black tracking-tighter text-white">{selectedPillar.title}</h4>
                            </div>
                            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-lg">
                              Unidades diseñadas bajo el esquema <span className="text-[#FF8C00] font-black">Diamond State</span> para garantizar la excelencia pedagógica y el engagement total.
                            </p>
                         </div>
                      </div>

                      <div className="space-y-6 pb-20">
                        {selectedPillar.units.map((unit: Unit, i: number) => (
                          <div 
                            key={unit.code} 
                            className={`rounded-[3rem] p-10 border transition-all duration-700 group animate-in fade-in slide-in-from-bottom-8 ${
                              theme === 'dark' 
                              ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' 
                              : 'bg-white border-slate-100 shadow-lg hover:shadow-2xl hover:border-[#FF8C00]/20'
                            }`}
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                              <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4">
                                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#FF8C00]/10 text-[#FF8C00]' : 'bg-[#FFF1D6] text-[#FF8C00]'}`}>
                                    {unit.code}
                                  </span>
                                  <h5 className={`text-2xl font-black tracking-tighter group-hover:translate-x-2 transition-transform ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>
                                    {unit.title}
                                  </h5>
                                </div>
                                <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>
                                  {unit.objective}
                                </p>
                                <div className="flex flex-wrap gap-3 pt-2">
                                  {unit.contents.map((c) => {
                                    const Icon = CONTENT_ICONS[c.type] ?? BookOpen;
                                    return (
                                      <div
                                        key={c.type}
                                        className={`flex items-center gap-3 rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${CONTENT_COLORS[c.type]}`}
                                      >
                                        <Icon className="h-4 w-4" />
                                        {c.label}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <button className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                                theme === 'dark' ? 'bg-white text-[#011C40] hover:bg-[#42E8E0]' : 'bg-[#011C40] text-white hover:bg-[#FF8C00]'
                              }`}>
                                 Abrir Módulo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`h-full min-h-[500px] rounded-[4rem] border-2 border-dashed flex flex-col items-center justify-center p-16 text-center space-y-8 transition-all ${
                      theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200'
                    }`}>
                      <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce transition-colors ${theme === 'dark' ? 'bg-white' : 'bg-[#011C40]'}`}>
                        <Sparkles className={`w-12 h-12 ${theme === 'dark' ? 'text-[#FF8C00]' : 'text-[#42E8E0]'}`} />
                      </div>
                      <div className="space-y-3">
                         <p className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#011C40]'}`}>Selecciona un Pilar</p>
                         <p className={`text-sm font-medium italic ${theme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}>Para desplegar el mapa pedagógico detallado.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
