import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

export { supabase };

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type Modality = 'video' | 'simulator' | 'reading' | 'printable';
export type ContentType = 'theory' | 'strategy' | 'quiz' | 'video' | 'simulator';

export interface UnitContent {
  type: ContentType;
  label: string;
  url: string | null;
  required: boolean;
}

export interface Unit {
  code: string;
  title: string;
  order: number;
  modality: Modality;
  priority: 'essential' | 'optional';
  objective: string;
  contents: UnitContent[];
  metadata?: any;
  strategy?: any;
  theory?: any;
  evaluation?: any;
}

export interface PillarMeta {
  id: string;
  title: string;
  shortTitle: string;
  gradient: string;
  ring: string;
  color: string;
  icon: string;
  units: Unit[];
  videoUrl?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  school_level: string | null;
  group_id: string | null;
  grade: number;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation?: string;
}

// ─── Emergency & Fallback Data ───────────────────────────────────────────────

export const FALLBACK_PROFILE: UserProfile = {
  id: 'guest_user',
  email: 'invitado@cen.edu.mx',
  full_name: 'Estudiante Invitado',
  role: 'student',
  school_level: 'Primaria 4',
  group_id: 'default',
  grade: 4
};

export const TEST_ACCOUNTS: Record<string, UserProfile> = {
  'profesor.prueba@cen.edu': { id: '6d1cf7a7-3093-4f11-be52-b61cfaba7702', email: 'profesor.prueba@cen.edu', full_name: 'Profesor de Prueba', role: 'teacher', school_level: 'teacher', group_id: '1A', grade: 4 },
  'estudiante.prueba@cen.edu': { id: '49279c85-8fd6-464d-b16d-a6c9b4ab3db3', email: 'estudiante.prueba@cen.edu', full_name: 'Estudiante de Prueba', role: 'student', school_level: 'primary', group_id: '1A', grade: 4 },
};

// ─── Data Access ──────────────────────────────────────────────────────────────

const curriculumCache: Record<string, any> = {};

async function getCurriculumData(grade: number, schoolLevel: string): Promise<any> {
  const levelKey = (schoolLevel || 'primary').toLowerCase().includes('secundar') ? 'secondary' : 'primary';
  const key = `${levelKey}-${grade}`;
  if (curriculumCache[key]) return curriculumCache[key];
  try {
    const response = await fetch(`/api/curriculum/${key}`);
    if (!response.ok) return null;
    const data = await response.json();
    curriculumCache[key] = data;
    return data;
  } catch {
    return null;
  }
}

const CATEGORY_STYLES: Record<string, any> = {
  // P1, P2, P4, P5
  'Primeros Pasos Hacia el Ahorro': { gradient: 'from-orange-500 to-amber-600', ring: '#F97316', icon: '💰' },
  'Consumo Inteligente': { gradient: 'from-emerald-500 to-teal-600', ring: '#10B981', icon: '⚖️' },
  'Planificación y Metas': { gradient: 'from-sky-500 to-indigo-600', ring: '#0EA5E9', icon: '📈' },
  'Iniciación al Emprendimiento': { gradient: 'from-purple-500 to-fuchsia-600', ring: '#A855F7', icon: '🚀' },
  'Construyendo Independencia': { gradient: 'from-emerald-500 to-teal-600', ring: '#10B981', icon: '⚖️' },
  'Planificación y Crecimiento': { gradient: 'from-sky-500 to-indigo-600', ring: '#0EA5E9', icon: '📈' },
  'Emprendimiento': { gradient: 'from-purple-500 to-fuchsia-600', ring: '#A855F7', icon: '🚀' },
  '¡Es Hora de Emprender!': { gradient: 'from-purple-500 to-fuchsia-600', ring: '#A855F7', icon: '💡' },
  
  // P3
  'Mi Primer Presupuesto': { gradient: 'from-orange-500 to-amber-600', ring: '#F97316', icon: '📋' },
  'Bancos y Cuentas': { gradient: 'from-emerald-500 to-teal-600', ring: '#10B981', icon: '🏦' },
  'Crédito y Deuda': { gradient: 'from-rose-500 to-red-600', ring: '#EF4444', icon: '💳' },

  // P5 Specifics
  'Sistema Financiero': { gradient: 'from-blue-600 to-indigo-700', ring: '#2563EB', icon: '🏛️' },
  'Consumo Responsable': { gradient: 'from-emerald-500 to-teal-600', ring: '#10B981', icon: '🌿' },
  'Inversión y Patrimonio': { gradient: 'from-amber-500 to-yellow-600', ring: '#D97706', icon: '💎' },
  'Emprendimiento y Liderazgo': { gradient: 'from-purple-600 to-violet-700', ring: '#7C3AED', icon: '👑' },

  // Fallbacks
  'Ahorro': { gradient: 'from-orange-500 to-amber-600', ring: '#F97316', icon: '💰' },
  'Inversión': { gradient: 'from-sky-500 to-indigo-600', ring: '#0EA5E9', icon: '📈' },
};

const PILLAR_VIDEOS: Record<string, string> = {
  // Primaria 1
  'primary-1-primeros_pasos_hacia_el_ahorro': 'https://www.youtube.com/embed/lMZGNhTMHgw',
  'primary-1-construyendo_independencia': 'https://www.youtube.com/embed/A6WgPH1wdLg',
  'primary-1-planificacion_y_crecimiento': 'https://www.youtube.com/embed/5GuNoxftnZA',
  'primary-1-es_hora_de_emprender': 'https://www.youtube.com/embed/dOavE8I6RPk',
  'primary-1-iniciacion_al_emprendimiento': 'https://www.youtube.com/embed/dOavE8I6RPk',

  // Primaria 2
  'primary-2-primeros_pasos_hacia_el_ahorro': 'https://www.youtube.com/embed/IzcQxjRNlPM',
  'primary-2-construyendo_independencia': 'https://www.youtube.com/embed/DUQbgzhYPC8',
  'primary-2-planificacion_y_crecimiento': 'https://www.youtube.com/embed/k3zkD9fLAz4',
  'primary-2-es_hora_de_emprender': 'https://www.youtube.com/embed/UiAwd0OvfXU',

  // Primaria 3
  'primary-3-mi_primer_presupuesto': 'https://www.youtube.com/embed/Bg2vWZvYcCA',
  'primary-3-bancos_y_cuentas': 'https://www.youtube.com/embed/lXgK4xOzP98',
  'primary-3-credito_y_deuda': 'https://www.youtube.com/embed/Js-reuWiNVo',
  'primary-3-es_hora_de_emprender': 'https://www.youtube.com/embed/nPXdw7qmKU0',

  // Primaria 4
  'primary-4-primeros_pasos_hacia_el_ahorro': 'https://www.youtube.com/embed/bh9_lf445P0',
  'primary-4-construyendo_independencia': 'https://www.youtube.com/embed/o1af9u8RDlw',
  'primary-4-planificacion_y_crecimiento': 'https://www.youtube.com/embed/E05tp6LRJ9k',
  'primary-4-emprendimiento': 'https://www.youtube.com/embed/wld7rFE9SS4',

  // Primaria 5
  'primary-5-sistema_financiero': 'https://www.youtube.com/embed/OpI7XOi6lUY',
  'primary-5-consumo_responsable': 'https://www.youtube.com/embed/MFmkUTxuG-A',
  'primary-5-inversion_y_patrimonio': 'https://www.youtube.com/embed/LiJa42WUTDI',
  'primary-5-emprendimiento_y_liderazgo': 'https://www.youtube.com/embed/J_eaEm3fPcM',

  // Fallbacks para asegurar P1-1
  'primary-1-primeros-pasos-hacia-el-ahorro': 'https://www.youtube.com/embed/lMZGNhTMHgw',

  // Secundaria 1
  'secondary-1-primeros_pasos_hacia_el_ahorro': 'https://www.youtube.com/embed/SRE0i6h-j5c',
  'secondary-1-consumo_inteligente': 'https://www.youtube.com/embed/78VnZ07iYp8',
  'secondary-1-planificacion_y_metas': 'https://www.youtube.com/embed/3S1t0rBw4tQ',
  'secondary-1-iniciacion_al_emprendimiento': 'https://www.youtube.com/embed/wld7rFE9SS4',
};

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '_');
}

function deriveModality(unitRaw: any): Modality {
  const title = (unitRaw.title || "").toLowerCase();
  if (title.includes('simulador') || title.includes('juego')) return 'simulator';
  if (title.includes('video')) return 'video';
  return 'reading';
}

export async function getPillarsForGrade(grade: number, schoolLevel: string = 'primary'): Promise<PillarMeta[]> {
  const levelKey = (schoolLevel || 'primary').toLowerCase().includes('secundar') ? 'secondary' : 'primary';
  const source = await getCurriculumData(grade, schoolLevel);

  if (!source) return [];

  const categories: Record<string, Unit[]> = {};
  
  Object.keys(source).forEach(key => {
    const unitRaw = source[key];
    if (!unitRaw || typeof unitRaw !== 'object' || !unitRaw.code) return;

    const category = unitRaw.category || 'General';
    if (!categories[category]) categories[category] = [];
    
    const unit: Unit = {
      code: unitRaw.code,
      title: unitRaw.title || 'Sin Título',
      order: parseInt(unitRaw.code.split('-')[2]) || parseInt(unitRaw.code.split('-')[1]) || 0,
      modality: deriveModality(unitRaw),
      priority: 'essential',
      objective: unitRaw.metadata?.objective || unitRaw.objective || '',
      contents: [
        { type: 'theory', label: 'Marco Teórico', url: null, required: true },
        { type: 'simulator', label: 'Laboratorio / Ejercicio', url: null, required: false },
        { type: 'quiz', label: 'Evaluación', url: null, required: true },
      ],
      metadata: unitRaw.metadata,
      strategy: unitRaw.strategy,
      theory: unitRaw.theory,
      evaluation: unitRaw.evaluation,
    };
    
    categories[category].push(unit);
  });

  return Object.entries(categories).map(([name, units]) => {
    const style = CATEGORY_STYLES[name] || { gradient: 'from-slate-700 to-slate-900', ring: '#334155', icon: '📚' };
    const pillarId = slugify(name);
    const videoKey = `${levelKey}-${grade}-${pillarId}`;
    
    return {
      id: pillarId,
      title: name,
      shortTitle: name.split(' ')[0],
      videoUrl: PILLAR_VIDEOS[videoKey] || null,
      ...style,
      color: style.ring,
      units: units.sort((a, b) => a.order - b.order),
    };
  });
}

export const GRADE_INFO: Record<string, { title: string; objective: string; briefing: string; skills: string[]; accentColor: string; secondaryColor: string; coreImage: string; introVideo: string; arenaQuiz: QuizQuestion[] }> = {
  'primary-1': {
    title: 'Mis Primeros Pesos',
    objective: 'Descubrir el valor del dinero y el esfuerzo personal.',
    briefing: '¡Bienvenido a tu primer gran viaje financiero! Aquí aprenderás que el dinero no es magia, sino el resultado del esfuerzo y el trabajo. Conocerás a los ajolotes y héroes de nuestros billetes, y descubrirás el superpoder de guardar monedas en tu primer cochinito para cumplir tus sueños.',
    skills: ['Reconocimiento de Monedas', 'El Valor del Trabajo', 'Mi Primer Ahorro'],
    accentColor: '#FF8C00',
    secondaryColor: '#FFD700',
    coreImage: '/assets/landing-v3/Primaria1.png',
    introVideo: 'https://www.youtube.com/embed/gf3_Kr69zXY',
    arenaQuiz: [
      { q: '¿Qué es el dinero?', options: ['Papel mágico', 'Un medio para intercambiar bienes y servicios', 'Un juguete'], correct: 1, explanation: 'El dinero es una herramienta que inventamos para facilitar el intercambio de cosas sin tener que cargar con bultos pesados.' },
      { q: '¿Cómo se llaman los animales en el billete de 50 pesos?', options: ['Perros', 'Ajolotes', 'Gatos'], correct: 1, explanation: 'El ajolote es un símbolo de nuestra biodiversidad y aparece en el billete más bonito del mundo.' },
      { q: '¿Para qué sirve ahorrar?', options: ['Para gastar todo hoy', 'Para cumplir metas en el futuro', 'Para perder el dinero'], correct: 1, explanation: 'Ahorrar es guardar un poco hoy para poder comprar algo más grande o importante mañana.' },
      { q: '¿De dónde viene el dinero que recibimos?', options: ['Del esfuerzo y el trabajo', 'De los árboles', 'Del cielo'], correct: 0, explanation: 'El dinero se gana aportando nuestro talento, tiempo y esfuerzo en alguna actividad productiva.' },
      { q: '¿Qué es un cochinito o alcancía?', options: ['Un juguete', 'Un lugar seguro para guardar ahorros', 'Una mascota'], correct: 1, explanation: 'Es tu primer cofre del tesoro donde guardas tus monedas para que no se pierdan y crezcan.' },
      { q: '¿Cuál es la moneda de México?', options: ['Dólar', 'Peso Mexicano', 'Euro'], correct: 1, explanation: 'El Peso Mexicano es nuestra moneda oficial y nos identifica en todo el mundo.' },
      { q: '¿Qué es un gasto?', options: ['Guardar dinero', 'Usar dinero para comprar algo', 'Recibir un regalo'], correct: 1, explanation: 'Gastar es cuando entregamos dinero a cambio de un juguete, comida o servicio que necesitamos.' },
      { q: 'Si ahorro 10 pesos cada día, ¿tendré más o menos dinero mañana?', options: ['Menos', 'Igual', 'Más'], correct: 2, explanation: '¡Exacto! El ahorro es acumulativo: mientras más días guardes, más grande será tu tesoro.' },
      { q: '¿Por qué es importante cuidar el dinero?', options: ['Porque es difícil de ganar y sirve para nuestras necesidades', 'Porque brilla', 'No es importante'], correct: 0, explanation: 'Cuidar el dinero es valorar el trabajo de tus papás y asegurar que siempre tengamos lo necesario.' },
      { q: '¿Qué es un deseo?', options: ['Algo que necesito para vivir', 'Algo que me gustaría tener pero no es vital', 'Comida'], correct: 1, explanation: 'Un deseo es un gusto, como un helado o un juguete, mientras que una necesidad es algo vital como el agua.' }
    ]
  },
  'primary-2': {
    title: 'El Origen de la Riqueza',
    objective: 'Comprender la historia del dinero y la administración del hogar.',
    briefing: '¡Viajemos en el tiempo! En este grado descubrirás cómo pasamos del trueque al cacao, y de ahí a los hermosos billetes que usamos hoy. Aprenderás a identificar cada marca de seguridad y comprenderás cómo tus papás traen el sustento a casa para cuidar los gastos del hogar.',
    skills: ['Historia del Trueque', 'Marcas de Seguridad', 'Ingresos y Gastos'],
    accentColor: '#F59E0B',
    secondaryColor: '#FB1818',
    coreImage: '/assets/landing-v3/Primaria2.png',
    introVideo: 'https://www.youtube.com/embed/VBbg_lsuA2w',
    arenaQuiz: [
      { q: '¿Qué usaban antes de que existieran las monedas en México?', options: ['Piedras', 'Cacao y plumas', 'Dulces'], correct: 1, explanation: 'Nuestros antepasados valoraban el cacao porque era difícil de conseguir y muy útil.' },
      { q: '¿Qué es el trueque?', options: ['Comprar con tarjeta', 'Intercambiar un objeto por otro sin usar dinero', 'Regalar cosas'], correct: 1, explanation: 'Fue la primera forma de comercio: yo te doy mis manzanas y tú me das tus plátanos.' },
      { q: '¿Cómo podemos saber si un billete es real?', options: ['Por el color', 'Revisando sus marcas de seguridad', 'Porque es suave'], correct: 1, explanation: 'Los billetes tienen texturas y elementos que brillan para evitar que alguien intente copiarlos.' },
      { q: '¿Qué es un ingreso?', options: ['El dinero que entra a la casa por el trabajo', 'El dinero que gastamos en el súper', 'Un regalo'], correct: 0, explanation: 'El ingreso es todo el dinero que recibimos como fruto de nuestra labor o negocio.' },
      { q: '¿Qué es un presupuesto familiar?', options: ['Un plan para saber cuánto dinero entra y cuánto se gasta', 'Una lista de compras', 'Un juego de mesa'], correct: 0, explanation: 'Es como el mapa de un navegante: nos dice cuánto dinero tenemos y en qué vamos a usarlo.' },
      { q: '¿Quién imprime los billetes en México?', options: ['La escuela', 'El Banco de México', 'Los bancos comerciales'], correct: 1, explanation: 'El Banco de México es la única institución autorizada para fabricar nuestro dinero.' },
      { q: '¿Cuál es una marca de seguridad de un billete?', options: ['Su tamaño', 'El hilo dinámico y la marca de agua', 'El dibujo del héroe'], correct: 1, explanation: 'Si pones el billete a la luz, verás la marca de agua, ¡esa es una prueba de que es real!' },
      { q: '¿Qué pasa si gastamos más de lo que ganamos?', options: ['Tenemos ahorros', 'Nos endeudamos', 'No pasa nada'], correct: 1, explanation: 'Gastar de más crea deudas, lo cual es como cargar una mochila muy pesada que debemos pagar después.' },
      { q: '¿Qué es la escasez?', options: ['Cuando hay mucho de todo', 'Cuando los recursos son limitados para nuestras necesidades', 'Un tipo de moneda'], correct: 1, explanation: 'La escasez significa que no podemos tener todo lo que queremos, por eso debemos elegir bien.' },
      { q: '¿Por qué el cacao era valioso?', options: ['Porque era rico', 'Porque era difícil de obtener y servía como moneda', 'Porque era grande'], correct: 1, explanation: 'Al ser difícil de cultivar, se convirtió en una unidad de valor muy respetada en el México antiguo.' }
    ]
  },
  'primary-3': {
    title: 'Mi Plan de Tesoros',
    objective: 'Dominar la planificación básica y la distinción de necesidades.',
    briefing: 'Es hora de convertirte en un administrador experto. Aprenderás la diferencia vital entre lo que "quieres" y lo que "necesitas", y cómo registrar tus monedas para que nunca te falte. Diseñarás tu primer presupuesto familiar y verás cómo el orden trae abundancia.',
    skills: ['Deseos vs Necesidades', 'Registro de Gastos', 'Presupuesto Familiar'],
    accentColor: '#10B981',
    secondaryColor: '#34D399',
    coreImage: '/assets/landing-v3/Primaria3.png',
    introVideo: 'https://www.youtube.com/embed/cqZ9SeURemg',
    arenaQuiz: [
      { q: '¿Cuál es la diferencia entre necesidad y deseo?', options: ['No hay diferencia', 'Necesidad es vital para vivir, deseo es algo opcional', 'Deseo es más importante'], correct: 1, explanation: 'Las necesidades como el agua son prioridad. Los deseos como un juguete pueden esperar.' },
      { q: '¿Qué es un gasto fijo?', options: ['Comprar un juguete', 'Pagar la renta o los servicios de la casa cada mes', 'Un regalo de cumpleaños'], correct: 1, explanation: 'Los gastos fijos son compromisos que tenemos que pagar sí o sí cada mes.' },
      { q: '¿Por qué es importante registrar los gastos?', options: ['Para saber en qué se nos va el dinero y poder ahorrar', 'Para gastar más', 'Por diversión'], correct: 0, explanation: 'Si no sabes en qué gastas, el dinero se te escapará como agua entre las manos.' },
      { q: '¿Qué es una meta de ahorro?', options: ['Un sueño sin plan', 'Un objetivo con tiempo y cantidad de dinero definida', 'Guardar dinero sin razón'], correct: 1, explanation: 'Una meta clara (qué, cuánto y cuándo) es el primer paso para lograr tus sueños.' },
      { q: '¿Cuál es un ejemplo de necesidad?', options: ['Videojuegos', 'Alimentación sana', 'Ropa de marca'], correct: 1, explanation: 'La comida es vital para tu salud, por lo tanto es una necesidad básica.' },
      { q: '¿Qué es un fondo de emergencia?', options: ['Dinero para comprar dulces', 'Ahorro guardado solo para imprevistos o accidentes', 'Dinero para vacaciones'], correct: 1, explanation: 'Es tu "paracaídas financiero" para cuando ocurra algo inesperado y urgente.' },
      { q: '¿Cómo podemos ahorrar en casa?', options: ['Dejando las luces prendidas', 'Cuidando el agua y la electricidad', 'Comprando todo lo que vemos'], correct: 1, explanation: 'Cuidar los recursos de casa también es una forma inteligente de ahorrar dinero familiar.' },
      { q: '¿Qué es el consumo responsable?', options: ['Comprar lo primero que vemos', 'Pensar antes de comprar si realmente lo necesitamos', 'Comprar lo más caro'], correct: 1, explanation: 'Un consumidor responsable cuida su dinero y el planeta haciendo compras inteligentes.' },
      { q: '¿Qué herramienta nos ayuda a planear el dinero?', options: ['El presupuesto', 'La televisión', 'El control remoto'], correct: 0, explanation: 'El presupuesto es tu mejor aliado para tener el control total de tus finanzas.' },
      { q: 'Si mi presupuesto dice que tengo 100 pesos y gasto 120, ¿qué tengo?', options: ['Ahorro', 'Déficit (me falta dinero)', 'Ganancia'], correct: 1, explanation: 'Déficit significa que gastaste más de lo que tenías, ¡cuidado con eso!' }
    ]
  },
  'primary-4': { 
    title: 'Guardianes del Banco', 
    objective: 'Descubrir el funcionamiento de los bancos y las herramientas de ahorro formal.',
    briefing: 'En este nivel, te convertirás en un experto del sistema financiero formal. Aprenderás por qué los bancos son el fortín de la economía, cómo proteger tu dinero con tecnología y cómo vencer al "monstruo" de la inflación que hace que las cosas cuesten más cada año.',
    skills: ['Cuentas de Ahorro', 'Seguridad Bancaria', 'Control de Inflación'],
    accentColor: '#06B6D4',
    secondaryColor: '#22D3EE',
    coreImage: '/assets/landing-v3/Primaria4.png',
    introVideo: 'https://www.youtube.com/embed/ceq7pZaJ-pk',
    arenaQuiz: [
      { q: '¿Para qué sirven principalmente los bancos?', options: ['Para regalar dinero', 'Para cuidar el dinero y dar préstamos', 'Para fabricar billetes'], correct: 1, explanation: 'Los bancos conectan a quienes tienen ahorros con quienes necesitan préstamos para crecer.' },
      { q: '¿Qué es el interés en una cuenta de ahorro?', options: ['Un cobro que nos hace el banco', 'Un premio que nos da el banco por guardar nuestro dinero con ellos', 'Un impuesto'], correct: 1, explanation: 'Es la recompensa que recibes por permitir que el banco use tu dinero para dar créditos.' },
      { q: '¿Qué es la inflación?', options: ['Cuando el dinero vale más', 'El aumento generalizado de los precios que hace que el dinero alcance para menos', 'Cuando los globos se inflan'], correct: 1, explanation: 'La inflación es como un viento que empuja los precios hacia arriba, restando valor a tu dinero.' },
      { q: '¿Qué es un cajero automático?', options: ['Una máquina que imprime dinero', 'Un dispositivo para retirar dinero de nuestra cuenta', 'Un teléfono público'], correct: 1, explanation: 'Es una herramienta que te permite acceder a tu dinero del banco en cualquier momento.' },
      { q: '¿Por qué es más seguro el banco que debajo del colchón?', options: ['Porque el banco tiene cámaras', 'Porque el dinero está protegido contra robos y genera intereses', 'Porque es más grande'], correct: 1, explanation: 'El ahorro formal en bancos está protegido y te ayuda a que tu dinero no pierda valor.' },
      { q: '¿Qué es una tarjeta de débito?', options: ['Dinero prestado', 'Una herramienta para usar el dinero que ya tenemos en el banco', 'Un juguete de plástico'], correct: 1, explanation: 'Usar débito es usar tu propio dinero sin tener que cargar efectivo físicamente.' },
      { q: '¿Qué es un préstamo bancario?', options: ['Dinero que el banco nos da y no hay que devolver', 'Dinero que el banco nos presta y debemos devolver con interés', 'Un regalo'], correct: 1, explanation: 'Es capital que el banco te confía para una meta, el cual debes pagar responsablemente.' },
      { q: '¿Qué es el historial crediticio?', options: ['Un cuento sobre bancos', 'El registro de cómo hemos pagado nuestras deudas', 'Una lista de ahorros'], correct: 1, explanation: 'Es tu "boleta de calificaciones" financiera que dice si eres una persona de palabra y confianza.' },
      { q: '¿Qué es la banca digital?', options: ['Jugar con dinero en internet', 'Usar los servicios del banco desde el celular o computadora', 'Comprar juegos'], correct: 1, explanation: 'Es la tecnología que te permite administrar tu dinero con un clic desde cualquier lugar.' },
      { q: '¿Por qué suben los precios con la inflación?', options: ['Porque las cosas valen menos', 'Por el aumento de costos y la demanda', 'Porque sí'], correct: 1, explanation: 'Cuando hay mucha demanda o suben los costos de producción, los precios tienden a elevarse.' }
    ]
  },
  'primary-5': { 
    title: 'ADN Emprendedor', 
    objective: 'Lanzar proyectos con valor agregado y entender la inversión básica.',
    briefing: '¡Prepara tu primera empresa! Aquí descubrirás el secreto de la inversión: hacer que el dinero trabaje para ti. Aprenderás a crear productos con valor agregado, a calcular ganancias reales y a entender que cada riesgo es una oportunidad si tienes un plan sólido.',
    skills: ['Valor Agregado', 'Cálculo de Ganancias', 'Inversión Inicial'],
    accentColor: '#3B82F6',
    secondaryColor: '#60A5FA',
    coreImage: '/assets/landing-v3/Primaria5.png',
    introVideo: 'https://www.youtube.com/embed/Et7LuL8yqE4',
    arenaQuiz: [
      { q: '¿Qué es un emprendedor?', options: ['Alguien que trabaja en una oficina', 'Alguien que identifica una oportunidad y crea un proyecto o negocio', 'Un deportista'], correct: 1, explanation: 'Un emprendedor es alguien que se atreve a convertir una idea en una solución para los demás.' },
      { q: '¿Qué es el valor agregado?', options: ['Cobrar más caro porque sí', 'Una característica extra que hace que un producto sea mejor o diferente a los demás', 'El precio de envío'], correct: 1, explanation: 'Es ese "toque especial" que hace que la gente elija tu producto por encima de otros.' },
      { q: '¿Cuál es la fórmula básica de la ganancia?', options: ['Venta + Costo', 'Venta - Costo', 'Solo la venta'], correct: 1, explanation: 'La ganancia es lo que te queda después de restar todos los gastos que tuviste para vender.' },
      { q: '¿Qué es la inversión?', options: ['Gastar dinero en lujos', 'Poner dinero en un proyecto esperando que crezca en el futuro', 'Guardar dinero en el colchón'], correct: 1, explanation: 'Invertir es sembrar dinero hoy para cosechar beneficios mucho mayores en el futuro.' },
      { q: '¿Qué es un estudio de mercado?', options: ['Ir a comprar al súper', 'Investigar qué necesitan y quieren los clientes antes de vender', 'Limpiar el local'], correct: 1, explanation: 'Es conocer a tu público para asegurar que lo que vas a ofrecer realmente les interese.' },
      { q: '¿Cuál es el principal riesgo de una inversión?', options: ['Ganar mucho dinero', 'Perder parte o todo el dinero invertido', 'Que nadie se entere'], correct: 1, explanation: 'Toda inversión tiene un riesgo, por eso es vital informarse bien antes de poner tu capital.' },
      { q: '¿Qué es la publicidad?', options: ['Hacer el producto', 'Comunicar los beneficios de nuestro producto para que la gente lo conozca', 'Cobrarle al cliente'], correct: 1, explanation: 'Es la voz de tu negocio: le cuenta al mundo por qué tu producto es genial.' },
      { q: '¿Qué es el capital inicial?', options: ['El dinero final de la empresa', 'El dinero necesario para comenzar un proyecto', 'La ciudad más importante'], correct: 1, explanation: 'Es la "chispa" de dinero necesaria para encender el motor de tu nuevo negocio.' },
      { q: '¿Qué significa innovar?', options: ['Copiar lo que hacen otros', 'Crear algo nuevo o mejorar algo que ya existe de forma creativa', 'Vender lo mismo'], correct: 1, explanation: 'Innovar es buscar mejores formas de hacer las cosas para sorprender positivamente al mercado.' },
      { q: '¿Por qué es importante tener socios?', options: ['Para pelear', 'Para compartir habilidades, trabajo y capital', 'Para no trabajar'], correct: 1, explanation: 'Un buen socio complementa tus talentos y te ayuda a llegar más lejos que yendo solo.' }
    ]
  },
  'primary-6': { 
    title: 'Pasaporte Financiero Global', 
    objective: 'Navegar el comercio global y los impuestos con ética financiera.',
    briefing: 'Estás por terminar la primaria y el mundo te espera. Aprenderás cómo funciona el comercio internacional, por qué existen los impuestos y cómo tu ética financiera define tu éxito. Entenderás el tipo de cambio y cómo los mercados globales afectan tu día a día.',
    skills: ['Comercio Global', 'Cultura Fiscal', 'Ética Financiera'],
    accentColor: '#6366F1',
    secondaryColor: '#818CF8',
    coreImage: '/assets/landing-v3/Primaria6.png',
    introVideo: 'https://www.youtube.com/embed/iry2ikhKt9Y',
    arenaQuiz: [
      { q: '¿Qué son los impuestos?', options: ['Donaciones voluntarias', 'Pagos obligatorios al gobierno para servicios públicos como calles y escuelas', 'Regalos al banco'], correct: 1, explanation: 'Los impuestos son la contribución de todos para tener servicios que beneficien a la comunidad.' },
      { q: '¿Qué es el comercio internacional?', options: ['Comprar en la tienda de la esquina', 'El intercambio de productos y servicios entre diferentes países', 'Vender cosas usadas'], correct: 1, explanation: 'Es lo que permite que comas frutas de otros países o uses tecnología de todo el mundo.' },
      { q: '¿Qué es el tipo de cambio?', options: ['Cambiar de opinión', 'El valor de una moneda comparado con otra (ej. Peso vs Dólar)', 'Cambiar un billete por monedas'], correct: 1, explanation: 'Es el "precio" de una moneda extranjera, esencial para comprar cosas fuera del país.' },
      { q: '¿Qué es la ética financiera?', options: ['Ganar dinero a cualquier costo', 'Tomar decisiones con honestidad y responsabilidad en el manejo del dinero', 'Ser rico'], correct: 1, explanation: 'Tu integridad es tu activo más valioso; hacer lo correcto siempre trae mejores resultados a largo plazo.' },
      { q: '¿Para qué sirve el RFC en México?', options: ['Para entrar al cine', 'Es la clave para identificarnos ante el sistema de impuestos (SAT)', 'Para abrir Facebook'], correct: 1, explanation: 'Es tu "identificación fiscal" que dice que eres un ciudadano que contribuye al país.' },
      { q: '¿Qué es una exportación?', options: ['Comprar cosas del extranjero', 'Vender productos de nuestro país a otros países', 'Viajar por el mundo'], correct: 1, explanation: 'Es cuando México comparte su talento y productos con el resto del planeta.' },
      { q: '¿Qué es una importación?', options: ['Vender a otros países', 'Traer productos del extranjero para consumirlos en nuestro país', 'Vender en el mercado'], correct: 1, explanation: 'Es traer lo mejor del mundo a nuestro país para mejorar nuestra calidad de vida.' },
      { q: '¿Qué es el IVA?', options: ['Un tipo de ahorro', 'El Impuesto al Valor Agregado que pagamos en la mayoría de las compras', 'Un descuento'], correct: 1, explanation: 'Es un impuesto que ya viene incluido en el precio de casi todo lo que compramos.' },
      { q: '¿Por qué los países comercian entre sí?', options: ['Porque les gusta viajar', 'Porque ningún país produce todo lo que necesita', 'Por obligación'], correct: 1, explanation: 'El comercio global hace que todos los países sean más eficientes y tengan más opciones.' },
      { q: '¿Qué es el desarrollo sustentable?', options: ['Gastar todo hoy', 'Crecer económicamente cuidando el medio ambiente y el futuro', 'Solo plantar árboles'], correct: 1, explanation: 'Es progresar hoy sin comprometer los recursos de las niñas y niños del futuro.' }
    ]
  },
  'secondary-1': { 
    title: 'México: Poder y Economía', 
    objective: 'Analizar la historia económica de México y el impacto del comercio.',
    briefing: 'Bienvenidos a un análisis profundo de nuestra realidad. Estudiaremos las crisis que transformaron a México, el impacto de los tratados comerciales como el T-MEC y el fenómeno del Nearshoring. Comprenderás de dónde sale el dinero del gobierno y cómo afecta la deuda pública.',
    skills: ['Historia Económica', 'T-MEC y Nearshoring', 'Presupuesto Público'],
    accentColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    coreImage: '/assets/landing-v3/Secundaria1.png',
    introVideo: 'https://www.youtube.com/embed/KM8hGmclQP0',
    arenaQuiz: [
      { q: '¿Qué es el T-MEC?', options: ['Un tratado de paz', 'El Tratado comercial entre México, Estados Unidos y Canadá', 'Una marca de ropa'], correct: 1, explanation: 'Es la alianza más importante de México para facilitar la venta de nuestros productos en el extranjero.' },
      { q: '¿Qué significa el fenómeno del Nearshoring?', options: ['Vender por internet', 'La relocalización de empresas cerca de sus mercados principales (como empresas que vienen a México)', 'Comprar acciones'], correct: 1, explanation: 'Es una gran oportunidad para México, pues muchas empresas quieren estar cerca de EE.UU. e invierten aquí.' },
      { q: '¿Qué es el PIB?', options: ['Un impuesto', 'El Producto Interno Bruto, que mide toda la riqueza producida por un país en un año', 'Una clave secreta'], correct: 1, explanation: 'Es como el termómetro de la salud económica de un país: si sube, la economía está creciendo.' },
      { q: '¿Qué es el Banco de México (Banxico)?', options: ['Un banco comercial cualquiera', 'El banco central autónomo encargado de controlar la inflación y emitir moneda', 'El banco del gobierno'], correct: 1, explanation: 'Su misión principal es cuidar que tu dinero no pierda su valor frente a la subida de precios.' },
      { q: '¿Qué es la deuda pública?', options: ['El dinero que le debemos a Coppel', 'El dinero que el gobierno pide prestado para financiar sus gastos', 'Los impuestos'], correct: 1, explanation: 'Es capital que el país utiliza para obras y servicios, pero que debe manejarse con cuidado para no afectar el futuro.' },
      { q: '¿Cómo afecta la inflación al poder adquisitivo?', options: ['Lo aumenta', 'Lo disminuye (compramos menos con el mismo dinero)', 'No lo afecta'], correct: 1, explanation: 'Con una inflación alta, necesitas más billetes para comprar exactamente las mismas cosas.' },
      { q: '¿Qué es la política fiscal?', options: ['Vigilar a los policías', 'Las decisiones del gobierno sobre impuestos y gasto público', 'Las leyes de tránsito'], correct: 1, explanation: 'Son las reglas del juego que el gobierno pone para administrar el dinero de todos los ciudadanos.' },
      { q: '¿Qué es un arancel?', options: ['Un permiso de construcción', 'Un impuesto que se paga por importar o exportar bienes', 'Un tipo de moneda'], correct: 1, explanation: 'Se usa para regular el comercio y proteger o encarecer ciertos productos que vienen de fuera.' },
      { q: '¿Cuál es la principal fuente de ingresos del gobierno mexicano?', options: ['Los préstamos', 'La recaudación de impuestos y la venta de petróleo', 'Las multas'], correct: 1, explanation: 'Los impuestos (ISR, IVA) y la energía son los pilares que sostienen el presupuesto del país.' },
      { q: '¿Qué es la balanza comercial?', options: ['Una báscula para barcos', 'La diferencia entre lo que un país exporta y lo que importa', 'El peso de las monedas'], correct: 1, explanation: 'Si exportamos más de lo que importamos, tenemos un superávit comercial, ¡lo cual es genial!' }
    ]
  },
  'secondary-2': { 
    title: 'Arquitectos de Inversión', 
    objective: 'Dominar el interés compuesto y la gestión de activos y pasivos.',
    briefing: 'En este grado construirás los cimientos de tu fortuna. Dominarás la fuerza más poderosa del universo: el interés compuesto. Aprenderás la diferencia real entre activos y pasivos, y cómo usar los seguros y el mercado de valores para proteger y crecer tu patrimonio.',
    skills: ['Interés Compuesto', 'Activos vs Pasivos', 'Mercado de Valores'],
    accentColor: '#D946EF',
    secondaryColor: '#E879F9',
    coreImage: '/assets/landing-v3/Secundaria2.png',
    introVideo: 'https://www.youtube.com/embed/aGLKmZm3jmU',
    arenaQuiz: [
      { q: '¿Qué es el interés compuesto?', options: ['Interés que se cobra una sola vez', 'Interés que se calcula sobre el capital y también sobre los intereses acumulados', 'Un tipo de descuento'], correct: 1, explanation: 'Einstein lo llamó la octava maravilla del mundo, porque hace que tu dinero crezca de forma exponencial.' },
      { q: '¿Qué es un activo financiero?', options: ['Algo que saca dinero de tu bolsillo', 'Algo que pone dinero en tu bolsillo (genera ingresos o valor)', 'Una deuda'], correct: 1, explanation: 'Los activos son tus mejores amigos: trabajan para ti generando más dinero incluso mientras duermes.' },
      { q: '¿Qué es un pasivo?', options: ['Una inversión', 'Una obligación o deuda que saca dinero de tu bolsillo', 'Una cuenta de ahorro'], correct: 1, explanation: 'Los pasivos consumen tus ingresos; el secreto de la riqueza es tener más activos que pasivos.' },
      { q: '¿Qué es la Bolsa de Valores?', options: ['Un mercado donde se compran y venden acciones de empresas', 'Una tienda de carteras', 'El banco central'], correct: 0, explanation: 'Es el lugar donde puedes convertirte en socio de las empresas más grandes del mundo.' },
      { q: '¿Qué significa diversificar una inversión?', options: ['Poner todo el dinero en una sola opción', 'Repartir el dinero en diferentes tipos de inversión para reducir el riesgo', 'Gastar el dinero'], correct: 1, explanation: '"No pongas todos los huevos en la misma canasta"; así proteges tu capital de caídas inesperadas.' },
      { q: '¿Qué es una acción (Stock)?', options: ['Un préstamo a una empresa', 'Una pequeña parte de la propiedad de una empresa', 'Un bono del gobierno'], correct: 1, explanation: 'Ser accionista es ser dueño de una parte del éxito y las utilidades de una compañía.' },
      { q: '¿Cuál es la relación entre riesgo y rendimiento?', options: ['A menor riesgo, mayor rendimiento', 'A mayor riesgo, suele haber un mayor rendimiento potencial', 'No tienen relación'], correct: 1, explanation: 'Para ganar más, usualmente debes estar dispuesto a aceptar un mayor nivel de incertidumbre.' },
      { q: '¿Qué es un seguro?', options: ['Un gasto innecesario', 'Un contrato para protegerse financieramente contra riesgos o accidentes', 'Una cuenta bancaria'], correct: 1, explanation: 'El seguro es la herramienta que evita que un accidente borre todos tus ahorros de un plumazo.' },
      { q: '¿Qué es el fondo para el retiro (AFORE)?', options: ['Dinero para las vacaciones', 'Una cuenta de ahorro a largo plazo para cuando dejemos de trabajar por edad', 'Un impuesto'], correct: 1, explanation: 'Es tu "yo del futuro" agradeciéndote hoy por asegurar su tranquilidad y bienestar.' },
      { q: '¿Qué es la libertad financiera?', options: ['Poder gastar sin límite', 'Cuando tus ingresos pasivos cubren todos tus gastos de vida', 'Tener mucho crédito'], correct: 1, explanation: 'Es el punto donde dejas de trabajar por dinero y el dinero empieza a trabajar por ti.' }
    ]
  },
  'secondary-3': { 
    title: 'Visión 360: El Futuro', 
    objective: 'Elaborar un plan financiero integral desde los 15 hasta los 65 años.',
    briefing: 'Estás en la cumbre de tu formación Diamond. Aquí diseñarás tu hoja de ruta para la vida adulta: desde tu primera declaración de impuestos hasta tu estrategia de inversión global. Aprenderás a levantar capital para startups y a navegar la complejidad del mundo financiero con visión estratégica.',
    skills: ['Estrategia Fiscal', 'Venture Capital', 'Plan de Vida 360º'],
    accentColor: '#F43F5E',
    secondaryColor: '#FB7185',
    coreImage: '/assets/landing-v3/Secundaria3.png',
    introVideo: 'https://www.youtube.com/embed/9_3jOn3FOyA',
    arenaQuiz: [
      { q: '¿Qué es un plan financiero integral?', options: ['Una lista de deseos', 'Un documento que proyecta ingresos, gastos, ahorros e inversiones a largo plazo', 'Un presupuesto del mes'], correct: 1, explanation: 'Es el plano arquitectónico de tu vida económica que te guía hacia el éxito generacional.' },
      { q: '¿Qué es el Venture Capital (Capital de Riesgo)?', options: ['Préstamos bancarios', 'Inversión en startups o empresas con alto potencial de crecimiento y alto riesgo', 'Ahorro formal'], correct: 1, explanation: 'Es el combustible que impulsa a las empresas más innovadoras del mundo a cambiar el futuro.' },
      { q: '¿Qué es una Startup?', options: ['Cualquier negocio pequeño', 'Una empresa joven diseñada para crecer muy rápido mediante tecnología o innovación', 'Una tienda tradicional'], correct: 1, explanation: 'Las startups no solo venden productos, resuelven problemas a escala global con tecnología.' },
      { q: '¿Qué es el flujo de caja personal (Cash Flow)?', options: ['El dinero que tengo en el banco', 'La diferencia entre el dinero que entra y el que sale en un periodo', 'Mi deuda total'], correct: 1, explanation: 'El flujo de caja positivo es el oxígeno de tu salud financiera; sin él, no puedes crecer.' },
      { q: '¿Qué significa la planeación sucesoria?', options: ['Planear las vacaciones', 'Organizar cómo se repartirán los bienes y el patrimonio en el futuro', 'Cambiar de trabajo'], correct: 1, explanation: 'Es asegurar que tu esfuerzo y patrimonio trasciendan y cuiden a tus seres queridos.' },
      { q: '¿Qué es un inversionista ángel?', options: ['Un banco caritativo', 'Una persona que aporta capital y consejos a startups en sus etapas iniciales', 'Un empleado público'], correct: 1, explanation: 'Son mentores con capital que creen en el talento de los emprendedores desde el día uno.' },
      { q: '¿Qué es la optimización fiscal?', options: ['No pagar impuestos', 'Usar estrategias legales para reducir la carga de impuestos y maximizar el ahorro', 'Evadir al SAT'], correct: 1, explanation: 'Es ser inteligente con las leyes para que el dinero trabaje eficientemente en tu patrimonio.' },
      { q: '¿Qué es el apalancamiento financiero?', options: ['Usar una palanca real', 'Usar deuda para financiar una inversión con la esperanza de ganar más que el costo del préstamo', 'Ahorrar mucho'], correct: 1, explanation: 'Es un multiplicador de resultados, pero requiere maestría para no convertirse en un riesgo fatal.' },
      { q: '¿Cuál es la importancia del fondo de paz mental?', options: ['Para ir de fiesta', 'Tener liquidez inmediata para cubrir 3 a 6 meses de gastos ante cualquier crisis', 'Comprar acciones'], correct: 1, explanation: 'Tener este fondo te permite tomar decisiones desde la estrategia y no desde el miedo.' },
      { q: '¿Qué define a un líder financiero Diamond?', options: ['Tener mucho dinero', 'Tener visión estratégica, ética, y un plan sólido para generar valor en la sociedad', 'Saber gastar'], correct: 1, explanation: 'Un líder Diamond no solo acumula riqueza, sino que crea prosperidad duradera para su entorno.' }
    ]
  },
};

export function getGradeMetadata(grade: number, schoolLevel: string = 'primary') {
  const levelKey = schoolLevel.startsWith('secondary') ? 'secondary' : 'primary';
  const key = `${levelKey}-${grade}`;
  return GRADE_INFO[key] || { 
    title: `Misión Académica Grado ${grade}`,
    objective: 'Desarrollar competencias financieras de alto nivel.',
    briefing: 'Bienvenido a tu mapa de aprendizaje.',
    skills: ['Ahorro', 'Inversión', 'Estrategia'],
    accentColor: '#FF8C00',
    secondaryColor: '#FFD700'
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export async function getCompletedActivities(userId: string): Promise<Set<string>> {
  if (!userId || userId === 'guest_user') return new Set();
  const query = Promise.resolve(supabase.from('progress').select('activity_id').eq('user_id', userId)
    .then(({ data }) => new Set((data ?? []).map((r: { activity_id: string }) => r.activity_id))));
  return withTimeout(query, 4000, new Set<string>());
}

export async function markActivityComplete(
  userId: string,
  activityId: string,
  opts: { score?: number; tiempo_segundos?: number; last_step?: number } = {}
) {
  console.info(`[markActivityComplete] Iniciando guardado — usuario:${userId.slice(0,8)}... actividad:${activityId}`);

  try {
    // Escribir a tabla intentos (nueva — métricas detalladas)
    const intentoPayload = {
      user_id:         userId,
      activity_id:     activityId,
      status:          'completed' as const,
      score:           opts.score ?? null,
      tiempo_segundos: opts.tiempo_segundos ?? null,
      last_step:       opts.last_step ?? null,
      completed_at:    new Date().toISOString(),
    };

    const [intentoResult, progressResult] = await Promise.all([
      withTimeout(
        supabase.from('intentos').insert(intentoPayload) as unknown as Promise<{ error: { message: string; code?: string } | null }>,
        3000,
        { error: { message: 'timeout', code: 'TIMEOUT' } }
      ),
      // Mantener tabla progress por compatibilidad con código existente
      withTimeout(
        supabase.from('progress').upsert({ user_id: userId, activity_id: activityId }, { onConflict: 'user_id,activity_id' }) as unknown as Promise<{ error: { message: string; code?: string } | null }>,
        3000,
        { error: { message: 'timeout', code: 'TIMEOUT' } }
      ),
    ]);

    if (intentoResult.error) {
      console.warn(`[markActivityComplete] ⚠️ intentos falló — código:${intentoResult.error.code} msg:${intentoResult.error.message}`);
    }
    if (progressResult.error) {
      console.warn(`[markActivityComplete] ⚠️ progress falló — código:${progressResult.error.code} msg:${progressResult.error.message}`);
    }

    if (!intentoResult.error || !progressResult.error) {
      console.info(`[markActivityComplete] ✅ Guardado exitosamente — actividad:${activityId}`);
      return true;
    }

    // Ambas fallaron → encolar para sync offline
    console.error(`[markActivityComplete] ❌ Ambas escrituras fallaron, encolando offline`);
    addToSyncQueue(userId, activityId);
    return false;

  } catch (e: any) {
    console.error(`[markActivityComplete] ❌ Excepción inesperada — ${e?.message ?? e}`);
    addToSyncQueue(userId, activityId);
    return false;
  }
}

/**
 * Cola de Sincronización Local (Offline Resilience)
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SYNC_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function getSyncQueue(): { userId: string, activityId: string, attempts?: number, timestamp?: number }[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('cen_sync_queue');
  if (!saved) return [];
  try {
    const queue = JSON.parse(saved);
    if (!Array.isArray(queue)) {
      localStorage.removeItem('cen_sync_queue');
      return [];
    }
    const now = Date.now();
    const valid = queue.filter((item: any) => {
      if (!item || typeof item !== 'object') return false;
      if (!item.userId || !UUID_REGEX.test(item.userId)) return false;
      if (!item.activityId || typeof item.activityId !== 'string') return false;
      // Descartar items más viejos de 7 días
      if (item.timestamp && (now - item.timestamp) > SYNC_MAX_AGE_MS) {
        console.warn(`[SyncEngine] Descartando item expirado (>7 días): ${item.activityId}`);
        return false;
      }
      return true;
    });
    if (valid.length !== queue.length) {
      console.warn(`[SyncEngine] Limpiados ${queue.length - valid.length} items (inválidos o expirados) al cargar`);
      localStorage.setItem('cen_sync_queue', JSON.stringify(valid));
    }
    return valid;
  } catch {
    console.error('[SyncEngine] cen_sync_queue corrupto, limpiando');
    localStorage.removeItem('cen_sync_queue');
    return [];
  }
}

function addToSyncQueue(userId: string, activityId: string, attempts = 0) {
  if (typeof window === 'undefined') return;

  // Fix C: Validación de UUID para evitar contaminación
  if (!UUID_REGEX.test(userId)) {
    console.warn('[SyncEngine] Rechazando userId no-UUID:', userId);
    return;
  }

  const queue = getSyncQueue();
  // Evitar duplicados en la cola
  if (!queue.some(item => item.userId === userId && item.activityId === activityId)) {
    queue.push({ userId, activityId, attempts, timestamp: Date.now() });
    localStorage.setItem('cen_sync_queue', JSON.stringify(queue));
    console.info(`[SyncEngine] Actividad encolada offline: ${activityId} (cola total: ${queue.length + 1} items)`);
  }
}

export async function processSyncQueue() {
  if (typeof window === 'undefined') return;
  const queue = getSyncQueue();
  if (queue.length === 0) return;

  // Determinar estado de sesión para contexto de log
  let userContext = 'desconocido';
  try {
    const { data: { session } } = await supabase.auth.getSession();
    userContext = session?.user?.id ? `usuario:${session.user.id.slice(0, 8)}...` : 'invitado/sin-sesión';
  } catch { /* no bloquear el sync si falla la sesión */ }

  console.info(`[SyncEngine] Procesando cola: ${queue.length} item(s) | ${userContext}`);

  const results = await Promise.allSettled(
    queue.map(item => {
      item.attempts = (item.attempts || 0) + 1;
      return (supabase.from('progress').upsert(
        { user_id: item.userId, activity_id: item.activityId },
        { onConflict: 'user_id,activity_id' }
      ) as unknown as Promise<{ error: { message: string } | null }>)
    })
  );

  let synced = 0;
  let failed = 0;
  const remaining = queue.filter((item, i) => {
    const r = results[i];
    const isError = r.status === 'rejected' || (r.status === 'fulfilled' && (r.value as any)?.error);
    if (!isError) { synced++; return false; }
    failed++;
    if ((item.attempts || 0) >= 3) {
      console.warn(`[SyncEngine] Descartando actividad tras 3 fallos: ${item.activityId}`);
      return false;
    }
    return true;
  });

  console.info(`[SyncEngine] Resultado: ${synced} sincronizados, ${failed} fallidos, ${remaining.length} en cola`);
  localStorage.setItem('cen_sync_queue', JSON.stringify(remaining));
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cen_test_profile');
      if (saved) return JSON.parse(saved);
    }
    const { data: { session } } = await withTimeout(supabase.auth.getSession(), 5000, { data: { session: null }, error: null }) as any;
    if (!session) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (error || !data) return null;
    return { ...data, grade: deriveGrade(data.school_level) };
  } catch (e) {
    return null;
  }
}

function deriveGrade(schoolLevel: string | null): number {
  if (!schoolLevel) return 4;
  const match = schoolLevel.match(/\d+/);
  return match ? parseInt(match[0], 10) : (schoolLevel.toLowerCase().includes('secundar') ? 1 : 4);
}

export async function getQuizForUnit(unitCode: string): Promise<QuizQuestion[]> {
  const parts = unitCode.split('-');
  const grade = parseInt(parts[0].substring(1), 10);
  const schoolLevel = parts[0].startsWith('P') ? 'primary' : 'secondary';
  const source = await getCurriculumData(grade, schoolLevel);
  if (source && source[unitCode]) {
    const questions = source[unitCode].evaluation?.exam_questions || [];
    return questions.map((q: any) => ({
      q: q.question,
      options: q.options,
      correct: q.options.indexOf(q.correct) !== -1 ? q.options.indexOf(q.correct) : 0
    }));
  }
  return [{ q: '¿Qué es el ahorro?', options: ['Gastar todo', 'Guardar parte del dinero para después'], correct: 1 }];
}

export async function getArenaQuiz(grade: number, schoolLevel: string): Promise<QuizQuestion[]> {
  const key = `${schoolLevel.toLowerCase().includes('secundar') ? 'secondary' : 'primary'}-${grade}`;
  const info = GRADE_INFO[key];

  if (info && info.arenaQuiz) {
    return info.arenaQuiz;
  }

  const pillars = await getPillarsForGrade(grade, schoolLevel);
  const questions: QuizQuestion[] = [];
  pillars.flatMap((p: PillarMeta) => p.units).forEach((u: Unit) => {
    if (u.evaluation?.exam_questions) {
      u.evaluation.exam_questions.forEach((q: any) => {
        questions.push({ q: q.question, options: q.options, correct: q.options.indexOf(q.correct) !== -1 ? q.options.indexOf(q.correct) : 0, explanation: u.title });
      });
    }
  });
  return questions.sort(() => 0.5 - Math.random()).slice(0, 10);
}

export function getUnitStatus(unit: Unit, pillar: PillarMeta, completed: Set<string>) {
  // Verificamos si la unidad está completada buscando el ID de su quiz/evaluación (B)
  const isDone = completed.has(`ACT-${unit.code}-B`);
  if (isDone) return 'completed';

  // Lógica de desbloqueo secuencial opcional:
  // Si es la primera unidad, está disponible.
  // Si no, verificamos si la anterior está completada.
  const idx = pillar.units.findIndex(u => u.code === unit.code);
  if (idx === 0) return 'available';

  const prevUnit = pillar.units[idx - 1];
  const prevDone = completed.has(`ACT-${prevUnit.code}-B`);

  return prevDone ? 'available' : 'available'; // Forzamos 'available' para evitar bloqueos en demo, pero listos para activar
}

export function getPillarProgress(pillar: PillarMeta, completed: Set<string>) {
  // Una unidad se considera 'done' si su evaluación final (B) está en el set de completados
  const done = pillar.units.filter(u => completed.has(`ACT-${u.code}-B`)).length;
  return { done, total: pillar.units.length, pct: Math.round((done / pillar.units.length) * 100) };
}

export async function getPillarById(id: string, grade: number, schoolLevel: string = 'primary'): Promise<PillarMeta | null> {
  const pillars = await getPillarsForGrade(grade, schoolLevel);
  return pillars.find((p: PillarMeta) => p.id === id) || null;
}

export function checkRankUp(pillar: PillarMeta, oldCompleted: Set<string>, newCompleted: Set<string>) {
  const oldProgress = getPillarProgress(pillar, oldCompleted);
  const newProgress = getPillarProgress(pillar, newCompleted);

  const getRank = (pct: number) => {
    if (pct >= 100) return 'Diamond';
    if (pct >= 70) return 'Maestro';
    if (pct >= 40) return 'Experto';
    return 'Novato';
  };

  const oldRank = getRank(oldProgress.pct);
  const newRank = getRank(newProgress.pct);

  if (oldRank !== newRank) {
    return {
      pillarTitle: pillar.shortTitle,
      rank: newRank,
      color: newRank === 'Diamond' ? '#42E8E0' : (newRank === 'Maestro' ? '#FFD700' : '#C0C0C0')
    };
  }
  return null;
}
