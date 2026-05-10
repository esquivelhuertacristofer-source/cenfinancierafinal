export interface ExpertVideo {
  id: string;
  title: string;
  url: string;
  description: string;
  suggestedUnitCodes: string[]; // Códigos de unidad donde encaja
}

export const EXPERT_VIDEOS: ExpertVideo[] = [
  {
    id: "v1",
    title: "Qué es el Dinero",
    url: "https://youtu.be/euA26wBNTaY",
    description: "Introducción fundamental al concepto de valor y dinero.",
    suggestedUnitCodes: ["P1-1-1", "P1-1-2"]
  },
  {
    id: "v2",
    title: "Planeación de Emprendimiento",
    url: "https://youtu.be/9n6tYBTircw",
    description: "Cómo estructurar un proyecto desde cero.",
    suggestedUnitCodes: ["S1-4-1", "S2-4-2", "S3-4-1"]
  },
  {
    id: "v3",
    title: "Publicidad para Emprendedores",
    url: "https://youtu.be/ow4_mddYAv0",
    description: "Estrategias de comunicación para negocios.",
    suggestedUnitCodes: ["P5-2-1", "S1-4-3"]
  },
  {
    id: "v4",
    title: "Idea de Emprendimiento",
    url: "https://youtu.be/6-mrqSE7Zj0",
    description: "Buscando la chispa del negocio.",
    suggestedUnitCodes: ["P5-1-1", "S1-4-2"]
  },
  {
    id: "v5",
    title: "Encuentra tu Idea de Negocio",
    url: "https://youtu.be/EWoi5AB04E0",
    description: "Metodología para detectar oportunidades.",
    suggestedUnitCodes: ["S2-4-1"]
  },
  {
    id: "v6",
    title: "Espíritu Emprendedor",
    url: "https://youtu.be/-g4X4hT73uE",
    description: "La mentalidad necesaria para el éxito.",
    suggestedUnitCodes: ["P6-3-1", "S3-4-2"]
  },
  {
    id: "v7",
    title: "Deuda: Aliada o Enemiga",
    url: "https://youtu.be/MIWUnCeSCG0",
    description: "Entendiendo el crédito y el apalancamiento.",
    suggestedUnitCodes: ["P6-2-2", "S2-1-3", "S3-2-2"]
  },
  {
    id: "v8",
    title: "Metas y Sueños Futuros",
    url: "https://youtu.be/R6YnTizfCJw",
    description: "Planificación a largo plazo.",
    suggestedUnitCodes: ["P3-3-1", "P4-1-1", "S3-1-1"]
  },
  {
    id: "v9",
    title: "El Ahorro para Niños",
    url: "https://youtu.be/CjbymcqbRP8",
    description: "Primeros pasos guardando dinero.",
    suggestedUnitCodes: ["P1-2-1", "P2-1-1"]
  },
  {
    id: "v10",
    title: "Ahorro e Inversión",
    url: "https://youtu.be/APkZvcjD9j8",
    description: "La diferencia entre guardar y crecer.",
    suggestedUnitCodes: ["P4-2-1", "P5-3-1", "S2-1-1"]
  },
  {
    id: "v11",
    title: "Herramientas de Planificación",
    url: "https://youtu.be/DzXfFoGfuzA",
    description: "Apps y métodos para controlar tus finanzas.",
    suggestedUnitCodes: ["P3-2-1", "S1-3-1"]
  },
  {
    id: "v12",
    title: "Necesidades y Deseos",
    url: "https://youtu.be/ObsbwLBI1yc",
    description: "Priorizando el gasto de forma inteligente.",
    suggestedUnitCodes: ["P2-2-1", "P3-1-1"]
  },
  {
    id: "v13",
    title: "Crear Presupuestos",
    url: "https://youtu.be/5vMkPGBRvpA",
    description: "Dominando tus ingresos y egresos.",
    suggestedUnitCodes: ["P3-2-2", "P4-3-1", "S1-3-2"]
  },
  {
    id: "v14",
    title: "Ideas de Emprendimiento",
    url: "https://youtu.be/gsk6BhGFYgM",
    description: "Ejemplos reales de proyectos juveniles.",
    suggestedUnitCodes: ["P5-1-2"]
  },
  {
    id: "v15",
    title: "Dinero para Imprevistos",
    url: "https://youtu.be/fTtxJVKfdDw",
    description: "La importancia del fondo de emergencia.",
    suggestedUnitCodes: ["P4-1-3", "S1-2-2"]
  },
  {
    id: "v16",
    title: "Banco y Tarjetas",
    url: "https://youtu.be/T5Uj9wSlLWg",
    description: "Cómo funciona el sistema bancario formal.",
    suggestedUnitCodes: ["P4-3-1", "P5-2-2", "S1-2-1"]
  },
  {
    id: "v17",
    title: "Mis Ingresos y Plan Financiero",
    url: "https://youtu.be/lbrVfTSJPPU",
    description: "Estructurando tu economía personal.",
    suggestedUnitCodes: ["S1-1-1", "S2-1-2", "S3-1-2"]
  }
];
