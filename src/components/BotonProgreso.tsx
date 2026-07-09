"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * @interface ProgressButtonProps
 * @description Props for the ProgressButton component
 */
interface ProgressButtonProps {
    lessonId: string;
}

/**
 * @component ProgressButton
 * @description Completion button for the public "academia" demo page.
 * Purely local (localStorage) — this page is an unauthenticated marketing
 * clone, not part of the tracked /hub curriculum, so it does not write to Supabase.
 */
export default function ProgressButton({ lessonId }: ProgressButtonProps) {
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const storageKey = `academia_demo_progress_${lessonId}`;

    useEffect(() => {
        setIsCompleted(window.localStorage.getItem(storageKey) === "true");
        setLoading(false);
    }, [storageKey]);

    const handleComplete = useCallback((): void => {
        window.localStorage.setItem(storageKey, "true");
        setIsCompleted(true);
    }, [storageKey]);

    if (loading) return null;

    return (
        <div className="flex flex-col items-center justify-center p-4 font-epilogue my-12">
            {!isCompleted ? (
                <button
                    onClick={handleComplete}
                    className="relative bg-gradient-to-br from-[#FF9500] to-[#FF5E00] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-[0_6px_15px_rgba(255,94,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,94,0,0.4)] transition-all overflow-hidden group"
                >
                    <span className="absolute inset-0 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)] scale-0 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></span>
                    Finalizar este bloque
                </button>
            ) : (
                <div className="flex items-center gap-4 mt-4 px-8 py-5 bg-white/90 border border-green-600/20 rounded-2xl shadow-lg animate-[slideIn_0.4s_ease-out]">
                    <div className="bg-[#16A34A] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                        ✓
                    </div>
                    <div className="text-left">
                        <p className="m-0 text-[#14532D] font-black text-sm uppercase tracking-widest">¡Progreso Registrado!</p>
                        <p className="m-0 text-[#15803D] font-bold text-xs opacity-80">Guardado en este dispositivo.</p>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
