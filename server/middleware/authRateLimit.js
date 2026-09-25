const attempts = new Map();

function boundedInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

export function authRateLimit(req, res, next) {
  const windowMs = boundedInteger(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60_000, 1_000, 86_400_000);
  const maximum = boundedInteger(process.env.AUTH_RATE_LIMIT_MAX, 20, 1, 10_000);
  const now = Date.now();
  const key = `${req.ip}:${req.path}`;
  const current = attempts.get(key);
  const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
  entry.count += 1;
  attempts.set(key, entry);

  res.set("X-RateLimit-Limit", String(maximum));
  res.set("X-RateLimit-Remaining", String(Math.max(0, maximum - entry.count)));
  if (entry.count > maximum) {
    res.set("Retry-After", String(Math.max(1, Math.ceil((entry.resetAt - now) / 1000))));
    return res.status(429).json({
      error: {
        code: "AUTH_RATE_LIMITED",
        message: "Too many authentication attempts. Try again later.",
        details: {},
      },
    });
  }
  return next();
}

export function resetAuthRateLimit() {
  attempts.clear();
}
