# Fleet Drive AI v1.1 Priority A Acquisition Checklist

Status: Phase 3.3E 2D QA and freeze PASS. Priority A portraits 15/15 AVAILABLE and vehicle images 15/15 AVAILABLE. Priority B/C portrait coverage remains partial (2/6 and 2/4); vehicle coverage outside Priority A is not frozen here. All 3D acquisition and frontend vehicle-image integration remain incomplete. See V1_1_PRIORITY_A_2D_ASSET_FREEZE.md for current authority; phase-specific completion notes below are preserved historical evidence.

## Phase 3.2E Coverage Reconciliation

Priority A portrait coverage: **15 / 15 AVAILABLE**.
Phase 3.2D identified four ASSET_MISSING gaps: DRV-016, DRV-017, DRV-019
and DRV-024. All four are now resolved using owner-supplied approved PNGs.
The gap manifest retains the original specifications as resolved history.
The live NORMAL_FLEET selector confirms portrait coverage for every current
operating driver (15/15). All original 15 portraits remain frozen.
Phase 3.3B: five Batch 1 vehicle 2D files are AVAILABLE as generated
representations. The other ten vehicle images and all 3D acquisition remain
incomplete. No vehicle-image frontend integration has occurred.

## Authoritative Priority A Pairs and Visual Mapping

These 15 records come from the frozen Stage 2 simulator/current-operation
dataset. Planned paths are static asset mappings and are not database fields.

| Driver | Vehicle | Registration | Exact specification | Type | Location | Visual key | Driver photo | Vehicle image | Generic 3D | 3D exactness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-014 - Lwazi van Wyk | VH-BL-113 | FS 4032 LK | 2023 Mercedes-Benz C-Class | SEDAN | Bloemfontein, Free State | `2023-mercedes-benz-c-class` | `/assets/drivers/DRV-014.webp` | `/assets/vehicles/images/2023-mercedes-benz-c-class.webp` | `/assets/vehicles/models/sedan-generic.glb` | VEHICLE_TYPE |
| DRV-002 - Siyabonga Naidoo | VH-CA-101 | WC 1729 AV | 2021 Hyundai H1 | MINIBUS | Cape Town, Western Cape | `2021-hyundai-h1` | `/assets/drivers/DRV-002.webp` | `/assets/vehicles/images/2021-hyundai-h1.webp` | `/assets/vehicles/models/minibus-generic.glb` | VEHICLE_TYPE |
| DRV-003 - Thandi Mokoena | VH-DU-102 | KZN 2386 SQ | 2022 Toyota Hilux | PICKUP | Durban, KwaZulu-Natal | `2022-toyota-hilux` | `/assets/drivers/DRV-003.webp` | `/assets/vehicles/images/2022-toyota-hilux.webp` | `/assets/vehicles/models/pickup-generic.glb` | VEHICLE_TYPE |
| DRV-019 - Dineo Naidoo | VH-GQ-118 | EC 5453 FL | 2023 Chevrolet Spark | HATCHBACK | Gqeberha, Eastern Cape | `2023-chevrolet-spark` | `/assets/drivers/DRV-019.webp` | `/assets/vehicles/images/2023-chevrolet-spark.webp` | `/assets/vehicles/models/hatchback-generic.glb` | VEHICLE_TYPE |
| DRV-001 - Ayanda Dlamini | VH-JO-100 | GP 2461 YO | 2020 Hyundai H1 | MINIBUS | Johannesburg, Gauteng | `2020-hyundai-h1` | `/assets/drivers/DRV-001.webp` | `/assets/vehicles/images/2020-hyundai-h1.webp` | `/assets/vehicles/models/minibus-generic.glb` | VEHICLE_TYPE |
| DRV-006 - Riyaad Ahmed | VH-KI-105 | NC 4067 BP | 2020 Hyundai Elantra | SEDAN | Kimberley, Northern Cape | `2020-hyundai-elantra` | `/assets/drivers/DRV-006.webp` | `/assets/vehicles/images/2020-hyundai-elantra.webp` | `/assets/vehicles/models/sedan-generic.glb` | VEHICLE_TYPE |
| DRV-007 - Jenna Smith | VH-LO-106 | LP 8173 RZ | 2021 Nissan X-Trail | SUV | Louis Trichardt, Limpopo | `2021-nissan-x-trail` | `/assets/drivers/DRV-007.webp` | `/assets/vehicles/images/2021-nissan-x-trail.webp` | `/assets/vehicles/models/suv-generic.glb` | VEHICLE_TYPE |
| DRV-008 - Zanele Daniels | VH-MA-107 | NW 1736 CO | 2022 Nissan NP200 | PICKUP | Mahikeng, North West | `2022-nissan-np200` | `/assets/drivers/DRV-008.webp` | `/assets/vehicles/images/2022-nissan-np200.webp` | `/assets/vehicles/models/pickup-generic.glb` | VEHICLE_TYPE |
| DRV-024 - Jared Jacobs | VH-PH-123 | LP 1029 FY | 2023 Toyota Fortuner | SUV | Phalaborwa, Limpopo | `2023-toyota-fortuner` | `/assets/drivers/DRV-024.webp` | `/assets/vehicles/images/2023-toyota-fortuner.webp` | `/assets/vehicles/models/suv-generic.glb` | VEHICLE_TYPE |
| DRV-011 - Fhulufhelo Makhale | VH-PO-110 | LP 2562 RR | 2020 Mercedes-Benz C-Class | SEDAN | Polokwane, Limpopo | `2020-mercedes-benz-c-class` | `/assets/drivers/DRV-011.webp` | `/assets/vehicles/images/2020-mercedes-benz-c-class.webp` | `/assets/vehicles/models/sedan-generic.glb` | VEHICLE_TYPE |
| DRV-004 - Lerato Nkosi | VH-PR-103 | GP 9915 XB | 2023 Volkswagen Polo | HATCHBACK | Pretoria, Gauteng | `2023-volkswagen-polo` | `/assets/drivers/DRV-004.webp` | `/assets/vehicles/images/2023-volkswagen-polo.webp` | `/assets/vehicles/models/hatchback-generic.glb` | VEHICLE_TYPE |
| DRV-012 - Palesa Mthembu | VH-RU-111 | NW 3062 ML | 2021 Ford Focus | HATCHBACK | Rustenburg, North West | `2021-ford-focus` | `/assets/drivers/DRV-012.webp` | `/assets/vehicles/images/2021-ford-focus.webp` | `/assets/vehicles/models/hatchback-generic.glb` | VEHICLE_TYPE |
| DRV-013 - Charlene van der Merwe | VH-TH-112 | LP 8635 VL | 2022 Volkswagen Polo | HATCHBACK | Thohoyandou, Limpopo | `2022-volkswagen-polo` | `/assets/drivers/DRV-013.webp` | `/assets/vehicles/images/2022-volkswagen-polo.webp` | `/assets/vehicles/models/hatchback-generic.glb` | VEHICLE_TYPE |
| DRV-016 - Sipho Sithole | VH-CA-115 | WC 7236 TX | 2020 Volkswagen Passat | SEDAN | Cape Town, Western Cape | `2020-volkswagen-passat` | `/assets/drivers/DRV-016.webp` | `/assets/vehicles/images/2020-volkswagen-passat.webp` | `/assets/vehicles/models/sedan-generic.glb` | VEHICLE_TYPE |
| DRV-017 - Refilwe Mokoena | VH-DU-116 | KZN 1692 GV | 2021 Scania R-Series | TRUCK | Durban, KwaZulu-Natal | `2021-scania-r-series` | `/assets/drivers/DRV-017.webp` | `/assets/vehicles/images/2021-scania-r-series.webp` | `/assets/vehicles/models/truck-generic.glb` | VEHICLE_TYPE |

## Acquisition and Integration Status

The pair table below preserves the Phase 3.1 planning baseline. The authoritative
portrait-only completion record is below; these results do not complete vehicle
2D, 3D or whole-pair acquisition. `Provenance` and `Licence` are separate gates.

### Phase 3.2E Portrait-Only Completion

| Priority | Drivers | Portrait | Provenance | Licence | Optimisation | Integration | QA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | DRV-001, DRV-002, DRV-003, DRV-004, DRV-006, DRV-007, DRV-008, DRV-011, DRV-012, DRV-013, DRV-014 | COMPLETE | COMPLETE | PROJECT_ASSET | COMPLETE | COMPLETE | COMPLETE |
| A | DRV-016, DRV-017, DRV-019, DRV-024 | COMPLETE | COMPLETE | PROJECT_ASSET | COMPLETE | COMPLETE | COMPLETE |
| B | DRV-009, DRV-015 | COMPLETE | COMPLETE | PROJECT_ASSET | COMPLETE | COMPLETE | COMPLETE |
| C | DRV-005, DRV-010 | COMPLETE | COMPLETE | PROJECT_ASSET | COMPLETE | COMPLETE | COMPLETE |

All other driver portraits remain MISSING. Source filename names are not
authoritative identities; the current driver manifest supplies display names.

| Pair | Portrait | Vehicle 2D | 3D mapping | Provenance | Licence | Optimisation | Integration | QA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-014 / VH-BL-113 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-002 / VH-CA-101 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-003 / VH-DU-102 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-019 / VH-GQ-118 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-001 / VH-JO-100 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-006 / VH-KI-105 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-007 / VH-LO-106 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-008 / VH-MA-107 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-024 / VH-PH-123 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-011 / VH-PO-110 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-004 / VH-PR-103 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-012 / VH-RU-111 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-013 / VH-TH-112 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-016 / VH-CA-115 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |
| DRV-017 / VH-DU-116 | - [x] | - [x] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] | - [ ] |

### Phase 3.3B Vehicle-Image-Only Completion

The existing pair-level gates remain unchecked because 3D and UI integration
are not complete. This table records only the acquired vehicle images.

| Vehicle | Vehicle 2D | Provenance | Licence | Optimisation | Integration | QA |
| --- | --- | --- | --- | --- | --- | --- |
| VH-PR-103 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-TH-112 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-CA-115 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-BL-113 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-PO-110 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |

See V1_1_PHASE_3_3B_VEHICLE_BATCH_1.md and vehicle-image-provenance.json.
These are not exact-trim photography or manufacturer-endorsed images.

### Phase 3.3C Vehicle-Image-Only Completion

Batch 2 adds five AVAILABLE generated-representative images. Batch 1 metadata
and completion rows above are unchanged. Whole-pair and 3D gates remain open.

| Vehicle | Vehicle 2D | Provenance | Licence | Optimisation | Integration | QA |
| --- | --- | --- | --- | --- | --- | --- |
| VH-CA-101 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-DU-102 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-JO-100 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-KI-105 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-PH-123 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |

See V1_1_PHASE_3_3C_VEHICLE_BATCH_2.md. Remaining Priority A vehicle 2D: five
Batch 3 records, still unacquired. No vehicle images have been integrated into
the frontend. Colour, equipment and Hilux cab configuration remain unverified.

### Phase 3.3D Vehicle-Image-Only Completion

Batch 3 completes vehicle-image acquisition: **15 / 15 AVAILABLE** across
Batches 1/2/3. Historical coverage statements above describe their respective
phase closeouts, not current gaps. All 15 Priority A driver portraits remain
AVAILABLE. Vehicle-image UI integration and all 3D gates remain incomplete.

| Vehicle | Vehicle 2D | Provenance | Licence | Optimisation | Integration | QA |
| --- | --- | --- | --- | --- | --- | --- |
| VH-GQ-118 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-LO-106 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-MA-107 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-RU-111 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |
| VH-DU-116 | AVAILABLE | COMPLETE | PROJECT_ASSET | COMPLETE | NOT STARTED | PASS REPRESENTATIVE |

See V1_1_PHASE_3_3D_VEHICLE_BATCH_3.md. All images are generated representatives,
not exact manufacturer photography. Focus/Spark year-market fit and Scania
tractor/axle/cab configuration remain unverified presentation choices.
Next gate: Phase 3.3E QA and freeze, only after explicit approval.

## Controlled Post-Freeze Exception

DRV-015 is not part of the frozen 15-vehicle Priority A simulator set. Phase
3.2B reconciles the fictional driver identity to `Tshifhiwa Netshanda`, keeps
the simulator participant count unchanged, and records the portrait target as
`/assets/drivers/DRV-015.webp` with integration status `AVAILABLE` after Phase 3.2C.

| Driver | Vehicle | Registration | Exact specification | Type | Location | Visual key | Driver photo | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-015 - Tshifhiwa Netshanda | VH-JO-114 | GP 7973 TB | 2024 Hyundai Elantra | SEDAN | Johannesburg, Gauteng | `2024-hyundai-elantra` | `/assets/drivers/DRV-015.webp` | AVAILABLE |

## Completion Rules

- Portrait completion requires an approved fictional visual, optimised file,
  provenance and rendered QA.
- Vehicle 2D completion requires a truthful exactness classification and usage
  rights; online availability alone is insufficient.
- 3D mapping completion requires an approved GLB, provenance, technical QA and
  truthful `VEHICLE_TYPE` metadata.
- Integration remains incomplete until fallback behavior is tested.
- No database row is updated with these paths; the shared static registry owns
  the mapping.
