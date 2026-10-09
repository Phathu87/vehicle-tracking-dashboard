# Phase 3.4B-S4 - Alternative 3D Asset Feasibility & Recovery Decision

Owner: Phathutshedzo Rakhunwana. Research date: 2026-10-09.
Status: PARTIAL. A practical recovery workflow is recommended; no stock model
has passed licence, package, visual and technical acceptance together.

## Scope and Evidence Limits

Research and documentation only. No model downloads, purchases, new GLBs,
software installations, system repairs, runtime edits or deployment occurred.
Prices and listing metadata are observations, not quotations or warranties.
Some Sketchfab detail pages returned HTTP 403; their indexed primary listing
text was available. Exact licence versions and downloadable package formats
remain unverified where explicitly indicated below. No model geometry or
interactive stock-model preview was inspected. Visual suitability assessments
are preliminary inferences from listing descriptions, not visual acceptance.

Inputs reviewed: README.md; V1_1_PHASE_3_4A_3D_ENGINEERING_PLAN.md;
V1_1_PHASE_3_4B_3D_BATCH_1.md; V1_1_PHASE_3_4B_R_VISUAL_REFINEMENT.md;
V1_1_PHASE_3_4B_S_MODELLING_RECOVERY.md; S1 setup, S2 diagnosis and S3 trace
reports; preservation inventory; owner-supplied Sedan.jpg and Hatchback.jpg.

## Preserved Engineering and Visual Requirements

- glTF 2.0 GLB; right-handed, metres, +Y up, +Z forward/nose.
- Identity root transform, unit scale, ground contact, centred X/Z origin.
- Exactness VEHICLE_TYPE, never exact fleet make, model, year or trim.
- Sedan must retain a distinct rear boot; hatchback a distinct rear hatch.
- Target 3k-8k exported triangles per type. Above 15k requires rejection
  pending review, not an automatic budget increase.
- At most four opaque materials and four rendered primitives per type.
- Target 250-750 KiB; non-truck ceiling 1 MiB; six-type pack ceiling 6.5 MiB.
- Initial assets use standard uncompressed materials, no external textures or
  required extensions, no rig/animation, logos, badges, plates or watermarks.
- Sculpted bumpers, curved panels, shaped wheel arches, flush glazing/lights,
  credible proportions and continuous panel junctions are visual gates.
- Asset budgets do not certify mobile frame rate or future map integration.

The owner JPGs show the desired smooth, modern passenger-car presentation.
They contain branded/watermarked plate imagery. They are reference-only:
their presence does not grant model, image, texture or design redistribution
rights. Do not copy their watermark, badges, plates or branded identity.

Existing procedural models meet local structural/count checks but remain
BLOCKED visually. Repeated failure is a surface/topology and junction-quality
problem, not a lack of polygons alone. Adding subdivisions to the same layered
primitive construction is not an evidence-backed recovery strategy.

## Candidate Register

Seven listings below provide four sedan and four hatchback candidates because
one pack contains both. They are research candidates, not approved assets.
Listed source bytes are not final GLB sizes; polygons are not necessarily
triangles. No listed model has been downloaded to resolve those differences.

### S1/H1 - Generic passenger car pack - Comrade1280 / Sketchfab

[Primary listing](https://sketchfab.com/3d-models/generic-passenger-car-pack-20f9af9b8a404d5cb022ac6fe87f21f5).
Listed free, CC Attribution; exact licence version and package formats/bytes
not confirmed. Sedan 7,122 triangles; hatchback 6,808 triangles. Whole-pack
69.3k triangles must not be mistaken for either individual car. The author
describes generic mobile-game exteriors and optional texture-free materials.
This is the most promising stock pair on geometry budget and consistent style,
but wheel arches, flush panels and fidelity remain unvalidated. Author claims
about trademark safety are not independent clearance. Commercial modification
and raw GitHub/hosted redistribution are conditionally suitable under the
actual CC BY licence, with attribution and change notices. Blender dependency
UNKNOWN until downloadable formats are established. Priority: conditional
licence/package/preview review, not acquisition approval.

### S2 - Generic Lowpoly Sedan - scailman / Sketchfab

[Primary listing](https://sketchfab.com/3d-models/generic-lowpoly-sedan-35f6ef7fc08c451eb714c3fc70f6a6e5).
Listed free, CC Attribution; exact version unconfirmed. OBJ+MTL and FBX are
explicitly described; package bytes undisclosed. 2.2k triangles, 1.5k vertices.
Generic basic interior and simple colour treatment may be too crude for the
approved presentation; low counts alone do not establish quality. CC BY
commercial modification/raw redistribution is conditional on the actual
licence and attribution. Conversion does not inherently require Blender:
existing OBJ/MTL loaders and GLB exporter could be evaluated after approval.
Actual visual suitability and material conversion are NOT VALIDATED.

### S3 - Generic Sedan Car - MMC Works / Sketchfab

[Primary listing](https://sketchfab.com/3d-models/generic-sedan-car-58c33766470d46e7b2aed542650494e5).
Listed free, CC Attribution with NoAI tag; exact licence version, formats and
bytes unconfirmed. 113.2k triangles, 58.8k vertices; described as Blender-made,
with basic textures, rough interior, separated parts and Rigacar rigging.
Potential detailed source, but substantial retopology and de-rigging would
be necessary. Blender requirement UNKNOWN for conversion, practically likely
for authoring/rig cleanup if only native sources are supplied. Conditional
CC BY public redistribution requires licence verification and attribution;
do not use this candidate or its renders as generative-AI/training inputs.
Not a lightweight ready-to-use GLB and not the preferred recovery path.

### S4 - Generic Sedan 3 - weeray / CGTrader

[Primary listing](https://www.cgtrader.com/3d-models/car/car/generic-sedan-3).
Observed USD 99. Royalty Free License (no AI). Subdivision-ready source:
59,309 polygons, 64,212 vertices. OBJ 16.6 MB (two files), FBX 9.12 MB,
Blender 2.76/Cycles 11.6 MB. Editable high-detail starting point, but significant
retopology/material reduction would be required; no final quality guarantee.
OBJ/FBX conversion need not use Blender, while native editing does.
Commercial modification is limited by incorporated-product conditions.
Public raw GLB repository and openly extractable hosted GLB: NOT SUITABLE
under the inspected default licence. A properly documented custom grant
would be required before reconsideration. Do not buy on the existing terms.

### H2 - 2017 Allerauto Wolf (Interior coming soon!) - NNXST / Sketchfab

[Primary listing](https://sketchfab.com/3d-models/2017-allerauto-wolf-interior-coming-soon-1f216b6075e34ec19b1a05a96add8f4d).
Listed free, CC Attribution; exact version, downloadable formats and bytes
not confirmed. 3k triangles, 2k vertices; fictional 2017-2021 hatchback,
authored in Blender 2.91/GIMP. Interior, engine and underside were described
as future work. Exterior-only use may avoid interiors, but missing underside
and finish need review. Conditional CC BY commercial/modification/raw
redistribution with attribution; Blender dependency UNKNOWN pending formats.
Promising budget, incomplete and visually unvalidated; backup candidate only.

### H3 - Generic Hatchback Low-poly 3D model Game Ready - YunxDestro / CGTrader

[Primary listing](https://www.cgtrader.com/free-3d-models/car/car/generic-hatchback-low-poly-3d-model-game-ready).
Listed FREE, Royalty Free License (no AI), not CC0/CC BY. 43,147 polygons,
47,841 vertices. OBJ 1.01 MB, FBX 5.59 MB, BLEND 8.46 MB, STL 2.39 MB;
texture package 52.8 MB. Described with 36 materials and separated parts.
Editable generic hatchback, but geometry/material/texture reduction is major
despite the game-ready label. Non-Blender OBJ/FBX conversion is possible in
principle; material fidelity and native Cycles features are unverified.
Commercial modification is conditional on incorporation; public raw GitHub
and extractable hosted GLB are NOT SUITABLE under the default licence.
Free price does not remove redistribution restrictions. Do not acquire.

### H4 - Generic Subcompact Hatchback - MattMod / TurboSquid

[Primary listing](https://www.turbosquid.com/FullPreview/Index.cfm/ID/2555572).
Standard licence. Price and package bytes were not disclosed in the retrieved
listing. Cinema 4D 26 native, 3DS, OBJ, FBX and texture ZIP; 82,100 polygons,
110,100 vertices. Detailed compact source, but the three-door description
is a weaker match to the five-door reference and the count exceeds budget.
OBJ/FBX conversion does not inherently require Blender; native C4D editing
requires appropriate software. Modification/commercial incorporated use is
conditional. Public raw GLB repository/extractable hosted GLB: NOT SUITABLE
without a separate written grant. Do not acquire on standard terms.

### Other Source and Rejection Notes

[Kenney Car Kit](https://kenney.nl/assets/car-kit) lists 45 files under CC0,
free with optional donation. Redistribution/modification is rights-compatible
on that basis, but the stylised kit is not evidence of achieving the approved
sculpted passenger-car standard. Individual sedan/hatchback availability,
formats, counts and sizes were not verified; not included in candidate totals.
Do not substitute it just because it is free.

The inspected [TurboSquid Generic Hatchback 1993](https://www.turbosquid.com/FullPreview/2356740)
is editorial-only and lists 201,202 polygons. Reject commercial/promotional
Demo use absent additional rights; also unsuitable as a lightweight modern
starting point. No rejected or conditional source was downloaded.

## Licensing Findings

Public GitHub and an openly served GLB constitute extractable asset delivery.
Using an asset inside an application does not by itself resolve raw-file rights.
Changing format, removing branding or reducing polygons does not erase terms.

- [CGTrader terms, sections 21A and 21B](https://www.cgtrader.com/pages/terms-and-conditions)
  restrict distribution to incorporated products and require reasonable
  safeguards against model access. Commercial modification is allowed within
  those conditions; ordinary public GLB distribution is not cleared. Free
  listings retain their selected licence. No-AI terms remain applicable.
- [TurboSquid official licence FAQ](https://www.turbosquid.com/)
  restricts file redistribution to non-extractable larger creations. Editorial
  assets have additional promotional-use restrictions. This phase obtained
  no exception or seller permission for public source files.
- [CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/) permits
  commercial sharing/adaptation with credit, licence link and change notices.
  This illustrates the rights category, not confirmation that the Sketchfab
  candidates use version 4.0. Capture the actual linked licence and author
  identity before acquisition. Third-party rights still require review.
- Commissioned original geometry needs written rights covering editable
  sources, modifications, commercial hosting and raw public-repository
  redistribution. A payment receipt alone is insufficient.

These are conservative operational licence gates, not legal advice or a
guarantee that marketplace uploads clear all third-party rights.

## Conversion Without the Blocked Blender Installation

The repository already has Three.js 0.171.0 and OBJLoader, MTLLoader, FBXLoader
and GLTFExporter files. No dependency was installed. Official
[OBJLoader](https://threejs.org/docs/pages/OBJLoader.html),
[FBXLoader](https://threejs.org/docs/pages/FBXLoader.html) and
[GLTFExporter](https://threejs.org/docs/pages/GLTFExporter.html) documentation
supports a possible offline OBJ/FBX -> scene -> binary GLB workflow.
Latest documentation is not a substitute for testing the installed version.

After separate approval, an isolated converter could select only the two
required meshes, remove unnecessary interiors/rigs, normalise axes/scale,
merge compatible geometry, assign four approved opaque materials and export
GLB. A compatible glTF/GLB source would simplify this further. No researched
candidate is confirmed here as a ready-made compliant professional GLB.

Conversion does not sculpt better arches or rebuild curved panel topology.
FBX version compatibility, texture loading, proprietary materials, normals,
seams and modifiers need testing. Blind simplification can destroy the very
surface quality being recovered. Native BLEND/C4D-only content is not a
Blender-free conversion candidate. No actual conversion or performance test
was executed in this research-only phase.

## Option Comparison

| Option | Quality and time | Rights/cost | Reproducibility and compatibility | Decision |
| --- | --- | --- | --- | --- |
| Licensed professional stock GLB/source | Could shorten authoring; listed detailed sources need extensive optimisation; final quality unverified | Inspected standard paid/free licences fail public raw redistribution; custom grant quote required | Keep licence/package/hash evidence; conversion conditional on formats; counts/materials often too high | No stock asset cleared; CC BY pair is a conditional evaluation lead |
| Known-working Blender workstation, original meshes | Best control over curved panels, arches, flush joins and two silhouettes; skilled modeller required | USD 0 Blender licence; labour/access quote required; written publication rights essential | Save editable sources, modifier settings, exporter version and validation evidence; test workstation first | Recommended primary path |
| Linux cloud GPU workstation with Blender | Comparable authoring capability if interactive desktop works; setup/latency add work | Hourly compute plus storage/other charges and modeller time | Bypasses this Windows activation context, but account, GPU/desktop and export must be separately proven | Contingency, not provisioned or validated |
| More of the same Three.js procedural refinement | Existing two attempts remain visually blocked; duration/result unpredictable | No new stock licence cost; considerable engineering time risk | Reproducible scripts but same shape-quality limitation; GLB pipeline already structural-only | Do not repeat without a convincing isolated feature proof |

### Cloud and Cost Evidence

[DigitalOcean/Paperspace pricing](https://docs.digitalocean.com/products/paperspace/pricing/)
lists RTX4000 at USD 0.56/hour and A4000 at USD 0.76/hour. An illustrative
20 powered-on hours is USD 11.20 or USD 15.20 compute only, not an all-in
quote. Storage/IP/add-ons can continue charging while powered off. Taxes,
subscription requirements, capacity and labour are not included.
[Machine types](https://docs.digitalocean.com/products/paperspace/machines/details/machine-types/)
list Linux GPU configurations. Do not rely on legacy Windows-template pricing
or assume a usable remote modelling desktop is preconfigured.

A cloud Linux desktop is a technically plausible contingency, not a validated
service here. Headless notebooks alone do not provide manual mesh modelling.
Remote access, graphics support, source transfer and export reproducibility
must be proven before authoring. No account or machine was created.

Recommended original-workflow cost: Blender licence USD 0; modeller and
workstation access costs UNQUOTED. Planning allowance 1-3 working days for a
controlled pair including review/export is an engineering estimate, not a
vendor commitment. Obtain a fixed-scope quote with revisions and publication
rights before approving spend. Stock price anchors above exclude custom rights
and optimisation; they are not the cost of accepted deliverables.

## Recommended Recovery and Approval Plan

Select original mesh modelling on a separately verified Blender workstation.
This avoids this installation's activation blocker and provides editable
topology plus a clear project-rights route. It is recommended for controllable
quality and publication rights, not minimum software cost. No known-working
external workstation or contracted modeller has yet been identified/tested.

1. Owner approves a bounded workstation validation and original-modelling
   brief, not immediate reconstruction or expansion to other categories.
2. Identify a working workstation/operator and written source/publication
   rights; agree quote, scope and revision gates. Do not reuse stock geometry
   or reference-image textures without separately verified permission.
3. On that environment prove CLI/Python/background execution, mesh creation
   and GLB export using a disposable non-vehicle test. Record versions/hashes.
4. Demonstrate one curved bumper/wheel-arch segment with manual topology,
   bevel/subdivision controls, correct normals and flush adjacent surfaces.
   Require owner visual acceptance before full-model authoring.
5. After separate reconstruction approval, author only Sedan and Hatchback,
   keeping high-quality editable masters and budgeted export meshes. Export
   Y-up, Z-forward/metre-scale results; verify actual GLB transforms/bounds,
   rather than trusting source-editor axes.
6. Save new work separately. Validate structural conformance, counts, bytes,
   materials and rights; render front, rear, side, three-quarter and close-up
   views on light/dark backgrounds at desktop/mobile scales. Require visual
   approval. Do not replace either blocked GLB until expressly approved.

Optional alternative: owner can separately approve licence/package/preview
evaluation of Comrade1280's CC Attribution pair. First resolve licence version,
download formats, modification rights for every included component and visual
fit. No current stock acquisition or publication recommendation is made.

## Acceptance Gates and Remaining Blockers

Model readiness requires BOTH structural/performance compliance and owner
visual acceptance; original source/publication rights must be recorded.
The former 16 QA renders remain evidence of blocked models, not acceptance.
No map/runtime integration or new category is authorised by this report.

Remaining blockers: no approved external workstation/operator, no labour
quote/rights agreement, no accepted feature proof, no stock licence/package
capture, no actual stock visual/geometry audit, and no measured mobile/GPU
performance. Local Blender remains not operational; S3 root cause stays
UNDETERMINED. This phase does not diagnose or repair it further.

## Preservation and Verification

Before report creation, all 426 entries in the S preservation inventory matched
their SHA-256 hashes. Five additional preservation/recovery/S1-S3 documents
were independently hashed. Repeat checks after report creation: PASS for all
431 protected files, including both existing GLBs, 16 QA renders, frozen
Priority A 2D assets, portraits, authoring scripts, data/runtime and legacy.
The only new deliverable from this phase is this report. Existing unrelated
worktree edits were left untouched.

| Protected item | SHA-256 |
| --- | --- |
| Existing Sedan GLB | f85d9bcac2605901023d74e394aa59aab6e457c84883e888a7d99569a5dab0af |
| Existing Hatchback GLB | 4d1243ea3d8c81e0f90b937e85ad42a994034e42f11b62fbb93b246286ce7205 |
| Runtime database | ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4 |
| S3 trace report | d475e0fff38e2dea91f98452cfca6943a0c25f4867e09ac8ffcf3e3d9238449a |

`git diff --check`: PASS; new report whitespace checked separately because it
is untracked. No frontend/backend tests or build executed: no runtime changes.
No server, simulator, database migration or modeller was started.

## Phase Completion Report

| Field | Result |
| --- | --- |
| Phase | 3.4B-S4 - Alternative 3D Asset Feasibility |
| Status | PARTIAL |
| Candidate Sedan models | 4, research-only; none cleared |
| Candidate Hatchback models | 4, research-only; none cleared |
| Licensing suitability | Conditional CC BY shortlist; inspected default royalty-free/editorial sources rejected for public raw delivery |
| Recommended source/workflow | Original manually refined meshes on a separately validated Blender workstation |
| Estimated cost | USD 0 Blender licence; labour/access quote required; cloud compute-only example USD 11.20-15.20/20h plus other costs |
| Blender dependency | YES on alternative workstation; NO dependency on blocked local installation |
| Existing assets preserved | PASS |
| Database/runtime unchanged | PASS |
| Ready for acquisition approval | NO - no stock asset jointly licence/visual/technical cleared; bounded workflow validation can be approved separately |

STOP. No purchases, model downloads/replacements, installations, runtime edits,
new vehicle categories, commits, pushes or deployment. Wait for explicit approval.
