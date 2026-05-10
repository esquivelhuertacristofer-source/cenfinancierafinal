/**
 * @component FooterBiblioteca
 * @description Sección de cierre global con acceso a la biblioteca de recursos.
 */

interface FooterProps {
  bgColor?: string;
  textColorTheme?: "light" | "dark"; // Define si el texto principal es blanco o azul oscuro
}

export default function FooterBiblioteca({ 
  bgColor = "bg-[#0980E8]", 
  textColorTheme = "light" 
}: FooterProps) {
  
  const isLight = textColorTheme === "light";

  return (
    <section className={`w-full ${bgColor} pt-16 pb-32 px-6 border-t border-white/20`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
         
         <div className={`${isLight ? "text-white" : "text-[#011C40]"} md:w-1/2 text-center md:text-left`}>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
               Acceso a la <br/> 
               <span className={isLight ? "text-white/60" : "text-[#0980E8]"}>biblioteca</span>
            </h2>
            <p className={`font-bold text-sm ${isLight ? "text-white/80" : "text-[#011C40]/80"} leading-relaxed mb-8 max-w-sm mx-auto md:mx-0`}>
               En CEN, creemos que el conocimiento es la herramienta más valiosa. Por eso, hemos creado esta biblioteca con una selección de recursos que te ayudarán a profundizar en tu aventura financiera.
            </p>
            <button className={`px-8 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-all uppercase text-xs ${isLight ? "bg-[#22D3EE] text-white shadow-cyan-400/30" : "bg-[#0980E8] text-white shadow-blue-500/30"}`}>
               Accede Ahora
            </button>
         </div>

         <div className="md:w-1/2 flex justify-center">
            <div className="w-72 h-72 bg-[#F472B6] rounded-full flex items-center justify-center border-8 border-white/20 shadow-2xl relative">
               <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-40 ${isLight ? "bg-white" : "bg-[#FFCA28]"}`}/>
               <span className="font-black text-white/50 text-xl">[ IMG Gráficos CENy ]</span>
            </div>
         </div>

      </div>
    </section>
  );
}