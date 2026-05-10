/**
 * @project CEN - Plataforma de Educación Financiera
 * @version 3.5 (Agua High-Fidelity Integration)
 * @author Cristofer Huerta (Luminar Tech)
 */

import { supabase } from "../../../../lib/supabase"; 
import SecureGame from "../../../../components/SecureGame";
import { notFound } from "next/navigation";

export default async function BloquePage({ 
  params 
}: { 
  params: Promise<{ segmentoId: string, leccionId: string }> 
}) {
  const { leccionId } = await params;

  // 1. Obtenemos los bloques de contenido (juegos o fichas) vinculados a esta lección
  const { data: bloques } = await supabase
    .from('bloques_contenido')
    .select('*')
    .eq('leccion_id', leccionId)
    .order('orden', { ascending: true });

  // 2. Si no hay contenido cargado en Supabase, mostramos error 404 de Next.js
  if (!bloques || bloques.length === 0) return notFound();

  return (
    <main className="min-h-screen bg-white font-epilogue">
      {bloques.map((bloque) => (
        /* SECCIÓN AGUA: Fondo azul #0980E8 con scroll natural */
        <section 
          key={bloque.id} 
          className="bg-[#0980E8] py-32 px-6 min-h-screen flex flex-col items-center justify-center border-b border-white/10"
        >
          {/* Cabecera del Bloque con tipografía Epilogue */}
          <div className="max-w-4xl text-center text-white mb-20">
            <h2 className="text-6xl font-black italic mb-6 tracking-tighter leading-none uppercase">
              {bloque.data?.titulo || "¡Desafío CEN!"}
            </h2>
            <p className="text-lg font-bold text-cen-amarillo uppercase tracking-[0.2em] mb-6">
              {bloque.data?.subtitulo || "Un Desafío de Reflejos"}
            </p>
            <p className="max-w-2xl mx-auto opacity-70 text-sm font-bold leading-relaxed uppercase">
              {bloque.data?.descripcion}
            </p>
          </div>

          {/* TARJETA DE CONTENIDO: Diseño de alta fidelidad con bordes de 4.5rem */}
          <div className="w-full max-w-5xl bg-white p-6 rounded-[4.5rem] shadow-2xl overflow-hidden">
            {bloque.tipo === 'juego_html' ? (
              /* Pasamos el código HTML del campo game_code inyectado vía SQL */
              <SecureGame 
                gameTitle={bloque.data?.titulo} 
                gameHtml={bloque.data?.game_code} 
              />
            ) : (
              <div className="p-32 text-center text-slate-300 italic font-black uppercase tracking-widest">
                Ficha Informativa - Próximamente
              </div>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}