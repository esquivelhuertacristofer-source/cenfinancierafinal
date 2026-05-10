"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { TEST_ACCOUNTS } from "../../lib/hub";

/**
 * @component LoginPage
 * @description User authentication page with premium Diamond State aesthetic
 */
export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Only redirect if already logged in
        async function checkSession() {
            const { data } = await supabase.auth.getSession();
            if (data.session) router.replace("/hub");
        }
        checkSession();
    }, [router]);

    const handleSignIn = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        
        if (!email || !password) {
            setError("Por favor, introduce tu correo y contraseña.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const rescue = setTimeout(() => {
                setLoading(false);
                setError("La conexión está tardando más de lo normal. Prueba con el acceso de invitado o verifica tu red.");
            }, 8000);

            // ─── VIRTUAL ACCOUNTS BYPASS (development only) ───
            if (process.env.NODE_ENV === 'development' && password === "diamondmaster" && TEST_ACCOUNTS[email]) {
                localStorage.setItem('cen_test_profile', JSON.stringify(TEST_ACCOUNTS[email]));
                window.location.href = "/hub";
                return;
            }

            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            clearTimeout(rescue);

            if (authError) {
                setError(authError.message === "Invalid login credentials" ? "Credenciales incorrectas" : authError.message);
                setLoading(false);
                return;
            }

            // Clear any previous test profile on real successful login
            localStorage.removeItem('cen_test_profile');

            window.location.href = "/hub";
        } catch (err: any) {
            setError("Error inesperado: " + (err.message || "Error de conexión"));
            setLoading(false);
        }
        return;
    }, [email, password, router]);

    return (
        <div className="min-h-screen w-full flex bg-[#F8F9FB] font-epilogue">
            {/* LEFT SIDE: Branding & Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#011C40] to-[#011126] overflow-hidden flex-col justify-between p-12 lg:p-16">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-[#FF8C00]/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-[#00F0FF]/10 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Logo & Header */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <span className="text-[#011C40] font-black text-2xl tracking-tighter">C</span>
                        </div>
                        <span className="text-white font-black tracking-widest text-xl opacity-90">CEN</span>
                    </Link>
                </div>

                {/* Center Content with 3D Illustration */}
                <div className="relative z-10 w-full max-w-lg mx-auto mt-12">
                    <div className="relative w-full h-[380px] mb-8 animate-[float_6s_ease-in-out_infinite]">
                        <Image 
                            src="/assets/landing-v3/helper.png" 
                            alt="CEN Helper" 
                            fill 
                            className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]" 
                        />
                    </div>
                    <h2 className="text-[40px] xl:text-[48px] font-black text-white leading-[1.1] mb-6 tracking-tight">
                        Desbloquea tu potencial <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FFB057]">financiero.</span>
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed font-medium max-w-md">
                        Accede a tu cuenta para continuar tus misiones, revisar tu progreso y dominar el juego del dinero.
                    </p>
                </div>
                
                {/* Footer */}
                <div className="relative z-10 text-white/30 text-sm font-semibold tracking-wide">
                    © 2026 CEN • EDICIÓN PLATINUM
                </div>
            </div>

            {/* RIGHT SIDE: Premium Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white selection:bg-[#FF8C00] selection:text-white">
                <div className="w-full max-w-[440px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-12 flex justify-center">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#011C40] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-2xl tracking-tighter">C</span>
                            </div>
                            <span className="text-[#011C40] font-black tracking-widest text-xl">CEN</span>
                        </Link>
                    </div>

                    <div className="mb-10 lg:mb-12">
                        <h1 className="text-[36px] font-black text-[#011C40] tracking-tight mb-3">Iniciar Sesión</h1>
                        <p className="text-[#64748B] text-lg font-medium">Bienvenido de vuelta, ingresa tus credenciales.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 font-bold text-sm flex items-start gap-3 animate-[slideDown_0.3s_ease-out]">
                            <i className="fas fa-exclamation-circle text-xl mt-0.5 opacity-80"></i>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="flex flex-col gap-6">
                        <div className="group">
                            <label className="block text-[#011C40] font-bold text-xs uppercase tracking-[0.15em] mb-2 ml-1 transition-colors group-focus-within:text-[#FF8C00]">
                                Correo Institucional
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8] group-focus-within:text-[#FF8C00] transition-colors">
                                    <i className="fas fa-envelope text-lg"></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-5 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#FF8C00] focus:bg-white rounded-2xl outline-none transition-all font-semibold text-[#011C40] placeholder-[#94A3B8] focus:shadow-[0_0_0_4px_rgba(255,140,0,0.1)] text-base"
                                    placeholder="ejemplo@escuela.edu"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-[#011C40] font-bold text-xs uppercase tracking-[0.15em] transition-colors group-focus-within:text-[#FF8C00]">
                                    Contraseña
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8] group-focus-within:text-[#FF8C00] transition-colors">
                                    <i className="fas fa-lock text-lg"></i>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-5 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#FF8C00] focus:bg-white rounded-2xl outline-none transition-all font-semibold text-[#011C40] placeholder-[#94A3B8] focus:shadow-[0_0_0_4px_rgba(255,140,0,0.1)] text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-[#011C40] text-white py-5 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(1,28,64,0.15)] hover:shadow-[0_15px_35px_rgba(1,28,64,0.25)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 group overflow-hidden relative"
                        >
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                            
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin text-[#FF8C00]"></i> Validando acceso...
                                    </>
                                ) : (
                                    <>
                                        Acceder al Portal <i className="fas fa-arrow-right text-[#FF8C00] group-hover:translate-x-1.5 transition-transform"></i>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-[#E2E8F0] text-center space-y-6">
                        <button 
                            onClick={() => window.location.href = "/hub"}
                            className="w-full py-4 bg-[#F8FAFC] text-[#64748B] rounded-2xl font-bold text-sm border-2 border-transparent hover:border-[#FF8C00] hover:text-[#FF8C00] transition-all flex items-center justify-center gap-2 group"
                        >
                            Acceder como Invitado <i className="fas fa-user-ninja opacity-50 group-hover:opacity-100"></i>
                        </button>
                        
                        <p className="text-sm font-semibold text-[#64748B]">
                            ¿No tienes cuenta? <Link href="/#niveles" className="text-[#FF8C00] font-bold hover:underline">Explora nuestros niveles</Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
