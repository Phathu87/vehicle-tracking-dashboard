# Fleet Drive AI Demo v1.1 - Generic 3D Batch 1

Owner: Phathutshedzo Rakhunwana
Date: 2026-10-08
Phase: 3.4B - Generic 3D Vehicle Models, Batch 1
Status: PARTIAL. Both physical GLB candidates are BLOCKED, not AVAILABLE.

## Objective and Reference Authority

Create genuine lightweight SEDAN and HATCHBACK geometry for the eight frozen
Priority A vehicle IDs recorded in the 3.4A engineering plan. No map/card/runtime
integration is included. Only Sedan.jpg and Hatchback.jpg are active references.
SUV.jpg, Bakkie.jpg (PICKUP), Minibus.jpg and Truck.jpg are reserved for later
batches; no corresponding models were created. JPGs remain unmodified outside
the repository and are not redistributed or embedded in any asset.

The supplied references define broad modern shape/visual quality, not rights,
manufacturer dimensions, exact models or licence to redistribute original
models. Sedan/Hatchback reference plate lettering and emblem details are
excluded. No image planes or reference-image textures imitate vehicle geometry.

## Tooling and Reproducible Creation

Blender was not found on PATH or under the standard Program Files Blender
Foundation location; an exhaustive disk search/install was not attempted.
Fallback used: existing local Three.js 0.171.0, BufferGeometryUtils and
GLTFExporter. No dependency installed or package/lockfile changed.

`scripts/create-generic-vehicles.mjs` authors original lofted body and cabin
surfaces, distinct boot/hatch roof profiles, four ground-contact tyre/rim
assemblies, glazing, mirrors, panel lines and lamp/trim geometry. Components
are baked and merged into four material meshes per model. GLTFExporter emits
real binary glTF 2.0 with embedded buffer, not renamed JSON/OBJ or an image.
The offline FileReader shim supplies Blob binary reads only; no image API needed.

Commands from repository root:

```powershell
node scripts/create-generic-vehicles.mjs
node scripts/validate-generic-vehicles.mjs
$env:PLAYWRIGHT_PACKAGE_ROOT='<installed or bundled Playwright package root>'
node scripts/render-generic-vehicles.mjs
git diff --check
```

QA uses an isolated ephemeral loopback HTTP server and headless Microsoft Edge,
serving only the installed Three files and two models. It closes the browser
and server in finally. No Express server, simulator or application frontend
starts. The renderer is tooling in scripts/, not React code or a map feature.
Re-export hashes were checked for repeatability with this installed exporter.

## Technical Results

| Property | SEDAN | HATCHBACK |
| --- | --- | --- |
| Physical candidate | public/assets/vehicles/models/sedan-generic.glb | public/assets/vehicles/models/hatchback-generic.glb |
| Length x width including mirrors x height, metres | 4.669 x 2.110 x 1.472 | 4.169 x 2.110 x 1.517 |
| Body width target, excluding mirrors | 1.80 m | 1.75 m |
| Exported triangles | 7,268 | 7,308 |
| Meshes / primitives / materials | 4 / 4 / 4 | 4 / 4 / 4 |
| Bytes | 624,092 | 628,420 |
| Single-pass isolated draw calls | 4 | 4 |
| Structural checks | PASS | PASS |
| Actual loader/render | PASS | PASS |
| Visual reference acceptance | PARTIAL | PARTIAL |
| Manifest availability | BLOCKED | BLOCKED |

Both fit the 3k-8k target, 1 MiB ceiling and four-material budget. No textures,
animation, skins, external buffers, decoders or required extensions. Opaque
PBR body/glass/tyre materials plus vertex-coloured trim/lamps. Light-grey paint
is presentation-only; database colour remains unknown. Details are simplified,
not manufacturer specification. No production performance claim is made.

## Coordinates and Structural Validation

Metres, +Y up, +Z nose; centred footprint at ground; root transforms identity.
All mesh transforms baked. Four tyre assemblies contact Y=0 within floating-
point tolerance; overall minimum Y approximately -0.000000008 m. Positive
physical bounds, symmetric X/Z bounds and distinct sedan/hatch proportions.
Heading/geographic coordinates are not baked; map orientation is future work.

Local validator checks magic/version/length/chunk layout, valid scenes/meshes,
accessor formats/counts/alignment/ranges, finite positions and unit normals,
triangle index references, accessor bounds, material references, root transforms,
ground/scale, embedded resources, budgets and exactness extras. GLTFLoader
independently loads both in an actual WebGL renderer with no page errors.

Khronos glTF Validator is absent from project/bundled dependencies. No official
full validator run was performed. Local checks are intentionally limited: they
do not certify every glTF rule, topology watertightness, self-intersection,
all manifold conditions, licensing, visual quality or map compatibility.

## Visual QA: PARTIAL, Not AVAILABLE

Eight 1200x800 PNG renders were produced and individually inspected:
front three-quarter, side, rear three-quarter and top for each GLB. Evidence:
`docs/assets/3d-qa-3-4b/render-evidence.json`. Pixel checks prove nonblank output,
framing margins and four actual draw calls; they are NOT aesthetic acceptance.

The two categories are recognisable: separate bonnet/cabin/boot in the sedan,
shorter rear overhang and extended roof/hatch in the hatchback. Wheels/windows/
mirrors and light elements are present; no logos, plates, text or watermarks.
All views are real perspective-dependent 3D geometry, not flat source images.

However the supplied realistic modern-car standard is not yet met:
1. Broad panels and front/rear caps remain too angular/block-like; refine
   bonnet crown, roof curvature, shoulders, bumper contours and body transitions.
2. Glazing patches/pillar joins need topology-conforming borders. Rear hatch
   glass and outline exhibit protrusion/intersection artifacts; side-view window
   edges and smoothing also need cleanup.
3. Headlights read as raised bars and rear lights as attached strips rather than
   integrated housings. Sink/shape lamp geometry into coherent bumper/body forms.
4. Door shut lines partly intersect/interrupt surfaces; align them with the
   actual panel surface. Improve wheel-arch shading and mirror-support finish.

The first iteration also had reversed loft faces, detected visually and fixed
before retained evidence. Budget reduction preserved four wheels and category
silhouettes. Current artifacts above still prevent marking either AVAILABLE.
Do not claim no intersections or reference-quality PASS from structural tests.

| Render set | Evidence files |
| --- | --- |
| Sedan | 3d-qa-3-4b/sedan-front.png; sedan-side.png; sedan-rear.png; sedan-top.png |
| Hatchback | 3d-qa-3-4b/hatchback-front.png; hatchback-side.png; hatchback-rear.png; hatchback-top.png |

## Provenance and Manifest

`vehicle-model-provenance.json` records two original CUSTOM project candidates,
creator, creation method, source script, active reference filename/hash, date,
exactness VEHICLE_TYPE, dimensions/counts/bytes/hashes and actual QA states.
PROJECT_ASSET covers original authored code/geometry/material parameters only;
no licence for supplied JPGs, original stock models or manufacturer content is
invented. No third-party model or texture was copied/downloaded. Normal Three
dependency licence obligations remain with software distribution.

Only SEDAN/HATCHBACK entries in vehicle-asset-manifest's vehicleTypeFallbacks
are updated to BLOCKED with candidatePath and technical/visual evidence.
assetPath stays null to avoid treating candidates as accepted runtime assets.
Availability-authority annotation links the new 3D provenance/report. All other
type entries, exactSpecifications, family records and frozen 2D fields remain
unchanged. No Priority B/C acquisition or manufacturer/year-specific 3D claim.

## Preservation and Validation

Before/after read-only audit: existing source, backend, simulator, legacy,
all portraits and vehicle WebPs unchanged. Newly created GLBs are excluded
from the protected baseline comparison, not hidden from the asset inventory.

- Protected pre-existing files: 316; unchanged digest
  c9c13f22d16a4a894115c698ee2c2880fc30c698d04b0fe550c50d2a640cd2b1.
- Runtime DB unchanged SHA-256:
  ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4.
- Canonical fleet, driver identities, assignments, current operations and
  telemetry included in unchanged SQLite/source bytes; no database write/import.
- Frozen Priority A 30 image hashes checked; 19 existing portraits preserved.
- Manifest section/type hashes verify only intended two type records and the
  3D availability annotation changed. Package/lockfile and freeze files unchanged.
- Re-export repeatability, structural/geometry/size checks, provenance JSON/path/
  hash agreement and git diff --check PASS. No frontend/backend tests run:
  runtime was not changed. No GPU/mobile/map readiness PASS implied.

## Acceptance and Next Gate

PASS: two real GLBs; structural checks; embedded resources/materials; metre
scale; grounded wheels; +Y/+Z; budgets; provenance; distinct categories; eight
render views produced; 2D/database/runtime preservation; no map integration.

NOT ACCEPTED: reference visual standard, clean glazing/lamp/panel joins.
Both models BLOCKED; accepted model coverage 0/8, candidate coverage 8/15.

Recommended programme next phase: 3.4C - Generic 3D Models, Batch 2, but NOT
safe to proceed yet. First approve/refine Batch 1 and repeat all visual gates.
Blender/manual topology refinement is preferable to accepting crude procedural
candidates. Desktop QA is not real-device/mobile or MapLibre integration proof.

STOP after this Batch 1 report. No other types, dependency installs, runtime
changes, map replacement, 2D changes, commits, pushes or deployment performed.
