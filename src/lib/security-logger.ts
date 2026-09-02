// Structured security event logger.
// Events are written to console (picked up by Cloudflare Workers logs —
// dashboard "Logs"/"Tail" or `wrangler tail`). Sentry was deliberately
// removed during the Vercel → Cloudflare migration (2026-07-08) and is
// not wired up here.
// Do NOT log passwords, tokens, or full email addresses as PII here.

export type SecurityEventType =
  | 'login_success'
  | 'login_failure'
  | 'login_rate_limited'
  | 'logout_success'
  | 'unauthorized_access'
  | 'forbidden_access'
  | 'admin_action'
  | 'session_expired'
  | 'suspicious_input';

interface SecurityEvent {
  event: SecurityEventType;
  userId?: string;
  email?: string;
  ip?: string;
  path?: string;
  action?: string;
  detail?: string;
}

export function logSecurityEvent(payload: SecurityEvent): void {
  const entry = {
    severity: 'SECURITY',
    timestamp: new Date().toISOString(),
    ...payload,
  };
  console.warn('[SECURITY]', JSON.stringify(entry));
}
