# Fleet Drive AI Demo v1.1 - Phase 3.3D Vehicle Batch 3

Owner: Phathutshedzo Rakhunwana
Date: 2026-10-08
Status: PASS - acquisition only; runtime integration NOT STARTED.

## Canonical Identity Gate

Five canonical identities matched before research. Checked fleet.json against
the acquisition manifest and matrix: ID, plate, year, make, model, body, city,
visual key, driver name, Priority A and currentOperations relationship.
All five remain simulator participants; no database identity was inferred from
appearance. Canonical current-operation count remains 21. DRV-015 remains B.

| Vehicle ID | Plate | Year/make/model | Type | Driver | City | Visual key |
| --- | --- | --- | --- | --- | --- | --- |
| VH-GQ-118 | EC 5453 FL | 2023 Chevrolet Spark | HATCHBACK | DRV-019 Dineo Naidoo | Gqeberha | 2023-chevrolet-spark |
| VH-LO-106 | LP 8173 RZ | 2021 Nissan X-Trail | SUV | DRV-007 Jenna Smith | Louis Trichardt | 2021-nissan-x-trail |
| VH-MA-107 | NW 1736 CO | 2022 Nissan NP200 | PICKUP | DRV-008 Zanele Daniels | Mahikeng | 2022-nissan-np200 |
| VH-RU-111 | NW 3062 ML | 2021 Ford Focus | HATCHBACK | DRV-012 Palesa Mthembu | Rustenburg | 2021-ford-focus |
| VH-DU-116 | KZN 1692 GV | 2021 Scania R-Series | TRUCK | DRV-017 Refilwe Mokoena | Durban | 2021-scania-r-series |

## Appearance Research and Decisions

- NP200: [Nissan South Africa brochure](https://www.nissan-cdn.net/content/dam/Nissan/za/brochures/NP200.pdf)
  and [manufacturer discontinued-model page](https://www.nissan.co.za/vehicles/discontinued-models/np200.html)
  establish a small open-bed light-commercial pickup family. Generated a
  two-door single-cab car-derived pickup, not Navara. Brochure equipment and
  engine choices do not establish exact 2022 fleet specification.
- X-Trail: [Nissan's June 2017 update](https://europe.nissannews.com/en-GB/releases/the-new-nissan-x-trail-world-s-best-selling-suv-gets-even-better-with-higher-quality-enhancements-uk)
  describes the third-generation family, revised V-motion grille and headlamps.
  T32 facelift-oriented SUV is the representative choice, not newer T33.
  Applying that family to the canonical 2021 Demo record is an inference;
  exact South African derivative, headlamps, seating and trim are unverified.
- Focus: [Ford's April 2018 introduction](https://media.ford.com/content/fordmedia/feu/en/news/2018/04/10/ford-unveils-all-new-focus--most-innovative--dynamic-and-excitin.html)
  documents the C2 family and hatchback, wagon and selected-market sedan bodies.
  Canonical HATCHBACK controls selection: fourth-generation five-door
  pre-late-2021-facelift-oriented family. European generation is representative,
  NOT proof of South African 2021 availability. No ST/RS/Active/trim claim.
- Spark: [Chevrolet-authored 2022 brochure, hosted by Dealer eProcess](https://cdn.dealereprocess.org/cdn/brochures/chevrolet/2022-spark.pdf)
  identifies a five-door hatchback. [Chevrolet's US discontinued-model page](https://www.chevrolet.com/discontinued-vehicles)
  confirms discontinuation but is not South African 2023 model-year evidence.
  Last-generation M400-oriented compact hatchback was requested. Detailed
  generated lamps/bodywork are approximate. Canonical year 2023 is retained
  unchanged; exact production year/model-year and local market fit are
  UNVERIFIED. No invented 2023 redesign or silent change to 2022.
- Scania: [manufacturer August 2016 cab-range release](https://www.scania.com/content/dam/scanianoe/global/eventcontent/2016/2016-08-23-next-generation-scania/pressreleases-pdf/english/New-truck-range---exterior.pdf)
  distinguishes the new R and S families. Generated an R-oriented cab-over
  heavy truck with full cab, bare rear chassis and wheels visible. Two-axle
  tractor, fifth-wheel, cab height and no trailer are VISUAL_PRESENTATION;
  canonical axle/chassis/cargo configuration is unknown. No R450/V8/Super claim.

Silver colour, wheels, bumpers and equipment are presentation only.
No appearance decision changes canonical data or makes an exact trim claim.

## Licensing Review and Rejected Sources

Bounded review rejected four external candidate groups. This is not an
exhaustive claim that licensed exact photographs do not exist.

| Candidate group | Reason not acquired |
| --- | --- |
| Nissan brochure/news photographs | [SA legal notice](https://www.nissan.co.za/Legal.html) reserves copyright; no explicit redistribution/modification grant established. |
| Ford press photographs | Press release is useful for body/generation research. Attempted media terms URL was inaccessible; no applicable commercial redistribution/modification grant established. |
| Chevrolet brochure/discontinued-page imagery | Public manufacturer brochure/page access is not an image licence; no item-level commercial redistribution/modification permission established. |
| Scania media photography | [Image-library page](https://www.scania.com/group/en/home/newsroom/image-and-videos.html) describes media/own-organisation use. No explicit third-party commercial app redistribution/modification permission established; attempted legal URL inaccessible. |

No external photo downloaded as an application asset or uploaded to generation.
Five independent text-only built-in generations supplied the final visuals.
One initial Scania master was declined for a clipped aerial and regenerated.
Rejected master: exec-e8a87cb9-804f-4acd-83ec-57d2d9e4c87b.png; not shipped.

Licence: PROJECT_ASSET. Creator: OPENAI_BUILT_IN_IMAGEGEN_OWNER_AUTHORIZED.
Source type: GENERATED. Actual exactness: GENERATED_REPRESENTATIVE.
[Provider output terms](https://openai.com/policies/row-terms-of-use/) assign
output rights as between provider/user to the extent permitted by law.
Demo use and modification are recorded on that basis, subject to applicable
law and third-party rights. No manufacturer photo licence, endorsement,
trademark/design clearance, exclusive copyright or exact vehicle fidelity
is claimed. AttributionRequired false; attribution null.
Source references point to the local generation-specification record.
No invented external artwork URL or private absolute path appears in metadata.

## Final Assets

Original PNG masters are preserved unchanged in the tool output directory.
Full selected prompts and master filenames:
V1_1_PHASE_3_3D_GENERATION_SPECIFICATIONS.json.
Master canvas: 1536x1024 RGBA. Final: 1200x800, 3:2 landscape WebP.
Existing bundled Pillow used; no package installed.
Lanczos resize; quality 88/method 6; no crop, no destructive background edits.
Alpha and contact shadow retained; EXIF/XMP/ICC not copied.

| File under public/assets/vehicles/images/ | Dimensions | Bytes | Status |
| --- | --- | --- | --- |
| 2022-nissan-np200.webp | 1200x800 | 110342 | AVAILABLE |
| 2021-nissan-x-trail.webp | 1200x800 | 132832 | AVAILABLE |
| 2021-ford-focus.webp | 1200x800 | 100984 | AVAILABLE |
| 2023-chevrolet-spark.webp | 1200x800 | 130990 | AVAILABLE |
| 2021-scania-r-series.webp | 1200x800 | 94530 | AVAILABLE |

Batch 3 payload: 569678 bytes.
AVAILABLE 5; AWAITING_GENERATION 0; LICENSE_REVIEW 0; BLOCKED 0.

## QA and Full Pack Reconciliation

- Manual master and final WebP dark-background composite review: PASS at
  representative fidelity. Appropriate pickup/SUV/hatchback/heavy-truck bodies,
  nose-left front three-quarter studio view, entire silhouettes and wheels
  visible, dark-UI readability, no people/watermarks/advertising/trim text or
  registration characters. Empty mounting surfaces are not fake registrations.
- Scania replacement includes all roof/aerial/chassis parts within the canvas.
- Automated validator: PASS 15/15. Canonical identity, current driver pairs,
  unique keys/asset IDs, 15 paths, 15 decodable WebPs, 15 provenance records,
  dimensions, alpha, SHA-256/bytes, permissions, generation specs, no orphan files.
- JSON validation: PASS for acquisition manifest, provenance and new specs.
- git diff --check: PASS. New-file whitespace validation: PASS.
- Priority A vehicle-image coverage: Batch 1 5 + Batch 2 5 + Batch 3 5 = 15/15.
- Priority A driver portraits: 15/15 manifest paths exist and unchanged.
  This is coverage verification, not newly performed portrait responsive QA.
- Remaining Priority A vehicle-image acquisition gaps: 0.
- Exact-trim/year-market fidelity remains a limitation, not an unreported PASS.
- Frontend responsive/rendering/integration checks NOT STARTED in this phase.
- No backend/frontend suites run: asset-only changes, no runtime edits.

## Preservation Proof

Before/after SHA-256 inventory digest: 311 pre-existing protected files
unchanged across src/, server/ excluding node_modules, legacy/, driver
portraits and all ten Batch 1/2 WebPs. This includes fleet.json and local
runtime SQLite files; no database opened for mutation or reseeded.
All original ten provenance records and non-Batch-3 acquisition entries
are deep-equal. Earlier batch reports/specs/assets not edited.
Only five Batch 3 acquisition entries and checklist vehicle-2D gates updated;
all 3D/pair-level integration gates remain unchecked.
Historical planning/coverage text is preserved, with current coverage added
separately. Top-level planning metadata is not authority for future phases.

No identities, assignments, current operations, telemetry, headings, simulator,
portraits, frontend/backend, legacy, maps or 3D assets changed. No server started.
Existing unrelated working-tree changes retained. No commit, push or deployment.

## Completion and Boundary

Phase 3.3D: PASS at GENERATED_REPRESENTATIVE fidelity.
Five assets, generation specification and this report created.
Acquisition manifest, provenance and acquisition checklist modified.
No validation utility or runtime code changed.
Issues: Focus/Spark precise year-market fit unverified; Scania chassis/cab
configuration illustrative. Initial Scania framing defect resolved.
Acquisition availability does not imply UI integration.

Recommended next phase: 3.3E - Priority A Vehicle 2D Asset QA & Freeze.
Safe to proceed: YES, after explicit approval.
STOP. No frontend integration, Priority B images, 3D, map work, commit,
push or deploy authorised by this closeout.
