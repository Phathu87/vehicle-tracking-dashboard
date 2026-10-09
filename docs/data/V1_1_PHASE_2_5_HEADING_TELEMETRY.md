# Fleet Drive AI Demo v1.1 - Phase 2.5 Heading Telemetry

## 1. Existing telemetry pipeline

The authoritative path remains `POST /api/vehicles/:id/telemetry` through the
vehicle route, controller validation, `recordTelemetry`, SQLite `telemetry` and
`vehicles` tables, then the vehicle/status/history and driver read models. The
frontend reads those APIs; it does not calculate canonical heading.

`lat`, `lng`, `speed`, `mileage`, `fuel`, `geofence_status`, and `recorded_at`
are stored per telemetry row. The latest projection is stored on the vehicle as
`lat`, `lng`, `speed`, `mileage`, `fuel`, `geofence_status`, and `last_seen`.
API mapping uses `geofenceStatus`, `recordedAt`, and `lastSeen`.

## 2. Heading gap and preserved-work classification

The interrupted work already contained additive `heading` columns, telemetry
mapping, status/history exposure, input validation, and a geodesic initial
bearing formula. Those parts were **VALID**. Exact-coordinate-only stationary
detection and incomplete tests/docs/driver exposure were **PARTIAL**. Separate
bearing functions in database seeding, vehicle service, and simulator code were
**CONFLICTING** with a single authoritative calculation. No heading work was
classified obsolete.

## 3. Bearing algorithm and range

`server/services/bearingService.js` is now the single bearing utility. It uses
the spherical initial-bearing formula with latitude and longitude converted to
radians, then normalizes the result with modulo arithmetic into
`0 <= heading < 360`.

Navigation convention:

- `0` degrees is north.
- `90` degrees is east.
- `180` degrees is south.
- `270` degrees is west.

## 4. Moving policy

A coordinate displacement of at least **3 metres**, calculated with the
haversine distance, is material movement. When no valid incoming heading is
present, material movement derives a new heading from the previous stored point
to the current point.

## 5. Stationary and jitter policy

An unchanged coordinate or displacement below 3 metres does not produce a new
bearing. The service preserves the last valid telemetry heading, then the valid
latest vehicle heading, or uses null. Speed zero does not erase heading because
speed does not establish direction.

## 6. First-point and incoming-heading policy

The first point without a valid supplied heading is stored with `heading: null`;
north is never invented. Telemetry ingestion accepts an optional finite numeric
heading in `0 <= heading < 360`. Precedence is:

1. valid incoming heading;
2. heading derived from material coordinate movement;
3. previous valid heading;
4. latest valid vehicle heading;
5. null.

Invalid external values are rejected rather than clamped. Normalization applies
to internally calculated angles.

## 7. Persistence and historical-data policy

`telemetry.heading` stores each point's heading and `vehicles.heading` stores the
latest projection. The migration is additive. Historical null values are valid
and **NOT BACKFILLED**; no bulk rewrite of historical telemetry was performed.
For an existing vehicle whose latest projection has no heading, startup derives
only `vehicles.heading` from its latest point and the nearest recent point at
least 3 metres away. This narrowly hydrates the current read model without
changing any historical telemetry row. New records gain heading when supplied,
derivable, or preservable.

Validated Phase 2.5 snapshot coverage:

- historical telemetry rows: 28,487;
- historical rows with heading: 0;
- historical rows with null heading: 28,487;
- invalid historical heading rows: 0;
- current vehicle projections with derived latest heading: 350 of 350.

This split is intentional: historical playback remains backward compatible,
while current reads and all newly accepted telemetry can carry heading.

## 8. API and current-driver compatibility

Vehicle list/detail responses expose latest `heading`. The status response
exposes heading with `lat`, `lng`, `speed`, `mileage`, `fuel`, and `lastSeen`.
History points always contain the `heading` property and may return null.
Driver `currentVehicle.heading` and `currentLocation.heading` both come from the
explicit current vehicle; heading is not copied onto the driver record.

## 9. Simulator compatibility

The simulator reuses the same bearing utility and remains compatible with the
ingestion endpoint. The backend also derives heading when a simulator or future
producer omits it. Driver/current-operation selection was not changed.

## 10. Validation and tests

The read-only data validator reports total telemetry rows, heading-present rows,
heading-null rows, and invalid rows. It validates both stored telemetry and
latest vehicle headings without requiring historical coverage.

Focused tests cover eight directions, normalization, range, moving derivation,
first-point null, stationary preservation, sub-3-metre jitter, incoming
precedence, invalid input, historical nulls, latest status/history, driver live
location, and telemetry accepted without heading. Full backend, simulator,
frontend, Postman JSON, and data validation are run at the phase gate.

## 11. Deferred work

This phase adds no map marker rotation, 3D rendering, smooth interpolation,
follow-camera behavior, road matching, reverse geocoding, or simulator
current-assignment integration. Those remain later v1.1 work.
