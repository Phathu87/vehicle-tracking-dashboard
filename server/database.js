import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { config } from "dotenv";
import { vehicles as generatedVehicles } from "./data.js";

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

const alertColumns = db.prepare("PRAGMA table_info(alerts)").all();
if (!alertColumns.some((column) => column.name === "state")) {
  db.exec("ALTER TABLE alerts ADD COLUMN state TEXT NOT NULL DEFAULT 'open'");
}

function seedVehicles() {
  if (db.prepare("SELECT 1 FROM app_metadata WHERE key = 'vehicles_seeded'").get()) return;
  const count = db.prepare("SELECT COUNT(*) AS count FROM vehicles").get().count;
  if (count > 0) {
    db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('vehicles_seeded', ?)").run(new Date().toISOString());
    return;
  }

  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (
      id, plate, make, model, year, driver_id, driver_name, status, speed,
      mileage, fuel, city, province, area, lat, lng, last_seen,
      last_service_mileage, service_interval, geofence_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTelemetry = db.prepare(`
    INSERT INTO telemetry (vehicle_id, lat, lng, speed, mileage, fuel, geofence_status, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMaintenance = db.prepare(`
    INSERT INTO maintenance (vehicle_id, type, status, due_mileage, due_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const now = Date.now();
  db.exec("BEGIN");
  try {
    generatedVehicles.forEach((vehicle, index) => {
      const mileage = 18000 + index * 317;
      const fuel = 24 + (index * 11) % 73;
      const lastServiceMileage = Math.max(0, mileage - (index % 17) * 900);
      const lastSeen = new Date(now - (index % 20) * 60_000).toISOString();
      const createdAt = new Date(now - 90 * 86_400_000).toISOString();
      insertVehicle.run(
        vehicle.id, vehicle.plate, vehicle.make, vehicle.model, 2020 + (index % 5),
        `DRV-${String((index % 25) + 1).padStart(3, "0")}`, vehicle.driver,
        String(vehicle.status).toLowerCase(), vehicle.speed, mileage, fuel,
        vehicle.city, vehicle.province, vehicle.city, vehicle.lat, vehicle.lng,
        lastSeen, lastServiceMileage, 15000, "inside", createdAt, lastSeen,
      );

      for (let pointIndex = 5; pointIndex >= 0; pointIndex -= 1) {
        const recordedAt = new Date(now - pointIndex * 5 * 60_000 - (index % 20) * 60_000).toISOString();
        insertTelemetry.run(
          vehicle.id,
          vehicle.lat - pointIndex * 0.0012,
          vehicle.lng - pointIndex * 0.0015,
          Math.max(0, vehicle.speed - pointIndex * 2),
          mileage - pointIndex * 1.4,
          Math.min(100, fuel + pointIndex * 0.2),
          "inside",
          recordedAt,
        );
      }

      insertMaintenance.run(
        vehicle.id,
        "Scheduled service",
        mileage - lastServiceMileage >= 15000 ? "overdue" : "scheduled",
        lastServiceMileage + 15000,
        null,
        createdAt,
      );
    });
    db.prepare("INSERT INTO app_metadata (key, value) VALUES ('vehicles_seeded', ?)").run(new Date().toISOString());
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

seedVehicles();

function seedDrivers() {
  if (db.prepare("SELECT 1 FROM app_metadata WHERE key = 'drivers_seeded'").get()) return;
  const count = db.prepare("SELECT COUNT(*) AS count FROM drivers").get().count;
  if (count > 0) {
    db.prepare("INSERT OR REPLACE INTO app_metadata (key, value) VALUES ('drivers_seeded', ?)").run(new Date().toISOString());
    return;
  }
  const assignments = db.prepare("SELECT driver_id, MIN(driver_name) AS driver_name FROM vehicles WHERE driver_id IS NOT NULL GROUP BY driver_id ORDER BY driver_id").all();
  const insert = db.prepare("INSERT INTO drivers (id, name, licence_number, licence_expiry, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const now = Date.now();
  db.exec("BEGIN");
  try {
    assignments.forEach((driver, index) => {
      const daysUntilExpiry = index % 9 === 0 ? -30 : index % 7 === 0 ? 35 : 240 + index * 17;
      const timestamp = new Date(now).toISOString();
      const safeName = driver.driver_name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
      insert.run(
        driver.driver_id,
        driver.driver_name,
        `SA-${String(70000000 + index * 137).padStart(8, "0")}`,
        new Date(now + daysUntilExpiry * 86_400_000).toISOString().slice(0, 10),
        `+27 7${index % 10} ${String(100 + index).padStart(3, "0")} ${String(2000 + index).padStart(4, "0")}`,
        `${safeName}@fleetdrive.demo`,
        timestamp,
        timestamp,
      );
    });
    db.prepare("UPDATE vehicles SET driver_name = (SELECT name FROM drivers WHERE drivers.id = vehicles.driver_id) WHERE driver_id IS NOT NULL").run();
    db.prepare("INSERT INTO app_metadata (key, value) VALUES ('drivers_seeded', ?)").run(new Date().toISOString());
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

seedDrivers();
seedMaintenanceHistory();

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

seedGeofences();
