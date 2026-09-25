# Source of Truth

## Priority

| Concern | Authority |
| --- | --- |
| Backend behavior | Current Express routers/controllers/services and passing tests |
| API contract | Current Express, then `docs/api/API_REFERENCE.md`, then safe Postman collection |
| Design | Base44 prototype and supplied Fleet Drive AI references |
| Reusable technical patterns | Legacy Vehicle Tracking Dashboard |
| Product language | Fleet Drive AI specification and documented commercial boundary |
| Runtime data | SQLite state populated through Express, including simulator telemetry |

Base44 generated entities are not the production backend. Legacy frontend fixtures are not authoritative runtime data. The historical Vehicle Maintenance API v2 collection is a reference, not a promise that obsolete behavior remains current.

## Repository boundary

The selected release root is this repository. The current application lives in `frontend/`, the Express API in `server/`, and release documentation/configuration at the repository root. `app/` is retained only as the Legacy Vehicle Tracking Dashboard predecessor. The normalized files are ready to track but require an owner-approved commit and clean-checkout proof before release.
