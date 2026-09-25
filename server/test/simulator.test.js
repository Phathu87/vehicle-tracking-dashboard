import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import request from "supertest";
import app from "../app.js";
import { readDemoSimulationConfig } from "../services/demoSimulationConfig.js";
import {
  createVehicleSimulationState,
  getDemoSimulationStatus,
  nextSimulatedTelemetry,
  resetDemoFleetSimulator,
  selectSimulationVehicles,
  startDemoFleetSimulator,
  stopDemoFleetSimulator,
} from "../services/demoFleetSimulator.js";
import { resetUsers } from "../services/userService.js";

process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";

const vehicleId = "000-SIMULATOR-TEST";
let token;
let vehicle;
let geofenceId;

function authorized(method, path) {
  return request(app)[method](path).set("Authorization", `Bearer ${token}`);
}

before(async () => {
  stopDemoFleetSimulator();
  resetUsers();
  const registration = await request(app).post("/api/auth/register").send({ username: "simulator.tester", password: "ValidPass123!", name: "Simulator Tester" }).expect(201);
  token = registration.body.token;
  const created = await authorized("post", "/api/vehicles").send({ id: vehicleId, plate: "SIM 011 GP", make: "Toyota", model: "Hilux", city: "Johannesburg", province: "Gauteng", lat: -26.2041, lng: 28.0473, mileage: 10_000, fuel: 60 }).expect(201);
  vehicle = created.body;
});

after(async () => {
  stopDemoFleetSimulator();
  if (geofenceId) await authorized("delete", `/api/geofences/${geofenceId}`);
  await authorized("delete", `/api/vehicles/${vehicleId}`);
});

afterEach(() => stopDemoFleetSimulator());

test("simulation configuration is disabled by default and invalid values fall back safely", () => {
  const config = readDemoSimulationConfig({ DEMO_SIMULATION_INTERVAL_MS: "fast", DEMO_SIMULATION_VEHICLE_LIMIT: "999", DEMO_SIMULATION_SPEED_MULTIPLIER: "0", DEMO_SIMULATION_SCENARIO: "UNKNOWN" });
  assert.equal(config.enabled, false);
  assert.equal(config.intervalMs, 10_000);
  assert.equal(config.vehicleLimit, 15);
  assert.equal(config.speedMultiplier, 1);
  assert.equal(config.scenario, "NORMAL_FLEET");
});

test("generated telemetry preserves state, mileage, fuel, coordinates, and offline behavior", () => {
  const config = { ...readDemoSimulationConfig({ DEMO_SIMULATION_ENABLED: "true", DEMO_SIMULATION_SEED: "test-seed" }), scenario: "ALERT_DEMO" };
  const state = createVehicleSimulationState(vehicle, config);
  const stopped = nextSimulatedTelemetry(vehicle, state, config, 0, new Date("2026-09-22T10:00:00Z"));
  assert.equal(stopped.operationalState, "stopped");
  assert.equal(stopped.telemetry.lat, vehicle.lat);
  assert.equal(stopped.telemetry.lng, vehicle.lng);
  const idle = nextSimulatedTelemetry(vehicle, state, config, 0, new Date("2026-09-22T10:00:10Z"));
  assert.equal(idle.operationalState, "idle");
  nextSimulatedTelemetry(vehicle, state, config, 0, new Date("2026-09-22T10:00:20Z"));
  const moving = nextSimulatedTelemetry(vehicle, state, config, 0, new Date("2026-09-22T10:00:30Z"));
  assert.equal(moving.operationalState, "overspeed");
  assert.notEqual(moving.telemetry.lat, vehicle.lat);
  assert.ok(moving.telemetry.mileage >= stopped.telemetry.mileage);
  assert.ok(moving.telemetry.fuel >= 0 && moving.telemetry.fuel <= 100);
  const offlineState = createVehicleSimulationState(vehicle, config, 9);
  offlineState.tick = 8;
  const offline = nextSimulatedTelemetry(vehicle, offlineState, config, 9);
  assert.equal(offline.operationalState, "offline");
  assert.equal(offline.telemetry, null);
  assert.equal(state.direction, 1);
  assert.equal(state.movementState, "overspeed");
  assert.equal(state.lastUpdateTime, "2026-09-22T10:00:30.000Z");
});

test("participant selection is geographically balanced and deterministic", () => {
  const candidates = [
    { id: "B-2", city: "Bloemfontein", lat: -29.1, lng: 26.2 },
    { id: "B-1", city: "Bloemfontein", lat: -29.1, lng: 26.2 },
    { id: "J-1", city: "Johannesburg", lat: -26.2, lng: 28.0 },
    { id: "P-1", city: "Pretoria", lat: -25.7, lng: 28.2 },
  ];
  assert.deepEqual(selectSimulationVehicles(candidates, 3).map((item) => item.id), ["B-1", "J-1", "P-1"]);
  assert.equal(selectSimulationVehicles(candidates, 1, "GEOFENCE_DEMO")[0].id, "J-1");
});

test("simulator lifecycle feeds the authenticated telemetry API without duplicate loops", async () => {
  const config = { ...readDemoSimulationConfig({ DEMO_SIMULATION_ENABLED: "true", DEMO_SIMULATION_INTERVAL_MS: "10000", DEMO_SIMULATION_VEHICLE_LIMIT: "1", DEMO_SIMULATION_SPEED_MULTIPLIER: "20", DEMO_SIMULATION_SEED: "integration-seed", DEMO_SIMULATION_SCENARIO: "ALERT_DEMO" }), token: "injected-adapter" };
  const previewState = createVehicleSimulationState(vehicle, config);
  const entryPoint = previewState.route[previewState.routeIndex];
  const geofence = await authorized("post", "/api/geofences").send({ name: "Simulator Test Boundary", shapeType: "circle", center: entryPoint, radiusMeters: 50 }).expect(201);
  geofenceId = geofence.body.id;
  const initialGeofenceState = await authorized("get", `/api/geofences/${geofenceId}/check?vehicleId=${vehicleId}`).expect(200);
  assert.equal(initialGeofenceState.body.states[0].state, "outside");
  await authorized("post", `/api/vehicles/${vehicleId}/maintenance`).send({ type: "Simulator threshold", dueMileage: vehicle.mileage + 0.01 }).expect(201);

  let timerCallback;
  let timerCount = 0;
  const adapter = {
    listVehicles: async () => {
      const response = await request(app).get("/api/vehicles").expect(200);
      return response.body.filter((item) => item.id === vehicleId);
    },
    sendTelemetry: async (id, telemetry) => {
      const response = await authorized("post", `/api/vehicles/${id}/telemetry`).send(telemetry).expect(201);
      return response.body;
    },
  };
  const setTimer = (callback) => { timerCount += 1; timerCallback = callback; return 101; };
  const clearTimer = () => {};

  const started = await startDemoFleetSimulator({ config, adapter, setTimer, clearTimer, logger: { info() {}, warn() {} } });
  assert.equal(started.running, true);
  assert.equal(started.active, true);
  assert.deepEqual(started.participatingVehicles, [vehicleId]);
  await startDemoFleetSimulator({ config, adapter, setTimer, clearTimer });
  assert.equal(timerCount, 1);

  await timerCallback();
  await timerCallback();
  await timerCallback();
  const insideVehicle = (await authorized("get", `/api/vehicles/${vehicleId}`).expect(200)).body;
  await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({ lat: insideVehicle.lat, lng: insideVehicle.lng, speed: 20, mileage: insideVehicle.mileage + 0.001, fuel: insideVehicle.fuel, recordedAt: new Date(Date.now() + 1).toISOString() }).expect(201);
  await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({ lat: insideVehicle.lat, lng: insideVehicle.lng, speed: 20, mileage: insideVehicle.mileage + 0.002, fuel: insideVehicle.fuel, recordedAt: new Date(Date.now() + 2).toISOString() }).expect(201);
  await timerCallback();

  const history = await authorized("get", `/api/vehicles/${vehicleId}/history?limit=20`).expect(200);
  assert.ok(history.body.history.length >= 4);
  assert.ok(history.body.history.at(-1).mileage >= vehicle.mileage);
  assert.notEqual(history.body.history.at(-1).lat, vehicle.lat);

  const alerts = await authorized("get", `/api/alerts?vehicleId=${vehicleId}`).expect(200);
  assert.ok(alerts.body.some((alert) => alert.type === "overspeed"));
  assert.ok(alerts.body.some((alert) => alert.type === "geofence_entry"));
  assert.ok(alerts.body.some((alert) => alert.type === "geofence_exit"));
  assert.equal(alerts.body.filter((alert) => alert.type === "geofence_entry" && alert.message.includes("Simulator Test Boundary")).length, 1);
  assert.equal(alerts.body.filter((alert) => alert.type === "geofence_exit" && alert.message.includes("Simulator Test Boundary")).length, 1);
  const overspeedCount = alerts.body.filter((alert) => alert.type === "overspeed").length;
  const latest = history.body.history.at(-1);
  await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({ ...latest, speed: 91, recordedAt: new Date().toISOString() }).expect(201);
  const alertsAfterCooldown = await authorized("get", `/api/alerts?vehicleId=${vehicleId}&type=overspeed`).expect(200);
  assert.equal(alertsAfterCooldown.body.length, overspeedCount);

  const maintenance = await authorized("get", `/api/maintenance/${vehicleId}/report`).expect(200);
  assert.ok(maintenance.body.tasks.some((task) => task.type === "Simulator threshold" && task.status === "overdue"));

  await authorized("post", `/api/vehicles/${vehicleId}/telemetry`).send({ lat: latest.lat, lng: latest.lng, speed: 45, mileage: latest.mileage, fuel: latest.fuel, recordedAt: new Date(Date.now() - 180_000).toISOString() }).expect(201);
  const offlineStatus = await authorized("get", `/api/vehicles/${vehicleId}/status`).expect(200);
  assert.equal(offlineStatus.body.status, "offline");

  const statusEndpoint = await authorized("get", "/api/demo/status").expect(200);
  assert.equal(statusEndpoint.body.running, true);
  assert.ok(statusEndpoint.body.tickCount >= 5);
  const driverBeforeReset = (await authorized("get", `/api/vehicles/${vehicleId}`).expect(200)).body.driver;
  const reset = resetDemoFleetSimulator();
  assert.equal(reset.running, true);
  assert.equal(reset.tickCount, 0);
  assert.equal(reset.acceptedTelemetryCount, 0);
  assert.equal(timerCount, 1);
  await timerCallback();
  const vehicleAfterReset = (await authorized("get", `/api/vehicles/${vehicleId}`).expect(200)).body;
  const driverAfterReset = vehicleAfterReset.driver;
  assert.equal(driverAfterReset, driverBeforeReset);
  assert.equal(vehicleAfterReset.plate, vehicle.plate);
  assert.equal(vehicleAfterReset.make, vehicle.make);
  await authorized("get", "/api/auth/me").expect(200);
  await authorized("get", `/api/geofences/${geofenceId}`).expect(200);
  const maintenanceAfterReset = await authorized("get", `/api/maintenance/${vehicleId}/report`).expect(200);
  assert.ok(maintenanceAfterReset.body.tasks.some((task) => task.type === "Simulator threshold"));
  const stopped = stopDemoFleetSimulator();
  assert.equal(stopped.running, false);
  assert.equal(stopped.active, false);
  assert.equal(getDemoSimulationStatus().running, false);
  const restarted = await startDemoFleetSimulator({ config, adapter, setTimer, clearTimer, logger: { info() {}, warn() {} } });
  assert.equal(restarted.running, true);
  assert.equal(timerCount, 2);
  stopDemoFleetSimulator();
});

test("disabled simulation does not create a timer", async () => {
  let timerCount = 0;
  const status = await startDemoFleetSimulator({ config: readDemoSimulationConfig({}), adapter: { listVehicles: async () => [], sendTelemetry: async () => {} }, setTimer: () => { timerCount += 1; } });
  assert.equal(status.enabled, false);
  assert.equal(status.running, false);
  assert.equal(timerCount, 0);
});
