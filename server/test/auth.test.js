import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

const account = {
  username: "demo.operator",
  password: "ValidPass123!",
  name: "Demo Operator",
};

beforeEach(() => {
  resetUsers();
});

function registerAccount(overrides = {}) {
  return request(app)
    .post("/api/auth/register")
    .send({ ...account, ...overrides });
}

test("POST /api/auth/register creates a user and returns a signed session", async () => {
  const response = await registerAccount().expect(201);

  assert.equal(typeof response.body.token, "string");
  assert.deepEqual(response.body.user, {
    id: response.body.user.id,
    username: account.username,
    name: account.name,
    role: "user",
  });
  assert.equal("password" in response.body.user, false);
  assert.equal("passwordHash" in response.body.user, false);
});

test("registration rejects duplicate usernames case-insensitively", async () => {
  await registerAccount().expect(201);
  const response = await registerAccount({ username: "DEMO.OPERATOR" }).expect(409);

  assert.equal(response.body.error.code, "USERNAME_EXISTS");
});

test("simultaneous registration cannot create duplicate usernames", async () => {
  const responses = await Promise.all([
    registerAccount(),
    registerAccount({ username: "DEMO.OPERATOR" }),
  ]);

  assert.deepEqual(
    responses.map((response) => response.status).sort(),
    [201, 409],
  );
});

test("registration cannot self-assign the admin role", async () => {
  const response = await registerAccount({ role: "admin" }).expect(400);

  assert.equal(response.body.error.code, "VALIDATION_ERROR");
  assert.ok(response.body.error.details.role);
});

test("POST /api/auth/login accepts valid credentials", async () => {
  await registerAccount().expect(201);
  const response = await request(app)
    .post("/api/auth/login")
    .send({ username: account.username, password: account.password })
    .expect(200);

  assert.equal(response.body.user.username, account.username);
  assert.equal(response.body.user.role, "user");
  assert.equal(typeof response.body.token, "string");
});

test("POST /api/auth/login rejects invalid credentials without identifying the bad field", async () => {
  await registerAccount().expect(201);
  const response = await request(app)
    .post("/api/auth/login")
    .send({ username: account.username, password: "WrongPass123!" })
    .expect(401);

  assert.equal(response.body.error.code, "INVALID_CREDENTIALS");
});

test("POST /api/auth/login validates remember-me as a boolean", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      username: account.username,
      password: account.password,
      rememberMe: "yes",
    })
    .expect(400);

  assert.ok(response.body.error.details.rememberMe);
});

test("GET /api/auth/me protects the route and restores the current user", async () => {
  await request(app).get("/api/auth/me").expect(401);

  const registration = await registerAccount().expect(201);
  const response = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${registration.body.token}`)
    .expect(200);

  assert.deepEqual(response.body, registration.body.user);
});

test("remember-me issues a longer-lived token", async () => {
  await registerAccount().expect(201);
  const standard = await request(app)
    .post("/api/auth/login")
    .send({ username: account.username, password: account.password })
    .expect(200);
  const remembered = await request(app)
    .post("/api/auth/login")
    .send({ username: account.username, password: account.password, rememberMe: true })
    .expect(200);

  const standardClaims = jwt.decode(standard.body.token);
  const rememberedClaims = jwt.decode(remembered.body.token);
  assert.ok(rememberedClaims.exp - rememberedClaims.iat > standardClaims.exp - standardClaims.iat);
});

test("malformed JSON returns a validation error", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .send('{"username":')
    .expect(400);

  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});
