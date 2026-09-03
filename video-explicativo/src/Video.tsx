import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLOR } from './theme';
import { EscenaVista, Fondo } from './Escenas';
import { construirTimeline, FPS, SOLAPE } from './timeline';
import type { VideoGuion } from './guion';

/** Qué tan por debajo de la voz va la música. */
const VOLUMEN_MUSICA = 0.11;

/**
 * Cuánto se atrasa la voz respecto al primer cuadro de su escena, en cuadros.
 *
 * XTTS entrega el WAV recortado hasta la primera sílaba: medido en las treinta
 * narraciones de la clase 1, la voz entra entre los 10 y los 36 milisegundos.
 * Y en el cuadro cero de cada escena está montado el swoosh de corte, que dura
 * 300 ms. O sea que el cambio de escena se comía la primera sílaba treinta
 * veces por video, y eso es la mitad de «tiene ciertos errores de audio».
 *
 * Siete cuadros son 233 ms: la voz entra con el swoosh ya casi apagado y
 * después del fundido de entrada (SOLAPE = 10 cuadros), no encima de él.
 *
 * NO ALARGA EL VIDEO. El atraso se paga del respiro, no de la escena: la
 * escena dura `ceil((duración + respiro) * FPS) + SOLAPE` y la voz necesita
 * `RETRASO_VOZ + duración * FPS`, así que basta con `7 <= respiro * FPS + 10`,
 * que se cumple incluso con respiro cero.
 */
const RETRASO_VOZ = 7;

/**
 * La voz no va a tope.
 *
 * XTTS normaliza cada narración cerca del máximo, y al sumarle un efecto que
 * cae sobre un pico de la voz la mezcla se pasaba de 1.0: la revisión de la
 * clase 1 midió pico 1.042 con 47 muestras saturadas. Un 10% abajo deja la
 * suma en 0.95 y no se nota como voz más baja, porque la cama y los efectos
 * bajan con ella en el mismo cuadro.
 */
const VOLUMEN_VOZ = 0.9;

/**
 * La música se genera una sola vez por grado (scripts/musica.py) y se repite en
 * bucle hasta cubrir el video, en vez de generar una pista a la medida de cada
 * uno: son sesenta videos y ninguno necesita música propia. El corte por grado
 * —y no uno solo para toda la plataforma— es porque la cama de un video de seis
 * años y la de uno de quince no pueden ser la misma pista sin que una de las dos
 * suene prestada. `loop` de Remotion se encarga; el volumen entra en un segundo
 * y sale en dos.
 */
function Musica({ totalFrames, pista }: { totalFrames: number; pista: string }) {
  const frame = useCurrentFrame();
  const volumen = interpolate(
    frame,
    [0, FPS, totalFrames - 2 * FPS, totalFrames],
    [0, VOLUMEN_MUSICA, VOLUMEN_MUSICA, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return <Audio src={staticFile(pista)} volume={volumen} loop />;
}

/** El fundido a negro del último segundo. */
function Cierre({ totalFrames }: { totalFrames: number }) {
  const frame = useCurrentFrame();
  const negro = interpolate(frame, [totalFrames - FPS, totalFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ background: '#000', opacity: negro, pointerEvents: 'none' }} />;
}

/**
 * La barra de pasos, medida en cuadros de verdad.
 *
 * Cada escena declara a qué tiempo del video pertenece (`paso`). Un tiempo dura
 * tres o cuatro escenas, así que el tramo de la barra no se puede llenar con el
 * avance de una escena: se llenaría y se vaciaría en cada corte. Aquí se suman
 * los cuadros de todas las escenas del mismo tiempo y a cada una se le dice qué
 * fracción del tiempo llevaba al empezar y cuál al acabar.
 *
 * Los sesenta guiones de esta plataforma declaran `paso` en todas sus escenas,
 * porque `armar-guion.mjs` lo pone solo a partir de los cinco tiempos. La rama
 * sin `paso` se conserva para un guión escrito a mano que no los use: devuelve
 * cero pasos y la barra sencillamente no se dibuja.
 */
function medirPasos(timeline: { paso?: number; duracionFrames: number }[]) {
  const declarados = timeline.filter((e) => e.paso !== undefined);
  if (!declarados.length) return { pasos: 0, tramos: timeline.map(() => [0, 0] as [number, number]) };

  const pasos = Math.max(...declarados.map((e) => e.paso as number)) + 1;
  const total = new Array<number>(pasos).fill(0);
  for (const e of timeline) total[e.paso ?? 0] += e.duracionFrames;

  const llevado = new Array<number>(pasos).fill(0);
  const tramos = timeline.map((e) => {
    const p = e.paso ?? 0;
    const de = llevado[p] / Math.max(total[p], 1);
    llevado[p] += e.duracionFrames;
    return [de, llevado[p] / Math.max(total[p], 1)] as [number, number];
  });
  return { pasos, tramos };
}

export function Video({ guion, musica, acento }: { guion: VideoGuion; musica: string; acento?: string }) {
  const { timeline, totalFrames } = construirTimeline(guion);
  const { pasos, tramos } = medirPasos(timeline);

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.navy }}>
      <Fondo />
      <Musica totalFrames={totalFrames} pista={musica} />
      {timeline.map((escena, i) => (
        <Sequence
          key={escena.id}
          from={escena.desde}
          durationInFrames={escena.duracionFrames}
          name={escena.id}
        >
          <EscenaVista
            carpeta={guion.carpeta}
            escena={escena}
            duracionFrames={escena.duracionFrames}
            subtitulos={guion.subtitulos}
            pasos={pasos}
            pasoDe={tramos[i][0]}
            pasoA={tramos[i][1]}
            acento={acento}
          />
          {escena.narracion && (
            // La voz entra unos cuadros después del corte, no encima de él, y
            // el respiro queda al final con la imagen quieta y sin voz.
            <Sequence from={RETRASO_VOZ} layout="none" name={`voz-${escena.id}`}>
              <Audio
                src={staticFile(`audio/${guion.carpeta}/${escena.id}.wav`)}
                volume={VOLUMEN_VOZ}
              />
            </Sequence>
          )}
        </Sequence>
      ))}
      <Cierre totalFrames={totalFrames} />
    </AbsoluteFill>
  );
}

export { SOLAPE };
