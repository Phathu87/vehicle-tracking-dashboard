# Phase 2.4 - Current Vehicle Assignment

## 1. Problem

Phase 2.3 established which vehicles a driver is authorised to operate, but it
did not identify the vehicle being operated now. Selecting the first assigned
vehicle or using the deprecated `vehicles.driver_id` projection would confuse
authorisation with live operation.

## 2. Assignment and current-operation semantics

`driver_vehicle_assignments` remains the authoritative many-to-many
authorisation pool. `driver_current_vehicles` independently records at most one
explicit current vehicle for a driver and at most one current driver for a
vehicle. Assignment order, telemetry recency, city, and compatibility fields
are never used to infer current operation.

## 3. Schema

`driver_current_vehicles` contains:

- `driver_id`, primary key and driver foreign key
- `vehicle_id`, unique and vehicle foreign key
- `started_at`, operation start timestamp
- `updated_at`, last explicit set timestamp

Both foreign keys use `ON DELETE CASCADE`.

## 4. Constraints

The driver primary key enforces zero or one current vehicle per driver. The
unique vehicle constraint enforces zero or one current driver per vehicle.
Insert and update triggers require a matching active assignment. Assignment
deactivation/deletion triggers clear the matching current row as a final
integrity safeguard.

## 5. Deterministic Demo policy

The clean seed uses an explicit reviewed manifest of 20 driver/vehicle pairs
and leaves five named driver IDs without a current vehicle, demonstrating an
honest available/off-duty state. The manifest is deterministic, uses only valid
assigned pairs, shares no vehicle, and is not derived from assignment order,
city, telemetry, or any deprecated compatibility field.

`VH-BL-100` remains unassigned and never receives a current driver.

## 6. Service API

The assignment service provides `getCurrentVehicle(driverId)`,
`getCurrentDriver(vehicleId)`, `setCurrentVehicle(driverId, vehicleId)`,
`clearCurrentVehicle(driverId)`, and `clearCurrentDriver(vehicleId)`.
Switching uses an immediate SQLite transaction and an upsert keyed by driver.

## 7. Conflict policy

If another driver already has the requested vehicle current,
`setCurrentVehicle` rejects the request with `VEHICLE_ALREADY_CURRENT`. The
vehicle is never silently stolen. A vehicle outside the driver's active
assignment pool is rejected with `CURRENT_VEHICLE_NOT_ASSIGNED`.

## 8. Clear policy

Clearing deletes only the current-operation row. It does not remove the driver,
vehicle, assignment, licence, identity, or telemetry.

## 9. Unassignment interaction

The selected policy is automatic clearing. Removing an assignment first clears
the same driver/vehicle current row within the assignment mutation transaction,
then deactivates the assignment. Database triggers also prevent invalid current
state when assignment rows are changed directly.

## 10. Driver read model

Driver responses add `currentVehicle` and `currentLocation`. Both are null when
no operation is active. `assignedVehicles` remains the full authorisation pool.

## 11. Vehicle read model

Vehicle detail adds `currentDriver`, which is null when no operation is active.
`assignedDrivers` remains the complete authorisation relationship.

## 12. Current-location derivation

`currentLocation` is derived at read time through driver to current vehicle to
the vehicle's latest stored latitude, longitude, city, province, and last-seen
timestamp. No duplicate driver coordinates are persisted. Road/suburb lookup
and reverse geocoding are not implemented.

## 13. Legacy `driver_id` policy

`vehicles.driver_id` remains a deprecated single-assignment compatibility
projection. It is not read by current-operation services and does not mean
current driver.

## 14. Migration

Initialization creates the table and integrity triggers, then seeds the fixed
20-row scenario once under `phase_2_4_current_operations_seeded`. Existing
vehicle identity, driver identity, and all 349 Phase 2.3 assignment pairs remain
unchanged. Repeated initialization is idempotent.

## 15. Tests

Focused tests cover schema existence, deterministic seed counts, assignment
membership, one-to-one constraints, malformed and missing records, conflicts,
atomic switching, safe clearing, automatic clearing on unassignment, null read
states, API mutation routes, vehicle and driver read models, and current-location
derivation. The validator checks current-operation orphans, duplicates,
assignment membership, and the unassigned vehicle. The clean-seed verifier
compares current-operation pairs across two independent databases.

## 16. Deferred simulator integration

The simulator continues to use its existing compatibility eligibility logic.
It does not change drivers or condition telemetry on current-operation state.
Heading remains Phase 2.5, simulator integration Phase 2.6, and asset manifest
regeneration Phase 2.7.
