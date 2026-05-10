'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, X, Sparkles } from 'lucide-react';

interface Props {
  url: string;
  title: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function DiamondVideoPlayer({ url, title, onClose, isModal = false }: Props) {
  // Convertir URL de YouTube a embed si es necesario
  const getEmbedUrl = (videoUrl: string) => {
    if (videoUrl.includes('embed')) return videoUrl;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const content = (
    <div className={`relative w-full ${isModal ? 'max-w-5xl' : 'aspect-video'} bg-black rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/10 group`}>
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

      <iframe 
        src={getEmbedUrl(url)}
        title={title}
        className="w-full h-full aspect-video relative z-0"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

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
