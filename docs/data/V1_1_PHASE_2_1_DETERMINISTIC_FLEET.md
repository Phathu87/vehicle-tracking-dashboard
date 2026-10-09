# Phase 2.1 - Deterministic Fleet Identity

Date: 2026-09-28
Baseline: `31843f2928ec368d29fcb984fbd8ded9b811a527`
Status: Complete

Corrective note (Phase 3.3A-R): the original deterministic algorithm below
reproduced itself but not the populated runtime fleet. It is historical.
Clean seed identity now comes from server/data/fleet.json, preserving the
reviewed runtime fleet. verify:seed checks both independent seeds against that
snapshot and the Priority A acquisition contract. See
V1_1_FLEET_IDENTITY_RECONCILIATION.md for provenance and verification.

## Scope

This phase normalises persistent vehicle identity only. Existing uncommitted work concerning drivers, assignments, current vehicles, telemetry heading and later Stage 2 phases was preserved without being expanded here.

## Previous randomness

The previous seed used unseeded `Math.random()` calls to choose make/model, registration-plate numbers and suffixes, drivers, road records and initial speed. Make/model and registration values are persistent identity fields, so clean databases could represent different fleets.

Random identifiers used for users and geofences are runtime entity identifiers, not seeded vehicle identity. Simulator variation is telemetry behavior and remains outside this phase.

## Deterministic strategy

The 350 vehicles are generated as 14 stable 25-vehicle fleet blocks. Each record derives its identity from stable city and fleet indexes:

- IDs use the preserved city block code and item index.
- Plates use province code plus the global fleet index.
- Years cycle deterministically from 2020 through 2024.
- Make/model pairs use a deterministic walk across the 42 verified combinations.
- City and province come from the explicit city-block table.
- Variants remain `null`.

The former `getRandomVehicle` export remains as a compatibility alias, but both it and the internal selector now use the deterministic implementation. No `Math.random()` call controls seeded vehicle identity.

## Canonical names

`Mercedes Benz` is canonicalised to `Mercedes-Benz` in seed data and vehicle create/update paths.

`Mafikeng` is canonicalised to `Mahikeng`. The historical `MF` fleet block remains distinct for stable vehicle IDs, but its 25 records now use the same canonical city name and coordinates as the `MA` block. The result is 14 stable fleet blocks and 13 distinct canonical city names. No other equivalent city-name conflict was found in the reviewed seed list.

## Vehicle-type policy

Vehicle type is derived from the verified make/model table. The current fleet uses eight categories: `HATCHBACK`, `SEDAN`, `SUV`, `CROSSOVER`, `PICKUP`, `VAN`, `MINIBUS`, and `TRUCK`. An unrecognised make/model resolves to `UNKNOWN`; no type is guessed outside the mapping.

## Variant policy

The available source data does not establish trim or variant. Seeded `variant` values therefore remain `null`; no variants were invented.

## Verification

Focused tests verify:

- 350 records and 350 unique IDs;
- 350 unique plates;
- 42 make/model combinations;
- canonical make and city values;
- deterministic years and vehicle types;
- null variants; and
- identical identity snapshots from two independent clean SQLite initialisations.

The full backend suite and available data-integrity commands are run as the phase acceptance gate.

## Deferred work

- Driver identity normalisation: Phase 2.2
- Assignment schema: Phase 2.3
- Current vehicle semantics: Phase 2.4
- Telemetry heading: Phase 2.5
- Simulator relationship integration: Phase 2.6
- Asset manifests: Phase 2.7
