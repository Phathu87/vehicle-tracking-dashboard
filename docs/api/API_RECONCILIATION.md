# Fleet Drive AI Demo API Reconciliation

## Authority and verification

The current Express routers and their Supertest coverage are authoritative. The historical Vehicle Maintenance API v2 collection is retained only as contract evidence. `Fleet Drive AI Demo.postman_collection.json` is the safe operational collection. This reconciliation was refreshed on 2026-09-23.

## Current endpoint matrix

| Area | Current Express routes | Frontend use | Resolution |
| --- | --- | --- | --- |
| Health | `GET /api/health` | Deployment checks | Added to reference and Postman |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Register, login, session restoration | Connected; login/register rate limited |
| Vehicles | `GET/POST /api/vehicles`, `GET/PUT/DELETE /api/vehicles/:id` | List, detail and mutations where exposed | Connected; list remains public for compatibility |
| Telemetry | `POST /api/vehicles/:id/telemetry` | Simulator/producer, then frontend polling | Connected through Express persistence |
| Status/history | `GET /api/vehicles/:id/status`, `GET /api/vehicles/:id/history` | Detail, map and reports | Connected |
| Drivers | `GET/POST /api/drivers`, `GET/PUT/DELETE /api/drivers/:id`, `PUT /api/drivers/:id/vehicles` | Driver screens and assignment | Connected |
| Maintenance | Vehicle-scoped CRUD, completion, global list and report | Maintenance and reports | Connected; deterministic rules, not ML |
| Alerts | `GET /api/alerts`, `GET /api/alerts/types` | Alerts and dashboard | Connected; acknowledgement is not implemented |
| Geofences | CRUD plus `GET /api/geofences/:id/check` | Geofence map and state | Connected; circle and polygon supported |
| Routes | `POST /api/routes/optimize` | Route Optimisation | Connected Demo nearest-neighbour algorithm |
| Reports | maintenance report and trip report | Reports | Connected JSON reports; no PDF/CSV |
| Simulation | `GET /api/demo/status` | Header indicator | Authenticated read-only status; lifecycle is environment controlled |

## Historical differences resolved

- The active base URL defaults to `http://localhost:3001`, not port `5000`.
- JWT literals and saved credentials were removed. Requests use `{{token}}` and login stores the returned token locally in Postman.
- Public registration cannot select an administrator role.
- Current maintenance operations use persistent task IDs, not array indexes.
- Current geofences support both circles and polygons.
- Alert listing/types, geofence CRUD/check, global maintenance, driver assignment, health and Demo status are included in the operational collection.
- Route optimisation is described as a deterministic Demo algorithm, never as Google, Mapbox, traffic-aware or AI routing.
- Reports are JSON generated from persisted data. Export remains unavailable.

## Compatibility decisions

- `GET /api/vehicles` remains a public raw array because existing consumers rely on that shape.
- Protected routes accept either authenticated `user` or `admin`; there are no current admin-only routes. Public registration always creates `user` accounts.
- No `/v1` prefix is introduced and no endpoint is silently renamed.
- `GET /api/demo/status` is read-only. Start, stop and reset controls are not exposed over HTTP, reducing public mutation risk.

## Remaining contract limits

- Vehicle list filtering is performed by the frontend; query filters are not a guaranteed server contract.
- Alerts are read-only in the UI/API.
- Trip calculations use bounded stored points and straight-line distance.
- Route optimisation does not know roads, traffic, capacity or travel-time data.
- Role-specific authorization is not applicable until a privileged endpoint is introduced; frontend role display is not a security control.

## Verification

The 2026-09-23 backend run passed 34 tests covering auth, vehicles, telemetry, history, status, drivers, maintenance, alerts, geofences, route optimisation, reports, simulation, HTTP hardening and data integrity.
