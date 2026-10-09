import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { integratedDriverIds, resolveDriverPortrait } from '../src/lib/driverPortraits.js';
import { selectSimulationVehicles } from '../server/services/demoFleetSimulator.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/assets/driver-asset-manifest.json')));
const records = JSON.parse(fs.readFileSync(path.join(root, 'docs/assets/driver-portrait-provenance.json')));
const db = new DatabaseSync(path.join(root, 'server/data/fleet-drive-demo.sqlite'), { readOnly: true });
const drivers = new Map(db.prepare('SELECT id, name FROM drivers').all().map((driver) => [driver.id, driver.name]));
const vehicles = db.prepare(`SELECT v.*, c.driver_id AS current_driver_id,
  d.name AS current_driver_name FROM vehicles v
  LEFT JOIN driver_current_vehicles c ON c.vehicle_id = v.id
  LEFT JOIN drivers d ON d.id = c.driver_id ORDER BY v.id`).all()
  .map((vehicle) => ({ ...vehicle, currentDriver: vehicle.current_driver_id
    ? { id: vehicle.current_driver_id, name: vehicle.current_driver_name } : null }));
db.close();
const ids = records.map((record) => record.driverId);
assert.equal(new Set(ids).size, ids.length, 'Duplicate provenance');
assert.deepEqual([...ids].sort(), [...integratedDriverIds].sort(), 'Registry/provenance mismatch');
const files = fs.readdirSync(path.join(root, 'public/assets/drivers')).sort();
assert.deepEqual(files, ids.map((id) => `${id}.webp`).sort(), 'Orphan or missing portrait');
for (const record of records) {
  assert.equal(drivers.get(record.driverId), record.driverName, 'Database identity mismatch');
  assert.equal(record.file, resolveDriverPortrait(record.driverId));
  assert.equal(record.sourceType, 'GENERATED');
  assert.equal(record.license, 'PROJECT_ASSET');
  assert.equal(record.finalTextFree, true);
  const data = fs.readFileSync(path.join(root, 'public', record.file));
  assert.equal(data.toString('ascii', 0, 4), 'RIFF');
  assert.equal(data.toString('ascii', 8, 12), 'WEBP');
  let dimensions;
  for (let offset = 12; offset + 8 <= data.length;) {
    const type = data.toString('ascii', offset, offset + 4);
    const size = data.readUInt32LE(offset + 4);
    const start = offset + 8;
    assert.ok(start + size <= data.length, 'Invalid WebP chunk');
    assert.ok(!['EXIF', 'XMP '].includes(type), 'Unnecessary embedded metadata');
    if (type === 'VP8X') dimensions = [1 + data.readUIntLE(start + 4, 3), 1 + data.readUIntLE(start + 7, 3)];
    if (type === 'VP8 ') dimensions = [data.readUInt16LE(start + 6) & 0x3fff, data.readUInt16LE(start + 8) & 0x3fff];
    if (type === 'VP8L') {
      const bits = data.readUInt32LE(start + 1);
      dimensions = [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset = start + size + (size % 2);
  }
  assert.deepEqual(dimensions, [512, 512]);
  assert.equal(data.length, record.finalBytes);
  const driver = manifest.drivers.find((entry) => entry.driverId === record.driverId);
  assert.equal(driver.name, record.driverName);
  assert.equal(driver.priority, record.priority);
  assert.equal(driver.photo.status, 'AVAILABLE');
  assert.equal(driver.photo.assetPath, record.file);
  if (data.length > 150_000) console.warn(`Large portrait: ${record.driverId} (${data.length} bytes)`);
}
assert.deepEqual(manifest.drivers.filter((driver) => driver.photo.status === 'AVAILABLE')
  .map((driver) => driver.driverId).sort(), [...ids].sort());
const participants = selectSimulationVehicles(vehicles, 15, 'NORMAL_FLEET');
assert.equal(participants.length, 15);
assert.deepEqual(participants.map((vehicle) => vehicle.currentDriver?.id).sort(),
  manifest.drivers.filter((driver) => driver.priority === 'A').map((driver) => driver.driverId).sort());
for (const vehicle of participants) {
  assert.ok(vehicle.currentDriver, 'Simulator driver missing');
  const driver = manifest.drivers.find((driver) => driver.driverId === vehicle.currentDriver.id);
  assert.equal(driver.currentVehicleId, vehicle.id);
  assert.equal(driver.name, vehicle.currentDriver.name);
  assert.equal(driver.simulatorParticipant, true);
  assert.equal(driver.photo.status, 'AVAILABLE');
  assert.equal(driver.photo.assetPath, resolveDriverPortrait(driver.driverId));
}
console.log(`PASS: ${ids.length} unique portraits, 512x512 WebP, database identities, provenance, manifest and registry agree; live simulator portrait coverage 15/15.`);
