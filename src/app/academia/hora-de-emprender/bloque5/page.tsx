/**
 * @project CEN - Nivel 4: Hora de Emprender (Bloque 5 - GRAN FINAL)
 * @author Cristofer Huerta (Luminar)
 * @description Clon de alta fidelidad del Segmento 4, Bloque 5 (El Lanzamiento).
 */

import Link from "next/link";

export default function Segmento4Bloque5Page() {
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
      <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-gradient-to-b from-[#DBEAFE] to-white w-full rounded-[4.5rem] p-12 shadow-xl border border-blue-50 relative overflow-hidden mb-12">
          <span className="bg-[#3B82F6] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 inline-block shadow-md">
            Bloque 5 - Gran Final
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF] tracking-tighter mb-6">
            El Lanzamiento <br/> La Gran Feria Del Emprendedor
          </h1>
          <p className="text-[#1E40AF]/80 font-bold text-sm leading-relaxed max-w-2xl mx-auto">
            ¡Ha llegado el momento de brillar! Todo tu esfuerzo, planificación y diseño se ponen a prueba hoy. Es hora de abrir las puertas de tu negocio al mundo.
          </p>
        </div>

        <h3 className="text-[#3B82F6] font-black text-xl mb-6 tracking-tighter">En Este Bloque Aprenderemos</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
           <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">Los Números</span>
           <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Pitch</span>
           <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">El Stand</span>
        </div>
      </section>

      {/* 3. WORKBOOKS Y HERRAMIENTAS (Fondo Blanco) */}
      <section className="w-full px-6 pb-20 flex flex-col items-center">
         
         {/* Módulo 1: Conoce Tus Números */}
         <div className="max-w-3xl text-center mb-8">
            <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-4">Conoce Tus Números</h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed mb-4">
               Antes de vender, necesitas saber a qué precio hacerlo para que tu negocio sea rentable.
            </p>
            <p className="text-slate-500 text-sm font-bold leading-relaxed mb-6">
               <span className="text-[#0980E8]">Precio de Venta:</span> Cuánto pagará el cliente.<br/>
               <span className="text-[#0980E8]">Costo de Producción:</span> Cuánto te cuesta hacerlo.<br/>
               <span className="text-[#0980E8]">Margen de Ganancia:</span> Lo que realmente ganas.
            </p>
         </div>

         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="flex flex-col gap-2">
                  <label className="text-[#011C40] font-black text-xs uppercase tracking-widest">Precio de Venta</label>
                  <input type="text" placeholder="$ 0.00" className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-500 font-bold outline-none focus:border-[#0980E8] text-center" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[#011C40] font-black text-xs uppercase tracking-widest">Costo Prod.</label>
                  <input type="text" placeholder="$ 0.00" className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-500 font-bold outline-none focus:border-[#0980E8] text-center" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[#0980E8] font-black text-xs uppercase tracking-widest">Ganancia</label>
                  <div className="h-12 bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl px-4 text-[#0369A1] font-black flex items-center justify-center">
                     $ 0.00
                  </div>
               </div>
            </div>
            <div className="w-full flex justify-center">
               <button className="bg-[#0980E8] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-[#011C40] transition-colors">
                  Guardar Números
               </button>
            </div>
         </div>

         {/* Módulo 2: Construye Tu Pitch */}
         <div className="max-w-3xl text-center mb-8">
            <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-4">Construye Tu Pitch</h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed">
               Tienes solo 30 segundos para convencer a tu cliente. Completa los espacios para crear un discurso de ventas magnético y profesional.
            </p>
         </div>

         <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20 flex flex-col md:flex-row gap-10">
            {/* Izquierda: Inputs */}
            <div className="flex-1 flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                  <label className="text-[#011C40] font-black text-[10px] uppercase tracking-widest">Mi nombre es...</label>
                  <input type="text" className="h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#0980E8]" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[#011C40] font-black text-[10px] uppercase tracking-widest">Y he creado (Producto)...</label>
                  <input type="text" className="h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#0980E8]" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[#011C40] font-black text-[10px] uppercase tracking-widest">Que ayuda a (Cliente)...</label>
                  <input type="text" className="h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#0980E8]" />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[#011C40] font-black text-[10px] uppercase tracking-widest">A resolver (Problema)...</label>
                  <input type="text" className="h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#0980E8]" />
               </div>
               <button className="bg-[#011C40] text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg mt-2 hover:bg-[#0980E8] transition-colors self-start">
                  Generar Pitch
               </button>
            </div>
            {/* Derecha: Preview Azul */}
            <div className="flex-1 bg-[#0980E8] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px] opacity-10"></div>
               <span className="relative z-10 text-white/50 font-black text-4xl tracking-tighter mb-4">PITCH</span>
               <div className="relative z-10 w-full h-32 bg-white/10 rounded-xl border border-white/20 p-4 text-white font-bold text-sm italic flex items-center justify-center">
                  "Tu discurso aparecerá aquí..."
               </div>
            </div>
         </div>

         {/* Módulo 3: Tu Stand Virtual Listo */}
         <div className="max-w-3xl text-center mb-8">
            <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-4">Tu Stand Virtual Listo</h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed">
               Asegúrate de tener todo lo necesario para que tu perfil (redes sociales, WhatsApp o web) luzca 100% profesional antes del gran día.
            </p>
         </div>

         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-20">
            <div className="flex flex-col gap-4">
               {[
                  "Foto de perfil clara o Logo del negocio.",
                  "Descripción (Bio) usando tu Promesa de Valor.",
                  "Enlace directo para compras o contacto (WhatsApp).",
                  "Al menos 3 publicaciones listas mostrando el producto."
               ].map((item, i) => (
                  <label key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-[#0980E8] transition-colors">
                     <input type="checkbox" className="w-5 h-5 accent-[#0980E8] rounded" />
                     <span className="font-bold text-slate-600 text-sm">{item}</span>
                  </label>
               ))}
            </div>
         </div>

         {/* Módulo 4: Es Hora De Planificar */}
         <h2 className="text-3xl font-black text-[#0980E8] tracking-tighter mb-8 text-center">Es Hora De Planificar Tu Lanzamiento</h2>
         <div className="w-full max-w-3xl bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[#0980E8] font-black text-[10px] uppercase tracking-widest">Meta de Ventas</span>
                  <div className="w-full border-b border-slate-300 border-dashed mt-2"></div>
               </div>
               <div className="h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[#0980E8] font-black text-[10px] uppercase tracking-widest">Canal Principal</span>
                  <div className="w-full border-b border-slate-300 border-dashed mt-2"></div>
               </div>
               <div className="h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[#0980E8] font-black text-[10px] uppercase tracking-widest">Fecha de Lanzamiento</span>
                  <div className="w-full border-b border-slate-300 border-dashed mt-2"></div>
               </div>
               <div className="h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[#0980E8] font-black text-[10px] uppercase tracking-widest">Premio por Lograrlo</span>
                  <div className="w-full border-b border-slate-300 border-dashed mt-2"></div>
               </div>
            </div>
            <div className="w-full flex justify-center">
               {/* Botón Dorado Distintivo */}
               <button className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-yellow-500/40 hover:scale-105 transition-transform w-full md:w-auto">
                  ¡Comenzar Lanzamiento!
               </button>
            </div>
         </div>
      </section>

      {/* 4. ZONA INMERSIVA FINAL (Fondo Azul Institucional #0980E8) */}
      <section className="w-full bg-[#0980E8] pt-24 pb-32 px-6 flex flex-col items-center border-t-8 border-white/10">
         
         {/* Video Section */}
         <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-12 drop-shadow-lg text-center">
            ¡Nuestra Aventura en <br/> Video!
         </h2>
         <div className="w-full max-w-5xl aspect-video bg-slate-100 rounded-[4.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center border-8 border-white/20 relative mb-20">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <div className="w-24 h-24 bg-[#FFCA28] rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 mb-4 pl-2 cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[30px] border-l-white border-b-[18px] border-b-transparent"></div>
               </div>
               <span className="text-slate-400 font-black tracking-widest uppercase text-sm">Gran Final - Reproducir Video</span>
            </div>
         </div>

         {/* NAVEGACIÓN - BOTONES DE CIERRE DE ACADEMIA */}
         <div className="flex flex-col md:flex-row gap-6 w-full justify-center max-w-4xl">
            <Link href="/academia/hora-de-emprender">
               <button className="w-full md:w-auto bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#0980E8] transition-colors">
                 Volver al Temario
               </button>
            </Link>
            {/* Botón triunfal que regresa al Home o a un Dashboard futuro */}
            <Link href="/">
               <button className="w-full md:w-auto bg-[#10B981] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-green-500/40 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                 <span>⭐ ¡Finalizar Academia! ⭐</span>
               </button>
            </Link>
         </div>
      </section>

      {/* 5. ACCESO A BIBLIOTECA (Footer adaptado al fondo azul inmersivo) */}
      <section className="w-full bg-[#011C40] pt-16 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
           <div className="text-white md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                 Acceso a la <br/> <span className="text-[#0980E8]">biblioteca</span>
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