# Phase 3.4B-S - Modelling Strategy Recovery

Owner: Phathutshedzo Rakhunwana. Audit date: 2026-10-08.
Scope: tooling audit and feasibility decision only. Status: PARTIAL.
Blender: NOT AVAILABLE in checked locations. Feasibility: NOT EXECUTED.
Ready for full model reconstruction: NO.

## 1. Preservation and Current Status

No existing assets, scripts, provenance or reports were rewritten. Existing
SEDAN and HATCHBACK records remain BLOCKED with PARTIAL visual QA and no accepted
runtime assetPath. Local structural validation was rerun successfully; this is
not visual acceptance or official Khronos certification.

| Existing GLB | Bytes | Triangles | SHA-256 |
| --- | ---: | ---: | --- |
| sedan-generic.glb | 636624 | 7524 | f85d9bcac2605901023d74e394aa59aab6e457c84883e888a7d99569a5dab0af |
| hatchback-generic.glb | 630144 | 7464 | 4d1243ea3d8c81e0f90b937e85ad42a994034e42f11b62fbb93b246286ce7205 |

Each has four meshes/materials/primitives. Both preserve metre scale, +Y up,
+Z forward and VEHICLE_TYPE exactness. Neither is promoted to AVAILABLE.

[Preservation inventory](V1_1_PHASE_3_4B_S_PRESERVATION.json) records individual
SHA-256 and byte counts for 426 pre-existing files, including all current and
archived authoring scripts, both GLBs, provenance, manifests, prior reports,
16 PNG QA renders and their two evidence JSON files. It also covers frontend,
backend/data, legacy, dependency manifests and all existing driver/vehicle images.
Excluded dependency/generated directories: node_modules, .git, dist.
The new report and inventory are outside that baseline.

All 30 frozen Priority A 2D checks match the freeze verification. No originals,
database, assignments, identities, simulator or runtime code changed.

## 2. Root Cause

Inference from current authoring code, the corrective report and direct review
of sedan-front and hatchback-side renders: the limitation is topology and shape
control, not GLB packaging. Body rings terminate in triangulated end caps, so
bumper faces remain slab-like. Increasing samples or smoothing longitudinal
profiles does not provide sculpted bumper transitions, recesses or panel loops.
Wheel-arch deformation produces uneven shading; the cabin/body belt junction
is visibly abrupt. Partitioned glazing improved flushness but did not correct
the surrounding body contour. Sedan/hatchback lengths differ, yet the common
construction still constrains realistic category-specific silhouettes.

Normals, byte limits and triangle counts can pass while these defects remain.
Another broad loft refinement is not justified by the existing evidence.

## 3. Available Tools

Checks: Get-Command blender and winget returned no installed command; no Blender
entry was found in HKLM/HKCU uninstall registries, standard Program Files and
LocalAppData Blender Foundation locations, WindowsApps, or immediate entries
in Downloads/Desktop/Documents. This is a bounded discovery audit, not proof
that no executable exists anywhere on the machine. No working Blender executable
was identified, so its Python interface could not be executed.

Bundled Python importlib.find_spec('bpy') returned false. Absence of standalone
bpy alone would not prove Blender unavailable: Blender supplies its own Python.
Existing Node/Three.js r171 authoring, GLTFExporter, local structural validator
and prior browser render pipeline are available. They prove export/inspection,
not the proposed subdivision workflow. No editable .blend master is established
for these two models. No software, models or extensions were downloaded/installed.

## 4. Alternatives

| Approach | Quality / workload | Rights and reproducibility | GLB support / decision |
| --- | --- | --- | --- |
| Blender mesh + subdivision/bevel | Best control over arches, bumper contour, panel boundaries and silhouettes; skilled topology editing and review required | Original geometry avoids stock-model clearance; retain .blend master, modifier settings, pinned tool and export script | Built-in export; RECOMMENDED |
| Blender Python + manual refinement | Efficient symmetric base mesh and setup; scripts alone do not replace artistic topology judgment | Reproducible scripted baseline; save manually refined master and export recipe | Same exporter; useful supporting workflow, not another unattended full-model generator |
| Licensed editable models | Potentially fastest high-quality base; topology cleanup, unbranding and retopology may be substantial | Require item-specific licence permitting modification AND redistribution in shipped GLB; reject unknown, editorial-only or render-only rights | Format/export and budgets must be checked per candidate; none selected or cleared |
| Existing Three geometry | Available immediately for dimensions, wheel placement and comparison; present surfaces already failed twice | Existing original geometry and scripts preserved; deterministic export | Keep as proportion guide/QA comparator, not final curved-body topology |

This is a workflow comparison, not a claim that a specific external model has
been inspected or licensed. No stock-model acquisition was undertaken.

## 5. Recommended Workflow

Use Blender-authored low-poly quad control meshes, with Python limited to
repeatable scene setup, symmetry, material assignment, export and metrics.
Refine bumper curvature, arch support loops and panel junctions explicitly;
use limited subdivision and selective bevels, not indiscriminate high-level
subdivision. Construct flush glazing/light recesses in the surrounding surface.
Model sedan boot/deck and hatch roof/tailgate distinctly before detailing.
Import the old GLBs only as locked scale/proportion references if useful.

Retain editable .blend masters; export optimized evaluated meshes separately.
Blender normally authors Z-up: choose a consistent local vehicle axis, export
with glTF axis conversion, then verify the actual exported mesh has +Y up and
+Z nose, metre units, identity root transform and grounded tyres. Do not assume
an export checkbox proves orientation. Use the existing local validator and
cardinal-view inspection; official Khronos validation remains a separate gate.
Preserve VEHICLE_TYPE metadata without implying any exact make/model/trim.

## 6. Approval-Gated Installation and Proof

Proposed reproducible route, NOT executed:
1. Obtain owner approval for a portable Windows Blender installation and target
   directory outside runtime assets. Confirm CPU architecture and requirements.
2. Select an official Blender 4.5 LTS Windows ZIP, pin the exact patch/release
   URL and filename before download; record its official published SHA-256 and
   compare the downloaded archive. Do not invent a checksum or use an unpinned
   'latest' package. Keep the archive/tool outside Git.
3. Extract to a versioned tooling directory with isolated user configuration;
   use the absolute executable path without changing global PATH/file associations.
4. Record --version and test --background --factory-startup --disable-autoexec
   --python-exit-code 1 --python-expr "import bpy; print(bpy.app.version_string)".
   A zero exit plus expected version output is the first scripting gate.
5. In a separate evidence directory, build ONLY a curved bumper corner and
   wheel-arch transition from a small quad cage. Retain source, modifier values,
   .blend, study GLB, hashes, metrics, dark-background three-quarter/side/front
   and wireframe renders. Never write into the existing public model paths.
6. Inspect smooth highlights, silhouette, recess/arch transition and finite
   geometry after GLB round-trip. Obtain feature-level visual acceptance before
   approving reconstruction of either whole vehicle.

Feasibility proof: NOT EXECUTED because the suitable recommended modelling
toolchain is unavailable locally. Existing Three export is not a substitute
for demonstrating Blender subdivision/bevel topology. No study, render or
Blender scripting success is claimed. Installation feasibility is documented,
but local permission, hardware compatibility and successful execution remain
unverified until the approval-gated test.

## 7. Licensing

Original project geometry can retain CUSTOM / PROJECT_ASSET provenance, with
actual authorship and tools recorded. Blender's GPL governs the software, not
the artwork produced. This does not grant rights to third-party input models.
Owner-supplied reference JPG redistribution rights remain unestablished: use
only broad visual guidance, never embed/copy branded geometry or texture data.
For external candidates, archive source URL, licence/version, creator, permitted
redistribution/modification and attribution before use. Downloadability and
purchase alone are not sufficient; no external rights were established here.

## 8. Performance Implications

Existing assets are ~616/622 KiB and ~7.5k triangles, already within planning
budgets. Subdivision can multiply quad faces about fourfold per level, so use
low levels on a controlled cage and count the final triangulated export.
Bevels, split normals and UV seams can add exported vertices. Optimize by
retopology/selective detail rather than blanket decimation that damages arches.
Retain target 3k-8k triangles, review ceiling 15k, <=4 materials/primitives,
250-750 KiB target and <=1 MiB per non-truck asset. No new texture pipeline is
required for the feature study. Fifteen 8k models would be ~120k triangles and
up to 60 model draw calls, excluding maps/UI. These are estimates, not measured
GPU/mobile guarantees. No new benchmark PASS is claimed.

## 9. Controlled Steps and Acceptance

After tooling/proof approval only: approve distinct silhouette cages, then one
sedan reconstruction in a candidate directory, then independent hatchback
reconstruction. Review after each feature milestone; keep old candidates until
owner acceptance. Save reproducible export commands/version and editable masters.
No SUV/Pickup phase starts automatically.

Required gates: sculpted bumper front/corner/underside; smooth curved panels
without pinching; shaped arches with coherent edge loops and no tyre clipping;
flush glazing and lighting without floating slabs; recognizable distinct sedan
and hatchback silhouettes; full framing and dark-UI readability in orthographic
and three-quarter views; no logos/plates/watermarks; verified metre/+Y/+Z mapping;
budget compliance, standalone GLB, finite normals/positions and documented rights.
Technical PASS cannot override failed visual review. Runtime/mobile integration
and device performance remain later, separately authorized gates.

## 10. Verification and Blockers

Reran node scripts/validate-generic-vehicles.mjs: PASS local structural checks
for both existing files. Before/after hashes: PASS, all 426 pre-existing files
unchanged, including the 16 QA renders; all 30 frozen 2D hashes match. Inventory
JSON and new-document whitespace validation: PASS. git diff --check: PASS (only
existing LF/CRLF conversion warnings). Frontend/backend suites are not required for this documentation-only
audit and were not run; no runtime verification claim is implied.

Remaining blockers: owner installation approval; executable/Python/export proof;
single-feature visual acceptance; skilled topology refinement capacity; official
validator availability; full candidate reconstruction and owner review. A usable
Blender install alone will not resolve the visual acceptance blocker.

Phase PARTIAL: audit/recommendation complete, proof blocked by tooling. Existing
GLBs PRESERVED; frozen 2D UNCHANGED; database/runtime UNCHANGED; reconstruction
readiness NO. No dependencies installed, new models built, source/runtime changed,
assets acquired, commits, pushes or deployment. STOP after this report.

## Official Research Sources

- [Windows ZIP/installer guidance](https://docs.blender.org/UATEST/manual/en/4.5/getting_started/installing/windows.html): ZIP can be extracted without administrator installation; architecture must match.
- [Official LTS release page](https://www.blender.org/releases/4-5/): obtain and pin the selected official portable release, not an assumed local installation.
- [Modifier stack](https://docs.blender.org/manual/en/4.5/modeling/modifiers/introduction.html), [bevel](https://docs.blender.org/manual/de/4.5/modeling/modifiers/generate/bevel.html) and [subdivision](https://docs.blender.org/manual/uk/4.5/modeling/modifiers/generate/subdivision_surface.html): non-destructive geometry tools; stack order and topology matter.
- [Command-line Python options](https://docs.blender.org/manual/th/4.5/advanced/command_line/arguments.html): Python execution and exception exit-code controls.
- [glTF export](https://docs.blender.org/manual/es/4.5/addons/import_export/scene_gltf2.html): mesh/material export; UV/shading splits affect exported vertex counts.
- [Blender licence](https://www.blender.org/about/license/): artwork is not required to adopt the software's GPL.

Official localized manuals were used where English/latest pages could not be
fetched. Research establishes documented capabilities, not local execution.
