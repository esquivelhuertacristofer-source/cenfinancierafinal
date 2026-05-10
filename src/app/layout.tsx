import "./globals.css";

export const metadata = {
  title: "CEN | Plataforma de Educación Financiera",
  description: "La plataforma educativa líder en inteligencia financiera para niños y jóvenes.",
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
      </body>
    </html>
  );
}
