"use client";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  LogOut,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronDown,
  Library
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";

const navItems = [
  { icon: LayoutDashboard, label: "Panel Principal",      href: "/dashboard/teacher" },
  { icon: Users,           label: "Mis Alumnos",    href: "/dashboard/teacher/alumnos" },
  { icon: BookOpen,        label: "Módulos CEN", href: "/dashboard/teacher/modulos" },
  { icon: GraduationCap,   label: "Planeamiento", href: "/dashboard/teacher/planeamiento" },
  { icon: BarChart3,       label: "Reportes Académicos",   href: "/dashboard/teacher/reportes" },
  { icon: Library,         label: "Bibliografía",      href: "/dashboard/teacher/bibliografia" },
];

export default function Sidebar({ 
  teacherName, 
  groupId, 
  currentLevel = 'secundaria', 
  onLevelChange 
}: { 
  teacherName?: string; 
  groupId?: string;
  currentLevel?: 'primaria' | 'secundaria';
  onLevelChange?: (level: 'primaria' | 'secundaria') => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col bg-[#011C40] overflow-hidden shadow-[20px_0_60px_rgba(1,28,64,0.3)] border-r border-white/5 font-['Epilogue'] transition-all noise-texture">
      
      {/* Decorative Gradient Glows (Landing Parity) */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#FF8C00]/30 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse" />
      <div className="absolute -right-40 bottom-20 w-80 h-80 bg-[#42E8E0]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo Section */}
      <div className="relative z-10 pt-10 pb-8 px-8">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#FF8C00] to-[#e67e00] shadow-[0_15px_30px_rgba(255,140,0,0.3)] overflow-hidden transition-all duration-500 group-hover:rotate-6">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white font-black text-2xl tracking-tighter">C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl leading-none tracking-tighter">CEN</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#42E8E0] text-[7px] font-black uppercase tracking-[0.2em]">Educación Financiera</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL SELECTOR (NEW) */}
      <div className="relative z-10 px-6 mb-8">
         <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1">
            {['primaria', 'secundaria'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onLevelChange?.(lvl as any)}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${
                  currentLevel === lvl 
                  ? 'bg-white text-[#011C40] shadow-xl translate-y-[-1px]' 
                  : 'text-white/30 hover:text-white/60'
                }`}
              >
                {lvl}
              </button>
            ))}
         </div>
      </div>

      {/* Active Context Badge */}
      <div className="relative z-10 px-6 mb-10">
        <button className="w-full flex items-center gap-4 rounded-[1.75rem] bg-white/5 backdrop-blur-2xl border border-white/10 px-5 py-4 shadow-inner group transition-all duration-500 hover:bg-white/10 hover:border-white/20 text-left">
          <div className="relative h-8 w-8 shrink-0">
            <div className="absolute inset-0 bg-[#FF8C00] rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full w-full rounded-xl bg-gradient-to-br from-[#FF8C00] to-[#e67e00] flex items-center justify-center text-white shadow-xl">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/40 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Grupo Activo</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-white font-black text-[12px] truncate tracking-tight">
                {groupId || (currentLevel === 'secundaria' ? 'Secundaria 3' : 'Primaria 6')}
              </p>
              <ChevronDown className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors" />
            </div>
          </div>
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="relative z-10 flex-1 px-4 space-y-3">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard/teacher" 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center gap-4 rounded-[1.5rem] px-6 py-4.5 text-[13px] font-black uppercase tracking-widest transition-all duration-700 ${
                isActive
                  ? "bg-white text-[#011C40] shadow-[0_20px_40px_rgba(0,0,0,0.3)] translate-x-3 scale-[1.02]"
                  : "text-white/30 hover:text-white hover:bg-white/5 hover:translate-x-1"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#FF8C00] rounded-full -ml-0.75" />
              )}
              <item.icon
                className={`h-5 w-5 transition-all duration-500 ${
                  isActive ? "text-[#FF8C00] scale-110 rotate-3" : "text-white/20 group-hover:text-[#42E8E0] group-hover:rotate-12"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 text-[#011C40]/20" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="relative z-10 p-6 mt-auto">
        <div className="mb-6 p-1 bg-white/5 rounded-[2.5rem] flex items-center gap-4 pr-6 border border-white/5">
          <div className="h-12 w-12 rounded-[2rem] bg-gradient-to-tr from-white/10 to-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-black text-lg shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {teacherName?.charAt(0)?.toUpperCase() || "T"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">Docente Certificado</p>
            <p className="text-white font-black text-[14px] truncate tracking-tighter leading-none">{teacherName || "Profesor CEN"}</p>
          </div>
          <Sparkles className="w-4 h-4 text-[#FF8C00] animate-pulse" />
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/log-in";
          }}
          className="group flex w-full items-center justify-center gap-3 rounded-[1.75rem] bg-white text-[#011C40] px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[#FF8C00] hover:text-white hover:shadow-[0_20px_40px_rgba(255,140,0,0.3)] active:scale-95 border border-white/10"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Desconectar
        </button>
      </div>
    </aside>
  );
}
