/**
 * @project CEN - Nivel 4: Hora de Emprender (Bloque 3)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Segmento 4, Bloque 3 (El Megáfono - Crea tu Marca).
 */

import Link from "next/link";

export default function Segmento4Bloque3Page() {
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

      {/* 2. HERO DEL BLOQUE (Celeste/Azul Suave a Blanco) */}
      <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#E0F2FE] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-sky-50 relative overflow-hidden mb-12">
          <span className="bg-[#0EA5E9] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md">
            Bloque 3
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0369A1] tracking-tighter mb-6">
            El Megáfono - Crea tu Marca <br/> y Atrae a tus Primeros Fans
          </h1>
          <p className="text-[#0369A1]/80 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Tener un gran producto no sirve de nada si nadie lo conoce. Descubre cómo construir una identidad magnética, comunicar tu valor y hacer ruido en el mercado para atraer a tus primeros clientes.
          </p>
        </div>

        <h3 className="text-[#0EA5E9] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
           <span className="bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Identidad</span>
           <span className="bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Mensaje</span>
           <span className="bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Lanzamiento</span>
        </div>
      </section>

      {/* 3. ZONAS DE TRABAJO (Fondo Blanco Interactivo) */}
      <section className="w-full px-6 pb-20 flex flex-col items-center">
         
         {/* Formulario 1: Identidad de Marca */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 drop-shadow-sm text-center">Encuentra Tu Identidad De Marca</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20 relative overflow-hidden">
            <h3 className="text-[#011C40] font-black text-sm uppercase tracking-widest mb-6 text-center">Selecciona Tu Paleta y Estilo</h3>
            
            <div className="flex flex-col gap-8">
               {/* Paletas de Colores */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#0980E8] transition-colors">
                     <div className="flex w-full h-8 rounded-full overflow-hidden mb-2">
                        <div className="w-1/3 bg-[#0980E8]"></div>
                        <div className="w-1/3 bg-[#38BDF8]"></div>
                        <div className="w-1/3 bg-[#E0F2FE]"></div>
                     </div>
                     <span className="text-slate-400 font-bold text-xs text-center block">Profesional y Confiable</span>
                  </div>
                  <div className="border-2 border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-[#0980E8] transition-colors">
                     <div className="flex w-full h-8 rounded-full overflow-hidden mb-2">
                        <div className="w-1/3 bg-[#F43F5E]"></div>
                        <div className="w-1/3 bg-[#FBBF24]"></div>
                        <div className="w-1/3 bg-[#10B981]"></div>
                     </div>
                     <span className="text-slate-400 font-bold text-xs text-center block">Vibrante y Joven</span>
                  </div>
               </div>

               {/* Arquetipo */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer hover:bg-[#0980E8] hover:text-white transition-colors">El Sabio</div>
                  <div className="h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer hover:bg-[#0980E8] hover:text-white transition-colors">El Héroe</div>
                  <div className="h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer hover:bg-[#0980E8] hover:text-white transition-colors">El Amigo</div>
                  <div className="h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer hover:bg-[#0980E8] hover:text-white transition-colors">El Creador</div>
               </div>

               <button className="bg-[#0980E8] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors self-center mt-2">
                  Guardar Identidad
               </button>
            </div>
         </div>

         {/* Formulario 2: Comunicación */}
         <h2 className="text-3xl md:text-4xl font-black text-[#0980E8] tracking-tighter mb-8 text-center">La Comunicación De Tu Marca</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20">
            <div className="flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#0980E8] text-xs uppercase tracking-widest">El Problema que Resuelves</label>
                  <textarea placeholder="Ej. La gente no tiene tiempo para..." className="h-20 bg-slate-50 rounded-2xl border border-slate-200 p-4 font-bold text-slate-500 outline-none focus:border-[#0980E8] resize-none"></textarea>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#0980E8] text-xs uppercase tracking-widest">Tu Promesa de Valor</label>
                  <textarea placeholder="Ej. Nosotros te ayudamos a..." className="h-20 bg-slate-50 rounded-2xl border border-slate-200 p-4 font-bold text-slate-500 outline-none focus:border-[#0980E8] resize-none"></textarea>
               </div>
               <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#0980E8] text-xs uppercase tracking-widest">Llamado a la Acción (CTA)</label>
                  <input type="text" placeholder="Ej. ¡Compra hoy y recibe un 20% off!" className="h-14 bg-slate-50 rounded-2xl border border-slate-200 px-6 font-bold text-slate-500 outline-none focus:border-[#0980E8]" />
               </div>
               <button className="bg-[#0980E8] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors self-center mt-4">
                  Definir Mensaje
               </button>
            </div>
         </div>

         {/* Formulario 3: Planificador de Lanzamiento (Grid/Calendario) */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 text-center">Es Hora De Planificar Tu Lanzamiento</h2>
         <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-10 overflow-x-auto">
            <div className="min-w-[600px]">
               {/* Headers del planificador */}
               <div className="grid grid-cols-5 gap-2 mb-4">
                  {['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'].map((day) => (
                     <div key={day} className="bg-[#E0F2FE] text-[#0369A1] font-black text-xs text-center py-2 rounded-lg uppercase tracking-widest">{day}</div>
                  ))}
               </div>
               {/* Filas del planificador */}
               <div className="grid grid-cols-5 gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                     <div key={item} className="h-24 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-400 font-bold text-[10px]">
                        [ Acción ]
                     </div>
                  ))}
               </div>
               <div className="grid grid-cols-5 gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                     <div key={`b${item}`} className="h-24 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-400 font-bold text-[10px]">
                        [ Canal ]
                     </div>
                  ))}
               </div>
            </div>
            <div className="w-full flex justify-center">
               <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors">
                  Guardar Plan
               </button>
            </div>
         </div>
      </section>

      {/* 4. ZONA INMERSIVA (Fondo Azul Institucional #0980E8) */}
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

         {/* Workbook Final: Las Fases de Lanzamiento */}
         <div className="w-full max-w-4xl bg-white rounded-[3rem] p-10 shadow-2xl mb-20 relative overflow-hidden">
            <h3 className="text-xl font-black text-[#011C40] tracking-tighter mb-8 text-center uppercase tracking-widest border-b border-slate-100 pb-6">Las Fases De Tu Estrategia</h3>
            
            {/* 3 Columnas de colores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               {/* Columna Verde */}
               <div className="bg-slate-50 p-6 rounded-3xl border-t-8 border-[#10B981] shadow-sm flex flex-col gap-2 h-64">
                  <span className="text-[#10B981] font-black text-xs uppercase mb-4 text-center">Pre-Lanzamiento</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-2"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
               {/* Columna Amarilla */}
               <div className="bg-slate-50 p-6 rounded-3xl border-t-8 border-[#F59E0B] shadow-sm flex flex-col gap-2 h-64">
                  <span className="text-[#F59E0B] font-black text-xs uppercase mb-4 text-center">Día Cero</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-2"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
               {/* Columna Rosa/Roja */}
               <div className="bg-slate-50 p-6 rounded-3xl border-t-8 border-[#F43F5E] shadow-sm flex flex-col gap-2 h-64">
                  <span className="text-[#F43F5E] font-black text-xs uppercase mb-4 text-center">Mantenimiento</span>
                  <div className="w-full border-b border-slate-200 border-dashed mt-2"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
                  <div className="w-full border-b border-slate-200 border-dashed mt-4"></div>
               </div>
            </div>

            <div className="w-full flex justify-center mt-4">
               <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                  Exportar Estrategia
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
            <Link href="/academia/hora-de-emprender/bloque4">
               <button className="w-full md:w-auto bg-[#FFCA28] text-[#011C40] px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/30 hover:scale-105 transition-transform">
                 Siguiente Bloque →
               </button>
            </Link>
         </div>
      </section>

      {/* 5. ACCESO A BIBLIOTECA (Footer adaptado al fondo azul inmersivo) */}
      <section className="w-full bg-[#011C40] pt-16 pb-32 px-6 border-t border-white/10">
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