import { db } from "../database.js";

const DRIVER_ID_PATTERN = /^DRV-[A-Z0-9-]+$/;
const VEHICLE_ID_PATTERN = /^VH-[A-Z0-9-]+$/;

const VEHICLE_SUMMARY = `
  v.id, v.plate, v.year, v.make, v.model, v.variant,
  v.vehicle_type AS vehicleType, v.visual_key AS visualKey,
  v.status, v.city, v.province, v.lat, v.lng, v.speed, v.heading,
  v.last_seen AS lastSeen
`;

function assignmentError(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  return error;
}

function validateId(value, pattern, code, message) {
  if (typeof value !== "string" || !pattern.test(value)) throw assignmentError(code, message);
}

function requireDriver(driverId) {
  validateId(driverId, DRIVER_ID_PATTERN, "INVALID_DRIVER_ID", "Driver ID is malformed.");
  const driver = db.prepare("SELECT id, name FROM drivers WHERE id = ?").get(driverId);
  if (!driver) throw assignmentError("DRIVER_NOT_FOUND", "Driver not found.");
  return driver;
}

function requireVehicle(vehicleId) {
  validateId(vehicleId, VEHICLE_ID_PATTERN, "INVALID_VEHICLE_ID", "Vehicle ID is malformed.");
  const vehicle = db.prepare("SELECT id FROM vehicles WHERE id = ?").get(vehicleId);
  if (!vehicle) throw assignmentError("VEHICLE_NOT_FOUND", "Vehicle not found.", { missing: [vehicleId] });
  return vehicle;
}

export function syncLegacyAssignmentProjection(vehicleId, preferredDriverId = null) {
  const assignment = preferredDriverId
    ? db.prepare(`
        SELECT d.id, d.name FROM driver_vehicle_assignments a
        JOIN drivers d ON d.id = a.driver_id
        WHERE a.vehicle_id = ? AND a.driver_id = ? AND a.is_active_assignment = 1
      `).get(vehicleId, preferredDriverId)
    : db.prepare(`
        SELECT d.id, d.name FROM driver_vehicle_assignments a
        JOIN drivers d ON d.id = a.driver_id
        WHERE a.vehicle_id = ? AND a.is_active_assignment = 1
        ORDER BY d.id LIMIT 1
      `).get(vehicleId);
  db.prepare("UPDATE vehicles SET driver_id = ?, driver_name = ?, updated_at = ? WHERE id = ?")
    .run(assignment?.id ?? null, assignment?.name ?? null, new Date().toISOString(), vehicleId);
}

export function getAssignedVehicles(driverId) {
  return db.prepare(`
    SELECT ${VEHICLE_SUMMARY}, a.assigned_at AS assignedAt
    FROM driver_vehicle_assignments a
    JOIN vehicles v ON v.id = a.vehicle_id
    WHERE a.driver_id = ? AND a.is_active_assignment = 1
    ORDER BY v.id
  `).all(driverId);
}

export function getAssignedDrivers(vehicleId) {
  return db.prepare(`
    SELECT d.id, d.name, a.assigned_at AS assignedAt
    FROM driver_vehicle_assignments a
    JOIN drivers d ON d.id = a.driver_id
    WHERE a.vehicle_id = ? AND a.is_active_assignment = 1
    ORDER BY d.id
  `).all(vehicleId);
}

export function isDriverAssignedToVehicle(driverId, vehicleId) {
  return Boolean(db.prepare(`
    SELECT 1 FROM driver_vehicle_assignments
    WHERE driver_id = ? AND vehicle_id = ? AND is_active_assignment = 1
  `).get(driverId, vehicleId));
}

export function getCurrentVehicle(driverId) {
  return db.prepare(`
    SELECT ${VEHICLE_SUMMARY}, c.started_at AS startedAt, c.updated_at AS updatedAt
    FROM driver_current_vehicles c
    JOIN vehicles v ON v.id = c.vehicle_id
    WHERE c.driver_id = ?
  `).get(driverId) ?? null;
}

export function getCurrentDriver(vehicleId) {
  return db.prepare(`
    SELECT d.id, d.name, d.licence_number AS licenceNumber,
      d.licence_expiry AS licenceExpiry, d.phone, d.email,
      c.started_at AS startedAt, c.updated_at AS updatedAt
    FROM driver_current_vehicles c
    JOIN drivers d ON d.id = c.driver_id
    WHERE c.vehicle_id = ?
  `).get(vehicleId) ?? null;
}

export function setCurrentVehicle(driverId, vehicleId, timestamp = new Date().toISOString()) {
  requireDriver(driverId);
  requireVehicle(vehicleId);
  if (!isDriverAssignedToVehicle(driverId, vehicleId)) {
    throw assignmentError(
      "CURRENT_VEHICLE_NOT_ASSIGNED",
      "The vehicle must be assigned to the driver before it can become current.",
    );
  }

  db.exec("BEGIN IMMEDIATE");
  try {
    const occupied = db.prepare("SELECT driver_id FROM driver_current_vehicles WHERE vehicle_id = ?").get(vehicleId);
    if (occupied && occupied.driver_id !== driverId) {
      throw assignmentError("VEHICLE_ALREADY_CURRENT", "The vehicle is already current for another driver.", {
        currentDriverId: occupied.driver_id,
      });
    }
    db.prepare(`
      INSERT INTO driver_current_vehicles (driver_id, vehicle_id, started_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(driver_id) DO UPDATE SET
        vehicle_id = excluded.vehicle_id,
        started_at = CASE
          WHEN driver_current_vehicles.vehicle_id = excluded.vehicle_id
            THEN driver_current_vehicles.started_at
          ELSE excluded.started_at
        END,
        updated_at = excluded.updated_at
    `).run(driverId, vehicleId, timestamp, timestamp);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    if (error.code === "ERR_SQLITE_CONSTRAINT_UNIQUE") {
      throw assignmentError("VEHICLE_ALREADY_CURRENT", "The vehicle is already current for another driver.");
    }
    throw error;
  }
  return getCurrentVehicle(driverId);
}

export function clearCurrentVehicle(driverId) {
  requireDriver(driverId);
  db.prepare("DELETE FROM driver_current_vehicles WHERE driver_id = ?").run(driverId);
  return null;
}

export function clearCurrentDriver(vehicleId) {
  requireVehicle(vehicleId);
  db.prepare("DELETE FROM driver_current_vehicles WHERE vehicle_id = ?").run(vehicleId);
  return null;
}

export function assignVehicle(driverId, vehicleId, { assignedAt = new Date().toISOString(), preferredLegacy = false } = {}) {
  const driver = requireDriver(driverId);
  requireVehicle(vehicleId);
  if (isDriverAssignedToVehicle(driverId, vehicleId)) {
    throw assignmentError("ASSIGNMENT_EXISTS", "That vehicle is already assigned to this driver.");
  }
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      INSERT INTO driver_vehicle_assignments
        (driver_id, vehicle_id, assigned_at, unassigned_at, is_active_assignment)
      VALUES (?, ?, ?, NULL, 1)
    `).run(driverId, vehicleId, assignedAt);
    const legacy = db.prepare("SELECT driver_id FROM vehicles WHERE id = ?").get(vehicleId);
    if (preferredLegacy || !legacy?.driver_id) {
      db.prepare("UPDATE vehicles SET driver_id = ?, driver_name = ?, updated_at = ? WHERE id = ?")
        .run(driver.id, driver.name, assignedAt, vehicleId);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return getAssignedVehicles(driverId);
}

export function unassignVehicle(driverId, vehicleId) {
  requireDriver(driverId);
  requireVehicle(vehicleId);
  const now = new Date().toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("DELETE FROM driver_current_vehicles WHERE driver_id = ? AND vehicle_id = ?")
      .run(driverId, vehicleId);
    const result = db.prepare(`
      UPDATE driver_vehicle_assignments
      SET is_active_assignment = 0, unassigned_at = ?
      WHERE driver_id = ? AND vehicle_id = ? AND is_active_assignment = 1
    `).run(now, driverId, vehicleId);
    if (!result.changes) throw assignmentError("ASSIGNMENT_NOT_FOUND", "Active assignment not found.");
    const legacy = db.prepare("SELECT driver_id FROM vehicles WHERE id = ?").get(vehicleId);
    if (legacy?.driver_id === driverId) syncLegacyAssignmentProjection(vehicleId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return getAssignedVehicles(driverId);
}

export function replaceAssignedVehicles(driverId, vehicleIds) {
  requireDriver(driverId);
  const uniqueIds = [...new Set(vehicleIds)];
  uniqueIds.forEach((vehicleId) => validateId(vehicleId, VEHICLE_ID_PATTERN, "INVALID_VEHICLE_ID", "Vehicle ID is malformed."));
  if (uniqueIds.length) {
    const placeholders = uniqueIds.map(() => "?").join(",");
    const existing = db.prepare(`SELECT id FROM vehicles WHERE id IN (${placeholders})`).all(...uniqueIds);
    if (existing.length !== uniqueIds.length) {
      const found = new Set(existing.map((vehicle) => vehicle.id));
      throw assignmentError("VEHICLE_NOT_FOUND", "One or more vehicles do not exist.", {
        missing: uniqueIds.filter((vehicleId) => !found.has(vehicleId)),
      });
    }
  }

  const current = getAssignedVehicles(driverId).map((vehicle) => vehicle.id);
  const currentIds = new Set(current);
  const desiredIds = new Set(uniqueIds);
  const removed = current.filter((vehicleId) => !desiredIds.has(vehicleId));
  const added = uniqueIds.filter((vehicleId) => !currentIds.has(vehicleId));
  const now = new Date().toISOString();

  db.exec("BEGIN IMMEDIATE");
  try {
    const clearCurrent = db.prepare("DELETE FROM driver_current_vehicles WHERE driver_id = ? AND vehicle_id = ?");
    removed.forEach((vehicleId) => clearCurrent.run(driverId, vehicleId));
    const deactivate = db.prepare(`
      UPDATE driver_vehicle_assignments
      SET is_active_assignment = 0, unassigned_at = ?
      WHERE driver_id = ? AND vehicle_id = ? AND is_active_assignment = 1
    `);
    removed.forEach((vehicleId) => deactivate.run(now, driverId, vehicleId));
    const insert = db.prepare(`
      INSERT INTO driver_vehicle_assignments
        (driver_id, vehicle_id, assigned_at, unassigned_at, is_active_assignment)
      VALUES (?, ?, ?, NULL, 1)
    `);
    added.forEach((vehicleId) => insert.run(driverId, vehicleId, now));
    for (const vehicleId of removed) {
      const legacy = db.prepare("SELECT driver_id FROM vehicles WHERE id = ?").get(vehicleId);
      if (legacy?.driver_id === driverId) syncLegacyAssignmentProjection(vehicleId);
    }
    for (const vehicleId of added) {
      const legacy = db.prepare("SELECT driver_id FROM vehicles WHERE id = ?").get(vehicleId);
      if (!legacy?.driver_id) syncLegacyAssignmentProjection(vehicleId, driverId);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return getAssignedVehicles(driverId);
}
