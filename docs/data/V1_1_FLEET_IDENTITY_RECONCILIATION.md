# Fleet Identity Reconciliation - Phase 3.3A-R

Project: Fleet Drive AI Demo v1.1
Date: 2026-10-07
Phase: 3.3A-R - Runtime vs Fresh-Seed Fleet Identity Reconciliation
Status: PASS
Asset acquisition readiness: READY, subject to separate owner approval.

## 1. Discovery and Protection

Phase 3.3A compared the 15 Priority A runtime vehicle specifications to the
server/data.js fresh seed and found 15 different make/model identities.
The runtime database and manifests agreed; fresh determinism alone was insufficient.

Before investigation, read-only snapshots captured all 350 vehicle identities,
full driver rows, all assignment rows, all current-operation rows and telemetry
count, plus a byte hash of the runtime database. No runtime database was imported
through write-capable database.js or used as a reconciliation test database.

## 2. Git and Local-Diff Evidence

HEAD is 31843f2928ec368d29fcb984fbd8ded9b811a527 (2026-09-25 topology
consolidation). Historical release ca06616 (2026-09-25) contains the random
server/data.js generator and SQLite seed guards. Earlier history includes
71b294d, 88d06df and b1b9e95; no release commit contains the current Phase 2
deterministic fleet algorithm. That algorithm is present in preserved local
work/stash commit 9a3eaf9, dated 2026-09-28 07:59:15 +0200. Its exact first
edit time is not independently recorded in Git; the Phase 2.1 document dates
the change 2026-09-28. No history was rewritten.

The pre-correction uncommitted diff changed:
- Random make/model selection to a flattened 42-family walk:
  ((index * 17 + 11) % 42), supplied index fleetIndex + cityIndex * 3.
- Random four-digit plates/two-letter suffixes to 1000 + fleetIndex and
  deterministic letter indexes.
- Explicit city codes and canonical Mafikeng -> Mahikeng naming; the 14 city
  block order remained unchanged, including the distinct MF block.
- Mercedes Benz -> Mercedes-Benz; makes/model arrays retain their family
  ordering and membership. This was not an array-order or city-block shift.
- Year calculation moved from database.js into data.js; the formula remains
  2020 + fleetIndex % 5 and all 350 runtime years matched.
- Added null variant, canonical vehicle type and deterministic visual key.
- Driver/contact, assignment/current-operation and heading additions are
  separate Stage 2 work and were preserved.

database.js retained its vehicles_seeded guard and nonempty-table guard.
normalizeFleetIdentity canonicalized names/type/key without overwriting plates
or substituting make/model. Existing rows therefore kept their realized fleet,
while empty databases received the new, unrelated deterministic specification cycle.

## 3. Runtime Fleet Origin

Origin classification: A - original pre-Phase-2 realized random fleet, subsequently
canonicalized. This is supported by source, audit and backup continuity rather
than assuming current runtime is automatically right.

Every available phase backup contains 350 matching runtime vehicle identities
after canonical make/city normalization:
| Backup | Matching normalized identities | vehicles_seeded marker |
| --- | ---: | --- |
| fleet-drive-demo.pre-phase-2-3.sqlite | 350/350 | 2026-09-22T07:09:00.779Z |
| fleet-drive-demo.pre-phase-2-4.sqlite | 350/350 | 2026-09-22T07:09:00.779Z |
| fleet-drive-demo.pre-phase-2-5.sqlite | 350/350 | 2026-09-22T07:09:00.779Z |
| fleet-drive-demo.pre-phase-2-6.sqlite | 350/350 | 2026-09-22T07:09:00.779Z |
| fleet-drive-demo.pre-wp2.sqlite | 350/350 | 2026-09-22T07:09:00.779Z |

The pre-WP2 backup still contains historical Mercedes Benz/Mafikeng spelling;
later backups retain the same plates and model selection with canonical names.
The original marker is 2026-09-22T07:09:00.779Z, earlier than the Phase 2
generator. Vehicle created_at values are synthetic seed timestamps approximately
90 days before seeding, not independent evidence of database creation.
The exact process invocation/person that first seeded this file is unavailable;
no claim is made that timestamp metadata alone proves a complete execution log.

V1_1_FLEET_DATA_AUDIT.md describes the random persistent seed and existing SQLite
fleet. V1_1_VEHICLE_INVENTORY.md explicitly inventories SQLite and contains the
same plates/model choices, with pre-normalization names/types. The Stage 2 freeze
vehicle hash and Stage 2.7 asset manifests describe the preserved runtime fleet.
Phase 2.1's algorithm description and clean-A/clean-B tests instead describe the
new fresh-seed strategy. The freeze conflated those two distinct proofs.

## 4. All-350 Comparison and Pattern

Full pre-correction evidence:
V1_1_FLEET_IDENTITY_COMPARISON.json, one row per stable vehicle ID, with both
runtime and seed plate/year/make/model/city/province/type/key and classification.

| Exclusive classification | Before | After |
| --- | ---: | ---: |
| IDENTICAL | 0 | 350 |
| PLATE_MISMATCH only | 9 | 0 |
| SPEC_MISMATCH only | 0 | 0 |
| LOCATION_MISMATCH only | 0 | 0 |
| MULTIPLE_MISMATCH | 341 | 0 |

Overlapping field-group counts before: plate 350, specification 341, location 0.
All years matched. Specification grouping checks year/make/model/type/key.
The nine matching specifications still had different plates, so none of the
350 complete identities matched. This is replacement of a realized random
selection with a deterministic cycle, not a verified index shift. Historical
random source and backup continuity explain why a new ordering transform cannot
recover the approved fleet's random plate/model choices.

## 5. Source-of-Truth Decision

A. CURRENT RUNTIME FLEET IS AUTHORITATIVE.

The decision was written to this phase document before seed implementation.
Evidence: continuous backup lineage, reviewed runtime inventories, unchanged
freeze vehicle identity hash, current assignments/operations, simulator targets
and approved visual manifests all bind to this fleet. No evidence approves
replacing 350 identities with the distinct clean generator output.

Canonical snapshot is a reproducible encoding of that chosen runtime authority,
not a third invented fleet and not a reason to mutate existing rows.

## 6. Correction

server/data/fleet.json records:
- All 350 stable vehicle IDs, exact plates, years, canonical make/model,
  city/province, null variant, vehicle type and visual key.
- All 25 fictional driver identities with existing licence numbers/expiry,
  Demo-safe phone/email values.
- All 349 active assignment tuples and 21 post-amendment current pairs.

It contains no users, authentication data, secrets, telemetry, runtime timestamps
or SQLite database. The file is source JSON, not a committed runtime database.
The vehicle JSON identity checksum is frozen in the focused regression test:
ca2cccce3726b4a896ab3c7a253f7da40fd2143021b0bf1907a5b48432f626be.

server/data.js reads the canonical source and preserves existing city-block
ordering for generated non-identity telemetry/maintenance starting state.
Clean fleet identity is no longer computed from the alternative model cycle or
plate helper. Compatibility exports remain; getDeterministicVehicle/getRandomVehicle
read canonical make/model records. generatePlate remains a generic compatibility
utility but does not determine fleet seed identity.

database.js inserts canonical values only when clean/missing identity is seeded.
New driver inserts use the canonical licence/expiry values; previously a different
fresh expiry formula could reproduce itself while not matching current drivers.
Clean assignment/current-operation inputs now use canonical tuples. Existing
seed guards and legacy-migration behavior remain; no runtime migration was executed.
No route, response shape, authentication policy or telemetry contract changed.

## 7. Relationship and Amendment Preservation

Current authoritative state:
350 vehicles; 25 drivers; 349 active assignments; 21 current operations.

20 is the historical pre-amendment Stage 2 freeze baseline.
21 is the approved post-freeze state after DRV-015 received its existing
authorised current vehicle; no new assignment or simulator participant was added.
Freeze and Phase 2.1 documents now include explicit corrective/historical notes
without erasing prior phase evidence.

DRV-015 remains Tshifhiwa Netshanda, Priority B, simulator NO.
Current vehicle: VH-JO-114, 2024 Hyundai Elantra, GP 7973 TB, SEDAN,
Johannesburg. Both independent clean seeds reproduce that amendment.

## 8. API, Frontend, Tests and Planning Dependencies

Existing API/Postman examples use stable IDs such as VH-JO-100; no endpoint
rename or request shape change is needed. Some live-card examples are expressly
shape-only and do not override fleet identity. Current frontend obtains vehicle
and driver data through Express, not a fixed make/model identity import.
The vehicle API invariants and assignment/current-operation tests use IDs,
counts and field types. Approved screenshots, asset planning and driver/vehicle
pair matrices depend on the runtime model/plate choices and must not be
silently changed. No frontend runtime or portrait file was edited.

Existing vehicle/driver identity tests still verify repeatability. New focused
tests add canonical checkpoint equality, field-by-field export checks, two clean
database comparisons, restart comparisons, full driver/licence/contact identity,
349 assignments, 21 current operations, DRV-015, Priority A 15/15 and runtime
byte-hash protection. No image snapshots or unrelated test infrastructure added.

## 9. Improved Authoritative Reproducibility Verification

verify:seed now checks both:
REPRODUCIBLE WITH ITSELF and REPRODUCES AUTHORITATIVE FLEET.

Two independent isolated temporary databases are initialized, read-only snapshots
are compared with the canonical source, and each is restarted and rechecked.
The live NORMAL_FLEET selector uses their actual database positions plus explicit
currentDriver relationships. All 15 selected IDs/specifications/plates/drivers
must match the independent Priority A acquisition manifest.

When the local runtime database exists, the script reads it only, compares its
identity snapshot with the canonical source and verifies its file hash unchanged.
When absent in a clean checkout, it reports NOT PRESENT rather than fabricating
runtime-preservation evidence. Two clean seeds are still checked against Git source.
Temporary cleanup is limited to the unique created directory after path validation.

An initial new-test harness attempt omitted coordinates from selector input and
returned zero participants. Only the harness was corrected to read actual isolated
seed positions; no simulator filtering or backend behavior was weakened.

## 10. Regression Results

| Check | Result |
| --- | --- |
| Focused reconciliation tests | PASS: 2/2 |
| Clean seed A vs authoritative | PASS: 350/350 |
| Clean seed B vs authoritative | PASS: 350/350 |
| Repeatability and both restarts | PASS |
| Full backend suite | PASS: 57/57 |
| validate:data | PASS: zero failures |
| verify:seed authoritative equivalence | PASS |
| Dedicated simulator tests | PASS: 7/7 |
| Priority A acquisition identities | PASS: 15/15 |
| DRV-015 amendment | PASS |
| Frontend lint | PASS |
| Frontend tests | PASS: 5/5 |
| Frontend production build | PASS: Vite 6.4.3 |
| Existing asset audit --check | PASS |
| Portrait validator | PASS: 19 assets; Priority A 15/15 |
| git diff --check | PASS; line-ending warnings only |
| Runtime protection snapshots | PASS: identical before/after |
| Frontend, portraits, legacy and vehicle-asset tree hashes | PASS: unchanged |

Backend tests use :memory: or isolated temporary databases. Frontend compatibility
checks were run because clean-seed API identity values changed to the intended
runtime fleet. No package installation or dev server was needed.

## 11. Before/After Protection Evidence

Hashes below use stable ordered row projections (JSON.stringify) or file bytes.
The vehicle projection is id,plate,year,make,model,city,province,variant,vehicleType,
visualKey; driver/assignment/current-operation protection uses full SQLite rows.
Runtime file byte equality is a stronger additional check covering all persisted
state. Read-only SQLite may touch shared-memory bookkeeping; no logical data or
runtime main database bytes were changed.

| Protected state | Before | After |
| --- | --- | --- |
| databaseSha256 | ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4 | ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4 |
| vehicles | ca2cccce3726b4a896ab3c7a253f7da40fd2143021b0bf1907a5b48432f626be | ca2cccce3726b4a896ab3c7a253f7da40fd2143021b0bf1907a5b48432f626be |
| drivers | 108e535055cee7a57d1f1a6b2b6eba0007b6c6cf35fd7a966c94797d3ee85178 | 108e535055cee7a57d1f1a6b2b6eba0007b6c6cf35fd7a966c94797d3ee85178 |
| assignments | 518eacdd0ad86156e9316c9774b9480ce3e38592959486984e44bb680829494d | 518eacdd0ad86156e9316c9774b9480ce3e38592959486984e44bb680829494d |
| currentOperations | c20eac62fa5e0ff7563f16720de1ebb1c8607b702cc5e3e4ddc0d9009f8a374a | c20eac62fa5e0ff7563f16720de1ebb1c8607b702cc5e3e4ddc0d9009f8a374a |
| telemetryRows | 28487 | 28487 |

Runtime telemetry: 28,487 -> 28,487. Clean databases retain their normal seed
history; no attempt was made to copy or rewrite runtime telemetry.

## 12. Documentation and Asset Readiness

Vehicle/driver asset inventories were NOT regenerated: their authoritative
identity did not change and audit --check still passes. Acquisition JSON records
the resolved mismatch, preserves pre-correction differences as history, points
to the canonical source and keeps acquisitionAuthorized false. The matrix
removes the reconciliation block but still requires owner approval. The original
3.3A report retains its PARTIAL findings with a prominent post-correction note.

Created:
- server/data/fleet.json.
- server/test/fleet-reconciliation.test.js.
- docs/data/V1_1_FLEET_IDENTITY_COMPARISON.json.
- docs/data/V1_1_FLEET_IDENTITY_RECONCILIATION.md.

Modified:
- server/data.js.
- server/database.js.
- server/scripts/verifyDeterministicSeed.js.
- docs/data/V1_1_PHASE_2_1_DETERMINISTIC_FLEET.md.
- docs/data/V1_1_STAGE_2_DATA_FREEZE.md.
- docs/assets/V1_1_PRIORITY_A_VEHICLE_ACQUISITION_MANIFEST.json.
- docs/assets/V1_1_PRIORITY_A_VEHICLE_ACQUISITION_MATRIX.md.
- docs/assets/V1_1_PHASE_3_3A_VEHICLE_ACQUISITION_PLAN.md.

Pre-existing Stage 2/3 changes remain uncommitted and were preserved. No secrets
or runtime databases staged or committed.

## 13. Acceptance Decision

All corrective acceptance gates PASS. All 350 IDs and plates preserved.
Clean seeds now reproduce the approved fleet, not just each other.
Database/telemetry preserved; no portrait, map or UI changes.
Vehicle images searched/downloaded/generated/integrated: 0.
No 3D assets acquired. No commit, push or deployment.

Recommended next phase: 3.3B - Priority A Vehicle 2D Acquisition - Batch 1.
Safe to proceed: YES, only after explicit acquisition approval.
STOP after this reconciliation.
