# Fleet Drive AI Demo - Initial Public Demo

Proposed version: `v1.0.0-demo`
Prepared: 2026-09-23
Status: release candidate; no tag created

## Included

- React/Vite public site and original design prototype-aligned authenticated operations UI.
- Express REST API, JWT authentication and SQLite Demo persistence.
- Vehicle, driver, maintenance, alert, geofence, route and report workflows.
- Leaflet/OpenStreetMap fleet maps.
- Fleet Demo Simulator telemetry flowing through Express into persisted state/history.
- API-derived dashboard metrics, responsive layouts, tests, CI and safe Postman collection.
- Public read-only mutation policy with administrator and simulator boundaries.

## Simulated and Demo-only

Vehicle positions, speeds, fuel and movement are simulated Demo Fleet data. Route optimisation is deterministic nearest-neighbour Demo logic. Maintenance prediction is rule based, not machine learning. Illustrative pricing and scenarios are not commercial commitments or customer claims.

## Release controls

Generated dependencies and runtime databases are ignored. The candidate has no tracked current `.env`. Production secrets remain environment-only. Deployment is blocked until the historical Mapbox credential is confirmed revoked and the owner approves commit/deployment actions.

## Known limitations

SQLite uses experimental `node:sqlite`; public hosting persistence may be ephemeral. Two moderate React Router advisories are accepted for this client-only Demo pending a controlled major migration. JavaScript typecheck debt remains non-blocking. Firefox/WebKit, hosted behavior, PDF/CSV exports, alert acknowledgement and production-scale infrastructure are not validated or implemented.

Fleet Drive AI is the commercial product direction. This release is Fleet Drive AI Demo, not a production commercial platform.
