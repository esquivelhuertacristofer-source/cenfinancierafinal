/**
 * La forma de los JSON de pedagogía, `public/data/pedagogia/<nivel>/<grado>.json`.
 *
 * DE DÓNDE SALEN ESTOS TIPOS. No de lo que debería haber, sino de lo que hay: se recorrieron las
 * 369 unidades de los nueve grados y se anotó qué campos aparecen y en cuántas. Por eso `strategy`,
 * `theory` y `evaluation` son opcionales —faltan en nueve o diez unidades, las de reto supremo, que
 * no tienen clase que planear— mientras que `metadata` está en todas. Ese "opcional" no es prudencia
 * defensiva: es un hecho del temario, y tiparlo obligatorio haría que el compilador dejara pasar los
 * `undefined` que sí ocurren.
 *
 * ESTOS OBJETOS LOS PINTA EL DOCENTE, NO EL ALUMNO. Alimentan el planeamiento y la ficha de unidad
 * del panel de profesor. El alumno ve `Unit` de `@/lib/hub`, que es otra cosa.
 */

/** Un tramo de la clase: qué se hace, cuánto dura y con qué actividad. */
export interface FasePedagogica {
  title: string;
  duration: string;
  description: string;
  activity: string;
}

/** La misma clase vista como línea de tiempo, para la barra del planeamiento. */
export interface TramoPedagogico {
  phase: string;
  duration: string;
  label: string;
}

export interface SeccionTeorica {
  subtitle: string;
  content: string;
}

export interface PreguntaDeExamen {
  question: string;
  options: string[];
  /** El texto de la opción correcta, no su índice. */
  correct: string;
}

export interface MetadatosDeUnidad {
  objective: string;
  competencies: string[];
  materials: string[];
  /* Etiquetas que algunos motores usan para rotular sus marcadores. No están en el JSON del
     temario: las inyecta el motor al construir la unidad, y por eso son opcionales y sueltas. */
  target_label?: string;
  recurso_label?: string;
  moneda_label?: string;
  meta_label?: string;
  knowledge_label?: string;
  action_label?: string;
}

export interface EstrategiaDeUnidad {
  phases: FasePedagogica[];
  timeline: TramoPedagogico[];
  objective?: string;
}

export interface TeoriaDeUnidad {
  introduction: string;
  sections: SeccionTeorica[];
}

/* NO HAY MAS CAMPOS, Y ESO SE COMPROBO.
   El codigo de la biblioteca leia ademas `concept`, `description`, `key_points` y `glossary`, con
   bloques enteros de interfaz colgando de ellos. Se recorrieron las 369 unidades de los nueve
   grados: `theory` contiene `introduction` y `sections`, y nada mas, en las 360 que la tienen. Esos
   bloques —"Puntos de Dominio" y "Glosario Tecnico"— nunca llegaron a pintarse una sola vez.
   Se quitaron. Si algun dia el temario incluye esos campos, el codigo esta en el historial de git:
   se recupera, no se reescribe. */

export interface EvaluacionDeUnidad {
  exam_questions: PreguntaDeExamen[];
  rubric: string;
}

/** Una unidad tal y como viene en el JSON, antes de que `hub.ts` la convierta en `Unit`. */
export interface UnidadPedagogica {
  code: string;
  title: string;
  level: string;
  duration: string;
  difficulty: string;
  category: string;
  metadata: MetadatosDeUnidad;
  strategy?: EstrategiaDeUnidad;
  theory?: TeoriaDeUnidad;
  evaluation?: EvaluacionDeUnidad;
  teacher_tips?: string[];
}

/** El archivo entero: un mapa de código de unidad (`P1-1-1`) a su contenido. */
export type TemarioDeGrado = Record<string, UnidadPedagogica>;
