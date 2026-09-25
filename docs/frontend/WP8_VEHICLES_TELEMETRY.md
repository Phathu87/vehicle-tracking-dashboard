# WP8 - Vehicles and Telemetry

## Outcome

The vehicle list and detail pages now use the Express API and a persistent
SQLite database. React no longer owns or mutates the vehicle dataset. The
database is created at `server/data/fleet-drive-demo.sqlite` unless
`DATABASE_PATH` specifies another location.

## Data path

```text
telemetryProducer.js
  -> POST /api/vehicles/:id/telemetry
  -> Express validation and authentication
  -> SQLite vehicles, telemetry, and alerts tables
  -> GET /api/vehicles and GET /api/vehicles/:id/history
  -> React Query vehicle screens
```

The included producer requires `SIMULATOR_TOKEN`; no JWT, username, or password
is stored in source control. It can be started from the server directory with
`npm run telemetry` after supplying a valid Demo token.

## Implemented API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/vehicles` | Persistent vehicle list with optional API filters |
| POST | `/api/vehicles` | Create a vehicle |
| GET | `/api/vehicles/:id` | Vehicle detail, maintenance, and alerts |
| PUT | `/api/vehicles/:id` | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Delete a vehicle and dependent records |
| POST | `/api/vehicles/:id/telemetry` | Validate and persist telemetry |
| GET | `/api/vehicles/:id/status` | Latest persisted state |
| GET | `/api/vehicles/:id/history` | Bounded telemetry history |

All routes except the compatibility vehicle list require a valid bearer token.
The list remains public to preserve the pre-WP8 Express behavior.

## Vehicle list

`/app/vehicles` provides search, city and status filters, sortable ID,
make/model, driver, speed, mileage, fuel, city, and last-seen fields, grid/table
views, and client pagination over the API response. Data refreshes every 15
seconds and has loading, empty, and API-error states.

## Vehicle detail

`/app/vehicles/:id` loads vehicle detail and history independently through
React Query. It displays the latest position on Leaflet, the stored route,
telemetry readings, speed, mileage, fuel, driver assignment, maintenance,
telemetry-derived alerts, and geofence status.

## Persistence

SQLite tables cover users, vehicles, telemetry, maintenance, and alerts.
Initial Demo records are seeded only when the vehicles table is empty. Once
created, current state and history survive Express restarts. SQLite files and
WAL files are excluded from source control.

## Verification

- Backend: 16 tests passed.
- Vehicle CRUD was exercised through Supertest.
- Telemetry ingestion updated status and added queryable history.
- Overspeed, low-fuel, and geofence-exit alerts were generated from telemetry.
- Invalid telemetry and cascade deletion were tested.
- Frontend ESLint passed.
- Frontend production build passed.

## Known limitation

Node 22 currently labels its built-in `node:sqlite` API experimental. The
database is real and file-backed, but a future Node upgrade may require a small
adapter update if that API changes.
