import { optimizeStops } from "../services/routeService.js";

export function optimize(req, res) {
  const stops = req.body?.stops;
  if (!Array.isArray(stops) || stops.length < 2 || stops.some((stop) => typeof stop?.lat !== "number" || !Number.isFinite(stop.lat) || stop.lat < -90 || stop.lat > 90 || typeof stop?.lng !== "number" || !Number.isFinite(stop.lng) || stop.lng < -180 || stop.lng > 180)) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "At least two valid coordinate stops are required.", details: { stops: "Invalid stops." } } });
  }
  return res.json(optimizeStops(stops));
}
