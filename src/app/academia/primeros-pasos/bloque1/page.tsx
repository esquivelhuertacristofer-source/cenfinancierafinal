/**
 * @project CEN - Nivel 3: Lección Individual (Bloque 1)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Bloque 1 (Video, Quizzes, GDevelop, Historia y Proyectos).
 */

import Link from "next/link";
import BotonProgreso from "../../../../components/BotonProgreso";

export default function Bloque1Page() {
  return (
    <main className="min-h-screen bg-white font-epilogue overflow-x-hidden">
      
      {/* 1. NAVBAR (Consistente con el resto de la plataforma) */}
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

      {/* 2. HERO DEL BLOQUE E INTRODUCCIÓN */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#E0F2FE] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-blue-50 relative overflow-hidden mb-12">
          <span className="bg-[#0980E8] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md shadow-blue-500/30">
            Bloque 1
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#011C40] tracking-tighter mb-6">
            El Dinero y Su Magia
          </h1>
          <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            Descubre de dónde viene el dinero, cómo se gana con esfuerzo y por qué es importante cuidarlo. Acompaña a CENy en esta primera gran aventura.
          </p>
        </div>

        <h3 className="text-[#0980E8] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Valor</span>
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Ahorro</span>
           <span className="bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Esfuerzo</span>
        </div>

        <div className="w-full max-w-2xl bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[3rem] p-10 flex items-center justify-center border-4 border-white shadow-xl mb-16 h-64 font-black text-indigo-300 text-xl">
           [ IMG Tarjeta Intro CENy ]
        </div>
      </section>

      {/* 3. SECCIÓN DEL VIDEO LARGO */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <h2 className="text-4xl font-black text-[#011C40] tracking-tighter text-center mb-10">
          ¡Nuestro primer gran <span className="text-[#0980E8]">Video</span>!
        </h2>
        <div className="w-full aspect-video bg-gradient-to-br from-[#011C40] to-slate-900 rounded-[4.5rem] shadow-2xl overflow-hidden flex items-center justify-center border-8 border-white relative">
           <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="w-20 h-20 bg-[#FFCA28] rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 mb-4 pl-2 cursor-pointer hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent"></div>
              </div>
              <span className="text-white/50 font-black tracking-widest uppercase text-xs">Reproductor de Video CEN</span>
           </div>
        </div>
      </section>

      {/* 4. ZONA AZUL: STORYTELLING Y LOS 3 QUIZZES */}
      <section className="w-full bg-[#0980E8] py-32 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
           
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
             ¡Ponte a prueba en este <br/> <span className="text-[#FFCA28]">viaje para una historia</span> <br/> muy especial!
           </h2>
           <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center border-4 border-dashed border-white/30 text-white/50 font-bold mb-16">
              [ IMG CENy Historia ]
           </div>

           {/* QUIZ 1 - JUEGO DE AHORRO */}
           <div className="w-full bg-white rounded-[4.5rem] p-8 shadow-2xl mb-24 hover:-translate-y-2 transition-transform">
              <div className="w-full aspect-[21/9] bg-slate-100 rounded-[3rem] flex items-center justify-center overflow-hidden relative mb-8">
                <iframe 
                  src="/juegos/corriente.html" 
                  className="absolute top-0 left-0 w-full h-full border-none"
                  title="Juego Corriente del Esfuerzo"
                />
              </div>
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-4">Reto 1: Identifica las monedas</h3>
              <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30 hover:bg-[#011C40] transition-colors">
                Jugar Ahora
              </button>
           </div>

           {/* QUIZ 2 - VIAJE DEL EMPRENDEDOR */}
           <div className="w-full bg-white rounded-[4.5rem] p-8 shadow-2xl mb-24 hover:-translate-y-2 transition-transform">
              <div className="w-full h-[650px] md:h-[700px] bg-slate-100 rounded-[3rem] flex items-center justify-center overflow-hidden relative mb-8">
                 <iframe 
                  src="/juegos/juego2.html" 
                  className="absolute top-0 left-0 w-full h-full border-none"
                  title="El Viaje del Pequeño Emprendedor"
                />
              </div>
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-4">Reto 2: Suma tus ahorros</h3>
              <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30 hover:bg-[#011C40] transition-colors">
                Jugar Ahora
              </button>
           </div>

           {/* QUIZ 3 - EL QUIZ MÁGICO DEL DINERO */}
           <div className="w-full bg-white rounded-[4.5rem] p-8 shadow-2xl mb-16 hover:-translate-y-2 transition-transform">
              <div className="w-full h-[650px] md:h-[700px] bg-slate-100 rounded-[3rem] flex items-center justify-center overflow-hidden relative mb-8">
                 <iframe 
                  src="/juegos/juego3.html" 
                  className="absolute top-0 left-0 w-full h-full border-none"
                  title="El Quiz Mágico del Dinero"
                />
              </div>
              <h3 className="text-2xl font-black text-[#011C40] tracking-tighter mb-4">Reto 3: Esquiva los gastos hormiga</h3>
              <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30 hover:bg-[#011C40] transition-colors">
                Jugar Ahora
              </button>
           </div>

        </div>
      </section>

      {/* 5. EL GRAN JUEGO (GDevelop) - Color Armonizado */}
      <section className="w-full bg-[#011C40] py-24 px-6 relative overflow-hidden">
        {/* Resplandor decorativo sutil en el fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0980E8]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-center mb-6">
             <span className="text-[#FFCA28]">Desafío Final:</span> El Guardián del Tesoro
           </h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs text-center mb-10 max-w-xl">
             Demuestra todo lo que aprendiste en este bloque. ¡Alcanza la máxima puntuación!
           </p>
           
           {/* Contenedor Gigante del Juego GDevelop */}
           <div className="w-full h-[500px] md:h-[700px] bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                 <div className="w-24 h-24 mx-auto border-4 border-[#FFCA28] border-t-transparent rounded-full animate-spin mb-6" />
                 <span className="text-[#FFCA28] font-black tracking-widest uppercase text-xl">
                   [ JUEGO GDEVELOP AQUÍ ]
                 </span>
              </div>
           </div>
        </div>
      </section>

      {/* 6. LA HISTORIA Y PROYECTOS DEL BLOQUE */}
      <section className="w-full bg-[#0980E8] py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Audio Player - La Historia de este bloque */}
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8">
            La historia de este <span className="text-[#FFCA28]">bloque</span>
          </h2>
          <div className="w-full bg-white/10 backdrop-blur-md rounded-full p-4 flex items-center gap-4 border border-white/20 shadow-xl mb-24">
             <div className="w-12 h-12 bg-[#FFCA28] rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#011C40] border-b-[8px] border-b-transparent ml-1"></div>
             </div>
             <div className="flex-1 h-2 bg-white/20 rounded-full relative">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCA28] rounded-full"></div>
             </div>
             <span className="text-white font-bold text-xs tracking-widest">02:15 / 05:30</span>
          </div>

          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-dashed border-white/30 text-white/50 font-bold mb-16">
             [ IMG CENy Proyectos ]
          </div>

          {/* Proyectos del bloque */}
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            ¡Has llegado <span className="text-[#FFCA28]">muy lejos!</span>
          </h2>
          <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-12">
            Descarga y completa los proyectos de este bloque
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 w-full mb-10">
             <div className="bg-white rounded-[2rem] p-8 flex-1 shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer border border-slate-100 group">
                <div className="w-16 h-16 bg-[#0980E8]/10 text-[#0980E8] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl group-hover:bg-[#0980E8] group-hover:text-white transition-colors">↓</div>
                <h3 className="font-black text-[#011C40] mb-2 uppercase tracking-widest text-sm">Proyecto 1</h3>
                <p className="text-slate-500 text-xs font-bold">Plantilla de Ahorro</p>
             </div>
             <div className="bg-white rounded-[2rem] p-8 flex-1 shadow-2xl hover:-translate-y-2 transition-transform cursor-pointer border border-slate-100 group">
                <div className="w-16 h-16 bg-[#0980E8]/10 text-[#0980E8] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl group-hover:bg-[#0980E8] group-hover:text-white transition-colors">↓</div>
                <h3 className="font-black text-[#011C40] mb-2 uppercase tracking-widest text-sm">Proyecto 2</h3>
                <p className="text-slate-500 text-xs font-bold">Mapa de Metas</p>
             </div>
          </div>

        </div>
      </section>

      {/* 7. RECOMPENSAS Y SIGUIENTE PASO */}
      <section className="w-full bg-[#0980E8] pb-20 px-6 border-t border-dashed border-white/20 pt-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
           
           <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-10 leading-tight">
             ¡Felicidades! <br/> Has completado el <span className="text-[#FFCA28]">Bloque 1</span>
           </h2>

           {/* AQUÍ VA EL BOTÓN DE GUARDADO EN BASE DE DATOS */}
           <BotonProgreso lessonId="s1_b1" />
           {/* ------------------------------------------- */}

           <div className="flex flex-col md:flex-row gap-6 mt-12">
              <Link href="/academia/primeros-pasos">
                <button className="w-full md:w-auto bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0980E8] transition-colors">
                  Volver al Temario
                </button>
              </Link>
              <Link href="/academia/primeros-pasos/bloque2">
                <button className="w-full md:w-auto bg-[#FFCA28] text-[#011C40] px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/30 hover:scale-105 transition-transform">
                  Siguiente Bloque →
                </button>
              </Link>
           </div>
        </div>
      </section>

      {/* 8. ACCESO A BIBLIOTECA (Footer consistente) */}
      <section className="w-full bg-white pt-20 pb-32 px-6 border-t-[20px] border-[#0980E8]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
           <div className="text-[#011C40] md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                 Acceso a la <br/> <span className="text-slate-300">biblioteca</span>
              </h2>
              <p className="font-bold text-sm text-slate-500 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                 En CEN, creemos que el conocimiento es la herramienta más valiosa. Por eso, hemos creado esta biblioteca con una selección de libros y recursos de expertos que nos han inspirado.
              </p>
              <button className="bg-[#22D3EE] text-white px-8 py-4 rounded-full font-black shadow-xl shadow-cyan-200 hover:scale-105 transition-all uppercase text-xs">
                 Accede Ahora
              </button>
           </div>
           <div className="md:w-1/2 flex justify-center">
              <div className="w-72 h-72 bg-[#F472B6] rounded-full flex items-center justify-center border-8 border-pink-100 shadow-2xl relative">
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FFCA28] rounded-full blur-2xl opacity-50"/>
                 <span className="font-black text-white/50 text-xl">[ IMG Gráficos CENy ]</span>
              </div>
           </div>
        </div>
      </section>

    </main>
  );
}