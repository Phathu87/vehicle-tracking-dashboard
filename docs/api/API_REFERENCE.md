# Fleet Drive AI Demo API Reference

## Contract status

This document is the authoritative API contract for the Fleet Drive AI Demo as
of 2026-09-23. It separates the API that exists from the API retained from the
historical Vehicle Maintenance API v2 contract.

- **IMPLEMENTED**: available in the current Express application and verified by
  the backend test suite.
- Authentication, fleet operations, vehicle, and telemetry routes are implemented.
  `GET /api/vehicles` remains public and a raw JSON array for compatibility.
- API base URL for local development: `http://localhost:3001`.
- JSON requests use `Content-Type: application/json`.

## Health and HTTP policy

### `GET /api/health` - IMPLEMENTED

- **Authentication / roles:** public.
- **Params / query / body:** none.
- **Success:** `200` with `{ "status": "ok", "service": "fleet-drive-ai-demo-api" }`.
- **Known limitations:** liveness only; it does not expose configuration or external dependency state.
- **Frontend consumers:** hosting and release smoke checks.

API misses return a JSON `404` envelope. Oversized JSON returns `413`; rejected origins return JSON `403`. Login and registration are limited per IP/path using `AUTH_RATE_LIMIT_MAX` and `AUTH_RATE_LIMIT_WINDOW_MS`. A telemetry update that attempts to reduce stored mileage returns `409 MILEAGE_REGRESSION`.

## Authentication and roles

Protected routes use `Authorization: Bearer <JWT>`. The two
canonical role values are lowercase `admin` and `user`.

| Role | Intended access |
| --- | --- |
| Public | Registration, login, and the compatibility vehicle-list endpoint |
| `user` | Current authenticated Demo operations, including supported mutations |
| `admin` | Reserved role value; no current endpoint requires it exclusively |

The current Express app implements JWT authentication for `/api/auth/me` and
all mutation and operational routes except the public vehicle list. It accepts either authenticated
role for mutations until administrative account management is implemented. Public registration always creates `user`; role-specific operations are therefore not currently applicable.

## Common schemas

### User

```json
{
  "id": "usr_123",
  "username": "fleet.operator",
  "name": "Fleet Operator",
  "role": "user"
}
```

Passwords are accepted only in authentication requests and are never returned.
Public registration cannot assign the `admin` role.

### Vehicle

The implemented endpoint currently returns this shape. `lastSeen` is Unix epoch
milliseconds and status values are title-cased (`Online`, `Idle`, `Offline`).

```json
{
  "id": "VH-JO-100",
  "driver": "Driver 1",
  "make": "Toyota",
  "model": "Corolla",
  "plate": "AB 12 CD GP",
  "city": "Johannesburg",
  "province": "Gauteng",
  "road": [{ "lat": -26.2041, "lng": 28.0473 }],
  "roadIndex": 0,
  "lat": -26.2041,
  "lng": 28.0473,
  "speed": 63,
  "status": "Online",
  "lastSeen": 1789977600000,
  "history": [],
  "progress": 0
}
```

### Driver

```json
{
  "id": "DRV-001",
  "name": "Demo Driver",
  "license": "LIC-001",
  "contact": "+27 10 000 0000",
  "assignedVehicle": "VH-JO-100"
}
```

The API uses the Postman spelling `license`. original design prototype screens currently use
`licence`; a frontend adapter will be required when those screens are connected.

### Telemetry point

```json
{
  "lat": -26.2041,
  "lng": 28.0473,
  "speed": 63,
  "mileage": 125430,
  "fuel": 72,
  "recordedAt": "2026-09-21T08:00:00.000Z"
}
```

`mileage`, `fuel`, and `recordedAt` are optional. The server supplies
`recordedAt` when omitted.

### Maintenance task

```json
{
  "id": "MNT-001",
  "type": "Oil Change",
  "due": true,
  "mileage": 130000,
  "completed": false,
  "createdAt": "2026-09-21T08:00:00.000Z",
  "completedAt": null
}
```

### Alert

```json
{
  "id": 42,
  "vehicleId": "VH-JO-100",
  "plate": "AB 12 CD GP",
  "driverId": "DRV-001",
  "driver": "Demo Driver",
  "type": "overspeed",
  "severity": "critical",
  "message": "VH-JO-100 exceeded the Demo speed threshold.",
  "state": "open",
  "recordedAt": "2026-09-21T08:00:00.000Z"
}
```

### Error

API errors use this envelope:

```json
{
  "error": {
    "code": "VEHICLE_NOT_FOUND",
    "message": "Vehicle not found",
    "details": {}
  }
}
```

Unknown routes outside the documented API still return Express's default HTML
`404` body.

## Endpoint index

| Area | Method | Route | Status |
| --- | --- | --- | --- |
| Auth | POST | `/api/auth/register` | IMPLEMENTED |
| Auth | POST | `/api/auth/login` | IMPLEMENTED |
| Auth | GET | `/api/auth/me` | IMPLEMENTED |
| Vehicles | GET | `/api/vehicles` | IMPLEMENTED |
| Vehicles | POST | `/api/vehicles` | IMPLEMENTED |
| Vehicles | GET | `/api/vehicles/:id` | IMPLEMENTED |
| Vehicles | PUT | `/api/vehicles/:id` | IMPLEMENTED |
| Vehicles | DELETE | `/api/vehicles/:id` | IMPLEMENTED |
| Telemetry | POST | `/api/vehicles/:id/telemetry` | IMPLEMENTED |
| Status | GET | `/api/vehicles/:id/status` | IMPLEMENTED |
| History | GET | `/api/vehicles/:id/history` | IMPLEMENTED |
| Drivers | GET | `/api/drivers` | IMPLEMENTED |
| Drivers | POST | `/api/drivers` | IMPLEMENTED |
| Drivers | GET | `/api/drivers/:id` | IMPLEMENTED |
| Drivers | PUT | `/api/drivers/:id` | IMPLEMENTED |
| Drivers | DELETE | `/api/drivers/:id` | IMPLEMENTED |
| Drivers | PUT | `/api/drivers/:id/vehicles` | IMPLEMENTED |
| Maintenance | GET | `/api/vehicles/:id/maintenance` | IMPLEMENTED |
| Maintenance | POST | `/api/vehicles/:id/maintenance` | IMPLEMENTED |
| Maintenance | PUT | `/api/vehicles/:id/maintenance/:taskId` | IMPLEMENTED |
| Maintenance | POST | `/api/vehicles/:id/maintenance/:taskId/complete` | IMPLEMENTED |
| Maintenance | DELETE | `/api/vehicles/:id/maintenance/:taskId` | IMPLEMENTED |
| Maintenance | GET | `/api/maintenance` | IMPLEMENTED |
| Alerts | GET | `/api/alerts` | IMPLEMENTED |
| Alerts | GET | `/api/alerts/types` | IMPLEMENTED |
| Geofences | GET | `/api/geofences` | IMPLEMENTED |
| Geofences | POST | `/api/geofences` | IMPLEMENTED |
| Geofences | GET | `/api/geofences/:id` | IMPLEMENTED |
| Geofences | PUT | `/api/geofences/:id` | IMPLEMENTED |
| Geofences | DELETE | `/api/geofences/:id` | IMPLEMENTED |
| Geofences | GET | `/api/geofences/:id/check` | IMPLEMENTED |
| Routes | POST | `/api/routes/optimize` | IMPLEMENTED |
| Reports | GET | `/api/maintenance/:vehicleId/report` | IMPLEMENTED |
| Reports | GET | `/api/reports/:vehicleId/trips` | IMPLEMENTED |
| Demo | GET | `/api/demo/status` | IMPLEMENTED |

## Auth endpoints

### `POST /api/auth/register` - IMPLEMENTED

- **Authentication / roles:** none; public.
- **Params / query:** none.
- **Body:** `{ "username": string, "password": string, "name"?: string }`.
  A supplied `role` must be absent or `user`; public callers cannot create admins.
- **Success:** `201` with `{ "token": string, "user": User }`.
- **Errors:** `400` invalid body, `409` duplicate username.
- **Known limitations:** users are stored in process memory and are lost on
  restart. Passwords must be 8-128 characters. The historical `role: "Admin"`
  registration example was unsafe and is not part of this contract.
- **Frontend consumers:** Fleet Drive AI Demo registration page.

### `POST /api/auth/login` - IMPLEMENTED

- **Authentication / roles:** none; public.
- **Params / query:** none.
- **Body:** `{ "username": string, "password": string, "rememberMe"?: boolean }`.
- **Success:** `200` with `{ "token": string, "user": User }`.
- **Errors:** `400` invalid body, `401` invalid credentials.
- **Known limitations:** default tokens expire after 8 hours; remembered tokens
  expire after 30 days. Tokens cannot be revoked before expiry and users are
  lost when the server restarts. Login never requires an existing bearer token.
- **Frontend consumers:** Fleet Drive AI Demo login flow; the safe Postman collection stores a
  successful response token in its empty `token` collection variable.

### `GET /api/auth/me` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; any authenticated account. Public
  registration currently creates only the `user` role.
- **Query:** optional `search`. **Params / body:** none.
- **Success:** `200` with `User`.
- **Errors:** `401` missing/invalid token or user no longer present.
- **Known limitations:** users persist in SQLite, but changing `JWT_SECRET`
  invalidates existing sessions even when their JWT expiry has not been reached.
- **Frontend consumers:** Fleet Drive AI Demo application session bootstrap.

## Vehicle, telemetry, status, and history endpoints

### `GET /api/vehicles` - IMPLEMENTED

- **Authentication / roles:** none; public compatibility endpoint.
- **Params / body:** none.
- **Query:** optional `city`, `status`, `make`, and `search` filters.
- **Success:** `200` with a raw `Vehicle[]` array.
- **Errors:** no route-specific error responses.
- **Known limitations:** returns a raw array for compatibility; pagination and
  sorting are currently handled by the frontend.
- **Frontend consumers:** Dashboard and `/app/vehicles`.

### `POST /api/vehicles` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params / query:** none.
- **Body:** `id`, `make`, `model`, and `plate` are required. Driver, location,
  current telemetry, service interval, and status fields are optional.
- **Success:** `201` with `Vehicle`.
- **Errors:** `400` invalid body, `401`, `409` duplicate ID or plate.
- **Known limitations:** no vehicle-create UI is exposed in WP8.
- **Frontend consumers:** future original design prototype Vehicles create action.

### `GET /api/vehicles/:id` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `id` vehicle ID. **Query / body:** none.
- **Success:** `200` with `Vehicle`.
- **Errors:** `401`, `403`, `404` vehicle not found.
- **Known limitations:** includes maintenance and alerts but not a separate
  driver entity.
- **Frontend consumers:** `/app/vehicles/:id`.

### `PUT /api/vehicles/:id` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` vehicle ID. **Query:** none.
- **Body:** any persisted vehicle field except `id`; telemetry should use the
  dedicated ingestion route.
- **Success:** `200` with updated `Vehicle`.
- **Errors:** `401`, `404`, `409` duplicate plate.
- **Known limitations:** no vehicle-edit UI is exposed in WP8.
- **Frontend consumers:** future original design prototype VehicleDetail edit action.

### `DELETE /api/vehicles/:id` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` vehicle ID. **Query / body:** none.
- **Success:** `204` with no body.
- **Errors:** `401`, `404`.
- **Known limitations:** no delete UI is exposed in WP8. Telemetry,
  maintenance, and alerts cascade when a vehicle is deleted.
- **Frontend consumers:** future original design prototype Vehicles delete action.

### `POST /api/vehicles/:id/telemetry` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo producer.
- **Params:** `id` vehicle ID. **Query:** none.
- **Body:** `Telemetry point`; `lat`, `lng`, and `speed` required.
- **Success:** `201` with `{ "vehicleId": string, "telemetry": TelemetryPoint }`.
- **Errors:** `400`, `401`, `404`.
- **Known limitations:** JWT authentication identifies the Demo producer; a
  production hardware/device identity scheme is outside the Demo claim.
- **Frontend consumers:** Demo simulator/data source; no browser write consumer.

### `GET /api/vehicles/:id/status` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `id` vehicle ID. **Query / body:** none.
- **Success:** `200` with vehicle ID, status, speed, mileage, fuel, coordinates,
  geofence status, and last-seen timestamp.
- **Errors:** `401`, `404`.
- **Known limitations:** status is the latest accepted telemetry point.
- **Frontend consumers:** available for dashboard and detail polling.

### `GET /api/vehicles/:id/history` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `id` vehicle ID.
- **Query:** `limit` optional integer, default `100`, range `1..500`.
- **Body:** none.
- **Success:** `200` with `{ "vehicleId": string, "history": TelemetryPoint[] }`.
- **Errors:** `401`, `404`.
- **Known limitations:** `limit` is clamped to `1..500`; no cursor pagination.
- **Frontend consumers:** `/app/vehicles/:id` map and telemetry table.

## Driver endpoints

### `GET /api/drivers` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params / query / body:** none.
- **Success:** `200` with raw `Driver[]`.
- **Errors:** `401`.
- **Known limitations:** licence and renewal states are calculated from expiry;
  there is no external licence-authority integration.
- **Frontend consumers:** `/app/drivers`.

### `POST /api/drivers` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params / query:** none.
- **Body:** `{ "id": string, "name": string, "licenceNumber": string,
  "licenceExpiry": date, "phone"?: string, "email"?: string }`.
- **Success:** `201` with `Driver`.
- **Errors:** `400`, `401`, `409` duplicate ID or licence.
- **Known limitations:** assignment is performed through the dedicated route.
- **Frontend consumers:** `/app/drivers` add action.

### `GET /api/drivers/:id` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `id` driver ID. **Query / body:** none.
- **Success:** `200` with `Driver`.
- **Errors:** `401`, `404`.
- **Known limitations:** assigned vehicles are current state, not shift history.
- **Frontend consumers:** `/app/drivers/:id`.

### `PUT /api/drivers/:id` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` driver ID. **Query:** none.
- **Body:** any mutable `Driver` field except `id`.
- **Success:** `200` with updated `Driver`.
- **Errors:** `400`, `401`, `404`, `409` duplicate licence.
- **Known limitations:** a name change is propagated to assigned vehicle
  display fields in the same transaction.
- **Frontend consumers:** `/app/drivers/:id` edit action.

### `DELETE /api/drivers/:id` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` driver ID. **Query / body:** none.
- **Success:** `204` with no body.
- **Errors:** `401`, `404`, `409` active assignment prevents deletion.
- **Known limitations:** vehicles must be unassigned first.
- **Frontend consumers:** `/app/drivers/:id` delete action.

### `PUT /api/drivers/:id/vehicles` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` driver ID. **Body:** `{ "vehicleIds": string[] }`.
- **Success:** `200` with the updated driver and assigned vehicles.
- **Errors:** `400`, `401`, `404` driver or vehicle not found.
- **Known limitations:** replaces the complete assignment set; one vehicle can
  have only one current driver.
- **Frontend consumers:** `/app/drivers/:id` assignment dialog.

## Maintenance endpoints

### `GET /api/vehicles/:id/maintenance` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `id` vehicle ID. **Query / body:** none.
- **Success:** `200` with `{ "vehicleId": string, "tasks": MaintenanceTask[] }`.
- **Errors:** `401`, `404`.
- **Known limitations:** status is calculated from mileage/date rules.
- **Frontend consumers:** VehicleDetail and `/app/maintenance`.

### `POST /api/vehicles/:id/maintenance` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` vehicle ID. **Query:** none.
- **Body:** `{ "type": string, "dueMileage"?: number, "dueDate"?: date }`.
- **Success:** `201` with `Maintenance task`.
- **Errors:** `400`, `401`, `404`.
- **Known limitations:** predictive state is deterministic threshold logic.
- **Frontend consumers:** `/app/maintenance` add action.

### `PUT /api/vehicles/:id/maintenance/:taskId` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Body:** mutable `type`, `dueMileage`, and `dueDate` fields.
- **Success:** `200` with updated task. **Errors:** `400`, `401`, `404`.
- **Frontend consumers:** `/app/maintenance` edit action.

### `POST /api/vehicles/:id/maintenance/:taskId/complete` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** vehicle `id` and numeric `taskId`. **Query:** none.
- **Body:** optional `{ "mileage": number }`; current vehicle mileage is used
  when omitted.
- **Success:** `200` with completed `Maintenance task`.
- **Errors:** `400`, `401`, `404` vehicle/task not found.
- **Known limitations:** completion updates the vehicle's last-service mileage.
- **Frontend consumers:** `/app/maintenance` complete action.

### `DELETE /api/vehicles/:id/maintenance/:taskId` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` vehicle ID; `taskId` persistent maintenance ID.
- **Query / body:** none.
- **Success:** `204` with no body.
- **Errors:** `401`, `404` vehicle/task not found.
- **Known limitations:** hard delete; no archive state.
- **Frontend consumers:** `/app/maintenance` delete action.

### `GET /api/maintenance` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Query:** optional effective `status`. **Params / body:** none.
- **Success:** `200` with enriched `MaintenanceTask[]` including vehicle data.
- **Errors:** `401`.
- **Known limitations:** status is rule-based, not machine-learning output.
- **Frontend consumers:** `/app/maintenance`.

## Alert, geofence, and route endpoints

### `GET /api/alerts` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params / body:** none.
- **Query:** optional `severity`, `type`, `state`, and `vehicleId` filters.
- **Success:** `200` with persisted alerts containing `id`, vehicle and driver
  identity, `type`, `severity`, `message`, `state`, and `recordedAt`.
- **Errors:** `401`.
- **Known limitations:** state is currently read-only; acknowledgement is not
  implemented. Alerts are created only by supported telemetry and geofence rules.
- **Frontend consumers:** `/app/alerts` and dashboard recent alerts.

### `GET /api/alerts/types` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params / query / body:** none.
- **Success:** `200` with `{ "types": ["overspeed", "low_fuel",
  "geofence_entry", "geofence_exit"] }`.
- **Errors:** `401`.
- **Frontend consumers:** `/app/alerts` filter options.

### Geofence CRUD - IMPLEMENTED

- **Routes:** `GET /api/geofences`, `POST /api/geofences`,
  `GET /api/geofences/:id`, `PUT /api/geofences/:id`, and
  `DELETE /api/geofences/:id`.
- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Body:** a circle uses `{ "name": string, "shapeType": "circle",
  "center": { "lat": number, "lng": number }, "radiusMeters": number }`.
  A polygon uses `{ "name": string, "shapeType": "polygon", "polygon":
  [{ "lat": number, "lng": number }] }` with at least three points.
- **Success:** list `200`, item `200`, create `201`, delete `204`.
- **Errors:** `400` invalid geometry, `401`, `404`, `409` duplicate name.
- **Known limitations:** there is no external geospatial service; containment is
  calculated locally using haversine distance and point-in-polygon logic.
- **Frontend consumers:** `/app/geofences`.

### `GET /api/geofences/:id/check` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; authenticated Demo user.
- **Params:** `id` geofence ID. **Query:** optional `vehicleId`.
- **Success:** `200` with `{ "geofence": Geofence, "states": [{
  "vehicleId", "plate", "driver", "state", "checkedAt" }] }`.
- **Errors:** `401`, `404` geofence or requested positioned vehicle not found.
- **Known limitations:** the check uses each vehicle's latest stored position.
  Telemetry ingestion persists entry/exit transitions and creates matching alerts.
- **Frontend consumers:** `/app/geofences` map and vehicle state list.

### `POST /api/routes/optimize` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params / query:** none.
- **Body:** `{ "stops": [{ "lat": number, "lng": number, "name"?: string }] }`
  with at least two stops.
- **Success:** `200` with `{ "algorithm": "nearest_neighbour_demo",
  "orderedStops": array, "distanceKm": number, "durationMinutes": number,
  "limitations": string }`.
- **Errors:** `400` invalid stops, `401`.
- **Known limitations:** deterministic nearest-neighbour ordering over straight-line
  distance only. It has no roads, traffic, capacity rules, Google, Mapbox, or AI.
- **Frontend consumers:** `/app/routes`.

## Report endpoints

### `GET /api/maintenance/:vehicleId/report` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `vehicleId` vehicle ID. **Query / body:** none.
- **Success:** `200` with `{ "vehicleId": string, "generatedAt": ISODate,
  "summary": { "total": number, "completed": number, "outstanding": number },
  "tasks": MaintenanceTask[] }`.
- **Errors:** `401`, `404` vehicle not found.
- **Known limitations:** JSON only; PDF and CSV export are not implemented.
  Maintenance status is deterministic date/mileage rule output.
- **Frontend consumers:** `/app/reports` maintenance view.

### `GET /api/reports/:vehicleId/trips` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; `admin`, `user`.
- **Params:** `vehicleId` vehicle ID. **Query / body:** none.
- **Success:** `200` with `vehicleId`, `plate`, `generatedAt`, derived `trips`,
  raw stored `history`, and a `limitations` description. Each trip includes
  distance, duration, average/max speed, and point count.
- **Errors:** `401`, `404` vehicle not found.
- **Known limitations:** trips are derived from up to 500 stored telemetry points,
  split on gaps longer than 30 minutes, using straight-line distance. JSON only.
- **Frontend consumers:** `/app/reports` trips and history view.

## Demo endpoint

### `GET /api/demo/status` - IMPLEMENTED

- **Authentication / roles:** bearer JWT; any authenticated Demo user.
- **Params / query / body:** none.
- **Success:** `200` with simulation configuration and runtime state, including
  `enabled`, `running`, `active`, `scenario`, participating/offline vehicle IDs,
  accepted telemetry count, `tickCount`, `lastTickAt`, and a safe error message
  when startup or telemetry delivery failed.
- **Errors:** `401` missing or invalid token.
- **Known limitations:** read-only status only. Runtime start, stop, and scenario
  controls are intentionally not exposed over HTTP.
- **Frontend consumers:** authenticated header Demo indicator.

## Versioning and compatibility notes

- No `/v1` prefix exists. Incompatible changes require an explicit versioning
  decision before implementation.
- Preserve the raw array response from `GET /api/vehicles` while legacy consumers
  depend on it.
- Do not silently rename historical routes. Index-based maintenance operations
  may be deprecated only alongside a documented replacement.
- Future behavior must be backed by real Express state/services or a simulator
  feeding that backend. Frontend-only fabricated responses are not permitted.
