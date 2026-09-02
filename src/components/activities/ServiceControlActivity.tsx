'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Droplets, Flame, AlertTriangle, ShieldCheck, Timer, Wallet, RefreshCw, PlayCircle } from 'lucide-react';

// ─── FORMA DE DATOS ESPERADA (data de la actividad, JSON en public/data/actividades) ──
// Todos los campos son opcionales: si la actividad no los define, se usan los mismos
// valores que tenía el minijuego cuando estaba hardcodeado, así el comportamiento no
// cambia para actividades existentes (ej. public/data/actividades/p1/act-p1-2-5-a.json,
// tipo "CONTROL", que hoy solo trae titulo/descripcion/objetivo).
interface ServicioConfig {
  id: string;
  nombre?: string;
  icono?: string; // 'luz' | 'agua' | 'gas' (o alias en inglés) — ver ICONOS_SERVICIO
  color?: string; // clase Tailwind de texto, ej. 'text-yellow-400'
  nivel_inicial?: number;
  velocidad?: number;
}

interface ServiceControlData {
  titulo?: string;
  descripcion?: string;
  presupuesto_inicial?: number;
  duracion_segundos?: number;
  servicios?: ServicioConfig[];
  umbral_costo?: number;        // % de nivel a partir del cual el servicio empieza a costar dinero
  factor_costo?: number;        // costo por cada punto de nivel arriba del umbral
  umbral_alerta?: number;       // % de nivel considerado peligro (barra roja, badge "¡PELIGRO!")
  reduccion_optimizar?: number; // cuánto baja el nivel al pulsar "Optimizar"
  mensaje_exito?: string;
  mensaje_fallo?: string;
}

interface Props {
  data: ServiceControlData;
  onComplete?: (score: number) => void;
  onClose?: () => void;
}

interface ServicioEstado {
  id: string;
  name: string;
  Icon: React.ElementType;
  color: string;
  level: number;
  speed: number;
}

const ICONOS_SERVICIO: Record<string, { Icon: React.ElementType; color: string }> = {
  luz: { Icon: Zap, color: 'text-yellow-400' },
  light: { Icon: Zap, color: 'text-yellow-400' },
  energia: { Icon: Zap, color: 'text-yellow-400' },
  agua: { Icon: Droplets, color: 'text-blue-400' },
  water: { Icon: Droplets, color: 'text-blue-400' },
  gas: { Icon: Flame, color: 'text-orange-400' },
};

const ICONO_DEFECTO = { Icon: Zap, color: 'text-white/70' };

const SERVICIOS_DEFECTO: ServicioConfig[] = [
  { id: 'light', nombre: 'Energía', icono: 'luz', color: 'text-yellow-400', nivel_inicial: 20, velocidad: 1.8 },
  { id: 'water', nombre: 'Agua', icono: 'agua', color: 'text-blue-400', nivel_inicial: 15, velocidad: 1.4 },
  { id: 'gas', nombre: 'Gas', icono: 'gas', color: 'text-orange-400', nivel_inicial: 25, velocidad: 1.1 },
];

function resolveIcono(servicio: ServicioConfig) {
  const key = (servicio.icono || servicio.id || '').toLowerCase();
  const base = ICONOS_SERVICIO[key] || ICONO_DEFECTO;
  return { Icon: base.Icon, color: servicio.color || base.color };
}

function construirServiciosIniciales(config?: ServicioConfig[]): ServicioEstado[] {
  const fuente = config && config.length > 0 ? config : SERVICIOS_DEFECTO;
  return fuente.map((s) => {
    const { Icon, color } = resolveIcono(s);
    return {
      id: s.id,
      name: s.nombre || s.id,
      Icon,
      color,
      level: typeof s.nivel_inicial === 'number' ? s.nivel_inicial : 20,
      speed: typeof s.velocidad === 'number' ? s.velocidad : 1.5,
    };
  });
}

export default function ServiceControlActivity({ data, onComplete, onClose }: Props) {
  // Configuración derivada de la prop `data`, con los mismos valores por defecto
  // que tenía la versión hardcodeada del minijuego.
  const presupuestoInicial = typeof data?.presupuesto_inicial === 'number' && data.presupuesto_inicial > 0
    ? data.presupuesto_inicial
    : 1000;
  const duracionInicial = typeof data?.duracion_segundos === 'number' && data.duracion_segundos > 0
    ? data.duracion_segundos
    : 60;
  const umbralCosto = typeof data?.umbral_costo === 'number' ? data.umbral_costo : 50;
  const factorCosto = typeof data?.factor_costo === 'number' ? data.factor_costo : 0.3;
  const umbralAlerta = typeof data?.umbral_alerta === 'number' ? data.umbral_alerta : 85;
  const reduccionOptimizar = typeof data?.reduccion_optimizar === 'number' ? data.reduccion_optimizar : 35;

  const [services, setServices] = useState<ServicioEstado[]>(() => construirServiciosIniciales(data?.servicios));
  const [budget, setBudget] = useState(presupuestoInicial);
  const [timeLeft, setTimeLeft] = useState(duracionInicial);
  const [isFinished, setIsFinished] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showRedAlert, setShowRedAlert] = useState(false);

  // Ref sincronizado con el presupuesto real más reciente: evita leer un
  // valor de `budget` obsoleto (closure de un render anterior) al calcular
  // el score final, y evita que `onComplete` se dispare dos veces si el
  // tiempo se agota justo en el mismo tick en que el presupuesto llega a 0.
  const budgetRef = useRef(budget);
  const hasCompletedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const completeOnce = (finalScore: number) => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete?.(finalScore);
  };

  useEffect(() => {
    if (!gameStarted || isFinished || isLost) return;

    const gameLoop = setInterval(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        level: Math.min(s.level + (Math.random() * s.speed + 0.5), 100)
      })));

      setServices(current => {
        let cost = 0;
        current.forEach(s => {
          if (s.level > umbralCosto) cost += (s.level - umbralCosto) * factorCosto;
        });

        if (cost > 10) {
          setShowRedAlert(true);
          const alertTimeout = setTimeout(() => setShowRedAlert(false), 200);
          timeoutsRef.current.push(alertTimeout);
        }

        setBudget(b => {
          const nextB = b - cost;
          budgetRef.current = Math.max(0, nextB);
          if (nextB <= 0) {
            setIsLost(true);
            const lostTimeout = setTimeout(() => completeOnce(0), 4000);
            timeoutsRef.current.push(lostTimeout);
            return 0;
          }
          return nextB;
        });
        return current;
      });

      setTimeLeft(t => {
        if (t <= 1) {
          setIsFinished(true);
          const finishTimeout = setTimeout(() => {
            const pctRestante = Math.round((budgetRef.current / presupuestoInicial) * 100);
            completeOnce(Math.max(0, Math.min(100, pctRestante)));
          }, 4000);
          timeoutsRef.current.push(finishTimeout);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [gameStarted, isFinished, isLost, budget, onComplete, presupuestoInicial, umbralCosto, factorCosto]);

  const handleFix = (id: string) => {
    if (!gameStarted || isFinished || isLost) return;
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, level: Math.max(s.level - reduccionOptimizar, 0) } : s
    ));
  };

  const tituloConsola = data?.titulo || 'Consola de Ahorro';
  const tituloMision = data?.titulo ? `Misión: ${data.titulo}` : 'Misión: Guardián del Hogar';

  return (
    <div className="w-full h-full min-h-[700px] bg-transparent relative flex flex-col items-center justify-center font-sans overflow-hidden select-none p-4 md:p-8">

      {/* ALERTA DE PÉRDIDA DE DINERO (FLASH ROJO) */}
      <AnimatePresence>
         {showRedAlert && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-rose-500 pointer-events-none z-[60]"
           />
         )}
      </AnimatePresence>

      {/* HUD SUPERIOR REFORMADO */}
      <div className="absolute top-4 md:top-8 left-8 right-8 flex justify-between items-start z-50">
         <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/30 font-black text-[8px] uppercase tracking-[0.4em]">
               <ShieldCheck size={12} className="text-emerald-500" /> Diamond Service Console
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">{tituloConsola}</h1>
         </div>

         <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl text-center min-w-[120px]">
               <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Tiempo</div>
               <div className={`text-2xl font-black italic ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
               </div>
            </div>
            <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl backdrop-blur-3xl text-center min-w-[160px]">
               <div className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                  <Wallet size={10} /> Presupuesto
               </div>
               <div className="text-2xl font-black text-white italic">
                  ${Math.floor(budget)}
               </div>
            </div>
         </div>
      </div>

      {/* INSTRUCCIONES VISIBLES */}
      {!gameStarted && !isFinished && !isLost && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-xl flex items-center justify-center p-8"
        >
           <div className="max-w-xl w-full bg-white/[0.03] border border-white/10 rounded-[60px] p-12 md:p-16 text-center space-y-10 shadow-2xl">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
                 <AlertTriangle size={40} />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{tituloMision}</h2>
                 <p className="text-white/60 text-lg font-medium leading-relaxed">
                    {data?.descripcion ? (
                      data.descripcion
                    ) : (
                      <>
                         ¡Ceny dejó los servicios encendidos! <br />
                         Haz clic en los botones de <span className="text-white font-bold">"OPTIMIZAR"</span> para bajar el consumo. <br />
                         <span className="text-rose-400 font-bold">¡Si las barras llegan al rojo, tu dinero desaparecerá!</span>
                      </>
                    )}
                 </p>
              </div>
              <button
                onClick={() => setGameStarted(true)}
                className="w-full py-8 bg-emerald-500 text-white rounded-[30px] font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-4"
              >
                 <PlayCircle size={20} /> Empezar Misión
              </button>
           </div>
        </motion.div>
      )}

      {/* ÁREA CENTRAL - LOS MONITORES COMPACTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full max-w-5xl mt-20 md:mt-0 relative z-10">
         {services.map((service) => (
           <motion.div
             key={service.id}
             className={`relative bg-white/5 border rounded-[40px] p-8 flex flex-col items-center gap-6 transition-all duration-300
               ${service.level > umbralAlerta ? 'border-rose-500 bg-rose-500/10 scale-105' :
                 service.level > umbralCosto ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10'}`}
           >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${service.color}`}>
                 <service.Icon size={32} />
              </div>

              <div className="w-full space-y-2">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{service.name}</span>
                    <span className={`text-lg font-black italic ${service.level > umbralAlerta ? 'text-rose-400' : 'text-white'}`}>
                       {Math.floor(service.level)}%
                    </span>
                 </div>

                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                      animate={{
                        width: `${service.level}%`,
                        backgroundColor: service.level > umbralAlerta ? '#f43f5e' : service.level > umbralCosto ? '#f97316' : '#10b981'
                      }}
                      className="h-full rounded-full transition-colors duration-300"
                    />
                 </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFix(service.id)}
                className={`w-full py-5 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all
                  ${service.level > 30
                    ? 'bg-white text-[#0A0118] shadow-xl'
                    : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'}`}
              >
                 {service.level > 30 ? (
                    <> <RefreshCw size={14} className="animate-spin-slow" /> Optimizar </>
                 ) : (
                    "Estable"
                 )}
              </motion.button>

              {service.level > umbralAlerta && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -top-3 px-4 py-1 bg-rose-500 text-white text-[8px] font-black uppercase rounded-full shadow-lg"
                >
                   ¡PELIGRO!
                </motion.div>
              )}
           </motion.div>
         ))}
      </div>

      {/* OVERLAY FINAL */}
      <AnimatePresence>
        {(isFinished || isLost) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-3xl flex items-center justify-center p-8"
          >
             <div className="text-center space-y-10 max-w-lg">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl
                    ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`}
                >
                   {isLost ? <AlertTriangle size={60} className="text-white" /> : <ShieldCheck size={60} className="text-white" />}
                </motion.div>

                <div className="space-y-3">
                  <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">
                     {isLost ? 'Misión Fallida' : '¡Misión Exitosa!'}
                  </h2>
                  <p className="text-lg text-white/40 font-medium italic">
                     {isLost
                        ? (data?.mensaje_fallo || 'El desperdicio de luz y agua vació tu presupuesto. ¡Recuerda siempre apagar lo que no uses!')
                        : (data?.mensaje_exito || 'Has demostrado ser un Guardián del Ahorro. ¡Tu familia está orgullosa de ti!')}
                  </p>
                </div>

                <div className={`text-4xl font-black italic ${isLost ? 'text-rose-400' : 'text-emerald-400'}`}>
                   PRESUPUESTO: ${Math.floor(budget)}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-7 bg-white text-[#0A0118] rounded-[25px] font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
                >
                   Terminar
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
