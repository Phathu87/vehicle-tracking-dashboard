# Fleet Drive AI v1.1 Priority A 3D Pack Specification

Status: specification only. No 3D model has been sourced, downloaded or
created.

## Strategy

Priority A uses six generic vehicle-type models for 15 moving vehicles. Each
model is a **representative vehicle-type asset**, with exactness
`VEHICLE_TYPE`; none is an exact digital twin. The frontend should eventually
load each unique GLB once and reuse its geometry, materials and textures across
vehicle instances.

## Required Pack

| Vehicle type | Required filename | Reuse count | Priority A vehicles covered |
| --- | --- | ---: | --- |
| HATCHBACK | `hatchback-generic.glb` | 4 | `VH-GQ-118`, `VH-PR-103`, `VH-RU-111`, `VH-TH-112` |
| MINIBUS | `minibus-generic.glb` | 2 | `VH-CA-101`, `VH-JO-100` |
| PICKUP | `pickup-generic.glb` | 2 | `VH-DU-102`, `VH-MA-107` |
| SEDAN | `sedan-generic.glb` | 4 | `VH-BL-113`, `VH-KI-105`, `VH-PO-110`, `VH-CA-115` |
| SUV | `suv-generic.glb` | 2 | `VH-LO-106`, `VH-PH-123` |
| TRUCK | `truck-generic.glb` | 1 | `VH-DU-116` |

Planned local directory:
`public/assets/vehicles/models/`

Runtime URLs will be `/assets/vehicles/models/<vehicle-type>-generic.glb`.

## Technical Requirements

- Format: binary glTF (`.glb`) preferred.
- Coordinate system: right-handed, `+Y` up, vehicle nose facing `+Z`.
- Origin: ground-centred on the vehicle longitudinal centreline, approximately
  between the axles; tyre contact plane at `Y = 0`.
- Scale: metres, with realistic relative dimensions between types.
- Transform: zero rotation and unit scale in the exported file.
- Geometry: clean silhouette at map-camera distance; avoid invisible interior
  detail and unnecessary underbody geometry.
- Initial complexity target: approximately 20,000-60,000 rendered triangles per
  vehicle type, subject to measured mobile performance.
- Materials: a small shared material set; avoid type-specific material sprawl.
- Textures: embedded or reliably packaged in the GLB, normally 1024px and only
  up to 2048px when inspection proves it useful.
- Texture compression: use a browser/runtime-compatible compressed path only
  after integration testing; retain a reliable fallback.
- Animation: not required for the first implementation.
- Wheel animation: not required.
- Interior: not required.
- Mobile suitability: required for 15 simultaneous moving instances.
- Initial file-size target: approximately 1-3 MB per optimised GLB, with any
  model above 5 MB requiring explicit performance review. These are planning
  budgets, not acceptance guarantees.

## Colour Policy

Authoritative fleet data has no vehicle-colour field. A future generic model
may use a restrained neutral colour or a deterministic presentation palette,
but that colour is `VISUAL PRESENTATION`, not `REAL VEHICLE COLOUR`. It must
not be persisted as vehicle identity or described as factual.

## Exactness and Provenance

Every acquired model requires a completed provenance record. `exactness` is
`VEHICLE_TYPE` for this pack. Allowed future acquisition methods are properly
licensed generic models or custom/generated generic models whose usage rights
are recorded. Unknown-license downloads, scraped models and assets with
unresolved redistribution rights are prohibited.

If a generic model is unavailable or fails to load, the future map must retain
the existing 2D marker rather than breaking vehicle rendering.
