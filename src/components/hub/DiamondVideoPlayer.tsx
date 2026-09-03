'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import VideoFrame from './VideoFrame';

interface Props {
  url: string;
  title: string;
  onClose?: () => void;
  isModal?: boolean;
  /** Miniatura del segundo 1, solo para los videos propios servidos desde R2. */
  poster?: string;
}

/* OJO: hoy ningun archivo importa este componente. Lo estuvo importando `ContentModal.tsx`, pero
   sin renderizarlo nunca, asi que los arreglos que se le hacian no llegaban a ninguna pantalla. Se
   deja porque su marco —el rotulo "Expert Class Diamond", el titulo sobreimpreso, el modal con
   animacion— es diseno que puede querer reusarse, y ya delega la decision de <video> vs <iframe> en
   VideoFrame, asi que no puede desincronizarse. Si se decide que no se va a usar, se borra entero:
   no hay control de versiones en esta carpeta, asi que borrar es definitivo. */
export default function DiamondVideoPlayer({ url, title, onClose, isModal = false, poster }: Props) {

  const content = (
    <div className={`relative w-full ${isModal ? 'max-w-5xl' : 'aspect-video'} bg-black rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/10 group`}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
      
      {isModal && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-4 bg-black/40 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-md border border-white/10"
        >
          <X size={24} />
        </button>
      )}

      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <div className="p-2 bg-[#FF8C00] rounded-xl text-black">
          <Sparkles size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white drop-shadow-lg italic">Expert Class Diamond</span>
      </div>

      <VideoFrame url={url} title={title} poster={poster} className="w-full h-full aspect-video relative z-0" />

      <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
        <h4 className="text-2xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl">{title}</h4>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[5000] bg-[#0A0118]/90 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full flex justify-center"
        >
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return content;
}
