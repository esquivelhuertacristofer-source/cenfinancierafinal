// Lector de JSON servidos como assets estáticos (public/data/...).
//
// Los JSON del currículo y actividades (~4 MB) NO deben importarse en código
// de servidor: quedarían empaquetados en el Worker y el plan free de
// Cloudflare limita el script a 3 MiB gzip. Como assets estáticos no cuentan
// contra ese límite.
//
// - Cloudflare Workers (producción / wrangler dev): binding ASSETS.
// - next dev (Node): filesystem sobre public/.
export async function getAssetJson(pathname: string): Promise<unknown | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    const assets = (env as unknown as {
      ASSETS: { fetch(input: URL | string): Promise<Response> };
    }).ASSETS;
    // ASSETS.fetch ignora el host de la URL; solo importa el pathname.
    const res = await assets.fetch(new URL(pathname, 'https://assets.local'));
    if (res.ok) return await res.json();
  } catch {
    // Sin runtime de Cloudflare Workers disponible (ej. `next dev` / `next start`
    // en Node plano) — se cae al filesystem debajo.
  }

  try {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const filePath = join(process.cwd(), 'public', ...pathname.split('/').filter(Boolean));
    return JSON.parse(await readFile(filePath, 'utf-8'));
  } catch {
    return null;
  }
}
