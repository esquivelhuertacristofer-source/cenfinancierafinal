'use client';

import { esVideoGenerado, posterDeUrl } from '@/lib/videos-generados';

/**
 * El marco donde se ve un video, sea de quien sea.
 *
 * POR QUÉ EXISTE. La plataforma reproduce videos en cuatro pantallas —el hub, la página de un
 * pilar, la de misión y el modal de una unidad— y cada una tenía su propio `<iframe>` escrito a
 * mano, con su propia forma de armar la URL. Mientras todos los videos fueron de YouTube eso sólo
 * era repetición. Con los sesenta videos propios deja de serlo: un mp4 metido en un `<iframe>` con
 * `?autoplay=1&rel=0&modestbranding=1` colgado atrás no reproduce nada, y no falla con un error
 * visible sino con un rectángulo negro. Cuatro copias son cuatro sitios donde ese rectángulo puede
 * aparecer, así que la decisión de qué etiqueta usar vive aquí y en ningún otro lado.
 *
 * QUÉ DECIDE. Si la URL apunta a `/videos/…` es de los nuestros y se sirve con un `<video>` nativo:
 * arranca antes que un iframe, respeta el volumen del sistema, permite precargar sólo la metadata
 * y no mete el reproductor de un tercero en una pantalla que ven niños. Cualquier otra URL es un
 * video del autor en YouTube y sigue exactamente como estaba.
 *
 * QUÉ NO HACE. No pone marco, ni bordes, ni títulos, ni botón de cerrar. Llena a su contenedor y ya.
 * Toda la escenografía —el marco de lujo del hub, las esquinas redondas del modal, los degradados de
 * cine— se queda donde estaba, porque cada pantalla la tiene distinta y no hay por qué unificarla
 * para arreglar el reproductor.
 */

interface Props {
  url: string;
  title: string;
  /** Sólo para los propios. Si no se pasa, se deduce del nombre del mp4. */
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

/* Acepta las formas en que un enlace de YouTube llega a la mano: el `watch?v=`, el `youtu.be/`
   corto, el `/embed/` ya listo y el que trae parámetros pegados atrás. */
function urlDeEmbed(url: string): string {
  if (url.includes('/embed/')) {
    return url.includes('autoplay') ? url : `${url}${url.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`;
  }
  const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  const id = match && match[2].length === 11 ? match[2] : null;
  return id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : url;
}

export default function VideoFrame({ url, title, poster, className = 'w-full h-full', autoPlay = true }: Props) {
  if (esVideoGenerado(url)) {
    return (
      <video
        src={url}
        poster={poster ?? posterDeUrl(url)}
        title={title}
        className={`${className} bg-black`}
        controls
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        /* Los videos son de la plataforma y se sirven desde R2 sin marca de agua: quitar el botón
           de descarga no los protege de nadie decidido, pero evita que salgan de aquí por accidente. */
        controlsList="nodownload"
      />
    );
  }

  return (
    <iframe
      src={urlDeEmbed(url)}
      title={title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
