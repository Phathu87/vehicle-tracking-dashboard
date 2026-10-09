import {
  createVehicle, deleteVehicle, findVehicle, findVehicleDetail, getVehicleHistory,
  listVehicles, recordTelemetry, updateVehicle,
} from "../services/vehicleService.js";

function error(res, status, code, message, details = {}) {
  return res.status(status).json({ error: { code, message, details } });
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

const VEHICLE_STATUSES = new Set(["online", "moving", "stationary", "idle", "offline", "maintenance"]);

function vehicleValidation(body, { creating = false } = {}) {
  const details = {};
  if (creating) {
    for (const key of ["id", "plate", "make", "model"]) {
      if (typeof body?.[key] !== "string" || !body[key].trim()) details[key] = "Required.";
    }
  }
  for (const key of ["id", "plate", "make", "model", "variant", "vehicleType", "city", "province", "area", "driverId", "driver"]) {
    if (body?.[key] !== undefined && body[key] !== null && (typeof body[key] !== "string" || body[key].trim().length > 120)) details[key] = "Must be a string of at most 120 characters.";
  }
  if (creating && typeof body?.id === "string" && !/^VH-[A-Z0-9-]+$/.test(body.id)) details.id = "Must be a valid vehicle ID.";
  if (body?.driverId !== undefined && body.driverId !== null && typeof body.driverId === "string" && !/^DRV-[A-Z0-9-]+$/.test(body.driverId)) details.driverId = "Must be a valid driver ID.";
  if (body?.year !== undefined && body.year !== null && (!Number.isInteger(body.year) || body.year < 1900 || body.year > new Date().getUTCFullYear() + 2)) details.year = "Must be a valid vehicle year.";
  if (body?.status !== undefined && !VEHICLE_STATUSES.has(String(body.status).toLowerCase())) details.status = "Must be a supported vehicle status.";
  for (const key of ["speed", "mileage", "lastServiceMileage"]) {
    if (body?.[key] !== undefined && (!finiteNumber(body[key]) || body[key] < 0)) details[key] = "Must be a non-negative number.";
  }
  if (body?.serviceInterval !== undefined && (!finiteNumber(body.serviceInterval) || body.serviceInterval <= 0)) details.serviceInterval = "Must be a positive number.";
  if (body?.fuel !== undefined && body.fuel !== null && (!finiteNumber(body.fuel) || body.fuel < 0 || body.fuel > 100)) details.fuel = "Must be between 0 and 100.";
  if (body?.lat !== undefined && body.lat !== null && (!finiteNumber(body.lat) || body.lat < -90 || body.lat > 90)) details.lat = "Must be a latitude between -90 and 90.";
  if (body?.lng !== undefined && body.lng !== null && (!finiteNumber(body.lng) || body.lng < -180 || body.lng > 180)) details.lng = "Must be a longitude between -180 and 180.";
  if (body?.heading !== undefined && body.heading !== null && (!finiteNumber(body.heading) || body.heading < 0 || body.heading >= 360)) details.heading = "Must be between 0 and less than 360.";
  if (body?.lastSeen !== undefined && Number.isNaN(Date.parse(body.lastSeen))) details.lastSeen = "Must be a valid timestamp.";
  if (body?.geofenceStatus !== undefined && !["inside", "outside", "unknown"].includes(body.geofenceStatus)) details.geofenceStatus = "Must be inside, outside, or unknown.";
  return details;
}

export function index(req, res) {
  return res.json(listVehicles(req.query));
}

export function show(req, res) {
  const vehicle = findVehicleDetail(req.params.id);
  return vehicle ? res.json(vehicle) : error(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
}

export function create(req, res, next) {
  const details = vehicleValidation(req.body, { creating: true });
  if (Object.keys(details).length) return error(res, 400, "VALIDATION_ERROR", "Vehicle details are invalid.", details);
  try {
    return res.status(201).json(createVehicle(req.body));
  } catch (caught) {
    if (caught.code === "DRIVER_NOT_FOUND") return error(res, 404, caught.code, caught.message);
    if (caught.code === "ERR_SQLITE_CONSTRAINT_PRIMARYKEY" || caught.code === "ERR_SQLITE_CONSTRAINT_UNIQUE") {
      return error(res, 409, "VEHICLE_EXISTS", "A vehicle with that ID or plate already exists.");
    }
    return next(caught);
  }
}

export function update(req, res, next) {
  const details = vehicleValidation(req.body || {});
  if (Object.keys(details).length) return error(res, 400, "VALIDATION_ERROR", "Vehicle details are invalid.", details);
  try {
    const vehicle = updateVehicle(req.params.id, req.body || {});
    return vehicle ? res.json(vehicle) : error(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
  } catch (caught) {
    if (caught.code === "DRIVER_NOT_FOUND" || caught.code === "VEHICLE_NOT_FOUND") return error(res, 404, caught.code, caught.message);
    if (caught.code === "INVALID_DRIVER_ID" || caught.code === "INVALID_VEHICLE_ID") return error(res, 400, caught.code, caught.message);
    if (caught.code === "ERR_SQLITE_CONSTRAINT_UNIQUE") return error(res, 409, "VEHICLE_EXISTS", "That plate is already assigned.");
    return next(caught);
  }
}

export function remove(req, res) {
  return deleteVehicle(req.params.id) ? res.status(204).end() : error(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
}

export function telemetry(req, res, next) {
  const { lat, lng, speed, heading, mileage, fuel, geofenceStatus, recordedAt } = req.body || {};
  const details = {};
  if (!finiteNumber(lat) || lat < -90 || lat > 90) details.lat = "Must be a latitude between -90 and 90.";
  if (!finiteNumber(lng) || lng < -180 || lng > 180) details.lng = "Must be a longitude between -180 and 180.";
  if (!finiteNumber(speed) || speed < 0) details.speed = "Must be a non-negative number.";
  if (mileage !== undefined && (!finiteNumber(mileage) || mileage < 0)) details.mileage = "Must be a non-negative number.";
  if (fuel !== undefined && (!finiteNumber(fuel) || fuel < 0 || fuel > 100)) details.fuel = "Must be between 0 and 100.";
  if (heading !== undefined && heading !== null && (!finiteNumber(heading) || heading < 0 || heading >= 360)) details.heading = "Must be between 0 and less than 360.";
  if (geofenceStatus !== undefined && !["inside", "outside", "unknown"].includes(geofenceStatus)) details.geofenceStatus = "Must be inside, outside, or unknown.";
  if (recordedAt !== undefined && Number.isNaN(Date.parse(recordedAt))) details.recordedAt = "Must be a valid timestamp.";
  if (Object.keys(details).length) return error(res, 400, "VALIDATION_ERROR", "Telemetry is invalid.", details);
  const current = findVehicle(req.params.id);
  if (current && mileage !== undefined && mileage < current.mileage) {
    return error(res, 409, "MILEAGE_REGRESSION", "Telemetry mileage cannot be lower than the current vehicle mileage.", { mileage: "Must not decrease." });
  }
  try {
    const point = recordTelemetry(req.params.id, req.body);
    return point ? res.status(201).json({ vehicleId: req.params.id, telemetry: point }) : error(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
  } catch (caught) {
    return next(caught);
  }
}

export function status(req, res) {
  const vehicle = findVehicle(req.params.id);
  if (!vehicle) return error(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
  return res.json({ vehicleId: vehicle.id, status: vehicle.status, speed: vehicle.speed, heading: vehicle.heading, mileage: vehicle.mileage, fuel: vehicle.fuel, lat: vehicle.lat, lng: vehicle.lng, geofenceStatus: vehicle.geofenceStatus, lastSeen: vehicle.lastSeen });
}

export function history(req, res) {
  if (!findVehicle(req.params.id)) return error(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
  const parsed = Number.parseInt(req.query.limit, 10);
  const limit = Number.isInteger(parsed) ? Math.min(Math.max(parsed, 1), 500) : 100;
  return res.json({ vehicleId: req.params.id, history: getVehicleHistory(req.params.id, limit) });
}
