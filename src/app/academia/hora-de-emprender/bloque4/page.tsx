/**
 * @project CEN - Nivel 4: Hora de Emprender (Bloque 4)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Segmento 4, Bloque 4 (La Sala de Máquinas).
 */

import Link from "next/link";

export default function Segmento4Bloque4Page() {
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

      {/* 2. HERO DEL BLOQUE (Azul Sólido Corporativo) */}
      <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] w-full rounded-[4.5rem] p-12 md:p-16 shadow-2xl shadow-blue-500/20 relative overflow-hidden mb-12">
          <span className="bg-white/20 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-sm backdrop-blur-sm border border-white/30">
            Bloque 4
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 drop-shadow-md">
            La Sala de Máquinas
          </h1>
          <p className="text-white/90 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Bienvenidos a la sala de máquinas de tu emprendimiento. Puede que no sea la parte más glamurosa, pero es sin duda la más importante. Un motor bien afinado es lo que permite que el vehículo avance.
            <br/><br/>
            En este módulo, no hablaremos de ideas, sino de procesos. Diseñaremos el sistema que te permitirá entregar tu producto o servicio de manera eficiente y profesional, asegurando que cada cliente tenga una experiencia constante desde que te descubre hasta que recibe su compra y más allá.
          </p>
        </div>

        <h3 className="text-[#0980E8] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
           <span className="bg-white text-[#0980E8] border-2 border-[#E0F2FE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">Los Procesos</span>
           <span className="bg-white text-[#0980E8] border-2 border-[#E0F2FE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Logística</span>
           <span className="bg-white text-[#0980E8] border-2 border-[#E0F2FE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Servicio</span>
        </div>
      </section>

      {/* 3. ZONAS DE TRABAJO (Fondo Blanco Interactivo) */}
      <section className="w-full px-6 pb-20 flex flex-col items-center">
         
         {/* Workbook 1: Mapea el Viaje de tu Cliente */}
         <h2 className="text-3xl md:text-4xl font-black text-[#0980E8] tracking-tighter mb-8 text-center drop-shadow-sm">
            Mapea el Viaje de tu <br/> Cliente
         </h2>
         <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20 relative overflow-hidden">
            <h3 className="text-[#011C40] font-black text-sm uppercase tracking-widest mb-8 text-center border-b border-slate-100 pb-4">Manual de Operaciones</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               {/* Paso 1 */}
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-[#0980E8] transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8]"></div>
                  <div className="w-8 h-8 bg-[#E0F2FE] text-[#0980E8] rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-sm">1</div>
                  <span className="font-black text-[#011C40] text-sm uppercase">Descubrimiento</span>
                  <div className="h-12 bg-white border border-slate-200 rounded-xl mt-2 px-3 flex items-center text-slate-300 text-xs font-bold">Describe el proceso...</div>
               </div>
               {/* Paso 2 */}
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-[#0980E8] transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8]"></div>
                  <div className="w-8 h-8 bg-[#E0F2FE] text-[#0980E8] rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-sm">2</div>
                  <span className="font-black text-[#011C40] text-sm uppercase">Consideración</span>
                  <div className="h-12 bg-white border border-slate-200 rounded-xl mt-2 px-3 flex items-center text-slate-300 text-xs font-bold">Describe el proceso...</div>
               </div>
               {/* Paso 3 */}
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-[#0980E8] transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8]"></div>
                  <div className="w-8 h-8 bg-[#E0F2FE] text-[#0980E8] rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-sm">3</div>
                  <span className="font-black text-[#011C40] text-sm uppercase">Compra</span>
                  <div className="h-12 bg-white border border-slate-200 rounded-xl mt-2 px-3 flex items-center text-slate-300 text-xs font-bold">Describe el proceso...</div>
               </div>
               {/* Paso 4 */}
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-[#0980E8] transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8]"></div>
                  <div className="w-8 h-8 bg-[#E0F2FE] text-[#0980E8] rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-sm">4</div>
                  <span className="font-black text-[#011C40] text-sm uppercase">Entrega / Servicio</span>
                  <div className="h-12 bg-white border border-slate-200 rounded-xl mt-2 px-3 flex items-center text-slate-300 text-xs font-bold">Describe el proceso...</div>
               </div>
               {/* Paso 5 */}
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-[#0980E8] transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8]"></div>
                  <div className="w-8 h-8 bg-[#E0F2FE] text-[#0980E8] rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-sm">5</div>
                  <span className="font-black text-[#011C40] text-sm uppercase">Post-Venta</span>
                  <div className="h-12 bg-white border border-slate-200 rounded-xl mt-2 px-3 flex items-center text-slate-300 text-xs font-bold">Describe el proceso...</div>
               </div>
               {/* Paso 6 */}
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:border-[#0980E8] transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8]"></div>
                  <div className="w-8 h-8 bg-[#E0F2FE] text-[#0980E8] rounded-full flex items-center justify-center font-black text-xs mb-2 shadow-sm">6</div>
                  <span className="font-black text-[#011C40] text-sm uppercase">Fidelización</span>
                  <div className="h-12 bg-white border border-slate-200 rounded-xl mt-2 px-3 flex items-center text-slate-300 text-xs font-bold">Describe el proceso...</div>
               </div>
            </div>

            <div className="w-full flex justify-center">
               <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors">
                  Guardar Mapa
               </button>
            </div>
         </div>

         {/* Formulario 2: Elige Tu Sala De Maquinas */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 text-center drop-shadow-sm">Elige Tu Sala De Maquinas</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-16">
            <h3 className="text-[#011C40] font-black text-sm uppercase tracking-widest mb-2 text-center">Tu Plan de Operaciones</h3>
            <p className="text-slate-400 font-bold text-xs text-center mb-8">Elige el enfoque principal para estructurar los costos y tiempos de tu negocio.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col items-center text-center p-8 bg-slate-50 border-2 border-slate-200 rounded-3xl cursor-pointer hover:border-[#0980E8] transition-all group">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                  <span className="font-black text-[#011C40] text-sm uppercase mb-2">Logística</span>
                  <span className="text-slate-500 text-xs font-bold">Enfoque en inventario, envíos y cadena de suministro físico.</span>
               </div>
               <div className="flex flex-col items-center text-center p-8 bg-slate-50 border-2 border-slate-200 rounded-3xl cursor-pointer hover:border-[#0980E8] transition-all group">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                  <span className="font-black text-[#011C40] text-sm uppercase mb-2">Operaciones</span>
                  <span className="text-slate-500 text-xs font-bold">Enfoque en prestación de servicios, tiempos y herramientas.</span>
               </div>
            </div>
         </div>

         {/* Transición al Video */}
         <h2 className="text-3xl md:text-4xl font-black text-[#0980E8] tracking-tighter mt-12 mb-8 text-center drop-shadow-sm">
            Es Momento Del Gran <br/> Lanzamiento
         </h2>
      </section>

      {/* 4. ZONA INMERSIVA (Fondo Azul Institucional #0980E8) */}
      <section className="w-full bg-[#0980E8] pt-20 pb-32 px-6 flex flex-col items-center">
         
         {/* Video Section */}
         <h2 className="text-4xl font-black text-white tracking-tighter mb-10 drop-shadow-md text-center">
            ¡Nuestra Aventura en <br/> Video!
         </h2>
         <div className="w-full max-w-4xl aspect-video bg-slate-100 rounded-[4.5rem] shadow-2xl overflow-hidden flex items-center justify-center border-8 border-white/20 relative mb-16">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <div className="w-20 h-20 bg-[#FFCA28] rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 mb-4 pl-2 cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent"></div>
               </div>
               <span className="text-slate-400 font-black tracking-widest uppercase text-xs">Reproductor de Video CEN</span>
            </div>
         </div>

         {/* NAVEGACIÓN HACIA EL BLOQUE 5 (EL GRAN FINAL) */}
         <div className="flex flex-col md:flex-row gap-6 w-full justify-center max-w-3xl mt-8">
            <Link href="/academia/hora-de-emprender">
               <button className="w-full md:w-auto bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0980E8] transition-colors">
                 Volver al Temario
               </button>
            </Link>
            <Link href="/academia/hora-de-emprender/bloque5">
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