# Fleet Drive AI Demo v1.1 - Generic 3D Vehicle Engineering Plan

Owner: Phathutshedzo Rakhunwana
Date: 2026-10-08
Phase: 3.4A - Priority A Generic 3D Vehicle Pack Specification
Status: PASS for inspection/specification only. No 3D asset is AVAILABLE.

## 1. Objective and Authority

Specify six reusable lightweight vehicle-type GLBs for a future live map.
This document does not implement a renderer, acquire models, change data,
install dependencies or certify browser/GPU performance.

Inspected sources:
- `README.md`, `package.json`, `package-lock.json`.
- `server/data/fleet.json`, read-only runtime SQLite and the NORMAL_FLEET
  selector: canonical identities, authorised assignments and current operations.
- `docs/assets/V1_1_PRIORITY_A_2D_ASSET_FREEZE.md` and its verification JSON.
- `docs/assets/V1_1_PRIORITY_A_3D_PACK_SPEC.md`.
- `docs/assets/vehicle-asset-manifest.json`.
- `docs/assets/V1_1_PRIORITY_ASSET_PACK.md`.
- `docs/assets/V1_1_ASSET_REQUIREMENT_SUMMARY.md`.
- `docs/api/DRIVER_VEHICLE_LIVE_CARD_CONTRACT.md`.
- `src/components/dashboard/LiveMap.jsx` and current frontend imports.

Current verified baseline: 15 Priority A participants, 21 current-operation
pairs, 15/15 frozen portraits and 15/15 frozen vehicle images; 30 associations.
Current operation is `driver_current_vehicles`, not assignment order or the
deprecated vehicle driver column. DRV-015 remains Priority B and excluded.
The historical priority pack/inventory's pre-acquisition MISSING/desired EXACT
values do not override the 3.3E freeze or achieved representative fidelity.
The whole fleet has eight types; CROSSOVER and VAN are outside this six-type
Priority A scope. Existing Priority B/C classifications remain unchanged.

## 2. Reconciled Coverage and Naming

All paths in this table are proposed, not existing files. Runtime URLs omit
the `public` prefix. Filename selection is by canonical vehicleType, never
driver name, plate, assignment position or inferred appearance.

| Type | Count | Canonical ID: year/make/model | Target file |
| --- | --- | --- | --- |
| HATCHBACK | 4 | VH-PR-103: 2023 Volkswagen Polo; VH-RU-111: 2021 Ford Focus; VH-TH-112: 2022 Volkswagen Polo; VH-GQ-118: 2023 Chevrolet Spark | public/assets/vehicles/models/hatchback-generic.glb |
| MINIBUS | 2 | VH-JO-100: 2020 Hyundai H1; VH-CA-101: 2021 Hyundai H1 | public/assets/vehicles/models/minibus-generic.glb |
| PICKUP | 2 | VH-DU-102: 2022 Toyota Hilux; VH-MA-107: 2022 Nissan NP200 | public/assets/vehicles/models/pickup-generic.glb |
| SEDAN | 4 | VH-KI-105: 2020 Hyundai Elantra; VH-PO-110: 2020 Mercedes-Benz C-Class; VH-BL-113: 2023 Mercedes-Benz C-Class; VH-CA-115: 2020 Volkswagen Passat | public/assets/vehicles/models/sedan-generic.glb |
| SUV | 2 | VH-LO-106: 2021 Nissan X-Trail; VH-PH-123: 2023 Toyota Fortuner | public/assets/vehicles/models/suv-generic.glb |
| TRUCK | 1 | VH-DU-116: 2021 Scania R-Series | public/assets/vehicles/models/truck-generic.glb |

Coverage: 15 unique IDs, exactly one category each, six unique deterministic
filenames. Every asset's achieved exactness MUST be `VEHICLE_TYPE`.
Never label these EXACT, MODEL_SPECIFIC or DIGITAL_TWIN. The database remains
the authority for year, make, model, plate, colour, driver and telemetry.

## 3. Silhouettes and Scale

These dimensions are authoring targets, not measured manufacturer dimensions
or database facts. Validate final bounds and proportions in each batch.

| Type | Required silhouette | Illustrative length x width x height (metres) |
| --- | --- | --- |
| HATCHBACK | Compact two-box body, short rear overhang, roof/rear hatch, four wheels | 4.1 x 1.75 x 1.5 |
| SEDAN | Clearly separated bonnet, passenger cabin and boot; four wheels | 4.6 x 1.8 x 1.45 |
| SUV | Taller enclosed two-box body, upright cabin, raised wheel arches | 4.7 x 1.9 x 1.75 |
| PICKUP | Distinct cab and visible open cargo bed, raised stance | 4.8 x 1.8 x 1.7 |
| MINIBUS | Long tall passenger/commercial body, short bonnet, side window sequence | 5.1 x 1.95 x 2.0 |
| TRUCK | Heavy cab-over commercial cab and chassis, substantial tyres/axles | 6.5 x 2.5 x 3.5 |

One generic pickup cannot certify either Hilux double-cab or NP200 single-cab
configuration. One generic SUV does not imply identical X-Trail/Fortuner chassis.
The truck is a generic heavy cab/chassis representation, not an exact Scania
tractor, axle arrangement or trailer. No trailer configuration is inferred.

## 4. Coordinate and Orientation Contract

All GLBs: glTF 2.0, right-handed local coordinates, metres, +Y up, +Z nose,
+X vehicle-left. Root translation/rotation zero, scale (1,1,1); bake authoring
transforms before export. Origin is the horizontal footprint centre projected
onto ground: local X/Z bounds centred around zero and tyre contact at Y=0.
Allow at most 0.01 m grounding error; no floating detached geometry or buried
tyres. Relative dimensions remain physical rather than arbitrary equal cubes.
No baked longitude/latitude, scene lighting, geographic offsets or map scale.
This follows the [Khronos glTF coordinate conventions](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html).

Backend heading h is clockwise degrees from true north, in [0,360), nullable.
For a local model point (x,y,z), let theta = h * pi / 180. The proposed local
East/North/Up transformation is:

```text
east  = -x*cos(theta) + z*sin(theta)
north =  x*sin(theta) + z*cos(theta)
up    = y
```

Equivalently: local yaw -theta about +Y, then fixed basis (-x,z,y) into ENU.
Do not apply positive GLB yaw h blindly. The nose vector (0,0,1) must point
north/east/south/west for headings 0/90/180/270 respectively.

For a future Mercator custom layer, MapLibre x points east, y points south,
z points up. With anchor m = MercatorCoordinate.fromLngLat([lng,lat], altitude)
and s = m.meterInMercatorCoordinateUnits():

```text
mapX = m.x + s*east
mapY = m.y - s*north
mapZ = m.z + s*up
```

Use the [MapLibre metre conversion](https://maplibre.org/maplibre-gl-js/docs/API/classes/MercatorCoordinate/),
not a fixed worldwide degree/metre factor. The south-positive map basis entails
a handedness change; the later adapter must apply it once and test winding,
normal transforms and back-face culling. Camera bearing/pitch belongs to the
map projection; do not add camera bearing to world vehicle heading. Initial
scope is Mercator/flat ground, not globe projection or terrain draping.
Use a nearby shared scene anchor and metre offsets to limit floating-point
precision loss, with latitude-dependent scale tested across fleet cities.

Null heading is unknown, not a measured north-facing heading. A display may
retain a last valid orientation with stale/unknown indication; otherwise use
a nondirectional 2D marker. Bind position/heading to the explicit vehicle ID
through Express responses. Never derive movement from asset orientation or
mutate React mock telemetry. Terrain altitude needs separately verified data.

## 5. Visual Fidelity and Presentation Colour

Require shaped body panels/roof/bonnet, windows, recognisable front and rear,
correct wheel placement, headlights and rear lights. Rounded low-poly forms
are acceptable; featureless boxes are not. Inspect front, rear, side and map
three-quarter views before accepting each asset.

Use simple glTF metallic/roughness materials: neutral light-grey body,
charcoal tyres/windows, restrained light details. Opaque dark windows avoid
unnecessary transparency sorting/interiors. Lights may use small emissive
details without bloom or actual light sources. No manufacturer logos, trim
badges, plates, registration text, watermark or marketing overlays.
No detailed interiors/engines, rigging, doors, suspension or wheel animation.

Vehicle colour remains UNKNOWN. Neutral silver/grey is visual-only, never
written into fleet data. Any later colour variation is a separate presentation
palette, not a claim about paint. Status colour belongs to marker/selection
UI, not a silent modification of authoritative vehicle colour.

## 6. Preliminary Performance Budgets

These are proposed acceptance targets, not measured guarantees. They refine
the older pack's broad 20k-60k triangle / 1-3 MB allowances downward for mobile
map reuse. Any exception needs explicit review before acquisition acceptance.

| Resource | Target / review gate |
| --- | --- |
| Exported triangles | 3k-8k per type; truck up to 12k; above 15k rejected pending review |
| Materials and primitives | At most four opaque materials and four rendered primitives per type |
| Model draw calls | At most four per instance in a single pass; shadows/post-processing disabled |
| Textures | Prefer none; otherwise one 512x512 atlas; 1024 only after review; embedded in GLB |
| File size | Target 250-750 KiB; ceiling 1 MiB per non-truck and 1.5 MiB truck; six-file ceiling 6.5 MiB |
| 15-instance geometry | Target at most 124k triangles (14 x 8k + 12k); review ceiling 225k |
| 15-instance draw calls | At most 60 uninstanced model calls; map tiles/UI add their own cost |
| Optional instancing | Up to 24 model calls for six types x four primitives, subject to actual asset structure |
| Mobile rendering | Initial DPR cap 1.5; target >=30 fps and P95 frame interval <=33.3 ms on agreed test devices |

Measure exported/rendered geometry, not just Blender source polygons: seams
can split vertices. File bytes are not decoded GPU memory. Record vertex/index
buffer bytes and texture GPU estimates after load. No universal memory/fps
guarantee is made until actual low-memory devices and the complete map are
profiled. Test a 15-minute run, camera movement and telemetry refresh; degrade
to 2D when agreed device budgets fail. Reduced detail is optional future work,
not a reason to create extra GLBs in this phase.

## 7. Creation Strategy

| Method | Fidelity / effort | Rights and reproducibility | Polygon/size/reuse control |
| --- | --- | --- | --- |
| Licensed existing GLBs | Potentially high; search, legal review and adaptation needed | Must prove redistribution, modification, commercial Demo use and all embedded material/texture rights; retain licence evidence | Often oversized or inconsistent; simplify, reorient and revalidate; generic branding removal may be needed |
| Custom procedural modelling | Moderate; engineering plus silhouette review | Retain deterministic source scripts and creator/rights declarations; no external model dependencies by default | Strong control and consistent conventions; risk of block-like forms must pass visual gate |
| Blender-created low-poly models | Strong controlled silhouette; moderate authoring effort | Retain .blend/source scripts, tool/export versions, creator and verified project rights | Strong edit/export control; suitable six-type shared material palette |
| Generated 3D with verified export | Variable geometry/quality; substantial cleanup possible | Provider export, rights, redistribution and source evidence must first be verified | Polygon/material/texture budgets not predictable; only accept after simplification and full QA |

Primary: custom Blender-authored low-poly models, optionally script-assisted,
with reproducible metre-scale export. The [Blender glTF exporter source](https://github.com/KhronosGroup/glTF-Blender-IO)
supports a real glTF/GLB pipeline. Local Blender availability is NOT VALIDATED;
do not install it in this phase or assume it exists for Batch 1.

Fallback: custom procedural meshes with an audited export pipeline, using the
existing Three.js version where appropriate and verifying GLTFExporter support
before batch execution. Require recognisable shaped silhouettes, not boxes.
If neither workflow is available/approved, mark AWAITING_CREATION; no unrelated
model substitution. Raster image generation is not a GLB creation workflow.
No generated-3D provider or licensed model has been selected or acquired here.

## 8. Provenance and Licensing Policy

Create provenance only in an approved acquisition batch, one record per unique
GLB with all covered vehicle IDs. A planned record is not evidence of a licence.
Suggested future `vehicle-model-provenance.json` schema:

```json
{
  "assetPath": "/assets/vehicles/models/sedan-generic.glb",
  "vehicleType": "SEDAN",
  "vehicleIds": ["VH-KI-105", "VH-PO-110", "VH-BL-113", "VH-CA-115"],
  "status": "PLANNED",
  "sourceType": null,
  "sourceReference": null,
  "creator": null,
  "license": null,
  "licenseEvidence": null,
  "commercialUseAllowed": null,
  "modificationAllowed": null,
  "redistributionAllowed": null,
  "attributionRequired": null,
  "attribution": null,
  "exactness": "VEHICLE_TYPE",
  "createdAt": null,
  "acquiredAt": null,
  "sha256": null,
  "technical": {
    "format": "GLB",
    "gltfVersion": "2.0",
    "units": "METRES",
    "upAxis": "+Y",
    "forwardAxis": "+Z",
    "triangleCount": null,
    "primitiveCount": null,
    "materialCount": null,
    "textureDimensions": null,
    "boundsMetres": null,
    "byteSize": null,
    "requiredExtensions": [],
    "exporterVersion": null,
    "qaStatus": "NOT_VALIDATED"
  },
  "notes": "Specification template only; no physical asset or rights asserted."
}
```

Use an accurate sourceType such as CUSTOM_MODELLED, PROCEDURAL, LICENSED_ASSET
or GENERATED_3D only once supported by evidence. Preserve original source,
export settings, modification history and licence text/terms date. No invented
external URLs or automatic PROJECT_ASSET licence borrowed from the 2D images.
Unknown/restricted/no-redistribution rights -> LICENSE_REVIEW or REJECTED, never
AVAILABLE. Do not put local private paths, credentials or personal metadata
into shipped GLBs. Include required attribution in future distribution.

## 9. Existing Stack and Future Integration Requirements

Lockfile inspected: React 18.3.1, Vite 6.4.3, React Leaflet 4.2.1, Leaflet 1.9.4
(transitive), Three.js 0.171.0. Three is already declared (^0.171.0) but no active
Three/MapLibre renderer imports were found in src. MapLibre is not in the
lockfile. Current LiveMap uses React Leaflet circle markers and OSM raster
tiles; it does not currently render GLBs.

Recommendation: keep Leaflet operational now. In a separately approved future
integration, evaluate opt-in MapLibre GL JS Mercator with a Three.js custom
3D layer and GLTFLoader. React manages lifecycle/selection/API state, not
per-frame mesh creation. No whole-app rewrite or React Three Fiber requirement.
MapLibre installation/version selection, style/tile source, attribution,
network costs and provider terms are separate approval/verification gates.
Do not assume OSM raster tiles are a vector style or promise production tile
capacity. Unknown compatibility must be tested against pinned versions.

The [MapLibre custom-layer contract](https://maplibre.org/maplibre-gl-js/docs/API/interfaces/CustomLayerInterface/)
requires correct shared WebGL state/lifecycle and 3D depth handling. The future
adapter must use the selected version's render/projection API, reset shared
state as required, avoid clearing the map buffer, and test depth/occlusion.
No standalone decorative preview replaces the actual map experience.

[GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) is an addon, not a
new backend. Verify loader/exporter APIs against installed r171 rather than
assuming latest docs match. Begin with standard uncompressed GLB materials;
optional [glTF Transform optimisation](https://gltf-transform.dev/cli) can
deduplicate/prune and apply compression later. Meshopt/Draco/KTX2 require
matching decoder/transcoder support and deployment paths; do not silently add
extensions that the approved loader cannot read. No tooling installed now.

## 10. Reuse, Caching and Cleanup

Future requirements, not implementation:
1. Cache a single in-flight promise and decoded asset per URL/content hash.
   Six unique models, at most six initial downloads, even for 15 instances.
2. Clone transforms/scene nodes but share immutable geometry, materials and
   textures. Do not deep-copy GPU resources per vehicle. Default neutral palette
   allows sharing; per-vehicle material variants require explicit accounting.
3. Bind instance maps to canonical vehicle IDs; update only transforms from
   Express state. Interpolation is presentation between backend samples, not
   invented persisted movement. Keep stale/error states visible.
4. Consider [InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html)
   only after profiling: each material/primitive needs its own instance group,
   with instance-ID picking mapped to vehicle IDs. Fifteen plain shared clones
   may be sufficient; a GLB is not automatically one draw call.
5. Cancel obsolete subscriptions/requests on unmount, remove instances and use
   resource reference counts. Dispose geometry/materials/textures only when the
   last consumer releases them. Do not dispose shared resources per clone or
   force context loss on the map-owned WebGL context.
6. Repaint for movement/camera changes, not an unnecessary permanent loop.
   Test context loss/recovery, cache invalidation, route re-entry and style reload
   without duplicate layers, downloads or leaked resources.

## 11. Fallback Behaviour

Model fetch/parse/unsupported-extension failure -> that vehicle's 2D marker,
without dropping its real position or identity. Existing circle markers are
the guaranteed current fallback; frozen vehicle artwork may be used only after
separately approved marker integration. No claim it is already implemented.

Unsupported WebGL, context loss or failed MapLibre initialization -> existing
Leaflet map. Insufficient mobile performance -> user-selectable/automatic 2D
mode, with reduced-detail mode only if separately created and validated. Keep
selection, alerts and API states functional across mode changes. Missing data
and missing visuals are separate errors; never fabricate backend responses.

## 12. Future QA Acceptance Gates

Each batch must independently satisfy:
- Parse GLB magic/version/length and full scene; run Khronos glTF Validator using
  separately approved tooling. Reject missing/external textures or unsupported
  required extensions; package embedded resources, not remote dependencies.
- Record SHA-256, bytes, exported triangle/vertex/primitive/material counts,
  texture sizes, bounds and exporter versions. Check deterministic type mapping,
  unique paths and all AVAILABLE files physically present.
- Check metre scale, zero root transform/unit scale, centred origin, no negative
  mesh scales, tyre grounding and valid normals/winding. Cardinal headings,
  map bearing/pitch and city-latitude scale must all pass later renderer tests.
- Visually inspect body category from front/rear/side/three-quarter; windows,
  lights and wheels intact; no logos, badges, plates, watermark or fake exactness.
- Verify all asset/material rights and attribution before AVAILABLE; inspect
  source as well as shipped content. No licence inferred from downloadability.
- Load in the approved Three loader; confirm no missing texture, black/inverted
  geometry, floating fragments or unacceptable dark-UI contrast.
- Later integration: test 15 simultaneous vehicles, cache counts, picking,
  lifecycle cleanup, missing GLB, offline errors, WebGL/context loss and 2D mode.
- Later browser QA: 375/430/768/1024/1440 px, real low-memory mobile plus desktop,
  screenshots and nonblank canvas-pixel checks, full vehicle framing and actual
  telemetry-driven orientation; no collisions with operational controls.
- Profile frame time, GPU resources, total map overhead and warm/cold loading.
  Future measured evidence is required before calling mobile/production ready.

All asset/browser/GPU gates above are NOT VALIDATED in this planning phase.

## 13. Controlled Execution Batches

| Phase | Models | New / cumulative Priority A coverage | Independent gate |
| --- | --- | --- | --- |
| 3.4B | SEDAN + HATCHBACK | 8 / 8 of 15 | Physical GLB QA, silhouette/orientation/size and verified provenance |
| 3.4C | SUV + PICKUP | 4 / 12 of 15 | Same gates; retain Batch 1 hashes and conventions |
| 3.4D | MINIBUS + TRUCK | 3 / 15 of 15 | Same gates; retain earlier batches; truck silhouette/size review |

Keep this order: it serves eight vehicles first and reserves the unusual
minibus/heavy-truck shapes for the final batch. No later batch begins without
explicit approval. Asset creation is not authorization for map integration.

## 14. Phase Validation and Limitations

Planning checks PASS: six categories, 15 canonical IDs, unique proposed names,
VEHICLE_TYPE policy, cardinal transform mathematics, source reconciliation.
Read-only audit rechecked assignments/current operations, simulator selection,
all 30 provenance/path associations and approved 2D family reuse.

Before/after preservation evidence:
- Runtime SQLite SHA-256: ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4.
- 316 protected files across src, server (excluding node_modules), legacy,
  portraits and vehicle images: digest c9c13f22d16a4a894115c698ee2c2880fc30c698d04b0fe550c50d2a640cd2b1.
- Frozen 30 image hashes still match the 3.3E verification record.
- Root package/lockfile and 2D freeze documentation unchanged; zero GLBs created.
- `git diff --check` and new-document whitespace validation PASS.

No runtime changes, database writes, dependency installs, model acquisition,
2D changes, staging, commits, pushes or deployment. Existing unrelated dirty
work remains untouched. Runtime builds/tests were not run for this doc-only
phase; no application test or rendering PASS is implied.

Remaining limitations: no physical GLBs, no selected external asset licences,
local Blender/export availability not validated, MapLibre absent, no integrated
3D loader/fallback, no device/GPU benchmarks, unknown real colour/trim/body
derivatives and no terrain altitude. Original 2D representative limitations
remain. New budgets are planning targets, not evidence of achieved performance.

Safe to proceed: YES to separately approved 3.4B creation/validation, subject
to workflow availability and rights gates. STOP here; wait for approval.
