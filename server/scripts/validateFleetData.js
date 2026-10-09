import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const databasePath = path.resolve(process.argv[2] || process.env.DATABASE_PATH || path.join(serverDirectory, "data", "fleet-drive-demo.sqlite"));
if (!fs.existsSync(databasePath)) throw new Error(`Fleet database not found: ${databasePath}`);

const db = new DatabaseSync(databasePath, { readOnly: true });
const failures = [];
const scalar = (sql) => Number(Object.values(db.prepare(sql).get())[0]);
const expect = (condition, message) => { if (!condition) failures.push(message); };

const vehicleCount = scalar("SELECT COUNT(*) FROM vehicles");
const driverCount = scalar("SELECT COUNT(*) FROM drivers");
const telemetryRows = scalar("SELECT COUNT(*) FROM telemetry");
const telemetryRowsWithHeading = scalar("SELECT COUNT(*) FROM telemetry WHERE heading IS NOT NULL");
const invalidHeadingRows = scalar("SELECT COUNT(*) FROM telemetry WHERE heading IS NOT NULL AND (typeof(heading) NOT IN ('integer', 'real') OR heading < 0 OR heading >= 360)");
expect(vehicleCount === 350, `Expected 350 vehicles, found ${vehicleCount}`);
expect(driverCount === 25, `Expected 25 drivers, found ${driverCount}`);
expect(scalar("SELECT COUNT(*) - COUNT(DISTINCT id) FROM vehicles") === 0, "Duplicate vehicle IDs");
expect(scalar("SELECT COUNT(*) - COUNT(DISTINCT plate) FROM vehicles") === 0, "Duplicate plates");
expect(scalar("SELECT COUNT(*) - COUNT(DISTINCT id) FROM drivers") === 0, "Duplicate driver IDs");
expect(scalar("SELECT COUNT(*) - COUNT(DISTINCT name) FROM drivers") === 0, "Duplicate driver display identities");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE year NOT BETWEEN 1900 AND 2100") === 0, "Invalid vehicle year");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE TRIM(make) = '' OR TRIM(model) = ''") === 0, "Missing make or model");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE make = 'Mercedes Benz'") === 0, "Noncanonical Mercedes Benz value");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE city = 'Mafikeng'") === 0, "Noncanonical Mafikeng value");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE vehicle_type NOT IN ('HATCHBACK','SEDAN','SUV','CROSSOVER','PICKUP','VAN','MINIBUS','TRUCK','OTHER','UNKNOWN')") === 0, "Invalid vehicle type");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE variant IS NOT NULL") === 0, "Unexpected invented variant");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE visual_key IS NULL OR TRIM(visual_key) = ''") === 0, "Missing visual key");
expect(scalar("SELECT COUNT(*) - COUNT(DISTINCT visual_key) FROM (SELECT DISTINCT year, make, model, variant, visual_key FROM vehicles)") === 0, "Visual key collision");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE lat NOT BETWEEN -90 AND 90 OR lng NOT BETWEEN -180 AND 180") === 0, "Invalid vehicle coordinates");
expect(scalar("SELECT COUNT(*) FROM telemetry WHERE lat NOT BETWEEN -90 AND 90 OR lng NOT BETWEEN -180 AND 180") === 0, "Invalid telemetry coordinates");
expect(invalidHeadingRows === 0, "Invalid telemetry heading");
expect(scalar("SELECT COUNT(*) FROM vehicles WHERE heading IS NOT NULL AND (typeof(heading) NOT IN ('integer', 'real') OR heading < 0 OR heading >= 360)") === 0, "Invalid latest vehicle heading");
expect(scalar("SELECT COUNT(*) FROM driver_vehicle_assignments a LEFT JOIN drivers d ON d.id = a.driver_id LEFT JOIN vehicles v ON v.id = a.vehicle_id WHERE d.id IS NULL OR v.id IS NULL") === 0, "Orphan assignment");
expect(scalar("SELECT COUNT(*) FROM (SELECT driver_id, vehicle_id FROM driver_vehicle_assignments WHERE is_active_assignment = 1 GROUP BY driver_id, vehicle_id HAVING COUNT(*) > 1)") === 0, "Duplicate active assignment");
expect(scalar("SELECT COUNT(*) FROM driver_vehicle_assignments WHERE is_active_assignment = 1") === 349, "Expected 349 active assignments");
expect(scalar("SELECT COUNT(DISTINCT driver_id) FROM driver_vehicle_assignments WHERE is_active_assignment = 1") === 25, "Expected all 25 drivers to have assignments");
expect(scalar("SELECT COUNT(DISTINCT vehicle_id) FROM driver_vehicle_assignments WHERE is_active_assignment = 1") === 349, "Expected 349 vehicles with assignments");
expect(scalar(`
  SELECT COUNT(*) FROM vehicles v
  WHERE v.driver_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM driver_vehicle_assignments a
    WHERE a.driver_id = v.driver_id AND a.vehicle_id = v.id
      AND a.is_active_assignment = 1
  )
`) === 0, "Legacy driver projection is missing from authoritative assignments");
expect(scalar("SELECT COUNT(*) FROM vehicles v WHERE NOT EXISTS (SELECT 1 FROM driver_vehicle_assignments a WHERE a.vehicle_id = v.id AND a.is_active_assignment = 1)") === 1, "Expected exactly one unassigned vehicle");
expect(scalar(`
  SELECT COUNT(*) FROM vehicles v
  WHERE v.id = 'VH-BL-100' AND v.driver_id IS NULL AND NOT EXISTS (
    SELECT 1 FROM driver_vehicle_assignments a
    WHERE a.vehicle_id = v.id AND a.is_active_assignment = 1
  )
`) === 1, "VH-BL-100 must remain unassigned");
expect(scalar(`
  SELECT COUNT(*) FROM (
    SELECT driver_id, COUNT(*) AS assignment_count
    FROM driver_vehicle_assignments
    WHERE is_active_assignment = 1
    GROUP BY driver_id
    HAVING assignment_count NOT IN (13, 14)
  )
`) === 0, "Driver assignment pools must remain at 13 or 14 vehicles");
expect(scalar("SELECT COUNT(*) FROM driver_current_vehicles") === 21, "Expected 21 deterministic current operations");
expect(scalar("SELECT COUNT(*) FROM (SELECT driver_id FROM driver_current_vehicles GROUP BY driver_id HAVING COUNT(*) > 1)") === 0, "Driver has multiple current vehicles");
expect(scalar("SELECT COUNT(*) FROM (SELECT vehicle_id FROM driver_current_vehicles GROUP BY vehicle_id HAVING COUNT(*) > 1)") === 0, "Vehicle has multiple current drivers");
expect(scalar(`
  SELECT COUNT(*) FROM driver_current_vehicles c
  LEFT JOIN drivers d ON d.id = c.driver_id
  LEFT JOIN vehicles v ON v.id = c.vehicle_id
  WHERE d.id IS NULL OR v.id IS NULL
`) === 0, "Orphan current operation");
expect(scalar(`
  SELECT COUNT(*) FROM driver_current_vehicles c
  WHERE NOT EXISTS (
    SELECT 1 FROM driver_vehicle_assignments a
    WHERE a.driver_id = c.driver_id AND a.vehicle_id = c.vehicle_id
      AND a.is_active_assignment = 1
  )
`) === 0, "Current operation is outside the active assignment pool");
expect(scalar("SELECT COUNT(*) FROM driver_current_vehicles WHERE vehicle_id = 'VH-BL-100'") === 0, "Unassigned VH-BL-100 has a current driver");
expect(scalar("SELECT COUNT(*) FROM drivers WHERE id = 'DRV-015' AND name = 'Tshifhiwa Netshanda'") === 1, "DRV-015 identity reconciliation missing");
expect(scalar("SELECT COUNT(*) FROM driver_current_vehicles WHERE driver_id = 'DRV-015' AND vehicle_id = 'VH-JO-114'") === 1, "DRV-015 current vehicle reconciliation missing");

const summary = {
  database: databasePath,
  vehicles: vehicleCount,
  drivers: driverCount,
  activeAssignments: scalar("SELECT COUNT(*) FROM driver_vehicle_assignments WHERE is_active_assignment = 1"),
  assignedVehicles: scalar("SELECT COUNT(DISTINCT vehicle_id) FROM driver_vehicle_assignments WHERE is_active_assignment = 1"),
  unassignedVehicles: scalar("SELECT COUNT(*) FROM vehicles v WHERE NOT EXISTS (SELECT 1 FROM driver_vehicle_assignments a WHERE a.vehicle_id = v.id AND a.is_active_assignment = 1)"),
  currentOperations: scalar("SELECT COUNT(*) FROM driver_current_vehicles"),
  driversWithoutCurrentVehicle: driverCount - scalar("SELECT COUNT(DISTINCT driver_id) FROM driver_current_vehicles"),
  telemetryRows,
  telemetryRowsWithHeading,
  telemetryRowsWithoutHeading: telemetryRows - telemetryRowsWithHeading,
  invalidHeadingRows,
  vehiclesWithLatestHeading: scalar("SELECT COUNT(*) FROM vehicles WHERE heading IS NOT NULL"),
  vehiclesWithoutLatestHeading: scalar("SELECT COUNT(*) FROM vehicles WHERE heading IS NULL"),
  cities: scalar("SELECT COUNT(DISTINCT city) FROM vehicles"),
  visualSpecifications: scalar("SELECT COUNT(*) FROM (SELECT DISTINCT year, make, model FROM vehicles)"),
  makeModelFamilies: scalar("SELECT COUNT(*) FROM (SELECT DISTINCT make, model FROM vehicles)"),
  vehicleTypes: scalar("SELECT COUNT(DISTINCT vehicle_type) FROM vehicles"),
  failures,
};

db.close();
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
