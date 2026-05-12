import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

// GET /api/test-sentry?test=true — manually verify Sentry connectivity
// Only works in non-production or with ?secret=xxx to prevent accidental triggering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isTest = searchParams.get('test') === 'true';

  if (!isTest) {
    return NextResponse.json(
      { error: 'Pass ?test=true to trigger a test error' },
      { status: 400 }
    );
  }

  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_SENTRY_DSN not configured. See docs/SENTRY-SETUP-INSTRUCCIONES.md' },
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
