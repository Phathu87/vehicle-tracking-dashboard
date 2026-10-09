import assert from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { db } from "../database.js";
import {
  assignVehicle,
  getAssignedDrivers,
  getAssignedVehicles,
  isDriverAssignedToVehicle,
  unassignVehicle,
} from "../services/assignmentService.js";
import { createDriver, deleteDriver } from "../services/driverService.js";
import { createVehicle, deleteVehicle } from "../services/vehicleService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

function createFixtureDriver(id, licence) {
  return createDriver({
    id,
    name: `Fixture ${id}`,
    licenceNumber: licence,
    licenceExpiry: "2029-12-31",
  });
}

function createFixtureVehicle(id, plate) {
  return createVehicle({
    id,
    plate,
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2024,
    city: "Mahikeng",
    province: "North West",
    lat: -25.857,
    lng: 25.6393,
    mileage: 100,
    fuel: 70,
  });
}

test("Phase 2.3 schema and deterministic assignment pool preserve legacy semantics", () => {
  assert.ok(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'driver_vehicle_assignments'").get());
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM vehicles").get().count, 350);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM drivers").get().count, 25);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM driver_vehicle_assignments WHERE is_active_assignment = 1").get().count, 349);
  assert.equal(db.prepare("SELECT COUNT(DISTINCT driver_id) AS count FROM driver_vehicle_assignments WHERE is_active_assignment = 1").get().count, 25);
  assert.equal(db.prepare("SELECT COUNT(DISTINCT vehicle_id) AS count FROM driver_vehicle_assignments WHERE is_active_assignment = 1").get().count, 349);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM vehicles WHERE driver_id IS NULL").get().count, 1);
  assert.equal(db.prepare("SELECT driver_id FROM vehicles WHERE id = 'VH-BL-100'").get().driver_id, null);
  assert.equal(getAssignedVehicles("DRV-001").length, 13);
  assert.equal(getAssignedVehicles("DRV-002").length, 14);
  assert.deepEqual(getAssignedVehicles("DRV-001").map((vehicle) => vehicle.id), [
    "VH-CA-100", "VH-DU-100", "VH-GQ-100", "VH-JO-100", "VH-KI-100",
    "VH-LO-100", "VH-MA-100", "VH-MF-100", "VH-PH-100", "VH-PO-100",
    "VH-PR-100", "VH-RU-100", "VH-TH-100",
  ]);
  assert.equal(getAssignedDrivers("VH-BL-100").length, 0);
  assert.equal(db.prepare(`
    SELECT COUNT(*) AS count FROM vehicles v
    WHERE v.driver_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM driver_vehicle_assignments a
      WHERE a.vehicle_id = v.id AND a.driver_id = v.driver_id AND a.is_active_assignment = 1
    )
  `).get().count, 0);
});

test("assignment service enforces identifiers, foreign keys, uniqueness, and many-to-many reads", () => {
  const firstDriver = "DRV-ASSIGN-A";
  const secondDriver = "DRV-ASSIGN-B";
  const firstVehicle = "VH-ASSIGN-A";
  const secondVehicle = "VH-ASSIGN-B";
  createFixtureDriver(firstDriver, "SA-ASSIGN-A");
  createFixtureDriver(secondDriver, "SA-ASSIGN-B");
  createFixtureVehicle(firstVehicle, "ASSIGN 001 GP");
  createFixtureVehicle(secondVehicle, "ASSIGN 002 GP");

  try {
    assert.throws(() => assignVehicle("bad", firstVehicle), { code: "INVALID_DRIVER_ID" });
    assert.throws(() => assignVehicle(firstDriver, "bad"), { code: "INVALID_VEHICLE_ID" });
    assert.throws(() => assignVehicle("DRV-NOT-FOUND", firstVehicle), { code: "DRIVER_NOT_FOUND" });
    assert.throws(() => assignVehicle(firstDriver, "VH-NOT-FOUND"), { code: "VEHICLE_NOT_FOUND" });

    assignVehicle(firstDriver, firstVehicle);
    assignVehicle(firstDriver, secondVehicle);
    assignVehicle(secondDriver, firstVehicle);
    assert.throws(() => assignVehicle(firstDriver, firstVehicle), { code: "ASSIGNMENT_EXISTS" });
    assert.equal(getAssignedVehicles(firstDriver).length, 2);
    assert.deepEqual(getAssignedDrivers(firstVehicle).map((driver) => driver.id), [firstDriver, secondDriver]);
    assert.equal(isDriverAssignedToVehicle(firstDriver, secondVehicle), true);
    assert.equal(isDriverAssignedToVehicle(secondDriver, secondVehicle), false);

    assert.throws(
      () => db.prepare("INSERT INTO driver_vehicle_assignments (driver_id, vehicle_id, assigned_at, unassigned_at, is_active_assignment) VALUES ('DRV-MISSING', ?, ?, NULL, 1)").run(firstVehicle, new Date().toISOString()),
      /FOREIGN KEY/,
    );
    assert.throws(
      () => db.prepare("INSERT INTO driver_vehicle_assignments (driver_id, vehicle_id, assigned_at, unassigned_at, is_active_assignment) VALUES (?, 'VH-MISSING', ?, NULL, 1)").run(firstDriver, new Date().toISOString()),
      /FOREIGN KEY/,
    );

    unassignVehicle(firstDriver, firstVehicle);
    assert.equal(isDriverAssignedToVehicle(firstDriver, firstVehicle), false);
    assert.throws(() => unassignVehicle(firstDriver, firstVehicle), { code: "ASSIGNMENT_NOT_FOUND" });
  } finally {
    for (const vehicleId of [firstVehicle, secondVehicle]) deleteVehicle(vehicleId);
    deleteDriver(firstDriver);
    deleteDriver(secondDriver);
  }
});

test("driver API keeps Phase 2.3 assignedVehicles compatibility", async () => {
  const registration = await request(app).post("/api/auth/register").send({
    username: `assignment.reader.${Date.now()}`,
    password: "ValidPass123!",
    name: "Assignment Reader",
  }).expect(201);
  const response = await request(app)
    .get("/api/drivers/DRV-001")
    .set("Authorization", `Bearer ${registration.body.token}`)
    .expect(200);
  assert.equal(response.body.assignedVehicleCount, 13);
  assert.equal(response.body.assignedVehicles.length, 13);
  assert.equal(Object.hasOwn(response.body, "currentVehicle"), true);

  const malformedVehicle = await request(app)
    .put("/api/drivers/DRV-001/vehicles")
    .set("Authorization", `Bearer ${registration.body.token}`)
    .send({ vehicleIds: ["bad"] })
    .expect(400);
  assert.equal(malformedVehicle.body.error.code, "INVALID_VEHICLE_ID");

  const malformedDriver = await request(app)
    .put("/api/drivers/bad/vehicles")
    .set("Authorization", `Bearer ${registration.body.token}`)
    .send({ vehicleIds: [] })
    .expect(400);
  assert.equal(malformedDriver.body.error.code, "INVALID_DRIVER_ID");

  await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${registration.body.token}`)
    .send({ id: "bad", plate: "BAD ID GP", make: "Toyota", model: "Hilux", driverId: "DRV-001" })
    .expect(400);
  assert.equal(db.prepare("SELECT 1 FROM vehicles WHERE id = 'bad'").get(), undefined);
});
