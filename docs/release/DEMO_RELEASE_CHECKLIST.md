# Demo Release Checklist

## Code and security

- [x] Frontend lint, unit tests and production build pass.
- [x] Backend tests and isolated production startup pass.
- [x] CORS, security headers, JSON limits, auth rate limiting and JSON errors are configured.
- [x] `.env.example` files contain names/safe examples only; runtime databases and server env files are ignored.
- [x] Postman stores no JWT or credentials.
- [x] Legacy map credential revocation is owner-confirmed; no replacement credential is committed.
- [x] Canonical Git root and release source are captured in commit `ca0661690f0a36ca5b5597db7140426f7ff52853`.
- [x] Frontend dependency advisories are reviewed, safely remediated where possible and documented.

## Product flows

- [x] Real register/login/me/session/logout boundary.
- [x] Vehicles, telemetry, history, status and maps connect to Express.
- [x] Drivers, maintenance, alerts, geofences, route optimisation and reports connect to Express.
- [x] Simulation is environment controlled and disclosed.
- [x] Missing exports, analytics, fuel management and user management are labelled honestly.
- [x] Shared-Demo mutations are restricted server-side and the resettable persistence policy is documented.

## UX and deployment

- [x] Landing and dashboard have no page-level overflow at all six required widths in Chromium.
- [x] Loading, empty and error states exist on operational modules.
- [x] Destructive operations exposed by the UI require confirmation and pending actions disable repeat submission.
- [x] Netlify SPA fallback and CI configuration are present.
- [x] Production frontend defaults to same-origin `/api`; no production localhost fallback.
- [x] Backend health/startup/environment contract is documented.
- [ ] Validate Firefox/WebKit and the deployed Netlify/backend pair after blockers are cleared.

Release gate: **READY FOR PUSH/DEPLOYMENT APPROVAL**. Hosted checks remain pending and are not marked as passed.
