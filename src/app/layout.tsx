import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  metadataBase: new URL('https://www.cenplataformaeducacionfinanciera.com.mx'),
  title: "CEN | Plataforma de Educación Financiera",
  description: "Plataforma educativa líder en inteligencia financiera para niños y jóvenes de 6 a 15 años. Misiones, simuladores y actividades diseñadas por edades.",
  keywords: ["educación financiera", "finanzas para niños", "finanzas para jóvenes", "CEN", "educación primaria", "educación secundaria", "México"],
  // Las imágenes de metadata viven en public/ y se declaran aquí de forma
  // explícita. Como archivos-convención en src/app (opengraph-image.png, etc.)
  // Next las compilaba a rutas con el binario incrustado en base64 dentro del
  // Worker: ~1.6 MiB gzip, la mitad del límite de 3 MiB del plan free.
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: "CEN | Plataforma de Educación Financiera",
    description: "Educación financiera práctica para escuelas de México. Misiones, simuladores y actividades para primaria y secundaria.",
    url: "https://www.cenplataformaeducacionfinanciera.com.mx",
    siteName: "CEN Plataforma",
    locale: "es_MX",
    type: "website",
    images: [{ url: '/og-image.png', width: 2560, height: 1305 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CEN | Plataforma de Educación Financiera",
    description: "Educación financiera para niños y jóvenes de México.",
    images: ['/og-image.png'],
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

// The nonce for CSP is generated per-request in middleware.ts and set as the
// x-nonce request header. Next.js App Router reads it automatically and
// applies it to its own hydration <script> tags, so the layout does not
// need to read or forward it explicitly.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-epilogue antialiased">
        {children}
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
