# Fleet Drive AI Demo v1.1 - Stage 2 Data Freeze

Date: 2026-09-30  
Stage: 2 - Fleet Data Normalisation  
Phase: 2.8 - Stage 2 Final Audit and Freeze  
Status: PASS

Post-freeze context: the 20 current-operation pairs and 15/5/5 priority counts
below are the historical pre-amendment baseline. The approved DRV-015 amendment
established 21 current pairs and driver priorities 15/6/4. Phase 3.3A-R then
made the preserved runtime fleet reproducible through server/data/fleet.json.
The original clean-A/clean-B proof did not prove equality to the runtime fleet;
see V1_1_FLEET_IDENTITY_RECONCILIATION.md for the corrected authoritative proof.

This document is the authoritative data baseline for Stage 3 visual asset
sourcing. Earlier fleet audit, gap, matrix and inventory documents are
historical pre-normalisation evidence and do not override this freeze.

## 1. Fleet Identity

- 350 deterministic vehicles
- 350 unique vehicle IDs
- 350 unique registration plates
- 177 unique year/make/model visual specifications
- 42 make/model families
- five deterministic model years, 2020 through 2024
- no invented trim or variant values; all `variant` values are null
- `VH-BL-100` is the one intentionally unassigned vehicle

Vehicle IDs, registrations, year, make, model, city, province, type and visual
key are deterministic seed identity. Runtime telemetry does not alter those
fields.

## 2. Driver Identity

- 25 deterministic fictional drivers
- 25 unique IDs
- 25 unique display names
- 25 unique Demo-safe `example.com` email addresses
- deterministic non-routable Demo phone values
- unique licence numbers and preserved licence expiry data

Licence status is derived by the driver service from `licence_expiry`; it is
not a separately persisted status.

## 3. Canonical Naming

`Mercedes-Benz` is the canonical make spelling. No `Mercedes Benz` values
remain. `Mahikeng` is the canonical city spelling. No `Mafikeng` values remain.

The 13 canonical cities are Bloemfontein, Cape Town, Durban, Gqeberha,
Johannesburg, Kimberley, Louis Trichardt, Mahikeng, Phalaborwa, Polokwane,
Pretoria, Rustenburg and Thohoyandou.

## 4. Vehicle Types

The complete approved taxonomy is:

- `CROSSOVER`
- `HATCHBACK`
- `MINIBUS`
- `PICKUP`
- `SEDAN`
- `SUV`
- `TRUCK`
- `VAN`

All 350 vehicles map to one of these eight types. `OTHER` and `UNKNOWN` are not
present in the frozen fleet.

## 5. Assignment Model

`driver_vehicle_assignments` is the authoritative assigned/authorised vehicle
relationship. The frozen state contains 349 active assignments covering all 25
drivers and 349 vehicles. There are no duplicate pairs, orphan relationships
or foreign-key violations.

An assigned vehicle is not necessarily the vehicle being operated now.
`vehicles.driver_id` and `vehicles.driver_name` remain deprecated compatibility
projections only. They must not be used as current-driver authority.

## 6. Current-Operation Model

`driver_current_vehicles` is the sole authority for current vehicle and current
driver state. It contains 20 explicit one-to-one pairs:

- 20 drivers have a current vehicle;
- five drivers have no current vehicle;
- 20 vehicles have a current driver;
- 330 vehicles have no current driver; and
- every current pair belongs to the driver's active assignment pool.

The driver primary key and unique vehicle constraint enforce at most one
current vehicle per driver and at most one current driver per vehicle. Insert
and update triggers reject unassigned current pairs. Assignment deactivation or
deletion clears the matching current row.

## 7. Telemetry Contract

The telemetry path is producer to Express telemetry API to SQLite state/history
to API read models to frontend. A telemetry point supports:

- latitude and longitude;
- speed;
- heading;
- mileage;
- fuel; and
- timestamp (`recorded_at` / API `recordedAt`).

The frozen historical baseline contains 28,487 telemetry rows. Historical
heading was deliberately not backfilled, so all baseline history headings are
null. All 350 latest vehicle projections have a valid derived heading.

## 8. Heading Contract

Heading uses navigation degrees in `0 <= heading < 360`: north 0, east 90,
south 180 and west 270. A valid supplied heading wins. Otherwise the backend
derives heading after movement of at least three metres. Stationary or
jitter-only telemetry preserves the last valid heading. A first point without a
valid supplied heading remains null.

`server/services/bearingService.js` is the single bearing authority. The
frontend and simulator do not calculate canonical heading.

## 9. Simulator Relationship Model

The normal Demo scenario deterministically selects 15 geographically diverse
participants. All 15 have an explicit current driver; no driver appears twice.
Telemetry is submitted through the authenticated Express API, and heading is
derived by the backend. Start, stop and reset do not mutate assignments or
current-operation relationships. Vehicle-only telemetry remains supported and
does not invent a current driver.

Critical scenario verification:

| Scenario | Result | Evidence |
| --- | --- | --- |
| Overspeed | PASS | Simulator and alert tests |
| Offline | PASS | Simulator state and vehicle status tests |
| Geofence entry | PASS | Simulator API transition tests |
| Geofence exit | PASS | Simulator API transition tests |
| Maintenance mileage reaction | PASS | Maintenance and simulator tests |
| Stationary heading | PASS | Heading telemetry tests |
| Explicit current-vehicle switch | PASS | Current-operation service/API tests |

## 10. Database Schema Freeze

| Table | Authoritative responsibility | Key integrity |
| --- | --- | --- |
| `vehicles` | Vehicle identity and latest state projection | Text primary key; unique plate; canonical visual fields; deprecated driver projection |
| `drivers` | Fictional driver identity, contacts and licence | Text primary key; unique licence number |
| `driver_vehicle_assignments` | Assigned/authorised relationships | Driver and vehicle foreign keys with cascade; active-state check; partial unique active-pair index; directional lookup indexes |
| `driver_current_vehicles` | Explicit current operation | Driver primary/foreign key; unique vehicle foreign key; assignment-membership and automatic-clear triggers |
| `telemetry` | Vehicle telemetry history | Vehicle foreign key with cascade; vehicle/time descending index |
| `maintenance` | Vehicle maintenance tasks/history | Vehicle foreign key with cascade |
| `alerts` | Persisted supported alert events/state | Vehicle foreign key with cascade |
| `geofences` | Circle/polygon definitions | Text primary key; unique name; vehicle state held in `geofence_vehicle_states` |

SQLite foreign keys are enabled during initialisation. Additive compatibility
columns are created only when absent. Seed sections use metadata markers and
deterministic manifests for idempotent initialisation. Importing
`server/database.js` is write-capable; tests must therefore use `:memory:` or an
isolated temporary database.

## 11. Asset Manifest Counts

- Fleet vehicles: 350
- Drivers: 25
- Current-operation vehicles: 20
- Normal simulator participants: 15
- Exact year/make/model specifications: 177
- Make/model families: 42
- Vehicle types: 8
- Priority A exact specifications: 15
- Priority A make/model families: 12
- Priority A vehicle types: 6
- Priority B additional exact specifications: 3
- Priority C exact specifications: 159
- Priority A/B/C driver portraits: 15 / 5 / 5
- Minimum complete generic 3D vehicle-type pack: 8

## 12. Priority Definitions

- **Priority A - Live Simulator:** the 15 normal-scenario current
  driver/vehicle pairs.
- **Priority B - Current Operation:** the five additional current pairs not in
  the normal simulator selection.
- **Priority C - Fleet Catalogue:** remaining non-current fleet specifications
  and the five drivers without a current vehicle.

The detailed sourcing checklist is
`docs/assets/V1_1_PRIORITY_ASSET_PACK.md`.

## 13. Missing Visual Fields

The backend does not currently provide physical `driver.photo`,
`vehicle.image` or `vehicle.model3d` files. All manifest assets remain
`MISSING`, with actual exactness `NONE` and a separate `plannedExactness`.
Representative vehicle-type 3D models must never be described as exact digital
twins.

## 14. Missing Geolocation Fields

Road name and reliable suburb/area are unavailable. `currentLocation` provides
stored latitude, longitude, heading, city, province and last-seen state from the
explicit current vehicle. Road matching and reverse geocoding remain later map
work and must not be fabricated.

## 15. Stage 3 Input Contract

Stage 3 may consume:

- `docs/assets/driver-asset-manifest.json`;
- `docs/assets/vehicle-asset-manifest.json`;
- `docs/assets/V1_1_PRIORITY_ASSET_PACK.md`;
- deterministic visual keys;
- vehicle type, year, make and model;
- fictional driver identity; and
- explicit current-operation relationships.

Stage 3 must not alter vehicle identity, driver identity, assignments, current
operation or telemetry semantics unless a separate data correction is
explicitly approved. Asset files and provenance metadata remain presentation
inputs, not fabricated backend records.

## 16. API and Live-Card Contract

Driver detail resolves identity, licence state, assigned vehicles, explicit
current vehicle and derived current location. Vehicle detail resolves assigned
drivers and explicit current driver. Telemetry status/history expose heading,
including valid historical nulls. Five sampled current drivers resolved all
available live-card data without using `vehicles.driver_id` as current-driver
authority.

The Postman collection parses successfully, uses `{{base_url}}` and an empty
`{{token}}`, and contains no hard-coded JWT. It exercises current-vehicle
mutation, telemetry/heading and simulator status endpoints. Field-level
response semantics remain authoritative in `docs/api/API_REFERENCE.md` and
`docs/api/DRIVER_VEHICLE_LIVE_CARD_CONTRACT.md`.

## 17. Runtime Data Preservation

The runtime database was read-only for validators and manifest/freeze audits.
The complete backend suite used `DATABASE_PATH=:memory:` and deterministic seed
verification used temporary SQLite files.

Before and after values were unchanged:

| Evidence | Frozen value |
| --- | --- |
| Vehicle identity SHA-256 | `41c1db98652b66cf8357173d7920f30f19f2dba98108f51d2eebf7345984cff8` |
| Driver identity SHA-256 | `c51cbb21f81306823b6d2b484f4c60da346349aa2f0dff3ebc73f58f8f0d281c` |
| Active assignment SHA-256 | `eafdc07ed3e618f48c973027c4dfdc6532b273924c00ee680e17ceea5e515e8b` |
| Current-operation SHA-256 | `ed0c240f613e73b05dd2acf09424f7fbdc4d03101601222e666af5a71657b31f` |
| Telemetry row count | `28487` |

## 18. Regression Results

| Check | Result |
| --- | --- |
| Backend full suite | PASS - 54/54 |
| Read-only fleet validator | PASS - zero failures |
| Deterministic clean seed | PASS - two independent snapshots identical |
| Asset manifest reconciliation | PASS |
| Frontend lint | PASS |
| Frontend tests | PASS - 2/2 |
| Frontend production build | PASS |
| Postman JSON and token safety | PASS |
| `git diff --check` | PASS |

The first sandboxed Vite build attempt encountered the managed Windows
esbuild parent-directory access restriction. The same unchanged source built
successfully with approved elevated filesystem access.

## 19. Worktree Classification

No Stage 2 file is unexplained. Several files span phases because later phases
extended the same schema, API and tests.

| Classification | Files |
| --- | --- |
| 2.1 | `server/data.js`, `server/test/fleet-identity.test.js`, `docs/data/V1_1_PHASE_2_1_DETERMINISTIC_FLEET.md` |
| 2.2 | `server/test/driver-identity.test.js`, `docs/data/V1_1_PHASE_2_2_DRIVER_IDENTITY.md` |
| 2.3 | `server/services/assignmentService.js`, `server/test/assignment-model.test.js`, `docs/data/V1_1_PHASE_2_3_ASSIGNMENT_SCHEMA.md` |
| 2.4 | `server/routes/driverRoutes.js`, `server/test/current-operation.test.js`, `docs/data/V1_1_PHASE_2_4_CURRENT_VEHICLE.md` |
| 2.5 | `server/services/bearingService.js`, `server/test/heading-telemetry.test.js`, `docs/data/V1_1_PHASE_2_5_HEADING_TELEMETRY.md` |
| 2.6 | `server/services/demoFleetSimulator.js`, `server/test/simulator-current-assignments.test.js`, `docs/data/V1_1_PHASE_2_6_SIMULATOR_ASSIGNMENTS.md` |
| 2.7 | `scripts/audit-fleet-assets.mjs`, `docs/assets/*`, `docs/api/DRIVER_VEHICLE_LIVE_CARD_CONTRACT.md` |
| 2.1-2.5 shared | `server/database.js`, `server/package.json`, `server/services/driverService.js`, `server/services/vehicleService.js`, `server/controllers/driverController.js`, `server/controllers/vehicleController.js`, `server/test/vehicles.test.js`, `server/test/drivers-maintenance.test.js`, `server/scripts/validateFleetData.js`, `server/scripts/verifyDeterministicSeed.js` |
| 2.3-2.6 shared | `docs/api/API_REFERENCE.md`, `Fleet Drive AI Demo.postman_collection.json`, `server/services/alertService.js`, `server/test/public-demo-policy.test.js`, `server/test/simulator.test.js` |
| Pre-existing historical/reference | `docs/data/V1_1_FLEET_DATA_AUDIT.md`, `docs/data/V1_1_FLEET_DATA_GAPS.md`, `docs/data/V1_1_DRIVER_VEHICLE_MATRIX.md`, `docs/data/V1_1_VEHICLE_INVENTORY.md`, `docs/maps/V1_1_MAP_REQUIREMENTS.md` |
| 2.8 | This freeze document and superseded-document banners/contract-description clarifications |

There are no `UNKNOWN` worktree changes.

## 20. Remaining Non-Blocking Limitations

### Stage 3 - Visual Assets

- 25 fictional driver portraits
- exact/model-family 2D vehicle imagery
- licensed or created exact/family/generic 3D vehicle assets
- completed provenance, licence and attribution metadata

### Later Map Stage

- road and suburb/area resolution
- road matching and reverse geocoding
- MapLibre and Three.js integration
- smooth marker interpolation and follow camera

### Future Commercial

- production telematics hardware and GPS feeds
- production AI models
- multi-tenancy and billing
- production mobile-app distribution

## 21. Freeze Decision

Stage 2 is internally consistent, deterministic, reproducible and ready as the
input contract for separately approved Stage 3 visual asset acquisition. No
assets were searched, downloaded or generated. No map libraries were added.
No deployment, commit or push occurred in Phase 2.8.
