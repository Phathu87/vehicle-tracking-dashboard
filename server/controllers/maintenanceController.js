import { completeMaintenance, createMaintenance, deleteMaintenance, listMaintenance, listVehicleMaintenance, updateMaintenance } from "../services/maintenanceService.js";
import { findVehicle } from "../services/vehicleService.js";

function apiError(res, status, code, message, details = {}) {
  return res.status(status).json({ error: { code, message, details } });
}

function validTask(body, { partial = false } = {}) {
  const details = {};
  if (!partial && (typeof body?.type !== "string" || !body.type.trim())) details.type = "Required.";
  if (body?.type !== undefined && (typeof body.type !== "string" || !body.type.trim())) details.type = "Must be a non-empty string.";
  if (body?.dueMileage !== undefined && (typeof body.dueMileage !== "number" || body.dueMileage < 0)) details.dueMileage = "Must be a non-negative number.";
  if (body?.dueDate !== undefined && body.dueDate !== null && Number.isNaN(Date.parse(body.dueDate))) details.dueDate = "Must be a valid date.";
  return details;
}

export function index(req, res) {
  return res.json(listMaintenance(req.query));
}

export function vehicleIndex(req, res) {
  if (!findVehicle(req.params.id)) return apiError(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
  return res.json({ vehicleId: req.params.id, tasks: listVehicleMaintenance(req.params.id) });
}

export function create(req, res) {
  const details = validTask(req.body);
  if (Object.keys(details).length) return apiError(res, 400, "VALIDATION_ERROR", "Maintenance details are invalid.", details);
  const task = createMaintenance(req.params.id, req.body);
  return task ? res.status(201).json(task) : apiError(res, 404, "VEHICLE_NOT_FOUND", "Vehicle not found.");
}

export function update(req, res) {
  const details = validTask(req.body, { partial: true });
  if (Object.keys(details).length) return apiError(res, 400, "VALIDATION_ERROR", "Maintenance details are invalid.", details);
  const task = updateMaintenance(req.params.id, Number(req.params.taskId), req.body || {});
  return task ? res.json(task) : apiError(res, 404, "MAINTENANCE_NOT_FOUND", "Maintenance task not found.");
}

export function complete(req, res) {
  if (req.body?.mileage !== undefined && (typeof req.body.mileage !== "number" || req.body.mileage < 0)) return apiError(res, 400, "VALIDATION_ERROR", "Completion mileage is invalid.", { mileage: "Must be a non-negative number." });
  const task = completeMaintenance(req.params.id, Number(req.params.taskId), req.body?.mileage);
  return task ? res.json(task) : apiError(res, 404, "MAINTENANCE_NOT_FOUND", "Maintenance task not found.");
}

export function remove(req, res) {
  return deleteMaintenance(req.params.id, Number(req.params.taskId)) ? res.status(204).end() : apiError(res, 404, "MAINTENANCE_NOT_FOUND", "Maintenance task not found.");
}
