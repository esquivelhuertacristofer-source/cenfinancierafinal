'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function AcademiaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CEN Academia Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-epilogue p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#0980E8]/10 border border-[#0980E8]/20 flex items-center justify-center mx-auto">
          <AlertTriangle size={40} className="text-[#0980E8]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#011C40] mb-2">Error al cargar la lección</h1>
          <p className="text-slate-400 text-base">
            No pudimos cargar el contenido. Tu progreso está a salvo.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0980E8] text-white font-black hover:bg-[#0980E8]/90 transition-all"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
          <a
            href="/hub"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
          >
            <Home size={16} />
            Mi Hub
          </a>
        </div>
      </div>
    </div>
  );
}
