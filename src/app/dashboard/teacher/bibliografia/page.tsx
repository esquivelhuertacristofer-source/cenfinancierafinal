"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../../../components/dashboard/Sidebar";
import { 
  Book, 
  Globe, 
  ExternalLink, 
  Library, 
  Sparkles, 
  Search,
  ArrowUpRight,
  ShieldCheck,
  Bookmark,
  GraduationCap,
  Scale,
  TrendingUp,
  Wallet,
  Shield,
  HeartPulse,
  Filter,
  CheckCircle2,
  Info
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  author?: string;
  description: string;
  longDescription: string;
  url: string;
  category: "Oficial" | "Inversión" | "Libros" | "Impuestos & Retiro" | "Seguros";
  type: string;
  tags: string[];
  level: ("Primaria" | "Secundaria" | "Docentes")[];
  isPremium?: boolean;
}

const resources: Resource[] = [
  {
    id: "gov-1",
    title: "CONDUSEF - Educa tu Cartera",
    description: "Portal oficial de educación financiera en México.",
    longDescription: "Es la plataforma más completa del país. Ofrece desde cuadernos básicos para niños hasta el 'Diplomado en Educación Financiera' de 120 horas con validez oficial. Ideal para estructurar clases completas.",
    url: "https://educa.condusef.gob.mx/",
    category: "Oficial",
    type: "Portal Gubernamental",
    tags: ["GRATUITO", "DIPLOMADOS", "OFICIAL"],
    level: ["Primaria", "Secundaria", "Docentes"],
    isPremium: true
  },
  {
    id: "gov-2",
    title: "Banxico Educa",
    description: "Recursos del Banco de México sobre economía y finanzas.",
    longDescription: "Explica de forma magistral cómo funciona la inflación, el sistema de pagos y el papel del banco central. Cuenta con juegos interactivos y material descargable para docentes.",
    url: "https://educa.banxico.org.mx/",
    category: "Oficial",
    type: "Banco Central",
    tags: ["INFLACIÓN", "SISTEMA FINANCIERO", "DIDÁCTICO"],
    level: ["Secundaria", "Docentes"]
  },
  {
    id: "tax-1",
    title: "SAT - Civismo Fiscal",
    description: "Portal del SAT para entender la importancia de los impuestos.",
    longDescription: "Proporciona herramientas para enseñar a los alumnos por qué se pagan impuestos y cómo se utilizan en el gasto público. Incluye el portal 'SAT ID' para trámites digitales.",
    url: "http://omawww.sat.gob.mx/CivismoFiscal/Paginas/default.htm",
    category: "Impuestos & Retiro",
    type: "Tributación",
    tags: ["IMPUESTOS", "SAT", "CIUDADANÍA"],
    level: ["Secundaria", "Docentes"]
  },
  {
    id: "inv-1",
    title: "BIVA Academy",
    description: "Educación bursátil por la Bolsa Institucional de Valores.",
    longDescription: "Cursos y webinars sobre cómo funciona el mercado de valores en México. Excelente para alumnos de secundaria avanzada que quieren entender la inversión en bolsa.",
    url: "https://www.biva.mx/educacion",
    category: "Inversión",
    type: "Bolsa de Valores",
    tags: ["ACCIONES", "MERCADOS", "INVERSIÓN"],
    level: ["Secundaria", "Docentes"]
  },
  {
    id: "ret-1",
    title: "CONSAR - Todo sobre tu AFORE",
    description: "Guía oficial para el ahorro para el retiro.",
    longDescription: "Fundamental para que los docentes expliquen el sistema de ahorro para el retiro en México. Contiene calculadoras de ahorro y guías para trabajadores independientes.",
    url: "https://www.gob.mx/consar",
    category: "Impuestos & Retiro",
    type: "Retiro",
    tags: ["AFORE", "AHORRO", "FUTURO"],
    level: ["Docentes", "Secundaria"]
  },
  {
    id: "seg-1",
    title: "AMIS - Quiero Saber de Seguros",
    description: "Portal de la Asociación Mexicana de Instituciones de Seguros.",
    longDescription: "Enseña la importancia de la prevención y la transferencia de riesgos. Explica seguros de vida, salud, auto y hogar de manera sencilla.",
    url: "https://quierosaberdeseguros.org.mx/",
    category: "Seguros",
    type: "Prevención",
    tags: ["RIESGO", "PROTECCIÓN", "SALUD"],
    level: ["Primaria", "Secundaria", "Docentes"]
  },
  {
    id: "book-1",
    title: "Pequeño Cerdo Capitalista",
    author: "Sofía Macías",
    description: "Libro referente de finanzas personales en México.",
    longDescription: "Indispensable. Explica con peras y manzanas cómo arreglar el desastre financiero. Incluye ejercicios prácticos de ahorro y planes de inversión.",
    url: "https://www.pequenocerdocapitalista.com/",
    category: "Libros",
    type: "Literatura",
    tags: ["AHORRO", "MÉXICO", "PRACTICIDAD"],
    level: ["Secundaria", "Docentes"],
    isPremium: true
  },
  {
    id: "book-2",
    title: "La Psicología del Dinero",
    author: "Morgan Housel",
    description: "Lecciones atemporales sobre la riqueza y la felicidad.",
    longDescription: "Analiza el comportamiento humano. Enseña que hacer bien las finanzas no se trata de lo que sabes, sino de cómo te comportas.",
    url: "https://www.amazon.com.mx/psicolog%C3%ADa-del-dinero-lecciones-atemporales/dp/8409320293",
    category: "Libros",
    type: "Psicología",
    tags: ["COMPORTAMIENTO", "MENTALIDAD", "GLOBAL"],
    level: ["Docentes", "Secundaria"]
  }
];

export default function BibliografiaPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [activeLevel, setActiveLevel] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesCategory = activeCategory === "Todos" || r.category === activeCategory;
      const matchesLevel = activeLevel === "Todos" || r.level.includes(activeLevel as any);
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                           r.description.toLowerCase().includes(search.toLowerCase()) ||
                           r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [activeCategory, activeLevel, search]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-['Epilogue'] text-[#011C40]">
      <Sidebar teacherName="Profesor CEN" groupId="MASTER-REF" />

      <main className="flex-1 md:ml-[260px] p-8 md:p-12 space-y-12 relative">
        
        {/* HEADER SECTION */}
        <div className="relative overflow-hidden rounded-[3.5rem] bg-[#011C40] p-16 shadow-[0_40px_80px_rgba(1,28,64,0.3)] animate-in fade-in slide-in-from-top-12 duration-700">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF8C00]/20 rounded-full blur-[140px] animate-pulse" />
          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
            <div className="space-y-8 flex-1 text-center xl:text-left">
              <div className="flex items-center justify-center xl:justify-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <Library className="w-6 h-6 text-[#42E8E0]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">CEN Academy Knowledge</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
                Biblioteca <span className="dashboard-gradient-orange italic dashboard-serif-premium">Maestra</span>
              </h1>
              <p className="max-w-2xl text-xl text-white/50 font-medium leading-relaxed">
                Repositario auditado de recursos pedagógicos para la excelencia en Educación Financiera.
              </p>
            </div>
            
            <div className="w-full xl:w-[450px] space-y-6">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30 group-focus-within:text-[#FF8C00] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Búsqueda Inteligente..."
                  className="w-full pl-16 pr-8 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-white font-bold focus:ring-4 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] outline-none transition-all backdrop-blur-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="sticky top-8 z-30 bg-[#F4F1EA]/80 backdrop-blur-2xl p-6 rounded-[3rem] border border-white shadow-xl flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#011C40] text-white rounded-2xl">
              <Filter className="w-5 h-5" />
            </div>
            <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100">
              {["Todos", "Oficial", "Inversión", "Libros", "Impuestos & Retiro", "Seguros"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                    ? "bg-[#011C40] text-white shadow-lg scale-[1.02]" 
                    : "text-slate-400 hover:text-[#011C40] hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filtrar Nivel:</span>
             <div className="flex gap-2">
                {["Todos", "Primaria", "Secundaria", "Docentes"].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      activeLevel === lvl 
                      ? "bg-[#FF8C00] border-[#FF8C00] text-white" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* RESOURCES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
          {filteredResources.map((resource, i) => (
            <div 
              key={resource.id}
              className="group relative bg-white rounded-[3.5rem] p-12 border border-white shadow-[0_30px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_60px_100px_rgba(1,28,64,0.1)] transition-all duration-700 hover:-translate-y-4 flex flex-col animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {resource.isPremium && (
                <div className="absolute top-8 right-8 px-4 py-2 bg-[#FF8C00] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg animate-bounce">
                  CEN Choice
                </div>
              )}
              
              <div className="flex items-start justify-between mb-10">
                <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center transition-all ${
                  resource.category === "Oficial" ? "bg-emerald-50 text-emerald-600" :
                  resource.category === "Inversión" ? "bg-blue-50 text-blue-600" :
                  resource.category === "Libros" ? "bg-orange-50 text-orange-600" :
                  "bg-slate-50 text-slate-600"
                }`}>
                   {resource.category === "Oficial" ? <ShieldCheck className="w-8 h-8" /> :
                    resource.category === "Inversión" ? <TrendingUp className="w-8 h-8" /> :
                    resource.category === "Libros" ? <Book className="w-8 h-8" /> :
                    resource.category === "Seguros" ? <Shield className="w-8 h-8" /> :
                    <Wallet className="w-8 h-8" />}
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{resource.type}</span>
                   <div className="flex gap-1">
                      {resource.level.map(l => (
                        <div key={l} className="w-2 h-2 rounded-full bg-[#42E8E0]" title={l} />
                      ))}
                   </div>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-3xl font-black text-[#011C40] leading-none tracking-tighter group-hover:text-[#FF8C00] transition-colors mb-3">
                    {resource.title}
                  </h4>
                  {resource.author && (
                    <p className="text-[11px] font-black text-[#011C40]/40 uppercase tracking-widest mb-4">Por {resource.author}</p>
                  )}
                </div>
                
                <p className="text-slate-500 font-medium leading-relaxed">
                  {resource.description}
                </p>

                <div className="bg-[#F4F1EA] rounded-3xl p-6 space-y-3 border border-slate-100/50">
                   <div className="flex items-center gap-2 text-[9px] font-black text-[#FF8C00] uppercase tracking-widest">
                      <Info className="w-3 h-3" /> Por qué lo recomendamos
                   </div>
                   <p className="text-[12px] font-bold text-[#011C40]/70 leading-relaxed italic">
                     "{resource.longDescription}"
                   </p>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-wrap gap-2 mb-10">
                {resource.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>

              <a 
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-6 bg-[#011C40] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 group/btn hover:bg-[#FF8C00] transition-all shadow-xl active:scale-95"
              >
                Acceder al Recurso
                <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredResources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-in zoom-in">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-xl font-black text-[#011C40] tracking-tight">No se encontraron recursos para esta selección</p>
            <button 
              onClick={() => { setActiveCategory("Todos"); setActiveLevel("Todos"); setSearch(""); }}
              className="px-8 py-4 bg-[#011C40] text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </main>


    </div>
  );
}
