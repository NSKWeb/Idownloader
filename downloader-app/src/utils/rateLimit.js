const store = new Map();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 30;

let lastCleanupAt = 0;

const cleanupExpiredEntries = (now) => {
  if (now - lastCleanupAt < DEFAULT_WINDOW_MS) return;
  lastCleanupAt = now;

  for (const [ip, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(ip);
    }
  }
};

export const getClientIp = (request) => {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim();

  const candidates = ['x-real-ip', 'cf-connecting-ip', 'true-client-ip'];
  for (const header of candidates) {
    const value = request.headers.get(header);
    if (value) return value.trim();
  }

  return 'unknown';
};

export const rateLimitByIp = (request, options = {}) => {
  const windowMs = Number.isFinite(options.windowMs) ? options.windowMs : DEFAULT_WINDOW_MS;
  const limit = Number.isFinite(options.limit) ? options.limit : DEFAULT_LIMIT;

  const ip = getClientIp(request);
  const now = Date.now();

  cleanupExpiredEntries(now);

  let entry = store.get(ip);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(ip, entry);
  }

  entry.count += 1;

  const remaining = Math.max(0, limit - entry.count);
  const retryAfterSeconds = Math.max(0, Math.ceil((entry.resetAt - now) / 1000));

  return {
    success: entry.count <= limit,
    ip,
    limit,
    remaining,
    resetAt: entry.resetAt,
    retryAfterSeconds,
  };
};
