/**
 * @project CEN - Nivel 2: Segmento 4 (Hora de Emprender)
 * @author Cristofer Huerta (Luminar)
 * @description Clon estructural de la página del Segmento 4 y su Temario.
 */

import Link from "next/link";

export default function HoraDeEmprenderPage() {
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
          <Link href="#" className="hover:text-[#0980E8] transition-colors text-[#0980E8]">Hora de Emprender</Link>
        </div>
        <Link href="/log-in">
          <button className="bg-[#22D3EE] text-white px-8 py-3 rounded-full font-black shadow-lg shadow-cyan-200/50 hover:scale-105 transition-all uppercase text-xs">
            Iniciar Sesión
          </button>
        </Link>
      </nav>

      {/* 2. HERO DEL SEGMENTO (Azul Profundo a Blanco) */}
      <section className="pt-32 pb-10 px-6 max-w-6xl mx-auto flex justify-center">
        <div className="w-full bg-gradient-to-b from-[#3B82F6] to-white rounded-[4.5rem] p-12 md:p-20 text-center shadow-2xl shadow-blue-100 relative overflow-hidden">
          <span className="bg-white/20 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block backdrop-blur-sm">
            Campaña Educativa Nacional
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-md">
            Es Hora De Emprender
          </h1>
          <p className="text-slate-600 font-bold text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            ¿Tienes una idea que te apasiona pero no sabes por dónde empezar? ¿Sientes que podrías crear algo grande, pero el camino para hacerlo realidad parece un laberinto? No estás solo. Cada gran empresa, cada producto innovador y cada servicio que ha cambiado vidas comenzó exactamente donde estás tú ahora: con una chispa de potencial.
          </p>
          {/* Espacio para la ilustración de emprendedores */}
          <div className="w-full max-w-md h-56 mx-auto mt-12 bg-[#0980E8]/5 rounded-[3rem] border-4 border-dashed border-[#0980E8]/20 flex items-center justify-center font-black text-[#0980E8]/40 backdrop-blur-sm">
            [ IMG Escalera Emprendedores ]
          </div>
        </div>
      </section>

      {/* 3. TRANSICIÓN A FONDO AZUL AGUA Y TEMARIO */}
      <section className="relative w-full bg-gradient-to-b from-white via-[#0ea5e9]/10 to-[#0980E8] pt-10 pb-32 px-6">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
          
          <h2 className="text-4xl md:text-6xl font-black text-[#0980E8] tracking-tighter text-center mb-16 leading-tight drop-shadow-sm">
            Descubre Nuestro Temario <br /> Completo
          </h2>

          {/* Grid Principal: 3 Bloques Arriba, 2 Abajo */}
          <div className="flex flex-col gap-8 w-full max-w-5xl">
            
            {/* Fila 1: Tres bloques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {/* Bloque 1 */}
              <Link href="/academia/hora-de-emprender/bloque1" className="bg-white rounded-[3rem] p-4 pb-8 flex flex-col items-center text-center shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-transparent hover:border-white/50 group">
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center font-black text-slate-300 group-hover:shadow-inner transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"/>
                  [ IMG Portada 1 ]
                </div>
                <span className="text-[#FFCA28] font-black text-[10px] tracking-[0.3em] uppercase mb-2">Bloque 1</span>
                <h3 className="text-[#0980E8] font-black text-xl leading-tight px-4">Encuentra y Valida tu <br/> Idea de Negocio</h3>
              </Link>

              {/* Bloque 2 */}
              <Link href="/academia/hora-de-emprender/bloque2" className="bg-white rounded-[3rem] p-4 pb-8 flex flex-col items-center text-center shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-transparent hover:border-white/50 group">
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center font-black text-slate-300 group-hover:shadow-inner transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"/>
                  [ IMG Portada 2 ]
                </div>
                <span className="text-[#FFCA28] font-black text-[10px] tracking-[0.3em] uppercase mb-2">Bloque 2</span>
                <h3 className="text-[#0980E8] font-black text-xl leading-tight px-4">El Taller - Diseña tu <br/> Producto o Servicio</h3>
              </Link>

              {/* Bloque 3 */}
              <Link href="/academia/hora-de-emprender/bloque3" className="bg-white rounded-[3rem] p-4 pb-8 flex flex-col items-center text-center shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-transparent hover:border-white/50 group">
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center font-black text-slate-300 group-hover:shadow-inner transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"/>
                  [ IMG Portada 3 ]
                </div>
                <span className="text-[#FFCA28] font-black text-[10px] tracking-[0.3em] uppercase mb-2">Bloque 3</span>
                <h3 className="text-[#0980E8] font-black text-xl leading-tight px-4">Crea tu Marca y Atrae a <br/> tus Primeros Fans</h3>
              </Link>
            </div>

            {/* Fila 2: Dos bloques centrados */}
            <div className="flex flex-col md:flex-row justify-center gap-8 w-full">
              {/* Bloque 4 */}
              <Link href="/academia/hora-de-emprender/bloque4" className="w-full md:w-[32%] bg-white rounded-[3rem] p-4 pb-8 flex flex-col items-center text-center shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-transparent hover:border-white/50 group">
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center font-black text-slate-300 group-hover:shadow-inner transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"/>
                  [ IMG Portada 4 ]
                </div>
                <span className="text-[#FFCA28] font-black text-[10px] tracking-[0.3em] uppercase mb-2">Bloque 4</span>
                <h3 className="text-[#0980E8] font-black text-xl leading-tight px-4">La Sala de Máquinas - <br/> Operaciones y Logística</h3>
              </Link>

              {/* Bloque 5 */}
              <Link href="/academia/hora-de-emprender/bloque5" className="w-full md:w-[32%] bg-white rounded-[3rem] p-4 pb-8 flex flex-col items-center text-center shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-transparent hover:border-white/50 group">
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center font-black text-slate-300 group-hover:shadow-inner transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"/>
                  [ IMG Portada 5 ]
                </div>
                <span className="text-[#FFCA28] font-black text-[10px] tracking-[0.3em] uppercase mb-2">Bloque 5</span>
                <h3 className="text-[#0980E8] font-black text-xl leading-tight px-4">El Lanzamiento - Finanzas, <br/> Formalización y Marcha</h3>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN FINAL (Footer Azul Institucional) */}
      <section className="w-full bg-[#0980E8] pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 border-t border-white/20 pt-16">
           <div className="text-white md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                 Acceso a la mejor <br/> bibliografía financiera.
              </h2>
              <p className="font-bold text-sm opacity-90 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
                 En CEN, creemos que el conocimiento es la herramienta más valiosa. Por eso, hemos creado esta biblioteca con una selección de libros y recursos de expertos que nos han inspirado y que te ayudarán a profundizar en tu aventura financiera.
              </p>
              <button className="bg-[#22D3EE] text-white px-8 py-4 rounded-full font-black shadow-xl shadow-cyan-400/30 hover:scale-105 transition-all uppercase text-xs">
                 Accede Ahora
              </button>
           </div>
           <div className="md:w-1/2 flex justify-center">
              <div className="w-72 h-72 bg-[#F472B6] rounded-full flex items-center justify-center border-8 border-white/10 shadow-2xl relative">
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FFCA28] rounded-full blur-2xl opacity-50"/>
                 <span className="font-black text-white/50 text-xl">[ IMG Gráficos CENy ]</span>
              </div>
           </div>
        </div>
      </section>

    </main>
  );
}