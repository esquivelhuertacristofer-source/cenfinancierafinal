"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, TrendingUp, Rocket, PlayCircle, BookOpen, Printer, ScrollText } from "lucide-react";

const SECONDARY_GRADES = [
  {
    year: 1,
    title: "Dinero Real",
    desc: "Banca digital, pagos en línea y tu primer presupuesto personal.",
    color: "text-cen-cyan",
    bg: "bg-cen-cyan/10",
    icon: <TrendingUp />,
    href: "/log-in",
  },
  {
    year: 2,
    title: "Inversión Joven",
    desc: "CETES, fondos de inversión y cómo tu dinero puede trabajar para ti.",
    color: "text-cen-orange",
    bg: "bg-cen-orange/10",
    icon: <Rocket />,
    href: "/log-in",
  },
  {
    year: 3,
    title: "Emprendedor Pro",
    desc: "Plan de negocio, financiamiento y escalabilidad. El último nivel.",
    color: "text-cen-blue",
    bg: "bg-cen-blue/10",
    icon: <GraduationCap />,
    href: "/log-in",
  },
];

export default function SecondaryGrid() {
  return (
    <section className="py-32 bg-cen-blue relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cen-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cen-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cen-cyan/60 mb-3">Nivel Avanzado</p>
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
              Nivel <span className="text-cen-cyan">Secundaria.</span>
            </h2>
          </div>
          <p className="max-w-sm text-lg text-white/40 font-medium leading-relaxed">
            3 años para dominar inversión, emprendimiento y libertad financiera real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Hero card */}
          <Link
            href="/log-in"
            className="lg:col-span-5 relative group rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col p-10 lg:p-14 min-h-[500px] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-cen-cyan/20 rounded-2xl flex items-center justify-center mb-10 border border-cen-cyan/20">
                <GraduationCap className="w-8 h-8 text-cen-cyan" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1] tracking-tight mb-6">
                Inteligencia<br/>Financiera
              </h2>
              <p className="text-white/50 font-medium leading-relaxed mb-10 flex-1">
                El programa más completo de educación financiera para jóvenes de 12 a 15 años. Desde banca digital hasta pitch decks.
              </p>
              <div className="inline-flex items-center gap-3 bg-cen-cyan text-cen-blue px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest w-fit group-hover:bg-white transition-all">
                Acceder al programa
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-64 h-64 pointer-events-none opacity-20">
              <Image
                src="/assets/ceny.png"
                alt="CENy Secondary"
                fill
                className="object-contain object-right-bottom group-hover:scale-110 transition-all duration-700"
              />
            </div>
          </Link>

          {/* Grade cards */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-5">
            {SECONDARY_GRADES.map((grade) => (
              <Link
                href={grade.href}
                key={grade.year}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-6 overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl ${grade.bg} flex items-center justify-center ${grade.color} flex-shrink-0`}>
                  {grade.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Secundaria {grade.year}°</p>
                  </div>
                  <h3 className={`text-xl font-black ${grade.color} leading-tight mb-1`}>{grade.title}</h3>
                  <p className="text-sm text-white/40 font-medium leading-snug">{grade.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {[PlayCircle, BookOpen, Printer, ScrollText].map((Icon, i) => (
                    <div key={i} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                      <Icon className={`w-3.5 h-3.5 ${['text-cen-cyan','text-white','text-cen-orange','text-white/60'][i]}`} />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cen-orange group-hover:text-white transition-all ml-2">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
