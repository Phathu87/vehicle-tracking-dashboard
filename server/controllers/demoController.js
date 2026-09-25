import { getDemoSimulationStatus } from "../services/demoFleetSimulator.js";

export function status(req, res) {
  return res.json(getDemoSimulationStatus());
}
