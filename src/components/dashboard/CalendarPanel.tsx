"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, PlusCircle } from "lucide-react";

export default function CalendarPanel() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('es-MX', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Mini Calendar Card */}
      <div className="rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-xl p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-[#219EBC]">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#023047]">Agenda Docente</h3>
          </div>
          <button className="h-8 w-8 rounded-xl bg-orange-500/10 text-[#FB8500] hover:bg-[#FB8500] hover:text-white transition-all flex items-center justify-center shadow-sm">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm font-black text-[#023047] capitalize">{monthName} {year}</p>
            <div className="flex gap-1">
                <button 
                  onClick={() => {
                    const prev = new Date(currentDate);
                    prev.setMonth(prev.getMonth() - 1);
                    setCurrentDate(prev);
                  }} 
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const next = new Date(currentDate);
                    next.setMonth(next.getMonth() + 1);
                    setCurrentDate(next);
                  }} 
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
            <span key={`${d}-${i}`} className="text-[9px] font-black text-gray-300 uppercase">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map(b => <div key={`b-${b}`} />)}
          {days.map(d => {
            const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            const hasActivity = d === 12 || d === 18 || d === 25;
            const hasPlan = d === 15 || d === 22;

            return (
              <button
                key={d}
                className={`relative h-9 w-full rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  isToday ? 'bg-[#023047] text-white shadow-lg' : 'text-[#023047] hover:bg-white hover:shadow-sm'
                }`}
              >
                {d}
                <div className="absolute bottom-1.5 flex gap-0.5">
                    {hasActivity && <div className="w-1 h-1 rounded-full bg-[#219EBC]" />}
                    {hasPlan && <div className="w-1 h-1 rounded-full bg-[#FB8500]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Log for selected day */}
      <div className="rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-[#FB8500] animate-pulse" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#023047]">Actividad: Hoy</h4>
        </div>

        <div className="space-y-4">
            <div className="p-4 bg-[#EFF9FF] rounded-2xl border border-[#219EBC]/10 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#219EBC] uppercase">Planificado</span>
                    <Clock className="w-3 h-3 text-[#219EBC]/40" />
                </div>
                <p className="text-xs font-black text-[#023047]">Módulo: Inversiones Pro</p>
                <p className="text-[10px] text-[#023047]/40 font-bold uppercase">10:00 AM - Grupo A</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-50 space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Completado</span>
                    <span className="text-[9px] font-bold text-gray-300">14:20</span>
                </div>
                <p className="text-xs font-black text-[#023047]">Carlos Ramírez</p>
                <p className="text-[10px] text-gray-400 font-medium italic">Evaluación de Riesgo: 9.5/10</p>
            </div>
        </div>
      </div>
    </div>
  );
}
