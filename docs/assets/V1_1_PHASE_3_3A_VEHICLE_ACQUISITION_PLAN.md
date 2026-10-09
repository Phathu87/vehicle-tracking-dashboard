# Phase 3.3A Vehicle Acquisition Plan

Project: Fleet Drive AI Demo v1.1
Date: 2026-10-07
Phase: 3.3A - Priority A Vehicle 2D Acquisition Manifest & Exact Vehicle Verification
Status: PARTIAL
Phase 3.3B readiness: BLOCKED pending dataset/seed identity reconciliation.

Post-phase correction: Phase 3.3A-R resolved the seed mismatch on 2026-10-07.
See docs/data/V1_1_FLEET_IDENTITY_RECONCILIATION.md. Current acquisition readiness
is READY pending separate owner approval. The original PARTIAL findings and
blocked decision below are retained as historical incident evidence, not the
current release decision. The matrix/JSON manifest reflect the corrected state.

This phase is planning and read-only verification only. No external image search,
download, generation, integration, UI edit or backend/data correction occurred.
Only the three Phase 3.3A documents were created.

## Authority and Verification

Read inputs: Stage 2 data freeze and DRV-015 amendment; vehicle JSON/Markdown
manifest; Priority Asset Pack; Asset Requirement Summary; Priority A Vehicle
Images specification; acquisition checklist; Phase 3.2E portrait closeout;
Driver Vehicle Live Card Contract; current selector and pure deterministic source.

Read-only SQLite driver_current_vehicles joined to drivers and vehicles defines
currentDriver. The existing selectSimulationVehicles function determines
NORMAL_FLEET participants with limit 15. Deprecated vehicles.driver_id and
assignment ordering are not current-operation authority.

Verified current dataset:
- Fleet 350; drivers 25; active assignments 349.
- Current-operation vehicles 21, not the pre-amendment 20.
- Priority A vehicles/current drivers 15/15; all portraits AVAILABLE and resolve.
- Overall portraits 19/25; Priority B 2/6 and Priority C 2/4.
- Exact specifications 15; make/model families 12; vehicle types 6.
- Unique visual keys 15; unique target paths 15.
- Year, canonical make/model, null variant, type and key match existing manifests.
- Existing audit --check passes; portrait validator passes.

The current-operation count of 21 is explained by the approved DRV-015 amendment,
which added one explicit current pair without adding an assignment or simulator
participant. No attempt was made to restore the historical count of 20.

## Blocking Deterministic-Source Mismatch

The required comparison against server/data.js failed for all 15 selected vehicle
IDs. Runtime identities and manifests agree, but the pure deterministic generator
returns different make/model/visualKey values for every corresponding ID.
Year matches in every case; types sometimes match despite different models.
This is not proof of incorrect visual metadata; it is a conflict between the
persisted/frozen dataset and fresh-seed identity, and cannot be hidden.

| Vehicle ID | Current database/manifest specification | Deterministic source specification | Differing checked fields |
| --- | --- | --- | --- |
| VH-BL-113 | 2023 Mercedes-Benz C-Class | 2023 Honda CR-V | make, model, vehicleType, visualKey |
| VH-CA-101 | 2021 Hyundai H1 | 2021 Volvo XC90 | make, model, vehicleType, visualKey |
| VH-DU-102 | 2022 Toyota Hilux | 2022 Mazda 3 | make, model, vehicleType, visualKey |
| VH-GQ-118 | 2023 Chevrolet Spark | 2023 BMW 320i | make, model, vehicleType, visualKey |
| VH-JO-100 | 2020 Hyundai H1 | 2020 Scania R-Series | make, model, vehicleType, visualKey |
| VH-KI-105 | 2020 Hyundai Elantra | 2020 Audi A4 | make, model, visualKey |
| VH-LO-106 | 2021 Nissan X-Trail | 2021 Toyota Fortuner | make, model, visualKey |
| VH-MA-107 | 2022 Nissan NP200 | 2022 Mercedes-Benz E-Class | make, model, vehicleType, visualKey |
| VH-PH-123 | 2023 Toyota Fortuner | 2023 Hyundai Elantra | make, model, vehicleType, visualKey |
| VH-PO-110 | 2020 Mercedes-Benz C-Class | 2020 Volkswagen Passat | make, model, visualKey |
| VH-PR-103 | 2023 Volkswagen Polo | 2023 Nissan Navara | make, model, vehicleType, visualKey |
| VH-RU-111 | 2021 Ford Focus | 2021 Mazda CX-5 | make, model, vehicleType, visualKey |
| VH-TH-112 | 2022 Volkswagen Polo | 2022 Nissan NP200 | make, model, vehicleType, visualKey |
| VH-CA-115 | 2020 Volkswagen Passat | 2020 Kia Seltos | make, model, vehicleType, visualKey |
| VH-DU-116 | 2021 Scania R-Series | 2021 Ford EcoSport | make, model, vehicleType, visualKey |

No fresh database was initialised. Comparison directly evaluates the pure
server/data.js export by stable vehicle ID, without importing write-capable
server/database.js. That module's existing seedVehicles skips existing rows,
so clean-seed determinism alone does not prove equivalence to this populated
database. The cause/history of this divergence is not established here.

Action required before 3.3B: separately reconcile which identity set future
clean deployments must reproduce and verify that decision. Preserve current
identities unless an owner-approved correction says otherwise. Do not acquire
assets for a silently substituted seed fleet. This phase does not authorise
database migration, seed changes or rewriting Stage 2.

The live-card contract also contains historical statements that all portrait
assets are missing. Current portrait manifests/resolver supersede those statements;
no API response was changed or fabricated. Its example vehicle is shape-only,
not one of the actual acquisition targets.

## Authoritative 15-Vehicle Matrix

The complete driver/portrait/registration/location/visual-key/type/exactness
matrix is V1_1_PRIORITY_A_VEHICLE_ACQUISITION_MATRIX.md. The machine-readable
manifest contains every canonical identity field, relationship and planned path.
The exact specification list is the same 15 rows, not examples or substitutes.

| Driver | Vehicle | Registration | Exact specification | City |
| --- | --- | --- | --- | --- |
| DRV-014 - Lwazi van Wyk | VH-BL-113 | FS 4032 LK | 2023 Mercedes-Benz C-Class | Bloemfontein |
| DRV-002 - Siyabonga Naidoo | VH-CA-101 | WC 1729 AV | 2021 Hyundai H1 | Cape Town |
| DRV-003 - Thandi Mokoena | VH-DU-102 | KZN 2386 SQ | 2022 Toyota Hilux | Durban |
| DRV-019 - Dineo Naidoo | VH-GQ-118 | EC 5453 FL | 2023 Chevrolet Spark | Gqeberha |
| DRV-001 - Ayanda Dlamini | VH-JO-100 | GP 2461 YO | 2020 Hyundai H1 | Johannesburg |
| DRV-006 - Riyaad Ahmed | VH-KI-105 | NC 4067 BP | 2020 Hyundai Elantra | Kimberley |
| DRV-007 - Jenna Smith | VH-LO-106 | LP 8173 RZ | 2021 Nissan X-Trail | Louis Trichardt |
| DRV-008 - Zanele Daniels | VH-MA-107 | NW 1736 CO | 2022 Nissan NP200 | Mahikeng |
| DRV-024 - Jared Jacobs | VH-PH-123 | LP 1029 FY | 2023 Toyota Fortuner | Phalaborwa |
| DRV-011 - Fhulufhelo Makhale | VH-PO-110 | LP 2562 RR | 2020 Mercedes-Benz C-Class | Polokwane |
| DRV-004 - Lerato Nkosi | VH-PR-103 | GP 9915 XB | 2023 Volkswagen Polo | Pretoria |
| DRV-012 - Palesa Mthembu | VH-RU-111 | NW 3062 ML | 2021 Ford Focus | Rustenburg |
| DRV-013 - Charlene van der Merwe | VH-TH-112 | LP 8635 VL | 2022 Volkswagen Polo | Thohoyandou |
| DRV-016 - Sipho Sithole | VH-CA-115 | WC 7236 TX | 2020 Volkswagen Passat | Cape Town |
| DRV-017 - Refilwe Mokoena | VH-DU-116 | KZN 1692 GV | 2021 Scania R-Series | Durban |

Variant remains null / UNKNOWN. No trim, engine, transmission, facelift, colour
or body derivative has been invented. These are database specifications, not
assertions that the future imagery will have verified year/generation fidelity.

## Families, Types and Pack Size

Twelve make/model families are listed in the acquisition matrix, including
years represented, exact vehicle IDs, type and review classification.

| Vehicle type | Priority A vehicles |
| --- | ---: |
| HATCHBACK | 4 |
| MINIBUS | 2 |
| PICKUP | 2 |
| SEDAN | 4 |
| SUV | 2 |
| TRUCK | 1 |

Maximum exact pack: 15 images.
Potential model-family grouping: 12 images, a theoretical lower bound only.
Recommended initial target: 15 individually reviewed specification images.

Three repeated-family comparison candidates: Hyundai H1 (2020/2021),
Volkswagen Polo (2022/2023), Mercedes-Benz C-Class (2020/2023).
H1/Polo are YEAR_VISUAL_REVIEW_REQUIRED. C-Class is NO_REUSE_RECOMMENDED by
default because the wider year gap has no verified generation correspondence.
No generation changes are asserted without evidence. Nine single-spec families
are SAFE_REVIEW_CANDIDATE for individual review, not multi-year reuse permission.

No reuse is approved. Even if H1/Polo later pass reuse review, the conservative
C-Class decision would leave 13 source images, not 12. A 12-image pack additionally
requires reversing that recommendation with evidence. Distinct specification
paths remain separate and must truthfully record any shared source/exactness.

Future acquisition strategies:
| Strategy | Exact-spec vehicle rows | Model families |
| --- | ---: | ---: |
| SEARCH_LICENSED_FIRST | 9 | 9 |
| GENERATE_FIRST | 0 | 0 |
| MODEL_FAMILY_REUSE_CANDIDATE | 4 | 2 |
| REVIEW_REQUIRED | 2 | 1 |

Strategy counts are plans, not claims that licensable media exists. For repeated
families, assess legal suitability and visual fidelity before choosing exact
images or reuse. No public availability, regional generation, or reuse rights
have been researched in this phase.

## Exactness Model

| Value | Required meaning |
| --- | --- |
| EXACT | Correct model/generation visually verified appropriate to database specification; year precision alone does not establish fidelity. |
| MODEL_FAMILY | Correct make/model family; exact year/generation fidelity unverified. |
| GENERATED_REPRESENTATIVE | Generated representation, not manufacturer-authentic photography. |
| VEHICLE_TYPE | Generic body-type fallback. |
| GENERIC | Weaker generic correspondence; not an accepted acquired Priority A image. |
| NONE | No visual available. |

Desired exactness EXACT is only a target. Actual exactness remains NONE for all
planned rows. Approved lower-exactness fallbacks are MODEL_FAMILY,
GENERATED_REPRESENTATIVE and VEHICLE_TYPE, conditional on review and honest
metadata. Until acquisition, keep existing placeholder/text identity; do not
claim new fallback images already exist.

## Presentation Standard

One coherent front three-quarter system:
- Entire vehicle visible, recognisable silhouette, comfortable card-safe margins.
- Consistent front three-quarter direction, camera angle, lighting and scale.
- Transparent background if rights and technical quality permit; otherwise a
  controlled neutral background readable against the current dark UI.
- Do not mix studio cut-outs, forecourt photos, street photos and ads casually.
- No people, dealership banner, price sticker, watermark or unrelated text.
- No fake plate or invented fleet livery. Prefer blank/unreadable registration
  area obtained through permitted source composition/editing, never a fake plate.
- Do not remove watermarks or obscure a licensing restriction.
- Preserve whole-car framing for card/detail and future selected-vehicle panel.

High-quality master target approximately 1600x1067 (3:2); runtime target
1200x800 (3:2), WebP, with alpha when appropriate. Equivalent larger masters
may be accepted. No square forcing or stretching. Target roughly 100-350 KB
per image, with larger sizes requiring visual/performance justification rather
than destructive compression. Strip unnecessary/private metadata.

Target file: public/assets/vehicles/images/<visualKey>.webp.
Future runtime URL: /assets/vehicles/images/<visualKey>.webp.
Paths are plans; no directory or physical vehicle image was created.

## Colour Limitation

colourExactness UNKNOWN; colourRole VISUAL_PRESENTATION.
A consistent visual palette can be chosen later for presentation, but it must
not be written into fleet data or represented as the vehicle's actual colour.
The same applies to trim, wheels, engine/transmission and body derivative.

## Licensing and Provenance Gate

Permitted future source methods:
LICENSED_MANUFACTURER_MEDIA, LICENSED_STOCK, OWNER_CREATED,
GENERATED_REPRESENTATIVE, CUSTOM.

Before any asset is accepted, record:
sourceType, sourceReference, creator, license, commercialUseAllowed,
modificationAllowed, attributionRequired, attribution, retrievedAt, exactness.
Also retain the visualKey/vehicle mapping, master/source reference, modifications
and scope/evidence of permission for repository/public Demo redistribution.

Unknown fields stay null. All 15 manifest rows have null source/creator/licence/
permission/attribution/retrieval fields. No external source URL is present.
A manufacturer-media category is not automatic permission. Check commercial
Demo use, editing/background removal, public delivery, redistribution and any
attribution obligations. If rights cannot be established, reject the source.

Publicly visible is not reusable. Do not treat Google Images, dealership
listings, classifieds, Pinterest or social reposts with unknown licences as
repository assets. This document is an acceptance policy, not proof of rights.

## Generated Representative Policy

If licensed exact media is unavailable/unsuitable after an approved review,
a separately approved generated representation is acceptable:
correct broad body style, reasonable intended family resemblance, no invented
trim claim, no fake manufacturer marketing, plate, caption or watermark.
Generated provenance must identify the generation source/method and permitted
Demo use. Exactness stays GENERATED_REPRESENTATIVE unless separately verified.
This phase neither generates images nor grants approval to do so.

## Driver-Vehicle Mapping and Priority B Boundary

Every future pair uses driverId -> AVAILABLE driverPortraitPath and vehicleId ->
visualKey -> targetPath. Current operation is the binding relationship, not
assignment fallback. All 15 portrait files exist and resolve.

DRV-015 remains Priority B: Tshifhiwa Netshanda, VH-JO-114,
2024 Hyundai Elantra, GP 7973 TB, SEDAN, Johannesburg; simulator NO.
An available portrait does not promote it to A. No Priority B vehicle image
is included or acquired.

## Three-Batch Plan

All batches require dataset reconciliation and separate acquisition approval.
### 3.3B - Batch 1 - Volkswagen and Mercedes-Benz comparison

- VH-TH-112: 2022 Volkswagen Polo; LP 8635 VL; Charlene van der Merwe.
- VH-PR-103: 2023 Volkswagen Polo; GP 9915 XB; Lerato Nkosi.
- VH-CA-115: 2020 Volkswagen Passat; WC 7236 TX; Sipho Sithole.
- VH-PO-110: 2020 Mercedes-Benz C-Class; LP 2562 RR; Fhulufhelo Makhale.
- VH-BL-113: 2023 Mercedes-Benz C-Class; FS 4032 LK; Lwazi van Wyk.

### 3.3C - Batch 2 - Hyundai and Toyota utility/passenger comparison

- VH-JO-100: 2020 Hyundai H1; GP 2461 YO; Ayanda Dlamini.
- VH-CA-101: 2021 Hyundai H1; WC 1729 AV; Siyabonga Naidoo.
- VH-KI-105: 2020 Hyundai Elantra; NC 4067 BP; Riyaad Ahmed.
- VH-DU-102: 2022 Toyota Hilux; KZN 2386 SQ; Thandi Mokoena.
- VH-PH-123: 2023 Toyota Fortuner; LP 1029 FY; Jared Jacobs.

### 3.3D - Batch 3 - Nissan and remaining distinct families

- VH-MA-107: 2022 Nissan NP200; NW 1736 CO; Zanele Daniels.
- VH-LO-106: 2021 Nissan X-Trail; LP 8173 RZ; Jenna Smith.
- VH-RU-111: 2021 Ford Focus; NW 3062 ML; Palesa Mthembu.
- VH-GQ-118: 2023 Chevrolet Spark; EC 5453 FL; Dineo Naidoo.
- VH-DU-116: 2021 Scania R-Series; KZN 1692 GV; Refilwe Mokoena.

Five vehicles in each batch, 15 unique in total. The grouping keeps repeated
families together for year review and related manufacturers together for rights
review. Batch 3 contains distinct remaining families; Scania requires its own
body-style/source review rather than reuse with passenger vehicles.
No batch has been searched, licensed, generated or integrated.

## Future QA Contract

Every accepted physical image must pass:
- [ ] Correct vehicle ID and visual-key mapping.
- [ ] Correct broad model representation and body style.
- [ ] No contradictory model/trim text.
- [ ] No fake registration number.
- [ ] No watermark, dealership/price overlay or unrelated people.
- [ ] Whole-vehicle framing; no stretching or clipped silhouette.
- [ ] Readable against the Fleet Drive dark UI.
- [ ] Sufficient resolution and final WebP decode.
- [ ] Provenance complete and licensing state known.
- [ ] Exactness classified from reviewed visual evidence, not filename/year.
- [ ] Colour remains presentation-only.
- [ ] Responsive card/detail presentation and safe unavailable/error fallback.

These are future acquisition gates, not completed checkboxes.

## Validation and Immutability

Read-only verification passes for current database/manifest identity, explicit
relationships, 15 portraits, counts, null variants, canonical names, visual keys
and type derivation. Direct deterministic-source equivalence FAILS (15 mismatches).
No automatic correction attempted. JSON/schema/count/path/batch checks PASS.
Existing audit --check and portrait validator PASS; git diff --check PASS.

Before/after snapshots compare vehicle identity, full drivers, all assignments,
all current-operation rows and telemetry count. Runtime database byte hash also
matches. Source trees, portrait assets, historical legacy and vehicle-asset tree
are unchanged. Existing working-tree changes were not reverted.
Snapshot JSON is embedded in the acquisition manifest; hashes use ordered
SQLite query rows and SHA256(JSON.stringify(rows)). Tree hashes use sorted
path/file-digest entries, excluding dependencies, .env, builds and runtime DB
files; runtime SQLite itself is separately byte-hashed.
No frontend/backend suites required for documentation-only changes.

Baseline runtime database SHA256:
ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4

Telemetry rows before/after: 28487.
No physical vehicle assets before/after. No generated images or source URLs.
No runtime, simulator, map or portrait changes. No commit, push or deployment.

## Decision

Status PARTIAL: requested planning artifacts complete, current data verified,
but exact identity equivalence to the deterministic source is unresolved.
Safe to proceed with 3.3B acquisition: NO.
Recommended next phase, after separately resolving that blocker:
3.3B - Priority A Vehicle 2D Acquisition - Batch 1.
STOP here and await explicit owner approval.
