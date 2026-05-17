import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

// GET /api/test-sentry?test=true — manually verify Sentry connectivity
// Blocked in production (returns 403)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const isTest = searchParams.get('test') === 'true';

  if (!isTest) {
    return NextResponse.json(
      { error: 'Pass ?test=true to trigger a test error' },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_SENTRY_DSN not configured.' },
      { status: 503 }
    );
  }

  const testError = new Error('[CEN TEST] Sentry connectivity check — ignore if you see this');
  const eventId = Sentry.captureException(testError, {
    tags: { 'cen.test': 'true', 'cen.handled': 'true' },
  });

  await Sentry.flush(2000);

  return NextResponse.json({
    ok: true,
    eventId,
    dsn_configured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    env: process.env.NODE_ENV,
    message: 'Test error sent to Sentry. Check your Sentry dashboard.',
  });
}
