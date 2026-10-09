# Phase 3.2C - Driver Portrait Conversion, Integration & Provenance

Date: 2026-10-05
Status: PASS. All Phase 3.2C acceptance checks completed.

## Source Inventory and Mapping

The 15 explicitly attached owner PNGs are the master sources. The attachment
paths were used directly; no portrait-source directory was searched. All files
decoded successfully, have no alpha channel, and have sufficient resolution.
No original was modified; SHA-256 hashes were checked before/after conversion.

Mapping uses the explicit DRV identifier, never file order or names. Each ID
resolves once in the read-only database and asset manifest. The generation
manifest covers 11 supplied Priority A IDs; DRV-015 is its post-freeze amendment;
DRV-005/009/010 resolve through the full driver manifest.

| Source file | Driver ID | Authoritative name | Manifest priority | Dimensions | Format | Alpha | Valid | Integration |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-001_Ayanda_Dlamini.png | DRV-001 | Ayanda Dlamini | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-002_Siyabonga_Naidoo.png | DRV-002 | Siyabonga Naidoo | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-003_Thandi_Mokoena.png | DRV-003 | Thandi Mokoena | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-004_Lerato_Nkosi.png | DRV-004 | Lerato Nkosi | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-005_Lerato_Khumalo.png | DRV-005 | Amahle Khumalo | C | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-006_Riyaad_Ahmed.png | DRV-006 | Riyaad Ahmed | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-007_Carmen_Botha.png | DRV-007 | Jenna Smith | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-008_Sipho_Ndlovu.png | DRV-008 | Zanele Daniels | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-009_Naledi_Peters.png | DRV-009 | Kavish Patel | B | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-010_Johan_van-der_Merwe.png | DRV-010 | Nandi Ndlovu | C | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-011_Musa_Nkomo.png | DRV-011 | Fhulufhelo Makhale | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-012_Leah_Jacobs.png | DRV-012 | Palesa Mthembu | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-013_Fhulufhelo_Makhale.png | DRV-013 | Charlene van der Merwe | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-014_Zanele_Sithole.png | DRV-014 | Lwazi van Wyk | A | 1254x1254 | PNG | NO | YES | AVAILABLE |
| DRV-015_Tshifhiwa_Netshandama.png | DRV-015 | Tshifhiwa Netshanda | B | 1254x1254 | PNG | NO | YES | AVAILABLE |

The supplied names differ from database names for DRV-005, DRV-007, DRV-008,
DRV-009, DRV-010, DRV-011, DRV-012, DRV-013 and DRV-014. Per the owner's stated
precedence, database identity wins and the supplied ID maps the portrait.
For example, DRV-013_Fhulufhelo_Makhale.png maps to DRV-013 / Charlene van der
Merwe, not to DRV-011 / Fhulufhelo Makhale. Source names and labels remain
documented as source evidence, not application identities. No driver was renamed.
DRV-015_Tshifhiwa_Netshandama.png maps to Tshifhiwa Netshanda by the approved
3.2B amendment.

## Conversion and Visual QA

All 15 supplied portraits were integrated: 11 Priority A, 2 Priority B, 2 Priority C.
All final paths are public/assets/drivers/<driverId>.webp; runtime URLs are
/assets/drivers/<driverId>.webp.

Pillow performed crop/resize/encoding only, with Lanczos resampling, WebP
quality 88, method 6. Sources with labels: DRV-001, DRV-002, DRV-005, DRV-009
and DRV-012. Reviewed crop rectangles are recorded in provenance and the
conversion utility. Bottom labels were excluded by trimming lower margins;
top-side labels were excluded with offset square crops preserving heads and
faces. These two portraits have tighter framing. Other sources preserve their
full square composition. No inpainting, generative fill or facial alteration
was used. The contact sheet contains QA captions outside the image cells;
the runtime portraits contain no captions, labels or watermark.

Source dimensions for every row: 1254x1254. Crop successful means either the
original square composition was preserved or a reviewed label-excluding crop
was applied. No portrait requires regeneration.

| Driver ID | Driver name | Source PNG | Source text | Crop successful | WebP created | Final dimensions | Bytes | Text-free | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-001 | Ayanda Dlamini | DRV-001_Ayanda_Dlamini.png | YES | YES | YES | 512x512 | 25578 | YES | A |
| DRV-002 | Siyabonga Naidoo | DRV-002_Siyabonga_Naidoo.png | YES | YES | YES | 512x512 | 29772 | YES | A |
| DRV-003 | Thandi Mokoena | DRV-003_Thandi_Mokoena.png | NO | YES | YES | 512x512 | 40322 | YES | A |
| DRV-004 | Lerato Nkosi | DRV-004_Lerato_Nkosi.png | NO | YES | YES | 512x512 | 34894 | YES | A |
| DRV-005 | Amahle Khumalo | DRV-005_Lerato_Khumalo.png | YES | YES | YES | 512x512 | 30802 | YES | C |
| DRV-006 | Riyaad Ahmed | DRV-006_Riyaad_Ahmed.png | NO | YES | YES | 512x512 | 33726 | YES | A |
| DRV-007 | Jenna Smith | DRV-007_Carmen_Botha.png | NO | YES | YES | 512x512 | 34038 | YES | A |
| DRV-008 | Zanele Daniels | DRV-008_Sipho_Ndlovu.png | NO | YES | YES | 512x512 | 36370 | YES | A |
| DRV-009 | Kavish Patel | DRV-009_Naledi_Peters.png | YES | YES | YES | 512x512 | 31018 | YES | B |
| DRV-010 | Nandi Ndlovu | DRV-010_Johan_van-der_Merwe.png | NO | YES | YES | 512x512 | 33488 | YES | C |
| DRV-011 | Fhulufhelo Makhale | DRV-011_Musa_Nkomo.png | NO | YES | YES | 512x512 | 30878 | YES | A |
| DRV-012 | Palesa Mthembu | DRV-012_Leah_Jacobs.png | YES | YES | YES | 512x512 | 31026 | YES | A |
| DRV-013 | Charlene van der Merwe | DRV-013_Fhulufhelo_Makhale.png | NO | YES | YES | 512x512 | 37196 | YES | A |
| DRV-014 | Lwazi van Wyk | DRV-014_Zanele_Sithole.png | NO | YES | YES | 512x512 | 36748 | YES | A |
| DRV-015 | Tshifhiwa Netshanda | DRV-015_Tshifhiwa_Netshandama.png | NO | YES | YES | 512x512 | 28964 | YES | B |

Final total: 494820 bytes.
Sizes range from 25578 to 40322 bytes; no unusually large file.
No EXIF/XMP/private paths are embedded in runtime assets.

## Provenance and Manifest

driver-portrait-provenance.json contains one record per integrated portrait:
DRIVER_PORTRAIT, GENERATED, OWNER_SUPPLIED_GENERATED_ASSET, PROJECT_ASSET,
commercial use allowed for this Demo based on owner-supplied generated status,
modification allowed, no attribution required, FICTIONAL_DRIVER_REPRESENTATION.
sourceReference is the original filename only; no invented URL or absolute
local path is published. integratedAt is 2026-10-05.

The JSON/Markdown driver manifests accurately mark the 15 acquired assets
AVAILABLE and the other 10 MISSING. Original priority/current-operation/
simulator classifications are preserved. The audit generator reads provenance
as a static overlay so regeneration cannot reset integrated files to MISSING.
The acquisition checklist records portrait-only completion; vehicle and 3D
acquisition remains open.

## Frontend Integration

src/lib/driverPortraits.js owns the explicit acquired ID registry and safe
initials helper. src/components/drivers/DriverAvatar.jsx uses the existing
Radix Avatar primitives. Portraits are object-cover inside fixed square,
nonshrinking avatar dimensions. Radix shows initials during loading or failure
and does not render a broken-image icon. Decorative images have empty alt
and the avatar is hidden from assistive technology; the adjacent existing
driver name remains accessible.

Existing driver list, driver detail, vehicle driver card and dashboard
leaderboard use the same component. The dashboard carries an ID from the
existing API snapshot/current driver or the existing fetched driver dataset.
No source filename/name registry controls identity.

Screenshot review found an existing minimum-content sizing issue clipping driver
cards on narrow screens. A single min-w-0 constraint on DriverCard preserves
the existing design while allowing the grid item to fit. Browser validation
checks card bounds as well as document overflow.

## Verification

- Frontend lint: PASS.
- Frontend unit tests: PASS, 4/4.
- Frontend production build: PASS after approved sandbox escalation for esbuild.
- Asset validation: PASS, 15 unique assets, database identities, registry,
  provenance, WebP signatures/dimensions and metadata.
- Responsive/browser verification: PASS, 13 scenarios. Driver list and DRV-015
  detail at 375, 430, 768, 1024 and 1440px; fixed square avatars/object-cover;
  no document overflow or clipped driver cards; unsupplied DRV-016 initials;
  deliberately failed DRV-015 image request displays TN and the existing
  accessible name; dashboard shares the same resolver. No browser runtime errors.
  Screenshot inspection confirmed intact portraits and no text collisions.
- git diff --check: PASS (existing Git line-ending notices only).

The browser harness uses the real Express API with an isolated in-memory
database, simulator disabled, and an ephemeral authenticated user. Existing
runtime SQLite is opened read-only for manifest/asset verification.
Remote font requests are blocked for browser QA; screenshots use local fallbacks.
Identity, assignment and current-operation hashes and telemetry count (28,487)
match the pre-integration manifest exactly. Backend tests were not required;
no backend code or existing data was modified in this phase.

## Remaining Portraits and Stage 3.3 Readiness

10 portraits remain MISSING: DRV-016, DRV-017, DRV-018, DRV-019, DRV-020,
DRV-021, DRV-022, DRV-023, DRV-024, DRV-025.
Remaining distribution: A=4, B=4, C=2.

Stage 3.3 vehicle 2D acquisition is ready for explicit owner approval.
There are no vehicle images
or 3D assets in this phase. No backend source, driver/vehicle identity,
assignment, current operation, telemetry, heading or simulator selection was
changed. No commit, push or deployment was performed.

## Files

Created: 15 WebP assets; driver-portrait-provenance.json; this report;
portrait-contact-sheet.png; portrait-qa screenshots/results;
scripts/convert-driver-portraits.py; scripts/validate-driver-portraits.mjs;
scripts/qa-driver-portraits.cjs; src/lib/driverPortraits.js;
src/components/drivers/DriverAvatar.jsx; src/test/driverPortraits.test.js.

Modified: src/components/drivers/DriverCard.jsx;
src/components/vehicles/DriverCard.jsx; src/components/dashboard/DriverLeaderboard.jsx;
src/pages/DriverDetail.jsx; src/lib/dashboardModel.js;
scripts/audit-fleet-assets.mjs; driver JSON/Markdown manifests;
V1_1_PRIORITY_A_ACQUISITION_CHECKLIST.md; generated priority pack/readiness docs.
