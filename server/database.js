import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { config } from "dotenv";
import {
  CANONICAL_FLEET,
  DRIVER_ROSTER,
  canonicalCity,
  canonicalMake,
  vehicleTypeFor,
  vehicles as generatedVehicles,
  visualKeyFor,
} from "./data.js";
import { calculateBearing } from "./services/bearingService.js";

config({ quiet: true });

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const configuredPath = process.env.DATABASE_PATH?.trim();
export const databasePath = configuredPath || path.join(serverDirectory, "data", "fleet-drive-demo.sqlite");

if (databasePath !== ":memory:") fs.mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys = ON");
if (databasePath !== ":memory:") db.exec("PRAGMA journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    plate TEXT NOT NULL UNIQUE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    driver_id TEXT,
    driver_name TEXT,
    status TEXT NOT NULL,
    speed REAL NOT NULL DEFAULT 0,
    mileage REAL NOT NULL DEFAULT 0,
    fuel REAL,
    city TEXT,
    province TEXT,
    area TEXT,
    lat REAL,
    lng REAL,
    last_seen TEXT NOT NULL,
    last_service_mileage REAL NOT NULL DEFAULT 0,
    service_interval REAL NOT NULL DEFAULT 15000,
    geofence_status TEXT NOT NULL DEFAULT 'inside',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    speed REAL NOT NULL,
    mileage REAL,
    fuel REAL,
    geofence_status TEXT,
    recorded_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS telemetry_vehicle_time
    ON telemetry(vehicle_id, recorded_at DESC);

  CREATE TABLE IF NOT EXISTS maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    due_mileage REAL,
    due_date TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    recorded_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    licence_number TEXT NOT NULL UNIQUE,
    licence_expiry TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS geofences (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    shape_type TEXT NOT NULL,
    center_lat REAL,
    center_lng REAL,
    radius_m REAL,
    polygon_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS geofence_vehicle_states (
    geofence_id TEXT NOT NULL REFERENCES geofences(id) ON DELETE CASCADE,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    checked_at TEXT NOT NULL,
    PRIMARY KEY (geofence_id, vehicle_id)
  );
`);

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((candidate) => candidate.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn("alerts", "state", "TEXT NOT NULL DEFAULT 'open'");
ensureColumn("vehicles", "variant", "TEXT");
ensureColumn("vehicles", "vehicle_type", "TEXT NOT NULL DEFAULT 'UNKNOWN'");
ensureColumn("vehicles", "visual_key", "TEXT");
ensureColumn("vehicles", "heading", "REAL");
ensureColumn("telemetry", "heading", "REAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS driver_vehicle_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id TEXT NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    assigned_at TEXT NOT NULL,
    unassigned_at TEXT,
    is_active_assignment INTEGER NOT NULL DEFAULT 1 CHECK (is_active_assignment IN (0, 1)),
    CHECK (
      (is_active_assignment = 1 AND unassigned_at IS NULL)
      OR (is_active_assignment = 0 AND unassigned_at IS NOT NULL)
    )
  );

  CREATE UNIQUE INDEX IF NOT EXISTS one_active_driver_vehicle_assignment
    ON driver_vehicle_assignments(driver_id, vehicle_id)
    WHERE is_active_assignment = 1;

  CREATE INDEX IF NOT EXISTS driver_vehicle_assignments_driver
    ON driver_vehicle_assignments(driver_id, is_active_assignment);

  CREATE INDEX IF NOT EXISTS driver_vehicle_assignments_vehicle
    ON driver_vehicle_assignments(vehicle_id, is_active_assignment);
`);

db.exec(`
  DROP TRIGGER IF EXISTS current_vehicle_requires_assignment;

  CREATE TABLE IF NOT EXISTS driver_current_vehicles (
    driver_id TEXT PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id TEXT NOT NULL UNIQUE REFERENCES vehicles(id) ON DELETE CASCADE,
    started_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TRIGGER IF NOT EXISTS current_vehicle_requires_assignment_insert
  BEFORE INSERT ON driver_current_vehicles
  WHEN NOT EXISTS (
    SELECT 1 FROM driver_vehicle_assignments
    WHERE driver_id = NEW.driver_id
      AND vehicle_id = NEW.vehicle_id
      AND is_active_assignment = 1
  )
  BEGIN
    SELECT RAISE(ABORT, 'CURRENT_VEHICLE_NOT_ASSIGNED');
  END;

  CREATE TRIGGER IF NOT EXISTS current_vehicle_requires_assignment_update
  BEFORE UPDATE OF driver_id, vehicle_id ON driver_current_vehicles
  WHEN NOT EXISTS (
    SELECT 1 FROM driver_vehicle_assignments
    WHERE driver_id = NEW.driver_id
      AND vehicle_id = NEW.vehicle_id
      AND is_active_assignment = 1
  )
  BEGIN
    SELECT RAISE(ABORT, 'CURRENT_VEHICLE_NOT_ASSIGNED');
  END;

  CREATE TRIGGER IF NOT EXISTS clear_current_vehicle_after_unassignment
  AFTER UPDATE OF is_active_assignment ON driver_vehicle_assignments
  WHEN NEW.is_active_assignment = 0
  BEGIN
    DELETE FROM driver_current_vehicles
    WHERE driver_id = NEW.driver_id AND vehicle_id = NEW.vehicle_id;
  END;

  CREATE TRIGGER IF NOT EXISTS clear_current_vehicle_after_assignment_delete
  AFTER DELETE ON driver_vehicle_assignments
  BEGIN
    DELETE FROM driver_current_vehicles
    WHERE driver_id = OLD.driver_id AND vehicle_id = OLD.vehicle_id;
  END;
`);

ensureColumn("driver_current_vehicles", "updated_at", "TEXT");
db.prepare("UPDATE driver_current_vehicles SET updated_at = started_at WHERE updated_at IS NULL").run();

function seedVehicles() {
  if (db.prepare("SELECT 1 FROM app_metadata WHERE key = 'vehicles_seeded'").get()) return;
  const count = db.prepare("SELECT COUNT(*) AS count FROM vehicles").get().count;
  if (count > 0) {
    db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('vehicles_seeded', ?)").run(new Date().toISOString());
    return;
  }

  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (
      id, plate, make, model, year, variant, vehicle_type, visual_key,
      driver_id, driver_name, status, speed, mileage, fuel, city, province,
      area, lat, lng, heading, last_seen, last_service_mileage, service_interval,
      geofence_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTelemetry = db.prepare(`
    INSERT INTO telemetry (vehicle_id, lat, lng, speed, heading, mileage, fuel, geofence_status, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMaintenance = db.prepare(`
    INSERT INTO maintenance (vehicle_id, type, status, due_mileage, due_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const now = Date.now();
  db.exec("BEGIN");
  try {
    generatedVehicles.forEach((vehicle, index) => {
      const year = vehicle.year;
      const mileage = 18000 + index * 317;
      const fuel = 24 + index * 11 % 73;
      const lastServiceMileage = Math.max(0, mileage - index % 17 * 900);
      const lastSeen = new Date(now - index % 20 * 60_000).toISOString();
      const createdAt = new Date(now - 90 * 86_400_000).toISOString();
      insertVehicle.run(
        vehicle.id, vehicle.plate, vehicle.make, vehicle.model, year, null,
        vehicle.vehicleType, vehicle.visualKey, null, null,
        String(vehicle.status).toLowerCase(), vehicle.speed, mileage, fuel,
        vehicle.city, vehicle.province, null, vehicle.lat, vehicle.lng, null,
        lastSeen, lastServiceMileage, 15000, "inside", createdAt, lastSeen,
      );

      let previous = null;
      let lastHeading = null;
      for (let pointIndex = 5; pointIndex >= 0; pointIndex -= 1) {
        const point = {
          lat: vehicle.lat - pointIndex * 0.0012,
          lng: vehicle.lng - pointIndex * 0.0015,
        };
        const heading = calculateBearing(previous, point);
        if (heading !== null) lastHeading = heading;
        const recordedAt = new Date(now - pointIndex * 5 * 60_000 - index % 20 * 60_000).toISOString();
        insertTelemetry.run(
          vehicle.id, point.lat, point.lng, Math.max(0, vehicle.speed - pointIndex * 2),
          lastHeading, mileage - pointIndex * 1.4, Math.min(100, fuel + pointIndex * 0.2),
          "inside", recordedAt,
        );
        previous = point;
      }
      db.prepare("UPDATE vehicles SET heading = ? WHERE id = ?").run(lastHeading, vehicle.id);

      insertMaintenance.run(
        vehicle.id, "Scheduled service",
        mileage - lastServiceMileage >= 15000 ? "overdue" : "scheduled",
        lastServiceMileage + 15000, null, createdAt,
      );
    });
    db.prepare("INSERT INTO app_metadata (key, value) VALUES ('vehicles_seeded', ?)").run(new Date().toISOString());
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function seedDrivers() {
  const insert = db.prepare(`
    INSERT INTO drivers (id, name, licence_number, licence_expiry, phone, email, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const timestamp = new Date().toISOString();
  db.exec("BEGIN");
  try {
    DRIVER_ROSTER.forEach((driver, index) => {
      const existing = db.prepare("SELECT id FROM drivers WHERE id = ?").get(driver.id);
      const phone = `+27 00 000 ${String(index + 1).padStart(4, "0")}`;
      const email = `driver-${String(index + 1).padStart(3, "0")}@example.com`;
      if (!existing) {
        const identity = CANONICAL_FLEET.drivers.find((entry) => entry.id === driver.id);
        if (!identity) throw new Error(`Missing canonical driver: ${driver.id}`);
        insert.run(
          identity.id, identity.name, identity.licenceNumber, identity.licenceExpiry,
          identity.phone, identity.email, timestamp, timestamp,
        );
      } else {
        db.prepare("UPDATE drivers SET name = ?, phone = ?, email = ?, updated_at = ? WHERE id = ?")
          .run(driver.name, phone, email, timestamp, driver.id);
      }
    });
    db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('drivers_seeded', ?)").run(timestamp);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function normalizeFleetIdentity() {
  const rows = db.prepare("SELECT id, year, make, model, city, variant FROM vehicles").all();
  const update = db.prepare(`
    UPDATE vehicles SET make = ?, city = ?, area = CASE WHEN area = city THEN NULL ELSE area END,
      vehicle_type = ?, visual_key = ? WHERE id = ?
  `);
  db.exec("BEGIN");
  try {
    rows.forEach((vehicle) => {
      const make = canonicalMake(vehicle.make);
      const city = canonicalCity(vehicle.city);
      update.run(
        make, city, vehicleTypeFor(make, vehicle.model),
        visualKeyFor({ year: vehicle.year, make, model: vehicle.model, variant: vehicle.variant }),
        vehicle.id,
      );
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function seedAssignments() {
  if (db.prepare("SELECT 1 FROM app_metadata WHERE key = 'phase_2_3_assignments_seeded'").get()) return;
  const assignedAt = "2026-09-28T00:00:00.000Z";
  const prematureSeed = Boolean(db.prepare("SELECT 1 FROM app_metadata WHERE key = 'wp2_assignments_seeded'").get());
  const legacy = db.prepare(`
    SELECT v.driver_id, v.id AS vehicle_id
    FROM vehicles v JOIN drivers d ON d.id = v.driver_id
    WHERE v.driver_id IS NOT NULL
    ORDER BY v.driver_id, v.id
  `).all();
  const legacyByVehicle = new Map(legacy.map((assignment) => [assignment.vehicle_id, assignment.driver_id]));
  const canonicalByVehicle = new Map(CANONICAL_FLEET.assignments
    .map((assignment) => [assignment.vehicleId, assignment.driverId]));
  const vehicles = db.prepare("SELECT id FROM vehicles ORDER BY id").all();
  const desired = vehicles.flatMap((vehicle) => {
    if (!prematureSeed && legacyByVehicle.has(vehicle.id)) {
      return [{ driverId: legacyByVehicle.get(vehicle.id), vehicleId: vehicle.id }];
    }
    const driverId = canonicalByVehicle.get(vehicle.id);
    return driverId ? [{ driverId, vehicleId: vehicle.id }] : [];
  });
  const insert = db.prepare(`
    INSERT INTO driver_vehicle_assignments
      (driver_id, vehicle_id, assigned_at, unassigned_at, is_active_assignment)
    VALUES (?, ?, ?, ?, ?)
  `);
  db.exec("BEGIN");
  try {
    db.prepare(`
      UPDATE driver_vehicle_assignments
      SET is_active_assignment = 0, unassigned_at = ?
      WHERE is_active_assignment = 1
    `).run(assignedAt);
    desired.forEach((assignment) => insert.run(
      assignment.driverId, assignment.vehicleId, assignedAt, null, 1,
    ));
    db.prepare("UPDATE vehicles SET driver_id = NULL, driver_name = NULL").run();
    const updateLegacy = db.prepare(`
      UPDATE vehicles SET driver_id = ?, driver_name =
        (SELECT name FROM drivers WHERE id = ?)
      WHERE id = ?
    `);
    desired.forEach((assignment) => updateLegacy.run(
      assignment.driverId, assignment.driverId, assignment.vehicleId,
    ));
    db.prepare("INSERT INTO app_metadata (key, value) VALUES ('phase_2_3_assignments_seeded', ?)")
      .run(assignedAt);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function hydrateLatestVehicleHeadings() {
  const vehicles = db.prepare("SELECT id FROM vehicles WHERE heading IS NULL ORDER BY id").all();
  const recentTelemetry = db.prepare(`
    SELECT lat, lng FROM telemetry
    WHERE vehicle_id = ?
    ORDER BY recorded_at DESC, id DESC
    LIMIT 5000
  `);
  const update = db.prepare("UPDATE vehicles SET heading = ? WHERE id = ? AND heading IS NULL");

  db.exec("BEGIN");
  try {
    vehicles.forEach(({ id }) => {
      const points = recentTelemetry.all(id);
      const latest = points[0];
      if (!latest) return;
      const heading = points.slice(1)
        .map((previous) => calculateBearing(previous, latest))
        .find((candidate) => candidate !== null);
      if (heading !== undefined) update.run(heading, id);
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function seedCurrentOperations() {
  if (db.prepare("SELECT 1 FROM app_metadata WHERE key = 'phase_2_4_current_operations_seeded'").get()) return;
  const timestamp = "2026-09-28T06:00:00.000Z";
  const operations = CANONICAL_FLEET.currentOperations;
  const isAssigned = db.prepare(`
    SELECT 1 FROM driver_vehicle_assignments
    WHERE driver_id = ? AND vehicle_id = ? AND is_active_assignment = 1
  `);
  const insert = db.prepare(`
    INSERT INTO driver_current_vehicles (driver_id, vehicle_id, started_at, updated_at)
    VALUES (?, ?, ?, ?)
  `);
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM driver_current_vehicles").run();
    operations.forEach((operation) => {
      if (!isAssigned.get(operation.driverId, operation.vehicleId)) {
        throw new Error(`Invalid deterministic current operation: ${operation.driverId}/${operation.vehicleId}`);
      }
      insert.run(operation.driverId, operation.vehicleId, timestamp, timestamp);
    });
    db.prepare("INSERT INTO app_metadata (key, value) VALUES ('phase_2_4_current_operations_seeded', ?)")
      .run(timestamp);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function reconcileStage3Drv015Amendment() {
  const timestamp = "2026-10-05T00:00:00.000Z";
  const driver = db.prepare("SELECT id, name FROM drivers WHERE id = 'DRV-015'").get();
  if (!driver) return;

  const assigned = db.prepare(`
    SELECT 1 FROM driver_vehicle_assignments
    WHERE driver_id = 'DRV-015' AND vehicle_id = 'VH-JO-114' AND is_active_assignment = 1
  `).get();
  const competingCurrent = db.prepare(`
    SELECT driver_id FROM driver_current_vehicles
    WHERE vehicle_id = 'VH-JO-114' AND driver_id != 'DRV-015'
  `).get();

  db.exec("BEGIN");
  try {
    db.prepare("UPDATE vehicles SET driver_name = ?, updated_at = ? WHERE driver_id = 'DRV-015'")
      .run(driver.name, timestamp);

    if (assigned && !competingCurrent) {
      db.prepare(`
        INSERT INTO driver_current_vehicles (driver_id, vehicle_id, started_at, updated_at)
        VALUES ('DRV-015', 'VH-JO-114', ?, ?)
        ON CONFLICT(driver_id) DO UPDATE SET
          vehicle_id = excluded.vehicle_id,
          started_at = CASE
            WHEN driver_current_vehicles.vehicle_id = excluded.vehicle_id
              THEN driver_current_vehicles.started_at
            ELSE excluded.started_at
          END,
          updated_at = excluded.updated_at
      `).run(timestamp, timestamp);
    }

    db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('stage_3_2b_drv_015_reconciled', ?)")
      .run(timestamp);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function seedMaintenanceHistory() {
  if (db.prepare("SELECT 1 FROM app_metadata WHERE key = 'maintenance_history_seeded'").get()) return;
  const completedCount = db.prepare("SELECT COUNT(*) AS count FROM maintenance WHERE status = 'completed'").get().count;
  if (completedCount > 0) {
    db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('maintenance_history_seeded', ?)").run(new Date().toISOString());
    return;
  }
  const vehicles = db.prepare("SELECT id, mileage FROM vehicles ORDER BY id LIMIT 8").all();
  const insert = db.prepare("INSERT INTO maintenance (vehicle_id, type, status, due_mileage, due_date, completed_at, created_at) VALUES (?, ?, 'completed', ?, ?, ?, ?)");
  const now = Date.now();
  vehicles.forEach((vehicle, index) => {
    const completedAt = new Date(now - (index + 2) * 86_400_000).toISOString();
    insert.run(vehicle.id, index % 2 ? "Tyre rotation" : "Oil and filter service", vehicle.mileage - 500, null, completedAt, completedAt);
  });
  db.exec(`
    UPDATE maintenance
    SET due_mileage = (SELECT mileage - 500 FROM vehicles WHERE vehicles.id = maintenance.vehicle_id)
    WHERE status != 'completed' AND id % 29 = 0
  `);
  db.prepare("INSERT INTO app_metadata (key, value) VALUES ('maintenance_history_seeded', ?)").run(new Date().toISOString());
}

function seedGeofences() {
  const alreadySeeded = db.prepare("SELECT 1 FROM app_metadata WHERE key = 'geofences_seeded'").get();
  const count = db.prepare("SELECT COUNT(*) AS count FROM geofences").get().count;
  if (!alreadySeeded && count === 0) {
    const now = new Date().toISOString();
    const insert = db.prepare("INSERT INTO geofences (id, name, shape_type, center_lat, center_lng, radius_m, polygon_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    insert.run("GF-JHB-DEPOT", "Johannesburg Operations", "circle", -26.2041, 28.0473, 8500, null, now, now);
    insert.run("GF-CPT-CENTRAL", "Cape Town Central", "polygon", null, null, null, JSON.stringify([
      { lat: -33.98, lng: 18.36 }, { lat: -33.86, lng: 18.36 },
      { lat: -33.86, lng: 18.53 }, { lat: -33.98, lng: 18.53 },
    ]), now, now);
  }
  if (!db.prepare("SELECT 1 FROM geofences WHERE id = 'GF-DEMO-JHB'").get()) {
    const now = new Date().toISOString();
    db.prepare("INSERT INTO geofences (id, name, shape_type, center_lat, center_lng, radius_m, polygon_json, created_at, updated_at) VALUES (?, ?, 'circle', ?, ?, ?, NULL, ?, ?)")
      .run("GF-DEMO-JHB", "Demo Johannesburg Operations Zone", -26.2041, 28.0473, 1200, now, now);
  }
  db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('geofences_seeded', ?)").run(new Date().toISOString());
}

seedVehicles();
hydrateLatestVehicleHeadings();
seedDrivers();
normalizeFleetIdentity();
seedAssignments();
seedCurrentOperations();
reconcileStage3Drv015Amendment();
seedMaintenanceHistory();
seedGeofences();
