import { listAlerts, SUPPORTED_ALERT_TYPES } from "../services/alertService.js";

export function index(req, res) {
  return res.json(listAlerts(req.query));
}

export function types(req, res) {
  return res.json({ types: SUPPORTED_ALERT_TYPES });
}
