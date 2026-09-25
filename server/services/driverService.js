import { db } from "../database.js";

function licenceState(expiry) {
  const expiryTime = Date.parse(`${expiry}T23:59:59Z`);
  const days = Math.ceil((expiryTime - Date.now()) / 86_400_000);
  if (days < 0) return { licenceStatus: "expired", renewalState: "overdue", daysUntilExpiry: days };
  if (days <= 60) return { licenceStatus: "expiring", renewalState: "due_soon", daysUntilExpiry: days };
  return { licenceStatus: "valid", renewalState: "not_due", daysUntilExpiry: days };
}

function assignedVehicles(id) {
  return db.prepare("SELECT id, plate, make, model, status, city FROM vehicles WHERE driver_id = ? ORDER BY id").all(id);
}

function mapDriver(row, { detail = false } = {}) {
  if (!row) return null;
  const assignments = assignedVehicles(row.id);
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
  if (db.prepare("SELECT 1 FROM vehicles WHERE driver_id = ? LIMIT 1").get(id)) return { deleted: false, assigned: true };
  db.prepare("DELETE FROM drivers WHERE id = ?").run(id);
  return { deleted: true, assigned: false };
}

export function assignVehicles(id, vehicleIds) {
  const driver = db.prepare("SELECT id, name FROM drivers WHERE id = ?").get(id);
  if (!driver) return null;
  const uniqueIds = [...new Set(vehicleIds)];
  if (uniqueIds.length) {
    const placeholders = uniqueIds.map(() => "?").join(",");
    const existing = db.prepare(`SELECT id FROM vehicles WHERE id IN (${placeholders})`).all(...uniqueIds);
    if (existing.length !== uniqueIds.length) {
      const found = new Set(existing.map((vehicle) => vehicle.id));
      const error = new Error("One or more vehicles do not exist.");
      error.code = "VEHICLE_NOT_FOUND";
      error.missing = uniqueIds.filter((vehicleId) => !found.has(vehicleId));
      throw error;
    }
  }
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    db.prepare("UPDATE vehicles SET driver_id = NULL, driver_name = NULL, updated_at = ? WHERE driver_id = ?").run(now, id);
    const assign = db.prepare("UPDATE vehicles SET driver_id = ?, driver_name = ?, updated_at = ? WHERE id = ?");
    uniqueIds.forEach((vehicleId) => assign.run(id, driver.name, now, vehicleId));
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return findDriver(id);
}
