import assert from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { db } from "../database.js";
import {
  assignVehicle,
  clearCurrentVehicle,
  getAssignedVehicles,
  getCurrentDriver,
  getCurrentVehicle,
  setCurrentVehicle,
  unassignVehicle,
} from "../services/assignmentService.js";
import { createDriver, deleteDriver } from "../services/driverService.js";
import { createVehicle, deleteVehicle } from "../services/vehicleService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

function createFixtureDriver(id, licence) {
  return createDriver({
    id,
    name: `Current ${id}`,
    licenceNumber: licence,
    licenceExpiry: "2029-12-31",
  });
}

function createFixtureVehicle(id, plate, lat = -26.2041, lng = 28.0473) {
  return createVehicle({
    id,
    plate,
    make: "Toyota",
    model: "Hilux",
    year: 2024,
    city: "Johannesburg",
    province: "Gauteng",
    lat,
    lng,
    mileage: 100,
    fuel: 70,
  });
}

test("Phase 2.4 schema seeds deterministic explicit current operations", () => {
  assert.ok(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'driver_current_vehicles'").get());
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM driver_current_vehicles").get().count, 21);
  assert.equal(db.prepare("SELECT COUNT(DISTINCT driver_id) AS count FROM driver_current_vehicles").get().count, 21);
  assert.equal(db.prepare("SELECT COUNT(DISTINCT vehicle_id) AS count FROM driver_current_vehicles").get().count, 21);
  assert.equal(db.prepare(`
    SELECT COUNT(*) AS count FROM driver_current_vehicles c
    WHERE NOT EXISTS (
      SELECT 1 FROM driver_vehicle_assignments a
      WHERE a.driver_id = c.driver_id AND a.vehicle_id = c.vehicle_id
        AND a.is_active_assignment = 1
    )
  `).get().count, 0);
  assert.equal(getCurrentVehicle("DRV-001").id, "VH-JO-100");
  assert.equal(getCurrentVehicle("DRV-015").id, "VH-JO-114");
  assert.equal(getCurrentVehicle("DRV-005"), null);
  assert.equal(getCurrentDriver("VH-BL-100"), null);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM driver_vehicle_assignments WHERE is_active_assignment = 1").get().count, 349);
});

test("current-operation service enforces assignment, exclusivity, atomic switching, and clearing", () => {
  const firstDriver = "DRV-CURRENT-A";
  const secondDriver = "DRV-CURRENT-B";
  const firstVehicle = "VH-CURRENT-A";
  const secondVehicle = "VH-CURRENT-B";
  const thirdVehicle = "VH-CURRENT-C";
  createFixtureDriver(firstDriver, "SA-CURRENT-A");
  createFixtureDriver(secondDriver, "SA-CURRENT-B");
  createFixtureVehicle(firstVehicle, "CURRENT 001 GP");
  createFixtureVehicle(secondVehicle, "CURRENT 002 GP");
  createFixtureVehicle(thirdVehicle, "CURRENT 003 GP");

  try {
    assignVehicle(firstDriver, firstVehicle);
    assignVehicle(firstDriver, secondVehicle);
    assignVehicle(secondDriver, firstVehicle);
    assignVehicle(secondDriver, thirdVehicle);

    assert.throws(() => setCurrentVehicle("DRV-MISSING", firstVehicle), { code: "DRIVER_NOT_FOUND" });
    assert.throws(() => setCurrentVehicle(firstDriver, "VH-MISSING"), { code: "VEHICLE_NOT_FOUND" });
    assert.throws(() => setCurrentVehicle(firstDriver, thirdVehicle), { code: "CURRENT_VEHICLE_NOT_ASSIGNED" });
    assert.throws(() => setCurrentVehicle("DRV-001", "VH-BL-100"), { code: "CURRENT_VEHICLE_NOT_ASSIGNED" });

    setCurrentVehicle(firstDriver, firstVehicle, "2026-09-28T09:00:00.000Z");
    assert.equal(getCurrentVehicle(firstDriver).id, firstVehicle);
    assert.equal(getCurrentDriver(firstVehicle).id, firstDriver);
    assert.throws(() => setCurrentVehicle(secondDriver, firstVehicle), { code: "VEHICLE_ALREADY_CURRENT" });
    assert.equal(getCurrentVehicle(secondDriver), null);

    setCurrentVehicle(firstDriver, secondVehicle, "2026-09-28T09:05:00.000Z");
    assert.equal(getCurrentVehicle(firstDriver).id, secondVehicle);
    assert.equal(getCurrentDriver(firstVehicle), null);
    assert.equal(getAssignedVehicles(firstDriver).length, 2);

    clearCurrentVehicle(firstDriver);
    assert.equal(getCurrentVehicle(firstDriver), null);
    assert.equal(getAssignedVehicles(firstDriver).length, 2);

    setCurrentVehicle(firstDriver, firstVehicle);
    unassignVehicle(firstDriver, firstVehicle);
    assert.equal(getCurrentVehicle(firstDriver), null);
    assert.equal(getAssignedVehicles(firstDriver).map((vehicle) => vehicle.id).includes(firstVehicle), false);
  } finally {
    clearCurrentVehicle(firstDriver);
    clearCurrentVehicle(secondDriver);
    for (const vehicleId of [firstVehicle, secondVehicle, thirdVehicle]) deleteVehicle(vehicleId);
    deleteDriver(firstDriver);
    deleteDriver(secondDriver);
  }
});

test("database constraints reject duplicate current drivers and invalid direct relationships", () => {
  const driverId = "DRV-CURRENT-CONSTRAINT";
  const otherDriverId = "DRV-CURRENT-CONSTRAINT-B";
  const vehicleId = "VH-CURRENT-CONSTRAINT";
  createFixtureDriver(driverId, "SA-CURRENT-CONSTRAINT");
  createFixtureDriver(otherDriverId, "SA-CURRENT-CONSTRAINT-B");
  createFixtureVehicle(vehicleId, "CURRENT 004 GP");
  assignVehicle(driverId, vehicleId);
  assignVehicle(otherDriverId, vehicleId);
  setCurrentVehicle(driverId, vehicleId);

  try {
    assert.throws(
      () => db.prepare("INSERT INTO driver_current_vehicles (driver_id, vehicle_id, started_at, updated_at) VALUES (?, ?, ?, ?)")
        .run(otherDriverId, vehicleId, new Date().toISOString(), new Date().toISOString()),
      /UNIQUE/,
    );
    assert.throws(
      () => db.prepare("INSERT INTO driver_current_vehicles (driver_id, vehicle_id, started_at, updated_at) VALUES ('DRV-MISSING', ?, ?, ?)")
        .run(vehicleId, new Date().toISOString(), new Date().toISOString()),
    );
  } finally {
    clearCurrentVehicle(driverId);
    clearCurrentVehicle(otherDriverId);
    deleteVehicle(vehicleId);
    deleteDriver(driverId);
    deleteDriver(otherDriverId);
  }
});

test("driver and vehicle APIs expose explicit current state and current location", async () => {
  const registration = await request(app).post("/api/auth/register").send({
    username: `current.reader.${Date.now()}`,
    password: "ValidPass123!",
    name: "Current Reader",
  }).expect(201);
  const authorization = { Authorization: `Bearer ${registration.body.token}` };

  const driver = await request(app).get("/api/drivers/DRV-001").set(authorization).expect(200);
  assert.equal(driver.body.currentVehicle.id, "VH-JO-100");
  assert.deepEqual(driver.body.currentLocation, {
    lat: driver.body.currentVehicle.lat,
    lng: driver.body.currentVehicle.lng,
    heading: driver.body.currentVehicle.heading,
    city: driver.body.currentVehicle.city,
    province: driver.body.currentVehicle.province,
    lastSeen: driver.body.currentVehicle.lastSeen,
  });

  const vehicle = await request(app).get("/api/vehicles/VH-JO-100").set(authorization).expect(200);
  assert.equal(vehicle.body.currentDriver.id, "DRV-001");
  assert.ok(vehicle.body.assignedDrivers.some((assigned) => assigned.id === "DRV-001"));

  const available = await request(app).get("/api/drivers/DRV-005").set(authorization).expect(200);
  assert.equal(available.body.currentVehicle, null);
  assert.equal(available.body.currentLocation, null);
  const unassigned = await request(app).get("/api/vehicles/VH-BL-100").set(authorization).expect(200);
  assert.equal(unassigned.body.currentDriver, null);

  const switched = await request(app)
    .put("/api/drivers/DRV-001/current-vehicle")
    .set(authorization)
    .send({ vehicleId: "VH-CA-100" })
    .expect(200);
  assert.equal(switched.body.currentVehicle.id, "VH-CA-100");
  assert.equal(switched.body.assignedVehicleCount, 13);

  const cleared = await request(app)
    .delete("/api/drivers/DRV-001/current-vehicle")
    .set(authorization)
    .expect(200);
  assert.equal(cleared.body.currentVehicle, null);
  assert.equal(cleared.body.assignedVehicleCount, 13);

  setCurrentVehicle("DRV-001", "VH-JO-100", "2026-09-28T06:00:00.000Z");
});
