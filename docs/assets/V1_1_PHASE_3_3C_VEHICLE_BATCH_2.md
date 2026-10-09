# Fleet Drive AI Demo v1.1 - Phase 3.3C Vehicle Batch 2

Owner: Phathutshedzo Rakhunwana
Date: 2026-10-08
Status: PASS - asset acquisition only; UI integration NOT STARTED.

## Canonical Identity Gate

Before research: five of five matched server/data/fleet.json and the acquisition
manifest, including current operating driver, Priority A and simulator membership.
No obsolete generated fleet specifications were used.

| Vehicle ID | Plate | Year/make/model | Body style | Driver | Visual key |
| --- | --- | --- | --- | --- | --- |
| VH-CA-101 | WC 1729 AV | 2021 Hyundai H1 | MINIBUS | DRV-002 Siyabonga Naidoo | 2021-hyundai-h1 |
| VH-JO-100 | GP 2461 YO | 2020 Hyundai H1 | MINIBUS | DRV-001 Ayanda Dlamini | 2020-hyundai-h1 |
| VH-KI-105 | NC 4067 BP | 2020 Hyundai Elantra | SEDAN | DRV-006 Riyaad Ahmed | 2020-hyundai-elantra |
| VH-DU-102 | KZN 2386 SQ | 2022 Toyota Hilux | PICKUP | DRV-003 Thandi Mokoena | 2022-toyota-hilux |
| VH-PH-123 | LP 1029 FY | 2023 Toyota Fortuner | SUV | DRV-024 Jared Jacobs | 2023-toyota-fortuner |

## Generation and South African Market Research

- H1: [Hyundai's 2018 facelift brochure](https://www.hyundai.com/content/dam/hyundai/template_en/en/data/marketing/brochure/product/h-1-facelift/h-1-ebrochure-2018.pdf)
  documents passenger-wagon and cargo variants with different equipment.
  [Hyundai South Africa's November 2021 Staria launch](https://www.hyundai.co.za/news/hyundai-staria-new)
  identifies the later replacement and refers to the previous H1 Multicab.
  Decision: **SHARE_APPROVED for GENERATED_REPRESENTATIVE family fidelity**.
  One facelift-era H1 passenger-window minibus master serves both year keys.
  This is an inference of reasonable family reuse, not verified identical trim,
  exact year equipment, seats or transmission. Neither record becomes Staria.
  The old indexed SA H1 specification PDF returned 404; it was not relied upon
  as a successfully retrieved specification.
- Elantra: [Hyundai's 2019 Australian brochure](https://www.hyundai.com/content/dam/hyundai/au/en/documents/Hyundai_Elantra_Brochure_2019.pdf)
  provides sixth-generation facelift-era visual context.
  [Hyundai's March 2020 announcement](https://www.hyundai.com/worldwide/en/newsroom/detail/all-new-2021-hyundai-elantra-and-elantra-hybrid-make-world-premiere-in-hollywood-0000000713)
  identifies the newer car as the all-new 2021 model. The generated image uses
  the preceding AD-family sedan, not CN7 or Elantra GT hatchback. Exact SA
  facelift/derivative availability for this database record is unverified;
  AD-family selection is representative, not an exact-market claim.
- Hilux: [Toyota's 2020 facelift release](https://newsroom.toyota.eu/new-hilux---a-more-powerful-engine-for-a-striking-design/)
  documents the revised front. [Toyota's November 2020 release](https://media.toyota.co.uk/new-toyota-hilux-strikes-the-perfect-work-life-balance/)
  lists single, extra and double cab choices. The generated 2022 pickup follows
  that facelift-era family, not Tacoma or the later 2026 Hilux. Double cab is
  a VISUAL_PRESENTATION choice because canonical cab configuration is unknown.
  UK equipment names do not become South African trim, drivetrain or engine.
- Fortuner: [Toyota South Africa's 2023 release published by Vaal Toyota](https://www.vaaltoyota.co.za/result/articles/STYLISH-ENHANCEMENTS-FOR-REIMAGINED-FORTUNER-10653)
  records the local catamaran-inspired styling update. The generated closed-body
  SUV follows that family, not Hilux/Prado/GR Sport. No exact VX/engine/package
  assertion. Current 2026 model-page equipment is not evidence of 2023 fitment.

Silver, wheels, lighting and bumpers are presentation, not verified fleet
equipment. Trim/variant, colour, drivetrain and engine remain UNKNOWN.

## Licensing Decisions

Four candidate/source groups were declined; none was copied into the repository
or uploaded as a generation input. This was bounded research, not an exhaustive
claim that suitable licensed photographs cannot exist.

| Candidate group | Rights review | Result |
| --- | --- | --- |
| Hyundai manufacturer brochure/news imagery | Brochure copyright reserved; [Hyundai EU media terms](https://www.hyundai.news/eu/terms-of-use.html) allow editorial use but prohibit commercial/promotional use. No separate SA redistribution/modification grant established | REJECTED_SOURCE for this app |
| Toyota press/local imagery | UK release explicitly limits image use to editorial purposes; SA Fortuner release supplies no verified app redistribution/modification permission. Creator/rights holder Toyota or credited supplier, not assumed transferable | REJECTED_SOURCE / licence not established |
| [Shutterstock Hilux catalog](https://www.shutterstock.com/search/toyota-hilux-2022) | Reviewed results include editorial material. No item-level creator, purchased commercial redistribution licence or modification rights established; no attribution assumption | No acquisition |
| [Commons Hyundai H1 2019 candidate](https://commons.wikimedia.org/wiki/File:Hyundai_H1_2019_(49848190786).jpg) | File page could not be retrieved. Creator, item licence and modification/attribution terms unverified; category visibility is not permission | No acquisition; UNKNOWN_RIGHTS |

No questionable stock preview, dealership listing photograph or unknown mirror
was used. No watermark removal. Research text references are not acquired assets.

## Creation and Provenance

Four independent text-only built-in image-generation calls produced four PNG
masters; H1 master reused under two deterministic keys. Full prompts and master
filenames are recorded in V1_1_PHASE_3_3C_GENERATION_SPECIFICATIONS.json.
Original tool masters preserved outside runtime public assets.

Five new records appended to vehicle-image-provenance.json; previous five records
unchanged. Each includes visualKey, vehicleIds, file/assetPath, source type and
reference, creator, licence, commercial/modification/attribution fields, exactness,
creation date, notes, master filename, SHA-256, bytes and dimensions.

SourceType: GENERATED. Exactness: GENERATED_REPRESENTATIVE.
Creator: OPENAI_BUILT_IN_IMAGEGEN_OWNER_AUTHORIZED. Licence: PROJECT_ASSET.
Demo output use/modification is recorded under the [provider output-ownership terms](https://openai.com/policies/terms-of-use/),
subject to applicable law and third-party rights. No manufacturer photo licence,
manufacturer endorsement, trademark/design clearance, unique output or guaranteed
copyright ownership is claimed. No external source URL invented for the generated
artwork. SourceReference points to the local generation-spec record.
AttributionRequired: false under the generated-output basis.

## Final Assets

Existing bundled Pillow used; no dependency installation.
Actual masters: 1536x1024 RGBA. Final standard: **1200x800, 3:2 WebP**.
RGBA Lanczos resize; WebP quality 88/method 6. No crop or destructive edit.
Alpha, studio lighting and contact shadow preserved; EXIF/XMP/ICC not copied.

| File under public/assets/vehicles/images/ | Bytes | Dimensions | Status |
| --- | --- | --- | --- |
| 2021-hyundai-h1.webp | 123806 | 1200x800 | AVAILABLE |
| 2020-hyundai-h1.webp | 123806 | 1200x800 | AVAILABLE |
| 2020-hyundai-elantra.webp | 110558 | 1200x800 | AVAILABLE |
| 2022-toyota-hilux.webp | 113392 | 1200x800 | AVAILABLE |
| 2023-toyota-fortuner.webp | 121098 | 1200x800 | AVAILABLE |

Batch 2 payload: 592660 bytes. Four unique visual payloads.
AVAILABLE 5; AWAITING_GENERATION 0; LICENSE_REVIEW 0; BLOCKED 0.

## QA

- Five canonical identities/current driver pairs: PASS.
- Body styles: two passenger minibuses, sedan, open-bed pickup, closed-body SUV.
- H1 family reuse: PASS, byte-identical WebPs under two authoritative keys.
- All final files decode as WebP, 1200x800; alpha retained: PASS.
- Manual master and final dark-background composite review: whole vehicles and
  wheels visible, consistent nose-left front three-quarter framing, readable
  silhouettes, no people/watermarks/captions/marketing/dealer overlays: PASS.
- No registration characters or invented trim lettering: PASS. Empty unlettered
  mounting surfaces may be visible; they are not fabricated registrations.
- Exactness remains representative; detailed equipment fidelity is NOT certified.
- Provenance, hashes, byte sizes, deterministic paths, no orphan images: PASS.
- JSON validation: PASS.
- git diff --check and new-file whitespace check: PASS.
- No frontend rendering/responsive/UI integration claim in this phase.

scripts/validate-vehicle-images.py now resolves generation specs from each
provenance sourceReference rather than assuming every asset belongs to Batch 1.
All original validation gates retained, with an added safe-filename/key check.
Combined validation: **10/10 PASS**, including five unchanged Batch 1 images.
Only this non-runtime validation utility changed; frontend/backend untouched.
No expensive frontend/backend suites were run because no runtime code changed.

## Preservation and Scope Proof

306 pre-existing protected files SHA-256 unchanged across src/, server/ excluding
node_modules, legacy/, driver portraits and all Batch 1 vehicle WebPs.
Runtime SQLite SHA-256 before/after:

ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4

Batch 1 provenance records and all non-Batch-2 acquisition entries are deep-equal
before/after. Batch 1 report and generation specs not edited. Batch 1 checklist
rows remain unchanged; Batch 2 completion rows added separately.
Top-level Phase 3.3A planning metadata remains historical; per-entry
OWNER_AUTHORIZED_BATCH_2_ONLY records this phase's limited authorization.
Batch 3 entries remain PLANNED. General audit manifest/runtime resolver untouched.

Fleet.json, database, drivers, assignments, current operations, telemetry,
simulator, portraits, frontend/backend, map and legacy remain unchanged.
Existing unrelated working-tree changes preserved. No runtime servers started.

## Completion Boundary

Status PASS at honestly representative fidelity.
Acquisition availability is NOT runtime integration; all 3D and integration
gates remain incomplete. Priority A vehicle-image acquisition is now 10/15.
Remaining five records belong to Batch 3 and were not processed.

Recommended next phase: **3.3D - Priority A Vehicle 2D Acquisition, Batch 3**.
Proceed only after explicit approval. No Batch 3, 3D, commit, push or deployment.

