import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { db } from "../database.js";
import {
  getAssignedVehicles,
  getCurrentDriver,
  getCurrentVehicle,
  setCurrentVehicle,
} from "../services/assignmentService.js";
import { listAlerts } from "../services/alertService.js";
import { findDriver } from "../services/driverService.js";
import {
  createVehicleSimulationState,
  getDemoSimulationStatus,
  nextSimulatedTelemetry,
  resetDemoFleetSimulator,
  selectSimulationVehicles,
  startDemoFleetSimulator,
  stopDemoFleetSimulator,
} from "../services/demoFleetSimulator.js";
import { findVehicle, listVehicles, recordTelemetry } from "../services/vehicleService.js";

function hashRows(sql) {
  return createHash("sha256").update(JSON.stringify(db.prepare(sql).all())).digest("hex");
}

function relationshipSnapshot() {
  return {
    drivers: hashRows("SELECT id, name, licence_number, licence_expiry, phone, email FROM drivers ORDER BY id"),
    vehicles: hashRows("SELECT id, plate, year, make, model, variant, vehicle_type, visual_key FROM vehicles ORDER BY id"),
    assignments: hashRows("SELECT driver_id, vehicle_id, assigned_at, unassigned_at, is_active_assignment FROM driver_vehicle_assignments ORDER BY driver_id, vehicle_id, id"),
    currentOperations: hashRows("SELECT driver_id, vehicle_id, started_at, updated_at FROM driver_current_vehicles ORDER BY driver_id"),
  };
}

function simulationConfig(overrides = {}) {
  return {
    enabled: true,
    intervalMs: 10_000,
    vehicleLimit: 15,
    speedMultiplier: 20,
    seed: "phase-2-6",
    scenario: "NORMAL_FLEET",
    token: "injected-adapter",
    ...overrides,
  };
}

test("simulator participant policy uses explicit current operations instead of legacy assignment projection", () => {
  const vehicles = listVehicles();
  const current = vehicles.filter((vehicle) => vehicle.currentDriver?.id);
  const vehicleOnly = vehicles.filter((vehicle) => !vehicle.currentDriver?.id);
  const legacyOnly = vehicleOnly.find((vehicle) => vehicle.driverId);

  assert.equal(current.length, 21);
  assert.equal(vehicleOnly.length, 329);
  assert.ok(legacyOnly);
  assert.equal(legacyOnly.currentDriver, null);

  const ordinary = selectSimulationVehicles(vehicles, 15);
  assert.equal(ordinary.length, 15);
  assert.ok(ordinary.every((vehicle) => vehicle.currentDriver?.id));
  assert.equal(new Set(ordinary.map((vehicle) => vehicle.currentDriver.id)).size, ordinary.length);

  const expanded = selectSimulationVehicles(vehicles, 25);
  assert.equal(expanded.filter((vehicle) => vehicle.currentDriver?.id).length, 21);
  assert.equal(expanded.filter((vehicle) => !vehicle.currentDriver?.id).length, 4);

  const misleadingLegacyCandidate = {
    id: "LEGACY-ONLY", city: "Johannesburg", lat: -26.2, lng: 28.0,
    driverId: "DRV-001", currentDriver: null,
  };
  const explicitCandidate = {
    id: "CURRENT", city: "Pretoria", lat: -25.7, lng: 28.2,
    driverId: null, currentDriver: { id: "DRV-002", name: "Current Driver" },
  };
  assert.equal(selectSimulationVehicles([misleadingLegacyCandidate, explicitCandidate], 1)[0].id, "CURRENT");
});

test("simulation preserves relationships while telemetry follows explicit current-driver context", async () => {
  stopDemoFleetSimulator();
  const before = relationshipSnapshot();
  const noCurrentBefore = db.prepare(`
    SELECT COUNT(*) AS count FROM drivers d
    WHERE NOT EXISTS (SELECT 1 FROM driver_current_vehicles c WHERE c.driver_id = d.id)
  `).get().count;
  assert.equal(noCurrentBefore, 4);

  let timerCallback;
  const accepted = [];
  const adapter = {
    listVehicles: async () => listVehicles(),
    sendTelemetry: async (vehicleId, telemetry) => {
      assert.equal(Object.hasOwn(telemetry, "heading"), false);
      const stored = recordTelemetry(vehicleId, telemetry);
      accepted.push({ vehicleId, telemetry, stored });
      return { vehicleId, telemetry: stored };
    },
  };
  const setTimer = (callback) => { timerCallback = callback; return 2601; };
  const clearTimer = () => {};

  try {
    const started = await startDemoFleetSimulator({
      config: simulationConfig(), adapter, setTimer, clearTimer, logger: { info() {}, warn() {} },
      now: (() => {
        let tick = 0;
        return () => new Date(Date.parse("2026-09-29T10:00:00.000Z") + tick++ * 10_000);
      })(),
    });
    assert.equal(started.participants.length, 15);
    assert.ok(started.participants.every((participant) => participant.currentDriverId));
    assert.deepEqual(relationshipSnapshot(), before);

    const firstParticipant = started.participants[0];
    const initialVehicle = findVehicle(firstParticipant.vehicleId);
    const initialHeading = initialVehicle.heading;
    const firstAccepted = accepted.find((item) => item.vehicleId === firstParticipant.vehicleId);
    assert.equal(firstAccepted.stored.speed, 0);
    assert.equal(firstAccepted.stored.heading, initialHeading);

    await timerCallback();
    await timerCallback();
    await timerCallback();

    const movingVehicle = findVehicle(firstParticipant.vehicleId);
    assert.ok(movingVehicle.speed > 0);
    assert.ok(movingVehicle.heading >= 0 && movingVehicle.heading < 360);
    assert.equal(getCurrentDriver(firstParticipant.vehicleId).id, firstParticipant.currentDriverId);
    const currentDriver = findDriver(firstParticipant.currentDriverId);
    assert.equal(currentDriver.currentVehicle.id, firstParticipant.vehicleId);
    assert.equal(currentDriver.currentLocation.lat, movingVehicle.lat);
    assert.equal(currentDriver.currentLocation.lng, movingVehicle.lng);
    assert.equal(currentDriver.currentLocation.heading, movingVehicle.heading);
    assert.equal(currentDriver.currentLocation.lastSeen, movingVehicle.lastSeen);
    assert.deepEqual(relationshipSnapshot(), before);

    const vehicleWithoutCurrent = listVehicles().find((vehicle) => !vehicle.currentDriver && vehicle.driverId);
    const vehicleOnlyState = createVehicleSimulationState(vehicleWithoutCurrent, simulationConfig(), 0);
    vehicleOnlyState.tick = 3;
    const vehicleOnlyTelemetry = nextSimulatedTelemetry(vehicleWithoutCurrent, vehicleOnlyState, simulationConfig(), 0, new Date("2026-09-29T11:00:00.000Z"));
    assert.equal(vehicleOnlyTelemetry.operationalState, "stopped");
    assert.equal(vehicleOnlyTelemetry.telemetry.speed, 0);
    assert.equal(vehicleOnlyTelemetry.telemetry.lat, vehicleWithoutCurrent.lat);
    assert.equal(getCurrentDriver(vehicleWithoutCurrent.id), null);

    const acceptedWithoutDriver = recordTelemetry(vehicleWithoutCurrent.id, {
      lat: vehicleWithoutCurrent.lat + 0.001,
      lng: vehicleWithoutCurrent.lng + 0.001,
      speed: 35,
      mileage: vehicleWithoutCurrent.mileage + 0.1,
      fuel: vehicleWithoutCurrent.fuel,
      recordedAt: "2026-09-29T11:01:00.000Z",
    });
    assert.ok(acceptedWithoutDriver.heading >= 0 && acceptedWithoutDriver.heading < 360);
    assert.equal(getCurrentDriver(vehicleWithoutCurrent.id), null);

    const offlineState = createVehicleSimulationState({ ...initialVehicle, currentDriver: { id: firstParticipant.currentDriverId } }, simulationConfig(), 9);
    offlineState.tick = 8;
    assert.equal(nextSimulatedTelemetry({ ...initialVehicle, currentDriver: { id: firstParticipant.currentDriverId } }, offlineState, simulationConfig(), 9).operationalState, "offline");
    assert.equal(getCurrentDriver(firstParticipant.vehicleId).id, firstParticipant.currentDriverId);

    const currentForAlert = findVehicle(firstParticipant.vehicleId);
    recordTelemetry(firstParticipant.vehicleId, {
      lat: currentForAlert.lat,
      lng: currentForAlert.lng,
      speed: 91,
      mileage: currentForAlert.mileage + 0.01,
      fuel: currentForAlert.fuel,
      recordedAt: "2026-09-29T11:02:00.000Z",
    });
    const attributedAlert = listAlerts({ vehicleId: firstParticipant.vehicleId, type: "overspeed" })[0];
    assert.equal(attributedAlert.driverId, firstParticipant.currentDriverId);

    recordTelemetry(vehicleWithoutCurrent.id, {
      lat: acceptedWithoutDriver.lat,
      lng: acceptedWithoutDriver.lng,
      speed: 92,
      mileage: acceptedWithoutDriver.mileage + 0.01,
      fuel: acceptedWithoutDriver.fuel,
      recordedAt: "2026-09-29T11:03:00.000Z",
    });
    const unattributedAlert = listAlerts({ vehicleId: vehicleWithoutCurrent.id, type: "overspeed" })[0];
    assert.equal(unattributedAlert.driverId, null);

    resetDemoFleetSimulator();
    assert.deepEqual(relationshipSnapshot(), before);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM driver_current_vehicles").get().count, 21);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM driver_vehicle_assignments WHERE is_active_assignment = 1").get().count, 349);

    const oldCurrent = getCurrentVehicle("DRV-001");
    const replacement = getAssignedVehicles("DRV-001").find((vehicle) => !getCurrentDriver(vehicle.id));
    assert.ok(replacement);
    setCurrentVehicle("DRV-001", replacement.id, "2026-09-29T12:00:00.000Z");
    await timerCallback();
    assert.equal(getCurrentDriver(oldCurrent.id), null);
    assert.equal(getCurrentDriver(replacement.id).id, "DRV-001");
    assert.equal(getCurrentVehicle("DRV-001").id, replacement.id);
    setCurrentVehicle("DRV-001", oldCurrent.id, oldCurrent.startedAt);
    assert.equal(getCurrentDriver(replacement.id), null);
    assert.equal(getCurrentDriver(oldCurrent.id).id, "DRV-001");

    stopDemoFleetSimulator();
    assert.equal(getDemoSimulationStatus().running, false);
    assert.equal(getCurrentDriver(oldCurrent.id).id, "DRV-001");
    assert.equal(db.prepare(`
      SELECT COUNT(*) AS count FROM (
        SELECT driver_id FROM driver_current_vehicles GROUP BY driver_id HAVING COUNT(*) > 1
      )
    `).get().count, 0);
    assert.equal(db.prepare(`
      SELECT COUNT(*) AS count FROM drivers d
      WHERE NOT EXISTS (SELECT 1 FROM driver_current_vehicles c WHERE c.driver_id = d.id)
    `).get().count, 4);
  } finally {
    stopDemoFleetSimulator();
  }
});
