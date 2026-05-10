import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ levelGrade: string }> }
) {
  const { levelGrade } = await params;
  const parts = levelGrade.split('-');
  if (parts.length !== 2) return NextResponse.json(null, { status: 400 });

  const [level, grade] = parts;
  const folder = level === 'primary' ? 'primaria' : 'secundaria';
  const prefix = level === 'primary' ? 'p' : 's';
  const filePath = path.join(
    process.cwd(),
    'src', 'data', 'pedagogia', folder,
    `${prefix}${grade}.json`
  );

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}
