"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, Coins, Target, TrendingUp, Sparkles, LineChart, ShieldCheck, PlayCircle, BookOpen, Printer, ScrollText } from "lucide-react";

const BENTO_GRADES = [
  { year: 1, title: "Mis Primeros Pesos", desc: "El valor del dinero y el ahorro básico.", span: "col-span-2 lg:col-span-1", icon: <Coins />, color: "text-cen-cyan", bg: "bg-cen-cyan/10", href: "/log-in" },
  { year: 2, title: "Ahorrando con Ceny", desc: "Metas de ahorro y la alcancía inteligente.", span: "col-span-2 lg:col-span-1", icon: <Target />, color: "text-cen-orange", bg: "bg-cen-orange/10", href: "/log-in" },
  { year: 3, title: "Compro Inteligente", desc: "Diferencia entre necesidades y deseos en el presupuesto.", span: "col-span-4 lg:col-span-2", icon: <TrendingUp />, color: "text-cen-blue", bg: "bg-cen-blue/10", isWide: true, href: "/log-in" },
  { year: 4, title: "Mi Primer Negocio", desc: "Emprendimiento y generación de valor.", span: "col-span-2 lg:col-span-1", icon: <Sparkles />, color: "text-cen-cyan", bg: "bg-cen-cyan/10", href: "/log-in" },
  { year: 5, title: "Invierto mi Futuro", desc: "Introducción a la inversión responsable.", span: "col-span-2 lg:col-span-1", icon: <LineChart />, color: "text-cen-orange", bg: "bg-cen-orange/10", href: "/log-in" },
  { year: 6, title: "Ciudadano Financiero", desc: "Economía, impuestos y responsabilidad social.", span: "col-span-4 lg:col-span-2", icon: <GraduationCap />, color: "text-cen-blue", bg: "bg-cen-blue/10", isWide: true, href: "/log-in" },
];

export default function PrimaryGrid() {
  return (
    <section id="niveles" className="py-32 bg-[#F9FAFB] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.01] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-black text-cen-blue tracking-tighter">
              Nivel <span className="text-cen-cyan">Primaria.</span>
            </h2>
          </div>
          <p className="max-w-sm text-lg text-cen-blue/40 font-medium leading-relaxed">
            Una base sólida de 6 años para construir una mentalidad de abundancia y responsabilidad.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 lg:gap-8">
          {/* Hero Card */}
          <Link
            href="/log-in"
            className="col-span-4 lg:col-span-2 row-span-2 relative group rounded-[3rem] overflow-hidden bg-cen-navy shadow-[0_30px_70px_rgba(1,28,64,0.2)] flex flex-col p-10 lg:p-14 min-h-[600px] transition-transform duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-xl border border-white/10 shadow-inner">
                <GraduationCap className="w-8 h-8 text-cen-cyan" />
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1] tracking-tight mb-6">
                Fundamentos<br/>Financieros
              </h2>
              <p className="text-lg text-white/60 font-medium leading-relaxed mb-12 max-w-[300px]">
                Domina los conceptos básicos mientras te diviertes con los simuladores de CEN Academy.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-white text-cen-blue px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:bg-cen-cyan group-hover:text-white transition-all">
                  Explorar Temario →
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-[140%] h-[140%] max-w-[500px] max-h-[500px] pointer-events-none">
                <Image
                  src="/assets/primary_card.png"
                  alt="Primaria Illustration"
                  fill
                  className="object-contain object-right-bottom drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:-translate-y-8 transition-all duration-1000 ease-out"
                />
              </div>
            </div>
          </Link>

          {/* Grade Cards */}
          {BENTO_GRADES.map((grade) => (
            <Link
              href={grade.href}
              key={grade.year}
              className={`${grade.span} bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_30px_rgba(1,28,64,0.03)] hover:shadow-[0_30px_60px_rgba(1,28,64,0.08)] border border-slate-100 transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col tilt-card`}
            >
              <div className="absolute -right-8 -bottom-10 text-[12rem] font-black text-slate-50 group-hover:text-cen-bg transition-colors duration-700 z-0 select-none">
                {grade.year}
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-12 h-12 rounded-2xl ${grade.bg} flex items-center justify-center ${grade.color} shadow-inner`}>
                    {grade.icon}
                  </div>
                  <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-cen-blue transition-colors">
                    Grado 0{grade.year}
                  </div>
                </div>
                <h3 className={`text-2xl font-black ${grade.color} leading-tight mb-4 group-hover:translate-x-1 transition-transform`}>
                  {grade.title}
                </h3>
                <p className={`text-sm lg:text-base text-cen-blue/40 font-medium leading-relaxed ${grade.isWide ? 'max-w-[70%]' : ''} mb-8 flex-1`}>
                  {grade.desc}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {[PlayCircle, BookOpen, Printer, ScrollText].map((Icon, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-lg group-hover:bg-cen-blue/5 transition-colors">
                        <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm border border-slate-100">
                          <Icon className={`w-3.5 h-3.5 ${['text-cen-blue','text-cen-cyan','text-cen-orange','text-cen-blue/40'][i]}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-cen-orange group-hover:text-white transition-all shadow-sm border border-slate-100">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
