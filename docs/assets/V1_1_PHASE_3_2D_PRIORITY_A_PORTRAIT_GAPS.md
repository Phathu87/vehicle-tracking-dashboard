# Phase 3.2D - Priority A Portrait Gap Closure

Date: 2026-10-05
Status: PASS (reconciliation and specification only; portrait coverage remains 11/15).

## Reason for This Phase

Phase 3.2C integrated the supplied 15 portraits, distributed across A=11, B=2,
C=2. Four existing live-simulator drivers therefore still lack portraits.
This phase prepares those exact missing assets before vehicle acquisition;
it does not create drivers or change priorities to complete coverage.

## Authoritative Reconciliation

Read the current driver JSON/Markdown manifests, priority pack, acquisition
checklist, original portrait generation manifest, portrait provenance and 3.2C
integration report, plus the Stage 2 freeze and approved DRV-015 amendment.
Current SQLite identity and driver_current_vehicles relationships take precedence.
The original freeze's 20 current operations are historical; the approved
amendment adds DRV-015 as a non-simulator Priority B pair, bringing the current
count to 21. DRV-015 remains Tshifhiwa Netshanda and is excluded from these gaps.

The read-only database joins confirmed all 15 Priority A identity/current-vehicle
pairs. Running the existing selectSimulationVehicles pure selector over the
read-only vehicle/current-driver dataset with NORMAL_FLEET and limit=15 matched
the Priority A manifest exactly. Every missing driver is a participant and has
the same current vehicle in the actual selection.

| Metric | Result |
| --- | ---: |
| Priority A drivers | 15 |
| Priority A AVAILABLE | 11 |
| Priority A gaps | 4 |
| Total integrated portraits | 15 |
| Provenance records | 15 |
| Existing-file reconciliation issues | 0 |
| Provenance issues | 0 |
| Invalid existing assets | 0 |
| Duplicate/unknown mappings | 0 |
| Portraits requiring future generation | 4 |
| Remaining portraits overall | 10 |

## Exact Priority A Gaps

| Driver | Current Vehicle | Plate | City | Gap Type | Generation Required | Target File | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DRV-016 - Sipho Sithole | VH-CA-115: 2020 Volkswagen Passat | WC 7236 TX | Cape Town | ASSET_MISSING | YES | `public/assets/drivers/DRV-016.webp` | SPECIFICATION READY; NOT GENERATED |
| DRV-017 - Refilwe Mokoena | VH-DU-116: 2021 Scania R-Series | KZN 1692 GV | Durban | ASSET_MISSING | YES | `public/assets/drivers/DRV-017.webp` | SPECIFICATION READY; NOT GENERATED |
| DRV-019 - Dineo Naidoo | VH-GQ-118: 2023 Chevrolet Spark | EC 5453 FL | Gqeberha | ASSET_MISSING | YES | `public/assets/drivers/DRV-019.webp` | SPECIFICATION READY; NOT GENERATED |
| DRV-024 - Jared Jacobs | VH-PH-123: 2023 Toyota Fortuner | LP 1029 FY | Phalaborwa | ASSET_MISSING | YES | `public/assets/drivers/DRV-024.webp` | SPECIFICATION READY; NOT GENERATED |

Priority=A, simulatorParticipant=true and currentStatus=MISSING for every row.
Each target file is absent from public/assets/drivers and has no provenance
record. These are ASSET_MISSING, not MANIFEST_RECONCILIATION_REQUIRED,
PROVENANCE_MISSING or INVALID_ASSET. No existing file was deleted or altered.

The four planned targets were already specified in the original generation
manifest; the gap manifest reuses those visual variations with stronger
no-text and framing requirements. Vehicle descriptions are identification
context, not instructions to acquire vehicle imagery.

## Generation Requirements and No-Text Policy

Generate only these four fictional people, individually, after explicit owner
approval. Use realistic professional portrait photography, eye-level soft
lighting, natural expression, clean unbranded work clothing and a consistent
subtly blurred fleet/logistics setting. Preserve full head-and-shoulders framing
and circular-avatar-safe margins. Appearance variations are carried forward
from the existing specification independently of names; no real-person
identification or name-derived appearance is permitted.

Every prompt explicitly includes:

- NO TEXT ANYWHERE IN IMAGE
- NO DRIVER ID
- NO DRIVER NAME
- NO CAPTION
- NO BADGE
- NO WATERMARK

Exclude logos, readable signs/plates, government/police/military insignia and
identifiable assigned vehicles. These requirements apply to backgrounds and
clothing as well as foreground overlays. The UI renders identity separately.

The source should be PNG or tool-native, square 1:1 and at least 512x512.
The eventual output is an optimised 512x512 WebP using the unique driver-ID-only
filename. No source or WebP is created in this phase. Prompts, explicit negative
constraints and future targets are in V1_1_PRIORITY_A_PORTRAIT_GAP_MANIFEST.json.

## Preservation and Validation

The 15 integrated portraits, existing provenance and the frontend resolver
remain untouched. Runtime source and existing portrait trees were SHA-256
fingerprinted before and after this documentation phase. Existing SQLite was
opened read-only; server/database.js was not imported and no simulator was
started. Before/after database file digests match.

| Preserved area | SHA-256 baseline and final |
| --- | --- |
| Frontend source (161 files) | 35773597b1c7aa253975ffcab5aabcbec0b8c457494289082e2a741b1e81ff34 |
| Backend source/config (61 files, excluding secrets/dependencies/data) | adb32c556435622d75bf2af9b3c2fc0494580841f20899ed415dea400787be3f |
| Integrated portraits (15 files) | 8ecbfe6b9444e26cc3013dc91d576f5276aa76abce631a751814ad637ad59fe1 |
| Existing runtime SQLite | ebcb1f25fc34ba43fd0e8231a537374cc18aa9f454d806db817cb7b44640aba4 |

Validation: existing portrait validator PASS; asset audit --check PASS;
gap JSON parsed and reconciled against database/manifest/generation records;
all four participants verified by the actual selector; target names and paths
unique; existing files, AVAILABLE status, provenance and driver mappings agree;
git diff --check PASS. No frontend/backend build was needed for documentation-only
changes. Historical uncommitted application work was preserved.

Images generated: 0. Web searches: 0. Runtime modifications: 0.
No commit, push, deployment, vehicle acquisition or Phase 3.3 work occurred.

## Next Action

After explicit owner approval, generate ONLY DRV-016, DRV-017, DRV-019 and
DRV-024 individually from the verified prompts. Then use a separately approved
conversion/integration/provenance/QA step before claiming 15/15 Priority A
coverage. The specifications are ready; the four images remain missing.
