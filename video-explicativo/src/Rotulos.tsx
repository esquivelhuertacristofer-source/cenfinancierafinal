/**
 * LO QUE SE ESCRIBE EN PANTALLA.
 *
 * Hasta ahora el renderizador no tenía una sola letra: `Escenas.tsx` no contiene
 * ni un `fontSize`, y los únicos elementos que se podían encimar eran cuatro
 * marcas vectoriales —palomita, tacha, anillo, flecha—. Trece horas de video sin
 * escribir nunca «variable», ni «umbral», ni un número.
 *
 * La regla del nivel 0 no cambia: ahí el niño tiene cuatro años y no lee, y esos
 * videos siguen sin una letra. Esto es para los niveles 1 a 6, donde el alumno sí
 * lee y donde el término técnico es justamente lo que se lleva de la clase.
 *
 * Cuatro cosas, y ninguna más, porque un video que escribe de todo se vuelve una
 * diapositiva con voz:
 *
 *   · ROTULO   — el término, una vez, cuando se dice por primera vez.
 *   · CIFRA    — un número grande, para lo que se cuenta («seis veces», «una vuelta»).
 *   · SUBTITULO— lo que se está diciendo. No es adorno: un salón con treinta niños
 *                hace ruido, y media clase no va a oír la voz.
 *   · PASOS    — en qué parte del video vamos, de cinco. Saber cuánto falta es lo
 *                que hace que un video de sesenta segundos se vea corto.
 */

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { COLOR, FUENTES } from './theme';

/** Entra de golpe y se asienta: aparecer sin más se lee como un error de render. */
function entrada(frame: number, desde: number, fps: number) {
  const t = frame - desde;
  if (t < 0) return { opacidad: 0, sube: 24, escala: 0.94 };
  const d = fps * 0.28;
  return {
    opacidad: interpolate(t, [0, d], [0, 1], { extrapolateRight: 'clamp' }),
    sube: interpolate(t, [0, d], [24, 0], { extrapolateRight: 'clamp' }),
    escala: interpolate(t, [0, d * 1.4], [0.94, 1], { extrapolateRight: 'clamp' }),
  };
}

/** El término técnico, abajo a la izquierda, con la barra del color del nivel. */
export function Rotulo({
  texto, color, desde = 0,
}: { texto: string; color: string; desde?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacidad, sube, escala } = entrada(frame, desde, fps);
  if (opacidad === 0) return null;

  return (
    /* 260 y no 190: el subtítulo se pone a 62 del borde y con dos renglones mide
       150 de alto, así que llegaba hasta 212 y se encimaba con el rótulo. Medido
       en el cuadro del cierre, donde «TU TURNO» y la frase larga se cruzaban. */
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 0 260px 96px' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 22,
          opacity: opacidad,
          transform: `translateY(${sube}px) scale(${escala})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{ width: 10, height: 62, background: color, borderRadius: 5 }} />
        <span
          style={{
            fontFamily: FUENTES.titulo,
            fontSize: 62,
            fontWeight: 800,
            color: COLOR.blanco,
            letterSpacing: '0.02em',
            textShadow: '0 3px 18px rgba(4,12,26,.75)',
          }}
        >
          {texto}
        </span>
      </div>
    </AbsoluteFill>
  );
}

/**
 * Un número grande arriba a la derecha, con su palabra debajo.
 *
 * Es para lo que se cuenta y el niño tiene que retener: «seis veces», «un solo
 * lugar». El número va enorme y la palabra chica, porque lo que se recuerda es
 * la cifra.
 */
export function Cifra({
  numero, pie, color, desde = 0,
}: { numero: string; pie?: string; color: string; desde?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { opacidad, escala } = entrada(frame, desde, fps);
  if (opacidad === 0) return null;

  // Un latido corto al aterrizar, y se está quieto. Un número que pulsa todo el
  // rato deja de leerse como dato y pasa a leerse como adorno.
  const t = frame - desde;
  const latido = t < fps * 0.5 ? 1 + 0.09 * Math.sin((t / (fps * 0.5)) * Math.PI) : 1;

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'flex-end', padding: '86px 96px 0 0' }}>
      <div style={{ opacity: opacidad, transform: `scale(${escala * latido})`, transformOrigin: 'right top', textAlign: 'right' }}>
        <div
          style={{
            fontFamily: FUENTES.titulo,
            fontSize: 190,
            fontWeight: 800,
            lineHeight: 0.86,
            color,
            textShadow: '0 6px 30px rgba(4,12,26,.6)',
          }}
        >
          {numero}
        </div>
        {pie && (
          <div
            style={{
              fontFamily: FUENTES.texto,
              fontSize: 40,
              fontWeight: 700,
              color: COLOR.blanco,
              marginTop: 6,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textShadow: '0 2px 12px rgba(4,12,26,.8)',
            }}
          >
            {pie}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

/**
 * El subtítulo, centrado abajo.
 *
 * Sale entero desde el primer cuadro de la escena y no palabra por palabra: el
 * karaoke obliga a seguir el texto en vez de mirar la imagen, y aquí la imagen
 * es lo que enseña. El texto es el respaldo para quien no oye, no el espectáculo.
 */
export function Subtitulo({ texto }: { texto: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacidad = interpolate(frame, [0, fps * 0.16], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', padding: '0 0 62px' }}>
      <div
        style={{
          opacity: opacidad,
          maxWidth: 1420,
          padding: '16px 34px',
          borderRadius: 14,
          background: 'rgba(4,12,26,.72)',
          fontFamily: FUENTES.texto,
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.28,
          color: COLOR.blanco,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
}

/**
 * La barra de pasos, arriba.
 *
 * Cinco tramos, uno por tiempo del video. El tramo en curso se llena; los ya
 * hechos quedan encendidos. Es la diferencia entre «esto no se acaba nunca» y
 * «voy en el tercero de cinco».
 */
export function Pasos({
  total, actual, avance, color,
}: { total: number; actual: number; avance: number; color: string }) {
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', padding: '46px 0 0' }}>
      <div style={{ display: 'flex', gap: 12, width: 620 }}>
        {Array.from({ length: total }, (_, i) => {
          const lleno = i < actual ? 1 : i === actual ? avance : 0;
          return (
            <div
              key={i}
              style={{
                flex: 1, height: 7, borderRadius: 4,
                background: 'rgba(255,255,255,.22)',
                overflow: 'hidden',
              }}
            >
              <div style={{ width: `${lleno * 100}%`, height: '100%', background: color, borderRadius: 4 }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
