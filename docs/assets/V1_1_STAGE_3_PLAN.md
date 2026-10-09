# Fleet Drive AI Demo v1.1 - Stage 3 Controlled Visual Asset Plan

Stage: 3 - Controlled Visual Asset Acquisition  
Phase: 3.1 - Priority A Asset Specification and Sourcing Plan  
Status: planning complete; no acquisition started

## 1. Frozen Input

Stage 3 consumes, but does not change, the Stage 2 freeze. Priority A contains
15 current driver/vehicle pairs, 15 exact year/make/model specifications, 12
make/model families and six vehicle types. Vehicle identity, driver identity,
plates, assignments, current operation, telemetry, heading and simulator
relationships remain immutable unless a separate data correction is approved.

## 2. Asset and Identity Boundary

Textual identity comes from the Express/SQLite fleet model. Visuals come from a
future static asset registry. A database vehicle may truthfully retain its exact
year/make/model identity while using a representative vehicle-type GLB. Generic
3D assets must never be described as exact digital twins.

The application database must not store speculative asset paths, licences,
vehicle colours or inferred visual properties.

## 3. Asset Paths

| Asset | Local path convention | Runtime URL convention |
| --- | --- | --- |
| Driver portrait | `public/assets/drivers/<driverId>.webp` | `/assets/drivers/<driverId>.webp` |
| Exact vehicle image | `public/assets/vehicles/images/<visualKey>.webp` | `/assets/vehicles/images/<visualKey>.webp` |
| Generic vehicle GLB | `public/assets/vehicles/models/<vehicle-type>-generic.glb` | `/assets/vehicles/models/<vehicle-type>-generic.glb` |

Only approved, real files should be created. Empty placeholders for later
priority tiers are prohibited.

## 4. Driver Strategy

Priority A requires 15 coherent fictional portraits. The preferred method is
`GENERATED FICTIONAL`, followed by properly licensed stock used as a fictional
representation, then a generic avatar. The portrait system uses consistent
head-and-shoulders framing, lighting, neutral/fleet-context backgrounds and
professional tone without attempting to portray real people or infer sensitive
attributes from names.

## 5. Vehicle 2D Strategy

Preferred order:

1. exact year/make/model image with confirmed rights;
2. reviewed same-generation/model-family image;
3. generated representative vehicle image;
4. generic vehicle-type fallback.

The visual system uses a clear front three-quarter vehicle, minimal clutter,
controlled or transparent background where rights permit, and no dealership
graphics, prices, watermarks, unrelated people or third-party advertising.
Google Images and public accessibility are not licences.

## 6. Vehicle 3D Strategy

The first pack contains six reusable generic GLBs: hatchback, minibus, pickup,
sedan, SUV and truck. Every mapping begins with exactness `VEHICLE_TYPE`. Exact
or model-family assets may replace a generic model later only when their
quality, performance and usage rights are approved.

Allowed future methods are a properly licensed model, a custom/generated model
with documented rights, or a properly licensed generic model. Unknown-license
downloads are prohibited.

## 7. Vehicle Colour

The frozen data has no authoritative colour. A neutral model colour or a
deterministic presentation palette may be applied during future rendering, but
must be labelled `VISUAL PRESENTATION`, not `REAL VEHICLE COLOUR`. Presentation
colour must not be written into fleet identity.

## 8. Exactness Model

| Value | Meaning |
| --- | --- |
| `EXACT` | Approved asset matches the frozen exact vehicle specification |
| `MODEL_FAMILY` | Approved representation of the reviewed make/model family or generation |
| `VEHICLE_TYPE` | Representative body-type asset, such as `suv-generic.glb` |
| `GENERIC` | Non-type-specific fallback visual |
| `NONE` | No physical asset available |

`plannedExactness` records intent; `exactness` records the actual approved file.
Missing assets remain `NONE`.

## 9. Provenance Gate

Every asset must have a completed record based on
`ASSET_PROVENANCE_TEMPLATE.json`. Required decisions include source, creator,
licence, commercial-use permission, modification permission, attribution,
actual exactness and relevant driver/vehicle mapping. Null permission fields do
not mean permission granted. No asset may enter integration while its licence
or required attribution is unresolved.

## 10. Fallback Model

- Missing driver photo: deterministic initials avatar.
- Missing vehicle image: vehicle-type placeholder.
- Missing exact/model-family 3D: generic vehicle-type GLB.
- Missing or failed 3D entirely: existing 2D vehicle marker.
- Failed optional visual: retain textual identity and operational controls.

Asset failure must not block map rendering, live telemetry, navigation or the
driver/vehicle card.

## 11. Initial Performance Budgets

These ranges are planning targets and must be validated on representative
mobile and desktop hardware:

- Driver portraits: optimised 512px WebP, normally about 40-120 KB each.
- Vehicle images: responsive WebP, normally about 100-350 KB each; optional
  AVIF only with tested WebP fallback.
- Generic GLBs: approximately 1-3 MB each after optimisation, with files above
  5 MB requiring explicit review.
- Geometry: approximately 20,000-60,000 rendered triangles per generic model.
- Textures: normally 1024px, up to 2048px only where measured quality requires.

The live map may show 15 moving vehicles. It must not download 15 independent
copies of equivalent model data.

## 12. Reuse and Runtime Plan

The eventual renderer should load the six unique GLBs once, cache them by
vehicle type, and instantiate/reuse geometry, materials and textures for the 15
vehicles. Per-instance transforms, labels, selection state and presentation
colour may vary. Resource disposal must occur when the map/session is torn
down. This plan does not implement MapLibre, Three.js or runtime loading.

## 13. Future Static Registry

A later phase may implement `src/data/visualAssetRegistry.js` or an equivalent
validated JSON registry. Conceptual shape:

```json
{
  "drivers": {
    "DRV-001": {
      "photo": "/assets/drivers/DRV-001.webp",
      "provenanceId": "driver-DRV-001-photo"
    }
  },
  "vehicleImages": {
    "2020-hyundai-h1": {
      "file": "/assets/vehicles/images/2020-hyundai-h1.webp",
      "exactness": "EXACT",
      "provenanceId": "vehicle-2020-hyundai-h1-image"
    }
  },
  "vehicleModels": {
    "MINIBUS": {
      "file": "/assets/vehicles/models/minibus-generic.glb",
      "exactness": "VEHICLE_TYPE",
      "provenanceId": "vehicle-type-minibus-model"
    }
  }
}
```

This is a schema example only. No runtime registry is created in Phase 3.1.

## 14. Controlled Acquisition Methods

| Asset class | Allowed future methods |
| --- | --- |
| Driver portrait | `GENERATED FICTIONAL`, `LICENSED STOCK`, `GENERIC AVATAR` |
| Vehicle 2D | `LICENSED MANUFACTURER/MEDIA`, `LICENSED STOCK`, `GENERATED REPRESENTATIVE`, `GENERIC FALLBACK` |
| Vehicle 3D | `LICENSED MODEL`, `CUSTOM/GENERATED MODEL`, `GENERIC LICENSED MODEL` |

Watermarked material, unknown-license downloads, scraped dealership imagery and
assets without confirmed usage rights are not allowed.

## 15. Controlled Stage 3 Phases

| Phase | Scope | Boundary |
| --- | --- | --- |
| 3.1 | Priority A specification and sourcing plan | Documentation only |
| 3.2 | Priority A fictional driver portraits | Create/approve 15 fictional portraits only |
| 3.3 | Priority A vehicle 2D acquisition | Acquire/create and license 15 exact/fallback image mappings |
| 3.4 | Priority A generic 3D vehicle pack | Acquire/create and validate six reusable GLBs |
| 3.5 | Asset registry and live-card integration | Add static registry and tested fallbacks |
| 3.6 | Priority B assets | Extend only after Priority A acceptance |
| 3.7 | Stage 3 QA and freeze | Reconcile provenance, performance and rendered behavior |

Each phase requires separate approval. Phase 3.1 does not authorise a later
phase.

## 16. Phase 3.1 Validation

- Priority A drivers: 15
- Priority A vehicles: 15
- Exact specifications: 15
- Make/model families: 12
- Vehicle types: 6
- Driver filenames: deterministic and unique
- Vehicle image filenames: deterministic and unique
- Generic GLB filenames: deterministic and unique
- Physical files created: 0
- External asset URLs added: 0
- Runtime source changes: 0
- Database changes: 0
- Historical application changes: 0

The next separately approved phase is 3.2 - Priority A Fictional Driver
Portrait Creation.
