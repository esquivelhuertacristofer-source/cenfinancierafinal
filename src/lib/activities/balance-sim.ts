/**
 * Simulación pura del motor BALANCE ("El Calibrador de Sueños").
 *
 * Vive fuera del componente a propósito: la mecánica es la parte que se puede
 * romper en silencio (el motor anterior tenía una variable muerta y se ganaba
 * espameando un botón, y nadie se enteró durante meses). Aquí es determinista
 * y está cubierta por pruebas.
 */

export type Dificultad = 'FACIL' | 'MEDIO' | 'ALTA';

export interface ConfigBalance {
  tolerancia: number;           // desequilibrio máximo que aún carga la meta
  toleranciaPeligro: number;    // desequilibrio a partir del cual se drena
  velocidadCarga: number;       // %/s de avance de la meta en equilibrio perfecto
  velocidadDrenaje: number;     // %/s que pierde la meta en desequilibrio
  subidaSabiduria: number;      // %/s al mantener presionado
  subidaEjecucion: number;      // %/s al mantener presionado
  decaimiento: number;          // %/s que bajan solas las columnas
  segundosParaResbalon: number; // tiempo en peligro antes de perder carga
  castigoResbalon: number;      // % de meta que se pierde en un resbalón
  duracionSegundos: number;     // 0 = sin límite de tiempo
  umbralAprobacion: number;     // % de meta necesario para ganar
}

export interface EstadoBalance {
  sabiduria: number;
  ejecucion: number;
  meta: number;
  tiempoPeligro: number;
  transcurrido: number;
  sumaEquilibrio: number;
  muestras: number;
  resbalones: number;
}

export interface EntradaBalance {
  sabiduria: boolean;
  ejecucion: boolean;
}

export interface SalidaPaso {
  enPeligro: boolean;
  /** Se pulsaron ambos controles: no se puede estudiar y trabajar a la vez. */
  conflicto: boolean;
  /** Se acaba de perder una carga por desequilibrio sostenido. */
  resbalo: boolean;
}

export const PRESETS_BALANCE: Record<Dificultad, ConfigBalance> = {
  FACIL: {
    tolerancia: 28, toleranciaPeligro: 45, velocidadCarga: 3, velocidadDrenaje: 6,
    subidaSabiduria: 34, subidaEjecucion: 34, decaimiento: 7,
    segundosParaResbalon: 3.2, castigoResbalon: 8, duracionSegundos: 0, umbralAprobacion: 100,
  },
  MEDIO: {
    tolerancia: 20, toleranciaPeligro: 34, velocidadCarga: 2.6, velocidadDrenaje: 11,
    subidaSabiduria: 36, subidaEjecucion: 36, decaimiento: 11,
    segundosParaResbalon: 2.2, castigoResbalon: 12, duracionSegundos: 0, umbralAprobacion: 100,
  },
  ALTA: {
    tolerancia: 14, toleranciaPeligro: 26, velocidadCarga: 2.2, velocidadDrenaje: 16,
    subidaSabiduria: 38, subidaEjecucion: 38, decaimiento: 15,
    segundosParaResbalon: 1.6, castigoResbalon: 16, duracionSegundos: 0, umbralAprobacion: 100,
  },
};

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function estadoInicial(): EstadoBalance {
  return {
    sabiduria: 0, ejecucion: 0, meta: 0, tiempoPeligro: 0,
    transcurrido: 0, sumaEquilibrio: 0, muestras: 0, resbalones: 0,
  };
}

/**
 * Deriva la dificultad del JSON de la actividad.
 *
 * La edad manda sobre `complejidad` a propósito: en el contenido existente esa
 * etiqueta es editorial (la actividad de 6-7 años viene marcada como
 * "MAESTRÍA") y tomarla como dificultad real le pondría a un alumno de primero
 * de primaria el nivel experto.
 */
/** Lo unico que esta funcion mira del JSON de la actividad. */
export interface PistasDeDificultad {
  dificultad?: unknown;
  edad?: unknown;
  complejidad?: unknown;
}

export function resolverDificultad(data: PistasDeDificultad | null | undefined): Dificultad {
  const explicita = String(data?.dificultad || '').toUpperCase().trim();
  if (explicita === 'FACIL' || explicita === 'MEDIO' || explicita === 'ALTA') return explicita;

  const edad = parseInt(String(data?.edad || '').match(/\d+/)?.[0] || '0', 10);
  if (edad) {
    if (edad <= 8) return 'FACIL';
    if (edad <= 12) return 'MEDIO';
    return 'ALTA';
  }

  const compl = String(data?.complejidad || '').toUpperCase().trim();
  if (compl === 'BAJA' || compl === 'FACIL' || compl === 'BASICO') return 'FACIL';
  if (compl === 'ALTA' || compl === 'MAESTRIA' || compl === 'MAESTRÍA') return 'ALTA';
  if (compl === 'MEDIO' || compl === 'MEDIA') return 'MEDIO';
  return 'MEDIO';
}

/** Avanza la simulación `dt` segundos. Muta `s` y devuelve lo que la UI debe pintar. */
export function avanzarBalance(
  s: EstadoBalance,
  cfg: ConfigBalance,
  entrada: EntradaBalance,
  dt: number,
): SalidaPaso {
  // El tiempo es el recurso escaso: no se puede estudiar y trabajar a la vez.
  // Sin esta regla, mantener ambos controles ganaba la partida en 6 segundos.
  const conflicto = entrada.sabiduria && entrada.ejecucion;
  const subeSabiduria = entrada.sabiduria && !conflicto;
  const subeEjecucion = entrada.ejecucion && !conflicto;

  // Las columnas bajan solas: hay que alimentar ambas, no una sola vez.
  s.sabiduria = clamp(s.sabiduria - cfg.decaimiento * dt, 0, 100);
  s.ejecucion = clamp(s.ejecucion - cfg.decaimiento * dt, 0, 100);
  if (subeSabiduria) s.sabiduria = clamp(s.sabiduria + cfg.subidaSabiduria * dt, 0, 100);
  if (subeEjecucion) s.ejecucion = clamp(s.ejecucion + cfg.subidaEjecucion * dt, 0, 100);

  const desequilibrio = Math.abs(s.sabiduria - s.ejecucion);
  const promedio = (s.sabiduria + s.ejecucion) / 2;
  let enPeligro = false;
  let resbalo = false;

  if (desequilibrio <= cfg.tolerancia) {
    // Cuanto más centrada la balanza y más altas ambas fuerzas, más rápido avanza.
    const precision = 1 - desequilibrio / Math.max(1, cfg.tolerancia);
    const impulso = (0.35 + 0.65 * precision) * (promedio / 100);
    s.meta = clamp(s.meta + cfg.velocidadCarga * impulso * dt, 0, 100);
    s.tiempoPeligro = 0;
  } else if (desequilibrio >= cfg.toleranciaPeligro) {
    enPeligro = true;
    s.meta = clamp(s.meta - cfg.velocidadDrenaje * dt, 0, 100);
    s.tiempoPeligro += dt;
    if (s.tiempoPeligro >= cfg.segundosParaResbalon) {
      s.meta = clamp(s.meta - cfg.castigoResbalon, 0, 100);
      s.tiempoPeligro = 0;
      s.resbalones += 1;
      resbalo = true;
    }
  } else {
    // Zona muerta: ni avanza ni castiga. Da margen para corregir.
    s.tiempoPeligro = 0;
  }

  // Calidad ponderada por el nivel alcanzado: quedarse quieto en 0/0 está
  // "equilibrado" pero no vale nada — así se sacaban 45 puntos sin jugar.
  s.sumaEquilibrio += (1 - clamp(desequilibrio / 100, 0, 1)) * (promedio / 100);
  s.muestras += 1;
  s.transcurrido += dt;

  return { enPeligro, conflicto, resbalo };
}

/** Puntaje 0-100: mide equilibrio sostenido y avance real, no cuántas veces se picó un botón. */
export function puntuarBalance(s: EstadoBalance): number {
  const calidad = s.muestras > 0 ? s.sumaEquilibrio / s.muestras : 0;
  const avance = clamp(s.meta / 100, 0, 1);
  const bruto = 100 * (0.55 * avance + 0.45 * calidad) - s.resbalones * 3;
  return Math.round(clamp(bruto, 0, 100));
}
