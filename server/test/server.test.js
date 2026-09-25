import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import app from "../app.js";
import { vehicles } from "../data.js";
import { DEFAULT_PORT, resolvePort } from "../server.js";

test("generated vehicles have stable API invariants", () => {
  assert.equal(vehicles.length, 350);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.id)).size, vehicles.length);

  for (const vehicle of vehicles) {
    assert.equal(typeof vehicle.id, "string");
    assert.equal(typeof vehicle.lat, "number");
    assert.equal(typeof vehicle.lng, "number");
    assert.equal(typeof vehicle.speed, "number");
    assert.ok(Array.isArray(vehicle.history));
  }
});

test("GET /api/vehicles preserves the existing response contract", async () => {
  const response = await request(app).get("/api/vehicles").expect(200);

  assert.match(response.headers["content-type"], /^application\/json/);
  assert.equal(response.body.length, vehicles.length);
  assert.equal(new Set(response.body.map((vehicle) => vehicle.id)).size, response.body.length);
  assert.equal(typeof response.body[0].id, "string");
  assert.equal(typeof response.body[0].lat, "number");
  assert.equal(typeof response.body[0].mileage, "number");
  assert.equal(typeof response.body[0].fuel, "number");
  assert.equal(typeof response.body[0].lastSeen, "string");
});

test("resolvePort uses a safe default and validates configured values", () => {
  assert.equal(resolvePort(undefined), DEFAULT_PORT);
  assert.equal(resolvePort(""), DEFAULT_PORT);
  assert.equal(resolvePort("5000"), 5000);
  assert.equal(resolvePort("0"), 0);
  assert.throws(() => resolvePort("invalid"), /PORT must be an integer/);
  assert.throws(() => resolvePort("65536"), /PORT must be an integer/);
});
