import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import {
  CITIES,
  canonicalCity,
  canonicalMake,
  vehicles,
  vehicleTypeFor,
} from "../data.js";

const IDENTITY_COLUMNS = "id, plate, year, make, model, city, province";
const APPROVED_TYPES = new Set([
  "HATCHBACK", "SEDAN", "SUV", "CROSSOVER", "PICKUP",
  "VAN", "MINIBUS", "TRUCK", "OTHER", "UNKNOWN",
]);

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

function identitySnapshot(databasePath) {
  const db = new DatabaseSync(databasePath, { readOnly: true });
  try {
    return db.prepare(`SELECT ${IDENTITY_COLUMNS} FROM vehicles ORDER BY id`).all();
  } finally {
    db.close();
  }
}

test("generated fleet identity is canonical, complete, and unique", () => {
  assert.equal(vehicles.length, 350);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.id)).size, 350);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.plate)).size, 350);
  assert.equal(new Set(vehicles.map(({ make, model }) => `${make}|${model}`)).size, 42);
  assert.equal(CITIES.length, 14);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.city)).size, 13);
  assert.equal(vehicles.some((vehicle) => vehicle.make === "Mercedes Benz"), false);
  assert.equal(vehicles.some((vehicle) => vehicle.city === "Mafikeng"), false);
  assert.equal(vehicles.every((vehicle) => vehicle.variant === null), true);
  assert.equal(vehicles.every((vehicle) => vehicle.year >= 2020 && vehicle.year <= 2024), true);
  assert.equal(vehicles.every((vehicle) => APPROVED_TYPES.has(vehicle.vehicleType)), true);
  assert.equal(vehicles.every((vehicle) => vehicle.vehicleType === vehicleTypeFor(vehicle.make, vehicle.model)), true);
  assert.equal(canonicalMake("Mercedes Benz"), "Mercedes-Benz");
  assert.equal(canonicalCity("Mafikeng"), "Mahikeng");
});

test("two independent clean databases have identical vehicle identity", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fleet-identity-"));
  try {
    const first = identitySnapshot(initialiseCleanDatabase(directory, "seed-a"));
    const second = identitySnapshot(initialiseCleanDatabase(directory, "seed-b"));
    assert.equal(first.length, 350);
    assert.deepEqual(second, first);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
