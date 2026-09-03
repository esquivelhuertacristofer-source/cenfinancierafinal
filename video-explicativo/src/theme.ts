import { loadFont as loadBaloo } from '@remotion/google-fonts/Baloo2';
import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import { loadFont as loadEpilogue } from '@remotion/google-fonts/Epilogue';

const { fontFamily: FUENTE_TITULO } = loadBaloo();
const { fontFamily: FUENTE_TEXTO } = loadNunito();
const { fontFamily: FUENTE_DISPLAY } = loadEpilogue();

/**
 * Baloo para primaria, Epilogue para secundaria.
 *
 * La plataforma usa Epilogue en todo el hub y en el panel docente, así que los
 * videos de secundaria escriben con la misma letra que la pantalla desde la que
 * el alumno los abre. En primaria eso se cambia a propósito: Baloo es redonda y
 * de trazo grueso, y a los siete años se lee mejor de lejos en un salón.
 */
export const FUENTES = { titulo: FUENTE_TITULO, texto: FUENTE_TEXTO, display: FUENTE_DISPLAY };

/**
 * La paleta de la plataforma, tal cual sale de `globals.css` y del hub.
 *
 * `navy` es el fondo del panel docente (#011C40) y `fondo` el del hub del
 * alumno (#0A0118): el video se abre desde el hub, así que su fondo es el del
 * hub y no el del dashboard. El naranja es el acento de CEN en todos lados.
 */
export const COLOR = {
  navy: '#0A0118',
  navyClaro: '#120526',
  blue: '#011C40',
  sky: '#42E8E0',
  naranja: '#FF8C00',
  amarillo: '#FFD700',
  blanco: '#ffffff',
  si: '#10B981',
  no: '#EF4444',
};

/**
 * El color de acento de cada pilar, igual que `CATEGORY_STYLES` en `src/lib/hub.ts`.
 *
 * Las claves son el `slugify()` de la categoría del temario, que es exactamente
 * lo que usa la plataforma para construir `videoKey`. Si un pilar no está aquí,
 * el video sale con el naranja de CEN y no con un gris de emergencia: un video
 * sin color de pilar sigue siendo un video de CEN.
 */
export const COLOR_PILAR: Record<string, string> = {
  primeros_pasos_hacia_el_ahorro: '#10B981',
  construyendo_independencia: '#42E8E0',
  planificacion_y_crecimiento: '#0EA5E9',
  es_hora_de_emprender: '#FF8C00',
  emprendimiento: '#FF8C00',
  mi_primer_presupuesto: '#10B981',
  bancos_y_cuentas: '#42E8E0',
  credito_y_deuda: '#EF4444',
  sistema_financiero: '#0EA5E9',
  consumo_responsable: '#F59E0B',
  inversion_y_patrimonio: '#8B5CF6',
  emprendimiento_y_liderazgo: '#FF8C00',
  reto_supremo: '#FFD700',
};

export const acentoDe = (pilar: string) => COLOR_PILAR[pilar] ?? COLOR.naranja;
