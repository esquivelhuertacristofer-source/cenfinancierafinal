import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLOR } from './theme';
import { Cifra, Pasos, Rotulo, Subtitulo } from './Rotulos';
import type { Escena, Marca, Pieza } from './guion';
import { SOLAPE } from './timeline';

/**
 * El vocabulario visual de los videos.
 *
 * REGLA DURA DEL NIVEL 0: no hay una sola letra ni un solo número en pantalla,
 * y no hay mascota. El niño tiene cuatro años y no lee. Todo lo que el video
 * dice, lo dice la voz; todo lo que el video señala, lo señala una marca
 * dibujada —una palomita, una tacha, un anillo, una flecha—, nunca una palabra.
 *
 * Por eso una escena es una de dos cosas, nunca las dos:
 *   · una LÁMINA a pantalla completa, con la cámara acercándose despacio; o
 *   · unas PIEZAS, tarjetas cuadradas que entran, se acomodan, se ladean o se
 *     agrandan sobre el fondo del video.
 * Mezclar las dos —pegar tarjetas encima de una lámina— se ve como un collage,
 * porque cada ilustración trae su propio fondo de estudio y las costuras se
 * notan. Separadas, cada una se ve entera y limpia.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EL PRIMER VIDEO ADORMECÍA, Y QUÉ SE CAMBIÓ AQUÍ.
 *
 * Medido: ciento dos segundos, nueve imágenes distintas, treinta y tres escenas
 * y UN SOLO movimiento en todo el sistema —un acercamiento del 5% por escena—.
 * Una tarjeta entraba con su rebote y ahí se quedaba tiesa hasta el corte. Y no
 * sonaba absolutamente nada aparte de la voz y el colchón de música. Eso no es
 * un video, es un carrusel de diapositivas con locución.
 *
 * Lo que ahora hace que se mueva, en orden de cuánto pesa:
 *
 *   1. NADA SE CONGELA. Cada elemento tiene, además de su animación con
 *      intención, un vaivén lentísimo con periodo y fase propios: la lámina
 *      deriva, las tarjetas respiran y se ladean, la marca late. Ninguno se ve
 *      por separado; juntos son la diferencia entre una foto y una toma. Los
 *      periodos son números primos entre sí a propósito, para que el conjunto
 *      no caiga nunca en sincronía y empiece a verse como un latido mecánico.
 *   2. TODO ATERRIZA, NADA APARECE. La lámina entra con un golpe de escala que
 *      se apaga en dos tercios de segundo; la tarjeta llega ladeada y se
 *      endereza; la marca sale de un muelle con rebote y avienta un anillo de
 *      choque que se abre y se apaga. Aparecer es un corte de opacidad y se lee
 *      como un pase de diapositiva; aterrizar se lee como que algo pasó.
 *   3. LA PALOMITA SE DIBUJA. El trazo se pinta en cuatro décimas con
 *      `stroke-dashoffset` en vez de encenderse de golpe. Es el efecto más
 *      barato del archivo y el que más se siente, porque es el único momento en
 *      el que el video hace algo en vez de mostrar algo.
 *   4. HAY SONIDO. Un corte suave en cada escena, un «pos» cuando una pieza
 *      aterriza, y un tono para la palomita, otro para la tacha y otro para el
 *      señalamiento. Van muy por debajo de la voz. No son premio ni castigo —en
 *      este nivel no hay calificación—: son la parte del video que le dice al
 *      niño que mire, sin decírselo con palabras que no puede leer.
 *
 * El respiro después de cada frase se acortó de 1.0 s a 0.45 s en
 * `timeline.ts`; ahí está explicado por qué eso no contradice lo que necesita un
 * niño de cuatro años.
 */

/** El fondo del video: el mismo azul de la interfaz, con dos manchas que flotan. */
export function Fondo({ children }: { children?: React.ReactNode }) {
  const frame = useCurrentFrame();
  const flota = Math.sin(frame / 55) * 16;
  const gira = Math.sin(frame / 83) * 10;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 22% 12%, ${COLOR.navyClaro} 0%, #08203f 42%, ${COLOR.navy} 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute', top: 70, right: 120, width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(99,199,255,0.10)', transform: `translate(${gira}px, ${flota}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute', bottom: 60, left: 90, width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(20,99,255,0.12)', transform: `translate(${-gira}px, ${-flota}px)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
}

/** El muelle de siempre: llega y se queda, sin rebotar. */
function muelle(frame: number, fps: number, desde = 0) {
  return spring({ frame: frame - desde, fps, config: { damping: 18, mass: 0.7 } });
}

/** El muelle de lo que llega de golpe: rebota una vez antes de asentarse. */
function golpe(frame: number, fps: number, desde = 0) {
  return spring({ frame: frame - desde, fps, config: { damping: 11, mass: 0.5, stiffness: 150 } });
}

/**
 * El vaivén que impide que algo se congele. `periodo` en cuadros; `fase` para
 * que dos cosas con el mismo periodo no se muevan a la vez.
 */
function vaiven(frame: number, periodo: number, fase = 0) {
  return Math.sin(frame / periodo + fase);
}

/* ──────────────────────────────── Sonido ─────────────────────────────────── */

/**
 * Los ocho efectos, generados por `scripts/sfx.py` con numpy —igual que la
 * música, sin una sola muestra descargada— y guardados en `public/audio/sfx/`.
 * Los volúmenes están calibrados contra la voz: si un efecto se nota como
 * efecto, está alto.
 *
 * Los cinco primeros suenan MIENTRAS habla la voz y por eso van bajos. Los tres
 * últimos son de las escenas sin voz, donde no compiten con nada, y por eso van
 * cerca del 30%: ahí el sonido no acompaña, sostiene la escena entero.
 */
const SFX = {
  corte: { archivo: 'audio/sfx/corte.wav', volumen: 0.13 },
  posa: { archivo: 'audio/sfx/posa.wav', volumen: 0.17 },
  si: { archivo: 'audio/sfx/si.wav', volumen: 0.26 },
  no: { archivo: 'audio/sfx/no.wav', volumen: 0.2 },
  senala: { archivo: 'audio/sfx/senala.wav', volumen: 0.24 },
  abre: { archivo: 'audio/sfx/abre.wav', volumen: 0.3 },
  cierra: { archivo: 'audio/sfx/cierra.wav', volumen: 0.28 },
  brilla: { archivo: 'audio/sfx/brilla.wav', volumen: 0.3 },
} as const;

type NombreSfx = keyof typeof SFX;

function esSfx(nombre: string): nombre is NombreSfx {
  return nombre in SFX;
}

function Efecto({ nombre, en }: { nombre: NombreSfx; en: number }) {
  const s = SFX[nombre];
  return (
    <Sequence from={Math.max(Math.round(en), 0)} durationInFrames={75} layout="none">
      <Audio src={staticFile(s.archivo)} volume={s.volumen} />
    </Sequence>
  );
}

/** Qué suena cuando aparece cada tipo de marca. */
function efectoDeMarca(tipo: Marca['tipo']): NombreSfx {
  if (tipo === 'si') return 'si';
  if (tipo === 'no') return 'no';
  return 'senala';
}

/* ──────────────────────────────── Imagen ─────────────────────────────────── */

/** Ruta pública de una ilustración de escena. */
function rutaImagen(carpeta: string, clave: string) {
  return staticFile(`escenas/${carpeta}/${clave}.png`);
}

/** Lámina a pantalla completa: acercamiento con intención + deriva que no para. */
function Lamina({
  carpeta, clave, avance, frame, empuje = 0.05, desliza, recorte,
}: {
  carpeta: string; clave: string; avance: number; frame: number;
  empuje?: number; desliza?: [number, number]; recorte?: [number, number, number];
}) {
  // Tres movimientos encimados, y hacen falta los tres.
  //   · ENTRADA: un golpe de escala que se apaga en dos tercios de segundo, para
  //     que la lámina aterrice en vez de aparecer.
  //   · ACERCAMIENTO: el que tiene intención, lleva la mirada adentro de la
  //     imagen mientras la voz habla.
  //   · DERIVA: un vaivén lentísimo que nadie ve y todos notan. Sin él, en cuanto
  //     acaba la frase el cuadro se congela y vuelve a ser una diapositiva.
  const entrada = interpolate(frame, [0, SOLAPE * 2], [0.05, 0], { extrapolateRight: 'clamp' });

  /*
   * EL REENCUADRE. `recorte` dice qué trozo de la ilustración llena el cuadro:
   * `[0.5, 0.5, 1]` es la imagen entera; `[0.3, 0.6, 0.35]` es un detalle. Un
   * ancho de 0.35 quiere decir que ese tercio de imagen ocupa toda la pantalla,
   * o sea una escala de 1/0.35.
   *
   * Con esto, la misma ilustración da el plano general y dos detalles, y el que
   * mira ve tres planos distintos. Sin esto, la medición de los 216 videos daba
   * una imagen nueva cada 17,5 segundos y la pantalla se quedaba quieta.
   */
  const zoom = recorte ? 1 / Math.max(recorte[2], 0.08) : 1;
  /*
   * El corrimiento NO se multiplica por el zoom, aunque parezca que debería.
   * `transform: scale(s) translate(t%)` aplica el translate en las coordenadas
   * propias del elemento y LUEGO lo escala, así que el desplazamiento en
   * pantalla ya sale multiplicado por `s`. Ponerle el zoom aquí lo aplicaba dos
   * veces: con recorte [0.46, …] y zoom 2.8 el cuadro se iba al 31% del ancho
   * en vez de al 4%, o sea a otra parte de la ilustración.
   */
  const centroX = recorte ? (0.5 - recorte[0]) * 100 : 0;
  const centroY = recorte ? (0.5 - recorte[1]) * 100 : 0;

  const escala = (1.035 + empuje * avance + entrada) * zoom;
  const dx = centroX + (desliza?.[0] ?? 0) * avance * 100 + vaiven(frame, 96) * 0.4;
  const dy = centroY + (desliza?.[1] ?? 0) * avance * 100 + vaiven(frame, 71, 1.9) * 0.32;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={rutaImagen(carpeta, clave)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${escala}) translate(${dx}%, ${dy}%)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Una tarjeta con una pieza dentro, animada de `de` a `a`. */
function TarjetaPieza({
  carpeta, pieza, indice, avance, apagada, agrandada, frame, fps, utiles, acomodo,
}: {
  carpeta: string; pieza: Pieza; indice: number; avance: number; apagada: boolean;
  agrandada: boolean; frame: number; fps: number; utiles: number; acomodo: number;
}) {
  const entra = pieza.entra ?? 0;
  const sale = pieza.sale ?? 1.1;
  if (avance < entra) return null;

  // El rebote de entrada se calcula sobre cuadros reales, no sobre el avance de
  // la escena: así una pieza rebota igual en una escena de tres segundos que en
  // una de ocho, en vez de rebotar en cámara lenta cuando la frase es larga.
  const s = muelle(frame, fps, entra * utiles);
  const yendose = avance > sale ? interpolate(avance, [sale, Math.min(sale + 0.1, 1)], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  // El acomodo se hace al principio y se acaba, no se reparte sobre la escena
  // entera: si dura todo, la tarjeta que llega aterriza encima de una que
  // todavía va viajando y las dos se enciman a media frase. Terminando temprano,
  // el niño ve el movimiento y después ve la fila quieta, que es lo que tiene
  // que mirar mientras la voz nombra la pieza.
  const fin = Math.min(Math.max(entra + 0.08, acomodo), sale, 1);
  const t = interpolate(avance, [entra, fin], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const suave = t * t * (3 - 2 * t);

  const [x0, y0, w0] = pieza.de;
  const [x1, y1, w1] = pieza.a ?? pieza.de;
  const x = x0 + (x1 - x0) * suave;
  const y = y0 + (y1 - y0) * suave;
  const w = w0 + (w1 - w0) * suave;
  const giro = pieza.gira ? pieza.gira[0] + (pieza.gira[1] - pieza.gira[0]) * suave : 0;

  // «La fila quieta» de arriba era demasiado quieta. La tarjeta que ya llegó no
  // se para: respira. Periodo y fase distintos por índice para que la fila no
  // suba y baje en bloque, que se vería peor que si no se moviera.
  const respira = vaiven(frame, 43 + (indice % 3) * 11, indice * 1.9);
  const flota = respira * (agrandada ? 11 : 6);
  const ladeo = respira * (agrandada ? 0.85 : 0.5);
  // Y llega ladeada, alternando el lado, para que la entrada de dos tarjetas
  // seguidas no sea el mismo gesto dos veces.
  const giroEntrada = (1 - s) * (indice % 2 === 0 ? -5 : 5);

  // Lo apagado además se aleja: bajar sólo la opacidad deja la fila plana y el
  // niño no sabe cuál mirar. Un 8% de tamaño lo resuelve sin mover nada de sitio.
  //
  // CUÁNTO SE APAGA, Y POR QUÉ NO MÁS. Esto estaba en opacidad 0.3 con
  // `saturate(0.55)` y el resultado, medido en un cuadro del video 1, era que la
  // pieza amarilla se veía verde oliva y la roja, vino. En una escena cuya
  // pregunta literal es «¿cuál es la azul?», desaturar las otras dos destruye lo
  // único que hay que comparar: si las alternativas ya no tienen color, la
  // respuesta se puede dar sin saber ningún color. La que resalta ya se lleva
  // 18% de tamaño, un cerco celeste, el anillo animado y el sonido; no necesita
  // que las otras dejen de existir.
  const foco = agrandada ? 1.18 : apagada ? 0.92 : 1;
  const escala = foco * interpolate(s, [0, 1], [0.82, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${w * 100}%`,
        aspectRatio: '1 / 1',
        transform: `translate(-50%, calc(-50% + ${flota}px)) rotate(${giro + ladeo + giroEntrada}deg) scale(${escala})`,
        opacity: (apagada ? 0.6 : 1) * interpolate(s, [0, 1], [0, 1]) * yendose,
        transition: 'none',
        borderRadius: 32,
        overflow: 'hidden',
        boxShadow: agrandada
          ? '0 34px 76px rgba(0,0,0,0.5), 0 0 0 4px rgba(99,199,255,0.35)'
          : '0 28px 60px rgba(0,0,0,0.42)',
        border: '3px solid rgba(255,255,255,0.14)',
        filter: apagada ? 'saturate(0.95)' : 'none',
      }}
    >
      <Img src={rutaImagen(carpeta, pieza.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

/** La palomita, la tacha, el anillo y la flecha. Vectoriales, iguales en todo el nivel. */
function MarcaVectorial({
  marca, fps, frame, utiles,
}: { marca: Marca; fps: number; frame: number; utiles: number }) {
  const inicio = (marca.desde ?? 0.35) * utiles;
  if (frame < inicio) return null;

  const t = frame - inicio;
  const s = golpe(frame, fps, inicio);
  const tam = (marca.tam ?? 0.13) * 1920;
  const pulso = 1 + 0.05 * Math.sin(frame / 6);

  // El anillo de choque: sale una sola vez cuando la marca aterriza, se abre y
  // se apaga en medio segundo. Es lo que convierte «apareció una palomita» en
  // «pasó algo aquí», y cuesta un div.
  const onda = interpolate(t, [0, 17], [0.5, 2.4], { extrapolateRight: 'clamp' });
  const ondaOpacidad = interpolate(t, [0, 17], [0.45, 0], { extrapolateRight: 'clamp' });

  const comun: React.CSSProperties = {
    position: 'absolute',
    left: `${marca.en[0] * 100}%`,
    top: `${marca.en[1] * 100}%`,
    width: tam,
    height: tam,
    transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.4, 1]) * pulso})`,
    opacity: interpolate(s, [0, 1], [0, 1]),
  };

  const Onda = (
    <div
      style={{
        position: 'absolute',
        left: `${marca.en[0] * 100}%`,
        top: `${marca.en[1] * 100}%`,
        width: tam,
        height: tam,
        borderRadius: '50%',
        border: `6px solid ${marca.tipo === 'no' ? COLOR.no : COLOR.sky}`,
        transform: `translate(-50%, -50%) scale(${onda})`,
        opacity: ondaOpacidad,
        pointerEvents: 'none',
      }}
    />
  );

  if (marca.tipo === 'anillo') {
    return (
      <>
        {Onda}
        {/* 14 y no 10: el anillo cae encima de una tarjeta clara, y un trazo de
            10 px sobre 1920 se pierde contra el fondo de estudio de la
            ilustración justo en la mitad del círculo que más importa. El halo
            oscuro de fuera y el claro de dentro lo despegan de las dos cosas
            sobre las que puede caer, la tarjeta y el azul del fondo. */}
        <div
          style={{
            ...comun,
            borderRadius: '50%',
            border: `14px solid ${COLOR.sky}`,
            boxShadow: '0 0 0 7px rgba(6,26,53,0.5), inset 0 0 0 5px rgba(255,255,255,0.5)',
          }}
        />
      </>
    );
  }

  if (marca.tipo === 'flecha') {
    // La flecha no se queda apuntando: empuja. Un vaivén de 6% del tamaño en la
    // dirección a la que señala, que es lo que hace un dedo cuando insiste.
    const empujon = vaiven(frame, 17) * 0.06 * tam;
    return (
      <>
        {Onda}
        <div style={{ ...comun, transform: `${comun.transform} rotate(${marca.gira ?? 0}deg)` }}>
          <div style={{ width: '100%', height: '100%', transform: `translateY(${-empujon}px)` }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path d="M50 8 L82 48 H64 V92 H36 V48 H18 Z" fill={COLOR.sky} stroke="#06203f" strokeWidth={6} strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </>
    );
  }

  // La palomita y la tacha SE DIBUJAN. El círculo se cierra primero y el trazo
  // se pinta encima; encenderlas de golpe las volvía un icono pegado, y esto es
  // lo único en todo el video que ocurre en vez de mostrarse.
  const esSi = marca.tipo === 'si';
  const cerco = interpolate(t, [0, 11], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const trazo = interpolate(t, [4, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const CIRCUNFERENCIA = 276.5; // 2πr con r = 44
  const LARGO_SI = 70;          // los dos tramos de la palomita, medidos
  const LARGO_NO = 50;          // cada aspa de la tacha

  return (
    <>
      {Onda}
      <div style={comun}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx={50} cy={50} r={44} fill="rgba(6,26,53,0.72)" stroke="none" />
          <circle
            cx={50} cy={50} r={44} fill="none"
            stroke={esSi ? COLOR.si : COLOR.no} strokeWidth={7} strokeLinecap="round"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={CIRCUNFERENCIA * (1 - cerco)}
            transform="rotate(-90 50 50)"
          />
          {esSi ? (
            <path
              d="M28 52 L44 68 L74 34" fill="none" stroke={COLOR.si} strokeWidth={11}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={LARGO_SI} strokeDashoffset={LARGO_SI * (1 - trazo)}
            />
          ) : (
            <>
              <path
                d="M33 33 L67 67" fill="none" stroke={COLOR.no} strokeWidth={11} strokeLinecap="round"
                strokeDasharray={LARGO_NO} strokeDashoffset={LARGO_NO * (1 - trazo)}
              />
              <path
                d="M67 33 L33 67" fill="none" stroke={COLOR.no} strokeWidth={11} strokeLinecap="round"
                strokeDasharray={LARGO_NO}
                strokeDashoffset={LARGO_NO * (1 - interpolate(t, [8, 19], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
              />
            </>
          )}
        </svg>
      </div>
    </>
  );
}

/** Una escena completa, con su fundido de entrada, su impulso y sus sonidos. */
export function EscenaVista({
  carpeta, escena, duracionFrames, subtitulos = false, pasos = 0, pasoDe = 0, pasoA = 0,
  acento = COLOR.naranja,
}: {
  carpeta: string;
  escena: Escena;
  duracionFrames: number;
  /** Si se escribe en pantalla lo que se dice. Ver `VideoGuion.subtitulos`. */
  subtitulos?: boolean;
  /** Cuántos tiempos tiene el video. Cero apaga la barra de arriba. */
  pasos?: number;
  /**
   * Qué fracción del tiempo al que pertenece esta escena llevaba al empezarla, y
   * cuál al acabarla. Un tiempo suele durar tres o cuatro escenas, y sin esto el
   * tramo de la barra se llenaría y se vaciaría en cada corte.
   */
  pasoDe?: number;
  pasoA?: number;
  /**
   * El color del pilar, el mismo que la plataforma pinta en la tarjeta de la
   * mision. Llega por prop y no se deduce del nombre de la carpeta como en
   * robotica: alli la carpeta era `<nivel>-<NN>` y el nivel se leia del propio
   * nombre; aqui es `p1-b1-u6` y el pilar sale del temario, no del identificador.
   */
  acento?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const utiles = Math.max(duracionFrames - SOLAPE, 1);
  const avance = Math.min(frame / utiles, 1);
  const aparece = interpolate(frame, [0, SOLAPE], [0, 1], { extrapolateRight: 'clamp' });

  // Las que ya estaban tienen que haberse acomodado antes de que entre la nueva,
  // y con un respiro de por medio para que no sea todo al mismo tiempo.
  const entradas = (escena.piezas ?? []).map((p) => p.entra ?? 0).filter((e) => e > 0);
  const acomodo = entradas.length ? Math.min(...entradas) * 0.85 : 0.4;

  // El corte no sólo cruza opacidades: la escena entrante viene un pelo grande y
  // se asienta. Va en un envoltorio aparte para no escalar el fondo, que es el
  // mismo de la escena anterior y se notaría el salto del degradado.
  const impulso = interpolate(frame, [0, SOLAPE * 1.6], [1.03, 1], { extrapolateRight: 'clamp' });

  // Sólo suenan las piezas con llegada propia. Si sonara cada pieza de cada
  // escena, las que sólo siguen en pantalla porque la escena anterior las dejó
  // ahí volverían a sonar en cada corte y sería un traqueteo.
  const llegadas = (escena.piezas ?? [])
    .map((p, i) => ({ i, entra: p.entra ?? 0 }))
    .filter((p) => p.entra > 0);

  return (
    <AbsoluteFill style={{ opacity: aparece }}>
      <Fondo />
      <AbsoluteFill style={{ transform: `scale(${impulso})` }}>
        {escena.fondo && (
          <Lamina
            carpeta={carpeta}
            clave={escena.fondo}
            avance={avance}
            frame={frame}
            empuje={escena.empuje}
            desliza={escena.desliza}
            recorte={escena.recorte}
          />
        )}
        {escena.piezas?.map((p, i) => (
          <TarjetaPieza
            key={`${p.img}-${i}`}
            carpeta={carpeta}
            pieza={p}
            indice={i}
            avance={avance}
            frame={frame}
            fps={fps}
            utiles={utiles}
            acomodo={acomodo}
            apagada={escena.resalta !== undefined && escena.resalta !== i}
            agrandada={escena.resalta === i}
          />
        ))}
        {escena.marca && <MarcaVectorial marca={escena.marca} frame={frame} fps={fps} utiles={utiles} />}
      </AbsoluteFill>

      {/* El texto va FUERA del envoltorio del impulso: si entra ahí, cada corte
          arranca con las letras un 3% grandes y encogiéndose, que en una tipografía
          de sesenta y dos puntos se lee como un temblor. La imagen se asienta; lo
          escrito, no. */}
      {pasos > 0 && (
        <Pasos
          total={pasos}
          actual={escena.paso ?? 0}
          avance={interpolate(frame, [0, utiles], [pasoDe, pasoA], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })}
          color={acento}
        />
      )}
      {escena.rotulo && <Rotulo texto={escena.rotulo} color={acento} desde={Math.round(fps * 0.3)} />}
      {escena.cifra && (
        <Cifra numero={escena.cifra[0]} pie={escena.cifra[1]} color={acento} desde={Math.round(fps * 0.3)} />
      )}
      {subtitulos && escena.narracion && <Subtitulo texto={escena.narracion} />}

      <Efecto nombre="corte" en={0} />
      {/* El sonido propio de la escena. Sólo lo llevan las mudas, y por eso va
          en el cuadro cero: no compite con ninguna voz, es lo único que hay. */}
      {escena.sonido && esSfx(escena.sonido) && <Efecto nombre={escena.sonido} en={0} />}
      {llegadas.map(({ i, entra }) => (
        <Efecto key={`posa-${i}`} nombre="posa" en={entra * utiles} />
      ))}
      {escena.marca && (
        <Efecto nombre={efectoDeMarca(escena.marca.tipo)} en={(escena.marca.desde ?? 0.35) * utiles} />
      )}
    </AbsoluteFill>
  );
}
