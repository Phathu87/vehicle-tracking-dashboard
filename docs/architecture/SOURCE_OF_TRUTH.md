# Source of Truth

## Priority

| Concern | Authority |
| --- | --- |
| Backend behavior | Current Express routers/controllers/services and passing tests |
| API contract | Current Express, then `docs/api/API_REFERENCE.md`, then safe Postman collection |
| Design | Approved Fleet Drive AI design references and supplied mockups |
| Reusable technical patterns | Legacy Vehicle Tracking Dashboard |
| Product language | Fleet Drive AI specification and documented commercial boundary |
| Runtime data | SQLite state populated through Express, including simulator telemetry |

Historical generated entities are not the production backend. Legacy frontend fixtures are not authoritative runtime data. The historical Vehicle Maintenance API v2 collection is a reference, not a promise that obsolete behavior remains current.

## Repository boundary

The selected release root is this repository. The current React application lives in `src/`, the Express API in `server/`, and release documentation/configuration at the repository root. `legacy/` retains the old Vehicle Tracking Dashboard as reference-only source. Local recovery material under `.topology-recovery/` and `.wp13-*/` is ignored and is not part of the application or release.
