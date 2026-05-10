/**
 * @project CEN - Nivel 4: Hora de Emprender (Bloque 1)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Segmento 4, Bloque 1 (Encuentra y Valida tu Idea de Negocio).
 */

import Link from "next/link";

export default function Segmento4Bloque1Page() {
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

      {/* 2. HERO DEL BLOQUE (Celeste a Blanco) */}
      <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#E0F2FE] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-sky-50 relative overflow-hidden mb-12">
          <span className="bg-[#0EA5E9] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md">
            Bloque 1
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0369A1] tracking-tighter mb-6">
            Encuentra y Valida tu <br/> Idea de Negocio
          </h1>
          <p className="text-[#0369A1]/80 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Todo gran proyecto comenzó con una chispa. Aprende a observar tu entorno, identificar problemas reales y convertirlos en oportunidades de negocio viables.
          </p>
        </div>

        <h3 className="text-[#0EA5E9] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
           <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Observación</span>
           <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Problema</span>
           <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Validación</span>
        </div>
      </section>

      {/* 3. ZONAS DE TRABAJO (Fondo Blanco Interactivo) */}
      <section className="w-full px-6 pb-20 flex flex-col items-center">
         
         {/* Formulario 1: Comienza Tu Aventura */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 drop-shadow-sm">Comienza Tu Aventura</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20 relative overflow-hidden">
            <div className="w-full h-8 bg-slate-50 border-b border-slate-100 absolute top-0 left-0 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
            <div className="pt-8 flex flex-col gap-6">
               <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-6 text-slate-300 font-bold text-sm">
                  [ Campo de texto: Escribe aquí tu idea principal... ]
               </div>
               <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-start p-6 text-slate-300 font-bold text-sm">
                  [ Área de texto: ¿Qué problema resuelve? ]
               </div>
               <button className="bg-[#0980E8] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors self-center mt-4">
                  Guardar Avance
               </button>
            </div>
         </div>

         {/* Formulario 2: Brújula Interna */}
         <h2 className="text-3xl md:text-4xl font-black text-[#0980E8] tracking-tighter mb-10 text-center">
            Descubre Tu Brújula <br/> Interna Del <br/> Emprendimiento
         </h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20">
            {/* Botones de cuadrante */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="h-16 bg-[#EF4444] rounded-2xl flex items-center justify-center text-white font-black shadow-md cursor-pointer hover:scale-105 transition-transform">Pasión</div>
               <div className="h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center text-white font-black shadow-md cursor-pointer hover:scale-105 transition-transform">Habilidad</div>
               <div className="h-16 bg-[#10B981] rounded-2xl flex items-center justify-center text-white font-black shadow-md cursor-pointer hover:scale-105 transition-transform">Mercado</div>
               <div className="h-16 bg-[#F59E0B] rounded-2xl flex items-center justify-center text-white font-black shadow-md cursor-pointer hover:scale-105 transition-transform">Rentabilidad</div>
            </div>
            {/* Resultados cuadrante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="w-1/3 h-2 bg-[#EF4444]/20 rounded-full"></div>
                  <div className="flex-1 border-t border-slate-200 border-dashed mt-2"></div>
               </div>
               <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="w-1/3 h-2 bg-[#3B82F6]/20 rounded-full"></div>
                  <div className="flex-1 border-t border-slate-200 border-dashed mt-2"></div>
               </div>
               <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="w-1/3 h-2 bg-[#10B981]/20 rounded-full"></div>
                  <div className="flex-1 border-t border-slate-200 border-dashed mt-2"></div>
               </div>
               <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="w-1/3 h-2 bg-[#F59E0B]/20 rounded-full"></div>
                  <div className="flex-1 border-t border-slate-200 border-dashed mt-2"></div>
               </div>
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

         {/* Workbook: El Kit del Detective */}
         <h3 className="text-3xl font-black text-white tracking-tighter mb-8 text-center">El Kit Del Detective</h3>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-2xl mb-24 relative overflow-hidden">
            <div className="w-full h-8 bg-slate-50 border-b border-slate-100 absolute top-0 left-0 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
            <div className="pt-8 flex flex-col gap-4">
               {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-6 text-slate-300 font-bold text-xs">
                     [ Pregunta de validación de mercado {item} ]
                  </div>
               ))}
               <button className="bg-[#0980E8] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors self-center mt-6">
                  Evaluar Respuestas
               </button>
            </div>
         </div>

         {/* Workbook: Califica tus Ideas */}
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-10 shadow-2xl mb-24 relative overflow-hidden">
            <h3 className="text-xl font-black text-[#011C40] tracking-tighter mb-6 text-center">Califica Tus Dos Ideas a <br/> Proyectar</h3>
            <div className="flex flex-col gap-8">
               {/* Idea 1 */}
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-[#0980E8] mb-4 text-sm uppercase tracking-widest">Idea 1</h4>
                  <div className="h-2 bg-slate-200 rounded-full w-full relative mb-4">
                     <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-6 h-6 bg-white border-4 border-[#0980E8] rounded-full shadow-md cursor-pointer"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full w-full relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-2/3 w-6 h-6 bg-white border-4 border-[#0980E8] rounded-full shadow-md cursor-pointer"></div>
                  </div>
               </div>
               {/* Idea 2 */}
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-[#0980E8] mb-4 text-sm uppercase tracking-widest">Idea 2</h4>
                  <div className="h-2 bg-slate-200 rounded-full w-full relative mb-4">
                     <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-6 h-6 bg-white border-4 border-[#0980E8] rounded-full shadow-md cursor-pointer"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full w-full relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-3/4 w-6 h-6 bg-white border-4 border-[#0980E8] rounded-full shadow-md cursor-pointer"></div>
                  </div>
               </div>
               <button className="bg-[#0980E8] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors self-center">
                  Calcular Viabilidad
               </button>
            </div>
         </div>

         {/* Workbook: Lienzo Modelo de Negocios */}
         <div className="w-full max-w-4xl bg-white rounded-[3rem] p-10 shadow-2xl mb-20 relative overflow-hidden">
            <h3 className="text-xl font-black text-[#011C40] tracking-tighter mb-8 text-center uppercase tracking-widest">Lienzo Modelo De <br/> Negocio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
               {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                     <div className="w-1/2 h-2 bg-[#10B981]/20 rounded-full mb-2"></div>
                     <div className="flex-1 border-t border-slate-200 border-dashed"></div>
                     <div className="flex-1 border-t border-slate-200 border-dashed"></div>
                  </div>
               ))}
            </div>
            <div className="w-full flex justify-center">
               <button className="bg-[#10B981] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-green-500/30 hover:scale-105 transition-transform">
                  Guardar Lienzo
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
            <Link href="/academia/hora-de-emprender/bloque2">
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