import { maintenanceReport, tripReport } from "../services/reportService.js";

function notFound(res) { return res.status(404).json({ error: { code: "VEHICLE_NOT_FOUND", message: "Vehicle not found.", details: {} } }); }
export function maintenance(req, res) { const report = maintenanceReport(req.params.vehicleId); return report ? res.json(report) : notFound(res); }
export function trips(req, res) { const report = tripReport(req.params.vehicleId); return report ? res.json(report) : notFound(res); }
