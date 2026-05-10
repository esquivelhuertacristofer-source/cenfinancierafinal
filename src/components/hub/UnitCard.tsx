"use client";

import React, { useState } from "react";
import {
  Lock,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  BookOpen,
  Rocket,
  FileText,
  HelpCircle,
  Zap,
} from "lucide-react";
import type { Unit } from "../../lib/hub";

interface UnitCardProps {
  unit: Unit;
  status: "locked" | "available" | "completed";
  isLast: boolean;
  onClick: () => void;
  unitIndex: number; // Global index for image mapping
}

const ICON_MAP: Record<string, any> = {
  video: PlayCircle,
  reading: BookOpen,
  simulator: Rocket,
  printable: FileText,
  quiz: HelpCircle,
};

export default function UnitCard({
  unit,
  status,
  isLast,
  onClick,
  unitIndex,
}: UnitCardProps) {
  const isLocked = status === "locked";
  const isDone = status === "completed";

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [auraPos, setAuraPos] = useState({ x: 50, y: 50 });

  // Helper for dynamic images based on unitIndex
  const getMissionImage = (index: number) => {
    // There are 33 images (1.webp to 33.webp)
    // We use modulo to cycle if there are more than 33 units
    const imgId = (index % 33) + 1;
    return `/assets/units/${imgId}.webp`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Inclinación 3D mínima absoluta (Casi imperceptible)
    const rotateX = (y - centerY) / 1000;
    const rotateY = (centerX - x) / 1000;
    setTilt({ x: rotateX, y: rotateY });

    // Posición del Aura (Flare)
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setAuraPos({ x: pctX, y: pctY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className={`flex gap-10 relative group ${isLast ? "pb-0" : "pb-14"}`}>
      {/* Step Marker */}
      <div className="flex flex-col items-center w-12 shrink-0">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm z-10 border-4 border-[#FDFCF9] shadow-xl transition-all duration-500
          ${isLocked ? "bg-slate-200 text-slate-400" : isDone ? "bg-[#10B981] text-white" : "bg-[#FF8C00] text-white scale-110"}
        `}
        >
          {isDone ? (
            <CheckCircle2 size={18} />
          ) : isLocked ? (
            <Lock size={16} />
          ) : (
            unit.order
          )}
        </div>
        {!isLast && (
          <div
            className={`w-1 flex-1 absolute top-10 bottom-0 bg-slate-200/50 rounded-full ${isDone ? "bg-[#10B981]/30" : ""}`}
          />
        )}
      </div>

      {/* HORIZONTAL MISSION PANEL (AUTOGROW + XL) */}
      <div
        onClick={isLocked ? undefined : onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(2000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "all 1.5s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        className={`flex-1 flex flex-col md:flex-row min-h-[320px] bg-[#011C40] rounded-[48px] overflow-hidden border border-white/10 transition-all duration-1500 relative
          ${isLocked ? "opacity-40 grayscale cursor-not-allowed" : "cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:border-[#FF8C00]/50"}
        `}
      >
        {/* MOUSE AURA (FLARE) */}
        {!isLocked && (
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(circle at ${auraPos.x}% ${auraPos.y}%, rgba(255,140,0,0.15) 0%, transparent 50%)`,
            }}
          />
        )}

        {/* Visual Cover (Portal Circular) */}
        <div className="w-full md:w-[35%] min-h-[300px] md:min-h-full relative overflow-hidden shrink-0 flex items-center justify-center p-8 bg-gradient-to-br from-[#011C40] to-[#012550]">
          {/* Resplandor de fondo que reacciona al hover */}
          <div className="absolute w-64 h-64 rounded-full bg-[#FF8C00]/5 blur-[60px] group-hover:bg-[#FF8C00]/15 transition-all duration-700" />

          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-8 border-white/5 shadow-2xl z-10 transition-transform duration-1000 group-hover:scale-110 bg-[#011C40]">
            <img
              src={getMissionImage(unitIndex)}
              alt={unit.title}
              className="w-full h-full object-cover"
              style={{
                maskImage:
                  "radial-gradient(circle at center, black 60%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 60%, transparent 100%)",
              }}
            />
            {/* Degradado interno para profundidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#011C40]/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* Mission Details (Auto-expandible) */}
        <div className="flex-1 p-10 md:p-14 flex flex-col justify-between relative z-10 min-w-0">
          <div className="w-full">
            <div
              className={`text-[10px] font-black tracking-[0.5em] uppercase mb-6 ${isDone ? "text-[#10B981]" : "text-[#FF8C00]"}`}
            >
              UNIDAD {unit.code} • ACADEMIA DIAMOND
            </div>
            <h4 className="text-3xl md:text-4xl font-black text-white mb-2 leading-[1.1] font-epilogue tracking-tight break-words">
              {unit.title}
            </h4>

            {/* CONCEPT CHIPS (Diamond v3) */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(
                unit.metadata?.competencies?.slice(0, 3) || [
                  "Teoría",
                  "Práctica",
                  "Evaluación",
                ]
              ).map((concept: string, idx: number) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 group/chip hover:border-[#FF8C00]/30 transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C00] shadow-[0_0_8px_#FF8C00] group-hover/chip:scale-125 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50 group-hover/chip:text-white transition-colors">
                    {concept}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-lg text-white/60 font-medium leading-relaxed opacity-90 max-w-full mb-8">
              {unit.objective}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-8 mt-auto pt-8 border-t border-white/5">
            <div className="flex gap-4 shrink-0">
              {unit.contents.map((c, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center border border-white/10 transition-colors group-hover:border-[#FF8C00]/30"
                >
                  {c.type === "theory" ? (
                    <BookOpen size={22} />
                  ) : c.type === "simulator" ? (
                    <Rocket size={22} />
                  ) : (
                    <HelpCircle size={22} />
                  )}
                </div>
              ))}
            </div>

            <button
              className={`flex items-center gap-4 px-12 py-6 rounded-[28px] font-black uppercase text-sm tracking-widest transition-all duration-300 whitespace-nowrap
              ${isDone ? "bg-[#10B981] text-white hover:bg-[#0E9F6E]" : "bg-[#FF8C00] text-white hover:bg-[#FF9F26] shadow-[0_20px_50px_rgba(255,140,0,0.4)] hover:scale-105 active:scale-95"}
            `}
            >
              {isDone ? "Repasar Misión" : "Iniciar Misión"}
              <ChevronRight
                size={20}
                className="transition-transform group-hover:translate-x-3"
              />
            </button>
          </div>
        </div>

        {/* Locked State Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-[#011C40]/70 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/20 border border-white/10">
                <Lock size={28} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
                Misión Bloqueada
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
