'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CEN Dashboard Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] font-epilogue p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
          <AlertTriangle size={40} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Error en el Dashboard</h1>
          <p className="text-slate-400 text-base">
            Ocurrió un problema al cargar los datos. Por favor reintenta.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 text-white font-black hover:bg-slate-700 transition-all"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
          <a
            href="/log-in"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
          >
            <LogIn size={16} />
            Iniciar sesión
          </a>
        </div>
      </div>
    </div>
  );
}
