/**
 * El guión de un video, en datos.
 *
 * POR QUÉ ASÍ Y NO UN COMPONENTE POR VIDEO. Escribir un `.tsx` y un `timeline.ts`
 * a mano por video son ciento veinte archivos casi iguales para los sesenta que
 * lleva la plataforma. Aquí el video es un JSON —`guiones/<grado>.json`, uno por
 * grado con todos sus videos dentro— y hay un solo componente que lo interpreta.
 * El JSON es además el único lugar donde viven los prompts de las ilustraciones y
 * los textos de la narración, así que el generador de imágenes, el de voz y el
 * render leen todos lo mismo y no se pueden desincronizar.
 *
 * NADA DE ESTO SE ESCRIBE A MANO TAL CUAL. Lo que se escribe es
 * `guiones-fuente/<grado>.mjs` —los prompts y lo que se dice, agrupado en cinco
 * tiempos— y `scripts/armar-guion.mjs` lo compila a este formato. Las duraciones
 * tampoco: las mide `scripts/narracion.py` del WAV y las deja en su propio
 * archivo, `guiones/<grado>.duraciones.json`, que Root.tsx junta al cargar.
 */

/** Una pieza: una ilustración cuadrada que se mueve sobre el fondo del video. */
export interface Pieza {
  /** Clave dentro de `imagenes` del video. */
  img: string;
  /** Posición y tamaño de salida: `[x, y, ancho]`, todo de 0 a 1 sobre el cuadro. */
  de: [number, number, number];
  /** Posición y tamaño de llegada. Si falta, la pieza se queda quieta. */
  a?: [number, number, number];
  /** Giro en grados, de → a. Para el balancín y para lo que se ladea. */
  gira?: [number, number];
  /** En qué punto de la escena aparece, de 0 a 1. Por omisión, al empezar. */
  entra?: number;
  /** En qué punto se va. Por omisión, se queda hasta el final. */
  sale?: number;
}

/** Una marca vectorial encima de la escena. La dibuja Remotion, no el modelo. */
export interface Marca {
  tipo: 'si' | 'no' | 'anillo' | 'flecha';
  /** Centro de la marca, `[x, y]` de 0 a 1. */
  en: [number, number];
  /** En qué punto de la escena aparece, de 0 a 1. */
  desde?: number;
  /** Sólo para la flecha: hacia dónde apunta, en grados (0 = hacia arriba). */
  gira?: number;
  /** Tamaño relativo al ancho del cuadro. Por omisión 0.13. */
  tam?: number;
}

export interface Escena {
  id: string;
  /** Lo que se oye. Si falta, la escena es un respiro visual sin voz. */
  narracion?: string;
  /** Clave de la ilustración a pantalla completa. Excluyente con `piezas`. */
  fondo?: string;
  /** Cuánto se acerca la cámara a lo largo de la escena. Por omisión 0.05. */
  empuje?: number;
  /**
   * Reencuadre dentro de la lámina: `[x, y, ancho]` de 0 a 1, donde `[0.5,0.5,1]`
   * es la imagen entera y `[0.3,0.6,0.35]` es un detalle del tercio izquierdo.
   *
   * Es lo que convierte doce imágenes en treinta planos. La medición de los 216
   * videos dio una imagen nueva cada 17,5 segundos: la pantalla casi no cambia, y
   * ése es el motivo principal de que se hagan largos. Acercarse a un detalle de
   * la misma ilustración es un plano nuevo para el que mira, y no cuesta ni una
   * imagen más ni un minuto de generación.
   */
  recorte?: [number, number, number];
  /** Hacia dónde deriva la cámara, en fracción de cuadro. */
  desliza?: [number, number];
  /** Las piezas que se mueven sobre el fondo del video. Excluyente con `fondo`. */
  piezas?: Pieza[];
  /** Índice de la pieza que se agranda mientras las demás se apagan. */
  resalta?: number;
  /**
   * El término técnico escrito en pantalla, abajo a la izquierda. Se pone UNA vez,
   * la primera que se dice. Nivel 0 no lleva nunca: ahí el niño no lee.
   */
  rotulo?: string;
  /** Un número grande arriba a la derecha, con su palabra debajo: `['6', 'veces']`. */
  cifra?: [string, string?];
  /**
   * A qué tiempo del video pertenece esta escena, de 0 a 4: gancho, pregunta,
   * error, idea, cierre. Es lo que llena la barra de pasos de arriba.
   */
  paso?: number;
  marca?: Marca;
  /** Duración del WAV, en segundos. La mide y la escribe `scripts/narracion.py`. */
  duracionS?: number;
  /** Duración fija de una escena sin voz. */
  silencioS?: number;
  /**
   * El respiro de ESTA escena, en segundos, cuando el de todas (`GAP_S`) se le
   * queda corto: la última imagen de una idea, la comparación que hay que dejar
   * cuajar, el remate antes del cierre. Se paga escena por escena y no las
   * treinta, que es lo que volvió lento al primer video.
   */
  respiroS?: number;
  /**
   * Un sonido propio de esta escena, montado en su primer cuadro. Es para las
   * escenas sin voz: la caja que se abre, la tapa que se cierra, las piezas que
   * quedan juntas. Sin esto, una escena muda es muda de todo, y al medir la
   * mezcla del primer video eso salió como tres segundos y medio seguidos de
   * nada en el segundo nueve.
   *
   * El nombre tiene que existir en la tabla `SFX` de `Escenas.tsx`, que es la
   * que decide a qué volumen suena cada uno.
   */
  sonido?: string;
}

export interface VideoGuion {
  /**
   * El identificador del video, y a la vez la carpeta de sus ilustraciones, la
   * de sus audios, el id de su composición de Remotion, el nombre de su mp4 y su
   * clave en `src/lib/videos-generados.ts` del lado de la app. Un solo nombre
   * para todo, así no hay ningún mapa que mantener sincronizado.
   *
   * `p1-b1-u6` (intermedio), `p6-b2-general` (presenta el pilar) o `s3-supremo`.
   */
  carpeta: string;
  titulo: string;
  /** `general`, `intermedio` o `supremo`. Lo pone `scripts/catalogo.mjs`. */
  tipo?: string;
  /** El pilar al que pertenece, tal como lo nombra el temario. */
  pilar?: string;
  /** La clave por la que la app lo engancha: código de unidad o clave de pilar. */
  ancla?: string | null;
  /** Clave → prompt de ComfyUI. Una imagen puede usarse en varias escenas. */
  imagenes: Record<string, string>;
  /** Las claves de `imagenes` que van a pantalla completa (16:9). El resto son piezas cuadradas. */
  laminas: string[];
  /**
   * Semilla fija por imagen, para cuando dos láminas tienen que salir con el
   * mismo personaje o el mismo objeto y sólo cambiar en una cosa. Si falta, el
   * generador la deriva del nombre, que basta para que repetir el comando no
   * cambie nada.
   */
  semillas?: Record<string, number>;
  /**
   * Las claves de `imagenes` a las que se les permite escribir cifras.
   *
   * En educacion financiera el numero ES el contenido mas veces que en robotica:
   * un precio, un porcentaje, lo que quedo en la alcancia. La ficha de estilo
   * prohibe escribir por omision —con cfg 1 el modelo inventa garabatos— y esta
   * lista es la excepcion, pedida imagen por imagen.
   */
  conCifras?: string[];

  /**
   * Si el video escribe en pantalla lo que se está diciendo.
   *
   * Va apagado salvo que el guion lo encienda, y no por prudencia: los videos de
   * nivel 0 son para niños de cuatro años que no leen, y ahí un subtítulo sólo
   * tapa la ilustración. De nivel 1 para arriba conviene encenderlo, porque el
   * video se ve en un salón con treinta niños y media clase no va a oír la voz.
   */
  subtitulos?: boolean;
  escenas: Escena[];
}

/**
 * Un grado entero: sus cinco a nueve videos.
 *
 * POR QUE POR GRADO Y NO POR PILAR. Los 60 videos se reparten muy desigual —P1
 * tiene cinco y P6 nueve— porque los 21 videos que ya produjo el autor llenan el
 * hueco `general` de 21 pilares. Agrupar por grado deja nueve archivos parejos de
 * escribir y, sobre todo, hace que la ficha de estilo —que depende del grado y no
 * del pilar— sea una decision del archivo y no de cada video.
 */
export interface GradoGuion {
  /** `p1`..`p6`, `s1`..`s3`. Decide la ficha de estilo de las ilustraciones. */
  grado: string;
  /** Color de acento por video, sacado del pilar. La clave es la carpeta. */
  acentos?: Record<string, string>;
  videos: VideoGuion[];
}
