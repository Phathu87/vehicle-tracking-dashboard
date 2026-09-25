import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { db } from "../database.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

let userToken;
let adminToken;
let vehicle;

before(async () => {
  process.env.NODE_ENV = "production";
  process.env.DEMO_SIMULATION_TOKEN = "test-simulator-service-token";
  delete process.env.DEMO_ALLOW_USER_MUTATIONS;
  resetUsers();

  const user = await request(app).post("/api/auth/register").send({
    username: "public.demo",
    password: "ValidPass123!",
    name: "Public Demo",
  }).expect(201);
  userToken = user.body.token;

  const admin = await request(app).post("/api/auth/register").send({
    username: "release.admin",
    password: "ValidPass123!",
    name: "Release Admin",
  }).expect(201);
  db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(admin.body.user.id);
  adminToken = admin.body.token;
  vehicle = (await request(app).get("/api/vehicles").expect(200)).body[0];
});

after(() => {
  process.env.NODE_ENV = "test";
  delete process.env.DEMO_SIMULATION_TOKEN;
  delete process.env.DEMO_ALLOW_USER_MUTATIONS;
});

function authorized(token, method, path) {
  return request(app)[method](path).set("Authorization", `Bearer ${token}`);
}

test("production Demo users can read and optimize routes", async () => {
  await authorized(userToken, "get", "/api/drivers").expect(200);
  await authorized(userToken, "post", "/api/routes/optimize").send({ stops: [
    { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
    { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
  ] }).expect(200);
});

test("production Demo users cannot mutate shared fleet state", async () => {
  const denied = await authorized(userToken, "post", "/api/drivers").send({
    id: "DRV-PUBLIC",
    name: "Blocked User",
    licenceNumber: "BLOCKED-001",
    licenceExpiry: "2028-01-01",
  }).expect(403);
  assert.equal(denied.body.error.code, "DEMO_MUTATION_FORBIDDEN");

  await authorized(userToken, "delete", `/api/vehicles/${vehicle.id}`).expect(403);
  await authorized(userToken, "post", `/api/vehicles/${vehicle.id}/telemetry`).send({
    lat: vehicle.lat,
    lng: vehicle.lng,
    speed: 10,
  }).expect(403);
});

test("administrators can perform supported shared-state mutations", async () => {
  const created = await authorized(adminToken, "post", "/api/drivers").send({
    id: "DRV-ADMIN",
    name: "Admin Managed",
    licenceNumber: "ADMIN-001",
    licenceExpiry: "2028-01-01",
  }).expect(201);
  assert.equal(created.body.id, "DRV-ADMIN");
  await authorized(adminToken, "delete", "/api/drivers/DRV-ADMIN").expect(204);
});

test("the configured simulator service token can submit telemetry only", async () => {
  await request(app).post(`/api/vehicles/${vehicle.id}/telemetry`)
    .set("Authorization", "Bearer test-simulator-service-token")
    .send({ lat: vehicle.lat, lng: vehicle.lng, speed: 12, mileage: vehicle.mileage, fuel: vehicle.fuel })
    .expect(201);

  await request(app).post("/api/drivers")
    .set("Authorization", "Bearer test-simulator-service-token")
    .send({})
    .expect(401);
});
