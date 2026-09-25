# WP12 Release Readiness Report

Date: 2026-09-23

## 1. Executive Summary

Fleet Drive AI Demo is functionally strong: the connected frontend/backend flows, authentication, simulator, production build and 36 automated tests pass. Chromium QA covered the full user journey and six required viewport sizes. Public release is nevertheless blocked by two release-control issues: the authoritative frontend/docs are outside the only Git repository while active backend source is untracked, and a legacy map credential found in Git history requires rotation.

## 2. Release State

**DEMO RELEASE BLOCKED**

## 3. Product Identity

Fleet Drive AI is the intended commercial product. Fleet Drive AI Demo is the working full-stack demonstration. Simulated telemetry demonstrates the product without implying customers, contracts, production hardware, mobile apps, uptime or trained AI.

## 4. Source-of-Truth Summary

Express and its tests define backend behavior; the current API reference and safe Postman collection describe it. Base44 defines visual direction. The legacy dashboard contributes proven Leaflet patterns. SQLite/Express state, not React fixtures, is runtime truth.

## 5. Git State

Nested repository: branch `master`, commit `d597435c583b8486dd7f401e96020c7188f95c93`. The outer authoritative frontend/docs workspace is not a Git repository. Active backend source and the four named WP11 files remain untracked. Historically tracked `server/node_modules` creates extensive dependency-output churn. Nothing was staged, committed, pushed or moved.

## 6. Frontend Status

React 18/Vite 6 builds and lints. Base44 styling is retained. API loading, empty and error states exist. Network session restoration now distinguishes backend outage from invalid authentication and preserves the stored token.

## 7. Backend Status

Express 5 starts in production mode with required JWT configuration. SQLite persistence, validation, safe errors, CORS, security headers, body limits and auth rate limiting are active. Node warns that `node:sqlite` is experimental.

## 8. Authentication Status

Registration, duplicate rejection, valid/invalid login, password hashing, JWT verification/expiry behavior, `/me`, remember-me, protected routes, session restoration and logout pass. Public registration cannot select `admin`. There is no current admin-only endpoint, so role-specific authorization is not applicable yet.

## 9. API Status

Current routers, API documentation, frontend calls and Postman are reconciled. Unknown API routes return JSON 404. Mileage regression returns 409. The public raw-array vehicle list is intentionally preserved.

## 10. Vehicle/Telemetry Status

Vehicle CRUD, status, authenticated telemetry, bounded history and deletion cascade pass. Frontend list/detail/map/history are connected. Browser QA opened `VH-BL-100`; telemetry marker SVG geometry changed during producer updates.

## 11. Driver Status

CRUD, duplicate licence protection, licence state, detail and verified vehicle assignments pass. Browser QA opened a driver detail and confirmed licence/assignment sections.

## 12. Maintenance Status

List/add/update/complete/delete use persistent task IDs. Deterministic mileage/date statuses are labelled as rules, not ML. Browser QA completed one isolated in-memory task and observed history count change from 8 to 9.

## 13. Alerts Status

Supported persisted types are overspeed, low fuel, geofence entry and geofence exit. Listing/filtering is connected. Acknowledgement is not implemented and is not fabricated.

## 14. Geofence Status

Circle/polygon CRUD, containment checks and telemetry-driven entry/exit persistence pass. No external geospatial provider is claimed.

## 15. Route Optimisation Status

Connected deterministic nearest-neighbour Demo algorithm. It is explicitly not road-, traffic-, Google-, Mapbox- or AI-powered.

## 16. Reports Status

Maintenance and trip/history JSON reports derive from persisted backend records. PDF/CSV controls are disabled and labelled planned.

## 17. Simulator Status

Opt-in configuration, lifecycle, duplicate-loop prevention, clean stop, safe reset, deterministic selection, valid coordinates/fuel, non-decreasing mileage, offline/overspeed/geofence/maintenance interactions and notification safety are covered. Status API is authenticated and read-only.

## 18. Security Findings

- Added origin-aware CORS, safe headers, disabled Express signature, 100 KB JSON limit handling and safe JSON errors.
- Added in-memory login/register rate limiting without throttling fleet routes.
- Added vehicle mutation validation and decreasing-mileage rejection.
- Backend dependency audit: 0 vulnerabilities.
- Frontend audit: 9 advisories (2 high, 6 moderate, 1 low), no critical; P1 remediation required.
- Deleted and ignored tracked legacy `app/.env`; token-like map credential remains in history: **ROTATION REQUIRED**.
- No password/JWT/provider credential logging found. Test-only JWT secrets are confined to tests.

## 19. Responsive QA

Chromium DOM/render checks at 375x812, 430x932, 768x1024, 1024x768, 1440x900 and 1920x1080 found no page-level horizontal overflow on landing or dashboard. Mobile application routes were additionally traversed at 375x812. Tables use contained scrolling where needed.

## 20. Accessibility QA

Semantic headings, labels, named icon controls, live loading state, focus-visible styles, status text plus color, modal/drawer semantics and map control names were reviewed. A reduced-motion CSS override was added. This is an engineering review, not a formal WCAG conformance audit.

## 21. Performance QA

Production output is route split. Largest files: Dashboard 448.65 KB (120.94 KB gzip), main 381.85 KB (122.25 KB gzip), Leaflet 154.41 KB (45.15 KB gzip). No Vite chunk warning was emitted. Polling is React Query based; dashboard requests vehicles, drivers, alerts and maintenance once per query key. No speculative rewrite was made.

## 22. Browser QA

Chromium: PASS for public navigation, registration/login/logout, protection, dashboard, maps, major modules, one maintenance action and responsive widths. Console showed only React Router v7 future-flag warnings. Firefox/WebKit: NOT TESTED because unavailable. Marker movement: PASS. Durable no-remount identity assertion: BLOCKED BY ENVIRONMENT, with no visible blank/flicker observed. Network failure now renders an explicit retry state without deleting the stored token; requests have a 15-second timeout, and 401/403/404/409/500 paths use structured errors.

## 23. Test Results

- Backend: 34 passed, 0 failed, 0 skipped.
- Frontend unit: 2 passed, 0 failed, 0 skipped.
- Browser E2E journey: 1 passed, 0 failed, 0 skipped.
- Typecheck: failed on pre-existing JavaScript inference/declaration issues; non-blocking because this is not a TypeScript migration and lint/build pass.

## 24. Production Build Result

PASS: `VITE_API_URL=/api npm run build`. Final run completed in 1m 5s. Windows sandbox required the approved elevated esbuild workaround. No blocking warnings.

## 25. Deployment Readiness

Netlify build/publish and SPA fallback are configured. Production frontend defaults to `/api`, not localhost. Backend startup, health, auth and shutdown were verified with an in-memory database. CI is conservative and contains no deployment. Deployment remains blocked by repository topology, credential rotation, dependency review and public mutation policy.

## 26. Feature Classification Summary

Auth, CRUD, history, maintenance, alerts, geofences and reports are real Demo functions. Fleet telemetry, positions and fuel levels are simulated data. Routing and simulator are Demo-only. Fuel consumption is partial. Analytics, user management, mobile, AI, billing and hardware integrations are future/not implemented.

## 27. Known Limitations

See `KNOWN_LIMITATIONS.md`. Material limits are Git reproducibility, credential rotation, frontend advisories, shared mutation policy, unavailable Firefox/WebKit, partial no-remount automation, typecheck debt, experimental SQLite, no acknowledgement/export, and future commercial infrastructure.

## 28. Release Blockers

P0: establish one canonical tracked repository containing frontend, backend, docs and CI; prove a clean-checkout build. P0: rotate/revoke the map credential present in Git history and configure any replacement outside source control.

## 29. Commercial Handoff

The Demo validates product workflows and architecture, not commercial completeness. Production telematics, tenant/admin security, managed storage, operations, providers, legal/commercial readiness and validated AI/mobile capabilities remain a separate handoff.

## 30. Recommendation

Do not deploy. First close the two P0 findings with an owner-approved repository plan and credential rotation. Then address P1 frontend advisories and shared-Demo mutation policy, run CI from a clean checkout, and validate the hosted Netlify/API pair plus Firefox/WebKit.

## Dashboard Data Matrix

| KPI | Source | Calculation | Classification |
| --- | --- | --- | --- |
| Total Vehicles | `GET /api/vehicles` | record count | REAL DEMO FUNCTION over SIMULATED DATA |
| Online Vehicles | vehicle status | count of online/moving/active | REAL DEMO FUNCTION over SIMULATED DATA |
| Active Drivers | `GET /api/drivers` | driver record count | REAL DEMO FUNCTION |
| Alerts | `GET /api/alerts` | persisted alert count | REAL DEMO FUNCTION |
| Average Speed | vehicle telemetry | arithmetic mean of latest speeds | REAL DEMO FUNCTION over SIMULATED DATA |
| Locations | vehicle city/area | distinct location count | REAL DEMO FUNCTION over SIMULATED DATA |
| Distance Today | stored histories | cumulative haversine segments when available | PARTIAL |
| Fuel Consumed | telemetry `fuelConsumed` | sum when present; otherwise explicit gap | PARTIAL |
| Maintenance | `GET /api/maintenance` | status buckets | REAL DEMO FUNCTION |
| Driver Rankings | vehicles/drivers | assigned/active counts and average speed | DEMO-ONLY ranking |
