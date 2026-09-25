const SCENARIOS = new Set(["NORMAL_FLEET", "ALERT_DEMO", "GEOFENCE_DEMO"]);

function positiveNumber(value, fallback, { min, max, integer = false }) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback;
  return integer ? Math.floor(parsed) : parsed;
}

export function readDemoSimulationConfig(environment = process.env) {
  const scenario = String(environment.DEMO_SIMULATION_SCENARIO || "NORMAL_FLEET").toUpperCase();
  return {
    enabled: String(environment.DEMO_SIMULATION_ENABLED || "").toLowerCase() === "true",
    intervalMs: positiveNumber(environment.DEMO_SIMULATION_INTERVAL_MS, 10_000, { min: 1_000, max: 3_600_000, integer: true }),
    vehicleLimit: positiveNumber(environment.DEMO_SIMULATION_VEHICLE_LIMIT, 15, { min: 1, max: 100, integer: true }),
    speedMultiplier: positiveNumber(environment.DEMO_SIMULATION_SPEED_MULTIPLIER, 1, { min: 0.1, max: 20 }),
    seed: String(environment.DEMO_SIMULATION_SEED || "fleet-drive-demo"),
    scenario: SCENARIOS.has(scenario) ? scenario : "NORMAL_FLEET",
    token: String(environment.DEMO_SIMULATION_TOKEN || environment.SIMULATOR_TOKEN || "").trim(),
  };
}
