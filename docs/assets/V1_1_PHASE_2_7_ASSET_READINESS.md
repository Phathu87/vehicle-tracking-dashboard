# Phase 2.7 Asset Manifest Regeneration and Sourcing Readiness

## 1. Authoritative Data Inputs

The manifests use the canonical `vehicles`, `drivers`, `driver_vehicle_assignments`, `driver_current_vehicles` and telemetry data. Current operation is never inferred from the legacy `vehicles.driver_id` columns. The normal 15-vehicle participant set is selected through the production simulator selector without starting the simulator.

## 2. Exact Specification Count

177 unique year/make/model visual specifications cover all 350 vehicles. Every key is deterministic, path safe and excludes variant, registration, vehicle ID and driver.

## 3. Make/Model Family Count

42 make/model families are available as sourcing groups. This grouping does not claim that different model years are visually identical.

## 4. Vehicle-Type Count

8 canonical vehicle types are present: CROSSOVER, HATCHBACK, MINIBUS, PICKUP, SEDAN, SUV, TRUCK, VAN.

## 5. Priority A

15 live simulator driver/vehicle pairs cover 15 exact specifications, 12 families and 6 vehicle types.

## 6. Priority B

6 additional current-operation pairs cover 4 additional exact specifications not already represented in Priority A.

## 7. Priority C

158 exact specifications are fleet-catalogue priorities only.

## 8. Driver Portrait Requirements

25 fictional portraits are required: 15 Priority A, 6 Priority B and 4 Priority C. 19 are AVAILABLE; initials remain the fallback for the rest.

## 9. 2D Strategy

Prefer an exact licensed year/model image, then a clearly classified model-family image, then a generated or generic vehicle-type representation. 2D imagery should generally be more specific than 3D. No licensing availability is claimed.

## 10. 3D Strategy

A practical baseline of 8 generic body-type GLBs can represent the complete fleet. Exact or model-family GLBs may replace them selectively where suitable rights and quality justify the work.

## 11. Exactness Model

Manifest exactness values are `EXACT`, `MODEL_FAMILY`, `VEHICLE_TYPE`, `GENERIC` and `NONE`. Missing assets use actual exactness `NONE`; `plannedExactness` records the sourcing target. A generic body-type GLB is a `REPRESENTATIVE VEHICLE-TYPE ASSET`, never an exact digital twin.

## 12. Licensing Metadata

Each future asset records status, local path, source type, source reference, licence, attribution requirement, attribution text and exactness. Google Images is not an asset licence. Search-result availability does not grant redistribution rights, and publicly accessible manufacturer media or 3D models must not be used without suitable rights.

Future source preference: 2D uses approved/licensed manufacturer media where redistribution is permitted, licensed external imagery, generated representation, then generic fallback. 3D uses licensed exact/family GLB, custom/generated work, then licensed generic type models. Drivers use generated fictional portraits, licensed stock fictional representations, then generic avatars.

## 13. Asset Path Convention

Driver portraits use `public/assets/drivers/<driverId>.webp`; exact images use `public/assets/vehicles/images/<visualKey>.webp`; model-family GLBs use `public/assets/vehicles/models/<family>.glb`; generic GLBs use `public/assets/vehicles/models/<vehicle-type>-generic.glb`. Missing directories/files are not created by this phase.

## 14. Runtime-Data Preservation

The generator opens SQLite read-only and records identity hashes plus telemetry row count (28487) for before/after comparison.

## 15. Stage 3 Readiness

The manifests and priority pack are ready to drive a separately approved sourcing phase. No search, download, image generation, portrait generation or 3D generation occurred.

## 16. Remaining Gaps

19 owner-supplied portraits have recorded provenance. 6 driver portraits and all vehicle-specific visual assets remain absent.
