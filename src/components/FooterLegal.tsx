'use client';

import Link from 'next/link';

export default function FooterLegal() {
  return (
    <footer className="w-full border-t border-[#E2E8F0] bg-white py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#94A3B8] font-medium">
        <span>© 2026 CEN — Centro de Educación Financiera</span>
        <div className="flex items-center gap-6">
          <Link href="/privacidad" className="hover:text-[#FF8C00] transition-colors">Aviso de Privacidad</Link>
          <Link href="/terminos" className="hover:text-[#FF8C00] transition-colors">Términos de Uso</Link>
        </div>
      </div>
    </footer>
  );
}
