# Phase 2.3 - Driver and Vehicle Assignment Schema

## 1. Previous representation

The Demo previously stored one driver reference on each vehicle in
`vehicles.driver_id`, with `vehicles.driver_name` as a denormalised display
value. Driver detail derived its assigned vehicle list directly from those
vehicle rows. This supported the legacy frontend but could not represent a
vehicle authorised for more than one driver and did not enforce a driver
foreign key.

## 2. New schema

`driver_vehicle_assignments` is the authoritative assignment relationship.
Each row contains an integer ID, `driver_id`, `vehicle_id`, `assigned_at`,
`unassigned_at`, and `is_active_assignment`. Driver and vehicle foreign keys
use `ON DELETE CASCADE`. A partial unique index prevents more than one active
row for the same driver and vehicle pair. Driver and vehicle lookup indexes
support both directions of the many-to-many relationship.

The table naturally retains deactivated rows as limited relationship history.
It is not a scheduling or workforce-history system.

## 3. Relationship semantics

An active assignment means the driver is assigned or authorised to operate the
vehicle. It does not mean the driver is operating that vehicle now. A driver
may have zero or more assigned vehicles, and a vehicle may have zero or more
assigned drivers.

Current-operation state is intentionally absent. No current vehicle or current
driver is selected or inferred in this phase.

## 4. Assignment invariants

- Every relationship references an existing driver and vehicle.
- A driver and vehicle pair has at most one active relationship.
- An active relationship has no `unassigned_at` timestamp.
- An inactive relationship has an `unassigned_at` timestamp.
- Malformed and nonexistent IDs are rejected by controlled service operations.
- The clean Demo contains 25 drivers, 350 vehicles, and 349 active assignments.
- Driver pools remain at the established 13 or 14 vehicles.
- `VH-BL-100` remains unassigned.

## 5. Migration strategy

On a database with valid legacy `vehicles.driver_id` values, initialisation
creates the equivalent active assignment rows without changing vehicle or
driver identities. Databases containing the premature later-phase seed marker
are rebuilt to the established deterministic legacy mapping: vehicle suffixes
`100` through `124` map to `DRV-001` through `DRV-025` across each city block,
except `VH-BL-100`, which remains unassigned.

The `phase_2_3_assignments_seeded` metadata marker makes subsequent startup
idempotent. The deterministic assignment timestamp is
`2026-09-28T00:00:00.000Z`.

## 6. Backward compatibility

The following existing consumers were inspected:

- Write paths: vehicle create/update `driverId` and
  `PUT /api/drivers/:id/vehicles`.
- Read paths: driver list/detail, vehicle list/detail, alerts, dashboard models,
  maps, vehicle tables, and driver assignment views.
- API paths: driver detail and assignment replacement, vehicle create/update,
  and vehicle detail.
- Simulator path: the WP11 simulator filters eligible vehicles using the
  legacy `vehicle.driverId` projection.
- Test paths: vehicle CRUD, driver/maintenance CRUD, data integrity, simulator,
  and assignment-focused tests.

Driver detail now reads `assignedVehicles` from the assignment service.
Vehicle detail exposes `assignedDrivers`. Existing singular vehicle driver
fields remain available so current frontend and simulator consumers continue
to work.

## 7. `vehicles.driver_id` transition policy

`vehicles.driver_id` and `vehicles.driver_name` are retained and deprecated as
a single active-assignment compatibility projection. They are not an
independent source of truth and do not mean current operation.

Assignment mutations keep the projection valid. When a projected relationship
is removed, the projection moves deterministically to the lowest-ID remaining
assigned driver, or becomes null when no active assignment remains. Legacy
vehicle writes may select a preferred projected driver only after ensuring the
authoritative assignment exists.

## 8. Unassigned vehicle handling

`VH-BL-100` has no assignment row and keeps null legacy driver fields. No
fallback driver is invented. An unassigned vehicle is valid Demo fleet state.

## 9. API behaviour

- `GET /api/drivers/:id` preserves `assignedVehicles`,
  `assignedVehicleCount`, and `assignedPlates`, sourced from the new table.
- `PUT /api/drivers/:id/vehicles` replaces that driver's complete active
  authorisation set.
- `GET /api/vehicles/:id` adds `assignedDrivers` and does not expose
  `currentDriver`.
- Singular `driverId` and `driver` vehicle fields are the deprecated projection
  described above.

## 10. Tests and validation

Focused coverage verifies table creation, foreign keys, malformed and missing
IDs, duplicate prevention, multiple vehicles per driver, multiple drivers per
vehicle, bidirectional reads, membership checks, preserved seed counts, the
unassigned vehicle, legacy projection consistency, and driver API compatibility.

The read-only validator checks assignment orphans, duplicate active pairs,
counts, assignment pool sizes, projection coverage, and unassigned state. The
clean-seed verifier compares ordered driver/vehicle assignment pairs across two
independent databases.

## 11. Deferred current-operation model

The actively operated vehicle is deferred to Phase 2.4. Heading is deferred to
Phase 2.5, simulator current-assignment integration to Phase 2.6, and asset
manifest regeneration to Phase 2.7. Phase 2.3 makes no operational inference
from assignment order, timestamps, telemetry, or the compatibility projection.
