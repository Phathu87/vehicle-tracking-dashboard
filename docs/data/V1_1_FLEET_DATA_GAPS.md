# Fleet Drive AI Demo v1.1 Fleet Data Gaps

> Historical pre-normalisation gap register. Items may have been resolved by
> Stage 2 Phases 2.1-2.7. The authoritative current baseline is
> `V1_1_STAGE_2_DATA_FREEZE.md`.

Audit source: current SQLite snapshot plus current Express services and seed source. No records were modified.

## Blocks Image Sourcing

| Gap | Current state | Required state | Recommended future fix | Affected records |
| --- | --- | --- | --- | ---: |
| Non-deterministic fleet seed | `Math.random()` chooses make, model, plate and original driver name on first database creation. | Stable canonical fleet identities across clean environments. | Replace random first-run identity generation with a reviewed deterministic seed dataset. | 350 vehicles |
| Vehicle variant absent | No variant/trim column or value exists. | Explicit variant or an approved `UNKNOWN` policy per asset. | Add reviewed variant data after source verification. | 350 vehicles / 177 specifications |
| Vehicle type absent | No body/fleet type field or canonical mapping exists. | Explicit type taxonomy or reviewed model-to-type mapping. | Add a controlled vehicle-type vocabulary. | 350 vehicles / 177 specifications |
| Make naming | `Mercedes Benz` is stored without the canonical hyphen. | One reviewed make value. | Normalise to `Mercedes-Benz` in a later data migration. | 27 vehicles |

## Blocks 3D Vehicle Matching

| Gap | Current state | Required state | Recommended future fix | Affected records |
| --- | --- | --- | --- | ---: |
| No 3D asset registry | No GLB, GLTF, FBX or OBJ file or mapping exists. | Licensed asset ID, format, source, licence and canonical vehicle key. | Design an asset registry after fleet normalisation. | 177 specifications |
| Incomplete specification | Variant, body style, engine and transmission are absent. | Minimum matching precision agreed for each 3D asset. | Define whether model-level representative assets are acceptable before sourcing. | 177 specifications |

## Blocks Current Driver Assignment

| Gap | Current state | Required state | Recommended future fix | Affected records |
| --- | --- | --- | --- | ---: |
| No current-active relationship | `vehicles.driver_id` represents assignment only. | Separate authorised assignments and one time-bounded active vehicle per driver. | Introduce an explicit assignment model in v1.1 WP2. | 25 drivers; 349 assigned vehicles |
| Many assignments per driver | Every driver has 13 or 14 assigned vehicles. | Active assignment must be explicit, never selected by array order. | Add active assignment state and assignment history. | 25 drivers |
| No driver foreign key | `vehicles.driver_id` is not constrained to `drivers.id`. | Referential integrity at database level. | Add a reviewed migration after compatibility analysis. | Vehicle-driver relationship |
| Repeated display names | 25 driver IDs use only five names. | Stable identity suitable for person-level visuals. | Review fictional driver identities before portrait creation. | 25 drivers |

## Blocks Road-Level Location

| Gap | Current state | Required state | Recommended future fix | Affected records |
| --- | --- | --- | --- | ---: |
| Road unavailable | No road field or road-matching service exists. | Road name derived from current coordinates. | Approve reverse geocoding/road matching and a cache/privacy policy. | 350 vehicles |
| Area is not granular | Every `area` value equals `city`. | Verified suburb/area separate from city. | Populate from approved geospatial resolution, not the current placeholder. | 350 vehicles |
| City naming inconsistency | Both `Mafikeng` and `Mahikeng` exist as separate 25-vehicle cities. | One reviewed canonical place name with aliases if needed. | Normalise location naming in WP2. | 25 `Mafikeng` vehicles |

## Blocks Vehicle Heading

| Gap | Current state | Required state | Recommended future fix | Affected records |
| --- | --- | --- | --- | ---: |
| Heading not stored | Telemetry has coordinates, speed, mileage, fuel and time only. | Heading in degrees with a defined stationary policy. | Derive bearing from consecutive movement points, then expose/persist it. | 350 vehicles / 28,487 points |

All 350 vehicles have at least one distinct movement vector, so heading is derivable for moving samples. It remains undefined when consecutive coordinates are identical.

## Non-Blocking

| Gap | Current state | Required state | Recommended future fix | Affected records |
| --- | --- | --- | --- | ---: |
| One unassigned vehicle | `VH-BL-100` has no `driver_id`. | Assignment may remain optional, but UI must show unassigned honestly. | Review operational intent in WP2. | 1 vehicle |
| No ignition | No telemetry field. | Optional boolean/event if future workflows require it. | Add only with a defined producer contract. | 28,487 telemetry points |
| No accuracy | No telemetry field. | Optional metres value from a real source. | Add only when producer can supply it. | 28,487 telemetry points |
| No altitude | No telemetry field. | Optional altitude value if product use requires it. | Keep absent unless a verified source exists. | 28,487 telemetry points |
| Stale current telemetry | Latest stored samples are from 2026-09-22; API status correctly resolves them as offline during this audit. | Fresh samples while simulation or hardware feed is active. | Keep freshness semantics; do not relabel stale records online. | 350 vehicles |
