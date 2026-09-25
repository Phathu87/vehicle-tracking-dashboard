const DEVELOPMENT_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function configuredOrigins(environment = process.env) {
  const configured = String(environment.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (configured.length) return new Set(configured);
  return environment.NODE_ENV === "production" ? new Set() : DEVELOPMENT_ORIGINS;
}

export function corsOptions(environment = process.env) {
  const allowed = configuredOrigins(environment);
  return {
    origin(origin, callback) {
      if (!origin || allowed.has(origin)) return callback(null, true);
      const error = new Error("The request origin is not allowed.");
      error.status = 403;
      error.code = "ORIGIN_NOT_ALLOWED";
      return callback(error);
    },
    methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 600,
  };
}

export function securityHeaders(req, res, next) {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "same-site",
  });
  next();
}
