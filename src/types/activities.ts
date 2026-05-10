// ─── BASE ───────────────────────────────────────────────────────────────────
export type ActivityType = 
  | 'SIMULADOR' | 'QUIZ' | 'ARRASTRA' | 'TRIVIA' | 'RELLENA'
  | 'DECIDE' | 'CONSTRUCTOR' | 'MEMORIA' | 'JUEGO' | 'RULETA'
  | 'BALANCE' | 'RADAR' | 'CRECIMIENTO' | 'CONTROL';

export type Complexity = 'SIMPLE' | 'MEDIO' | 'COMPLEJO';

export interface BaseActivity {
  code: string;           // "ACT-P4-3-3-A"
  unit_code: string;      // "P4-3-3"
  unit_title: string;
  level: string;          // "P4"
  edad: string;           // "9-10 años"
  tipo: ActivityType;
  complejidad: Complexity;
  titulo: string;
  descripcion: string;
  objetivo: string;
  xp: number;
}

// ─── QUIZ ────────────────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  texto: string;
  opciones: string[];        // siempre 4
  correcta: number;          // índice 0-3
  explicacion: string;       // mostrar tras responder
  imagen?: string;           // ruta en /public/
}
export interface QuizActivityData extends BaseActivity {
  tipo: 'QUIZ';
  preguntas: QuizQuestion[];  // 5-8 preguntas
  aprobacion_minima: number;  // 0-1, ej. 0.8
}

// ─── SIMULADOR ───────────────────────────────────────────────────────────────
export interface SimInput {
  id: string;
  label: string;
  type: 'slider' | 'number' | 'select';
  min?: number;
  max?: number;
  step?: number;
  default: number | string;
  unit?: string;             // "años", "$", "%"
  opciones?: string[];       // solo si type='select'
}
export interface SimScenario {
  condicion: string;         // JS expression usando input ids, ej: "resultado > 100000"
  mensaje: string;
  tipo: 'success' | 'warning' | 'danger' | 'info';
}
export interface SimulatorActivityData extends BaseActivity {
  tipo: 'SIMULADOR';
  descripcion_formula: string;   // Explicación en español de lo que calcula
  inputs: SimInput[];
  formula: string;               // JS expression: "capital * Math.pow(1 + tasa/100, años)"
  output_label: string;          // "Tu ahorro al retirarte"
  output_prefix?: string;        // "$"
  output_suffix?: string;        // " MXN"
  chart_type: 'bar' | 'line' | 'pie' | 'none';
  chart_labels?: string[];       // para eje X si aplica
  escenarios: SimScenario[];
}

// ─── ARRASTRA (DRAG & DROP) ──────────────────────────────────────────────────
export interface DragItem {
  id: string;
  label: string;
  emoji?: string;
  categoria_correcta: string;
  hint?: string;
  feedback?: string;
}
export interface DragCategory {
  id: string;
  label: string;
  descripcion?: string;
  color: string;             // hex o tailwind, ej: "#22c55e"
  emoji?: string;
}
export interface DragDropActivityData extends BaseActivity {
  tipo: 'ARRASTRA';
  instruccion: string;
  items: DragItem[];
  categorias: DragCategory[];
}

// ─── TRIVIA ───────────────────────────────────────────────────────────────────
export interface TriviaQuestion {
  id: string;
  pregunta: string;
  respuesta_correcta: string;
  incorrectas: string[];      // 3 opciones incorrectas
  categoria?: string;         // "Banxico", "Ahorro", etc.
  dato_extra?: string;        // dato curioso mostrado tras responder
}
export interface TriviaActivityData extends BaseActivity {
  tipo: 'TRIVIA';
  preguntas: TriviaQuestion[];  // exactamente 10
  tiempo_por_pregunta: number;  // segundos, default 15
  multiplicador_racha: number;  // XP bonus por racha, default 1.5
}

// ─── RELLENA (FILL IN THE BLANKS) ────────────────────────────────────────────
export interface Blank {
  id: string;             // "blank_1", "blank_2"...
  respuesta: string;
  opciones: string[];     // 4 opciones para elegir (incluye la correcta)
}
export interface FillBlanksActivityData extends BaseActivity {
  tipo: 'RELLENA';
  // Usar __BLANK_1__, __BLANK_2__ como marcadores en el texto
  texto: string;
  blanks: Blank[];
  contexto?: string;      // párrafo de contexto antes del texto principal
}

// ─── DECIDE (STORY / CHOOSE YOUR PATH) ───────────────────────────────────────
export interface StoryChoice {
  id: string;
  texto: string;
  siguiente_nodo: string;
  consecuencia: string;   // resultado inmediato visible
  xp_bonus: number;       // 0 si decisión mala, positivo si buena
  es_optima: boolean;
}
export interface StoryNode {
  id: string;
  texto: string;          // narración del momento
  personaje?: string;     // "Ceny", "Don Pedro", etc.
  imagen?: string;
  opciones: StoryChoice[];  // 2-3 opciones; si vacío = nodo final
  es_final?: boolean;
  tipo_final?: 'bueno' | 'regular' | 'malo';
  reflexion_final?: string; // lección aprendida en nodos finales
}
export interface StoryActivityData extends BaseActivity {
  tipo: 'DECIDE';
  nodo_inicial: string;
  nodos: Record<string, StoryNode>;   // key = nodo.id
  personaje_principal: string;
  contexto_inicial: string;
}

// ─── CONSTRUCTOR (BUILDER) ───────────────────────────────────────────────────
export type BuilderFieldType = 'text' | 'number' | 'select' | 'slider' | 'textarea' | 'calculated';
export interface BuilderField {
  id: string;
  label: string;
  type: BuilderFieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  opciones?: string[];
  formula?: string;       // para type='calculated', usa otros field ids
  unit?: string;
  requerido: boolean;
  ayuda?: string;         // tooltip de ayuda
}
export interface BuilderStep {
  id: string;
  titulo: string;
  descripcion: string;
  campos: BuilderField[];
  visualizacion?: 'tabla' | 'grafica' | 'tarjeta' | 'none';
}
export interface BuilderActivityData extends BaseActivity {
  tipo: 'CONSTRUCTOR';
  output_type: 'tabla' | 'canvas' | 'plan' | 'grafica' | 'documento';
  pasos: BuilderStep[];
  exportable: boolean;
}

// ─── MEMORIA (MATCHING) ──────────────────────────────────────────────────────
export interface MemoryPair {
  id: string;
  termino: string;
  definicion: string;
  emoji?: string;
  imagen?: string;
}
export interface MatchingActivityData extends BaseActivity {
  tipo: 'MEMORIA';
  pares: MemoryPair[];    // 8 pares = grid 4x4
  modo: 'texto-texto' | 'imagen-texto' | 'emoji-texto';
}

// ─── JUEGO (GAME) ────────────────────────────────────────────────────────────
export type GameType = 'catch' | 'sort' | 'click' | 'avoid';
export interface GameItem {
  id: string;
  label: string;
  emoji: string;
  tipo: 'correcto' | 'incorrecto';   // correcto = atrapar/clic, incorrecto = evitar
  puntos: number;
}
export interface GameActivityData extends BaseActivity {
  tipo: 'JUEGO';
  game_type: GameType;
  duracion: number;        // segundos
  items: GameItem[];
  velocidad_inicial: 'lenta' | 'media' | 'rapida';
  velocidad_incremento: boolean;
  instruccion: string;
}

// ─── RULETA ───────────────────────────────────────────────────────────────────
export interface RouletteScenario {
  id: string;
  situacion: string;
  opciones: string[];      // 3 opciones
  mejor_opcion: number;    // índice 0-2
  explicacion: string;
  categoria: string;       // color del sector
}
export interface RouletteActivityData extends BaseActivity {
  tipo: 'RULETA';
  escenarios: RouletteScenario[];  // 6-8 para la ruleta, se sortean 5 por sesión
  giros: number;                   // cuántos giros por sesión, default 5
}

// ─── PROGRESS ────────────────────────────────────────────────────────────────
export interface ActivityProgress {
  user_id: string;
  activity_code: string;
  unit_code: string;
  level: string;
  completado: boolean;
  score: number;           // 0-100
  xp_ganado: number;
  intentos: number;
  ultimo_intento: string;  // ISO date
  tiempo_segundos: number;
}
