# Public Demo Policy

Date: 2026-09-23

## Policy

The hosted Fleet Drive AI Demo is read-only for normal registered users. This protects one shared Demo Fleet while preserving authenticated operational exploration.

| Actor | Allowed |
| --- | --- |
| Public Demo user | Read dashboard, vehicles, drivers, maintenance, alerts, geofences and reports; run safe route optimisation |
| Administrator | All supported CRUD and assignment operations |
| Fleet Demo Simulator | Submit telemetry only with the configured service token |
| Local/test operator | Supported CRUD for development and automated verification |

Public users cannot create, update or delete vehicles, drivers, maintenance tasks or geofences, change assignments, or submit telemetry. No HTTP simulation start, stop or reset endpoint exists.

## Enforcement

`server/middleware/demoMutationPolicy.js` enforces the policy when `NODE_ENV=production`. The API returns `403 DEMO_MUTATION_FORBIDDEN` for prohibited user actions. Frontend controls follow the same default policy, but backend enforcement is authoritative.

`DEMO_ALLOW_USER_MUTATIONS=true` and `VITE_DEMO_ALLOW_USER_MUTATIONS=true` are an explicit paired override for an isolated, resettable deployment. They must remain false for the shared public Demo.

The simulator uses `DEMO_SIMULATION_TOKEN` as a service credential accepted only by the telemetry route. It is not a browser variable and must never be committed.

## Reset strategy

No public reset endpoint is required because public users cannot mutate shared fleet state. An ephemeral deployment may reseed when its SQLite filesystem is recreated. Operator/admin recovery remains a deployment operation, not public functionality.

## Verification

Focused Supertest coverage proves normal production users can read and optimise routes, receive 403 for shared mutations, admins can use supported CRUD, and the service token can submit telemetry but cannot access driver mutations.
