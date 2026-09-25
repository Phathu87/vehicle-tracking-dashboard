import assert from "node:assert/strict";
import test from "node:test";
import { db } from "../database.js";

test("seeded Demo records satisfy relational and operational invariants", () => {
  const duplicatePlates = db.prepare("SELECT plate FROM vehicles GROUP BY plate HAVING COUNT(*) > 1").all();
  const duplicateLicences = db.prepare("SELECT licence_number FROM drivers GROUP BY licence_number HAVING COUNT(*) > 1").all();
  const orphanAssignments = db.prepare("SELECT id FROM vehicles WHERE driver_id IS NOT NULL AND driver_id NOT IN (SELECT id FROM drivers)").all();
  const orphanTelemetry = db.prepare("SELECT id FROM telemetry WHERE vehicle_id NOT IN (SELECT id FROM vehicles)").all();
  const orphanMaintenance = db.prepare("SELECT id FROM maintenance WHERE vehicle_id NOT IN (SELECT id FROM vehicles)").all();
  const orphanAlerts = db.prepare("SELECT id FROM alerts WHERE vehicle_id NOT IN (SELECT id FROM vehicles)").all();
  const invalidVehicles = db.prepare("SELECT id FROM vehicles WHERE lat NOT BETWEEN -90 AND 90 OR lng NOT BETWEEN -180 AND 180 OR mileage < 0 OR fuel < 0 OR fuel > 100").all();
  const invalidDriverDates = db.prepare("SELECT id, licence_expiry FROM drivers").all().filter((driver) => Number.isNaN(Date.parse(driver.licence_expiry)));

  assert.deepEqual(duplicatePlates, []);
  assert.deepEqual(duplicateLicences, []);
  assert.deepEqual(orphanAssignments, []);
  assert.deepEqual(orphanTelemetry, []);
  assert.deepEqual(orphanMaintenance, []);
  assert.deepEqual(orphanAlerts, []);
  assert.deepEqual(invalidVehicles, []);
  assert.deepEqual(invalidDriverDates, []);
});
