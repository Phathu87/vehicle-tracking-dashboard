# Fleet Drive AI Demo Architecture

## Runtime data path

```text
Demo telemetry producer
  -> authenticated Express telemetry endpoint
  -> services and SQLite state/history
  -> Express JSON API
  -> React Query API clients
  -> dashboard, lists, details, reports and Leaflet maps
```

The React application never mutates mock vehicle movement locally. Simulated data is produced outside the UI and follows the same Express path expected of a future telematics adapter.

## Components

- **React/Vite frontend:** Base44-aligned public and protected UI, route boundaries, central API client, React Query polling and Leaflet/OpenStreetMap rendering.
- **Express backend:** authentication, validation, fleet services, rule alerts, geofences, reports and safe JSON errors.
- **SQLite:** persistent users, vehicles, drivers, telemetry history, alerts, maintenance and geofences. Tests and QA can use `:memory:`.
- **Simulator:** deterministic, opt-in data-source process. Lifecycle is controlled by environment/startup, not an exposed public mutation API.
- **Postman:** safe operational test client using `{{base_url}}` and `{{token}}`.

## Security boundaries

Passwords are bcrypt hashes. JWTs are server signed and verified. Protected routes enforce bearer authentication in Express; frontend guards are UX only. CORS is origin-configured, auth endpoints are rate limited, request JSON is bounded, and errors avoid stacks/configuration. Public registration creates `user` accounts only.

In production, normal users are read-only for shared fleet state. Administrators own supported CRUD, while a separate service token is accepted only for simulator telemetry ingestion.

## Deployment shape

Netlify serves the Vite `dist` output with SPA fallback. Production frontend requests default to same-origin `/api`; `VITE_API_URL` may point to the hosted Express API. The backend needs writable/persistent storage for `DATABASE_PATH`, a strong `JWT_SECRET`, explicit `ALLOWED_ORIGINS`, and a Node 22 runtime compatible with `node:sqlite`.

This is a Demo architecture, not evidence of production GPS hardware, commercial uptime, multi-tenancy, trained AI or enterprise integrations.
