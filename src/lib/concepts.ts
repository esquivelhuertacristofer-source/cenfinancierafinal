export interface ConceptCard {
  id: string;
  image: string;
  title: string;
  description: string;
  category: 'ahorro' | 'inversion' | 'gasto' | 'banco' | 'emprendimiento';
}

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: "c1",
    image: "/assets/memorama-financiero/1.webp",
    title: "¿Qué es el Dinero?",
    description: "Es un medio de intercambio aceptado por todos para comprar bienes y servicios.",
    category: "ahorro"
  },
  {
    id: "c2",
    image: "/assets/memorama-financiero/3.webp",
    title: "El Ahorro",
    description: "Es la parte de tus ingresos que no gastas hoy para usarla en el futuro.",
    category: "ahorro"
  },
  {
    id: "c3",
    image: "/assets/memorama-financiero/5.webp",
    title: "Necesidades",
    description: "Cosas indispensables para vivir como alimento, salud y vivienda.",
    category: "gasto"
  },
  {
    id: "c4",
    image: "/assets/memorama-financiero/7.webp",
    title: "Deseos",
    description: "Cosas que nos gustaría tener pero que no son vitales.",
    category: "gasto"
  },
  {
    id: "c5",
    image: "/assets/memorama-financiero/9.webp",
    title: "El Banco",
    description: "Institución segura donde guardamos nuestro dinero y pedimos préstamos.",
    category: "banco"
  },
  {
    id: "c6",
    image: "/assets/memorama-financiero/11.webp",
    title: "Inversión",
    description: "Hacer que tu dinero trabaje para ti y genere más dinero con el tiempo.",
    category: "inversion"
  },
  {
    id: "c7",
    image: "/assets/memorama-financiero/13.webp",
    title: "Presupuesto",
    description: "Un plan escrito para controlar cuánto dinero ganas y cuánto gastas.",
    category: "ahorro"
  },
  {
    id: "c8",
    image: "/assets/memorama-financiero/15.webp",
    title: "Emprendimiento",
    description: "Identificar una oportunidad y crear un proyecto para resolver una necesidad.",
    category: "emprendimiento"
  },
  {
    id: "c9",
    image: "/assets/memorama-financiero/17.webp",
    title: "Interés Compuesto",
    description: "El efecto de ganar intereses sobre tus intereses. ¡Magia financiera!",
    category: "inversion"
  },
  {
    id: "c10",
    image: "/assets/memorama-financiero/19.webp",
    title: "Tarjetas de Crédito",
    description: "Herramientas que te permiten pedir prestado dinero al banco para pagar después.",
    category: "banco"
  },
  {
    id: "c11",
    image: "/assets/memorama-financiero/21.webp",
    title: "Inflación",
    description: "El aumento de precios que hace que tu dinero valga menos con el tiempo.",
    category: "gasto"
  },
  {
    id: "c12",
    image: "/assets/memorama-financiero/23.webp",
    title: "Metas Financieras",
    description: "Objetivos claros que quieres alcanzar con tu dinero en un tiempo definido.",
    category: "ahorro"
  }
];
