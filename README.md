# Fleet Drive AI Demo

Fleet Drive AI is the intended commercial fleet-management product. Fleet Drive AI Demo is its working full-stack demonstration environment. The Demo uses transparent simulated fleet telemetry while authentication, persistence, APIs and operational workflows run through the real application stack.

The Legacy Vehicle Tracking Dashboard is a technical predecessor. The current React frontend and Express API are the authoritative Fleet Drive AI Demo application.

## Current capabilities

- Registration, login, session restoration, logout and protected routes.
- Vehicle CRUD, telemetry ingestion, latest status and bounded history.
- Driver CRUD, licence state and vehicle assignments.
- Persistent maintenance tasks with deterministic mileage/date rules.
- Persisted overspeed, low-fuel and geofence entry/exit alerts.
- Circle/polygon geofences and current vehicle containment checks.
- Demo nearest-neighbour route ordering and JSON maintenance/trip reports.
- API-derived dashboard KPIs and Leaflet/OpenStreetMap views.
- Opt-in deterministic fleet simulator that posts through Express.

The Demo does not claim production GPS hardware, customer contracts, published mobile apps, commercial uptime, trained AI/ML, traffic-aware routing, billing, enterprise SSO or genuine testimonials.

## Stack

Frontend: React 18, Vite 6, React Router, TanStack Query, Tailwind CSS, Radix primitives, Recharts and React Leaflet.

Backend: Node 22, Express 5, SQLite through `node:sqlite`, bcrypt, JWT and Supertest.

## Setup

Prerequisites: Node 22 and npm 11.

Backend:

```powershell
cd server
npm ci
Copy-Item .env.example .env
npm start
```

Frontend, in another terminal:

```powershell
npm ci
$env:VITE_API_URL='http://localhost:3001/api'
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Health: `http://localhost:3001/api/health`

## Environment

Frontend:

| Variable | Class | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Required for split-origin deployment | Public Express API base; production fallback is same-origin `/api` |
| `VITE_DEMO_ALLOW_USER_MUTATIONS` | Optional; default `false` | Mirrors an explicitly approved isolated Demo mutation policy in the UI |

Backend:

| Variable | Class | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | Required in production | Strong JWT signing secret |
| `PORT` | Optional | HTTP port, default `3001` |
| `DATABASE_PATH` | Optional | SQLite path; defaults inside the server workspace |
| `ALLOWED_ORIGINS` | Required for browser production use | Comma-separated allowed frontend origins |
| `TRUST_PROXY` | Optional | Set `true` only behind a trusted single proxy |
| `AUTH_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_WINDOW_MS` | Optional | Login/register limits |
| `TELEMETRY_OFFLINE_AFTER_MS` | Optional | Offline status threshold |
| `TELEMETRY_ALERT_COOLDOWN_MS` | Optional | Duplicate alert cooldown |
| `TELEMETRY_HISTORY_RETENTION_POINTS` | Optional | Per-vehicle history bound |
| `DEMO_SIMULATION_ENABLED` | Demo-only | Explicit simulator enable switch |
| `DEMO_SIMULATION_TOKEN` | Demo-only secret | Auth token used by the producer |
| `DEMO_ALLOW_USER_MUTATIONS` | Optional; default `false` | Allows normal users to mutate shared state only for an intentionally isolated/resettable Demo |
| `DEMO_SIMULATION_INTERVAL_MS`, `DEMO_SIMULATION_VEHICLE_LIMIT`, `DEMO_SIMULATION_SPEED_MULTIPLIER`, `DEMO_SIMULATION_SEED`, `DEMO_SIMULATION_SCENARIO` | Demo-only | Bounded simulator configuration |
| `API_BASE_URL` | Demo-only | Producer target, default `http://localhost:3001/api` |

Never put backend secrets in a `VITE_*` variable. Do not commit `.env` files or simulator tokens.

## Public Demo access

In production, normal registered users can inspect the operational application and run safe route optimisation but cannot change shared fleet state. Administrators retain supported CRUD, and the Fleet Demo Simulator can submit telemetry only through its service token. Local/test environments retain CRUD for development. See [Public Demo policy](docs/security/PUBLIC_DEMO_POLICY.md).

## Simulation

Simulation is opt-in. Set `DEMO_SIMULATION_ENABLED=true` and supply an authenticated `DEMO_SIMULATION_TOKEN`, then start the backend or run `npm run telemetry` in the server directory. Data flows producer -> Express -> SQLite -> API -> frontend. See [WP11 simulation](docs/demo/WP11_FLEET_SIMULATION.md).

## Verification

```powershell
# frontend
npm test
npm run lint
npm run build

# backend
cd server
npm test
```

The safe Postman collection is `Fleet Drive AI Demo.postman_collection.json`. Set `{{base_url}}`, register/login, and the login test stores the returned JWT in `{{token}}`. The collection contains no credentials.

## Deployment readiness

`netlify.toml` builds the root React application and supplies SPA fallback. Configure `VITE_API_URL` to the hosted API unless `/api` is reverse-proxied. The Express host needs Node 22, a writable `DATABASE_PATH`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `PORT`, and an explicit simulation policy. `GET /api/health` is the liveness check.

This repository now contains the normalized release candidate. Deployment remains blocked until the historical map credential is confirmed rotated/revoked, the proposed source changes are committed, and a real clean checkout reproduces the candidate. See [WP13 topology](docs/release/WP13_REPOSITORY_TOPOLOGY.md).

## Project evolution

- Legacy Vehicle Tracking Dashboard: original React and Leaflet technical predecessor.
- Vehicle Maintenance API v2: historical API contract and testing reference.
- Fleet Drive AI Demo: reconciled working full-stack demonstration.
- Fleet Drive AI: commercial product direction requiring separate discovery and production architecture decisions.

## Documentation

Start with the [documentation index](docs/README.md), [API reference](docs/api/API_REFERENCE.md), [architecture](docs/architecture/DEMO_ARCHITECTURE.md), and [WP13 release report](docs/release/WP13_RELEASE_REPORT.md).
