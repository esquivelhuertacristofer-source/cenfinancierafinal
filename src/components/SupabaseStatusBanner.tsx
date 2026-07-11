'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CHECK_INTERVAL_MS = 15000;
const CHECK_TIMEOUT_MS = 4000;
const FAILURES_TO_ALERT = 2;

async function pingSupabase(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return true; // no se puede verificar, no bloquear la UI con una alarma falsa

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    // Verifica Auth y PostgREST (capa de datos) en paralelo — cualquiera de las dos
    // caído significa que el alumno/profesor no puede operar con normalidad.
    const [authRes, dataRes] = await Promise.all([
      fetch(`${url}/auth/v1/health`, { signal: controller.signal, cache: 'no-store', headers: { apikey: anonKey } }),
      fetch(`${url}/rest/v1/`, { signal: controller.signal, cache: 'no-store', headers: { apikey: anonKey } }),
    ]);
    return authRes.ok && dataRes.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

interface SupabaseStatusBannerProps {
  /** "guest": pre-login, ofrece Modo Práctica. "authenticated": ya hay sesión (alumno/profesor/admin), no aplica /practica. */
  variant?: 'guest' | 'authenticated';
}

export default function SupabaseStatusBanner({ variant = 'guest' }: SupabaseStatusBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let consecutiveFailures = 0;

    const check = async () => {
      const ok = await pingSupabase();
      if (cancelled) return;
      consecutiveFailures = ok ? 0 : consecutiveFailures + 1;
      if (consecutiveFailures >= FAILURES_TO_ALERT) {
        setShowBanner(true);
      } else if (ok) {
        setShowBanner(false);
      }
    };

    check();
    const intervalId = setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  if (!showBanner || dismissed) return null;

  return (
    <div
      role="status"
      className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-3 flex-wrap"
    >
      {variant === 'guest' ? (
        <>
          <span>⚠️ Estamos detectando una interrupción en el servicio de inicio de sesión.</span>
          <Link href="/practica" className="underline font-black hover:text-amber-700">
            Continúa en modo práctica sin conexión →
          </Link>
        </>
      ) : (
        <span>⚠️ Estamos detectando una interrupción con el servidor. Tu sesión sigue activa, pero es posible que tu progreso más reciente no se guarde hasta que el servicio se restablezca — no cierres esta pestaña, reintentaremos automáticamente.</span>
      )}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar aviso"
        className="ml-2 text-amber-700 hover:text-amber-900 font-black"
      >
        ✕
      </button>
    </div>
  );
}
