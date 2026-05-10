'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CEN Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0118] text-white p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle size={40} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black mb-2">Algo salió mal</h1>
          <p className="text-white/50 text-base">
            Ocurrió un error inesperado. Tu progreso está guardado en la nube.
          </p>
          {error.digest && (
            <p className="text-white/20 text-xs mt-2 font-mono">ID: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF8C00] text-black font-black hover:bg-[#FF8C00]/90 transition-all"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
          <a
            href="/hub"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/15 transition-all"
          >
            <Home size={16} />
            Inicio
          </a>
        </div>
      </div>
    </div>
  );
}
