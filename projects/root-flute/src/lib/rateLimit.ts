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

export function checkRateLimit(req: Request): { allowed: boolean } {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
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
