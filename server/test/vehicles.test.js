import assert from "node:assert/strict";
import { before, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

let token;
const vehicleId = "TEST-VEHICLE-001";

before(async () => {
  resetUsers();
  const response = await request(app).post("/api/auth/register").send({
    username: "vehicle.tester",
    password: "ValidPass123!",
    name: "Vehicle Tester",
  }).expect(201);
  token = response.body.token;
});

function authorized(method, path) {
  return request(app)[method](path).set("Authorization", `Bearer ${token}`);
}

test("vehicle CRUD persists through the Express API", async () => {
  const created = await authorized("post", "/api/vehicles").send({
    id: vehicleId,
    plate: "TEST 001 GP",
    make: "Toyota",
    model: "Hilux",
    year: 2024,
    driverId: "DRV-TEST",
    driver: "Test Driver",
    city: "Johannesburg",
    province: "Gauteng",
    lat: -26.2041,
    lng: 28.0473,
    mileage: 1000,
    fuel: 80,
  }).expect(201);
  assert.equal(created.body.id, vehicleId);

  const read = await authorized("get", `/api/vehicles/${vehicleId}`).expect(200);
  assert.equal(read.body.plate, "TEST 001 GP");
  assert.ok(Array.isArray(read.body.maintenance));
  assert.ok(Array.isArray(read.body.alerts));

  const updated = await authorized("put", `/api/vehicles/${vehicleId}`).send({ city: "Pretoria", fuel: 72 }).expect(200);
  assert.equal(updated.body.city, "Pretoria");
  assert.equal(updated.body.fuel, 72);
});

test("telemetry ingestion updates current state and appends queryable history", async () => {
  const recordedAt = new Date().toISOString();
  const ingestion = await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({
    lat: -25.7479,
    lng: 28.2293,
    speed: 86,
    mileage: 1004.2,
    fuel: 14,
    geofenceStatus: "outside",
    recordedAt,
  }).expect(201);
  assert.equal(ingestion.body.vehicleId, vehicleId);

  const status = await authorized("get", `/api/vehicles/${vehicleId}/status`).expect(200);
  assert.equal(status.body.speed, 86);
  assert.equal(status.body.geofenceStatus, "outside");

  const history = await authorized("get", `/api/vehicles/${vehicleId}/history?limit=10`).expect(200);
  assert.equal(history.body.vehicleId, vehicleId);
  assert.equal(history.body.history.at(-1).recordedAt, recordedAt);

  const detail = await authorized("get", `/api/vehicles/${vehicleId}`).expect(200);
  assert.deepEqual(detail.body.alerts.map((alert) => alert.type).sort(), ["low_fuel", "overspeed"]);

  const regression = await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({
    lat: -25.7479,
    lng: 28.2293,
    speed: 20,
    mileage: 900,
    fuel: 50,
  }).expect(409);
  assert.equal(regression.body.error.code, "MILEAGE_REGRESSION");
});

test("vehicle mutations reject invalid operational values", async () => {
  const invalid = await authorized("put", `/api/vehicles/${vehicleId}`).send({ fuel: 120, lat: -120, year: 1800 }).expect(400);
  assert.equal(invalid.body.error.code, "VALIDATION_ERROR");
  assert.ok(invalid.body.error.details.fuel);
  assert.ok(invalid.body.error.details.lat);
  assert.ok(invalid.body.error.details.year);
});

test("telemetry validates coordinates and vehicle deletion cascades history", async () => {
  const invalid = await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({ lat: 200, lng: 28, speed: 10 }).expect(400);
  assert.equal(invalid.body.error.code, "VALIDATION_ERROR");

  await authorized("delete", `/api/vehicles/${vehicleId}`).expect(204);
  await authorized("get", `/api/vehicles/${vehicleId}`).expect(404);
  await authorized("get", `/api/vehicles/${vehicleId}/history`).expect(404);
});
