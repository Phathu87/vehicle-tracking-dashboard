# Fleet Drive AI Demo v1.1 - Sedan and Hatchback Visual Refinement

Owner: Phathutshedzo Rakhunwana
Date: 2026-10-08
Phase: 3.4B-R
Status: PARTIAL. SEDAN and HATCHBACK remain BLOCKED, not AVAILABLE.

## Scope and Baseline Preservation

Refinement of the existing procedural lofts, not replacement from scratch.
Read 3.4A engineering conventions and 3.4B failure report; reviewed the original
eight views and owner-supplied Sedan.jpg/Hatchback.jpg. Structural validity is
not visual approval. Other vehicle references/types remain outside this phase.

Before editing, original hashes and dimensions/counts were captured; original
authoring, validation and rendering scripts plus provenance were copied into
`3d-baseline-3-4b/`. The eight original PNGs and render-evidence.json in
`3d-qa-3-4b/` are retained without overwriting. The original Batch 1 report is
unchanged as historical failed-review evidence. Baseline metadata retains the
original GLB hashes; old binary payloads themselves were not duplicated.

| Original GLB | Captured SHA-256 |
| --- | --- |
| sedan-generic.glb | 040a4cc51c617bc1c1b955aacedce3cda549c09017dfc1be6b2e158737746704 |
| hatchback-generic.glb | b4237eeb031e219dc4b5de5252f259f9e2a0aa258fb9b521fbb728716d9a23e1 |

## Geometry Changes

1. Replaced per-segment zero-slope interpolation with continuous Hermite
   longitudinal profiles. Expanded body cross-section controls for a crowned
   bonnet, softened shoulders and curved side panels; redistributed sampling
   instead of arbitrary subdivision. Roof/rear profiles keep category definition.
2. Partitioned paint and glazing from the SAME cabin mesh faces. Boundary rows
   align window/roof/pillar transitions; removed all overlay windscreen/rear/side
   glass meshes and the hatch outline tube. This removes the old protruding
   rear glass and intersection artifacts rather than hiding them with materials.
3. Lowered cabin bases to meet the body shoulder; continuous normals remain
   shared across the underlying surface. Opaque restrained glazing retained.
4. Replaced raised box lamps with thin shaped cap details fitted at 1-2 mm
   surface offset. Front lamps/grille and rear lamps/reflectors are correctly
   located, without bloom, emissive effects, badges or registration text.
5. Repositioned door lines/handles against actual side-panel profiles, avoiding
   wheel-arch regions; reduced line radii. Mirror stems connect to the cabin.
   Original four tyre/rim assemblies, wheel centres, radius and grounding remain.

These changes refine the original method and reuse the wheel/material/export
pipeline. No source JPG is embedded as a plane, texture or traced stock mesh.
All GLBs contain actual multi-view geometry. Neutral silver stays visual-only.

## Before / After Technical Evidence

Dimensions include mirrors. Changes in overall length mainly remove the old
protruding bumper/lamp trim, not vehicle scaling. Roof curvature slightly changes
maximum height; all dimensions remain metre-scale, origin ground-centred.

| Property | Sedan before | Sedan after | Hatchback before | Hatchback after |
| --- | --- | --- | --- | --- |
| Length, m | 4.669 | 4.604 | 4.169 | 4.104 |
| Width with mirrors, m | 2.110 | 2.110 | 2.110 | 2.110 |
| Height, m | 1.472 | 1.494 | 1.517 | 1.533 |
| Triangles | 7,268 | 7,524 | 7,308 | 7,464 |
| Increase | - | 256 / 3.52% | - | 156 / 2.13% |
| Meshes / materials | 4 / 4 | 4 / 4 | 4 / 4 | 4 / 4 |
| Single-pass draw calls | 4 | 4 | 4 | 4 |
| File bytes | 624,092 | 636,624 | 628,420 | 630,144 |
| Local structural checks | PASS | PASS | PASS | PASS |
| Reference visual QA | PARTIAL | PARTIAL | PARTIAL | PARTIAL |

Both stay under 8,000 triangles, four materials and 1 MiB. The modest increases
come from curved cabin/profile boundaries, not padding. No budget exception.
No external textures/buffers/required extensions, animation or rigging added.

| Refined GLB | SHA-256 |
| --- | --- |
| sedan-generic.glb | f85d9bcac2605901023d74e394aa59aab6e457c84883e888a7d99569a5dab0af |
| hatchback-generic.glb | 4d1243ea3d8c81e0f90b937e85ad42a994034e42f11b62fbb93b246286ce7205 |

## Visual Review and Comparison

Eight NEW 1200x800 PNGs rendered with the same isolated Three r171/headless
Edge lighting/camera harness, not the React frontend. All were visually inspected
against the retained originals and broad owner reference proportions. Renderer
passes nonblank/pixel-margin checks; this does not imply aesthetic PASS.

| View | Sedan before / after | Hatchback before / after |
| --- | --- | --- |
| Front three-quarter | [Before](3d-qa-3-4b/sedan-front.png) / [After](3d-qa-3-4b-r/sedan-front.png) | [Before](3d-qa-3-4b/hatchback-front.png) / [After](3d-qa-3-4b-r/hatchback-front.png) |
| Side | [Before](3d-qa-3-4b/sedan-side.png) / [After](3d-qa-3-4b-r/sedan-side.png) | [Before](3d-qa-3-4b/hatchback-side.png) / [After](3d-qa-3-4b-r/hatchback-side.png) |
| Rear three-quarter | [Before](3d-qa-3-4b/sedan-rear.png) / [After](3d-qa-3-4b-r/sedan-rear.png) | [Before](3d-qa-3-4b/hatchback-rear.png) / [After](3d-qa-3-4b-r/hatchback-rear.png) |
| Top | [Before](3d-qa-3-4b/sedan-top.png) / [After](3d-qa-3-4b-r/sedan-top.png) | [Before](3d-qa-3-4b/hatchback-top.png) / [After](3d-qa-3-4b-r/hatchback-top.png) |

Confirmed improvements: no old floating rear-pane/outline; smoother bonnet/
roof transitions; lamps no longer raised bars; grounded aligned wheels; intact
mirrors; distinct sedan boot and hatch rear. No logos, text, plates or watermarks.

Acceptance remains PARTIAL:
- Front/rear caps are still blunt, slab-like surfaces rather than sculpted modern
  bumpers matching the references. Flush lamp patches are simplified, not convincing
  integrated 3D housings. The body is recognisable, but reference-quality realism
  is not achieved by simply fixing panes and removing protrusions.
- Beltline/cabin-body junction, especially the hatch rear, retains a heavy edge.
  Wheel-arch shading and interrupted door grooves still need topology/normal cleanup.
- The roof has subtle profile waviness; further controlled curvature refinement
  and stronger bumper/side-panel definition are needed without excessive smoothing.

No visual approval is invented. The corrective work is measurable progress,
but not completion of the owner's realistic visual standard.

## Technical QA and Limitations

`node scripts/validate-generic-vehicles.mjs`: PASS both. Verifies binary header,
version/length/chunks, scenes/node indices, all accessor layouts/ranges/finite
values, mesh triangles/material references, bounds and unit normals. Root
transforms identity, +Y/+Z extras, metre-scale positive dimensions, centred X/Z,
wheel contact min Y approximately -8.3e-9 m. No geographic heading embedded.

`node scripts/render-generic-vehicles.mjs --refinement`: PASS eight views loaded
by actual GLTFLoader/WebGL, four draw calls each, zero page errors. Server and
browser stopped on completion. New evidence: `3d-qa-3-4b-r/render-evidence.json`.
Current renderer always writes to the refinement folder to protect old evidence.
Archived scripts preserve the original method; to reproduce it, use them in an
isolated checkout with their original scripts/ paths, not directly in the archive.

Official Khronos validator remains unavailable; no install performed. Local
checks do not certify full glTF conformance, watertightness, all intersections,
real device performance, MapLibre integration or legal rights. Mobile/map QA
is future work. Builds/backend suites not run: runtime source unchanged.

## Provenance, Manifest and Preservation

Updated only the two model provenance records' refinement evidence, actual
dimensions/counts/hashes/notes, retaining original creation date and previous
hash. CUSTOM/PROJECT_ASSET basis remains original project geometry, not reference
JPG redistribution rights. Exactness stays VEHICLE_TYPE; status BLOCKED.

Manifest SEDAN/HATCHBACK remain BLOCKED with null accepted assetPath. Blocker
descriptions reflect remaining defects; other model categories remain unchanged.
The availability annotation points at this corrective report. Historical Batch 1
report, renders and frozen 2D provenance remain intact.

Preservation checks PASS:
- 30 Priority A frozen 2D hashes; all 19 existing driver portraits unchanged.
- 316 pre-existing protected source/data/legacy/image files unchanged digest:
  c9c13f22d16a4a894115c698ee2c2880fc30c698d04b0fe550c50d2a640cd2b1.
- DB unchanged SHA-256:
  ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4.
  This preserves drivers, assignments, current operations, telemetry and vehicles.
- Canonical fleet, simulator and frontend/backend runtime unchanged; no live
  DB write, migration, seed, server or simulator started.
- Root dependency files unchanged, no additional vehicle-type GLBs.
- JSON/provenance/hash checks and `git diff --check`: PASS. Old evidence retention
  and scoped manifest changes checked separately from application baseline.

## Decision

Phase 3.4B-R: PARTIAL. SEDAN: BLOCKED. HATCHBACK: BLOCKED.
Before/after comparison: PARTIAL against reference acceptance, improvements real.
Structural QA: PASS (local only). Performance budget: PASS (asset counts/bytes,
not GPU/mobile guarantees). Frozen 2D/database/runtime: UNCHANGED.

Recommended programme next phase: 3.4C - SUV & Pickup, only AFTER approved
Batch 1 visual acceptance. Safe to proceed now: NO. Further sculpted cap/panel
and glazing-junction work, potentially in Blender with explicit tooling approval,
is needed. No new categories, runtime changes, map changes, dependency installs,
commits, pushes or deployment. STOP after reporting this corrective phase.
