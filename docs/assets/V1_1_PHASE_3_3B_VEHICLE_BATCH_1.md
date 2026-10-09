# Fleet Drive AI Demo v1.1 - Phase 3.3B Vehicle Batch 1

Date: 2026-10-07
Status: PASS - acquisition only; runtime integration NOT STARTED.

## Authority and Scope

Canonical identity verified 5/5 against `server/data/fleet.json` before research.
All five acquisition entries retain Priority A, simulator participation and the
canonical current driver relationship. No identity was inferred from a filename.

| Vehicle | Plate | Specification | Driver | Visual key |
| --- | --- | --- | --- | --- |
| VH-PR-103 | GP 9915 XB | 2023 Volkswagen Polo HATCHBACK | DRV-004 Lerato Nkosi | 2023-volkswagen-polo |
| VH-TH-112 | LP 8635 VL | 2022 Volkswagen Polo HATCHBACK | DRV-013 Charlene van der Merwe | 2022-volkswagen-polo |
| VH-CA-115 | WC 7236 TX | 2020 Volkswagen Passat SEDAN | DRV-016 Sipho Sithole | 2020-volkswagen-passat |
| VH-BL-113 | FS 4032 LK | 2023 Mercedes-Benz C-Class SEDAN | DRV-014 Lwazi van Wyk | 2023-mercedes-benz-c-class |
| VH-PO-110 | LP 2562 RR | 2020 Mercedes-Benz C-Class SEDAN | DRV-011 Fhulufhelo Makhale | 2020-mercedes-benz-c-class |

Fleet variant/trim, engine, transmission, market package and colour remain
unknown. Four generated masters cover five deterministic year/model paths.
Only Batch 1 acquisition entries changed. The acquisition manifest's top-level
3.3A planning/approval fields and model-family recommendations remain historical
planning metadata, NOT authorization for Batches 2/3. Per-entry Batch 1
`OWNER_AUTHORIZED_BATCH_1_ONLY` records the current owner request.
The general vehicle-asset audit manifest and runtime resolvers were not changed;
acquisition availability does not imply frontend integration.

## Generation Research and Reuse

### Volkswagen Polo: SHARE_APPROVED (representative family only)

Volkswagen describes the sixth generation introduced in 2017 and its 2021
redesign in [Polo generation history](https://www.volkswagen-newsroom.com/en/press-releases/50-years-of-the-volkswagen-polo-small-on-the-outside-big-on-the-inside-and-successful-worldwide-19232).
[VWSA's March 2023 production milestone](https://www.vw.co.za/en/volkswagen-experience/newsroom/vwsa-builds-100-000-polos-for-the-sa-market.html)
confirms both the current local Polo and facelift production during 2022.
[Volkswagen France's July 2022 production release](https://media.volkswagen.fr/la-500-000eme-polo-produite-par-volkswagen-group-south-africa-sera-exportee-a-destination-de-la-france/)
records the local facelift introduction early in 2022.

Inference: a sixth-generation facelift-oriented five-door hatchback visual is
reasonable across these two years at GENERATED_REPRESENTATIVE fidelity.
This is NOT proof that both fleet records have identical equipment or facelift
derivatives. The same generated master and identical WebP bytes are used under
both authoritative visual keys. No Polo Vivo, sedan, GTI or R-Line claim.

### Mercedes-Benz C-Class: SHARE_REJECTED

The manufacturer's [2019 sedan update](https://media.mbusa.com/news/2019-c-class-sedan-quick-reference-guide-qrg)
describes revised bumpers and head/tail lights for the predecessor.
Its [new-generation sedan announcement](https://media.mbusa.com/news/the-new-mercedes-benz-c-class-sedan)
describes the 2021 introduction of the newer body, cab-backward design and
two-piece tail lamps.
[Mercedes-Benz South Africa manufacturing](https://mercedes-benzgroup.co.za/)
confirms local production of the current generation began in 2021.

Generation selection is an inference from those production/model timelines:
2020 uses the W205-family facelift-era silhouette; 2023 uses W206-family.
Separate generated images are mandatory. USA equipment descriptions are visual
research only, not proof of South African trim. Generated bumpers/wheels/lights
are illustrative and are not certified base-trim or AMG-package identifiers.
Neither asset contains visible AMG/engine/trim lettering.

### Volkswagen Passat Result

The [manufacturer's June 2019 update information](https://www.volkswagen-newsroom.com/en/the-new-passat-the-update-5070/download)
covers saloon and estate variants of the updated European model family.
Its [2019 eighth-generation photo record](https://www.volkswagen-newsroom.com/en/images/detail/volkswagen-passat-29416)
provides the generation context. European B8 sedan was selected as the
representative family, not an American NMS, wagon or Alltrack.

Exact 2020 South African derivative/facelift availability was NOT established.
The image is AVAILABLE only as GENERATED_REPRESENTATIVE, not exact SA-market
photography. No database identity was changed to fit research.

## Licensing Research and Rejected Candidates

Six source candidates/source sets were declined; none was downloaded into the
repository or supplied to the image-generation tool.

| Candidate | Creator/owner | Rights and permissions | Decision |
| --- | --- | --- | --- |
| Volkswagen newsroom press imagery | Volkswagen AG | [Terms](https://www.volkswagen-newsroom.com/en/terms-of-service-35) restrict commercial use/distribution; commercial app modification permission not granted; credit alone is insufficient | REJECTED_SOURCE for app use |
| Mercedes-Benz press imagery | Mercedes-Benz AG / Group | [Portal terms](https://pressmaterial.mercedes-benz.com/legal-details) restrict commercial copying, redistribution, modification and reposting; attribution does not grant those rights | REJECTED_SOURCE for app use |
| [Shutterstock Polo catalog](https://www.shutterstock.com/search/polo-volkswagen) | Individual contributors; no selected creator verified | Reviewed listings include editorial material. No suitable item-level commercial licence purchased/verified; modification/attribution unresolved | No acquisition; LICENSE_NOT_ESTABLISHED |
| [Commons Polo 2021-2022 candidate](https://commons.wikimedia.org/wiki/File:Volkswagen_Polo_VI_(2021_-_2022)_(52053009153).jpg) | Not verified | Description page unavailable through research tool; creator, licence and permissions not verified | No acquisition; UNKNOWN_RIGHTS |
| [Commons 2020 Passat NMS II](https://commons.wikimedia.org/wiki/File:2020_Volkswagen_Passat_(NMS_II),_front_8.29.20.jpg) | Kevauto | CC BY-SA 4.0; commercial reuse/adaptation with credit, licence link, change notice and share-alike | Licensed but wrong market family: US NMS II, not selected European B8 |
| [Commons W206 IMG 5793](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W206_IMG_5793.jpg) | Alexander Migl | CC BY-SA 4.0; same credit/change/share-alike requirements | Genuine licensed alternative, but Stuttgart street/registered-car presentation rather than the controlled unlettered catalog composition; not copied |

CC licensing was not called unsafe or proprietary. Suitability is a separate
gate from rights. Research was bounded, not an exhaustive claim that no usable
licensed photograph exists anywhere. No dealer/social/search-preview imagery,
watermark removal, raw third-party originals or paid licence assumptions.

## Generated Asset Provenance

All five records are in `vehicle-image-provenance.json`, one per final visual
key. The records include asset ID, covered vehicle ID, runtime path, source,
creator, licence, permissions, exactness, date, source master identifier, final
dimensions, byte size and SHA-256.

- Tool: built-in image generation, four independent text-only calls.
- Source: GENERATED; creator OPENAI_BUILT_IN_IMAGEGEN_OWNER_AUTHORIZED.
- Licence category: PROJECT_ASSET, not a manufacturer licence.
- Demo commercial use/modification: permitted under output ownership terms,
  subject to applicable law and third-party rights.
- Attribution required: false under the generated-output basis.
- Exactness: GENERATED_REPRESENTATIVE, no manufacturer-photography claim.
- Colour: silver for VISUAL_PRESENTATION, authoritative colour UNKNOWN.
- [Provider terms](https://openai.com/policies/terms-of-use/) assign output rights
  as between the provider and user to the extent permitted by law. They do not
  grant manufacturer trademark/design rights or guarantee exclusive copyright.
  No affiliation/endorsement or broader legal clearance is claimed.

Full prompts are retained in
`V1_1_PHASE_3_3B_GENERATION_SPECIFICATIONS.json`.
Original generated PNG masters remain untouched in the tool's output location.
Master filenames, not private absolute local paths, are in repository metadata.

## Conversion and Available Files

Standard canvas: **1200 x 800, 3:2 landscape**.
Actual master resolution: 1536 x 1024 (not falsely reported as planned 1600 x 1067).
Existing bundled Pillow used; no package installed.
RGBA Lanczos resize and WebP quality 88/method 6; no crop, alpha preserved.
No EXIF/XMP/ICC/private metadata copied.

| Final file under public/assets/vehicles/images/ | Dimensions | Bytes | Status |
| --- | --- | --- | --- |
| 2023-volkswagen-polo.webp | 1200 x 800 | 113484 | AVAILABLE |
| 2022-volkswagen-polo.webp | 1200 x 800 | 113484 | AVAILABLE |
| 2020-volkswagen-passat.webp | 1200 x 800 | 97172 | AVAILABLE |
| 2023-mercedes-benz-c-class.webp | 1200 x 800 | 107032 | AVAILABLE |
| 2020-mercedes-benz-c-class.webp | 1200 x 800 | 116820 | AVAILABLE |

Total runtime payload: 547992 bytes; four unique visual payloads.
All images are generated representative imagery; none needs another generation
to meet this acquisition scope. AWAITING_GENERATION 0, LICENSE_REVIEW 0, BLOCKED 0.

## QA and Limitations

Manual review of all four masters and all five final WebPs composited over a
dark Fleet Drive-coloured canvas: PASS for broad body style/model representation,
whole vehicle/wheels in frame, front three-quarter view, readable silhouette,
no people/captions/dealer/pricing overlays/watermarks, no visible trim text or
registration characters. Manufacturer emblems are identifiers, not endorsement.
Unlettered mounting surfaces/recesses are visible, not fake registrations.
Generation requested transparent output; actual RGBA alpha is retained, including
semi-transparent studio lighting/contact shadow. No destructive background edit.

Detailed trim, wheel design, exact facelift headlights and market equipment
remain unverified presentation. Never use these images as exact vehicle
inspection evidence. Final UI object-fit/layout/responsive checks are deferred
to authorized integration; no UI test PASS is claimed here.

`scripts/validate-vehicle-images.py`: PASS 5/5.
Validates canonical identity/current operation/driver, unique provenance, covered
vehicle, exact paths, WebP decode, 1200x800 canvas, alpha, no unnecessary metadata,
hash/bytes, generation-spec presence and no orphan vehicle files.
Text/body-style checks are manual, not falsely automated.
JSON parsing: PASS for acquisition manifest, provenance and generation specs.
`git diff --check`: PASS; existing Git line-ending warnings are not failures.
Frontend/backend suites deliberately not run: no runtime code changed.

## Immutability Proof

SHA-256 comparison before/after: **301 protected files unchanged** across
`src/`, `server/` (excluding node_modules), `legacy/` and approved portraits.
Canonical fleet, driver identities, assignments, current operations, telemetry
and simulator untouched. Runtime SQLite file hash unchanged:

`ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4`

No database was opened for mutation or reseeded. No server started.
No portrait, map, runtime/frontend integration, vehicle 3D, commit, push or
deployment work. Existing unrelated working-tree changes preserved.

## Acceptance and Next Boundary

All Batch 1 acquisition gates PASS at explicitly representative fidelity.
Five AVAILABLE paths, complete provenance, consistent WebP canvas, rights
research recorded and unknown-rights candidates not acquired.
Acquisition checklist updates only the five vehicle-image gates; 3D and
whole-pair integration gates remain open.
Remaining Priority A vehicle-image acquisition: 10 records in Batches 2/3.

Safe to proceed: **YES, after explicit approval**.
Recommended next phase: **3.3C - Priority A Vehicle 2D Acquisition - Batch 2**.
STOP after Batch 1; no Batch 2 or frontend integration authorized by this closeout.

