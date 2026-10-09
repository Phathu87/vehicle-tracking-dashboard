import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { CANONICAL_FLEET } from "../data.js";
import { selectSimulationVehicles } from "../services/demoFleetSimulator.js";

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimePath = path.join(serverDirectory, "data/fleet-drive-demo.sqlite");
const digest = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");

export function expectedSnapshot() {
  return Object.fromEntries(["vehicles", "drivers", "assignments", "currentOperations"]
    .map((key) => [key, CANONICAL_FLEET[key]]));
}

export function snapshot(databasePath) {
  const db = new DatabaseSync(databasePath, { readOnly: true });
  try {
    return JSON.parse(JSON.stringify({
      vehicles: db.prepare("SELECT id, plate, year, make, model, city, province, variant, vehicle_type AS vehicleType, visual_key AS visualKey FROM vehicles ORDER BY id").all(),
      drivers: db.prepare("SELECT id, name, licence_number AS licenceNumber, licence_expiry AS licenceExpiry, phone, email FROM drivers ORDER BY id").all(),
      assignments: db.prepare("SELECT driver_id AS driverId, vehicle_id AS vehicleId FROM driver_vehicle_assignments WHERE is_active_assignment = 1 ORDER BY driver_id, vehicle_id").all(),
      currentOperations: db.prepare("SELECT driver_id AS driverId, vehicle_id AS vehicleId FROM driver_current_vehicles ORDER BY driver_id").all(),
    }));
  } finally {
    db.close();
  }
}

export function verifyCanonicalSeed() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fleet-drive-seed-"));
  const runtimeHash = fs.existsSync(runtimePath) ? digest(runtimePath) : null;
  const expected = expectedSnapshot();
  const initialise = (databasePath) => {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", "await import('./database.js')"], {
      cwd: serverDirectory,
      env: { ...process.env, DATABASE_PATH: databasePath, NODE_ENV: "test", DEMO_SIMULATION_ENABLED: "false" },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout || "Clean seed failed");
  };
  try {
    // This external acquisition contract catches self-consistent but wrong seeds.
    const acquisition = JSON.parse(fs.readFileSync(path.join(serverDirectory,
      "../docs/assets/V1_1_PRIORITY_A_VEHICLE_ACQUISITION_MANIFEST.json"), "utf8"));
    const snapshots = [];
    for (const name of ["first", "second"]) {
      const databasePath = path.join(directory, name + ".sqlite");
      initialise(databasePath);
      const actual = snapshot(databasePath);
      assert.deepEqual(actual, expected, name + " seed does not reproduce authoritative fleet");
      initialise(databasePath);
      assert.deepEqual(snapshot(databasePath), actual, "Restart changed authoritative identity/relationships");
      snapshots.push(actual);
      const db = new DatabaseSync(databasePath, { readOnly: true });
      const positions = new Map(db.prepare("SELECT id, lat, lng FROM vehicles").all()
        .map((vehicle) => [vehicle.id, { lat: vehicle.lat, lng: vehicle.lng }]));
      db.close();
      const current = new Map(actual.currentOperations.map((pair) => [pair.vehicleId, pair.driverId]));
      const participants = selectSimulationVehicles(actual.vehicles.map((vehicle) => ({
        ...vehicle, ...positions.get(vehicle.id), currentDriver: current.has(vehicle.id) ? {
          id: current.get(vehicle.id), name: actual.drivers.find((driver) => driver.id === current.get(vehicle.id)).name,
        } : null,
      })), 15, "NORMAL_FLEET");
      assert.equal(participants.length, 15);
      assert.deepEqual(participants.map((vehicle) => vehicle.id).sort(),
        acquisition.vehicles.map((vehicle) => vehicle.vehicleId).sort());
      for (const vehicle of participants) {
        const planned = acquisition.vehicles.find((row) => row.vehicleId === vehicle.id);
        for (const field of ["year", "make", "model", "variant", "vehicleType", "city", "province", "visualKey"]) {
          assert.equal(vehicle[field], planned[field], vehicle.id + "/" + field);
        }
        assert.equal(vehicle.plate, planned.registration);
        assert.equal(vehicle.currentDriver.id, planned.driverId);
        assert.equal(vehicle.currentDriver.name, planned.driverName);
      }
      assert.equal(actual.drivers.find((driver) => driver.id === "DRV-015").name, "Tshifhiwa Netshanda");
      assert.equal(actual.currentOperations.find((pair) => pair.driverId === "DRV-015").vehicleId, "VH-JO-114");
      const amended = actual.vehicles.find((vehicle) => vehicle.id === "VH-JO-114");
      assert.equal(amended.year, 2024);
      assert.equal(amended.make, "Hyundai");
      assert.equal(amended.model, "Elantra");
      assert.equal(amended.plate, "GP 7973 TB");
    }
    assert.deepEqual(snapshots[0], snapshots[1], "Seeds are not reproducible with each other");
    assert.equal(expected.vehicles.length, 350);
    assert.equal(expected.drivers.length, 25);
    assert.equal(expected.assignments.length, 349);
    assert.equal(expected.currentOperations.length, 21);
    if (runtimeHash) {
      assert.equal(digest(runtimePath), runtimeHash, "Runtime database changed");
      assert.deepEqual(snapshot(runtimePath), expected, "Canonical snapshot differs from runtime identity");
    }
    return {
      identical: true, authoritativeEquivalent: true, cleanSeedA: 350, cleanSeedB: 350,
      restartIdentityPreserved: true, assignmentsIdentical: true, currentOperationsIdentical: true,
      vehicles: 350, drivers: 25, assignments: 349, currentOperations: 21,
      priorityAMatches: 15, drv015Amendment: true,
      runtimeDatabaseUntouched: runtimeHash ? true : "NOT PRESENT",
    };
  } finally {
    if (runtimeHash) assert.equal(digest(runtimePath), runtimeHash, "Runtime database changed");
    // Only remove the unique directory created above, never a caller-supplied path.
    assert.equal(path.dirname(directory), os.tmpdir());
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(verifyCanonicalSeed(), null, 2));
}
