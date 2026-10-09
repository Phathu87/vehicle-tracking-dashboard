# Fleet Drive AI v1.1 Priority A Driver Portrait Specification

Status: specification only. No portrait has been searched for, sourced or
generated.

## Shared Portrait System

All portraits represent fictional Demo people. Names are identifiers for
fictional records and must not be used to search for, resemble or infer the
appearance of real people. Do not derive sensitive personal attributes from a
name.

- Format: optimised WebP.
- Master aspect ratio: 1:1.
- Master dimensions: 512x512 pixels or a larger equivalent master that can be
  reduced cleanly.
- Crop: consistent head-and-shoulders framing with enough safe area for a
  circular avatar crop.
- Camera: eye-level or slightly above, natural portrait perspective, minimal
  lens distortion.
- Lighting: soft, even, natural-looking key and fill with consistent contrast.
- Background: simple neutral backdrop or subtle, non-identifying fleet/workplace
  context; no readable third-party branding.
- Style: realistic professional fleet-driver profile photograph.
- Expression: natural, calm and professional.
- Wardrobe: practical neutral workwear, collared shirts or restrained high-vis
  details; no protected organisation logos or uniforms.
- Consistency: one colour treatment, comparable crop, exposure, sharpness and
  background depth across all 15 portraits, while allowing natural fictional
  variation.
- Quality: clean face and hair edges, credible anatomy, no text, watermarks,
  badges or image-generation artifacts.
- UI use: live driver card, driver detail, vehicle/current-driver card and
  compact avatar.
- Initial delivery budget: typically 40-120 KB per optimised 512px WebP; files
  above roughly 180 KB require optimisation review. This is an initial budget
  to validate against rendered quality.

Missing portrait fallback: the existing deterministic initials avatar.

## Priority A Portraits

| Driver ID | Fictional driver name | Required filename | Planned local path |
| --- | --- | --- | --- |
| DRV-001 | Ayanda Dlamini | `DRV-001.webp` | `public/assets/drivers/DRV-001.webp` |
| DRV-002 | Siyabonga Naidoo | `DRV-002.webp` | `public/assets/drivers/DRV-002.webp` |
| DRV-003 | Thandi Mokoena | `DRV-003.webp` | `public/assets/drivers/DRV-003.webp` |
| DRV-004 | Lerato Nkosi | `DRV-004.webp` | `public/assets/drivers/DRV-004.webp` |
| DRV-006 | Riyaad Ahmed | `DRV-006.webp` | `public/assets/drivers/DRV-006.webp` |
| DRV-007 | Jenna Smith | `DRV-007.webp` | `public/assets/drivers/DRV-007.webp` |
| DRV-008 | Zanele Daniels | `DRV-008.webp` | `public/assets/drivers/DRV-008.webp` |
| DRV-011 | Fhulufhelo Makhale | `DRV-011.webp` | `public/assets/drivers/DRV-011.webp` |
| DRV-012 | Palesa Mthembu | `DRV-012.webp` | `public/assets/drivers/DRV-012.webp` |
| DRV-013 | Charlene van der Merwe | `DRV-013.webp` | `public/assets/drivers/DRV-013.webp` |
| DRV-014 | Lwazi van Wyk | `DRV-014.webp` | `public/assets/drivers/DRV-014.webp` |
| DRV-016 | Sipho Sithole | `DRV-016.webp` | `public/assets/drivers/DRV-016.webp` |
| DRV-017 | Refilwe Mokoena | `DRV-017.webp` | `public/assets/drivers/DRV-017.webp` |
| DRV-019 | Dineo Naidoo | `DRV-019.webp` | `public/assets/drivers/DRV-019.webp` |
| DRV-024 | Jared Jacobs | `DRV-024.webp` | `public/assets/drivers/DRV-024.webp` |

Only these Priority A files are planned for Phase 3.2. Do not create empty
files for Priority B or C drivers.

## Controlled Post-Freeze Portrait Exception

Phase 3.2B reconciles `DRV-015` to the fictional identity `Tshifhiwa
Netshanda` and assigns a current vehicle for future live visual use. This does
not add DRV-015 to the 15-driver Priority A simulator set.

| Driver ID | Fictional driver name | Priority | Target filename | Planned local path | Integration status |
| --- | --- | --- | --- | --- | --- |
| DRV-015 | Tshifhiwa Netshanda | B | `DRV-015.webp` | `public/assets/drivers/DRV-015.webp` | NOT INTEGRATED |

## Allowed Future Methods

1. `GENERATED FICTIONAL`
2. `LICENSED STOCK` used as a fictional representation with recorded rights
3. `GENERIC AVATAR`

Every completed portrait must receive a provenance record. The filename alone
does not establish permission or availability.
