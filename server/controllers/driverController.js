import {
  assignVehicles, createDriver, deleteDriver, findDriver, listDrivers,
  removeCurrentVehicle, updateCurrentVehicle, updateDriver,
} from "../services/driverService.js";

function apiError(res, status, code, message, details = {}) {
  return res.status(status).json({ error: { code, message, details } });
}

function validation(body, { creating = false } = {}) {
  const details = {};
  for (const field of creating ? ["id", "name", "licenceNumber", "licenceExpiry"] : []) {
    if (typeof body?.[field] !== "string" || !body[field].trim()) details[field] = "Required.";
  }
  if (body?.licenceExpiry !== undefined && Number.isNaN(Date.parse(body.licenceExpiry))) details.licenceExpiry = "Must be a valid date.";
  if (body?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) details.email = "Must be a valid email address.";
  return details;
}

export function index(req, res) {
  return res.json(listDrivers(req.query));
}

export function show(req, res) {
  const driver = findDriver(req.params.id);
  return driver ? res.json(driver) : apiError(res, 404, "DRIVER_NOT_FOUND", "Driver not found.");
}

export function create(req, res, next) {
  const details = validation(req.body, { creating: true });
  if (Object.keys(details).length) return apiError(res, 400, "VALIDATION_ERROR", "Driver details are invalid.", details);
  try {
    return res.status(201).json(createDriver(req.body));
  } catch (error) {
    if (error.code?.startsWith("ERR_SQLITE_CONSTRAINT")) return apiError(res, 409, "DRIVER_EXISTS", "A driver with that ID or licence already exists.");
    return next(error);
  }
}

export function update(req, res, next) {
  const details = validation(req.body);
  if (Object.keys(details).length) return apiError(res, 400, "VALIDATION_ERROR", "Driver details are invalid.", details);
  try {
    const driver = updateDriver(req.params.id, req.body || {});
    return driver ? res.json(driver) : apiError(res, 404, "DRIVER_NOT_FOUND", "Driver not found.");
  } catch (error) {
    if (error.code?.startsWith("ERR_SQLITE_CONSTRAINT")) return apiError(res, 409, "DRIVER_EXISTS", "That licence is already assigned.");
    return next(error);
  }
}

export function remove(req, res) {
  const result = deleteDriver(req.params.id);
  if (result.assigned) return apiError(res, 409, "DRIVER_ASSIGNED", "Unassign this driver's vehicles before deletion.");
  return result.deleted ? res.status(204).end() : apiError(res, 404, "DRIVER_NOT_FOUND", "Driver not found.");
}

export function assignments(req, res, next) {
  if (!Array.isArray(req.body?.vehicleIds) || req.body.vehicleIds.some((id) => typeof id !== "string")) {
    return apiError(res, 400, "VALIDATION_ERROR", "vehicleIds must be an array of vehicle IDs.", { vehicleIds: "Invalid value." });
  }
  try {
    const driver = assignVehicles(req.params.id, req.body.vehicleIds);
    return driver ? res.json(driver) : apiError(res, 404, "DRIVER_NOT_FOUND", "Driver not found.");
  } catch (error) {
    if (error.code === "VEHICLE_NOT_FOUND") return apiError(res, 404, error.code, error.message, { vehicleIds: error.missing });
    if (error.code === "INVALID_DRIVER_ID" || error.code === "INVALID_VEHICLE_ID") {
      return apiError(res, 400, error.code, error.message);
    }
    return next(error);
  }
}

export function currentVehicle(req, res, next) {
  if (typeof req.body?.vehicleId !== "string" || !req.body.vehicleId.trim()) {
    return apiError(res, 400, "VALIDATION_ERROR", "vehicleId is required.", { vehicleId: "Required." });
  }
  try {
    return res.json(updateCurrentVehicle(req.params.id, req.body.vehicleId));
  } catch (error) {
    if (error.code === "INVALID_DRIVER_ID" || error.code === "INVALID_VEHICLE_ID") {
      return apiError(res, 400, error.code, error.message);
    }
    if (error.code === "DRIVER_NOT_FOUND" || error.code === "VEHICLE_NOT_FOUND") {
      return apiError(res, 404, error.code, error.message);
    }
    if (error.code === "CURRENT_VEHICLE_NOT_ASSIGNED" || error.code === "VEHICLE_ALREADY_CURRENT") {
      return apiError(res, 409, error.code, error.message, {
        currentDriverId: error.currentDriverId,
      });
    }
    return next(error);
  }
}

export function clearCurrent(req, res, next) {
  try {
    return res.json(removeCurrentVehicle(req.params.id));
  } catch (error) {
    if (error.code === "INVALID_DRIVER_ID") return apiError(res, 400, error.code, error.message);
    if (error.code === "DRIVER_NOT_FOUND") return apiError(res, 404, error.code, error.message);
    return next(error);
  }
}
