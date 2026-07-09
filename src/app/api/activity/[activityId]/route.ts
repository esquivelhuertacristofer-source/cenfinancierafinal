import { NextRequest, NextResponse } from 'next/server';
import { getAssetJson } from '@/lib/data-assets';

// Los JSON viven en public/data/actividades/ y se leen como assets estáticos
// (ver data-assets.ts): empaquetarlos en el Worker reventaría el límite de
// 3 MiB gzip del plan free de Cloudflare.

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;

  // Whitelist: only alphanumeric and hyphens — blocks path traversal via ../
  if (!/^[a-z0-9-]+$/i.test(activityId)) {
    return NextResponse.json(null, { status: 404 });
  }

  const parts = activityId.toUpperCase().split('-');

  if (parts.length < 4 || parts[0] !== 'ACT') {
    return NextResponse.json(null, { status: 404 });
  }

  const level = parts[1].toLowerCase();
  const fileName = activityId.toLowerCase();

  const data = await getAssetJson(`/data/actividades/${level}/${fileName}.json`);

  if (!data) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
