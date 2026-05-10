"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ProgressRing from '../ui/ProgressRing';
import type { PillarMeta } from '../../lib/hub';

interface PillarCardProps {
  pillar: PillarMeta;
  done: number;
  total: number;
  pct: number;
}

export default function PillarCard({ pillar, done, total, pct }: PillarCardProps) {
  const isComplete = done === total && total > 0;
  const isStarted  = done > 0 && !isComplete;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [auraPos, setAuraPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 1000;
    const rotateY = (centerX - x) / 1000;
    setTilt({ x: rotateX, y: rotateY });
    setAuraPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Link
      href={`/hub/${pillar.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform: `perspective(2000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-[2.5rem] min-h-[350px] shadow-lg hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-500 ${
        isComplete ? 'ring-2 ring-emerald-400 ring-offset-2' : ''
      }`}
    >
      {/* MOUSE AURA (FLARE) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{ 
          background: `radial-gradient(circle at ${auraPos.x}% ${auraPos.y}%, rgba(255,255,255,0.2) 0%, transparent 60%)`
        }}
      />
      {/* Full-card gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} transition-transform duration-700 group-hover:scale-105`} />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />

      {/* Glow circles */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-2xl" />

      {/* Emoji centered in card body */}
      <div className="absolute inset-0 flex items-center justify-center pb-24">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2rem] bg-white/15 backdrop-blur-sm flex items-center justify-center text-6xl shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-white/20">
            {pillar.icon}
          </div>
          {/* Progress ring over emoji */}
          <div className="absolute -top-3 -right-3">
            <div className="relative flex items-center justify-center">
              <ProgressRing pct={pct} size={40} stroke={3.5} color="white" trackColor="rgba(255,255,255,0.25)" />
              <span className="absolute text-[9px] font-black text-white leading-none">{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay + content */}
      <div className="relative z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 pt-12 pb-6 flex flex-col gap-3">

        {/* Title */}
        <div>
          <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5">Módulo</p>
          <h3 className="text-white font-black text-2xl leading-tight tracking-tight">
            {pillar.shortTitle}
          </h3>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-white/60 text-[10px] font-bold">{done} de {total} unidades</span>
            {isComplete && (
              <span className="text-emerald-300 text-[10px] font-black uppercase tracking-wider">✓ Completado</span>
            )}
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className={`w-full py-3 rounded-2xl text-center text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
          isComplete
            ? 'bg-emerald-400 text-emerald-900'
            : isStarted
            ? 'bg-white text-[#011C40] group-hover:bg-[#FF8C00] group-hover:text-white'
            : 'bg-white/20 text-white/80 backdrop-blur-sm border border-white/20 group-hover:bg-white/30'
        }`}>
          {isComplete ? '✓ Completado' : isStarted ? 'Continuar →' : 'Comenzar →'}
        </div>
      </div>
    </Link>
  );
}
