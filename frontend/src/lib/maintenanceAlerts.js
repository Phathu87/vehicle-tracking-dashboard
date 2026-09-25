// Automated maintenance alert logic for the prototype.
// A vehicle triggers an alert when it reaches its service mileage limit.

export function getMaintenanceStatus(v) {
  const sinceService = v.mileage - v.lastServiceMileage;
  const remaining = v.serviceInterval - sinceService;
  const pct = Math.min(100, Math.round((sinceService / v.serviceInterval) * 100));
  if (remaining <= 0) return { state: 'overdue', remaining, pct, sinceService };
  if (remaining <= 1000) return { state: 'due-soon', remaining, pct, sinceService };
  return { state: 'ok', remaining, pct, sinceService };
}

// Returns vehicles that have reached (overdue) or are near (due soon) their service limit,
// sorted by most urgent first.
export function computeMaintenanceAlerts(vehicles) {
  return vehicles
    .map(v => ({ vehicle: v, ...getMaintenanceStatus(v) }))
    .filter(a => a.state === 'overdue' || a.state === 'due-soon')
    .sort((a, b) => a.remaining - b.remaining);
}