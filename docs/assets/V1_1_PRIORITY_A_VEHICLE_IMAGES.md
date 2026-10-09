# Fleet Drive AI v1.1 Priority A Vehicle Image Specification

Status: specification only. No vehicle image has been searched for, sourced,
downloaded or generated.

## Shared Presentation System

- Preferred view: front three-quarter at a consistent eye-level vehicle angle.
- Composition: complete vehicle visible with comfortable card-safe margins.
- Background: transparent where the source licence and editing rights allow;
  otherwise a controlled neutral background with minimal visual clutter.
- Exclusions: dealership banners, prices, watermarks, unrelated people,
  readable third-party advertising and misleading fleet livery.
- Target format: WebP. AVIF may be added later only as an optional, tested
  delivery variant with a WebP fallback.
- Master target: approximately 1600x1067 (3:2) or an equivalent high-quality
  source that supports responsive card crops.
- Initial delivery budget: typically 100-350 KB per optimised WebP; larger files
  require measured visual justification. This is an initial planning range.
- UI use: driver live card, vehicle detail, current-operation panel and future
  visual selector.

Missing image fallback: a vehicle-type placeholder. Image failure must not
remove textual vehicle identity or break the map.

## Exact Priority A Requirements

All desired images begin at `EXACT` planned exactness. A future acquisition may
be accepted at lower exactness only when its manifest/provenance records the
truthful level.

| Visual key | Year | Make | Model | Type | Required filename | Desired exactness | Fallback strategy |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| `2023-mercedes-benz-c-class` | 2023 | Mercedes-Benz | C-Class | SEDAN | `2023-mercedes-benz-c-class.webp` | EXACT | Same generation/model family, generated representative, sedan placeholder |
| `2021-hyundai-h1` | 2021 | Hyundai | H1 | MINIBUS | `2021-hyundai-h1.webp` | EXACT | Same generation/model family, generated representative, minibus placeholder |
| `2022-toyota-hilux` | 2022 | Toyota | Hilux | PICKUP | `2022-toyota-hilux.webp` | EXACT | Same generation/model family, generated representative, pickup placeholder |
| `2023-chevrolet-spark` | 2023 | Chevrolet | Spark | HATCHBACK | `2023-chevrolet-spark.webp` | EXACT | Same generation/model family, generated representative, hatchback placeholder |
| `2020-hyundai-h1` | 2020 | Hyundai | H1 | MINIBUS | `2020-hyundai-h1.webp` | EXACT | Same generation/model family, generated representative, minibus placeholder |
| `2020-hyundai-elantra` | 2020 | Hyundai | Elantra | SEDAN | `2020-hyundai-elantra.webp` | EXACT | Same generation/model family, generated representative, sedan placeholder |
| `2021-nissan-x-trail` | 2021 | Nissan | X-Trail | SUV | `2021-nissan-x-trail.webp` | EXACT | Same generation/model family, generated representative, SUV placeholder |
| `2022-nissan-np200` | 2022 | Nissan | NP200 | PICKUP | `2022-nissan-np200.webp` | EXACT | Same generation/model family, generated representative, pickup placeholder |
| `2023-toyota-fortuner` | 2023 | Toyota | Fortuner | SUV | `2023-toyota-fortuner.webp` | EXACT | Same generation/model family, generated representative, SUV placeholder |
| `2020-mercedes-benz-c-class` | 2020 | Mercedes-Benz | C-Class | SEDAN | `2020-mercedes-benz-c-class.webp` | EXACT | Same generation/model family, generated representative, sedan placeholder |
| `2023-volkswagen-polo` | 2023 | Volkswagen | Polo | HATCHBACK | `2023-volkswagen-polo.webp` | EXACT | Same generation/model family, generated representative, hatchback placeholder |
| `2021-ford-focus` | 2021 | Ford | Focus | HATCHBACK | `2021-ford-focus.webp` | EXACT | Same generation/model family, generated representative, hatchback placeholder |
| `2022-volkswagen-polo` | 2022 | Volkswagen | Polo | HATCHBACK | `2022-volkswagen-polo.webp` | EXACT | Same generation/model family, generated representative, hatchback placeholder |
| `2020-volkswagen-passat` | 2020 | Volkswagen | Passat | SEDAN | `2020-volkswagen-passat.webp` | EXACT | Same generation/model family, generated representative, sedan placeholder |
| `2021-scania-r-series` | 2021 | Scania | R-Series | TRUCK | `2021-scania-r-series.webp` | EXACT | Same generation/model family, generated representative, truck placeholder |

Planned local directory:
`public/assets/vehicles/images/`

Runtime URL pattern:
`/assets/vehicles/images/<visualKey>.webp`

## Make/Model Family Reconciliation

The 15 exact specifications form 12 sourcing families. Family grouping is a
search/planning aid and does not claim that different years are visually
identical.

| Make/model family | Priority A years | Exact specification count |
| --- | --- | ---: |
| Chevrolet Spark | 2023 | 1 |
| Ford Focus | 2021 | 1 |
| Hyundai Elantra | 2020 | 1 |
| Hyundai H1 | 2020, 2021 | 2 |
| Mercedes-Benz C-Class | 2020, 2023 | 2 |
| Nissan NP200 | 2022 | 1 |
| Nissan X-Trail | 2021 | 1 |
| Scania R-Series | 2021 | 1 |
| Toyota Fortuner | 2023 | 1 |
| Toyota Hilux | 2022 | 1 |
| Volkswagen Passat | 2020 | 1 |
| Volkswagen Polo | 2022, 2023 | 2 |

## Exactness and Acquisition Hierarchy

1. `EXACT`: exact year, make and model.
2. `MODEL_FAMILY`: same generation or reviewed model-family representation.
3. `GENERATED REPRESENTATIVE`: clearly documented generated representation.
4. `VEHICLE_TYPE`: generic body-type fallback.

An image's existence online does not establish legal usability. Google Images
is not a licence. Watermarks must never be removed.

Allowed future methods are licensed manufacturer/media assets where
redistribution permits, licensed stock, generated representative imagery, and
generic fallback. Unknown-license downloads and scraped dealership images are
prohibited.

## Required Provenance

Every acquired image must record `sourceType`, `sourceReference`, `creator`,
`license`, `commercialUseAllowed`, `modificationAllowed`,
`attributionRequired`, `attribution`, `retrievedAt`, `notes`, and actual
`exactness`. No licence or permission may be inferred from a filename or source
category.
