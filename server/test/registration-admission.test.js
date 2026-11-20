import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { after, beforeEach, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { resetUsers } from "../services/userService.js";
import { resetAuthRateLimit } from "../middleware/authRateLimit.js";
import { registrationAllowed } from "../services/registrationAdmission.js";

const original = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  REGISTRATION_TEST_INVITES_JSON: process.env.REGISTRATION_TEST_INVITES_JSON,
};
const account = { username: "disposable.operator", name: "Disposable Operator", password: "TestOnlyPassword123!" };
let token;
let invite;

beforeEach(() => {
  process.env.NODE_ENV = "production";
  process.env.JWT_SECRET = randomBytes(64).toString("hex");
  delete process.env.REGISTRATION_TEST_INVITES_JSON;
  token = randomBytes(32).toString("hex");
  invite = {
    username: account.username,
    tokenSha256: createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };
  resetUsers();
  resetAuthRateLimit();
});

after(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function allow(entries = [invite]) {
  process.env.REGISTRATION_TEST_INVITES_JSON = JSON.stringify(entries);
}

function register(body = account, credential = token, path = "/api/auth/register") {
  const attempt = request(app).post(path);
  if (credential !== null) attempt.set("X-Registration-Invite", credential);
  return attempt.send(body);
}

test("production registration defaults to deny and never discloses admission details", async () => {
  const response = await register().expect(403);
  assert.deepEqual(response.body, { error: {
    code: "REGISTRATION_UNAVAILABLE", message: "Registration is not available for this request.", details: {},
  } });
});

test("development and isolated test registration remain available", async () => {
  for (const mode of ["development", "test"]) {
    resetUsers();
    process.env.NODE_ENV = mode;
    await register(account, null).expect(201);
  }
});

test("production invitation requires both the bound username and the random token", async () => {
  allow();
  await register(account, null).expect(403);
  await register(account, randomBytes(32).toString("hex")).expect(403);
  await register({ ...account, username: "another.operator" }).expect(403);
  await register(account, "not-a-valid-token").expect(403);
});

test("approved registration issues an ordinary user session, never the admission credential", async () => {
  allow();
  const response = await register({ ...account, username: "DISPOSABLE.OPERATOR" }).expect(201);
  assert.equal(response.body.user.role, "user");
  assert.equal(typeof response.body.token, "string");
  const serialized = JSON.stringify(response.body);
  for (const secret of [token, invite.tokenSha256, account.password, process.env.JWT_SECRET]) {
    assert.equal(serialized.includes(secret), false);
  }
  await request(app).get("/api/auth/me").set("Authorization", `Bearer ${response.body.token}`).expect(200);
});

test("approved duplicate registrations are rejected case-insensitively", async () => {
  allow();
  await register().expect(201);
  await register({ ...account, username: "DISPOSABLE.OPERATOR" }).expect(409);
});

test("approved invalid payloads and privilege escalation remain rejected", async () => {
  allow();
  await register({ ...account, password: "short" }).expect(400);
  await register({ ...account, name: "" }).expect(400);
  await register({ ...account, role: "admin" }).expect(400);
  await register().expect(201);
});

test("expired, malformed and ambiguous invitation configurations fail closed", async () => {
  const configurations = [
    "not-json", "{}", "[]", "null",
    JSON.stringify([{ ...invite, expiresAt: new Date(Date.now() - 1000).toISOString() }]),
    JSON.stringify([{ ...invite, expiresAt: new Date(Date.now() + 48 * 3600000).toISOString() }]),
    JSON.stringify([{ ...invite, tokenSha256: "bad" }]),
    JSON.stringify([invite, invite]),
    JSON.stringify([invite, { ...invite, username: "another.operator" }]),
    JSON.stringify([invite, null]),
    "x".repeat(16385),
  ];
  for (const configuration of configurations) {
    process.env.REGISTRATION_TEST_INVITES_JSON = configuration;
    const response = await register().expect(403);
    assert.equal(JSON.stringify(response.body).includes(token), false);
  }
});

test("login and JWT verification remain available after admission is revoked", async () => {
  allow();
  await register().expect(201);
  delete process.env.REGISTRATION_TEST_INVITES_JSON;
  const login = await request(app).post("/api/auth/login").send({ username: account.username, password: account.password }).expect(200);
  await request(app).get("/api/auth/me").set("Authorization", `Bearer ${login.body.token}`).expect(200);
  await request(app).get("/api/auth/me").set("Authorization", "Bearer invalid").expect(401);
  await request(app).post("/api/auth/login").send({ username: account.username, password: "WrongPassword123!" }).expect(401);
  await register().expect(403);
});

test("alternate route casing and slash forms cannot bypass admission", async () => {
  for (const path of ["/api/auth/register", "/api/auth/register/", "/API/AUTH/REGISTER", "/api/auth/register?invite=ignored"]) {
    await register(account, null, path).expect(403);
  }
  for (const path of ["/auth/register", "/api/register", "/api/auth/register/other"]) {
    await register(account, null, path).expect(404);
  }
  allow();
  await register({ ...account, invitation: token }, null).expect(403);
});

test("expiry boundary is denied with deterministic time and no database invitation state", () => {
  const now = Date.now();
  const req = { body: account, get: () => token };
  const environment = { NODE_ENV: "production", REGISTRATION_TEST_INVITES_JSON: JSON.stringify([
    { ...invite, expiresAt: new Date(now).toISOString() },
  ]) };
  assert.equal(registrationAllowed(req, environment, now), false);
});
