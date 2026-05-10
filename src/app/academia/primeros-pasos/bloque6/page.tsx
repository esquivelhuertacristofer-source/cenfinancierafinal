/**
 * @project CEN - Nivel 3: Lección Individual (Bloque 6)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Bloque 6 (El Cofre de Imprevistos).
 */

import Link from "next/link";

export default function Bloque6Page() {
  return (
    <main className="min-h-screen bg-white font-epilogue overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md z-50 flex items-center justify-between px-8 md:px-20 border-b border-slate-100">
        <div className="text-3xl font-black text-[#0980E8] tracking-tighter">CEN</div>
        <div className="hidden md:flex gap-6 lg:gap-10 font-bold text-slate-400 text-[10px] lg:text-xs uppercase tracking-widest">
          <Link href="/" className="hover:text-[#0980E8] transition-colors">Inicio</Link>
          <Link href="/academia/primeros-pasos" className="hover:text-[#0980E8] transition-colors text-[#0980E8]">Primeros Pasos</Link>
          <Link href="#" className="hover:text-[#0980E8] transition-colors">Construyendo el Futuro</Link>
          <Link href="#" className="hover:text-[#0980E8] transition-colors">Planificación</Link>
          <Link href="#" className="hover:text-[#0980E8] transition-colors">Hora de Emprender</Link>
        </div>
        <Link href="/log-in">
          <button className="bg-[#22D3EE] text-white px-8 py-3 rounded-full font-black shadow-lg shadow-cyan-200/50 hover:scale-105 transition-all uppercase text-xs">
            Iniciar Sesión
          </button>
        </Link>
      </nav>

      {/* 2. HERO DEL BLOQUE (Naranja Suave / Durazno) */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#FFDED2] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-orange-50 relative overflow-hidden mb-12">
          <span className="bg-[#FF9D5C] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md">
            Bloque 6
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0980E8] tracking-tighter mb-6">
            El Cofre de Imprevistos
          </h1>
          <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Aprende por qué es tan importante estar preparados para las sorpresas. Descubre con CENy cómo un fondo de emergencia te da tranquilidad ante lo inesperado.
          </p>
        </div>

        <h3 className="text-[#0980E8] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Prevención</span>
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Ahorro</span>
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">La Tranquilidad</span>
        </div>
      </section>

      {/* 3. SECCIÓN DEL VIDEO LARGO */}
      <section className="max-w-6xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-4xl font-black text-[#0980E8] tracking-tighter mb-10 drop-shadow-sm">
          ¡Nuestra Aventura en Video!
        </h2>
        <div className="w-full aspect-video bg-slate-100 rounded-[4.5rem] shadow-2xl overflow-hidden flex items-center justify-center border-8 border-slate-50 relative">
           <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="w-20 h-20 bg-[#FFCA28] rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 mb-4 pl-2 cursor-pointer hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent"></div>
              </div>
              <span className="text-slate-400 font-black tracking-widest uppercase text-xs">Reproductor de Video CEN</span>
           </div>
        </div>
      </section>

      {/* Subtítulo de transición */}
      <div className="w-full text-center pb-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-black text-[#0980E8] tracking-tighter leading-tight">
            ¡Nos vemos en el próximo <br/> video para una historia <br/> muy especial!
        </h2>
      </div>

      {/* 4. ZONA AMARILLA COMPLETA: JUEGOS, HISTORIA Y RECURSOS */}
      <section className="w-full bg-[#FFCA28] py-24 px-6 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
           
           {/* Juego 1 */}
           <div className="w-full bg-white rounded-[4.5rem] p-8 shadow-2xl hover:-translate-y-2 transition-transform border-4 border-white/50 mb-16">
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-2">Demuestra que tienes mentalidad previsora</h3>
              <p className="text-slate-500 font-bold text-sm mb-8">Relaciona los conceptos de la clase para proteger a CENy de los imprevistos.</p>
              
              <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-300 font-black text-xl mb-8 border-4 border-dashed border-slate-200">
                 [ JUEGO INTERACTIVO: RELACIONAR COLUMNAS ]
              </div>
              <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#011C40] transition-colors">
                Jugar Ahora
              </button>
           </div>

           {/* Juego 2 */}
           <div className="w-full bg-white rounded-[4.5rem] p-8 shadow-2xl mb-20 hover:-translate-y-2 transition-transform border-4 border-white/50">
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-2">Desafía Tu Conocimiento</h3>
              <p className="text-slate-500 font-bold text-sm mb-8">¿Qué hacer ante estas situaciones imprevistas?</p>
              
              <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-300 font-black text-xl mb-8 border-4 border-dashed border-slate-200">
                 [ QUIZ INTERACTIVO: CASOS PRÁCTICOS ]
              </div>
           </div>

           {/* Avatares / Recompensas */}
           <div className="flex justify-center gap-6 mb-24">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-24 h-32 bg-white/20 rounded-3xl border-2 border-white/40 flex flex-col items-center justify-center text-[#011C40] text-xs font-bold backdrop-blur-md shadow-xl hover:-translate-y-2 transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white mb-2 shadow-sm" />
                  Nivel {item}
                </div>
              ))}
           </div>

           {/* LA HISTORIA Y RECURSOS DEL BLOQUE */}
           <div className="w-full flex flex-col items-center">
              
              <h2 className="text-3xl md:text-4xl font-black text-[#011C40] tracking-tighter mb-8 drop-shadow-sm">
                 La Historia de La Cigarra y La Hormiga: <br/> <span className="text-white">Una lección para recordar</span>
              </h2>
              
              {/* Audio Player */}
              <div className="w-full max-w-2xl bg-white/30 backdrop-blur-md rounded-full p-4 flex items-center gap-4 border border-white/50 shadow-xl mb-20">
                 <div className="w-12 h-12 bg-[#011C40] rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                 </div>
                 <div className="flex-1 h-2 bg-white/40 rounded-full relative">
                    <div className="absolute top-0 left-0 h-full w-3/4 bg-[#011C40] rounded-full"></div>
                 </div>
                 <span className="text-[#011C40] font-black text-xs tracking-widest">06:20 / 08:00</span>
              </div>

              {/* Recursos de Descarga */}
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-8">Disfruta de los Juegos de Este Bloque</h3>
              <div className="w-48 h-48 bg-white/30 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-white/50 text-[#011C40]/50 font-black mb-12 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                 [ Descargar Juego ]
              </div>

              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-8">Consulta la guía para este Bloque</h3>
              <div className="w-48 h-48 bg-white/30 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-white/50 text-[#011C40]/50 font-black mb-10 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                 [ Descargar Guía ]
              </div>
           </div>
        </div>
      </section>

      {/* 5. PROYECTOS FINALES (Fondo Azul Institucional) */}
      <section className="w-full bg-[#0980E8] pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-black text-[#FFCA28] tracking-tighter mb-6 drop-shadow-lg">
              Es Hora de Convertir Tu <br/> Conocimiento en Tu <span className="text-white">Primer Activo</span>
            </h2>
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-12 max-w-lg">
              ¡Has prestado atención a la lección! Ahora es momento de descargar los proyectos, armar tu cofre y estar listo para cualquier imprevisto.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 w-full mb-16">
               <div className="bg-white rounded-[2.5rem] p-8 flex-1 shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer border-4 border-transparent hover:border-white/50">
                  <div className="w-16 h-16 bg-[#0980E8]/10 text-[#0980E8] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl">↓</div>
                  <h3 className="font-black text-[#011C40] mb-2 uppercase tracking-widest text-sm">Mi Cofre de Emergencias</h3>
               </div>
               <div className="bg-white rounded-[2.5rem] p-8 flex-1 shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer border-4 border-transparent hover:border-white/50">
                  <div className="w-16 h-16 bg-[#0980E8]/10 text-[#0980E8] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl">↓</div>
                  <h3 className="font-black text-[#011C40] mb-2 uppercase tracking-widest text-sm">Presupuesto Imprevisto</h3>
               </div>
            </div>

            {/* Navegación al Bloque 7 (EL GRAN FINAL DEL SEGMENTO) */}
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
               <Link href="/academia/primeros-pasos">
                 <button className="w-full md:w-auto bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0980E8] transition-colors">
                   Temario
                 </button>
               </Link>
               {/* Conectamos al Jefe Final: Bloque 7 */}
               <Link href="/academia/primeros-pasos/bloque7">
                 <button className="w-full md:w-auto bg-[#FFCA28] text-[#011C40] px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-transform">
                   Gran Final: Bloque 7 →
                 </button>
               </Link>
            </div>
        </div>
      </section>

      {/* 6. ACCESO A BIBLIOTECA (Footer adaptado con paleta cálida Naranja) */}
      <section className="w-full bg-gradient-to-br from-[#FFA726] to-[#FF9800] pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
           <div className="text-white md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                 Acceso a la <br/> <span className="text-[#011C40]/80">biblioteca</span>
              </h2>
              <p className="font-bold text-sm text-[#011C40]/70 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                 En CEN, creemos que el conocimiento es la herramienta más valiosa. Por eso, hemos creado esta biblioteca con una selección de recursos que te ayudarán a profundizar en tu aventura financiera.
              </p>
              <button className="bg-[#011C40] text-white px-8 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-all uppercase text-xs">
                 Accede Ahora
              </button>
           </div>
           <div className="md:w-1/2 flex justify-center">
              <div className="w-72 h-72 bg-[#F472B6] rounded-full flex items-center justify-center border-8 border-white/20 shadow-2xl relative">
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-white rounded-full blur-2xl opacity-40"/>
                 <span className="font-black text-white/50 text-xl">[ IMG Gráficos CENy ]</span>
              </div>
           </div>
        </div>
      </section>

    </main>
  );
}