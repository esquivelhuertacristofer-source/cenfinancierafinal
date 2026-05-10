/**
 * @project CEN - Nivel 3: Construyendo Independencia (Bloque 1)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Segmento 2, Bloque 1 (Mi Ingreso-Mi Dinero Mi Plan).
 */

import Link from "next/link";

export default function Segmento2Bloque1Page() {
  return (
    <main className="min-h-screen bg-white font-epilogue overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md z-50 flex items-center justify-between px-8 md:px-20 border-b border-slate-100">
        <div className="text-3xl font-black text-[#0980E8] tracking-tighter">CEN</div>
        <div className="hidden md:flex gap-6 lg:gap-10 font-bold text-slate-400 text-[10px] lg:text-xs uppercase tracking-widest">
          <Link href="/" className="hover:text-[#0980E8] transition-colors">Inicio</Link>
          <Link href="/academia/primeros-pasos" className="hover:text-[#0980E8] transition-colors">Primeros Pasos</Link>
          <Link href="/academia/construyendo-independencia" className="hover:text-[#0980E8] transition-colors text-[#0980E8]">Construyendo el Futuro</Link>
          <Link href="#" className="hover:text-[#0980E8] transition-colors">Planificación</Link>
          <Link href="#" className="hover:text-[#0980E8] transition-colors">Hora de Emprender</Link>
        </div>
        <Link href="/log-in">
          <button className="bg-[#22D3EE] text-white px-8 py-3 rounded-full font-black shadow-lg shadow-cyan-200/50 hover:scale-105 transition-all uppercase text-xs">
            Iniciar Sesión
          </button>
        </Link>
      </nav>

      {/* 2. HERO DEL BLOQUE (Lila Suave a Blanco) */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#F3E8FF] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-purple-50 relative overflow-hidden mb-12">
          <span className="bg-[#A855F7] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md">
            Bloque 1
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#4C1D95] tracking-tighter mb-6">
            Mi Ingreso - Mi Dinero <br/> Mi Plan
          </h1>
          <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Da el primer paso hacia tu independencia. Aprende a registrar lo que ganas, controlar en qué lo gastas y crear un plan que te permita disfrutar hoy sin descuidar tu mañana.
          </p>
        </div>

        <h3 className="text-[#A855F7] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Ingreso</span>
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Presupuesto</span>
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Control</span>
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

      {/* 4. ZONA VIOLETA VIBRANTE: JUEGOS Y RECURSOS */}
      <section className="w-full bg-[#C084FC] py-24 px-6 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
           
           {/* Juego 1 (Caja Naranja) */}
           <div className="w-full bg-[#F59E0B] rounded-[4.5rem] p-6 shadow-2xl hover:-translate-y-2 transition-transform border-4 border-white/20 mb-16">
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-2 mt-4">Aprende a Dirigir Tus Ganancias</h3>
              <p className="text-[#011C40]/80 font-bold text-sm mb-6">Coloca cada billete en la categoría correcta de tu presupuesto.</p>
              
              <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-white rounded-[3rem] flex items-center justify-center text-slate-300 font-black text-xl mb-6 border-4 border-dashed border-orange-200">
                 [ JUEGO INTERACTIVO: DISTRIBUCIÓN ]
              </div>
              <button className="bg-[#011C40] text-[#FFCA28] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:bg-white hover:text-[#011C40] transition-colors mb-4">
                Jugar Ahora
              </button>
           </div>

           {/* Juego 2 (Caja Celeste) */}
           <div className="w-full bg-[#0EA5E9] rounded-[4.5rem] p-6 shadow-2xl mb-24 hover:-translate-y-2 transition-transform border-4 border-white/20">
              <h3 className="text-2xl font-black text-white tracking-tighter mb-2 mt-4">¿Dueño o Esclavo Del Presupuesto?</h3>
              <p className="text-white/80 font-bold text-sm mb-6">Responde rápido y toma el control de tus finanzas.</p>
              
              <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-white rounded-[3rem] flex items-center justify-center text-slate-300 font-black text-xl mb-6 border-4 border-dashed border-blue-200">
                 [ QUIZ INTERACTIVO: PRESUPUESTO ]
              </div>
              <button className="bg-white text-[#0EA5E9] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#011C40] transition-colors mb-4">
                Jugar Ahora
              </button>
           </div>

           {/* Avatares / Recompensas */}
           <div className="flex justify-center gap-6 mb-24">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-24 h-32 bg-white/20 rounded-3xl border-2 border-white/40 flex flex-col items-center justify-center text-white text-xs font-bold backdrop-blur-md shadow-xl hover:-translate-y-2 transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#FFCA28] mb-2 shadow-sm" />
                  Nivel {item}
                </div>
              ))}
           </div>

           {/* LA HISTORIA Y RECURSOS DEL BLOQUE */}
           <div className="w-full flex flex-col items-center">
              
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-8 drop-shadow-sm">
                 La Historia de Este Bloque: <br/> <span className="text-[#FFCA28]">El cofre de los sueños</span>
              </h2>
              
              {/* Audio Player adaptado */}
              <div className="w-full max-w-2xl bg-white/30 backdrop-blur-md rounded-full p-4 flex items-center gap-4 border border-white/50 shadow-xl mb-20">
                 <div className="w-12 h-12 bg-[#FFCA28] rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#A855F7] border-b-[8px] border-b-transparent ml-1"></div>
                 </div>
                 <div className="flex-1 h-2 bg-white/40 rounded-full relative">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCA28] rounded-full"></div>
                 </div>
                 <span className="text-white font-black text-xs tracking-widest">03:15 / 07:00</span>
              </div>

              {/* Recursos de Descarga */}
              <h3 className="text-2xl font-black text-white tracking-tighter mb-8 drop-shadow-sm">Disfruta de los Juegos de Este Bloque</h3>
              <div className="w-48 h-48 bg-white/20 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-white/40 text-white/70 font-black mb-12 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                 [ Descargar Juego ]
              </div>

              <h3 className="text-2xl font-black text-white tracking-tighter mb-8 drop-shadow-sm">Consulta la guía para este Bloque</h3>
              <div className="w-48 h-48 bg-white/20 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-white/40 text-white/70 font-black mb-10 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                 [ Descargar Guía ]
              </div>
           </div>
        </div>
      </section>

      {/* 5. PROYECTOS FINALES (Azul Institucional) */}
      <section className="w-full bg-[#0980E8] pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-black text-[#FFCA28] tracking-tighter mb-6 drop-shadow-lg">
              Es Hora de Convertir Tu <br/> Conocimiento en Tu <span className="text-white">Primer Activo</span>
            </h2>
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-12 max-w-lg">
              Pon en práctica tu independencia. Descarga estas plantillas y comienza a registrar cada peso que entra y sale de tu vida.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 w-full mb-16">
               <div className="bg-white rounded-[2.5rem] p-8 flex-1 shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer border-4 border-transparent hover:border-white/50">
                  <div className="w-16 h-16 bg-[#0980E8]/10 text-[#0980E8] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl">↓</div>
                  <h3 className="font-black text-[#011C40] mb-2 uppercase tracking-widest text-sm">Mi Presupuesto 50/30/20</h3>
               </div>
               <div className="bg-white rounded-[2.5rem] p-8 flex-1 shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer border-4 border-transparent hover:border-white/50">
                  <div className="w-16 h-16 bg-[#0980E8]/10 text-[#0980E8] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl">↓</div>
                  <h3 className="font-black text-[#011C40] mb-2 uppercase tracking-widest text-sm">Rastreador de Gastos</h3>
               </div>
            </div>

            {/* NAVEGACIÓN */}
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
               <Link href="/academia/construyendo-independencia">
                 <button className="w-full md:w-auto bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0980E8] transition-colors">
                   Volver al Temario
                 </button>
               </Link>
               {/* Conectamos al Bloque 2 */}
               <Link href="/academia/construyendo-independencia/bloque2">
                 <button className="w-full md:w-auto bg-[#FFCA28] text-[#011C40] px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/30 hover:scale-105 transition-transform">
                   Siguiente Bloque →
                 </button>
               </Link>
            </div>
        </div>
      </section>

      {/* 6. ACCESO A BIBLIOTECA (Footer en Violeta/Lila) */}
      <section className="w-full bg-[#C084FC] pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
           <div className="text-white md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                 Acceso a la <br/> <span className="text-[#4C1D95]/80">biblioteca</span>
              </h2>
              <p className="font-bold text-sm text-[#4C1D95] leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                 En CEN, creemos que el conocimiento es la herramienta más valiosa. Por eso, hemos creado esta biblioteca con una selección de recursos que te ayudarán a profundizar en tu aventura financiera.
              </p>
              <button className="bg-[#4C1D95] text-white px-8 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-all uppercase text-xs">
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