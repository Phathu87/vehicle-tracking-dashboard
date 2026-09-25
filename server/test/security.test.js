import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { resetAuthRateLimit } from "../middleware/authRateLimit.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

afterEach(() => {
  delete process.env.AUTH_RATE_LIMIT_MAX;
  delete process.env.AUTH_RATE_LIMIT_WINDOW_MS;
  resetAuthRateLimit();
});

test("health and unknown API routes return safe JSON with security headers", async () => {
  const health = await request(app).get("/api/health").expect(200);
  assert.deepEqual(health.body, { status: "ok", service: "fleet-drive-ai-demo-api" });
  assert.equal(health.headers["x-content-type-options"], "nosniff");
  assert.equal(health.headers["x-frame-options"], "DENY");
  assert.equal(health.headers["x-powered-by"], undefined);

  const missing = await request(app).get("/api/not-a-route").expect(404);
  assert.equal(missing.body.error.code, "ROUTE_NOT_FOUND");
  assert.equal("stack" in missing.body.error, false);
});

test("CORS accepts the local frontend and rejects an unconfigured origin", async () => {
  await request(app).get("/api/health").set("Origin", "http://localhost:5173").expect(200).expect("Access-Control-Allow-Origin", "http://localhost:5173");
  const denied = await request(app).get("/api/health").set("Origin", "https://untrusted.example").expect(403);
  assert.equal(denied.body.error.code, "ORIGIN_NOT_ALLOWED");
});

test("authentication endpoints are rate limited without throttling fleet routes", async () => {
  process.env.AUTH_RATE_LIMIT_MAX = "2";
  process.env.AUTH_RATE_LIMIT_WINDOW_MS = "60000";
  const credentials = { username: "missing.user", password: "WrongPass123!" };
  await request(app).post("/api/auth/login").send(credentials).expect(401);
  await request(app).post("/api/auth/login").send(credentials).expect(401);
  const limited = await request(app).post("/api/auth/login").send(credentials).expect(429);
  assert.equal(limited.body.error.code, "AUTH_RATE_LIMITED");
  await request(app).get("/api/vehicles").expect(200);
});

test("oversized and malformed request bodies return JSON errors", async () => {
  const oversized = await request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .send({ username: "a".repeat(40_000), password: "ValidPass123!" })
    .expect(413);
  assert.equal(oversized.body.error.code, "PAYLOAD_TOO_LARGE");
});
