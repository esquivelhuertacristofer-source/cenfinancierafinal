import { supabase } from "../../../lib/supabase"; 
import Link from "next/link";

export default async function SegmentoPage({ params }: { params: Promise<{ segmentoId: string }> }) {
  const { segmentoId } = await params;
  const { data: lecciones } = await supabase.from('lecciones').select('*').eq('segmento_id', segmentoId).order('orden');

  return (
    <main className="min-h-screen bg-white p-16 font-epilogue">
      <h1 className="text-4xl font-black text-[#0980E8] mb-12 uppercase tracking-tighter">Plan de Estudio</h1>
      <div className="grid gap-4">
        {lecciones?.map((leccion) => (
          <Link key={leccion.id} href={`/academia/${segmentoId}/${leccion.id}`}>
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-[#0980E8] transition-all cursor-pointer group shadow-sm">
              <h3 className="text-2xl font-bold text-cen-azul group-hover:text-[#0980E8]">{leccion.titulo}</h3>
              <p className="text-slate-400 font-black text-[10px] uppercase mt-4">Comenzar lección →</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}