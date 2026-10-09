import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { CANONICAL_FLEET, vehicles } from "../data.js";
import { verifyCanonicalSeed } from "../scripts/verifyDeterministicSeed.js";

test("canonical snapshot preserves the reviewed 350-vehicle identity checkpoint", () => {
  const hash = createHash("sha256").update(JSON.stringify(CANONICAL_FLEET.vehicles)).digest("hex");
  assert.equal(hash, "ca2cccce3726b4a896ab3c7a253f7da40fd2143021b0bf1907a5b48432f626be");
  assert.equal(CANONICAL_FLEET.vehicles.length, 350);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.id)).size, 350);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.plate)).size, 350);
  for (const expected of CANONICAL_FLEET.vehicles) {
    const actual = vehicles.find((vehicle) => vehicle.id === expected.id);
    for (const key of Object.keys(expected)) assert.equal(actual[key], expected[key]);
  }
});

test("two clean seeds and their restarts reproduce authoritative identities and relationships", () => {
  const result = verifyCanonicalSeed();
  assert.equal(result.authoritativeEquivalent, true);
  assert.equal(result.cleanSeedA, 350);
  assert.equal(result.cleanSeedB, 350);
  assert.equal(result.priorityAMatches, 15);
  assert.equal(result.drivers, 25);
  assert.equal(result.assignments, 349);
  assert.equal(result.currentOperations, 21);
  assert.equal(result.drv015Amendment, true);
  assert.equal(result.restartIdentityPreserved, true);
  assert.notEqual(result.runtimeDatabaseUntouched, false);
});
