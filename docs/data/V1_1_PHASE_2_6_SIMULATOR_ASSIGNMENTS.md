# Fleet Drive AI Demo v1.1 - Phase 2.6 Simulator Assignments

## 1. Previous simulator relationship behaviour

The WP11 simulator fetched `GET /api/vehicles` and retained candidates whose
deprecated `vehicles.driver_id` compatibility projection was non-null. That
field represents one active assignment, not the driver currently operating the
vehicle, so simulated movement could imply false driver context. The simulator
also calculated and submitted heading despite the backend heading authority
established in Phase 2.5.

## 2. Current-operation integration

Vehicle-list responses now include a minimal `currentDriver` summary sourced
from `driver_current_vehicles` through `getCurrentDriver`. Simulator selection,
diagnostics, and driver context use only that explicit relationship. The legacy
`driverId` and `driver` properties remain compatibility projections and are not
current-operation evidence.

## 3. Participant policy

The existing deterministic city-balanced selection is preserved. Selection is
performed in two passes:

1. geographically balanced vehicles with an explicit current driver;
2. geographically balanced vehicles without a current driver, only when needed
   to satisfy the configured participant count.

The default 15-participant simulation therefore selects 15 of the 20 explicit
current vehicles. A configured count above 20 may include vehicle-only
participants without assigning drivers to them.

## 4. Driver-operated and vehicle-only behaviour

Vehicles with `currentDriver` retain the existing stopped, idle, moving,
overspeed, and offline schedules. A participant without a current driver stays
stationary during active telemetry ticks, while the existing offline schedule
can still represent connectivity absence. Its telemetry remains vehicle-only;
the application does not describe it as autonomous driving.

The five drivers without a current vehicle remain without operational location
or vehicle context. The simulator never selects another assigned vehicle for
them and never writes `driver_current_vehicles`.

## 5. Heading integration

Simulator payloads now omit heading. They submit coordinates, speed, mileage,
fuel, and timestamp through the existing telemetry API. The Phase 2.5 backend
derives movement heading above 3 metres and preserves the previous valid heading
for stationary updates. This keeps heading canonical in Express/SQLite.

## 6. Offline, overspeed, geofence, and maintenance

Offline behavior remains based on telemetry absence and `lastSeen`; it does not
clear the current driver. Overspeed and geofence rules remain vehicle telemetry
rules. Alert read models now attribute a driver only through the vehicle's
explicit current operation and return null otherwise. Geofence entry/exit and
mileage-driven maintenance behavior are unchanged, and maintenance does not
depend on driver presence.

## 7. Start, stop, and reset semantics

Starting creates an in-memory timer and per-vehicle simulation state. Stopping
clears only that timer. Reset clears only simulator movement/counter state.
None changes driver identities, vehicle identities, assignment pools, or
current-operation rows. Persistent fleet relationships remain outside the
simulator lifecycle.

## 8. Explicit switch compatibility

An explicit Phase 2.4 current-vehicle switch remains authoritative while the
simulator runs. The next candidate refresh reads the new relationship: the old
vehicle returns `currentDriver: null`, the new vehicle returns that driver, and
the simulator does not recreate the old pair. Assignment pools are unchanged.

## 9. Relationship immutability

Focused tests hash driver identity, vehicle identity, assignment relationships,
and current-operation relationships before and after ordinary start/run/reset/
stop activity. Telemetry changes only operational projection fields. The
explicit-switch test is isolated and restores its deterministic starting pair.

## 10. Diagnostics and tests

`GET /api/demo/status` preserves `participatingVehicles` and adds `participants`
entries containing only `vehicleId` and `currentDriverId`. No driver contact data
is exposed in simulator diagnostics.

Tests cover explicit-source participant selection, rejection of legacy
assignment authority, one-driver/one-current-vehicle constraints, the five
no-current drivers, valid vehicle-only telemetry, live driver telemetry,
backend-derived and stationary heading, offline preservation, current alert
attribution, geofence/maintenance compatibility, lifecycle immutability, reset,
and explicit current-vehicle switching.

## 11. Remaining asset work

No frontend card, map, animation, portrait, image, 3D model, or asset manifest
work is included. Asset manifest regeneration remains Phase 2.7.
