import { checkGeofence, createGeofence, deleteGeofence, findGeofence, listGeofences, updateGeofence } from "../services/geofenceService.js";

function apiError(res, status, code, message, details = {}) {
  return res.status(status).json({ error: { code, message, details } });
}

function validPoint(point) {
  return point && typeof point.lat === "number" && Number.isFinite(point.lat) && point.lat >= -90 && point.lat <= 90 && typeof point.lng === "number" && Number.isFinite(point.lng) && point.lng >= -180 && point.lng <= 180;
}

function validate(body, { partial = false } = {}) {
  const details = {};
  if (!partial && (typeof body?.name !== "string" || !body.name.trim())) details.name = "Required.";
  if (body?.name !== undefined && (typeof body.name !== "string" || !body.name.trim())) details.name = "Must be a non-empty string.";
  if (!partial && !["circle", "polygon"].includes(body?.shapeType)) details.shapeType = "Must be circle or polygon.";
  if (body?.shapeType !== undefined && !["circle", "polygon"].includes(body.shapeType)) details.shapeType = "Must be circle or polygon.";
  const shape = body?.shapeType;
  if (shape === "circle") {
    if (!validPoint(body.center)) details.center = "A valid center is required.";
    if (typeof body.radiusMeters !== "number" || !Number.isFinite(body.radiusMeters) || body.radiusMeters <= 0) details.radiusMeters = "Must be a positive number.";
  }
  if (shape === "polygon" && (!Array.isArray(body.polygon) || body.polygon.length < 3 || body.polygon.some((point) => !validPoint(point)))) details.polygon = "At least three valid points are required.";
  return details;
}

export function index(req, res) { return res.json(listGeofences()); }
export function show(req, res) { const item = findGeofence(req.params.id); return item ? res.json(item) : apiError(res, 404, "GEOFENCE_NOT_FOUND", "Geofence not found."); }

export function create(req, res, next) {
  const details = validate(req.body);
  if (Object.keys(details).length) return apiError(res, 400, "VALIDATION_ERROR", "Geofence details are invalid.", details);
  try { return res.status(201).json(createGeofence(req.body)); }
  catch (error) { if (error.code?.startsWith("ERR_SQLITE_CONSTRAINT")) return apiError(res, 409, "GEOFENCE_EXISTS", "A geofence with that name already exists."); return next(error); }
}

export function update(req, res, next) {
  const current = findGeofence(req.params.id);
  if (!current) return apiError(res, 404, "GEOFENCE_NOT_FOUND", "Geofence not found.");
  const details = validate({ ...current, ...req.body });
  if (Object.keys(details).length) return apiError(res, 400, "VALIDATION_ERROR", "Geofence details are invalid.", details);
  try { return res.json(updateGeofence(req.params.id, req.body)); }
  catch (error) { if (error.code?.startsWith("ERR_SQLITE_CONSTRAINT")) return apiError(res, 409, "GEOFENCE_EXISTS", "A geofence with that name already exists."); return next(error); }
}

export function remove(req, res) { return deleteGeofence(req.params.id) ? res.status(204).end() : apiError(res, 404, "GEOFENCE_NOT_FOUND", "Geofence not found."); }
export function check(req, res) { const result = checkGeofence(req.params.id, req.query.vehicleId); if (!result) return apiError(res, 404, "GEOFENCE_NOT_FOUND", "Geofence not found."); if (req.query.vehicleId && !result.states.length) return apiError(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found or has no position."); return res.json(result); }
