# Fleet Drive AI Demo v1.1 - Priority A 2D Asset Freeze

Owner: Phathutshedzo Rakhunwana
Date: 2026-10-08
Phase: 3.3E - Priority A Vehicle 2D Asset QA & Freeze
Status: PASS - documentation freeze, not a Git commit or deployment.

## Objective and Authority

Independently validate and freeze the 15 Priority A vehicle/driver 2D pairs
as input for separately approved future live-card integration.
Canonical identity: server/data/fleet.json, reconciled to read-only runtime
SQLite. Current operation: driver_current_vehicles. Authorisation:
driver_vehicle_assignments with an active assignment. Deprecated
vehicles.driver_id and assignment array order are NOT current-driver authority.

Historical Stage 2 counts are superseded by the DRV-015 amendment and
Phase 3.3A-R reconciliation: 21 current operations; 15 NORMAL_FLEET simulator
participants; driver priorities A/B/C = 15/6/4. DRV-015 is Tshifhiwa Netshanda,
Priority B, current VH-JO-114, not a simulator participant; excluded here.

Machine-readable pair mapping and before/after evidence:
V1_1_PRIORITY_A_2D_ASSET_FREEZE_VERIFICATION.json.
This freeze and the acquisition manifest/provenance govern current availability.
The original vehicle-asset-manifest.json retains its pre-acquisition planning
inventory with an explicit availability-authority annotation. Its original
MISSING/NONE and desired EXACT fields do not override this freeze.
Do not run the inventory generator as an availability updater.

## Verified 15-Row Pair Matrix

Paths below are public runtime paths, not database fields. For every row,
current-driver association was checked against driver_current_vehicles,
membership in driver_vehicle_assignments, canonical currentOperations,
the live NORMAL_FLEET selector, portrait registry and manifests.
Vehicle identity includes city/province. No arbitrary fallback vehicle used.

| Driver ID | Driver name | Portrait path | Portrait status | Vehicle ID | Plate | Year | Make | Model | Type | City / Province | Visual key | Vehicle image path | Image status | Current-operation relationship | Simulator | Pair QA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-001 | Ayanda Dlamini | /assets/drivers/DRV-001.webp | AVAILABLE | VH-JO-100 | GP 2461 YO | 2020 | Hyundai | H1 | MINIBUS | Johannesburg / Gauteng | 2020-hyundai-h1 | /assets/vehicles/images/2020-hyundai-h1.webp | AVAILABLE | DRV-001 -> VH-JO-100 (explicit) | YES | PASS |
| DRV-002 | Siyabonga Naidoo | /assets/drivers/DRV-002.webp | AVAILABLE | VH-CA-101 | WC 1729 AV | 2021 | Hyundai | H1 | MINIBUS | Cape Town / Western Cape | 2021-hyundai-h1 | /assets/vehicles/images/2021-hyundai-h1.webp | AVAILABLE | DRV-002 -> VH-CA-101 (explicit) | YES | PASS |
| DRV-003 | Thandi Mokoena | /assets/drivers/DRV-003.webp | AVAILABLE | VH-DU-102 | KZN 2386 SQ | 2022 | Toyota | Hilux | PICKUP | Durban / KwaZulu-Natal | 2022-toyota-hilux | /assets/vehicles/images/2022-toyota-hilux.webp | AVAILABLE | DRV-003 -> VH-DU-102 (explicit) | YES | PASS |
| DRV-004 | Lerato Nkosi | /assets/drivers/DRV-004.webp | AVAILABLE | VH-PR-103 | GP 9915 XB | 2023 | Volkswagen | Polo | HATCHBACK | Pretoria / Gauteng | 2023-volkswagen-polo | /assets/vehicles/images/2023-volkswagen-polo.webp | AVAILABLE | DRV-004 -> VH-PR-103 (explicit) | YES | PASS |
| DRV-006 | Riyaad Ahmed | /assets/drivers/DRV-006.webp | AVAILABLE | VH-KI-105 | NC 4067 BP | 2020 | Hyundai | Elantra | SEDAN | Kimberley / Northern Cape | 2020-hyundai-elantra | /assets/vehicles/images/2020-hyundai-elantra.webp | AVAILABLE | DRV-006 -> VH-KI-105 (explicit) | YES | PASS |
| DRV-007 | Jenna Smith | /assets/drivers/DRV-007.webp | AVAILABLE | VH-LO-106 | LP 8173 RZ | 2021 | Nissan | X-Trail | SUV | Louis Trichardt / Limpopo | 2021-nissan-x-trail | /assets/vehicles/images/2021-nissan-x-trail.webp | AVAILABLE | DRV-007 -> VH-LO-106 (explicit) | YES | PASS |
| DRV-008 | Zanele Daniels | /assets/drivers/DRV-008.webp | AVAILABLE | VH-MA-107 | NW 1736 CO | 2022 | Nissan | NP200 | PICKUP | Mahikeng / North West | 2022-nissan-np200 | /assets/vehicles/images/2022-nissan-np200.webp | AVAILABLE | DRV-008 -> VH-MA-107 (explicit) | YES | PASS |
| DRV-011 | Fhulufhelo Makhale | /assets/drivers/DRV-011.webp | AVAILABLE | VH-PO-110 | LP 2562 RR | 2020 | Mercedes-Benz | C-Class | SEDAN | Polokwane / Limpopo | 2020-mercedes-benz-c-class | /assets/vehicles/images/2020-mercedes-benz-c-class.webp | AVAILABLE | DRV-011 -> VH-PO-110 (explicit) | YES | PASS |
| DRV-012 | Palesa Mthembu | /assets/drivers/DRV-012.webp | AVAILABLE | VH-RU-111 | NW 3062 ML | 2021 | Ford | Focus | HATCHBACK | Rustenburg / North West | 2021-ford-focus | /assets/vehicles/images/2021-ford-focus.webp | AVAILABLE | DRV-012 -> VH-RU-111 (explicit) | YES | PASS |
| DRV-013 | Charlene van der Merwe | /assets/drivers/DRV-013.webp | AVAILABLE | VH-TH-112 | LP 8635 VL | 2022 | Volkswagen | Polo | HATCHBACK | Thohoyandou / Limpopo | 2022-volkswagen-polo | /assets/vehicles/images/2022-volkswagen-polo.webp | AVAILABLE | DRV-013 -> VH-TH-112 (explicit) | YES | PASS |
| DRV-014 | Lwazi van Wyk | /assets/drivers/DRV-014.webp | AVAILABLE | VH-BL-113 | FS 4032 LK | 2023 | Mercedes-Benz | C-Class | SEDAN | Bloemfontein / Free State | 2023-mercedes-benz-c-class | /assets/vehicles/images/2023-mercedes-benz-c-class.webp | AVAILABLE | DRV-014 -> VH-BL-113 (explicit) | YES | PASS |
| DRV-016 | Sipho Sithole | /assets/drivers/DRV-016.webp | AVAILABLE | VH-CA-115 | WC 7236 TX | 2020 | Volkswagen | Passat | SEDAN | Cape Town / Western Cape | 2020-volkswagen-passat | /assets/vehicles/images/2020-volkswagen-passat.webp | AVAILABLE | DRV-016 -> VH-CA-115 (explicit) | YES | PASS |
| DRV-017 | Refilwe Mokoena | /assets/drivers/DRV-017.webp | AVAILABLE | VH-DU-116 | KZN 1692 GV | 2021 | Scania | R-Series | TRUCK | Durban / KwaZulu-Natal | 2021-scania-r-series | /assets/vehicles/images/2021-scania-r-series.webp | AVAILABLE | DRV-017 -> VH-DU-116 (explicit) | YES | PASS |
| DRV-019 | Dineo Naidoo | /assets/drivers/DRV-019.webp | AVAILABLE | VH-GQ-118 | EC 5453 FL | 2023 | Chevrolet | Spark | HATCHBACK | Gqeberha / Eastern Cape | 2023-chevrolet-spark | /assets/vehicles/images/2023-chevrolet-spark.webp | AVAILABLE | DRV-019 -> VH-GQ-118 (explicit) | YES | PASS |
| DRV-024 | Jared Jacobs | /assets/drivers/DRV-024.webp | AVAILABLE | VH-PH-123 | LP 1029 FY | 2023 | Toyota | Fortuner | SUV | Phalaborwa / Limpopo | 2023-toyota-fortuner | /assets/vehicles/images/2023-toyota-fortuner.webp | AVAILABLE | DRV-024 -> VH-PH-123 (explicit) | YES | PASS |

## Coverage and Provenance

- Priority A pairs: 15/15; visual associations: 30/30.
- Priority A portraits: 15/15 AVAILABLE, fully decoded WebP 512x512.
- Priority A vehicle images: 15/15 AVAILABLE, fully decoded WebP 1200x800.
- Batch 1/2/3 counts: 5/5/5 AVAILABLE. All 15 deterministic visual keys
  and all 30 paths unique; shared-family bytes do not collapse identities.
- Portrait provenance: 15 matching Priority A records independently verified.
  Source GENERATED, creator OWNER_SUPPLIED_GENERATED_ASSET, licence PROJECT_ASSET,
  commercial/modification true, attribution false, integratedAt present,
  exactness FICTIONAL_DRIVER_REPRESENTATION. Names come from canonical identity,
  not supplied filenames or portrait appearance. Four other existing portraits
  are outside this freeze; the existing validator verifies all 19.
- Vehicle provenance: 15 matching records verified. Source GENERATED, creator
  OPENAI_BUILT_IN_IMAGEGEN_OWNER_AUTHORIZED, licence PROJECT_ASSET, commercial/
  modification declarations true, attribution false/null, creation date and
  local generation-spec references present; hashes and byte sizes match.
  Original generator ownership/third-party-rights caveats remain in batch reports.
  No external photo licence or manufacturer endorsement invented by this audit.
- Priority B/C coverage remains PARTIAL: portraits B 2/6 and C 2/4.
  No Priority B/C vehicle acquisition or freeze added.
- Priority A 3D: NOT YET ACQUIRED; no models directory present.
- Frontend vehicle-image integration: NOT YET IMPLEMENTED.
  Existing driver-portrait rendering is not a completed vehicle live card.

## Exactness and Reuse Decisions

All 15 actual vehicle images remain GENERATED_REPRESENTATIVE.
Desired EXACT planning values are not achieved fidelity or manufacturer approval.
All canonical variant fields remain null and colourExactness remains UNKNOWN.
Silver, wheel design and equipment in artwork are presentation choices only.

| Pair | Decision | Byte verification |
| --- | --- | --- |
| 2022/2023 Volkswagen Polo | Approved shared representative family, separate year-key paths | IDENTICAL |
| 2020/2021 Hyundai H1 | Approved shared representative family, separate year-key paths | IDENTICAL |
| 2020/2023 Mercedes-Benz C-Class | Different predecessor/new-generation visuals | DIFFERENT |

Reuse decisions and all Batch 1/2/3 acquisition/provenance records preserved.

## Frozen Asset SHA-256

Each hash names the exact bytes at the associated matrix path.
All 30 before/after hashes match. Thirteen distinct vehicle payloads cover
15 visual keys due only to the approved two family-reuse pairs.

| Driver / Vehicle key | Portrait SHA-256 | Vehicle SHA-256 |
| --- | --- | --- |
| DRV-001 / 2020-hyundai-h1 | d11d986692637ec27e080e2563c883e665e9215036f9b23a2b225b614c946519 | e18c8dd624ab6aaff432f24f6de616f45cfef5ed9592f159c2a6b97f241b8bf9 |
| DRV-002 / 2021-hyundai-h1 | 055398b4c9063bc8cd872017ad1263486d63bbdb3a8a763e6ed3c0c83abdd5e4 | e18c8dd624ab6aaff432f24f6de616f45cfef5ed9592f159c2a6b97f241b8bf9 |
| DRV-003 / 2022-toyota-hilux | 8d96070e2648d96ce0df69ea55401804702055c4b3d16ceaa9b9e0fcef872826 | a8b217c39b0fb3f73edf144191534c47c89fa41d282be723df41375e7435292e |
| DRV-004 / 2023-volkswagen-polo | 7360103c230c2586647efeaf488444e4b41cb420bd547320eb1f85118e2b293f | fc26016c2ca0a764004b211e9ced5fdbed1ad298c043bb867b783767b4d25220 |
| DRV-006 / 2020-hyundai-elantra | a6fe2a2354016e53d38489aed756f173bfb4771585ffe63a929fd5c8a29c9dda | 1957cac47109efd5514f535d6f246f86d06761de1f9a3b6f9583b37b419ce280 |
| DRV-007 / 2021-nissan-x-trail | 31a2a580b5c26fe761f5978afeb3822e35c02dd84558bfea7ee0dd340fab455b | 439780fa6defa8f0d8ee20e00d5855d1745fbb025c531808dc78cd59a2fce937 |
| DRV-008 / 2022-nissan-np200 | 8f396d05955e8a3d91bd6818328701787e7ecb300995e21c0c9b3c4088608651 | c3d9f704aed322fe5c48dfb795ed5ed2cca26fff9f18a6f7af0c452176f39b85 |
| DRV-011 / 2020-mercedes-benz-c-class | 60343a4133323280e239cc95b38f13719035e691c7602a2c1b52fe9e94a1ede8 | 9abb7d11c2755026c846ccf88370b3d58217390624ec8faa41199b4ad54160cb |
| DRV-012 / 2021-ford-focus | 2e86fce8024ede04ab3dbb3311dc5e13977974b34ebd5ce60a779c837b18f137 | 0f19287add03fa31f52b2e2d173cfc895aaeff7459d120cb89453eb88483eeb3 |
| DRV-013 / 2022-volkswagen-polo | e148aabb1299b1c6d22c5df4576c98c8fae03d51e011515ce579df6ec3421f14 | fc26016c2ca0a764004b211e9ced5fdbed1ad298c043bb867b783767b4d25220 |
| DRV-014 / 2023-mercedes-benz-c-class | cdc69e9cd4d7d7e5d31ec53b5f77bd03043a499fb871fa442a81476dfcfe0ec0 | ade2ca9d437f16e10db1bde3895d9d3dab8db1f6f6e397f45f083a929421eec2 |
| DRV-016 / 2020-volkswagen-passat | edbfab7ace6890c4b1e083035ab2f400a6b759a499fdc5ca4d80f788edfaa9ab | 88686b2be87180d30936c3dd97da32ef11fae449067a287ec32117b6bb0c9841 |
| DRV-017 / 2021-scania-r-series | 782fcb4057fc198b3f52385880774e91d041fd817df5ef8783ed78103114e6c7 | b61b4d4e5e030114a8a2920a373e4b16fec8a13a04839c45735b42d5459e6cf7 |
| DRV-019 / 2023-chevrolet-spark | d4c3c9831a225b5f1c9c33d392e0df9ee36571a312abac605acee77fab6a73fc | 930d42cea0f1967e7a761805acefea9697eba351b41d21b0d76d9ed6cff83c82 |
| DRV-024 / 2023-toyota-fortuner | d2de0728d67e66dbe296219330a9712509196a9ab77782b3a0b5010431f9a4f0 | a1e64031bc687bc3e067e34d001ff3f955ad0c83b0f90f48f0e99f2834842326 |

## Independent Visual and Technical QA

PASS at representative fidelity. All 15 vehicle WebPs reviewed in a dark
Fleet Drive-coloured contact sheet, alongside all 15 corresponding portraits.
Vehicles retain broad type/model-family plausibility, nose-left front three-
quarter framing, entire silhouettes/wheels, readable silver/dark contrast and
appropriate alpha/contact shadow. Scania cab, aerials and chassis are visible.
No visible watermark, registration characters, dealership/marketing text,
invented trim lettering, people or corruption. Unlettered mounting surfaces
are not fabricated registrations. Manufacturer emblem shapes are not endorsement.
Portraits are clean square fictional avatars with no embedded ID/name labels
or visible corruption. Identity mapping is record-based, not facial recognition.
Audit-only contact-sheet labels were added outside images, never to asset bytes.

Limitations preserved:
- Exact SA-market trim, equipment, detailed light/bumpers and year fidelity
  are NOT certified for any generated image.
- Focus European-family/year-market fit and Spark canonical 2023 production/
  local-market fit remain unverified, not silently corrected in the fleet.
- Hilux double cab and Scania tractor/axle/cab configuration are illustrative.
- H1 exact seating/derivative and all vehicle colours remain unknown.
- Browser responsive/card rendering is deferred, not claimed PASS here.

Commands/checks:
- node scripts/validate-driver-portraits.mjs: PASS 19 portraits total,
  15/15 live Priority A coverage; read-only SQLite.
- Bundled Python scripts/validate-vehicle-images.py: PASS 15/15.
- Independent inline Node audit: PASS canonical + live DB + assignment +
  simulator + manifests + provenance + portrait registry + reuse checks.
- Independent Pillow load: PASS 30 images, dimensions/format/metadata.
- JSON parsing: PASS relevant manifests, provenance, generation specs and freeze.
- Orphan checks: PASS; vehicle directory exactly 15 files; portrait directory
  exactly 19 provenance/registry-backed files, 15 of them frozen Priority A.
- git diff --check and new-document whitespace checks: PASS.
- Frontend/backend builds and suites not run: runtime code unchanged.
- No server, simulator, notification or write-capable database import started.

## Database and Runtime Immutability

Opened runtime SQLite directly with DatabaseSync readOnly:true and
PRAGMA query_only=ON. No migration, seeding, update or telemetry submission.
Compared deterministic ordered queries before/after validation:

| Metric | Before | After | Result |
| --- | --- | --- | --- |
| vehicleIdentityHash | 111a02db2bbf9061c9b1ee800abf118c50c33ac6d347ad163986f4b26edbe941 | 111a02db2bbf9061c9b1ee800abf118c50c33ac6d347ad163986f4b26edbe941 | UNCHANGED |
| driverIdentityHash | 108e535055cee7a57d1f1a6b2b6eba0007b6c6cf35fd7a966c94797d3ee85178 | 108e535055cee7a57d1f1a6b2b6eba0007b6c6cf35fd7a966c94797d3ee85178 | UNCHANGED |
| assignmentHash | 7e89d821cb423a4338c047a85d0c7b31edd2fae27991e6059de67bff5e422185 | 7e89d821cb423a4338c047a85d0c7b31edd2fae27991e6059de67bff5e422185 | UNCHANGED |
| currentOperationHash | c20eac62fa5e0ff7563f16720de1ebb1c8607b702cc5e3e4ddc0d9009f8a374a | c20eac62fa5e0ff7563f16720de1ebb1c8607b702cc5e3e4ddc0d9009f8a374a | UNCHANGED |
| telemetryRows | 28487 | 28487 | UNCHANGED |
| dbSha256 | ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4 | ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4 | UNCHANGED |
| protectedCount | 316 | 316 | UNCHANGED |
| protectedDigest | c9c13f22d16a4a894115c698ee2c2880fc30c698d04b0fe550c50d2a640cd2b1 | c9c13f22d16a4a894115c698ee2c2880fc30c698d04b0fe550c50d2a640cd2b1 | UNCHANGED |

Vehicle hash uses ordered id,plate,year,make,model,variant,vehicle_type,city,
province,visual_key columns. Driver hash uses all rows ordered by ID.
Assignment hash uses all rows ordered by driver/vehicle, not just active rows.
Current-operation hash includes IDs and started_at/updated_at. Telemetry count
uses COUNT(*) from telemetry. Different historic query projections can produce
different hashes; only same-query before/after values are compared here.

Protected digest covers 316 pre-existing files across src/, server/ excluding
node_modules, legacy/, all 19 portraits and all 15 vehicle images.
It includes canonical fleet and SQLite bytes. All remain unchanged.
Git root confirmed C:/Users/Admin/vehicle-tracking-dashboard.
Existing dirty/untracked source, tests, API, documentation and asset work was
preserved. Nothing discarded, reset, staged or committed.

## Future Frontend Integration Contract

Contract only; no card/endpoint/runtime implementation in this phase.

1. Obtain real driver/vehicle state from existing Express APIs.
2. Resolve driver ID through the existing central portrait registry and this
   verified mapping. Missing/broken image -> existing accessible initials.
3. Resolve canonical vehicle visualKey through the frozen AVAILABLE acquisition
   mapping -> /assets/vehicles/images/<visualKey>.webp. Do not guess by plate,
   name or array order; missing/broken artwork -> honest unavailable state.
4. Resolve current vehicle/current driver through explicit currentVehicle/
   currentDriver API relationships backed by driver_current_vehicles.
   Authorised assignments are a separate pool, not current operation.
5. Bind latest telemetry only to that explicit vehicle ID through Express
   query responses. No React mock-state mutation or hard-coded movement.
6. Display actual driver name, frozen portrait, canonical year/make/model,
   representative vehicle image, actual plate and canonical city.
7. Current telemetry: lat, lng, speed, heading and timestamp. Map recordedAt
   history timestamp or latest vehicle lastSeen to the card timestamp according
   to the existing API shape; retain null/missing/stale/error states honestly.
   Heading is true-north degrees in [0,360), nullable, never inferred from artwork.
8. Road = UNAVAILABLE until separately approved geolocation integration.
   City is not a road/suburb or proof of reverse geocoding.
9. Revalidate frozen hashes before later integration. UI object-fit/layout,
   loading/error/fallback and responsive acceptance remain future work.

## 3D Boundary and Acceptance

All phase gates PASS at documented representative fidelity:
15 canonical pairs; 15 portraits; 15 vehicle images; 30 associations;
15 portrait and 15 vehicle provenance mappings; decode/format/dimensions;
reuse, visual QA, orphan checks, unchanged database/runtime/physical assets.
Freeze record created. No model acquired, map changed or card implemented.

No 3D assets, MapLibre/Three.js install, map changes, Priority B acquisition,
commit, push or deploy performed. Freeze is documentation and hash authority,
not immutable filesystem permissions or a release commit.

Recommended next phase: 3.4 - Priority A Generic 3D Vehicle Pack.
Safe to proceed: YES, only after explicit approval. STOP after Phase 3.3E.
