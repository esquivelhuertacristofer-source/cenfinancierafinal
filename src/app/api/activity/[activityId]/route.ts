import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

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
  const filePath = path.join(
    process.cwd(),
    'src', 'data', 'actividades', level,
    `${fileName}.json`
  );

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}
