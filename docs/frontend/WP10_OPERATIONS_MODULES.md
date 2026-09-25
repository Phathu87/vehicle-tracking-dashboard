# WP10 Operations Modules

## Outcome

Work Package 10 implements the four operations modules in the real authenticated
React application and connects them to persisted Express/SQLite APIs. The public
landing page was not changed.

## Alerts

- `/app/alerts` reads persisted alerts and supported alert types from Express.
- Supported types are `overspeed`, `low_fuel`, `geofence_entry`, and
  `geofence_exit`.
- Severity, vehicle, driver, time, type, and state are displayed with filters.
- Alert state is read-only. No acknowledgement action is presented because the
  backend does not implement acknowledgement.

## Geofences

- `/app/geofences` implements persisted list, create, edit, and delete actions.
- Both circle and polygon geometry are supported and rendered with Leaflet.
- Vehicle checks use current backend positions and return `inside` or `outside`.
- Telemetry ingestion evaluates stored geofences and persists entry/exit alerts
  only when a previously observed vehicle changes state.

## Route Optimisation

- `/app/routes` calls `POST /api/routes/optimize` with user-entered or current
  vehicle coordinates.
- The backend uses a deterministic nearest-neighbour Demo algorithm and
  straight-line haversine distance.
- The screen explicitly states that it is not Google, Mapbox, road-aware,
  traffic-aware, capacity-aware, or an AI model.

## Reports

- `/app/reports` exposes maintenance reports, derived trips, and raw telemetry
  history for a selected vehicle.
- Maintenance results come from persisted tasks and deterministic mileage/date
  rules. Trip results are derived from persisted telemetry, split at gaps longer
  than 30 minutes.
- PDF and CSV controls are disabled and labelled planned because no backend
  export service exists.

## Backend additions

- `GET /api/alerts` and `GET /api/alerts/types`
- Geofence CRUD and `GET /api/geofences/:id/check`
- `POST /api/routes/optimize`
- `GET /api/maintenance/:vehicleId/report`
- `GET /api/reports/:vehicleId/trips`
- SQLite geofence definitions, vehicle state, and alert state persistence

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with Vite 6.4.3.
- `npm test`: 23 tests passed after configuring Node's test runner for serial
  access to the shared SQLite test database.
- Live authenticated HTTP verification passed on port 3001: telemetry persisted,
  alerts returned, two geofences loaded, a vehicle state checked, a three-stop
  route optimised, and maintenance/trip reports generated from persisted data.

## Limitations

- Alert acknowledgement and notification-provider delivery are not implemented.
- Route optimisation is a Demo algorithm, not a commercial routing engine.
- Report export is planned and intentionally unavailable.
- Geofence evaluation is based on the latest positions submitted through the
  telemetry API; it does not imply production GPS hardware.
