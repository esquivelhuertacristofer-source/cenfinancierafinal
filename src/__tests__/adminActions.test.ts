/**
 * Tests for app/actions/adminActions.ts
 * Covers: onboardInstitutionalUsers, createGrupo, getGrupos
 * Includes: access-control tests (UNAUTHORIZED / FORBIDDEN) and business-logic tests
 */

// requireAdminSession mock — jest.fn() inside factory avoids TDZ hoisting issues
jest.mock('@/lib/supabase-server', () => ({
  requireAdminSession: jest.fn(),
}));

// Supabase admin client mock
const mockCreateUser = jest.fn();
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockOrder = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      admin: {
        createUser: mockCreateUser,
      },
    },
    from: jest.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
      order: mockOrder,
    })),
  })),
}));

// Set required env vars before importing the module
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.INSTITUTIONAL_EMAIL_DOMAIN = 'test.cenfinanciera.com';

import { requireAdminSession } from '@/lib/supabase-server';
import { onboardInstitutionalUsers, createGrupo, getGrupos } from '@/app/actions/adminActions';

const mockRequireAdminSession = jest.mocked(requireAdminSession);

const ADMIN_SESSION = {
  user: {
    id: 'admin-uid',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00.000Z',
  },
  profile: { id: 'admin-uid', role: 'admin', escuela_id: 'esc-1' },
  isAdmin: true as const,
  isSuperAdmin: false as const,
};

// ── Access control ──────────────────────────────────────────────────────────

describe('access control — todas las Server Actions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('onboardInstitutionalUsers: rechaza caller sin sesión (UNAUTHORIZED)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('UNAUTHORIZED: no hay sesión válida'));
    await expect(
      onboardInstitutionalUsers(['Ana López'], null, 'student', 'P1', 'password123')
    ).rejects.toThrow('UNAUTHORIZED');
  });

  it('onboardInstitutionalUsers: rechaza caller con rol alumno (FORBIDDEN)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('FORBIDDEN: rol insuficiente'));
    await expect(
      onboardInstitutionalUsers(['Ana López'], null, 'student', 'P1', 'password123')
    ).rejects.toThrow('FORBIDDEN');
  });

  it('onboardInstitutionalUsers: rechaza caller con rol docente (FORBIDDEN)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('FORBIDDEN: rol insuficiente'));
    await expect(
      onboardInstitutionalUsers(['Ana López'], null, 'teacher', 'P1', 'password123')
    ).rejects.toThrow('FORBIDDEN');
  });

  it('createGrupo: rechaza caller sin sesión (UNAUTHORIZED)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('UNAUTHORIZED: no hay sesión válida'));
    await expect(createGrupo('Grupo A', 'P1', null)).rejects.toThrow('UNAUTHORIZED');
  });

  it('createGrupo: rechaza caller con rol insuficiente (FORBIDDEN)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('FORBIDDEN: rol insuficiente'));
    await expect(createGrupo('Grupo A', 'P1', null)).rejects.toThrow('FORBIDDEN');
  });

  it('getGrupos: rechaza caller sin sesión (UNAUTHORIZED)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('UNAUTHORIZED: no hay sesión válida'));
    await expect(getGrupos()).rejects.toThrow('UNAUTHORIZED');
  });

  it('getGrupos: rechaza caller con rol insuficiente (FORBIDDEN)', async () => {
    mockRequireAdminSession.mockRejectedValue(new Error('FORBIDDEN: rol insuficiente'));
    await expect(getGrupos()).rejects.toThrow('FORBIDDEN');
  });
});

// ── Business logic (caller es admin) ────────────────────────────────────────

describe('onboardInstitutionalUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminSession.mockResolvedValue(ADMIN_SESSION);
  });

  it('throws when password is too short', async () => {
    await expect(
      onboardInstitutionalUsers(['Ana López'], null, 'student', 'P1', 'short')
    ).rejects.toThrow('al menos 8 caracteres');
  });

  it('creates 10 users with unique emails', async () => {
    mockCreateUser.mockResolvedValue({ error: null });

    const names = Array.from({ length: 10 }, (_, i) => `Alumno Test ${i + 1}`);
    const result = await onboardInstitutionalUsers(names, 'grupo-1', 'student', 'P1', 'password123');

    expect(result.success.length).toBe(10);
    expect(result.errors.length).toBe(0);

    const emails = result.success.map((r) => r.email);
    const unique = new Set(emails);
    expect(unique.size).toBe(10);

    emails.forEach((email) => {
      expect(email).toContain('@test.cenfinanciera.com');
    });
  });

  it('handles duplicate names with numeric suffix', async () => {
    mockCreateUser.mockResolvedValue({ error: null });

    const result = await onboardInstitutionalUsers(
      ['Ana López', 'Ana López'],
      null,
      'student',
      'P2',
      'password123'
    );

    expect(result.success.length).toBe(2);
    const emails = result.success.map((r) => r.email);
    expect(emails[0]).not.toBe(emails[1]);
    expect(emails[1]).toMatch(/ana\.lopez1@/);
  });

  it('records error when createUser fails', async () => {
    mockCreateUser.mockResolvedValue({
      error: { message: 'User already registered' },
    });

    const result = await onboardInstitutionalUsers(
      ['Juan Pérez'],
      null,
      'student',
      'P3',
      'password123'
    );

    expect(result.success.length).toBe(0);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('User already registered');
  });

  it('skips empty names', async () => {
    mockCreateUser.mockResolvedValue({ error: null });

    const result = await onboardInstitutionalUsers(
      ['', '   ', 'María García'],
      null,
      'student',
      'P1',
      'password123'
    );

    expect(result.success.length).toBe(1);
    expect(result.success[0].name).toBe('María García');
  });

  it('uses correct school_level for each grado', async () => {
    mockCreateUser.mockResolvedValue({ error: null });

    await onboardInstitutionalUsers(['Test User'], null, 'student', 'S1', 'password123');

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        user_metadata: expect.objectContaining({
          school_level: 'Secundaria 1',
        }),
      })
    );
  });
});

describe('createGrupo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminSession.mockResolvedValue(ADMIN_SESSION);
  });

  it('returns created group on success', async () => {
    mockInsert.mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: { id: 'uuid-123', nombre: 'Grupo 1A' },
          error: null,
        }),
      }),
    });

    const result = await createGrupo('Grupo 1A', 'P1', null);
    expect(result).toEqual({ id: 'uuid-123', nombre: 'Grupo 1A' });
  });

  it('throws on database error', async () => {
    mockInsert.mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'duplicate key' },
        }),
      }),
    });

    await expect(createGrupo('Grupo 1A', 'P1', null)).rejects.toThrow('duplicate key');
  });
});

describe('getGrupos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminSession.mockResolvedValue(ADMIN_SESSION);
  });

  it('returns sorted list of groups', async () => {
    mockSelect.mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: [
          { id: '1', nombre: 'Grupo A', grado: 'P1' },
          { id: '2', nombre: 'Grupo B', grado: 'P2' },
        ],
        error: null,
      }),
    });

    const result = await getGrupos();
    expect(result.length).toBe(2);
    expect(result[0].nombre).toBe('Grupo A');
  });

  it('returns empty array on error', async () => {
    mockSelect.mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'connection failed' },
      }),
    });

    const result = await getGrupos();
    expect(result).toEqual([]);
  });
});
