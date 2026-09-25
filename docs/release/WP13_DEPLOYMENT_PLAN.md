# WP13 Deployment Plan

Date: 2026-09-23
Status: Prepared, not executed

## Architecture

- Frontend target: Netlify, configured by `netlify.toml`.
- Backend target: an owner-approved Node 22 host. No backend provider has been approved in the repository, so selecting or provisioning one is outside this checkpoint.
- API health: `GET /api/health`.
- Public policy: authenticated normal users are read-only; administrators own supported CRUD; the simulator owns telemetry ingestion only.

## Frontend

- Base directory: repository root
- Install: `npm ci`
- Build: `npm run build`
- Publish: `dist`
- Required production variable: `VITE_API_URL=https://<approved-api-host>/api`
- Optional policy mirror: `VITE_DEMO_ALLOW_USER_MUTATIONS=false`
- SPA fallback: configured in `netlify.toml`

No production build may rely on the development localhost fallback.

## Backend

- Runtime: Node 22
- Directory: `server`
- Install: `npm ci`
- Start: `npm start`
- Health check: `/api/health`
- Required: strong `JWT_SECRET`, exact `ALLOWED_ORIGINS`, writable `DATABASE_PATH`
- Recommended: `NODE_ENV=production`, `TRUST_PROXY=true` only behind one trusted proxy, `DEMO_ALLOW_USER_MUTATIONS=false`
- Simulation: explicitly set `DEMO_SIMULATION_ENABLED`; when enabled supply a secret `DEMO_SIMULATION_TOKEN` and bounded interval/vehicle/scenario settings
- Notifications: no external provider is required and the simulator does not send email or SMS

## Persistence

Chosen portable baseline: **EPHEMERAL / RESETTABLE DEMO STATE**. A host without a persistent filesystem may recreate and reseed SQLite on restart or redeploy. This is acceptable for the Demo and must not be described as durable persistence.

If the approved host already offers a mounted persistent volume, `DATABASE_PATH` may point there and the behavior must be reverified. WP13 does not migrate SQLite.

## CORS

`ALLOWED_ORIGINS` must contain only the final HTTPS frontend origin. The backend rejects unrelated browser origins. Update this value only after the Netlify URL is known.

## Minimal observability

An operator can answer:

1. Frontend deployed: inspect the Netlify deployment state and public URL.
2. Backend running: inspect host process/startup logs.
3. API responding: request `GET /api/health`.
4. Simulation running: authenticate and request `GET /api/demo/status`.
5. Latest deployment failed: inspect Netlify/backend deployment logs and startup exit state.

API failures surface as structured JSON; frontend failures render error/retry states. No enterprise APM or tracing is introduced.

## Approval and verification gates

Do not deploy until the historical Mapbox token is confirmed revoked, the release candidate is committed, a real clean checkout passes, and the owner explicitly approves deployment. After deployment, verify HTTPS, health, CORS, auth, dashboard, vehicles, map, simulation, public mutation policy, safe failures, bundle secrets and 375/768/1440 responsive smoke paths from hosted services.

Hosted checks are **NOT EXECUTED - AWAITING DEPLOYMENT APPROVAL**.
