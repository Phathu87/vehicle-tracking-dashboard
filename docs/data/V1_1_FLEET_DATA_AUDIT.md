# Fleet Drive AI Demo v1.1 Fleet Data Audit

> Historical pre-normalisation snapshot. Its findings describe the repository
> before Stage 2 Phases 2.1-2.7 and are superseded by
> `V1_1_STAGE_2_DATA_FREEZE.md`. Do not use this document as the current data
> contract.

Audit date: 2026-09-25
Baseline: `ca0661690f0a36ca5b5597db7140426f7ff52853`
Audited HEAD: `2b8a5c6f2103570db7a1d67de2e1d464ea939fe1`

## 1. Executive Summary

The current SQLite snapshot contains 350 vehicles, 25 drivers, 28,487 telemetry points and 177 unique year/make/model combinations across 14 explicit cities. Vehicle identity, coordinates and core telemetry are well populated, but the dataset is not ready for image or 3D sourcing.

The assignment model is **INSUFFICIENT** for the planned live card. It supports multiple assigned vehicles per driver through `vehicles.driver_id`, but has no separate authorised-assignment entity, current-active vehicle, assignment history or active time range. Every driver has 13 or 14 assigned vehicles, so all 25 current vehicles are `UNKNOWN` with `AMBIGUOUS` confidence.

The fleet seed is also non-deterministic: first-run vehicle make, model, plate and original driver name are chosen with `Math.random()`. A clean database therefore does not guarantee the same asset manifest. Variants, vehicle types, fleet image mappings, driver photos, 3D models, road context and heading are absent.

Status: **DATA AUDIT COMPLETE WITH GAPS**.

## 2. Data Architecture

Storage is Node 22 `node:sqlite`. The default database is the ignored runtime file `server/data/fleet-drive-demo.sqlite`, with foreign keys enabled and WAL mode outside memory. Initialisation uses idempotent `CREATE TABLE IF NOT EXISTS`, one inline `alerts.state` column check, and `app_metadata` seed flags; there is no versioned migration system.

| Entity/table | Role | Source / relationship |
| --- | --- | --- |
| `vehicles` | Current vehicle identity, assigned driver, location and latest state | Seeded from `server/data.js`; authoritative vehicle rows at runtime. |
| `drivers` | Driver identity, licence and contact details | Seeded by grouping `vehicles.driver_id`; authoritative driver rows at runtime. |
| `telemetry` | Append-only bounded position/history samples | Initial six samples per seeded vehicle, then telemetry API/simulator writes. |
| `maintenance` | Scheduled/completed maintenance | Vehicle foreign key with cascade delete. |
| `alerts` | Rule/geofence alerts | Vehicle foreign key with cascade delete. |
| `geofences` | Circle/polygon definitions | Seeded independently. |
| `geofence_vehicle_states` | Latest containment state | Composite geofence/vehicle key. |
| `app_metadata` | Seed completion markers | Prevents reseeding an existing database. |
| `users` | Demo authentication | Independent of fleet assignment. |

Assignment source is `vehicles.driver_id` plus denormalised `vehicles.driver_name`. There is no driver-vehicle join table and `driver_id` has no database foreign-key constraint. Driver APIs derive `assignedVehicles` by querying vehicle rows. `PUT /api/drivers/:id/vehicles` replaces that driver's assignment set and can reassign selected vehicles from another driver.

The runtime database is persistent while its SQLite file remains available. On a clean or ephemeral filesystem it reseeds a different random fleet identity set.

### Vehicle Field Audit

| Desired field | Classification | Finding |
| --- | --- | --- |
| ID | EXISTS | `vehicles.id`, unique primary key. |
| Registration/plate | EXISTS | `vehicles.plate`, unique; 350 populated. |
| Year | EXISTS | 350 populated, 2020–2024. |
| Make | EXISTS | 350 populated. |
| Model | EXISTS | 350 populated. |
| Variant/trim | MISSING | No column or API property. |
| Vehicle type | MISSING | No field or controlled mapping. |
| City | EXISTS | 350 populated. |
| Province | EXISTS | 350 populated. |
| Latitude/longitude | EXISTS | Current row and telemetry. |
| Speed | EXISTS | Current row and telemetry. |
| Heading | DERIVABLE | Not stored; bearing can use consecutive distinct coordinates. |
| Mileage | EXISTS | Current row and telemetry. |
| Fuel | EXISTS | Current row and telemetry. |
| Status | EXISTS | Stored value exists; API derives moving/idle/offline from freshness and speed. |
| Last seen | EXISTS | `last_seen`; 350 populated. |
| Driver/driver ID | EXISTS | One assigned driver per vehicle row; not proof of current operation. |
| Assigned drivers | INCONSISTENT | Can derive a zero/one-item set only; many drivers per vehicle are unsupported. |
| Image | MISSING | No field or fleet mapping. |
| 3D model | MISSING | No field or fleet mapping. |

### Driver Field Audit

| Desired field | Classification | Finding |
| --- | --- | --- |
| ID | EXISTS | `drivers.id`, unique primary key. |
| Name | EXISTS | Populated but only five repeated display names across 25 IDs. |
| First name/surname | INCONSISTENT | Initial-plus-surname strings cannot be reliably split into full names. |
| Photo/avatar | MISSING | UI generates initials placeholders; no photo field. |
| Phone/email | EXISTS | Present for all seeded drivers. |
| Licence number/expiry | EXISTS | Stored and unique where required. |
| Licence status | DERIVABLE | Service derives valid/expiring/expired from expiry date. |
| City/province | MISSING | No driver base or live location fields. |
| Assigned vehicles | DERIVABLE | Derived from `vehicles.driver_id`. |
| Current vehicle/current ID | MISSING | No active assignment concept. |
| Operational status | MISSING | No driver availability/duty state. |

## 3. Driver Count

Total drivers: **25**. All have IDs, names, licence details, phone and email. Current licence state is 19 valid, 3 expiring and 3 expired as of the audit date.

## 4. Vehicle Count

Total vehicles: **350**. IDs and registration plates are unique. One vehicle, `VH-BL-100`, is unassigned; 349 carry an explicit `driver_id` assignment.

The complete inventory is in [V1_1_VEHICLE_INVENTORY.md](V1_1_VEHICLE_INVENTORY.md).

## 5. Unique Vehicle Specifications

There are **177** unique year/make/model combinations. Variant is unknown for all, so the canonical keys deliberately end in `-unknown`. The full grouped inventory is in [VEHICLE_VISUAL_ASSET_MANIFEST.md](../assets/VEHICLE_VISUAL_ASSET_MANIFEST.md) and [vehicle-asset-manifest.json](../assets/vehicle-asset-manifest.json).

Coverage: 15 makes, 42 make/model combinations, five model years and no explicit variant or type values.

## 6. Driver Assignment Model

Classification: **INSUFFICIENT**.

The model can represent one assigned driver per vehicle and many assigned vehicles per driver. It cannot represent multiple authorised drivers per vehicle, separate authorised versus current assignments, current operation, start/end times or history. `driver_name` duplicates driver identity on vehicle rows, and `driver_id` is not a foreign key.

The system does **not** distinguish `ASSIGNED VEHICLES` from `CURRENTLY OPERATED VEHICLE`.

## 7. Drivers With One Vehicle

**0** drivers have exactly one assigned vehicle.

## 8. Drivers With Multiple Vehicles

**25** drivers have multiple assignments: one has 13 and 24 have 14. The complete matrix is in [V1_1_DRIVER_VEHICLE_MATRIX.md](V1_1_DRIVER_VEHICLE_MATRIX.md).

## 9. Drivers With No Vehicle

**0** drivers have no assigned vehicles.

## 10. Ambiguous Current Assignments

**25** drivers have ambiguous current assignments. No current vehicle is guessed from array order, model year, last listing, status or telemetry recency.

## 11. Vehicles With No Driver

**1** vehicle is unassigned: `VH-BL-100`, plate `FS 1808 MW`, a 2020 Hyundai Elantra in Bloemfontein.

## 12. Vehicle Cities

All 350 vehicles have explicit city and province values. Fourteen city labels are represented with 25 vehicles each: Bloemfontein, Cape Town, Durban, Gqeberha, Johannesburg, Kimberley, Louis Trichardt, Mafikeng, Mahikeng, Phalaborwa, Polokwane, Pretoria, Rustenburg and Thohoyandou.

`Mafikeng` and `Mahikeng` are treated as inconsistent labels pending review. All 350 `area` values equal their city and do not provide verified suburb context. Driver live city cannot be derived until a current-active vehicle exists.

Location classification: 350 `EXPLICIT CITY`; 350 have coordinates; 350 have both; 0 coordinates-only; 0 unknown.

## 13. Telemetry Coverage

The snapshot contains **28,487** telemetry rows covering all 350 vehicles.

| Field | Coverage | Classification |
| --- | ---: | --- |
| Latitude/longitude | 28,487 / 28,487 | SUPPORTED |
| Speed | 28,487 / 28,487 | SUPPORTED |
| Timestamp | 28,487 / 28,487 | SUPPORTED |
| Mileage | 28,487 / 28,487 | SUPPORTED |
| Fuel | 28,487 / 28,487 | SUPPORTED |
| Heading | 0 / 28,487 | MISSING |
| Ignition | 0 / 28,487 | MISSING |
| Accuracy | 0 / 28,487 | MISSING |
| Altitude | 0 / 28,487 | MISSING |

Latest stored telemetry is from 2026-09-22. The API therefore correctly classifies all vehicles offline during this audit, even though stored seed/status values remain `online` or `moving`.

## 14. Heading Coverage

**V1.1 TELEMETRY GAP — HEADING**

Heading is not stored or returned. It is **DERIVABLE** for movement samples from previous coordinate to next coordinate; all 350 vehicles have at least one distinct movement vector. Stationary or repeated points need a defined last-known-heading/null policy.

The simulator uses four-point predefined coordinate loops for supported Gauteng cities and synthetic eight-point rings elsewhere. It linearly interpolates between coordinate targets. It does not follow road geometry or perform road matching.

## 15. Driver Image Coverage

Existing photographs: **0**. Initials placeholders: **25**. Unrepresented drivers: **0**.

No driver-specific image files or backend photo fields exist. Future portraits must be fictional/generated, licensed stock, approved existing assets or generic avatars; names must not be used to identify real people.

## 16. Vehicle Image Coverage

Exact fleet/model images: **0**. Generic mapped images: **0**. Placeholders mapped to specifications: **0**. Missing: **177 specifications**.

Repository PNG/SVG files are application screenshots, favicons or framework assets, not fleet-vehicle mappings.

## 17. 3D Asset Coverage

Existing GLB/GLTF/FBX/OBJ assets: **0**. Usable: **0**. Missing: **177 specifications**. Unknown licensing: **0**.

## 18. Naming Inconsistencies

| Current value | Proposed canonical value | Affected records | Status |
| --- | --- | ---: | --- |
| `Mercedes Benz` | `Mercedes-Benz` | 27 vehicles | Proposal only; not modified. |
| `Mafikeng` | `Mahikeng` | 25 vehicles | Requires location review before modification. |

No duplicate vehicle IDs, duplicate plates, missing years, missing makes, missing models or plate-format failures were found. Variant and type are missing for all 350 vehicles. Driver display names are non-unique: 10 `A Khumalo`, 7 `C Van der Merwe`, 3 `D Naidoo`, 3 `G Mabena` and 2 `F Makhale`.

## 19. Data Gaps

Blocking gaps are the non-deterministic seed, absent current-active assignment, missing variant/type, repeated driver identities, no asset registry, no heading, and no road/suburb resolution. See [V1_1_FLEET_DATA_GAPS.md](V1_1_FLEET_DATA_GAPS.md) for affected records and future remedies.

## 20. Asset Requirements

- 177 reviewed 2D vehicle assets if year/make/model remains the approved minimum match.
- Up to 177 reviewed 3D mappings if every specification needs a distinct model; fewer only under an explicitly approved representative strategy.
- 25 driver visual mappings using fictional generated portraits or generic avatars.
- Licence/source metadata for every externally sourced asset.
- Stable canonical vehicle keys and deterministic seed data before sourcing.

Asset sourcing readiness: **NOT READY**.

## 21. Backend Changes Required for v1.1

1. Replace random identity seeding with a deterministic reviewed fleet dataset.
2. Separate authorised assignments from an explicit current-active assignment and retain history.
3. Add referential integrity for driver relationships after migration planning.
4. Add canonical variant and vehicle-type data, with an explicit unknown policy.
5. Add asset registry references and licensing metadata rather than embedding arbitrary URLs.
6. Add heading to the telemetry contract or derive it server-side with stationary semantics.
7. Define road/area reverse-geocoding integration, caching and privacy boundaries.
8. Review fictional driver identities before person-specific assets are generated.

## 22. Recommended Next Work Package

**V1.1-WP2 — Fleet Data Normalisation & Current Assignment Model**

WP2 should make fleet seeding deterministic, canonicalise reviewed names/locations, add variant/type policy, and model authorised versus current vehicle assignments. Visual sourcing should wait until that dataset is stable.
