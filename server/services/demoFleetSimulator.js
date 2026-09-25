import { readDemoSimulationConfig } from "./demoSimulationConfig.js";

const EARTH_RADIUS_KM = 6371;
const CITY_ROUTES = {
  Johannesburg: [[-26.2041, 28.0473], [-26.1951, 28.0566], [-26.1878, 28.0436], [-26.1989, 28.0314]],
  Sandton: [[-26.1076, 28.0567], [-26.1012, 28.0669], [-26.0948, 28.0551], [-26.1027, 28.0444]],
  Randburg: [[-26.0936, 27.9977], [-26.0871, 28.0078], [-26.0788, 27.9984], [-26.0866, 27.9872]],
  Midrand: [[-25.9992, 28.1263], [-25.9914, 28.1364], [-25.9832, 28.1251], [-25.9918, 28.1142]],
  Roodepoort: [[-26.1625, 27.8725], [-26.1551, 27.8831], [-26.1473, 27.8721], [-26.1557, 27.8617]],
  Soweto: [[-26.2485, 27.8540], [-26.2402, 27.8645], [-26.2321, 27.8535], [-26.2406, 27.8428]],
  "Kempton Park": [[-26.1000, 28.2293], [-26.0922, 28.2394], [-26.0844, 28.2281], [-26.0928, 28.2177]],
  Boksburg: [[-26.2326, 28.2400], [-26.2248, 28.2504], [-26.2168, 28.2392], [-26.2252, 28.2288]],
  Pretoria: [[-25.7479, 28.2293], [-25.7397, 28.2396], [-25.7318, 28.2281], [-25.7402, 28.2178]],
};
const JOHANNESBURG_GEOFENCE_ROUTE = [
  [-26.2041, 28.0650],
  [-26.2041, 28.0560],
  [-26.2041, 28.0473],
  [-26.1980, 28.0473],
  [-26.2041, 28.0300],
];
let activeSimulator = null;
let lastConfig = readDemoSimulationConfig({});
let lastError = null;

function hash(value) {
  let result = 2166136261;
  for (const character of String(value)) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function seededFraction(value) {
  let state = hash(value) + 0x6d2b79f5;
  state = Math.imul(state ^ state >>> 15, state | 1);
  state ^= state + Math.imul(state ^ state >>> 7, state | 61);
  return ((state ^ state >>> 14) >>> 0) / 4294967296;
}

function distanceKm(a, b) {
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function routeFor(vehicle, seed, scenario, index) {
  if (scenario === "GEOFENCE_DEMO" && vehicle.city === "Johannesburg") {
    return JOHANNESBURG_GEOFENCE_ROUTE.map(([lat, lng]) => ({ lat, lng }));
  }
  const predefined = CITY_ROUTES[vehicle.city];
  if (predefined) return predefined.map(([lat, lng]) => ({ lat, lng }));
  const baseRadius = scenario === "ALERT_DEMO" && index === 0 ? 0.09 : 0.009 + seededFraction(`${seed}:${vehicle.id}:radius`) * 0.01;
  const longitudeScale = Math.max(0.3, Math.cos(Number(vehicle.lat) * Math.PI / 180));
  const startAngle = seededFraction(`${seed}:${vehicle.id}:angle`) * Math.PI * 2;
  return Array.from({ length: 8 }, (_, pointIndex) => {
    const angle = startAngle + pointIndex * Math.PI / 4;
    return {
      lat: Number(vehicle.lat) + Math.cos(angle) * baseRadius,
      lng: Number(vehicle.lng) + Math.sin(angle) * baseRadius / longitudeScale,
    };
  });
}

function moveToward(current, target, travelKm) {
  const remainingKm = distanceKm(current, target);
  if (!remainingKm || travelKm >= remainingKm) return { point: target, reached: true, distanceKm: remainingKm };
  const ratio = travelKm / remainingKm;
  return {
    point: { lat: current.lat + (target.lat - current.lat) * ratio, lng: current.lng + (target.lng - current.lng) * ratio },
    reached: false,
    distanceKm: travelKm,
  };
}

export function simulationStateFor(index, tick, scenario = "NORMAL_FLEET") {
  if (index % 10 === 9 && tick % 12 >= 8) return "offline";
  if (tick % 12 === 0) return "stopped";
  if (tick % 12 <= 2) return "idle";
  if (scenario === "ALERT_DEMO" && index === 0 && tick % 6 === 3) return "overspeed";
  return "moving";
}

export function createVehicleSimulationState(vehicle, config, index = 0) {
  const route = routeFor(vehicle, config.seed, config.scenario, index);
  const initialPoint = { lat: Number(vehicle.lat), lng: Number(vehicle.lng) };
  const routeIndex = route.length > 1 && distanceKm(initialPoint, route[0]) < 0.05 ? 1 : 0;
  return {
    route,
    routeIndex,
    direction: 1,
    tick: 0,
    movementState: "stopped",
    lastUpdateTime: null,
    lat: initialPoint.lat,
    lng: initialPoint.lng,
    mileage: Math.max(0, Number(vehicle.mileage) || 0),
    fuel: Math.min(100, Math.max(0, Number(vehicle.fuel ?? 75))),
  };
}

export function nextSimulatedTelemetry(vehicle, state, config, index = 0, now = new Date()) {
  const operationalState = simulationStateFor(index, state.tick, config.scenario);
  state.tick += 1;
  state.movementState = operationalState;
  state.lastUpdateTime = now.toISOString();
  if (operationalState === "offline") return { operationalState, telemetry: null };

  let speed = 0;
  let travelledKm = 0;
  if (operationalState === "moving" || operationalState === "overspeed") {
    speed = operationalState === "overspeed"
      ? 88 + seededFraction(`${config.seed}:${vehicle.id}:${state.tick}`) * 10
      : 38 + seededFraction(`${config.seed}:${vehicle.id}:${state.tick}`) * 39;
    const requestedKm = speed * (config.intervalMs / 3_600_000) * config.speedMultiplier;
    const movement = moveToward({ lat: state.lat, lng: state.lng }, state.route[state.routeIndex], requestedKm);
    state.lat = movement.point.lat;
    state.lng = movement.point.lng;
    travelledKm = movement.distanceKm;
    if (movement.reached) {
      const nextIndex = state.routeIndex + state.direction;
      if (nextIndex >= state.route.length) {
        state.direction = -1;
        state.routeIndex = Math.max(0, state.route.length - 2);
      } else if (nextIndex < 0) {
        state.direction = 1;
        state.routeIndex = Math.min(state.route.length - 1, 1);
      } else {
        state.routeIndex = nextIndex;
      }
    }
  }

  state.mileage = Math.max(state.mileage, Number(vehicle.mileage) || 0) + travelledKm;
  state.fuel = Math.min(100, Math.max(0, state.fuel - travelledKm * 0.09 - (operationalState === "idle" ? 0.004 * config.speedMultiplier : 0)));
  if (operationalState === "stopped" && state.fuel < 20) state.fuel = Math.min(95, state.fuel + 45);

  return {
    operationalState,
    telemetry: {
      lat: Number(state.lat.toFixed(6)),
      lng: Number(state.lng.toFixed(6)),
      speed: Number(speed.toFixed(1)),
      mileage: Number(state.mileage.toFixed(3)),
      fuel: Number(state.fuel.toFixed(2)),
      recordedAt: now.toISOString(),
    },
  };
}

export function createDemoApiAdapter({ baseUrl, token, fetchImpl = fetch }) {
  const root = baseUrl.replace(/\/+$/, "");
  const headers = { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  async function request(path, options = {}) {
    const response = await fetchImpl(`${root}${path}`, { ...options, headers: { ...headers, ...options.headers } });
    if (!response.ok) throw new Error(`${options.method || "GET"} ${path} returned ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
  return {
    listVehicles: () => request("/vehicles"),
    sendTelemetry: (vehicleId, telemetry) => request(`/vehicles/${encodeURIComponent(vehicleId)}/telemetry`, { method: "POST", body: JSON.stringify(telemetry) }),
  };
}

export function selectSimulationVehicles(vehicles, limit, scenario = "NORMAL_FLEET") {
  const groups = new Map();
  vehicles
    .filter((vehicle) => Number.isFinite(Number(vehicle.lat)) && Number.isFinite(Number(vehicle.lng)))
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .forEach((vehicle) => {
      const key = vehicle.city || "Unassigned";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(vehicle);
    });
  const cities = [...groups.keys()].sort((left, right) => {
    if (scenario === "GEOFENCE_DEMO") {
      if (left === "Johannesburg") return -1;
      if (right === "Johannesburg") return 1;
    }
    return left.localeCompare(right);
  });
  const selected = [];
  while (selected.length < limit && cities.some((city) => groups.get(city).length)) {
    cities.forEach((city) => {
      if (selected.length < limit && groups.get(city).length) selected.push(groups.get(city).shift());
    });
  }
  return selected;
}

export async function startDemoFleetSimulator(options = {}) {
  if (activeSimulator) return getDemoSimulationStatus();
  const config = options.config || readDemoSimulationConfig();
  lastConfig = config;
  lastError = null;
  if (!config.enabled) return getDemoSimulationStatus();
  if (!options.adapter && !config.token) {
    lastError = "DEMO_SIMULATION_TOKEN is required when simulation is enabled.";
    options.logger?.warn?.(lastError);
    return getDemoSimulationStatus();
  }

  const adapter = options.adapter || createDemoApiAdapter({ baseUrl: options.baseUrl, token: config.token, fetchImpl: options.fetchImpl });
  const logger = options.logger || console;
  const setTimer = options.setTimer || setInterval;
  const clearTimer = options.clearTimer || clearInterval;
  const now = options.now || (() => new Date());
  const simulator = { config, adapter, logger, clearTimer, timer: null, states: new Map(), participantIds: [], offlineVehicleIds: [], lastTickAt: null, tickCount: 0, acceptedTelemetryCount: 0, inFlight: false, lastWarning: null };
  activeSimulator = simulator;

  async function tick() {
    if (simulator.inFlight) return;
    simulator.inFlight = true;
    try {
      const vehicles = selectSimulationVehicles(await adapter.listVehicles(), config.vehicleLimit, config.scenario);
      simulator.participantIds = vehicles.map((vehicle) => vehicle.id);
      simulator.offlineVehicleIds = [];
      let attempted = 0;
      let accepted = 0;
      const failures = [];
      await Promise.all(vehicles.map(async (vehicle, index) => {
        try {
          let state = simulator.states.get(vehicle.id);
          if (!state) {
            state = createVehicleSimulationState(vehicle, config, index);
            simulator.states.set(vehicle.id, state);
          }
          const next = nextSimulatedTelemetry(vehicle, state, config, index, now());
          if (!next.telemetry) {
            simulator.offlineVehicleIds.push(vehicle.id);
            return;
          }
          attempted += 1;
          await adapter.sendTelemetry(vehicle.id, next.telemetry);
          accepted += 1;
        } catch (error) {
          failures.push({ vehicleId: vehicle.id, message: error.message });
        }
      }));
      simulator.acceptedTelemetryCount += accepted;
      if (attempted > 0 && accepted === 0) lastError = "No simulated telemetry updates were accepted by the API.";
      else if (accepted > 0) lastError = null;
      if (failures.length) {
        const warning = `${failures.length} simulated telemetry update(s) failed; first ${failures[0].vehicleId}: ${failures[0].message}`;
        if (warning !== simulator.lastWarning) logger.warn?.(warning);
        simulator.lastWarning = warning;
      } else {
        simulator.lastWarning = null;
      }
      simulator.tickCount += 1;
      simulator.lastTickAt = now().toISOString();
    } catch (error) {
      lastError = error.message;
      logger.warn?.(`Demo simulator tick failed: ${error.message}`);
    } finally {
      simulator.inFlight = false;
    }
  }

  await tick();
  if (activeSimulator !== simulator) return getDemoSimulationStatus();
  simulator.timer = setTimer(() => tick(), config.intervalMs);
  logger.info?.(`Demo simulator started: ${simulator.participantIds.length} vehicles participating`);
  return getDemoSimulationStatus();
}

export function stopDemoFleetSimulator() {
  if (!activeSimulator) return getDemoSimulationStatus();
  const { clearTimer, timer, logger } = activeSimulator;
  if (timer) clearTimer(timer);
  activeSimulator = null;
  logger.info?.("Demo simulator stopped");
  return getDemoSimulationStatus();
}

export function resetDemoFleetSimulator() {
  if (!activeSimulator) return getDemoSimulationStatus();
  activeSimulator.states.clear();
  activeSimulator.offlineVehicleIds = [];
  activeSimulator.lastTickAt = null;
  activeSimulator.tickCount = 0;
  activeSimulator.acceptedTelemetryCount = 0;
  activeSimulator.lastWarning = null;
  lastError = null;
  return getDemoSimulationStatus();
}

export function getDemoSimulationStatus() {
  return {
    enabled: lastConfig.enabled,
    running: Boolean(activeSimulator?.timer),
    active: Boolean(activeSimulator?.timer) && !lastError,
    scenario: lastConfig.scenario,
    intervalMs: lastConfig.intervalMs,
    vehicleLimit: lastConfig.vehicleLimit,
    participatingVehicles: activeSimulator?.participantIds || [],
    offlineVehicles: activeSimulator?.offlineVehicleIds || [],
    tickCount: activeSimulator?.tickCount || 0,
    acceptedTelemetryCount: activeSimulator?.acceptedTelemetryCount || 0,
    lastTickAt: activeSimulator?.lastTickAt || null,
    error: lastError,
  };
}
