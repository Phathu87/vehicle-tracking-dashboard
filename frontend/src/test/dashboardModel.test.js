import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDashboardModel } from '../lib/dashboardModel.js';

const vehicles = [
  { id: 'V-1', status: 'moving', speed: 40, fuel: 70, lat: -26.2, lng: 28.0, driver: 'Driver A', city: 'Johannesburg', lastSeen: '2026-09-23T10:00:00Z' },
  { id: 'V-2', status: 'offline', speed: 0, fuel: 30, lat: -33.9, lng: 18.4, driver: 'Driver B', city: 'Cape Town', lastSeen: '2026-09-23T09:00:00Z' },
];

test('dashboard KPIs use supplied backend datasets', () => {
  const model = buildDashboardModel(vehicles, {
    drivers: [{ id: 'D-1' }, { id: 'D-2' }, { id: 'D-3' }],
    alerts: [{ id: 1, vehicleId: 'V-1', type: 'overspeed', severity: 'critical' }],
    maintenance: [{ id: 1, status: 'overdue' }, { id: 2, status: 'scheduled' }],
  });
  assert.equal(model.driverCount, 3);
  assert.equal(model.alerts.length, 1);
  assert.equal(model.alerts[0].type, 'Overspeed');
  assert.deepEqual(model.maintenance.map((item) => item.value), [1, 0, 1]);
});

test('dashboard snapshot metrics are derived from vehicle API data', () => {
  const model = buildDashboardModel(vehicles);
  assert.equal(model.vehicles.length, 2);
  assert.equal(model.activeCount, 1);
  assert.equal(model.averageSpeed, 20);
  assert.equal(model.locationCount, 2);
});
