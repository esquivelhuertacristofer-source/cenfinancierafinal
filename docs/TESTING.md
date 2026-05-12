# Testing Guide — luminar-enterprise-v2

## Run tests

```bash
npm test                  # single run
npm run test:watch        # watch mode (re-runs on file save)
npm run test:coverage     # with coverage report
```

All tests live in `src/__tests__/`. To run a single suite:

```bash
npx jest src/__tests__/hub.test.ts
npx jest src/__tests__/adminActions.test.ts
```

---

## Test suites (31 tests)

| File | What it covers | Tests |
|---|---|---|
| `hub.test.ts` | `getCompletedActivities`, `markActivityComplete`, `SyncEngine.processSyncQueue` | 10 |
| `adminActions.test.ts` | `onboardInstitutionalUsers`, `createGrupo`, `getGrupos` | 10 |
| `MetricCards.test.tsx` | Component renders, loading state, supabase calls | 6 |
| `TopAlumnos.test.tsx` | Component renders, empty state | 5 |

---

## Mock architecture

`jest.setup.ts` provides three global mocks applied to every test file:

**Supabase browser client** (`@/lib/supabase-browser`):
```typescript
// Access the mock from any test:
import { supabase } from "@/lib/supabase-browser";
const mockFrom = supabase.from as jest.Mock;

// Override for a single test:
mockFrom.mockReturnValueOnce({
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({ data: [...], error: null }),
});

// Override for all remaining tests in a describe block:
mockFrom.mockReturnValue({ ... });
```

The default chain returns `{ data: [], error: null }` via a `.then` mock, so components that don't override will render without crashing.

**Sentry** (`@sentry/nextjs`): all methods are `jest.fn()`, no real errors reported.

**Next.js navigation** (`next/navigation`): `useRouter`, `usePathname`, `useSearchParams` return safe stubs.

---

## Writing a new test

### Component test (TSX)

```typescript
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyComponent from "@/components/dashboard/MyComponent";
import { supabase } from "@/lib/supabase-browser";

const mockFrom = supabase.from as jest.Mock;

describe("MyComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows data after load", async () => {
    mockFrom.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [{ id: "1", nombre: "Test" }],
        error: null,
      }),
    });

    render(<MyComponent groupId="group-1" />);

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
```

### Server action test (TS)

Server actions use their own admin Supabase client (via `createClient` from `@supabase/supabase-js`).
Mock it at the top of the file **before** imports:

```typescript
const mockInsert = jest.fn();

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    auth: { admin: { createUser: jest.fn() } },
    from: jest.fn(() => ({ insert: mockInsert, select: jest.fn(), order: jest.fn() })),
  })),
}));

// Set env vars before import (they are read at call time, not module load)
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";

import { myServerAction } from "@/app/actions/myActions";
```

### Hub logic test (TS)

```typescript
import { supabase } from "@/lib/supabase-browser";
import { markActivityComplete } from "@/lib/hub";

const mockFrom = supabase.from as jest.Mock;

describe("markActivityComplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem("cen_sync_queue");
  });

  it("returns true on success", async () => {
    mockFrom.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await markActivityComplete("valid-uuid-here", "ACT-P1-1-1-B");
    expect(result).toBe(true);
  });
});
```

---

## Known patterns and gotchas

**`mockReturnValue` vs `mockReturnValueOnce`**: use `Once` when only one call should get the override; use the plain form to affect all subsequent calls. `jest.clearAllMocks()` clears call history but NOT implementation — call `jest.resetAllMocks()` if you need a clean slate.

**UUID validation**: `markActivityComplete` and `addToSyncQueue` reject non-UUID userIds. Use a proper UUID (e.g. `550e8400-e29b-41d4-a716-446655440000`) in tests that verify queue behavior.

**Offline queue tests**: always call `localStorage.removeItem("cen_sync_queue")` in `beforeEach` to avoid cross-test contamination.

**`process.env` in server actions**: env vars read inside function bodies pick up test overrides correctly. Avoid reading env vars at module level in server actions.

**`withTimeout` in hub.ts**: mock promises resolve in microtasks (before the 3 s real timeout), so they always win the `Promise.race`. No fake timers needed.

**`@testing-library/dom`**: required peer dep for `@testing-library/react`. Already installed. If missing, run `npm install -D @testing-library/dom`.

---

## CI/CD

Tests run automatically on every push/PR to `main` via `.github/workflows/ci.yml`. The build job only runs if tests pass first. Required secrets: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
