// In-memory rate limiter. State resets on cold start — acceptable for this traffic level.
// To persist limits across instances, replace the Map with an Upstash Redis KV store.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_PER_WINDOW = 5;

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// `purpose` namespaces the bucket (e.g. "login" vs "inquiry") so a burst of
// public inquiry submissions can never lock out Studio login attempts from
// the same IP, or vice versa — each purpose gets its own independent 5/15min
// allowance.
export function checkRateLimit(req: Request, purpose: string): { allowed: boolean } {
  const key = `${purpose}:${getClientIp(req)}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false };
  }

  entry.count++;
  return { allowed: true };
}

// Honeypot: hidden "website" field that real users never see or fill.
// Bots that auto-fill all fields get silently dropped.
export function isHoneypot(body: Record<string, unknown>): boolean {
  return Boolean(body.website);
}
