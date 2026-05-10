"use client";

import { PieChart, Zap } from "lucide-react";

export default function GroupRadarChart() {
  return (
    <div className="rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-xl p-8 shadow-sm group h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#023047]/40 leading-none pb-1">Análisis de Dominio</h3>
            <p className="text-lg font-black text-[#023047]">Competencias Diamond</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
        {/* SVG Radar Mock */}
        <svg viewBox="0 0 100 100" className="w-full max-w-[220px] drop-shadow-2xl">
          {/* Grid Circles */}
          {[20, 40, 60, 80, 100].map(r => (
            <circle key={r} cx="50" cy="50" r={r/2} fill="none" stroke="rgba(2,48,71,0.05)" strokeWidth="0.5" />
          ))}
          {/* Grid Lines */}
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line 
              key={a} 
              x1="50" y1="50" 
              x2={50 + 50 * Math.cos(a * Math.PI / 180)} 
              y2={50 + 50 * Math.sin(a * Math.PI / 180)} 
              stroke="rgba(2,48,71,0.05)" strokeWidth="0.5" 
            />
          ))}
          {/* Data Polygon */}
          <polygon 
            points="50,15 90,50 75,85 25,85 10,50 25,15" 
            fill="rgba(66, 232, 224, 0.2)" 
            stroke="#42E8E0" 
            strokeWidth="1"
            className="animate-pulse"
          />
          {/* Data Points */}
          <circle cx="50" cy="15" r="1.5" fill="#011C40" />
          <circle cx="90" cy="50" r="1.5" fill="#FF8C00" />
          <circle cx="75" cy="85" r="1.5" fill="#011C40" />
        </svg>

        {/* Labels positioned around the radar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#023047] uppercase tracking-widest">Ahorro</div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[8px] font-black text-[#023047] uppercase tracking-widest">Inversión</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#023047] uppercase tracking-widest">Riesgo</div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[8px] font-black text-[#023047] uppercase tracking-widest">Plan</div>
      </div>

      <div className="mt-6 flex items-center justify-between p-4 bg-[#023047]/5 rounded-2xl border border-white">
        <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FB8500]" />
            <span className="text-[10px] font-black text-[#023047] uppercase tracking-widest">Punto Crítico:</span>
        </div>
        <span className="text-[10px] font-black text-[#FB8500] uppercase underline">Gestión de Deuda</span>
      </div>
    </div>
  );
}
