import { config as loadEnvironment } from "dotenv";
import { readDemoSimulationConfig } from "../services/demoSimulationConfig.js";
import { startDemoFleetSimulator, stopDemoFleetSimulator } from "../services/demoFleetSimulator.js";

loadEnvironment({ quiet: true });

const config = readDemoSimulationConfig({
  ...process.env,
  DEMO_SIMULATION_ENABLED: "true",
  DEMO_SIMULATION_INTERVAL_MS: process.env.DEMO_SIMULATION_INTERVAL_MS || process.env.SIMULATOR_INTERVAL_MS,
  DEMO_SIMULATION_TOKEN: process.env.DEMO_SIMULATION_TOKEN || process.env.SIMULATOR_TOKEN,
});
const baseUrl = (process.env.API_BASE_URL || "http://localhost:3001/api").replace(/\/+$/, "");

const status = await startDemoFleetSimulator({ config, baseUrl });
if (!status.running) {
  console.error(status.error || "Demo simulator did not start.");
  process.exitCode = 1;
} else {
  const shutdown = () => {
    stopDemoFleetSimulator();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
