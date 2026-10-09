import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { db } from "../database.js";
import { findDriver, listDrivers } from "../services/driverService.js";

const IDENTITY_COLUMNS = "id, name, email, phone, licence_number, licence_expiry";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initialiseCleanDatabase(directory, name) {
  const databasePath = path.join(directory, `${name}.sqlite`);
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", "await import('./database.js')"],
    {
      cwd: path.resolve("."),
      env: { ...process.env, DATABASE_PATH: databasePath, NODE_ENV: "test" },
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout || "Clean seed failed");
  return databasePath;
}

function driverIdentitySnapshot(databasePath) {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    return database.prepare(`SELECT ${IDENTITY_COLUMNS} FROM drivers ORDER BY id`).all();
  } finally {
    database.close();
  }
}

test("driver roster contains 25 distinct deterministic Demo identities", () => {
  const drivers = db.prepare(`SELECT ${IDENTITY_COLUMNS} FROM drivers ORDER BY id`).all();
  assert.equal(drivers.length, 25);
  assert.equal(new Set(drivers.map((driver) => driver.id)).size, 25);
  assert.equal(new Set(drivers.map((driver) => driver.name)).size, 25);
  assert.equal(new Set(drivers.map((driver) => driver.email)).size, 25);
  assert.equal(new Set(drivers.map((driver) => driver.phone)).size, 25);
  assert.equal(new Set(drivers.map((driver) => driver.licence_number)).size, 25);
  assert.equal(drivers.every((driver) => EMAIL_PATTERN.test(driver.email)), true);
  assert.equal(drivers.every((driver) => driver.email.endsWith("@example.com")), true);
  assert.equal(drivers.every((driver) => driver.phone.startsWith("+27 00 000 ")), true);
  assert.equal(drivers.find((driver) => driver.id === "DRV-015").name, "Tshifhiwa Netshanda");
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM drivers WHERE name = 'Tshifhiwa Netshanda'").get().count, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM driver_current_vehicles WHERE driver_id = 'DRV-015' AND vehicle_id = 'VH-JO-114'").get().count, 1);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM vehicles WHERE driver_id = 'DRV-015' AND driver_name != 'Tshifhiwa Netshanda'").get().count, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM vehicles v LEFT JOIN drivers d ON d.id = v.driver_id WHERE v.driver_id IS NOT NULL AND d.id IS NULL").get().count, 0);
});

test("driver API model retains licence state and frontend-compatible fields", () => {
  const drivers = listDrivers();
  assert.equal(drivers.length, 25);
  for (const driver of drivers) {
    assert.equal(typeof driver.id, "string");
    assert.equal(typeof driver.name, "string");
    assert.equal(typeof driver.licenceNumber, "string");
    assert.equal(typeof driver.licenceExpiry, "string");
    assert.ok(["valid", "expiring", "expired"].includes(driver.licenceStatus));
    assert.ok(["not_due", "due_soon", "overdue"].includes(driver.renewalState));
    assert.ok(Array.isArray(driver.assignedPlates));
  }
  assert.equal(findDriver("DRV-001").licenceStatus, "expired");
  assert.equal(findDriver("DRV-002").licenceStatus, "valid");
});

test("two independent clean databases have identical driver identity", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "driver-identity-"));
  try {
    const first = driverIdentitySnapshot(initialiseCleanDatabase(directory, "seed-a"));
    const second = driverIdentitySnapshot(initialiseCleanDatabase(directory, "seed-b"));
    assert.equal(first.length, 25);
    assert.deepEqual(second, first);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("existing database reconciliation updates DRV-015 identity and current vehicle deterministically", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "driver-reconcile-"));
  try {
    const databasePath = initialiseCleanDatabase(directory, "existing");
    const database = new DatabaseSync(databasePath);
    try {
      database.prepare("UPDATE drivers SET name = 'Tshilidzi Tshivhase' WHERE id = 'DRV-015'").run();
      database.prepare("UPDATE vehicles SET driver_name = 'Tshilidzi Tshivhase' WHERE driver_id = 'DRV-015'").run();
      database.prepare("DELETE FROM driver_current_vehicles WHERE driver_id = 'DRV-015'").run();
    } finally {
      database.close();
    }

    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", "await import('./database.js')"],
      {
        cwd: path.resolve("."),
        env: { ...process.env, DATABASE_PATH: databasePath, NODE_ENV: "test" },
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr || result.stdout || "Reconciliation failed");

    const reconciled = new DatabaseSync(databasePath, { readOnly: true });
    try {
      assert.equal(reconciled.prepare("SELECT name FROM drivers WHERE id = 'DRV-015'").get().name, "Tshifhiwa Netshanda");
      assert.equal(reconciled.prepare("SELECT COUNT(*) AS count FROM vehicles WHERE driver_id = 'DRV-015' AND driver_name != 'Tshifhiwa Netshanda'").get().count, 0);
      assert.equal(reconciled.prepare("SELECT vehicle_id FROM driver_current_vehicles WHERE driver_id = 'DRV-015'").get().vehicle_id, "VH-JO-114");
    } finally {
      reconciled.close();
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
