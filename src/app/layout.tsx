import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "sonner";

export const metadata = {
  title: "CEN | Plataforma de Educación Financiera",
  description: "Plataforma educativa líder en inteligencia financiera para niños y jóvenes de 6 a 15 años. Misiones, simuladores y actividades diseñadas por edades.",
  keywords: ["educación financiera", "finanzas para niños", "finanzas para jóvenes", "CEN", "educación primaria", "educación secundaria", "México"],
  openGraph: {
    title: "CEN | Plataforma de Educación Financiera",
    description: "Educación financiera práctica para escuelas de México. Misiones, simuladores y actividades para primaria y secundaria.",
    url: "https://www.cenplataformaeducacionfinanciera.com.mx",
    siteName: "CEN Plataforma",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CEN | Plataforma de Educación Financiera",
    description: "Educación financiera para niños y jóvenes de México.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0A0118',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-epilogue antialiased">
        {children}
        <Analytics />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: "var(--font-sans)", fontSize: "14px" },
            classNames: { toast: "rounded-2xl border border-white/10 shadow-xl" },
          }}
        />
      </body>
    </html>
  );
}
