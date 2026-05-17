// Structured security event logger.
// Events are written to console (picked up by Vercel logs + Sentry).
// Do NOT log passwords, tokens, or PII here.

export type SecurityEventType =
  | 'login_success'
  | 'login_failure'
  | 'login_rate_limited'
  | 'unauthorized_access'
  | 'forbidden_access'
  | 'admin_action'
  | 'session_expired'
  | 'suspicious_input';

interface SecurityEvent {
  event: SecurityEventType;
  userId?: string;
  ip?: string;
  path?: string;
  detail?: string;
}

export function logSecurityEvent(payload: SecurityEvent): void {
  const entry = {
    severity: 'SECURITY',
    timestamp: new Date().toISOString(),
    ...payload,
  };
  // eslint-disable-next-line no-console
  console.warn('[SECURITY]', JSON.stringify(entry));
}
