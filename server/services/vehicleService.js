import { db } from "../database.js";
import { canonicalCity, canonicalMake, vehicleTypeFor, visualKeyFor } from "../data.js";
import {
  assignVehicle,
  getAssignedDrivers,
  getCurrentDriver,
  isDriverAssignedToVehicle,
  syncLegacyAssignmentProjection,
  unassignVehicle,
} from "./assignmentService.js";
import { evaluateVehicleGeofences } from "./geofenceService.js";
import { calculateBearing, isValidHeading } from "./bearingService.js";

export { calculateBearing } from "./bearingService.js";

const VEHICLE_COLUMNS = `
  id, plate, make, model, year, variant, vehicle_type, visual_key,
  driver_id, driver_name, status, speed, mileage, fuel, city, province, area,
  lat, lng, heading, last_seen, last_service_mileage, service_interval,
  geofence_status, created_at, updated_at
`;

function mapVehicle(row) {
  if (!row) return null;
  return {
    id: row.id,
    plate: row.plate,
    make: row.make,
    model: row.model,
    year: row.year,
    variant: row.variant ?? null,
    vehicleType: row.vehicle_type,
    visualKey: row.visual_key,
    driverId: row.driver_id,
    driver: row.driver_name,
    status: deriveVehicleStatus(row),
    speed: row.speed,
    mileage: row.mileage,
    fuel: row.fuel,
    city: row.city,
    province: row.province,
    area: row.area,
    lat: row.lat,
    lng: row.lng,
    heading: row.heading,
    lastSeen: row.last_seen,
    lastServiceMileage: row.last_service_mileage,
    serviceInterval: row.service_interval,
    geofenceStatus: row.geofence_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function positiveInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

export function deriveVehicleStatus(row, now = Date.now()) {
  const offlineAfterMs = positiveInteger(process.env.TELEMETRY_OFFLINE_AFTER_MS, 120_000, 10_000, 86_400_000);
  const lastSeen = Date.parse(row.last_seen ?? row.lastSeen);
  if (Number.isFinite(lastSeen) && now - lastSeen > offlineAfterMs) return "offline";
  return Number(row.speed) > 0 ? "moving" : "stationary";
}

function insertRuleAlert(insert, vehicleId, type, severity, message, recordedAt) {
  const cooldownMs = positiveInteger(process.env.TELEMETRY_ALERT_COOLDOWN_MS, 900_000, 1_000, 86_400_000);
  const recent = db.prepare("SELECT recorded_at FROM alerts WHERE vehicle_id = ? AND type = ? ORDER BY recorded_at DESC LIMIT 1").get(vehicleId, type);
  if (recent && Date.parse(recordedAt) - Date.parse(recent.recorded_at) < cooldownMs) return;
  insert.run(vehicleId, type, severity, message, recordedAt);
}

function mapTelemetry(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    lat: row.lat,
    lng: row.lng,
    speed: row.speed,
    heading: row.heading ?? null,
    mileage: row.mileage,
    fuel: row.fuel,
    geofenceStatus: row.geofence_status,
    recordedAt: row.recorded_at,
  };
}

export function listVehicles({ city, status, make, search } = {}) {
  const clauses = [];
  const values = [];
  if (city) { clauses.push("city = ? COLLATE NOCASE"); values.push(canonicalCity(city)); }
  if (status) { clauses.push("status = ? COLLATE NOCASE"); values.push(status); }
  if (make) { clauses.push("make = ? COLLATE NOCASE"); values.push(canonicalMake(make)); }
  if (search) {
    clauses.push("(id LIKE ? OR plate LIKE ? OR make LIKE ? OR model LIKE ? OR driver_name LIKE ? OR city LIKE ?)");
    const term = `%${search}%`;
    values.push(term, term, term, term, term, term);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db.prepare(`SELECT ${VEHICLE_COLUMNS} FROM vehicles ${where} ORDER BY id`).all(...values).map((row) => {
    const vehicle = mapVehicle(row);
    const currentDriver = getCurrentDriver(vehicle.id);
    return {
      ...vehicle,
      currentDriver: currentDriver ? { id: currentDriver.id, name: currentDriver.name } : null,
    };
  });
}

export function findVehicle(id) {
  return mapVehicle(db.prepare(`SELECT ${VEHICLE_COLUMNS} FROM vehicles WHERE id = ?`).get(id));
}

export function findVehicleDetail(id) {
  const vehicle = findVehicle(id);
  if (!vehicle) return null;
  return {
    ...vehicle,
    assignedDrivers: getAssignedDrivers(id),
    currentDriver: getCurrentDriver(id),
    maintenance: db.prepare("SELECT id, type, status, due_mileage AS dueMileage, due_date AS dueDate, completed_at AS completedAt, created_at AS createdAt FROM maintenance WHERE vehicle_id = ? ORDER BY created_at DESC").all(id),
    alerts: db.prepare("SELECT id, type, severity, message, state, recorded_at AS recordedAt FROM alerts WHERE vehicle_id = ? ORDER BY recorded_at DESC LIMIT 50").all(id),
  };
}

export function createVehicle(input) {
  const now = new Date().toISOString();
  const make = canonicalMake(input.make);
  const city = canonicalCity(input.city ?? null);
  const variant = input.variant ?? null;
  const vehicleType = input.vehicleType ?? vehicleTypeFor(make, input.model);
  const visualKey = visualKeyFor({ year: input.year, make, model: input.model, variant });
  if (input.driverId && !db.prepare("SELECT 1 FROM drivers WHERE id = ?").get(input.driverId)) {
    const error = new Error("Driver not found.");
    error.code = "DRIVER_NOT_FOUND";
    throw error;
  }
  db.prepare(`
    INSERT INTO vehicles (
      id, plate, make, model, year, variant, vehicle_type, visual_key,
      driver_id, driver_name, status, speed, mileage, fuel, city, province, area,
      lat, lng, heading, last_seen, last_service_mileage, service_interval,
      geofence_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.id, input.plate, make, input.model, input.year ?? null, variant,
    vehicleType, visualKey, input.status ?? "offline", input.speed ?? 0,
    input.mileage ?? 0, input.fuel ?? null, city, input.province ?? null,
    input.area ?? null, input.lat ?? null, input.lng ?? null, input.heading ?? null,
    input.lastSeen ?? now, input.lastServiceMileage ?? 0, input.serviceInterval ?? 15000,
    input.geofenceStatus ?? "inside", now, now,
  );
  if (input.driverId) {
    assignVehicle(input.driverId, input.id, { preferredLegacy: true });
  }
  return findVehicle(input.id);
}

export function updateVehicle(id, input) {
  const current = findVehicle(id);
  if (!current) return null;
  const next = { ...current, ...input, id };
  next.make = canonicalMake(next.make);
  next.city = canonicalCity(next.city);
  next.variant = next.variant ?? null;
  next.vehicleType = input.vehicleType ?? vehicleTypeFor(next.make, next.model);
  next.visualKey = visualKeyFor(next);
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE vehicles SET plate = ?, make = ?, model = ?, year = ?, variant = ?,
      vehicle_type = ?, visual_key = ?, status = ?, speed = ?, mileage = ?,
      fuel = ?, city = ?, province = ?, area = ?, lat = ?, lng = ?, heading = ?,
      last_seen = ?, last_service_mileage = ?, service_interval = ?,
      geofence_status = ?, updated_at = ?
    WHERE id = ?
  `).run(
    next.plate, next.make, next.model, next.year ?? null, next.variant,
    next.vehicleType, next.visualKey, next.status, next.speed, next.mileage,
    next.fuel ?? null, next.city ?? null, next.province ?? null, next.area ?? null,
    next.lat ?? null, next.lng ?? null, next.heading ?? null, next.lastSeen,
    next.lastServiceMileage, next.serviceInterval, next.geofenceStatus ?? "inside",
    now, id,
  );

  if (Object.hasOwn(input, "driverId")) {
    const projectedDriverId = current.driverId;
    if (input.driverId === null) {
      if (projectedDriverId && isDriverAssignedToVehicle(projectedDriverId, id)) {
        unassignVehicle(projectedDriverId, id);
      } else {
        syncLegacyAssignmentProjection(id);
      }
    } else {
      if (!isDriverAssignedToVehicle(input.driverId, id)) {
        assignVehicle(input.driverId, id, { preferredLegacy: true });
      } else {
        syncLegacyAssignmentProjection(id, input.driverId);
      }
    }
  }
  return findVehicle(id);
}

export function deleteVehicle(id) {
  return db.prepare("DELETE FROM vehicles WHERE id = ?").run(id).changes > 0;
}

export function recordTelemetry(id, input) {
  const vehicle = findVehicle(id);
  if (!vehicle) return null;
  if (input.heading !== undefined && input.heading !== null && !isValidHeading(input.heading)) {
    const error = new Error("Heading must be a finite number between 0 and less than 360.");
    error.code = "INVALID_HEADING";
    throw error;
  }
  const previous = db.prepare(`
    SELECT lat, lng, heading FROM telemetry
    WHERE vehicle_id = ? ORDER BY recorded_at DESC, id DESC LIMIT 1
  `).get(id);
  const derivedHeading = calculateBearing(previous, { lat: input.lat, lng: input.lng });
  const heading = input.heading ?? derivedHeading
    ?? (isValidHeading(previous?.heading) ? previous.heading : null)
    ?? (isValidHeading(vehicle.heading) ? vehicle.heading : null);
  const recordedAt = input.recordedAt || new Date().toISOString();
  const point = {
    lat: input.lat,
    lng: input.lng,
    speed: input.speed,
    heading,
    mileage: input.mileage ?? vehicle.mileage,
    fuel: input.fuel ?? vehicle.fuel,
    geofenceStatus: input.geofenceStatus ?? vehicle.geofenceStatus ?? "inside",
    recordedAt,
  };

  db.exec("BEGIN");
  try {
    const result = db.prepare(`
      INSERT INTO telemetry (vehicle_id, lat, lng, speed, heading, mileage, fuel, geofence_status, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, point.lat, point.lng, point.speed, point.heading, point.mileage, point.fuel, point.geofenceStatus, point.recordedAt);
    const geofenceStates = evaluateVehicleGeofences(id, point.lat, point.lng, point.recordedAt);
    const geofenceStatus = geofenceStates.length
      ? (geofenceStates.some((item) => item.state === "inside") ? "inside" : "outside")
      : point.geofenceStatus;
    db.prepare(`
      UPDATE vehicles SET lat = ?, lng = ?, speed = ?, heading = ?, mileage = ?,
        fuel = ?, status = ?, geofence_status = ?, last_seen = ?, updated_at = ?
      WHERE id = ?
    `).run(
      point.lat, point.lng, point.speed, point.heading, point.mileage, point.fuel,
      point.speed > 0 ? "moving" : "stationary", geofenceStatus,
      point.recordedAt, point.recordedAt, id,
    );

    const alertInsert = db.prepare("INSERT INTO alerts (vehicle_id, type, severity, message, state, recorded_at) VALUES (?, ?, ?, ?, 'open', ?)");
    if (point.speed >= 80) insertRuleAlert(alertInsert, id, "overspeed", "critical", `Speed reached ${Math.round(point.speed)} km/h.`, point.recordedAt);
    if (point.fuel !== null && point.fuel <= 15) insertRuleAlert(alertInsert, id, "low_fuel", "warning", `Fuel level dropped to ${Math.round(point.fuel)}%.`, point.recordedAt);
    const historyLimit = positiveInteger(process.env.TELEMETRY_HISTORY_RETENTION_POINTS, 5000, 100, 100_000);
    db.prepare(`
      DELETE FROM telemetry WHERE vehicle_id = ? AND id NOT IN (
        SELECT id FROM telemetry WHERE vehicle_id = ? ORDER BY recorded_at DESC LIMIT ?
      )
    `).run(id, id, historyLimit);
    db.exec("COMMIT");
    return mapTelemetry({
      id: Number(result.lastInsertRowid), vehicle_id: id, ...point,
      geofence_status: geofenceStatus, recorded_at: point.recordedAt,
    });
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getVehicleHistory(id, limit = 100) {
  return db.prepare(`
    SELECT id, vehicle_id, lat, lng, speed, heading, mileage, fuel,
      geofence_status, recorded_at
    FROM telemetry WHERE vehicle_id = ? ORDER BY recorded_at DESC, id DESC LIMIT ?
  `).all(id, limit).reverse().map(mapTelemetry);
}
