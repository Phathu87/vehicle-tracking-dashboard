import assert from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { db } from "../database.js";
import {
  calculateBearing,
  HEADING_MOVEMENT_TOLERANCE_METERS,
  normalizeHeading,
} from "../services/bearingService.js";
import { assignVehicle, clearCurrentVehicle, setCurrentVehicle } from "../services/assignmentService.js";
import { createDriver, deleteDriver, findDriver } from "../services/driverService.js";
import { createVehicle, deleteVehicle, findVehicle, getVehicleHistory, recordTelemetry } from "../services/vehicleService.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

function closeTo(actual, expected, tolerance = 0.2) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test("bearing utility uses normalized navigation bearings and a conservative movement threshold", () => {
  const origin = { lat: 0, lng: 0 };
  closeTo(calculateBearing(origin, { lat: 0.01, lng: 0 }), 0);
  closeTo(calculateBearing(origin, { lat: 0, lng: 0.01 }), 90);
  closeTo(calculateBearing(origin, { lat: -0.01, lng: 0 }), 180);
  closeTo(calculateBearing(origin, { lat: 0, lng: -0.01 }), 270);
  closeTo(calculateBearing(origin, { lat: 0.01, lng: 0.01 }), 45);
  closeTo(calculateBearing(origin, { lat: -0.01, lng: 0.01 }), 135);
  closeTo(calculateBearing(origin, { lat: -0.01, lng: -0.01 }), 225);
  closeTo(calculateBearing(origin, { lat: 0.01, lng: -0.01 }), 315);
  assert.equal(normalizeHeading(360), 0);
  assert.equal(normalizeHeading(-10), 350);
  assert.equal(calculateBearing(origin, { lat: 0, lng: 0.000001 }), null);
  assert.equal(HEADING_MOVEMENT_TOLERANCE_METERS, 3);
});

test("telemetry heading policy remains backward compatible through service and API read models", async () => {
  const vehicleId = "VH-HEADING-TEST";
  const driverId = "DRV-HEADING-TEST";
  let token;

  resetUsers();
  const registration = await request(app).post("/api/auth/register").send({
    username: "heading.tester",
    password: "ValidPass123!",
    name: "Heading Tester",
  }).expect(201);
  token = registration.body.token;
  const authorized = (method, path) => request(app)[method](path).set("Authorization", `Bearer ${token}`);

  createDriver({
    id: driverId,
    name: "Heading Test Driver",
    licenceNumber: "SA-HEADING-TEST",
    licenceExpiry: "2029-12-31",
  });
  createVehicle({
    id: vehicleId,
    plate: "HEADING 01 GP",
    make: "Toyota",
    model: "Hilux",
    year: 2024,
    city: "Johannesburg",
    province: "Gauteng",
    lat: -26.2041,
    lng: 28.0473,
    mileage: 5000,
    fuel: 70,
  });
  assignVehicle(driverId, vehicleId);
  setCurrentVehicle(driverId, vehicleId);

  try {
    const first = recordTelemetry(vehicleId, {
      lat: -26.2041, lng: 28.0473, speed: 0, mileage: 5000, fuel: 70,
      recordedAt: "2026-09-29T08:00:00.000Z",
    });
    assert.equal(first.heading, null);

    const east = recordTelemetry(vehicleId, {
      lat: -26.2041, lng: 28.0483, speed: 40, mileage: 5000.1, fuel: 69.9,
      recordedAt: "2026-09-29T08:01:00.000Z",
    });
    closeTo(east.heading, 90, 0.5);
    assert.ok(east.heading >= 0 && east.heading < 360);

    const stationary = recordTelemetry(vehicleId, {
      lat: east.lat, lng: east.lng, speed: 0, mileage: 5000.1, fuel: 69.9,
      recordedAt: "2026-09-29T08:02:00.000Z",
    });
    assert.equal(stationary.heading, east.heading);

    const jitter = recordTelemetry(vehicleId, {
      lat: east.lat, lng: east.lng + 0.000001, speed: 0, mileage: 5000.1, fuel: 69.9,
      recordedAt: "2026-09-29T08:03:00.000Z",
    });
    assert.equal(jitter.heading, east.heading);

    const incoming = recordTelemetry(vehicleId, {
      lat: -26.2031, lng: 28.0483, speed: 35, heading: 143, mileage: 5000.2, fuel: 69.8,
      recordedAt: "2026-09-29T08:04:00.000Z",
    });
    assert.equal(incoming.heading, 143);
    assert.equal(findVehicle(vehicleId).heading, 143);

    assert.throws(() => recordTelemetry(vehicleId, {
      lat: -26.2021, lng: 28.0483, speed: 35, heading: Infinity, mileage: 5000.3,
    }), { code: "INVALID_HEADING" });

    for (const heading of [-1, 360, "90"]) {
      const invalid = await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({
        lat: -26.2021, lng: 28.0483, speed: 35, heading, mileage: 5000.3,
      }).expect(400);
      assert.equal(invalid.body.error.code, "VALIDATION_ERROR");
      assert.ok(invalid.body.error.details.heading);
    }

    db.prepare(`
      INSERT INTO telemetry (vehicle_id, lat, lng, speed, heading, mileage, fuel, geofence_status, recorded_at)
      VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?)
    `).run(vehicleId, -26.2051, 28.0463, 20, 4999.9, 70, "inside", "2026-09-29T07:59:00.000Z");
    assert.ok(getVehicleHistory(vehicleId, 20).some((point) => point.heading === null));

    const acceptedWithoutHeading = await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({
      lat: -26.2021,
      lng: 28.0493,
      speed: 45,
      mileage: 5000.3,
      fuel: 69.7,
      recordedAt: "2026-09-29T08:05:00.000Z",
    }).expect(201);
    assert.equal(typeof acceptedWithoutHeading.body.telemetry.heading, "number");

    const status = await authorized("get", `/api/vehicles/${vehicleId}/status`).expect(200);
    assert.equal(status.body.heading, acceptedWithoutHeading.body.telemetry.heading);
    assert.equal(status.body.lastSeen, "2026-09-29T08:05:00.000Z");

    const history = await authorized("get", `/api/vehicles/${vehicleId}/history?limit=20`).expect(200);
    assert.ok(history.body.history.every((point) => Object.hasOwn(point, "heading")));
    assert.ok(history.body.history.some((point) => point.heading === null));

    const driver = findDriver(driverId);
    assert.equal(driver.currentVehicle.heading, status.body.heading);
    assert.equal(driver.currentLocation.heading, status.body.heading);
  } finally {
    clearCurrentVehicle(driverId);
    deleteVehicle(vehicleId);
    deleteDriver(driverId);
  }
});
