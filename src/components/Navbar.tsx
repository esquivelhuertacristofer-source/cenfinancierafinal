"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface NavbarProps {
    activeSection?: string;
}

export default function Navbar({ activeSection = "inicio" }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-4" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-black tracking-tighter text-cen-blue">
                        CEN <span className="text-cen-cyan">EDUCACIÓN FINANCIERA</span>
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {[
                        { label: "Volver al Inicio", href: "/" },
                        { label: "Grados", href: "/#niveles" },
                        { label: "Aliados", href: "/#aliados" }
                    ].map((item) => (
                        <Link 
                            key={item.label} 
                            href={item.href}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-cen-blue transition-all"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="bg-cen-blue text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-cen-orange transition-all active:scale-95">
                        Salir
                    </Link>
                </div>
            </div>
        </nav>
    );
}
