import assert from "node:assert/strict";
import { before, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

let token;
const driverId = "DRV-TEST-CRUD";
let vehicleId;
let maintenanceId;

before(async () => {
  resetUsers();
  const registration = await request(app).post("/api/auth/register").send({ username: "wp9.tester", password: "ValidPass123!", name: "WP9 Tester" }).expect(201);
  token = registration.body.token;
  const vehicles = await request(app).get("/api/vehicles").expect(200);
  vehicleId = vehicles.body[0].id;
});

function authorized(method, path) {
  return request(app)[method](path).set("Authorization", `Bearer ${token}`);
}

test("driver CRUD and verified vehicle assignment persist", async () => {
  const created = await authorized("post", "/api/drivers").send({
    id: driverId,
    name: "Lindiwe Test",
    licenceNumber: "SA-TEST-9001",
    licenceExpiry: "2027-12-31",
    phone: "+27 82 000 9001",
    email: "lindiwe.test@example.test",
  }).expect(201);
  assert.equal(created.body.licenceStatus, "valid");

  const assigned = await authorized("put", `/api/drivers/${driverId}/vehicles`).send({ vehicleIds: [vehicleId] }).expect(200);
  assert.equal(assigned.body.assignedVehicles[0].id, vehicleId);
  assert.deepEqual(assigned.body.assignedPlates, [assigned.body.assignedVehicles[0].plate]);

  const updated = await authorized("put", `/api/drivers/${driverId}`).send({ name: "Lindiwe Updated", licenceExpiry: "2026-01-01" }).expect(200);
  assert.equal(updated.body.licenceStatus, "expired");
  assert.equal(updated.body.renewalState, "overdue");

  const blockedDelete = await authorized("delete", `/api/drivers/${driverId}`).expect(409);
  assert.equal(blockedDelete.body.error.code, "DRIVER_ASSIGNED");

  await authorized("put", `/api/drivers/${driverId}/vehicles`).send({ vehicleIds: [] }).expect(200);
  await authorized("delete", `/api/drivers/${driverId}`).expect(204);
  await authorized("get", `/api/drivers/${driverId}`).expect(404);
});

test("maintenance add, update, complete, history, and delete use persisted task IDs", async () => {
  const created = await authorized("post", `/api/vehicles/${vehicleId}/maintenance`).send({
    type: "Brake inspection",
    dueMileage: 999999,
    dueDate: "2027-12-31",
  }).expect(201);
  maintenanceId = created.body.id;
  assert.equal(created.body.status, "scheduled");

  const updated = await authorized("put", `/api/vehicles/${vehicleId}/maintenance/${maintenanceId}`).send({ type: "Brake and tyre inspection" }).expect(200);
  assert.equal(updated.body.type, "Brake and tyre inspection");

  const completed = await authorized("post", `/api/vehicles/${vehicleId}/maintenance/${maintenanceId}/complete`).send({ mileage: 12345 }).expect(200);
  assert.equal(completed.body.status, "completed");
  assert.equal(typeof completed.body.completedAt, "string");

  const all = await authorized("get", "/api/maintenance?status=completed").expect(200);
  assert.ok(all.body.some((task) => task.id === maintenanceId));

  await authorized("delete", `/api/vehicles/${vehicleId}/maintenance/${maintenanceId}`).expect(204);
  const afterDelete = await authorized("get", `/api/vehicles/${vehicleId}/maintenance`).expect(200);
  assert.equal(afterDelete.body.tasks.some((task) => task.id === maintenanceId), false);
});

test("assignment rejects missing vehicles without changing the driver", async () => {
  const driver = await authorized("get", "/api/drivers/DRV-001").expect(200);
  const before = driver.body.assignedVehicleCount;
  const response = await authorized("put", "/api/drivers/DRV-001/vehicles").send({ vehicleIds: ["DOES-NOT-EXIST"] }).expect(404);
  assert.equal(response.body.error.code, "VEHICLE_NOT_FOUND");
  const after = await authorized("get", "/api/drivers/DRV-001").expect(200);
  assert.equal(after.body.assignedVehicleCount, before);
});
