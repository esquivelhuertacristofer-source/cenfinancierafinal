/**
 * Tests for app/actions/authActions.ts
 * Covers: loginAction — validation, rate limiting, auth failure, success + role, logging
 */

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('next/headers', () => ({
  headers: jest.fn(() =>
    Promise.resolve({ get: (h: string) => (h === 'x-forwarded-for' ? '1.2.3.4' : null) })
  ),
}));

const mockSignInWithPassword = jest.fn();
const mockGetUser = jest.fn();
const mockSingleProfile = jest.fn();

jest.mock('@/lib/supabase-server', () => ({
  createSupabaseServerClient: jest.fn(() =>
    Promise.resolve({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        getUser: mockGetUser,
        signOut: jest.fn().mockResolvedValue({}),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: mockSingleProfile,
      })),
    })
  ),
}));

const mockLogSecurityEvent = jest.fn();
jest.mock('@/lib/security-logger', () => ({
  logSecurityEvent: jest.fn((...args: unknown[]) => mockLogSecurityEvent(...args)),
}));

// Expose the rate-limit store so tests can reset it between runs
jest.mock('@/lib/rate-limiter', () => {
  const store = new Map<string, { count: number; resetAt: number }>();
  return {
    rateLimit: jest.fn(({ key, max, windowMs }: { key: string; max: number; windowMs: number }) => {
      const now = Date.now();
      const bucket = store.get(key);
      if (!bucket || now > bucket.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return Promise.resolve({ allowed: true, remaining: max - 1, resetAt: now + windowMs });
      }
      if (bucket.count >= max) return Promise.resolve({ allowed: false, remaining: 0, resetAt: bucket.resetAt });
      bucket.count += 1;
      return Promise.resolve({ allowed: true, remaining: max - bucket.count, resetAt: bucket.resetAt });
    }),
    __store: store,
  };
});

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

import { loginAction } from '@/app/actions/authActions';
import { logSecurityEvent } from '@/lib/security-logger';
import { rateLimit } from '@/lib/rate-limiter';

const mockRateLimit = jest.mocked(rateLimit);

// Helper — make rate limit always allow
const allowAll = () =>
  mockRateLimit.mockResolvedValue({ allowed: true, remaining: 9, resetAt: Date.now() + 60000 });

// ── Tests ────────────────────────────────────────────────────────────────────

describe('loginAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogSecurityEvent.mockClear();
  });

  it('returns error for invalid email format', async () => {
    allowAll();
    const result = await loginAction('not-an-email', 'password123');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/inválido/i);
  });

  it('returns error for empty password', async () => {
    allowAll();
    const result = await loginAction('user@test.com', '');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/requerida/i);
  });

  it('returns error when Supabase rejects credentials', async () => {
    allowAll();
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    const result = await loginAction('user@test.com', 'wrongpassword');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('Credenciales incorrectas');
  });

  it('logs login_failure on wrong credentials', async () => {
    allowAll();
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    await loginAction('user@test.com', 'wrongpassword');

    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'login_failure' })
    );
  });

  it('blocks after IP rate limit (5 attempts per minute)', async () => {
    // Make the IP rate-limit check return blocked immediately
    mockRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 60000 });

    const result = await loginAction('user@test.com', 'password123');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/Demasiados intentos/i);
    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'login_rate_limited' })
    );
  });

  it('blocks after email rate limit (10 attempts per 5 minutes)', async () => {
    // First call (IP check) passes, second call (email check) blocks
    mockRateLimit
      .mockResolvedValueOnce({ allowed: true, remaining: 4, resetAt: Date.now() + 60000 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, resetAt: Date.now() + 300000 });

    const result = await loginAction('user@test.com', 'password123');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toMatch(/5 minutos/i);
    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'login_rate_limited', detail: 'email limit exceeded' })
    );
  });

  it('returns success with role on valid credentials', async () => {
    allowAll();
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'uid-10' } },
      error: null,
    });
    mockSingleProfile.mockResolvedValue({
      data: { role: 'student' },
      error: null,
    });

    const result = await loginAction('student@test.com', 'password123');
    expect(result.success).toBe(true);
    if (result.success) expect(result.role).toBe('student');
  });

  it('logs login_success on valid credentials', async () => {
    allowAll();
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'uid-11' } },
      error: null,
    });
    mockSingleProfile.mockResolvedValue({
      data: { role: 'teacher' },
      error: null,
    });

    await loginAction('teacher@test.com', 'password123');

    expect(logSecurityEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'login_success', userId: 'uid-11' })
    );
  });
});
