// Minimal in-memory sliding-window limiter (per server instance).
const hits = new Map();

export function rateLimit(key, { limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return recent.length <= limit;
}

export const clientIp = (req) =>
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
