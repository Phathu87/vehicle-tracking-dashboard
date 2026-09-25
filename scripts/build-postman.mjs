import fs from 'node:fs';

const output = new URL('../Fleet Drive AI Demo.postman_collection.json', import.meta.url);
const url = (raw) => ({ raw, host: ['{{base_url}}'], path: raw.replace('{{base_url}}/', '').split('?')[0].split('/') });
const jsonBody = (value) => ({ mode: 'raw', raw: JSON.stringify(value, null, 2), options: { raw: { language: 'json' } } });
const request = (name, method, path, { body, noauth = false, description, event } = {}) => ({
  name,
  ...(event ? { event } : {}),
  request: {
    ...(noauth ? { auth: { type: 'noauth' } } : {}),
    method,
    header: body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
    ...(body ? { body: jsonBody(body) } : {}),
    url: url(`{{base_url}}${path}`),
    description: `IMPLEMENTED. ${description || ''}`.trim(),
  },
  response: [],
});
const folder = (name, item) => ({ name, item });
const loginEvent = [{ listen: 'test', script: { type: 'text/javascript', exec: [
  'if (pm.response.code >= 200 && pm.response.code < 300) {',
  '  const body = pm.response.json();',
  '  const token = body.token || body.access_token || (body.data && body.data.token);',
  '  if (token) {',
  '    pm.collectionVariables.set("token", token);',
  '    if (pm.environment) pm.environment.set("token", token);',
  '  }',
  '}',
] } }];

const collection = {
  info: {
    _postman_id: '7cb95d81-fda7-4c62-bf16-fda100000012',
    name: 'Fleet Drive AI Demo',
    description: 'Verified requests for the current Fleet Drive AI Demo Express API. No credentials or bearer tokens are stored.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  auth: { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}', type: 'string' }] },
  variable: [
    ['base_url', 'http://localhost:3001'], ['token', ''], ['username', ''], ['password', ''],
    ['vehicle_id', 'VH-JO-100'], ['driver_id', 'DRV-001'], ['maintenance_id', '1'], ['geofence_id', 'GF-DEMO-JHB'],
  ].map(([key, value]) => ({ key, value, type: 'string' })),
  item: [
    folder('Health', [request('Health', 'GET', '/api/health', { noauth: true, description: 'Safe service readiness response.' })]),
    folder('Authentication', [
      request('Register', 'POST', '/api/auth/register', { noauth: true, body: { username: '{{username}}', password: '{{password}}', name: 'Demo User' }, description: 'Creates a persisted Demo user; role cannot be self-assigned.' }),
      request('Login', 'POST', '/api/auth/login', { noauth: true, body: { username: '{{username}}', password: '{{password}}', rememberMe: false }, event: loginEvent, description: 'Returns a JWT and saves it as token.' }),
      request('Current User', 'GET', '/api/auth/me', { description: 'Returns the authenticated public user shape.' }),
    ]),
    folder('Vehicles', [
      request('List Vehicles', 'GET', '/api/vehicles', { noauth: true, description: 'Lists current vehicles; supports search, city, status and make.' }),
      request('Create Vehicle', 'POST', '/api/vehicles', { body: { id: 'DEMO-001', plate: 'DEMO 001 GP', make: 'Toyota', model: 'Hilux', city: 'Johannesburg', lat: -26.2041, lng: 28.0473, mileage: 1000, fuel: 80 }, description: 'Creates a vehicle.' }),
      request('Get Vehicle', 'GET', '/api/vehicles/{{vehicle_id}}', { description: 'Returns vehicle detail with maintenance and alerts.' }),
      request('Update Vehicle', 'PUT', '/api/vehicles/{{vehicle_id}}', { body: { fuel: 75 }, description: 'Updates validated vehicle fields.' }),
      request('Delete Vehicle', 'DELETE', '/api/vehicles/{{vehicle_id}}', { description: 'Deletes a vehicle and cascades related records.' }),
      request('Submit Telemetry', 'POST', '/api/vehicles/{{vehicle_id}}/telemetry', { body: { lat: -26.2041, lng: 28.0473, speed: 45, mileage: 1001, fuel: 79, recordedAt: '2026-09-23T10:00:00.000Z' }, description: 'Persists telemetry and invokes existing alert/geofence/maintenance processing.' }),
      request('Vehicle Status', 'GET', '/api/vehicles/{{vehicle_id}}/status', { description: 'Returns current backend-derived status.' }),
      request('Vehicle History', 'GET', '/api/vehicles/{{vehicle_id}}/history?limit=100', { description: 'Returns bounded telemetry history.' }),
    ]),
    folder('Drivers', [
      request('List Drivers', 'GET', '/api/drivers', { description: 'Lists drivers and assignment summaries.' }),
      request('Create Driver', 'POST', '/api/drivers', { body: { id: 'DRV-DEMO', name: 'Demo Driver', licenceNumber: 'DEMO-123', licenceExpiry: '2027-12-31', phone: '+27 00 000 0000', email: 'driver@fleetdrive.demo' }, description: 'Creates a driver.' }),
      request('Get Driver', 'GET', '/api/drivers/{{driver_id}}', { description: 'Returns driver detail and assigned vehicles.' }),
      request('Update Driver', 'PUT', '/api/drivers/{{driver_id}}', { body: { phone: '+27 00 000 0001' }, description: 'Updates driver fields.' }),
      request('Assign Vehicles', 'PUT', '/api/drivers/{{driver_id}}/vehicles', { body: { vehicleIds: ['{{vehicle_id}}'] }, description: 'Replaces verified vehicle assignments.' }),
      request('Delete Driver', 'DELETE', '/api/drivers/{{driver_id}}', { description: 'Deletes an unassigned driver.' }),
    ]),
    folder('Maintenance', [
      request('List Maintenance', 'GET', '/api/maintenance', { description: 'Lists tasks; supports status.' }),
      request('Vehicle Maintenance', 'GET', '/api/vehicles/{{vehicle_id}}/maintenance', { description: 'Lists tasks for one vehicle.' }),
      request('Add Maintenance', 'POST', '/api/vehicles/{{vehicle_id}}/maintenance', { body: { type: 'Oil and filter service', dueMileage: 25000, dueDate: '2027-01-31' }, description: 'Creates a rule-based maintenance task.' }),
      request('Update Maintenance', 'PUT', '/api/vehicles/{{vehicle_id}}/maintenance/{{maintenance_id}}', { body: { type: 'Brake and tyre inspection', dueMileage: 26000 }, description: 'Updates a maintenance task.' }),
      request('Complete Maintenance', 'POST', '/api/vehicles/{{vehicle_id}}/maintenance/{{maintenance_id}}/complete', { body: { mileage: 25000 }, description: 'Completes a task and records service mileage.' }),
      request('Delete Maintenance', 'DELETE', '/api/vehicles/{{vehicle_id}}/maintenance/{{maintenance_id}}', { description: 'Deletes a maintenance task.' }),
      request('Maintenance Report', 'GET', '/api/maintenance/{{vehicle_id}}/report', { description: 'Returns rule-derived maintenance summary.' }),
    ]),
    folder('Alerts', [
      request('List Alerts', 'GET', '/api/alerts', { description: 'Lists persisted supported telemetry/geofence alerts.' }),
      request('Alert Types', 'GET', '/api/alerts/types', { description: 'Lists supported alert types.' }),
    ]),
    folder('Geofences', [
      request('List Geofences', 'GET', '/api/geofences', { description: 'Lists persisted boundaries.' }),
      request('Create Geofence', 'POST', '/api/geofences', { body: { name: 'Demo Boundary', shapeType: 'circle', center: { lat: -26.2041, lng: 28.0473 }, radiusMeters: 1000 }, description: 'Creates a circle or polygon boundary.' }),
      request('Get Geofence', 'GET', '/api/geofences/{{geofence_id}}', { description: 'Returns one boundary.' }),
      request('Update Geofence', 'PUT', '/api/geofences/{{geofence_id}}', { body: { name: 'Updated Demo Boundary' }, description: 'Updates a boundary.' }),
      request('Check Vehicles', 'GET', '/api/geofences/{{geofence_id}}/check?vehicleId={{vehicle_id}}', { description: 'Calculates current inside/outside state.' }),
      request('Delete Geofence', 'DELETE', '/api/geofences/{{geofence_id}}', { description: 'Deletes a boundary and its state rows.' }),
    ]),
    folder('Routes', [request('Optimise Stops', 'POST', '/api/routes/optimize', { body: { stops: [{ name: 'Start', lat: -26.2041, lng: 28.0473 }, { name: 'Stop 2', lat: -26.1076, lng: 28.0567 }] }, description: 'Runs deterministic Demo nearest-neighbour ordering; not traffic-aware or AI routing.' })]),
    folder('Reports', [request('Trip Report', 'GET', '/api/reports/{{vehicle_id}}/trips', { description: 'Derives trips from persisted telemetry history.' })]),
    folder('Demo Simulation', [request('Simulation Status', 'GET', '/api/demo/status', { description: 'Returns safe authenticated simulator runtime status. No mutation controls are exposed.' })]),
  ],
};

fs.writeFileSync(output, `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
