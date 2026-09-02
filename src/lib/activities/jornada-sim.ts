/**
 * Simulación pura del motor JORNADA — "El Día de Trabajo de Ceny".
 *
 * Reemplaza a BALANCE en la unidad P1-1-3 ("El trabajo y el dinero: de dónde
 * vienen los pesos"), cuyo objetivo es: «comprender la relación directa entre
 * el esfuerzo personal, el uso del tiempo y la generación de ingresos,
 * valorando la diversidad de profesiones y oficios».
 *
 * El alumno reparte las horas de un día entre oficios distintos. No hay
 * reflejos ni destreza: solo decisiones. Las tres ideas que entrega son
 *   1. sin trabajo no hay monedas (el dinero no aparece solo),
 *   2. el tiempo es limitado — hacer un oficio significa no hacer otro,
 *   3. cada oficio paga distinto por la misma hora.
 */

export interface Oficio {
  id: string;
  nombre: string;
  emoji?: string;
  imagen?: string;
  /** Horas del día que consume. */
  bloques: number;
  /** Monedas que paga. */
  paga: number;
  nota?: string;
}

export interface ConfigJornada {
  /** Horas disponibles en el día. */
  bloques: number;
  /** Monedas necesarias para lograr la meta. */
  metaMonedas: number;
  /** Si un mismo oficio puede repetirse. Por defecto no: se busca variedad de oficios. */
  permiteRepetir: boolean;
}

export interface EstadoJornada {
  bloquesUsados: number;
  monedas: number;
  elegidos: string[];
}

export const CONFIG_JORNADA_POR_DEFECTO: ConfigJornada = {
  bloques: 6,
  metaMonedas: 85,
  permiteRepetir: false,
};

export function estadoInicialJornada(): EstadoJornada {
  return { bloquesUsados: 0, monedas: 0, elegidos: [] };
}

export const bloquesRestantes = (e: EstadoJornada, c: ConfigJornada) => c.bloques - e.bloquesUsados;

/** Oficios que todavía caben en el tiempo restante (y que no se han hecho, si no se permite repetir). */
export function oficiosDisponibles(oficios: Oficio[], e: EstadoJornada, c: ConfigJornada): Oficio[] {
  const restan = bloquesRestantes(e, c);
  return oficios.filter((o) =>
    o.bloques <= restan && (c.permiteRepetir || !e.elegidos.includes(o.id)));
}

export function jornadaTerminada(oficios: Oficio[], e: EstadoJornada, c: ConfigJornada): boolean {
  return oficiosDisponibles(oficios, e, c).length === 0;
}

export type ResultadoEleccion =
  | { ok: true; estado: EstadoJornada }
  | { ok: false; motivo: 'sin_tiempo' | 'repetido' | 'inexistente' };

/** Devuelve un estado NUEVO: no muta, para que React lo trate como cambio. */
export function elegirOficio(
  e: EstadoJornada, oficios: Oficio[], c: ConfigJornada, id: string,
): ResultadoEleccion {
  const o = oficios.find((x) => x.id === id);
  if (!o) return { ok: false, motivo: 'inexistente' };
  if (!c.permiteRepetir && e.elegidos.includes(id)) return { ok: false, motivo: 'repetido' };
  if (o.bloques > bloquesRestantes(e, c)) return { ok: false, motivo: 'sin_tiempo' };
  return {
    ok: true,
    estado: {
      bloquesUsados: e.bloquesUsados + o.bloques,
      monedas: e.monedas + o.paga,
      elegidos: [...e.elegidos, id],
    },
  };
}

/**
 * Mejor combinación posible con el tiempo disponible (mochila 0/1 por programación
 * dinámica). Se usa para la pantalla final: enseñarle al alumno que con las MISMAS
 * horas se podía ganar más es el momento didáctico de la actividad.
 */
export function mejorJornada(oficios: Oficio[], c: ConfigJornada): { monedas: number; ids: string[] } {
  const B = c.bloques;
  // mejor[b] = { monedas, ids } usando como mucho b bloques
  const mejor: Array<{ monedas: number; ids: string[] }> = Array.from(
    { length: B + 1 }, () => ({ monedas: 0, ids: [] }));

  for (const o of oficios) {
    if (o.bloques > B) continue;
    // Recorrido descendente: cada oficio se usa una sola vez.
    for (let b = B; b >= o.bloques; b--) {
      const cand = mejor[b - o.bloques];
      if (cand.monedas + o.paga > mejor[b].monedas) {
        mejor[b] = { monedas: cand.monedas + o.paga, ids: [...cand.ids, o.id] };
      }
    }
  }
  return mejor[B];
}

/**
 * Puntaje 0-100. Pondera lograr la meta y qué tan bien se aprovecharon las horas
 * frente a la mejor jornada posible. No premia velocidad: premia decidir bien.
 */
export function puntuarJornada(e: EstadoJornada, oficios: Oficio[], c: ConfigJornada): number {
  const optimo = mejorJornada(oficios, c).monedas || 1;
  const logro = Math.min(1, e.monedas / Math.max(1, c.metaMonedas));
  const eficiencia = Math.min(1, e.monedas / optimo);
  return Math.round(Math.max(0, Math.min(100, 60 * logro + 40 * eficiencia)));
}

export const metaLograda = (e: EstadoJornada, c: ConfigJornada) => e.monedas >= c.metaMonedas;

/** Oficios ordenados por lo que pagan cada hora: sirve para explicar el resultado. */
export function porRendimiento(oficios: Oficio[]): Array<Oficio & { porHora: number }> {
  return oficios
    .map((o) => ({ ...o, porHora: o.paga / Math.max(1, o.bloques) }))
    .sort((a, b) => b.porHora - a.porHora);
}
