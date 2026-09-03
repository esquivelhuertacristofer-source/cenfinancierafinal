/**
 * Sirve los sesenta videos producidos por `video-explicativo/` desde R2, bajo el
 * mismo origen que la app.
 *
 * POR QUE NO SE EXPONE EL BUCKET DIRECTAMENTE. Un bucket público vive en otro
 * dominio, y eso obliga a abrir `media-src` en la CSP de `middleware.ts` hacia un
 * host de terceros. Sirviéndolos desde `/videos/*` la CSP se queda como está y el
 * navegador los trata como cualquier otro recurso propio. El egress de R2 cuesta
 * cero en los dos casos, así que no se paga nada por la vuelta.
 *
 * POR QUE HACE FALTA SOPORTAR `Range`. Sin respuesta 206 el navegador no puede
 * saltar a la mitad del video: la barra de progreso se vuelve decorativa y
 * cualquier salto vuelve a descargar el archivo desde el principio. R2 lee rangos
 * de forma nativa, así que es sólo cuestión de pasárselo y responder los
 * encabezados correctos.
 *
 * LOS ARCHIVOS SE SUBEN A MANO, no en el build: son ~1.2 GB que no tienen por qué
 * viajar en cada despliegue. `wrangler r2 object put` los deja ahí una vez.
 */

interface R2Objeto {
  body: ReadableStream | null;
  size: number;
  httpEtag: string;
  range?: { offset: number; length: number };
  writeHttpMetadata?: (headers: Headers) => void;
}

interface R2Bucket {
  get(
    key: string,
    opciones?: { range?: { offset: number; length?: number }; onlyIf?: unknown },
  ): Promise<R2Objeto | null>;
}

/** Sólo `<id>.mp4` y `<id>.jpg`: nada de rutas ni de subir por el árbol. */
const NOMBRE_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(mp4|jpg)$/;

const TIPOS: Record<string, string> = {
  mp4: 'video/mp4',
  jpg: 'image/jpeg',
};

async function getBucket(): Promise<R2Bucket | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    return (env as unknown as { VIDEOS?: R2Bucket }).VIDEOS ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ archivo: string }> },
) {
  const { archivo } = await params;

  if (!NOMBRE_VALIDO.test(archivo)) {
    return new Response('Not found', { status: 404 });
  }

  const bucket = await getBucket();
  if (!bucket) {
    // En `next dev` no hay binding. Se dice explícitamente en vez de servir un
    // 404 mudo, que en desarrollo se confunde con un video que no se generó.
    return new Response('Videos no disponibles: falta el binding R2 VIDEOS.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const extension = archivo.slice(archivo.lastIndexOf('.') + 1);
  const contentType = TIPOS[extension] ?? 'application/octet-stream';

  /* `Range` sólo se atiende en su forma simple `bytes=inicio-fin`, que es la
     única que emiten los navegadores para <video>. Un rango con varios tramos o
     con sufijo se ignora y se responde el archivo entero, que es válido. */
  const rango = request.headers.get('range');
  const m = rango ? /^bytes=(\d+)-(\d*)$/.exec(rango.trim()) : null;

  const objeto = m
    ? await bucket.get(archivo, {
        range: {
          offset: Number(m[1]),
          ...(m[2] ? { length: Number(m[2]) - Number(m[1]) + 1 } : {}),
        },
      })
    : await bucket.get(archivo);

  if (!objeto || !objeto.body) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers({
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'ETag': objeto.httpEtag,
    // Los videos son inmutables: un cambio de contenido cambia el nombre del
    // archivo, nunca el contenido de uno existente.
    'Cache-Control': 'public, max-age=31536000, immutable',
  });

  if (objeto.range && m) {
    const inicio = objeto.range.offset;
    const fin = inicio + objeto.range.length - 1;
    headers.set('Content-Range', `bytes ${inicio}-${fin}/${objeto.size}`);
    headers.set('Content-Length', String(objeto.range.length));
    return new Response(objeto.body, { status: 206, headers });
  }

  headers.set('Content-Length', String(objeto.size));
  return new Response(objeto.body, { status: 200, headers });
}
