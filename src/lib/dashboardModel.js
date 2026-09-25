const ACTIVE_STATUSES = new Set(['online', 'moving', 'active']);

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function timestampOrZero(value) {
  const parsed = typeof value === 'number' ? value : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function maintenanceState(vehicle) {
  const mileage = numberOrNull(vehicle.mileage);
  const lastService = numberOrNull(vehicle.lastServiceMileage);
  const interval = numberOrNull(vehicle.serviceInterval);
  if (mileage === null || lastService === null || !interval) return null;
  const remaining = interval - (mileage - lastService);
  if (remaining <= 0) return 'overdue';
  if (remaining <= 1000) return 'due-soon';
  return 'healthy';
}

function distanceKm(a, b) {
  const lat1 = numberOrNull(a?.lat);
  const lng1 = numberOrNull(a?.lng);
  const lat2 = numberOrNull(b?.lat);
  const lng2 = numberOrNull(b?.lng);
  if ([lat1, lng1, lat2, lng2].some((value) => value === null)) return 0;
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function alertForVehicle(vehicle) {
  const alerts = [];
  if (vehicle.speed >= 75) alerts.push({ id: `speed-${vehicle.id}`, type: 'Overspeed', severity: 'critical', vehicle });
  if (vehicle.fuel !== null && vehicle.fuel <= 15) alerts.push({ id: `fuel-${vehicle.id}`, type: 'Low fuel', severity: 'critical', vehicle });
  const serviceState = maintenanceState(vehicle);
  if (serviceState === 'overdue') alerts.push({ id: `service-${vehicle.id}`, type: 'Service overdue', severity: 'warning', vehicle });
  if (serviceState === 'due-soon') alerts.push({ id: `service-${vehicle.id}`, type: 'Service due soon', severity: 'warning', vehicle });
  return alerts;
}

export function normalizeVehicle(vehicle, index = 0) {
  const status = String(vehicle.status || 'unknown').toLowerCase();
  return {
    ...vehicle,
    id: String(vehicle.id || `vehicle-${index + 1}`),
    driver: vehicle.driver || vehicle.driverName || null,
    status,
    speed: numberOrNull(vehicle.speed) ?? 0,
    fuel: numberOrNull(vehicle.fuel),
    lat: numberOrNull(vehicle.lat),
    lng: numberOrNull(vehicle.lng),
    lastSeenTimestamp: timestampOrZero(vehicle.lastSeen),
    locationLabel: vehicle.city || vehicle.area || vehicle.province || 'Location unavailable',
  };
}

export function buildDashboardModel(response, related = {}) {
  const source = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
  const vehicles = source.map(normalizeVehicle);
  const active = vehicles.filter((vehicle) => ACTIVE_STATUSES.has(vehicle.status));
  const assignedDrivers = [...new Set(vehicles.map((vehicle) => vehicle.driver).filter(Boolean))];
  const drivers = Array.isArray(related.drivers) ? related.drivers : assignedDrivers;
  const locations = [...new Set(vehicles.map((vehicle) => vehicle.locationLabel).filter((label) => label !== 'Location unavailable'))];
  const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const persistedAlerts = Array.isArray(related.alerts) ? related.alerts.map((alert) => ({
    ...alert,
    type: String(alert.type || 'alert').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    vehicle: vehicleById.get(alert.vehicleId) || { id: alert.vehicleId, locationLabel: 'Location unavailable' },
  })) : null;
  const alerts = persistedAlerts || vehicles.flatMap(alertForVehicle).sort((a, b) => b.vehicle.speed - a.vehicle.speed);
  const speeds = vehicles.map((vehicle) => vehicle.speed);
  const averageSpeed = speeds.length ? Math.round(speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length) : 0;
  const speedDistribution = [
    { name: '0-39', value: speeds.filter((speed) => speed < 40).length, color: '#687c94' },
    { name: '40-59', value: speeds.filter((speed) => speed >= 40 && speed < 60).length, color: '#1769ff' },
    { name: '60-74', value: speeds.filter((speed) => speed >= 60 && speed < 75).length, color: '#2bd576' },
    { name: '75+', value: speeds.filter((speed) => speed >= 75).length, color: '#ff9f1a' },
  ];

  const driverMap = new Map();
  vehicles.forEach((vehicle) => {
    if (!vehicle.driver) return;
    const current = driverMap.get(vehicle.driver) || { name: vehicle.driver, vehicleCount: 0, totalSpeed: 0, activeCount: 0 };
    current.vehicleCount += 1;
    current.totalSpeed += vehicle.speed;
    if (ACTIVE_STATUSES.has(vehicle.status)) current.activeCount += 1;
    driverMap.set(vehicle.driver, current);
  });
  const topDrivers = [...driverMap.values()]
    .map((driver) => ({ ...driver, averageSpeed: Math.round(driver.totalSpeed / driver.vehicleCount) }))
    .sort((a, b) => b.activeCount - a.activeCount || b.vehicleCount - a.vehicleCount || a.name.localeCompare(b.name))
    .slice(0, 5);

  const maintenanceVehicles = vehicles.map((vehicle) => ({ vehicle, state: maintenanceState(vehicle) })).filter((item) => item.state);
  const maintenanceTasks = Array.isArray(related.maintenance) ? related.maintenance : null;
  const maintenance = ['overdue', 'due-soon', 'healthy'].map((state) => ({
    name: state === 'due-soon' ? 'Due soon' : state.charAt(0).toUpperCase() + state.slice(1),
    value: maintenanceTasks
      ? maintenanceTasks.filter((item) => item.status === (state === 'due-soon' ? 'due_soon' : state) || (state === 'healthy' && item.status === 'scheduled')).length
      : maintenanceVehicles.filter((item) => item.state === state).length,
    color: state === 'overdue' ? '#ff4545' : state === 'due-soon' ? '#ff9f1a' : '#2bd576',
  }));

  const fuelVehicles = vehicles.filter((vehicle) => vehicle.fuel !== null);
  const averageFuel = fuelVehicles.length ? Math.round(fuelVehicles.reduce((sum, vehicle) => sum + vehicle.fuel, 0) / fuelVehicles.length) : null;
  const histories = vehicles.map((vehicle) => Array.isArray(vehicle.history) ? vehicle.history : []).filter((history) => history.length > 1);
  const longestHistory = histories.reduce((max, history) => Math.max(max, history.length), 0);
  let cumulativeDistance = 0;
  const distanceSeries = Array.from({ length: Math.max(0, longestHistory - 1) }, (_, index) => {
    cumulativeDistance += histories.reduce((total, history) => total + (history[index + 1] ? distanceKm(history[index], history[index + 1]) : 0), 0);
    return { point: `P${index + 1}`, distance: Number(cumulativeDistance.toFixed(1)) };
  });
  const fuelConsumptionValues = vehicles.map((vehicle) => numberOrNull(vehicle.fuelConsumed)).filter((value) => value !== null);

  return {
    vehicles,
    activeCount: active.length,
    driverCount: drivers.length,
    locationCount: locations.length,
    alerts,
    averageSpeed,
    speedDistribution,
    recentVehicles: [...vehicles].sort((a, b) => b.lastSeenTimestamp - a.lastSeenTimestamp).slice(0, 6),
    topDrivers,
    maintenance,
    maintenanceAvailable: maintenanceTasks ? maintenanceTasks.length > 0 : maintenanceVehicles.length > 0,
    averageFuel,
    fuelAvailable: fuelVehicles.length > 0,
    fuelConsumption: fuelConsumptionValues.reduce((sum, value) => sum + value, 0),
    fuelConsumptionAvailable: fuelConsumptionValues.length > 0,
    distanceSeries,
    historyAvailable: distanceSeries.length > 0,
  };
}
