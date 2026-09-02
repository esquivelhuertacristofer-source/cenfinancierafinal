import { notFound } from 'next/navigation';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import PreviewClient, { type ItemActividad } from './PreviewClient';

/**
 * Banco de pruebas de motores de actividad. SOLO DESARROLLO.
 *
 * Permite abrir cualquiera de las 369 actividades con su motor aislado, sin
 * pasar por login ni por la navegación del hub. Se usa para revisar cada motor
 * de forma individual durante el refactor.
 */

export const dynamic = 'force-dynamic';

function leerCatalogo(): ItemActividad[] {
  const raiz = join(process.cwd(), 'public', 'data', 'actividades');
  const items: ItemActividad[] = [];

  for (const grado of readdirSync(raiz)) {
    let archivos: string[] = [];
    try { archivos = readdirSync(join(raiz, grado)); } catch { continue; }

    for (const archivo of archivos) {
      if (!archivo.endsWith('.json')) continue;
      try {
        const j = JSON.parse(readFileSync(join(raiz, grado, archivo), 'utf8'));
        const tipo = String(j.tipo || j.type || '').toUpperCase().trim() || '(SIN TIPO)';
        items.push({
          archivo,
          grado,
          tipo,
          titulo: j.titulo || j.unit_title || archivo,
          unidad: j.unit_code || '',
          edad: j.edad || '',
          complejidad: j.complejidad || '',
        });
      } catch {
        // Un JSON corrupto no debe tumbar el banco de pruebas.
        items.push({ archivo, grado, tipo: '(JSON INVÁLIDO)', titulo: archivo, unidad: '', edad: '', complejidad: '' });
      }
    }
  }

  return items.sort((a, b) =>
    a.tipo.localeCompare(b.tipo) || a.grado.localeCompare(b.grado) || a.archivo.localeCompare(b.archivo));
}

export default function BancoDeMotores() {
  // Nunca debe existir en producción: expone contenido sin autenticación.
  if (process.env.NODE_ENV === 'production') notFound();

  return <PreviewClient catalogo={leerCatalogo()} />;
}
