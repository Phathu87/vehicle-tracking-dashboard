import { randomUUID } from "node:crypto";
import { db } from "../database.js";

function distanceMeters(a, b) {
  const toRadians = (value) => value * Math.PI / 180;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const dLat = lat2 - lat1;
  const dLng = toRadians(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].lng; const yi = polygon[i].lat;
    const xj = polygon[j].lng; const yj = polygon[j].lat;
    const intersects = ((yi > point.lat) !== (yj > point.lat)) && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function mapGeofence(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    shapeType: row.shape_type,
    center: row.shape_type === "circle" ? { lat: row.center_lat, lng: row.center_lng } : null,
    radiusMeters: row.radius_m,
    polygon: row.polygon_json ? JSON.parse(row.polygon_json) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function contains(row, point) {
  if (row.shape_type === "circle") return distanceMeters(point, { lat: row.center_lat, lng: row.center_lng }) <= row.radius_m;
  return pointInPolygon(point, JSON.parse(row.polygon_json));
}

export function listGeofences() {
  return db.prepare("SELECT * FROM geofences ORDER BY name").all().map(mapGeofence);
}

export function findGeofence(id) {
  return mapGeofence(db.prepare("SELECT * FROM geofences WHERE id = ?").get(id));
}

export function createGeofence(input) {
  const id = input.id || `GF-${randomUUID().slice(0, 8).toUpperCase()}`;
  const now = new Date().toISOString();
  db.prepare("INSERT INTO geofences (id, name, shape_type, center_lat, center_lng, radius_m, polygon_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, input.name, input.shapeType, input.center?.lat ?? null, input.center?.lng ?? null, input.radiusMeters ?? null, input.polygon ? JSON.stringify(input.polygon) : null, now, now);
  return findGeofence(id);
}

export function updateGeofence(id, input) {
  const current = findGeofence(id);
  if (!current) return null;
  const next = { ...current, ...input, center: input.center ?? current.center, polygon: input.polygon ?? current.polygon };
  db.prepare("UPDATE geofences SET name = ?, shape_type = ?, center_lat = ?, center_lng = ?, radius_m = ?, polygon_json = ?, updated_at = ? WHERE id = ?")
    .run(next.name, next.shapeType, next.center?.lat ?? null, next.center?.lng ?? null, next.radiusMeters ?? null, next.polygon ? JSON.stringify(next.polygon) : null, new Date().toISOString(), id);
  return findGeofence(id);
}

export function deleteGeofence(id) {
  return db.prepare("DELETE FROM geofences WHERE id = ?").run(id).changes > 0;
}

function evaluate(row, vehicle, checkedAt, { emitTransition = false } = {}) {
  const state = contains(row, vehicle) ? "inside" : "outside";
  const previous = db.prepare("SELECT state FROM geofence_vehicle_states WHERE geofence_id = ? AND vehicle_id = ?").get(row.id, vehicle.id);
  db.prepare(`
    INSERT INTO geofence_vehicle_states (geofence_id, vehicle_id, state, checked_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(geofence_id, vehicle_id) DO UPDATE SET state = excluded.state, checked_at = excluded.checked_at
  `).run(row.id, vehicle.id, state, checkedAt);
  if (emitTransition && previous && previous.state !== state) {
    const type = state === "inside" ? "geofence_entry" : "geofence_exit";
    db.prepare("INSERT INTO alerts (vehicle_id, type, severity, message, state, recorded_at) VALUES (?, ?, 'warning', ?, 'open', ?)")
      .run(vehicle.id, type, `${vehicle.id} ${state === "inside" ? "entered" : "exited"} ${row.name}.`, checkedAt);
  }
  return { geofenceId: row.id, geofenceName: row.name, vehicleId: vehicle.id, plate: vehicle.plate, driver: vehicle.driver_name, state, checkedAt };
}

export function checkGeofence(id, vehicleId) {
  const geofence = db.prepare("SELECT * FROM geofences WHERE id = ?").get(id);
  if (!geofence) return null;
  const vehicles = vehicleId
    ? db.prepare("SELECT id, plate, driver_name, lat, lng FROM vehicles WHERE id = ?").all(vehicleId)
    : db.prepare("SELECT id, plate, driver_name, lat, lng FROM vehicles ORDER BY id").all();
  return { geofence: mapGeofence(geofence), states: vehicles.filter((vehicle) => Number.isFinite(vehicle.lat) && Number.isFinite(vehicle.lng)).map((vehicle) => evaluate(geofence, vehicle, new Date().toISOString())) };
}

export function evaluateVehicleGeofences(vehicleId, lat, lng, recordedAt) {
  const vehicle = db.prepare("SELECT id, plate, driver_name FROM vehicles WHERE id = ?").get(vehicleId);
  const geofences = db.prepare("SELECT * FROM geofences ORDER BY name").all();
  if (!vehicle || !geofences.length) return [];
  return geofences.map((geofence) => evaluate(geofence, { ...vehicle, lat, lng }, recordedAt, { emitTransition: true }));
}
