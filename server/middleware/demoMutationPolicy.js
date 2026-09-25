import { timingSafeEqual } from "node:crypto";
import { authenticate } from "./authenticate.js";

function forbidden(res) {
  return res.status(403).json({
    error: {
      code: "DEMO_MUTATION_FORBIDDEN",
      message: "Shared Demo data is read-only for this account.",
      details: {},
    },
  });
}

function publicMutationsEnabled(environment = process.env) {
  return String(environment.DEMO_ALLOW_USER_MUTATIONS || "").toLowerCase() === "true";
}

function matchesServiceToken(candidate, environment = process.env) {
  const configured = String(environment.DEMO_SIMULATION_TOKEN || environment.SIMULATOR_TOKEN || "").trim();
  if (!configured || !candidate || configured.length !== candidate.length) return false;
  return timingSafeEqual(Buffer.from(configured), Buffer.from(candidate));
}

export function requireSharedDemoMutation(req, res, next) {
  if (process.env.NODE_ENV !== "production" || publicMutationsEnabled() || req.user?.role === "admin") {
    return next();
  }
  return forbidden(res);
}

export function authenticateTelemetryMutation(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (matchesServiceToken(token)) {
    req.serviceActor = "fleet-demo-simulator";
    return next();
  }

  return authenticate(req, res, () => requireSharedDemoMutation(req, res, next));
}
