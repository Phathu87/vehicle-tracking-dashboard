import { db } from "../database.js";
import {
  clearCurrentVehicle,
  getAssignedVehicles,
  getCurrentVehicle,
  replaceAssignedVehicles,
  setCurrentVehicle,
} from "./assignmentService.js";

function licenceState(expiry) {
  const expiryTime = Date.parse(`${expiry}T23:59:59Z`);
  const days = Math.ceil((expiryTime - Date.now()) / 86_400_000);
  if (days < 0) return { licenceStatus: "expired", renewalState: "overdue", daysUntilExpiry: days };
  if (days <= 60) return { licenceStatus: "expiring", renewalState: "due_soon", daysUntilExpiry: days };
  return { licenceStatus: "valid", renewalState: "not_due", daysUntilExpiry: days };
}

function mapDriver(row, { detail = false } = {}) {
  if (!row) return null;
  const assignments = getAssignedVehicles(row.id);
  const currentVehicle = getCurrentVehicle(row.id);
  const state = licenceState(row.licence_expiry);
  const driver = {
    id: row.id,
    name: row.name,
    licenceNumber: row.licence_number,
    licenceExpiry: row.licence_expiry,
    phone: row.phone,
    email: row.email,
    ...state,
    assignedVehicleCount: assignments.length,
    assignedPlates: assignments.map((vehicle) => vehicle.plate),
    currentVehicle,
    currentLocation: currentVehicle ? {
      lat: currentVehicle.lat,
      lng: currentVehicle.lng,
      heading: currentVehicle.heading,
      city: currentVehicle.city,
      province: currentVehicle.province,
      lastSeen: currentVehicle.lastSeen,
    } : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  return detail ? { ...driver, assignedVehicles: assignments } : driver;
}

export function listDrivers({ search } = {}) {
  const rows = search
    ? db.prepare("SELECT * FROM drivers WHERE id LIKE ? OR name LIKE ? OR licence_number LIKE ? OR email LIKE ? ORDER BY name").all(...Array(4).fill(`%${search}%`))
    : db.prepare("SELECT * FROM drivers ORDER BY name").all();
  return rows.map((row) => mapDriver(row));
}

export function findDriver(id) {
  return mapDriver(db.prepare("SELECT * FROM drivers WHERE id = ?").get(id), { detail: true });
}

export function createDriver(input) {
  const now = new Date().toISOString();
  db.prepare("INSERT INTO drivers (id, name, licence_number, licence_expiry, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(input.id, input.name, input.licenceNumber, input.licenceExpiry, input.phone ?? null, input.email ?? null, now, now);
  return findDriver(input.id);
}

export function updateDriver(id, input) {
  const row = db.prepare("SELECT * FROM drivers WHERE id = ?").get(id);
  if (!row) return null;
  const next = {
    name: input.name ?? row.name,
    licenceNumber: input.licenceNumber ?? row.licence_number,
    licenceExpiry: input.licenceExpiry ?? row.licence_expiry,
    phone: input.phone ?? row.phone,
    email: input.email ?? row.email,
  };
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    db.prepare("UPDATE drivers SET name = ?, licence_number = ?, licence_expiry = ?, phone = ?, email = ?, updated_at = ? WHERE id = ?")
      .run(next.name, next.licenceNumber, next.licenceExpiry, next.phone, next.email, now, id);
    db.prepare("UPDATE vehicles SET driver_name = ?, updated_at = ? WHERE driver_id = ?").run(next.name, now, id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return findDriver(id);
}

export function deleteDriver(id) {
  if (!db.prepare("SELECT 1 FROM drivers WHERE id = ?").get(id)) return { deleted: false, assigned: false };
  if (db.prepare("SELECT 1 FROM driver_vehicle_assignments WHERE driver_id = ? AND is_active_assignment = 1 LIMIT 1").get(id)) {
    return { deleted: false, assigned: true };
  }
  db.prepare("DELETE FROM drivers WHERE id = ?").run(id);
  return { deleted: true, assigned: false };
}

export function assignVehicles(id, vehicleIds) {
  if (typeof id !== "string" || !/^DRV-[A-Z0-9-]+$/.test(id)) {
    const error = new Error("Driver ID is malformed.");
    error.code = "INVALID_DRIVER_ID";
    throw error;
  }
  if (!db.prepare("SELECT 1 FROM drivers WHERE id = ?").get(id)) return null;
  replaceAssignedVehicles(id, vehicleIds);
  return findDriver(id);
}

export function updateCurrentVehicle(id, vehicleId) {
  setCurrentVehicle(id, vehicleId);
  return findDriver(id);
}

export function removeCurrentVehicle(id) {
  clearCurrentVehicle(id);
  return findDriver(id);
}
