import type { Escena, VideoGuion } from './guion';

export const FPS = 30;

/**
 * El respiro que se le deja a cada escena DESPUÉS de que termina la voz.
 *
 * En la plataforma de tecnología este valor es 0.5 s y el hueco va entre dos
 * `<Sequence>`, así que durante medio segundo no hay ninguna escena montada y
 * se ve el color de fondo pelón. Aquí no: el respiro va DENTRO de la escena,
 * con la ilustración todavía en pantalla. El silencio es parte de la escena, no
 * un hueco entre escenas.
 *
 * ESTE VALOR ERA 1.0 Y SE BAJÓ A 0.45, a propósito y en contra de lo que decía
 * antes esta misma nota. La razón de que fuera largo sigue siendo cierta —un
 * niño de cuatro años necesita mirar la imagen después de oír la frase, no
 * mientras la oye—, pero el primer video salió con treinta escenas habladas: un
 * segundo cada una son treinta segundos de nada sobre ciento dos, o sea que un
 * tercio del video era una imagen quieta sin voz. Y se sintió exactamente así.
 *
 * El respiro no se quitó, se acortó y se llenó. Durante el respiro la cámara
 * sigue derivando, las piezas siguen respirando y la marca acaba de aparecer
 * (todo eso vive en `Escenas.tsx`): mirar no es lo mismo que esperar. Y la
 * escena que de verdad necesita más tiempo lo pide por su cuenta con `respiroS`,
 * en vez de cobrárselo a las otras veintinueve.
 */
export const GAP_S = 0.45;

/**
 * Cuánto se encima una escena sobre la anterior, en cuadros. Es lo que hace el
 * fundido cruzado: la escena que entra se pinta encima y sube de opacidad
 * mientras la anterior sigue debajo. Sin esto habría un parpadeo del fondo
 * entre cada par de escenas, que en un video para preescolar se nota muchísimo.
 *
 * 10 y no 12: con el respiro corto, el corte llega antes y un fundido de 0.4 s
 * lo emborrona. A 0.33 s todavía no parpadea y ya se siente el corte.
 */
export const SOLAPE = 10;

export interface EscenaTimeline extends Escena {
  desde: number;
  duracionFrames: number;
}

function aFrames(segundos: number): number {
  return Math.ceil(segundos * FPS);
}

/** Cuánto dura una escena con voz y su respiro, o cuánto dura si es muda. */
function segundosDe(escena: Escena): number {
  if (escena.narracion) return (escena.duracionS ?? 3) + (escena.respiroS ?? GAP_S);
  return escena.silencioS ?? 1.2;
}

export function construirTimeline(video: VideoGuion): {
  timeline: EscenaTimeline[];
  totalFrames: number;
} {
  let cursor = 0;
  const timeline = video.escenas.map((escena) => {
    const propios = aFrames(segundosDe(escena));
    const item: EscenaTimeline = { ...escena, desde: cursor, duracionFrames: propios + SOLAPE };
    cursor += propios;
    return item;
  });
  return { timeline, totalFrames: Math.max(cursor, 1) };
}
