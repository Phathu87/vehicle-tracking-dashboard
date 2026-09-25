# Fleet Drive AI Demo - WP2 Backend Stabilisation

Owner: Phathutshedzo Rakhunwana
Date: 2026-09-21
Scope: `vehicle-tracking-dashboard/server/` only, plus the workspace `.gitignore` and this report.

## Outcome

The existing Express backend is now a testable, environment-aware foundation while preserving its only implemented API route. No historical Postman feature was implemented during this work package.

The server starts on port `3001` by default and `GET /api/vehicles` returns 350 generated vehicle records with 350 unique IDs.

## Bugs Fixed

### Duplicate vehicle identifiers

The generator produced 350 records but only 325 unique IDs. Both Mahikeng and Mafikeng used the first two letters of the city name, so each emitted `VH-MA-100` through `VH-MA-124`.

Fix:

- Mafikeng now has the explicit city code `MF`.
- Existing Mahikeng IDs remain `VH-MA-*`.
- Mafikeng records now use `VH-MF-*`.
- Vehicle count remains 350.
- A regression test enforces unique IDs.

This is the only externally visible response-data change.

### Untestable server entry point

Previously, importing `server.js` immediately opened a network listener, which prevented isolated route testing.

Fix:

- Express application construction moved to `app.js`.
- `server.js` now owns environment loading, port validation, and process startup.
- `app` is exported for Supertest.
- `startServer` and `resolvePort` are exported for controlled startup and validation.
- Running `npm start` continues to start the same Express application.

### Environment handling

Previously, the backend read `process.env.PORT` but did not load a local `.env` file or validate the value.

Fix:

- Added `dotenv` and quiet environment loading.
- Added `.env.example` containing only `PORT=`.
- Preserved the default port `3001`.
- Numeric configured ports from 0 through 65535 are accepted.
- Missing or empty `PORT` uses the default.
- Malformed and out-of-range values fail immediately with a non-secret validation error.

The workspace `.gitignore` already ignored `.env` and `.env.*`. An exception for `.env.example` was added so the variable-name template is not hidden by the broader pattern.

### Unused and risky runtime dependencies

The server declared four unused runtime dependencies: `axios`, `nodemon`, `npm`, and `start`. `data.js` also imported Axios without using it.

Fix:

- Removed the unused Axios import.
- Removed all four unused runtime dependencies.
- Added only `dotenv` as a runtime dependency.
- Added `supertest` as a development dependency.

The production dependency audit decreased from 23 findings (including one critical and 13 high) to two transitive findings (one moderate and one high).

## Current Backend Structure

```text
server/
|-- .env.example
|-- app.js
|-- data.js
|-- server.js
|-- package.json
|-- package-lock.json
`-- test/
    `-- server.test.js
```

There are still no `routes/`, `controllers/`, `services/`, `middleware/`, scheduler/job, notification, or persistence layers. None were invented for this work package.

## API Compatibility

### Preserved behavior

| Item | Before | After |
|---|---|---|
| Start command | `npm start` | Unchanged |
| Default port | `3001` | Unchanged |
| Implemented route | `GET /api/vehicles` | Unchanged |
| Authentication | None | Unchanged |
| CORS | Enabled globally | Unchanged |
| Response type | JSON array | Unchanged |
| Vehicle count | 350 | Unchanged |
| Vehicle object shape | Generated vehicle objects | Unchanged; optional `code` exists only on the exported city configuration, not vehicle responses |

### Compatibility-visible correction

Twenty-five Mafikeng vehicle IDs changed from colliding `VH-MA-*` values to unique `VH-MF-*` values. This is a data-integrity correction, not an endpoint rename or response-shape change.

### Route changes

No API route was added, removed, renamed, or redirected.

## Verified Endpoint Surface

All checks were performed against the current Express app with Supertest. No Postman bearer token or password was used.

| Area | Method and route checked | Result | Actual current endpoint |
|---|---|---|---|
| Auth register | `POST /api/auth/register` | 404 | None |
| Auth login | `POST /api/auth/login` | 404 | None |
| Current user | `GET /api/auth/me` | 404 | None |
| Vehicle list | `GET /api/vehicles` | 200 | `GET /api/vehicles` |
| Create vehicle | `POST /api/vehicles` | 404 | None |
| Vehicle detail | `GET /api/vehicles/VH-JO-100` | 404 | None |
| Update vehicle | `PUT /api/vehicles/VH-JO-100` | 404 | None |
| Delete vehicle | `DELETE /api/vehicles/VH-JO-100` | 404 | None |
| Telemetry | `POST /api/vehicles/VH-JO-100/telemetry` | 404 | None |
| Status | `GET /api/vehicles/VH-JO-100/status` | 404 | None |
| History | `GET /api/vehicles/VH-JO-100/history` | 404 | None |
| Drivers list | `GET /api/drivers` | 404 | None |
| Create driver | `POST /api/drivers` | 404 | None |
| Driver detail | `GET /api/drivers/D001` | 404 | None |
| Update driver | `PUT /api/drivers/D001` | 404 | None |
| Delete driver | `DELETE /api/drivers/D001` | 404 | None |
| Vehicle maintenance | `GET /api/vehicles/VH-JO-100/maintenance` | 404 | None |
| Add maintenance | `POST /api/vehicles/VH-JO-100/maintenance` | 404 | None |
| Complete maintenance | `POST /api/vehicles/VH-JO-100/maintenance/complete` | 404 | None |
| Delete maintenance | `DELETE /api/vehicles/VH-JO-100/maintenance/0` | 404 | None |
| Fleet maintenance | `GET /api/maintenance` | 404 | None |
| Alerts | `POST /api/vehicles/VH-JO-100/alerts` | 404 | None |
| Geofences | `POST /api/geofences` | 404 | None |
| Route optimisation | `POST /api/routes/optimize` | 404 | None |
| Maintenance report | `GET /api/maintenance/VH-JO-100/report` | 404 | None |
| Trip report | `GET /api/reports/VH-JO-100/trips` | 404 | None |

Conclusion: the historical Postman collection remains a reference only. `GET /api/vehicles` is the complete current Express API surface.

## Stability Checks

| Check | Result |
|---|---|
| Broken backend imports | None after removing unused Axios import |
| Missing exports required by current server | None |
| Duplicate exported functions | None |
| Circular imports | None; dependency direction is `server.js -> app.js -> data.js` |
| Singular/plural service-name mismatch | Not applicable; no service modules exist |
| Route/controller mismatch | Not applicable; no router/controller modules exist |
| Middleware order | CORS is registered before the existing route |
| Secret logging | No passwords, tokens, or environment values are logged |
| Invalid environment value | Fails at startup with a bounded `PORT` validation error |
| Runtime startup | Passed on port 3001 |
| Live vehicle response | HTTP 200, JSON, 350 records, 350 unique IDs |

## Tests Added

Test command:

```text
npm test
```

Implemented with Node's built-in test runner and Supertest:

1. Generated data contains exactly 350 vehicles, all IDs are unique, required coordinate/speed values are numeric, and every history value is an array.
2. `GET /api/vehicles` returns HTTP 200 and JSON, preserves the generated list length and object shape, and has no duplicate IDs.
3. Port resolution preserves the default, accepts valid configured values, and rejects malformed or out-of-range values.

Final result:

```text
tests 3
pass 3
fail 0
```

The server was also started with `npm start`, probed over HTTP, and stopped. No development server was left running.

## Dependency Verification

Direct package inventory after stabilisation:

- Runtime: `express@5.1.0`, `cors@2.8.5`, `dotenv@18.0.1`.
- Development: `supertest@7.2.2`.

Remaining production advisory findings:

| Package | Severity | Direct dependency | Status |
|---|---|---|---|
| `path-to-regexp` | High | No, Express transitive | Unresolved; dependency upgrade must be assessed separately for compatibility. |
| `body-parser` | Moderate | No, Express transitive | Unresolved; dependency upgrade must be assessed separately for compatibility. |

No automatic audit fix was run because dependency upgrades were outside this narrowly scoped stabilisation package.

## Unresolved Problems

- Auth, vehicle CRUD beyond list, telemetry, status, history, driver CRUD, maintenance, alerts, geofences, route optimisation, and reports are not implemented.
- Generated vehicle state is random at process startup, in-memory only, and not updated after startup.
- Vehicle history arrays remain empty because no telemetry ingestion or simulator loop exists.
- CORS remains unrestricted to preserve current behavior.
- There is no authentication, authorization, request validation, rate limiting, structured error middleware, or persistence.
- The historical README/Postman port `5000` still differs from the implementation default `3001`; non-backend documentation was not changed in this package.
- Two transitive production dependency advisories remain.
- The workspace has no Git metadata, so ignore behavior and prior secret exposure cannot be validated with Git commands; the ignore rules themselves were inspected.

## Files Changed

- `vehicle-tracking-dashboard/server/app.js`
- `vehicle-tracking-dashboard/server/server.js`
- `vehicle-tracking-dashboard/server/data.js`
- `vehicle-tracking-dashboard/server/package.json`
- `vehicle-tracking-dashboard/server/package-lock.json`
- `vehicle-tracking-dashboard/server/.env.example`
- `vehicle-tracking-dashboard/server/test/server.test.js`
- `.gitignore`
- `docs/backend/WP2_BACKEND_STABILISATION.md`

WP2 stop point reached. No frontend changes or missing product features were implemented.
