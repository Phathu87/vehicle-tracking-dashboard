# Fleet Drive AI Demo v1.1 Map Requirements

This document maps future UI behavior to verified data dependencies. WP1 does not implement a map engine, heading, road matching or 3D rendering.

| Future capability | Required data / service | Current readiness | Required future work |
| --- | --- | --- | --- |
| Exact vehicle position | Latest `lat`, `lng`, timestamp | AVAILABLE for 350/350 vehicles | Preserve telemetry freshness and expose age clearly. |
| Vehicle orientation | Heading/bearing | DERIVABLE from consecutive distinct telemetry points | Calculate and persist or expose heading; define stationary fallback. |
| Smooth movement | Ordered timestamped telemetry and interpolation | PARTIAL | Define client interpolation window, stale-data behavior and reconnect handling. |
| Road name | Road matching or reverse geocoding | MISSING | Select an approved external/local geospatial service and caching policy. |
| Area/suburb | Reverse geocoding | MISSING | Current `area` duplicates city and is not suburb-level evidence. |
| Town/city | Explicit city or reverse-geocoded coordinate | AVAILABLE, with one naming inconsistency | Canonicalise Mafikeng/Mahikeng and define live-coordinate precedence. |
| Province | Explicit province or reverse-geocoded coordinate | AVAILABLE | Define reconciliation when a vehicle crosses province boundaries. |
| Driver card | Explicit active assignment, driver identity and image | BLOCKED | Add current-active assignment and approved image mapping. |
| Vehicle image | Canonical vehicle specification and licensed asset mapping | BLOCKED | Stabilise fleet seed, add variant/type data, then source assets. |
| 3D vehicle | Licensed GLB/GLTF plus canonical vehicle mapping | BLOCKED | Add asset registry and licensing evidence after data cleanup. |
| Follow-vehicle camera | Stable selected vehicle, interpolation and heading | PARTIAL | Add heading and camera-state rules; keep loss-of-signal escape behavior. |
| Stationary state | Speed, freshness and operational status | DERIVABLE | Use speed zero only with timestamp freshness; stale telemetry becomes offline. |
| Driver current location | Explicit current vehicle then latest telemetry | BLOCKED | Do not use driver home/base data or an arbitrary assigned vehicle. |
| Road-constrained motion | Road geometry or matched route | MISSING | Current simulator interpolates straight between synthetic points. |

## Rendering Boundary

The current Leaflet implementation remains unchanged. A later work package may evaluate MapLibre and Three.js only after the data and asset contracts are approved.

## Location Precedence

For a future live card:

1. Resolve an explicit current-active vehicle assignment.
2. Read that vehicle's latest non-stale telemetry coordinates.
3. Resolve road, area, city and province from an approved geospatial source.
4. Retain stored vehicle city/province as labelled fleet metadata, not silent proof of live location.
