// Automated maintenance notification system.
// Any vehicle that reaches (or approaches) its service mileage limit
// generates a notification automatically — no manual trigger needed.
import { VEHICLES } from '@/lib/fleetData';
import { computeMaintenanceAlerts } from '@/lib/maintenanceAlerts';

const DISMISSED_KEY = 'fdai-maintenance-dismissed';

export function buildMaintenanceNotifications() {
  return computeMaintenanceAlerts(VEHICLES).map(a => {
    const limit = a.vehicle.lastServiceMileage + a.vehicle.serviceInterval;
    return {
      id: `maint-${a.vehicle.id}-${a.state}`,
      vehicleId: a.vehicle.id,
      overdue: a.state === 'overdue',
      title: a.state === 'overdue'
        ? `${a.vehicle.id} has reached its service mileage limit`
        : `${a.vehicle.id} is nearing its service mileage limit`,
      detail: `${a.vehicle.mileage.toLocaleString()} km logged — limit is ${limit.toLocaleString()} km (${Math.abs(a.remaining).toLocaleString()} km ${a.remaining <= 0 ? 'over' : 'remaining'}).`,
    };
  });
}

export function getDismissedIds() {
  try {
    const v = JSON.parse(localStorage.getItem(DISMISSED_KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function dismissNotifications(ids) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable — notifications just won't persist dismissal
  }
}