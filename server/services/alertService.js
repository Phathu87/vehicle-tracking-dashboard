import { db } from "../database.js";

export const SUPPORTED_ALERT_TYPES = ["overspeed", "low_fuel", "geofence_entry", "geofence_exit"];

export function listAlerts({ severity, type, state, vehicleId } = {}) {
  const clauses = [];
  const values = [];
  if (severity) { clauses.push("a.severity = ?"); values.push(severity); }
  if (type) { clauses.push("a.type = ?"); values.push(type); }
  if (state) { clauses.push("a.state = ?"); values.push(state); }
  if (vehicleId) { clauses.push("a.vehicle_id = ?"); values.push(vehicleId); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db.prepare(`
    SELECT a.id, a.vehicle_id, a.type, a.severity, a.message, a.state, a.recorded_at,
      v.plate, d.id AS current_driver_id, d.name AS current_driver_name
    FROM alerts a
    JOIN vehicles v ON v.id = a.vehicle_id
    LEFT JOIN driver_current_vehicles c ON c.vehicle_id = v.id
    LEFT JOIN drivers d ON d.id = c.driver_id
    ${where} ORDER BY a.recorded_at DESC LIMIT 500
  `).all(...values).map((row) => ({
    id: row.id,
    vehicleId: row.vehicle_id,
    plate: row.plate,
    driverId: row.current_driver_id ?? null,
    driver: row.current_driver_name ?? null,
    type: row.type,
    severity: row.severity,
    message: row.message,
    state: row.state,
    recordedAt: row.recorded_at,
  }));
}
