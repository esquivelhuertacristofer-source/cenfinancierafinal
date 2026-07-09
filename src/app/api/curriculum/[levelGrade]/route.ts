import { NextRequest, NextResponse } from 'next/server';
import { getAssetJson } from '@/lib/data-assets';

// Los JSON viven en public/data/pedagogia/ y se leen como assets estáticos
// (ver data-assets.ts): importarlos aquí los empaquetaría en el Worker y
// reventaría el límite de 3 MiB gzip del plan free de Cloudflare.

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ levelGrade: string }> }
) {
  const { levelGrade } = await params;

  // Whitelist: only alphanumeric and one hyphen — blocks path traversal
  if (!/^[a-z0-9]+-[a-z0-9]+$/i.test(levelGrade)) {
    return NextResponse.json(null, { status: 400 });
  }

  const parts = levelGrade.split('-');
  if (parts.length !== 2) return NextResponse.json(null, { status: 400 });

  const [level, grade] = parts;
  const prefix = level === 'primary' ? 'p' : 's';
  const dir = level === 'primary' ? 'primaria' : 'secundaria';

  const data = await getAssetJson(`/data/pedagogia/${dir}/${prefix}${grade}.json`);

  if (!data) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
  });
}
