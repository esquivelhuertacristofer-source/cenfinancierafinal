/**
 * GENERADO POR `video-explicativo/scripts/emitir-mapa.mjs`. No editar a mano.
 *
 * Los sesenta videos producidos para la plataforma. Se sirven desde R2 bajo el
 * mismo origen —`/videos/<id>.mp4`— para no tocar la CSP y para que el egress
 * siga costando cero.
 *
 * Tres tipos, y cada uno entra por una puerta distinta:
 *
 *   general     presenta un pilar completo. Solo existe donde `PILLAR_VIDEOS`
 *               (src/lib/hub.ts) no tiene ya un video del autor; esos veintiuno
 *               son suyos, no se tocan y tienen prioridad.
 *   intermedio  entra en la unidad 6 de cada bloque, que es donde empieza la
 *               ampliación del temario y el registro cambia sin avisar.
 *   supremo     el reto final del grado.
 */

/** Clave de pilar (`${nivel}-${grado}-${slug}`) -> id del video. */
export const PILLAR_VIDEOS_GENERADOS: Record<string, string> = {
  'primary-6-primeros_pasos_hacia_el_ahorro': 'p6-b1-general',
  'primary-6-construyendo_independencia': 'p6-b2-general',
  'primary-6-planificacion_y_crecimiento': 'p6-b3-general',
  'primary-6-es_hora_de_emprender': 'p6-b4-general',
  'secondary-1-construyendo_independencia': 's1-b2-general',
  'secondary-1-planificacion_y_crecimiento': 's1-b3-general',
  'secondary-1-es_hora_de_emprender': 's1-b4-general',
  'secondary-2-primeros_pasos_hacia_el_ahorro': 's2-b1-general',
  'secondary-2-construyendo_independencia': 's2-b2-general',
  'secondary-2-planificacion_y_crecimiento': 's2-b3-general',
  'secondary-2-es_hora_de_emprender': 's2-b4-general',
  'secondary-3-primeros_pasos_hacia_el_ahorro': 's3-b1-general',
  'secondary-3-construyendo_independencia': 's3-b2-general',
  'secondary-3-planificacion_y_crecimiento': 's3-b3-general',
  'secondary-3-es_hora_de_emprender': 's3-b4-general',
};

/** Código de unidad -> id del video que le corresponde. */
export const UNIT_VIDEOS: Record<string, string> = {
  'P1-1-6': 'p1-b1-u6',
  'P1-2-6': 'p1-b2-u6',
  'P1-3-6': 'p1-b3-u6',
  'P1-4-6': 'p1-b4-u6',
  'P1-SUPREMO-COCHINITO': 'p1-supremo',
  'P2-1-6': 'p2-b1-u6',
  'P2-2-6': 'p2-b2-u6',
  'P2-3-6': 'p2-b3-u6',
  'P2-4-6': 'p2-b4-u6',
  'P2-SUPREMO-SUPERMERCADO': 'p2-supremo',
  'P3-1-6': 'p3-b1-u6',
  'P3-2-6': 'p3-b2-u6',
  'P3-3-6': 'p3-b3-u6',
  'P3-4-6': 'p3-b4-u6',
  'P3-SUPREMO-FAMILIA': 'p3-supremo',
  'P4-1-6': 'p4-b1-u6',
  'P4-2-6': 'p4-b2-u6',
  'P4-3-6': 'p4-b3-u6',
  'P4-4-6': 'p4-b4-u6',
  'P4-SUPREMO-BANCO-TIEMPO': 'p4-supremo',
  'P5-1-6': 'p5-b1-u6',
  'P5-2-6': 'p5-b2-u6',
  'P5-3-6': 'p5-b3-u6',
  'P5-4-6': 'p5-b4-u6',
  'P5-SUPREMO-INVERSOR': 'p5-supremo',
  'P6-1-6': 'p6-b1-u6',
  'P6-2-6': 'p6-b2-u6',
  'P6-3-6': 'p6-b3-u6',
  'P6-4-6': 'p6-b4-u6',
  'P6-SUPREMO-NEGOCIO': 'p6-supremo',
  'S1-1-6': 's1-b1-u6',
  'S1-2-6': 's1-b2-u6',
  'S1-3-6': 's1-b3-u6',
  'S1-4-6': 's1-b4-u6',
  'S1-SUPREMO-SUELDO': 's1-supremo',
  'S2-1-6': 's2-b1-u6',
  'S2-2-6': 's2-b2-u6',
  'S2-3-6': 's2-b3-u6',
  'S2-4-6': 's2-b4-u6',
  'S2-SUPREMO-CRISIS': 's2-supremo',
  'S3-1-6': 's3-b1-u6',
  'S3-2-6': 's3-b2-u6',
  'S3-3-6': 's3-b3-u6',
  'S3-4-6': 's3-b4-u6',
  'S3-SUPREMO-PORTFOLIO': 's3-supremo',
};

/** Título de cada video, para el encabezado del reproductor. */
export const VIDEO_TITULOS: Record<string, string> = {
  'p1-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  'p1-b2-u6': "Construyendo Independencia — segunda parte",
  'p1-b3-u6': "Planificación y Crecimiento — segunda parte",
  'p1-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  'p1-supremo': "El Cochinito Vivo",
  'p2-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  'p2-b2-u6': "Construyendo Independencia — segunda parte",
  'p2-b3-u6': "Planificación y Crecimiento — segunda parte",
  'p2-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  'p2-supremo': "Supermercado en Caos",
  'p3-b1-u6': "Mi Primer Presupuesto — segunda parte",
  'p3-b2-u6': "Bancos y Cuentas — segunda parte",
  'p3-b3-u6': "Crédito y Deuda — segunda parte",
  'p3-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  'p3-supremo': "La Familia Ramirez",
  'p4-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  'p4-b2-u6': "Construyendo Independencia — segunda parte",
  'p4-b3-u6': "Planificación y Crecimiento — segunda parte",
  'p4-b4-u6': "Emprendimiento — segunda parte",
  'p4-supremo': "Banco del Tiempo: Tres Crisis",
  'p5-b1-u6': "Sistema Financiero — segunda parte",
  'p5-b2-u6': "Consumo Responsable — segunda parte",
  'p5-b3-u6': "Inversión y Patrimonio — segunda parte",
  'p5-b4-u6': "Emprendimiento y Liderazgo — segunda parte",
  'p5-supremo': "Inversor A-10",
  'p6-b1-general': "Primeros Pasos Hacia el Ahorro",
  'p6-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  'p6-b2-general': "Construyendo Independencia",
  'p6-b2-u6': "Construyendo Independencia — segunda parte",
  'p6-b3-general': "Planificación y Crecimiento",
  'p6-b3-u6': "Planificación y Crecimiento — segunda parte",
  'p6-b4-general': "¡Es Hora de Emprender!",
  'p6-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  'p6-supremo': "Mi Primer Negocio",
  's1-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  's1-b2-general': "Construyendo Independencia",
  's1-b2-u6': "Construyendo Independencia — segunda parte",
  's1-b3-general': "Planificación y Crecimiento",
  's1-b3-u6': "Planificación y Crecimiento — segunda parte",
  's1-b4-general': "¡Es Hora de Emprender!",
  's1-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  's1-supremo': "Negocia Tu Sueldo",
  's2-b1-general': "Primeros Pasos Hacia el Ahorro",
  's2-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  's2-b2-general': "Construyendo Independencia",
  's2-b2-u6': "Construyendo Independencia — segunda parte",
  's2-b3-general': "Planificación y Crecimiento",
  's2-b3-u6': "Planificación y Crecimiento — segunda parte",
  's2-b4-general': "¡Es Hora de Emprender!",
  's2-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  's2-supremo': "Crisis Room: Mexico 1994",
  's3-b1-general': "Primeros Pasos Hacia el Ahorro",
  's3-b1-u6': "Primeros Pasos Hacia el Ahorro — segunda parte",
  's3-b2-general': "Construyendo Independencia",
  's3-b2-u6': "Construyendo Independencia — segunda parte",
  's3-b3-general': "Planificación y Crecimiento",
  's3-b3-u6': "Planificación y Crecimiento — segunda parte",
  's3-b4-general': "¡Es Hora de Emprender!",
  's3-b4-u6': "¡Es Hora de Emprender! — segunda parte",
  's3-supremo': "Portfolio Builder: Tu Vida Financiera",
};

/** La URL pública de un video producido. Mismo origen: no requiere tocar la CSP. */
export function urlVideo(id: string): string {
  return `/videos/${id}.mp4`;
}

/** El póster JPG que `escenas-video.mjs` extrae del segundo 1 de cada render. */
export function posterVideo(id: string): string {
  return `/videos/${id}.jpg`;
}

/** Un video generado se sirve local; los del autor son embeds de YouTube. */
export function esVideoGenerado(url: string): boolean {
  return url.startsWith('/videos/');
}

/**
 * El póster de un video del que sólo se tiene la URL.
 *
 * Las pantallas de pilar guardan la URL ya armada, no el id, porque ahí conviven con los videos de
 * YouTube del autor, que no tienen id nuestro. Cambiar la extension es seguro: el mp4 y el jpg
 * salen del mismo render y `publicar-videos.mjs` los sube juntos o no sube ninguno.
 */
/**
 * El titulo de un video del que solo se tiene la URL, para el encabezado del reproductor.
 *
 * Mismo motivo que posterDeUrl: las pantallas de pilar guardan la URL, no el id, porque comparten
 * ese campo con los videos de YouTube del autor. Devuelve undefined para los de YouTube, que traen
 * su titulo puesto por el propio YouTube.
 */
export function tituloDeUrl(url: string): string | undefined {
  return esVideoGenerado(url) ? VIDEO_TITULOS[url.slice(8, -4)] : undefined;
}

export function posterDeUrl(url: string): string | undefined {
  return esVideoGenerado(url) ? url.slice(0, -4) + '.jpg' : undefined;
}
