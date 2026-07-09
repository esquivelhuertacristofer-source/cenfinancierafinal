// Rate limiter respaldado por Cloudflare KV (binding RATE_LIMIT_KV) — el estado
// se comparte entre todos los isolates/regiones del Worker. Un Map en memoria es
// por-isolate: Cloudflare levanta más isolates conforme crece el tráfico, así que
// el límite real de "10 intentos/15min" se volvía efectivamente "10 × N isolates".
//
// Fallback: en `next dev` (Node, sin contexto de Cloudflare) usa un Map en
// memoria — mismo comportamiento de antes, sin necesitar `wrangler dev`.

interface Bucket {
  count: number;
  resetAt: number;
}

interface KvLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

const devStore = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitOptions {
  key: string;
  max: number;
  windowMs: number;
}

async function getKv(): Promise<KvLike | null> {
  if (process.env.NODE_ENV === 'development') return null;
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    return (env as unknown as { RATE_LIMIT_KV?: KvLike }).RATE_LIMIT_KV ?? null;
  } catch {
    return null;
  }
}

function checkDevBucket(key: string, max: number, windowMs: number, now: number): RateLimitResult {
  const bucket = devStore.get(key);

  if (!bucket || now > bucket.resetAt) {
    devStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count, resetAt: bucket.resetAt };
}

export async function rateLimit({ key, max, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const kv = await getKv();

  if (!kv) {
    return checkDevBucket(key, max, windowMs, now);
  }

  const raw = await kv.get(key);
  const bucket: Bucket | null = raw ? JSON.parse(raw) : null;

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + windowMs;
    await kv.put(key, JSON.stringify({ count: 1, resetAt }), { expirationTtl: Math.ceil(windowMs / 1000) });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  const count = bucket.count + 1;
  const ttlSeconds = Math.max(60, Math.ceil((bucket.resetAt - now) / 1000));
  await kv.put(key, JSON.stringify({ count, resetAt: bucket.resetAt }), { expirationTtl: ttlSeconds });
  return { allowed: true, remaining: max - count, resetAt: bucket.resetAt };
}

// Legacy wrapper — used by middleware.ts
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export async function checkLoginRateLimit(identifier: string): Promise<RateLimitResult> {
  return rateLimit({ key: identifier, max: MAX_ATTEMPTS, windowMs: WINDOW_MS });
}
