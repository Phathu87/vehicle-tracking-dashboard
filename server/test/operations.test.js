import assert from "node:assert/strict";
import { before, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

let token;
let vehicle;
let geofenceId;

before(async () => {
  resetUsers();
  const registration = await request(app).post("/api/auth/register").send({ username: "operations.tester", password: "ValidPass123!", name: "Operations Tester" }).expect(201);
  token = registration.body.token;
  vehicle = (await request(app).get("/api/vehicles").expect(200)).body[0];
});

function authorized(method, path) { return request(app)[method](path).set("Authorization", `Bearer ${token}`); }

test("alert endpoint exposes only persisted supported alert types", async () => {
  const types = await authorized("get", "/api/alerts/types").expect(200);
  assert.deepEqual(types.body.types, ["overspeed", "low_fuel", "geofence_entry", "geofence_exit"]);
  await authorized("post", `/api/vehicles/${vehicle.id}/telemetry`).send({ lat: vehicle.lat, lng: vehicle.lng, speed: 88, mileage: vehicle.mileage + 1, fuel: 14 }).expect(201);
  const alerts = await authorized("get", `/api/alerts?vehicleId=${vehicle.id}`).expect(200);
  assert.ok(alerts.body.some((alert) => alert.type === "overspeed" && alert.state === "open"));
  assert.ok(alerts.body.some((alert) => alert.type === "low_fuel"));
});

test("geofence CRUD, vehicle checks, and telemetry transitions persist", async () => {
  const created = await authorized("post", "/api/geofences").send({ name: "Operations Test Zone", shapeType: "circle", center: { lat: vehicle.lat, lng: vehicle.lng }, radiusMeters: 500 }).expect(201);
  geofenceId = created.body.id;
  const initial = await authorized("get", `/api/geofences/${geofenceId}/check?vehicleId=${vehicle.id}`).expect(200);
  assert.equal(initial.body.states[0].state, "inside");

  await authorized("post", `/api/vehicles/${vehicle.id}/telemetry`).send({ lat: vehicle.lat + 0.02, lng: vehicle.lng + 0.02, speed: 40, mileage: vehicle.mileage + 2, fuel: 60 }).expect(201);
  const exitAlerts = await authorized("get", `/api/alerts?vehicleId=${vehicle.id}&type=geofence_exit`).expect(200);
  assert.ok(exitAlerts.body.some((alert) => alert.message.includes("Operations Test Zone")));

  const updated = await authorized("put", `/api/geofences/${geofenceId}`).send({ name: "Operations Test Polygon", shapeType: "polygon", polygon: [
    { lat: vehicle.lat - 0.01, lng: vehicle.lng - 0.01 },
    { lat: vehicle.lat + 0.01, lng: vehicle.lng - 0.01 },
    { lat: vehicle.lat, lng: vehicle.lng + 0.01 },
  ] }).expect(200);
  assert.equal(updated.body.shapeType, "polygon");

  const listed = await authorized("get", "/api/geofences").expect(200);
  assert.ok(listed.body.some((item) => item.id === geofenceId));
  await authorized("delete", `/api/geofences/${geofenceId}`).expect(204);
});

test("route optimisation is deterministic and reports its Demo algorithm limits", async () => {
  const stops = [
    { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
    { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
    { name: "Bloemfontein", lat: -29.1129, lng: 26.2149 },
  ];
  const first = await authorized("post", "/api/routes/optimize").send({ stops }).expect(200);
  const second = await authorized("post", "/api/routes/optimize").send({ stops }).expect(200);
  assert.deepEqual(first.body, second.body);
  assert.equal(first.body.algorithm, "nearest_neighbour_demo");
  assert.match(first.body.limitations, /Straight-line/);
});

test("maintenance and trip reports derive from persisted backend records", async () => {
  const maintenance = await authorized("get", `/api/maintenance/${vehicle.id}/report`).expect(200);
  assert.equal(maintenance.body.vehicleId, vehicle.id);
  assert.equal(maintenance.body.summary.total, maintenance.body.tasks.length);

  const trips = await authorized("get", `/api/reports/${vehicle.id}/trips`).expect(200);
  assert.equal(trips.body.vehicleId, vehicle.id);
  assert.ok(Array.isArray(trips.body.history));
  assert.ok(Array.isArray(trips.body.trips));
  assert.match(trips.body.limitations, /stored telemetry/);
});
