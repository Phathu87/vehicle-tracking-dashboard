# Priority A Vehicle Acquisition Matrix

Current availability authority: Phase 3.3E freeze in
V1_1_PRIORITY_A_2D_ASSET_FREEZE.md and its JSON verification record.
All 15 Priority A vehicle images and corresponding portraits are AVAILABLE.
Vehicle exactness is GENERATED_REPRESENTATIVE, not EXACT. The Phase 3.3A
planning statuses and desired exactness below are historical, not current
availability. Frontend vehicle-image integration and all 3D remain incomplete.

Phase: 3.3A. Planning only. Verification: PASS after Phase 3.3A-R reconciliation.
The canonical seed now reproduces this matrix. No visual acquired.
Acquisition still requires separate owner approval.

Source: read-only SQLite, explicit driver_current_vehicles, live NORMAL_FLEET
selector limit 15 and existing manifests. Variant is null for every row.
Portraits are AVAILABLE and resolve through the shared frontend registry.
Actual vehicle visual exactness is NONE. EXACT below is desired, not achieved.

Method abbreviations: L = SEARCH_LICENSED_FIRST; F = MODEL_FAMILY_REUSE_CANDIDATE;
R = REVIEW_REQUIRED. No search performed. Fallbacks require individual review
and truthful exactness metadata; they are not existing assets.

| Driver | Portrait | Vehicle | Plate | City | Visual Key | Type | Desired Exactness | Fallback | Method | Target File | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-014 - Lwazi van Wyk | AVAILABLE: /assets/drivers/DRV-014.webp | VH-BL-113: 2023 Mercedes-Benz C-Class | FS 4032 LK | Bloemfontein | 2023-mercedes-benz-c-class | SEDAN | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | R | public/assets/vehicles/images/2023-mercedes-benz-c-class.webp | PLANNED; APPROVAL REQUIRED |
| DRV-002 - Siyabonga Naidoo | AVAILABLE: /assets/drivers/DRV-002.webp | VH-CA-101: 2021 Hyundai H1 | WC 1729 AV | Cape Town | 2021-hyundai-h1 | MINIBUS | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | F | public/assets/vehicles/images/2021-hyundai-h1.webp | PLANNED; APPROVAL REQUIRED |
| DRV-003 - Thandi Mokoena | AVAILABLE: /assets/drivers/DRV-003.webp | VH-DU-102: 2022 Toyota Hilux | KZN 2386 SQ | Durban | 2022-toyota-hilux | PICKUP | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2022-toyota-hilux.webp | PLANNED; APPROVAL REQUIRED |
| DRV-019 - Dineo Naidoo | AVAILABLE: /assets/drivers/DRV-019.webp | VH-GQ-118: 2023 Chevrolet Spark | EC 5453 FL | Gqeberha | 2023-chevrolet-spark | HATCHBACK | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2023-chevrolet-spark.webp | PLANNED; APPROVAL REQUIRED |
| DRV-001 - Ayanda Dlamini | AVAILABLE: /assets/drivers/DRV-001.webp | VH-JO-100: 2020 Hyundai H1 | GP 2461 YO | Johannesburg | 2020-hyundai-h1 | MINIBUS | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | F | public/assets/vehicles/images/2020-hyundai-h1.webp | PLANNED; APPROVAL REQUIRED |
| DRV-006 - Riyaad Ahmed | AVAILABLE: /assets/drivers/DRV-006.webp | VH-KI-105: 2020 Hyundai Elantra | NC 4067 BP | Kimberley | 2020-hyundai-elantra | SEDAN | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2020-hyundai-elantra.webp | PLANNED; APPROVAL REQUIRED |
| DRV-007 - Jenna Smith | AVAILABLE: /assets/drivers/DRV-007.webp | VH-LO-106: 2021 Nissan X-Trail | LP 8173 RZ | Louis Trichardt | 2021-nissan-x-trail | SUV | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2021-nissan-x-trail.webp | PLANNED; APPROVAL REQUIRED |
| DRV-008 - Zanele Daniels | AVAILABLE: /assets/drivers/DRV-008.webp | VH-MA-107: 2022 Nissan NP200 | NW 1736 CO | Mahikeng | 2022-nissan-np200 | PICKUP | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2022-nissan-np200.webp | PLANNED; APPROVAL REQUIRED |
| DRV-024 - Jared Jacobs | AVAILABLE: /assets/drivers/DRV-024.webp | VH-PH-123: 2023 Toyota Fortuner | LP 1029 FY | Phalaborwa | 2023-toyota-fortuner | SUV | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2023-toyota-fortuner.webp | PLANNED; APPROVAL REQUIRED |
| DRV-011 - Fhulufhelo Makhale | AVAILABLE: /assets/drivers/DRV-011.webp | VH-PO-110: 2020 Mercedes-Benz C-Class | LP 2562 RR | Polokwane | 2020-mercedes-benz-c-class | SEDAN | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | R | public/assets/vehicles/images/2020-mercedes-benz-c-class.webp | PLANNED; APPROVAL REQUIRED |
| DRV-004 - Lerato Nkosi | AVAILABLE: /assets/drivers/DRV-004.webp | VH-PR-103: 2023 Volkswagen Polo | GP 9915 XB | Pretoria | 2023-volkswagen-polo | HATCHBACK | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | F | public/assets/vehicles/images/2023-volkswagen-polo.webp | PLANNED; APPROVAL REQUIRED |
| DRV-012 - Palesa Mthembu | AVAILABLE: /assets/drivers/DRV-012.webp | VH-RU-111: 2021 Ford Focus | NW 3062 ML | Rustenburg | 2021-ford-focus | HATCHBACK | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2021-ford-focus.webp | PLANNED; APPROVAL REQUIRED |
| DRV-013 - Charlene van der Merwe | AVAILABLE: /assets/drivers/DRV-013.webp | VH-TH-112: 2022 Volkswagen Polo | LP 8635 VL | Thohoyandou | 2022-volkswagen-polo | HATCHBACK | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | F | public/assets/vehicles/images/2022-volkswagen-polo.webp | PLANNED; APPROVAL REQUIRED |
| DRV-016 - Sipho Sithole | AVAILABLE: /assets/drivers/DRV-016.webp | VH-CA-115: 2020 Volkswagen Passat | WC 7236 TX | Cape Town | 2020-volkswagen-passat | SEDAN | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2020-volkswagen-passat.webp | PLANNED; APPROVAL REQUIRED |
| DRV-017 - Refilwe Mokoena | AVAILABLE: /assets/drivers/DRV-017.webp | VH-DU-116: 2021 Scania R-Series | KZN 1692 GV | Durban | 2021-scania-r-series | TRUCK | EXACT | MODEL_FAMILY / GENERATED_REPRESENTATIVE / VEHICLE_TYPE | L | public/assets/vehicles/images/2021-scania-r-series.webp | PLANNED; APPROVAL REQUIRED |

## Canonical Specification and Relationship Matrix

| Vehicle | Year | Canonical make | Canonical model | Variant | Province | Current driver relationship | Simulator | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VH-BL-113 | 2023 | Mercedes-Benz | C-Class | null / UNKNOWN | Free State | driver_current_vehicles -> DRV-014 | YES | A |
| VH-CA-101 | 2021 | Hyundai | H1 | null / UNKNOWN | Western Cape | driver_current_vehicles -> DRV-002 | YES | A |
| VH-DU-102 | 2022 | Toyota | Hilux | null / UNKNOWN | KwaZulu-Natal | driver_current_vehicles -> DRV-003 | YES | A |
| VH-GQ-118 | 2023 | Chevrolet | Spark | null / UNKNOWN | Eastern Cape | driver_current_vehicles -> DRV-019 | YES | A |
| VH-JO-100 | 2020 | Hyundai | H1 | null / UNKNOWN | Gauteng | driver_current_vehicles -> DRV-001 | YES | A |
| VH-KI-105 | 2020 | Hyundai | Elantra | null / UNKNOWN | Northern Cape | driver_current_vehicles -> DRV-006 | YES | A |
| VH-LO-106 | 2021 | Nissan | X-Trail | null / UNKNOWN | Limpopo | driver_current_vehicles -> DRV-007 | YES | A |
| VH-MA-107 | 2022 | Nissan | NP200 | null / UNKNOWN | North West | driver_current_vehicles -> DRV-008 | YES | A |
| VH-PH-123 | 2023 | Toyota | Fortuner | null / UNKNOWN | Limpopo | driver_current_vehicles -> DRV-024 | YES | A |
| VH-PO-110 | 2020 | Mercedes-Benz | C-Class | null / UNKNOWN | Limpopo | driver_current_vehicles -> DRV-011 | YES | A |
| VH-PR-103 | 2023 | Volkswagen | Polo | null / UNKNOWN | Gauteng | driver_current_vehicles -> DRV-004 | YES | A |
| VH-RU-111 | 2021 | Ford | Focus | null / UNKNOWN | North West | driver_current_vehicles -> DRV-012 | YES | A |
| VH-TH-112 | 2022 | Volkswagen | Polo | null / UNKNOWN | Limpopo | driver_current_vehicles -> DRV-013 | YES | A |
| VH-CA-115 | 2020 | Volkswagen | Passat | null / UNKNOWN | Western Cape | driver_current_vehicles -> DRV-016 | YES | A |
| VH-DU-116 | 2021 | Scania | R-Series | null / UNKNOWN | KwaZulu-Natal | driver_current_vehicles -> DRV-017 | YES | A |

Do not infer current driver from vehicles.driver_id or assignment ordering.
Image colour is VISUAL_PRESENTATION with colourExactness UNKNOWN; no trim,
engine, transmission, facelift, colour or body derivative is inferred.

## Model Families and Reuse Review

| Make | Model | Years represented | Vehicles covered | Type | Reuse classification | Future strategy |
| --- | --- | --- | --- | --- | --- | --- |
| Chevrolet | Spark | 2023 | VH-GQ-118 | HATCHBACK | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Ford | Focus | 2021 | VH-RU-111 | HATCHBACK | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Hyundai | Elantra | 2020 | VH-KI-105 | SEDAN | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Hyundai | H1 | 2020, 2021 | VH-CA-101, VH-JO-100 | MINIBUS | YEAR_VISUAL_REVIEW_REQUIRED | MODEL_FAMILY_REUSE_CANDIDATE |
| Mercedes-Benz | C-Class | 2020, 2023 | VH-BL-113, VH-PO-110 | SEDAN | NO_REUSE_RECOMMENDED | REVIEW_REQUIRED |
| Nissan | NP200 | 2022 | VH-MA-107 | PICKUP | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Nissan | X-Trail | 2021 | VH-LO-106 | SUV | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Scania | R-Series | 2021 | VH-DU-116 | TRUCK | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Toyota | Fortuner | 2023 | VH-PH-123 | SUV | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Toyota | Hilux | 2022 | VH-DU-102 | PICKUP | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Volkswagen | Passat | 2020 | VH-CA-115 | SEDAN | SAFE_REVIEW_CANDIDATE | SEARCH_LICENSED_FIRST |
| Volkswagen | Polo | 2022, 2023 | VH-PR-103, VH-TH-112 | HATCHBACK | YEAR_VISUAL_REVIEW_REQUIRED | MODEL_FAMILY_REUSE_CANDIDATE |

Three repeated model families cover six exact specifications. No reuse is
approved. H1 and Polo require year/generation review. C-Class retains two
separate images by default because no generation-fidelity evidence exists.
Single-specification SAFE_REVIEW_CANDIDATE rows do not imply cross-year reuse.

## Controlled Batches (Not Authorised)

### 3.3B - Batch 1 - Volkswagen and Mercedes-Benz comparison

- VH-TH-112: 2022 Volkswagen Polo; LP 8635 VL; DRV-013 - Charlene van der Merwe.
- VH-PR-103: 2023 Volkswagen Polo; GP 9915 XB; DRV-004 - Lerato Nkosi.
- VH-CA-115: 2020 Volkswagen Passat; WC 7236 TX; DRV-016 - Sipho Sithole.
- VH-PO-110: 2020 Mercedes-Benz C-Class; LP 2562 RR; DRV-011 - Fhulufhelo Makhale.
- VH-BL-113: 2023 Mercedes-Benz C-Class; FS 4032 LK; DRV-014 - Lwazi van Wyk.

### 3.3C - Batch 2 - Hyundai and Toyota utility/passenger comparison

- VH-JO-100: 2020 Hyundai H1; GP 2461 YO; DRV-001 - Ayanda Dlamini.
- VH-CA-101: 2021 Hyundai H1; WC 1729 AV; DRV-002 - Siyabonga Naidoo.
- VH-KI-105: 2020 Hyundai Elantra; NC 4067 BP; DRV-006 - Riyaad Ahmed.
- VH-DU-102: 2022 Toyota Hilux; KZN 2386 SQ; DRV-003 - Thandi Mokoena.
- VH-PH-123: 2023 Toyota Fortuner; LP 1029 FY; DRV-024 - Jared Jacobs.

### 3.3D - Batch 3 - Nissan and remaining distinct families

- VH-MA-107: 2022 Nissan NP200; NW 1736 CO; DRV-008 - Zanele Daniels.
- VH-LO-106: 2021 Nissan X-Trail; LP 8173 RZ; DRV-007 - Jenna Smith.
- VH-RU-111: 2021 Ford Focus; NW 3062 ML; DRV-012 - Palesa Mthembu.
- VH-GQ-118: 2023 Chevrolet Spark; EC 5453 FL; DRV-019 - Dineo Naidoo.
- VH-DU-116: 2021 Scania R-Series; KZN 1692 GV; DRV-017 - Refilwe Mokoena.

Each batch has exactly five unique vehicles; union is all 15 Priority A vehicles.
The seed-identity mismatch is resolved by Phase 3.3A-R. All batches still
require separate owner approval for acquisition.
