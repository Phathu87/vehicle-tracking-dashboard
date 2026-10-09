# Phase 3.2E Priority A Portrait Closeout

Project: Fleet Drive AI Demo v1.1
Date: 2026-10-07
Phase: 3.2E - Priority A Portrait Gap Integration & Final QA
Status: PASS

## Source Inventory and Individual QA

Exactly four explicit owner attachments were processed. Mapping is by driver ID,
cross-checked against the SQLite drivers/current-operation data, driver manifests
and Phase 3.2D gap records. No identity was inferred from appearance.

| ID | Authoritative name | Source master | Dimensions / format | Text / watermark | Avatar suitable | Final bytes | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-016 | Sipho Sithole | DRV-016_Sipho_Sithole.png | 1254x1254 PNG / RGB | NO / NO | YES | 34,338 | PASS |
| DRV-017 | Refilwe Mokoena | DRV-017_Refilwe_Mokoena.png | 1254x1254 PNG / RGB | NO / NO | YES | 35,564 | PASS |
| DRV-019 | Dineo Naidoo | DRV-019_Dineo_Naidoo.png | 1254x1254 PNG / RGB | NO / NO | YES | 38,432 | PASS |
| DRV-024 | Jared Jacobs | DRV-024_Jared_Jacobs.png | 1254x1254 PNG / RGB | NO / NO | YES | 38,874 | PASS |

Every source decoded correctly, is 1:1, has no alpha channel, branding, driver
name, ID label or caption. All four are Priority A, simulator participants and
have a current operation. Full square head-and-shoulders composition was
preserved: crop box [0, 0, 1254, 1254]. No text removal, face editing, inpainting,
generative fill, new generation or web sourcing occurred.

| Driver | Current vehicle | Specification | Registration | City |
| --- | --- | --- | --- | --- |
| DRV-016 | VH-CA-115 | 2020 Volkswagen Passat | WC 7236 TX | Cape Town |
| DRV-017 | VH-DU-116 | 2021 Scania R-Series | KZN 1692 GV | Durban |
| DRV-019 | VH-GQ-118 | 2023 Chevrolet Spark | EC 5453 FL | Gqeberha |
| DRV-024 | VH-PH-123 | 2023 Toyota Fortuner | LP 1029 FY | Phalaborwa |

## Conversion and Output

Pillow: RGB, Lanczos resize to 512x512, WebP quality 88, method 6.
Only the four requested IDs were converted. Converter now requires explicit
IDs/date and refuses to overwrite an existing portrait or provenance record.
No unnecessary embedded EXIF/XMP or private metadata is shipped. All 19 WebPs
fully decoded using Pillow; dimensions and format passed. New files are
34,338-38,874 bytes: no unusually large outputs.

Runtime files:
- public/assets/drivers/DRV-016.webp
- public/assets/drivers/DRV-017.webp
- public/assets/drivers/DRV-019.webp
- public/assets/drivers/DRV-024.webp

Runtime URLs use /assets/drivers/<driverId>.webp. Original PNGs remain outside
the runtime directory, unchanged. Each stored source hash still matches its
master after conversion.

## Provenance and Manifests

driver-portrait-provenance.json contains 19 unique records. Four records appended:
DRIVER_PORTRAIT; GENERATED; OWNER_SUPPLIED_GENERATED_ASSET; PROJECT_ASSET;
commercialUseAllowed true (owner-supplied Demo assets); modificationAllowed true;
attributionRequired false; FICTIONAL_DRIVER_REPRESENTATION; integratedAt
2026-10-07. Source references have no external URL or absolute local path.
Original 15 provenance records are semantically unchanged.

Only the four new photo records changed in driver-asset-manifest.json; the
other 21 driver records are unchanged. Markdown manifest/readiness summaries
were regenerated through the existing read-only audit utility. Gap manifest
has zero unresolved gaps and four resolvedGaps records preserving Phase 3.2D
specifications as history, not instructions for new generation. Acquisition
checklist marks every Priority A portrait complete; vehicle and 3D gates remain
open.

| Coverage | Available | Total | Missing |
| --- | --- | --- | --- |
| Priority A | 15 | 15 | 0 |
| Priority B | 2 | 6 | 4 |
| Priority C | 2 | 4 | 2 |
| Overall | 19 | 25 | 6 |

The requested illustrative B/C denominators (5/5) differ from authoritative
reconciled data: DRV-015 is Priority B, not C. No priorities were changed to
force expected counts. DRV-015 remains Tshifhiwa Netshanda, not a simulator
participant, with the existing frozen portrait.

## Live Simulator Coverage and Resolver

The existing selectSimulationVehicles selector was run against read-only
runtime data for NORMAL_FLEET, limit 15. Vehicle currentDriver is populated
strictly from driver_current_vehicles and drivers; no assigned-driver fallback.
Its 15 driver IDs exactly match the Priority A manifest. Every participant has
a currentDriver, matching authoritative name/current vehicle, AVAILABLE
portrait, existing WebP file and valid shared frontend resolver URL: **15/15**.

src/lib/driverPortraits.js extends the existing registry by four IDs; no second
resolver or duplicated imports. Existing DriverAvatar remains unchanged:
portrait if available, initials if unavailable or image request fails.
Decorative images use empty alt/aria-hidden; adjacent name and ID retain identity.

Driver list and detail pages render all four correctly. Dashboard Top Drivers
uses the same resolver: available portraits render correctly, including Dineo
Naidoo; unsupplied drivers retain initials. Leaderboard membership was not
changed to force the new four in.
The vehicles/DriverCard component uses DriverAvatar but is not imported by any
active page. VehicleDetail currently renders text-only Assigned Driver.
Vehicle-card mounted portrait QA is NOT APPLICABLE; no new UI was added.

## Responsive and Regression QA

Browser QA used real Express registration/session restoration and GET APIs
against an isolated in-memory test database, simulation disabled. No production
database, credentials or fabricated API responses were used.
Local temporary ports: API 3211, frontend 5181. Both stopped after verification.

32 browser scenarios PASS, zero browser runtime errors:
- Driver list and each of four detail routes at 375, 430, 768, 1024, 1440:
  25 checks; 19 list portraits; all four new mappings present.
- Dashboard shared avatars at all five widths: 5 checks.
- Unsupplied DRV-018: initials UN, no image.
- Aborted DRV-016 image request: initials SS, no broken-image element.

Checks include square rendered dimensions, object-fit cover, 512px decoded
images, no document overflow or horizontally clipped driver cards, empty alt.
Screenshots inspected for portrait framing and surrounding text/layout.
Evidence: portrait-qa-3-2e/results.json and 30 viewport screenshots.
Screenshots are deliberate QA evidence, not application build output.
External fonts blocked during QA; map tiles are outside portrait acceptance.

| Verification | Result |
| --- | --- |
| Frontend lint | PASS |
| Frontend tests | PASS: 5/5 (3 portrait, 2 dashboard) |
| Frontend production build | PASS: Vite 6.4.3 |
| Asset validator | PASS: 19 unique 512x512 WebPs; live coverage 15/15 |
| Audit generation consistency (--check) | PASS |
| Full WebP decode | PASS: 19/19 |
| Responsive browser scenarios | PASS: 32/32 |
| Initials / failed-image fallback | PASS |
| git diff --check | PASS; existing CRLF conversion warnings only |
| Runtime database unchanged | PASS: SHA256 identical before/after |
| Backend tests | NOT REQUIRED: backend and runtime data not modified |

## Immutability Evidence

Runtime database SHA256, before and after:
ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4

This byte-for-byte check covers identities, contacts, licences, assignments,
current operations, telemetry and heading. Backend source, simulator selection,
legacy and map technology were not edited in this phase.
Pre-existing Stage 2/3 working-tree changes remain untouched; this phase is
not a blanket assertion that the entire repository matches HEAD.

Frozen original portrait SHA256 values, unchanged:
| File | SHA256 |
| --- | --- |
| DRV-001.webp | d11d986692637ec27e080e2563c883e665e9215036f9b23a2b225b614c946519 |
| DRV-002.webp | 055398b4c9063bc8cd872017ad1263486d63bbdb3a8a763e6ed3c0c83abdd5e4 |
| DRV-003.webp | 8d96070e2648d96ce0df69ea55401804702055c4b3d16ceaa9b9e0fcef872826 |
| DRV-004.webp | 7360103c230c2586647efeaf488444e4b41cb420bd547320eb1f85118e2b293f |
| DRV-005.webp | 0a1ba3b1fa2999b53a736d8330046f36ae62f4d7b95d810d767960bde6378647 |
| DRV-006.webp | a6fe2a2354016e53d38489aed756f173bfb4771585ffe63a929fd5c8a29c9dda |
| DRV-007.webp | 31a2a580b5c26fe761f5978afeb3822e35c02dd84558bfea7ee0dd340fab455b |
| DRV-008.webp | 8f396d05955e8a3d91bd6818328701787e7ecb300995e21c0c9b3c4088608651 |
| DRV-009.webp | df049754c3c9022d904ce2450ca728a57b4cd671cc3456ff2aa99338f81a1b53 |
| DRV-010.webp | e14ef3f53eed9486548df77c1191d60811ceee56f0ab47e84c19ae9286ff9a68 |
| DRV-011.webp | 60343a4133323280e239cc95b38f13719035e691c7602a2c1b52fe9e94a1ede8 |
| DRV-012.webp | 2e86fce8024ede04ab3dbb3311dc5e13977974b34ebd5ce60a779c837b18f137 |
| DRV-013.webp | e148aabb1299b1c6d22c5df4576c98c8fae03d51e011515ce579df6ec3421f14 |
| DRV-014.webp | cdc69e9cd4d7d7e5d31ec53b5f77bd03043a499fb871fa442a81476dfcfe0ec0 |
| DRV-015.webp | b800a9decc3e482ab4fe3f3d3f4067253d04ff21a7a82715d22e49f3ed6a014b |

Preserved new PNG master SHA256 values:
| Source | SHA256 |
| --- | --- |
| DRV-016_Sipho_Sithole.png | 2df71dac5ac6e546bc33b637c84066cb6778c8c724a8d5ecef374c9c4236c3a7 |
| DRV-017_Refilwe_Mokoena.png | 311c3f5db801b73e57abaa1a86e25d0e602436e3c9765d4027de5298dd9dc1b2 |
| DRV-019_Dineo_Naidoo.png | dcf63424116188750b2311d04e01f3f0b480840eb48b310e412cb3029ea3c493 |
| DRV-024_Jared_Jacobs.png | 4f3d83d6dcd3bac22b0b96d60fe7c0a5d8e4d9092d51449e7c7fb69af9e6a0a9 |

## Remaining Portraits

| Driver | Name | Priority | State |
| --- | --- | --- | --- |
| DRV-018 | Unarine Netswera | B | MISSING; initials |
| DRV-021 | Gugu Mabena | B | MISSING; initials |
| DRV-022 | Hlumelo Radebe | B | MISSING; initials |
| DRV-023 | Imani Mthembu | B | MISSING; initials |
| DRV-020 | Mia Botha | C | MISSING; initials |
| DRV-025 | Karabo Petersen | C | MISSING; initials |

No regeneration is required for any of the four supplied portraits. No
provenance is fabricated for these six missing assets.

## Files Created and Modified

Created in this phase:
- Four new WebPs listed above.
- docs/assets/V1_1_PHASE_3_2E_PRIORITY_A_PORTRAIT_CLOSEOUT.md.
- docs/assets/portrait-qa-3-2e/results.json and 30 screenshot PNGs.

Modified in this phase:
- src/lib/driverPortraits.js.
- src/test/driverPortraits.test.js.
- scripts/convert-driver-portraits.py.
- scripts/validate-driver-portraits.mjs.
- scripts/qa-driver-portraits.cjs.
- docs/assets/driver-portrait-provenance.json.
- docs/assets/driver-asset-manifest.json.
- docs/assets/DRIVER_VISUAL_ASSET_MANIFEST.md.
- docs/assets/V1_1_PRIORITY_A_PORTRAIT_GAP_MANIFEST.json.
- docs/assets/V1_1_PRIORITY_A_PORTRAIT_GAP_CHECKLIST.md.
- docs/assets/V1_1_PRIORITY_A_ACQUISITION_CHECKLIST.md.
- docs/assets/V1_1_PRIORITY_ASSET_PACK.md.
- docs/assets/V1_1_PHASE_2_7_ASSET_READINESS.md.

## Acceptance and Next Phase

All portrait acceptance gates PASS. No database, assignments, current
operations, identities, simulator participants or existing portrait changes.
No vehicle assets, 3D models or map libraries acquired. No commit/push/deploy.

Ready for separately approved Phase 3.3A - Priority A Vehicle 2D Acquisition
Manifest & Exact Vehicle Verification: YES. Stop here; further work requires
explicit approval.
