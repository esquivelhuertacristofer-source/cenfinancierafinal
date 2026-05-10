/**
 * @project CEN - Nivel 4: Hora de Emprender (Bloque 2)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Segmento 4, Bloque 2 (El Taller - Diseña tu Producto o Servicio).
 */

import Link from "next/link";

export default function Segmento4Bloque2Page() {
  return (
    <main className="min-h-screen bg-white font-epilogue overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md z-50 flex items-center justify-between px-8 md:px-20 border-b border-slate-100">
        <div className="text-3xl font-black text-[#0980E8] tracking-tighter">CEN</div>
        <div className="hidden md:flex gap-6 lg:gap-10 font-bold text-slate-400 text-[10px] lg:text-xs uppercase tracking-widest">
          <Link href="/" className="hover:text-[#0980E8] transition-colors">Inicio</Link>
          <Link href="/academia/primeros-pasos" className="hover:text-[#0980E8] transition-colors">Primeros Pasos</Link>
          <Link href="/academia/construyendo-independencia" className="hover:text-[#0980E8] transition-colors">Construyendo el Futuro</Link>
          <Link href="/academia/planificacion" className="hover:text-[#0980E8] transition-colors">Planificación</Link>
          <Link href="/academia/hora-de-emprender" className="hover:text-[#0980E8] transition-colors text-[#0980E8]">Hora de Emprender</Link>
        </div>
        <Link href="/log-in">
          <button className="bg-[#22D3EE] text-white px-8 py-3 rounded-full font-black shadow-lg shadow-cyan-200/50 hover:scale-105 transition-all uppercase text-xs">
            Iniciar Sesión
          </button>
        </Link>
      </nav>

      {/* 2. HERO DEL BLOQUE (Azul Suave a Blanco) */}
      <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#DBEAFE] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-blue-50 relative overflow-hidden mb-12">
          <span className="bg-[#3B82F6] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md">
            Bloque 2
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF] tracking-tighter mb-6">
            El Taller - Diseña tu <br/> Producto o Servicio
          </h1>
          <p className="text-[#1E40AF]/80 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Ya tienes la idea validada, ahora ponte el casco de ingeniero. Aprende a diseñar las características, los beneficios y lo que hará a tu oferta verdaderamente irresistible.
          </p>
        </div>

        <h3 className="text-[#3B82F6] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
           <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Producto</span>
           <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Servicio</span>
           <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Oferta</span>
        </div>
      </section>

      {/* 3. ZONAS DE TRABAJO (Fondo Blanco Interactivo) */}
      <section className="w-full px-6 pb-20 flex flex-col items-center">
         
         {/* Formulario 1: Vamos a Dar El Primer Paso */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 drop-shadow-sm text-center">Vamos A Dar El Primer Paso</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20">
            <h3 className="text-[#011C40] font-black text-lg mb-6">Define la naturaleza de tu solución:</h3>
            <div className="flex flex-col gap-4">
               <label className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-[#0980E8] transition-colors">
                  <input type="radio" name="solucion" className="w-5 h-5 accent-[#0980E8]" />
                  <span className="font-bold text-slate-500 text-sm">Resuelve un problema de la vida diaria ahorrando tiempo.</span>
               </label>
               <label className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-[#0980E8] transition-colors">
                  <input type="radio" name="solucion" className="w-5 h-5 accent-[#0980E8]" />
                  <span className="font-bold text-slate-500 text-sm">Mejora la experiencia de algo que ya existe haciéndolo más barato o premium.</span>
               </label>
               <label className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-[#0980E8] transition-colors">
                  <input type="radio" name="solucion" className="w-5 h-5 accent-[#0980E8]" />
                  <span className="font-bold text-slate-500 text-sm">Crea una experiencia de entretenimiento o educación completamente nueva.</span>
               </label>
            </div>
         </div>

         {/* Formulario 2: Elige Tu Ruta Preferida */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 text-center">Elige Tu Ruta Preferida</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-[#0980E8] cursor-pointer transition-all group">
                  <div className="w-16 h-16 bg-[#FCA5A5] rounded-2xl mb-4 flex items-center justify-center text-white font-black shadow-md group-hover:scale-110 transition-transform">P</div>
                  <span className="font-black text-[#011C40] text-sm">Producto Físico</span>
               </div>
               <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-[#0980E8] cursor-pointer transition-all group">
                  <div className="w-16 h-16 bg-[#FCD34D] rounded-2xl mb-4 flex items-center justify-center text-white font-black shadow-md group-hover:scale-110 transition-transform">S</div>
                  <span className="font-black text-[#011C40] text-sm">Servicio Local</span>
               </div>
               <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-[#0980E8] cursor-pointer transition-all group">
                  <div className="w-16 h-16 bg-[#60A5FA] rounded-2xl mb-4 flex items-center justify-center text-white font-black shadow-md group-hover:scale-110 transition-transform">D</div>
                  <span className="font-black text-[#011C40] text-sm">Producto Digital</span>
               </div>
            </div>
         </div>

         {/* Formulario 3: Construye Tu Oferta */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 text-center">Construye Tu Oferta</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-10">
            <div className="flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#011C40] text-xs uppercase tracking-widest">Nombre (Provisional) del Proyecto</label>
                  <input type="text" placeholder="Ej. Zapatos Súper Rápidos..." className="h-14 bg-slate-50 rounded-2xl border border-slate-200 px-6 font-bold text-slate-500 outline-none focus:border-[#0980E8]" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#011C40] text-xs uppercase tracking-widest">¿Qué incluye exactamente?</label>
                  <textarea placeholder="Describe los componentes de tu oferta..." className="h-24 bg-slate-50 rounded-2xl border border-slate-200 p-6 font-bold text-slate-500 outline-none focus:border-[#0980E8] resize-none"></textarea>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#011C40] text-xs uppercase tracking-widest">Beneficio Principal</label>
                  <input type="text" placeholder="El cliente logrará..." className="h-14 bg-slate-50 rounded-2xl border border-slate-200 px-6 font-bold text-slate-500 outline-none focus:border-[#0980E8]" />
               </div>
               <button className="bg-[#0980E8] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors self-center mt-4">
                  Guardar Oferta
               </button>
            </div>
         </div>
      </section>

      {/* 4. ZONA INMERSIVA (Fondo Azul Institucional) */}
      <section className="w-full bg-[#0980E8] pt-24 pb-32 px-6 flex flex-col items-center">
         
         {/* Video Section */}
         <h2 className="text-4xl font-black text-white tracking-tighter mb-10 drop-shadow-md">
            ¡Nuestra Aventura en Video!
         </h2>
         <div className="w-full max-w-4xl aspect-video bg-slate-100 rounded-[4.5rem] shadow-2xl overflow-hidden flex items-center justify-center border-8 border-white/20 relative mb-24">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <div className="w-20 h-20 bg-[#FFCA28] rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 mb-4 pl-2 cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent"></div>
               </div>
               <span className="text-slate-400 font-black tracking-widest uppercase text-xs">Reproductor de Video CEN</span>
            </div>
         </div>

         {/* Workbook Final: Ficha Técnica MVP */}
         <h3 className="text-3xl font-black text-white tracking-tighter mb-8 text-center">Dale Forma A Tu Idea</h3>
         <div className="w-full max-w-4xl bg-white rounded-[3rem] p-10 shadow-2xl mb-20 relative overflow-hidden">
            <h4 className="text-xl font-black text-[#011C40] tracking-tighter mb-8 text-center uppercase tracking-widest border-b border-slate-100 pb-6">Ficha Técnica MVP</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 h-40">
                  <span className="text-[#0980E8] font-black text-xs uppercase">Características Clave</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 h-40">
                  <span className="text-[#0980E8] font-black text-xs uppercase">Materiales / Insumos</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 h-40">
                  <span className="text-[#0980E8] font-black text-xs uppercase">Tiempo de Producción</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-2 h-40">
                  <span className="text-[#0980E8] font-black text-xs uppercase">Costo Estimado</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
            </div>
            <div className="w-full flex justify-center mt-8">
               <button className="bg-[#10B981] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-green-500/30 hover:scale-105 transition-transform">
                  Crear Ficha
               </button>
            </div>
         </div>

         {/* NAVEGACIÓN */}
         <div className="flex flex-col md:flex-row gap-6 w-full justify-center max-w-3xl mt-8">
            <Link href="/academia/hora-de-emprender">
               <button className="w-full md:w-auto bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0980E8] transition-colors">
                 Volver al Temario
               </button>
            </Link>
            <Link href="/academia/hora-de-emprender/bloque3">
               <button className="w-full md:w-auto bg-[#FFCA28] text-[#011C40] px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/30 hover:scale-105 transition-transform">
                 Siguiente Bloque →
               </button>
            </Link>
         </div>
      </section>

      {/* 5. ACCESO A BIBLIOTECA (Footer adaptado al fondo azul inmersivo) */}
      <section className="w-full bg-[#011C40] pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
           <div className="text-white md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                 Acceso a la <br/> <span className="text-white/50">biblioteca</span>
              </h2>
              <p className="font-bold text-sm text-white/70 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                 En CEN, creemos que el conocimiento es la herramienta más valiosa. Por eso, hemos creado esta biblioteca con una selección de recursos que te ayudarán a profundizar en tu aventura financiera.
              </p>
              <button className="bg-[#0980E8] text-white px-8 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-all uppercase text-xs">
                 Accede Ahora
              </button>
           </div>
           <div className="md:w-1/2 flex justify-center">
              <div className="w-72 h-72 bg-[#F472B6] rounded-full flex items-center justify-center border-8 border-white/10 shadow-2xl relative">
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FFCA28] rounded-full blur-2xl opacity-20"/>
                 <span className="font-black text-white/50 text-xl">[ IMG Gráficos CENy ]</span>
              </div>
           </div>
        </div>
      </section>

    </main>
  );
}