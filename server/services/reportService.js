import { getVehicleHistory, findVehicle } from "./vehicleService.js";
import { listVehicleMaintenance } from "./maintenanceService.js";

function distanceKm(a, b) {
  const toRadians = (value) => value * Math.PI / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function maintenanceReport(vehicleId) {
  const vehicle = findVehicle(vehicleId);
  if (!vehicle) return null;
  const tasks = listVehicleMaintenance(vehicleId);
  return { vehicleId, plate: vehicle.plate, generatedAt: new Date().toISOString(), summary: { total: tasks.length, completed: tasks.filter((task) => task.status === "completed").length, outstanding: tasks.filter((task) => task.status !== "completed").length, overdue: tasks.filter((task) => task.status === "overdue").length }, tasks };
}

export function tripReport(vehicleId) {
  const vehicle = findVehicle(vehicleId);
  if (!vehicle) return null;
  const history = getVehicleHistory(vehicleId, 500);
  const groups = [];
  history.forEach((point) => {
    const current = groups.at(-1);
    const gap = current ? Date.parse(point.recordedAt) - Date.parse(current.at(-1).recordedAt) : 0;
    if (!current || gap > 30 * 60_000) groups.push([point]); else current.push(point);
  });
  const trips = groups.filter((points) => points.length > 1).map((points, index) => {
    const distance = points.slice(1).reduce((total, point, pointIndex) => total + distanceKm(points[pointIndex], point), 0);
    const speeds = points.map((point) => point.speed);
    return { id: `${vehicleId}-TRIP-${index + 1}`, startedAt: points[0].recordedAt, endedAt: points.at(-1).recordedAt, distanceKm: Number(distance.toFixed(2)), durationMinutes: Math.max(1, Math.round((Date.parse(points.at(-1).recordedAt) - Date.parse(points[0].recordedAt)) / 60_000)), averageSpeed: Math.round(speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length), maxSpeed: Math.max(...speeds), pointCount: points.length };
  });
  return { vehicleId, plate: vehicle.plate, generatedAt: new Date().toISOString(), trips, history, limitations: "Trips are derived from stored telemetry and split on gaps longer than 30 minutes." };
}
