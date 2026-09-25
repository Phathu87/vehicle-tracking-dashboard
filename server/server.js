import { config } from "dotenv";
import { pathToFileURL } from "node:url";
import app from "./app.js";
import { assertAuthConfig } from "./services/tokenService.js";
import { readDemoSimulationConfig } from "./services/demoSimulationConfig.js";
import { startDemoFleetSimulator, stopDemoFleetSimulator } from "./services/demoFleetSimulator.js";

config({ quiet: true });

export const DEFAULT_PORT = 3001;

export function resolvePort(value = process.env.PORT) {
  if (value === undefined || value === "") return DEFAULT_PORT;

  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new TypeError("PORT must be an integer between 0 and 65535");
  }

  return port;
}

export function startServer({ port = resolvePort(), logger = console } = {}) {
  assertAuthConfig();
  const server = app.listen(port, () => {
    const address = server.address();
    const activePort = typeof address === "object" && address ? address.port : port;
    logger.info(`Server running on port ${activePort}`);
    const simulationConfig = readDemoSimulationConfig();
    startDemoFleetSimulator({
      config: simulationConfig,
      baseUrl: `http://127.0.0.1:${activePort}/api`,
      logger,
    }).catch((error) => logger.warn(`Demo simulator could not start: ${error.message}`));
  });

  server.on("close", () => stopDemoFleetSimulator());

  return server;
}

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (entryUrl === import.meta.url) {
  startServer();
}
