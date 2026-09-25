# WP13 Release Report

Final verification: 2026-09-25
Project: Fleet Drive AI Demo
Owner: Phathutshedzo Rakhunwana

## 1. Executive Summary

WP13 normalized the complete Demo into one Git boundary, removed 3,391 tracked dependency files, remediated dependency advisories and enforced a production public read-only policy. Release commit `ca0661690f0a36ca5b5597db7140426f7ff52853` was reproduced from a clean checkout, and the repository owner confirmed revocation of the historical Mapbox credential. Both P0 release controls are resolved.

## 2. WP12 Blockers Entering WP13

- P0-1: the commit could not reproduce authoritative source.
- P0-2: a historical map credential required rotation/revocation.
- P1: nine frontend advisories and no public mutation policy.

## 3. Repository Normalization

The selected root is `C:\Users\Admin\vehicle-tracking-dashboard`. Current React source is in root `src/`; Express/SQLite is in `server/`; docs, scripts, CI, Postman and Netlify configuration are inside the same boundary. `legacy/` retains the old Vehicle Tracking Dashboard as reference-only source.

## 4. Git Hygiene

`server/node_modules/**` was removed from the index, not from the local install. Root ignore rules cover dependencies, builds, coverage, logs, environment files and SQLite runtime files while preserving source and `.env.example`. No tracked `.env`, runtime database or dependency tree remains in the proposed index. `git diff --cached --check` passes.

## 5. Credential Rotation

The historical credential is a Mapbox public token formerly in `app/.env`. The repository owner confirmed that it was revoked or disabled and that its replacement was not committed. Current source uses Leaflet/OpenStreetMap and has no dependency on either token. The repeated staged-tree secret scan passed. No history rewrite was performed.

## 6. Dependency Review

Backend audit: 0 advisories. Frontend advisories fell from 9 production findings to 2 moderate React Router findings after unused PDF/editor dependencies were removed and compatible production/development lockfile fixes applied. The remaining fix is a breaking Router 7 migration; it is accepted as P2 Demo risk with no SSR use.

## 7. Public Demo Mutation Policy

Normal production users are read-only for shared fleet data. Administrators can use supported CRUD. The Fleet Demo Simulator can submit telemetry only with its service token. Four focused tests prove the boundary; frontend controls mirror it.

## 8. Typecheck Status

Typecheck remains non-blocking P2 with 168 JavaScript inference/declaration errors. Vite environment declarations were fixed. No TypeScript migration was attempted.

## 9. Clean Checkout Verification

A fresh clone of release commit `ca0661690f0a36ca5b5597db7140426f7ff52853` started with 293 files and no dependencies, build, database or local environment. Both installs, frontend lint/tests/build, 38 backend tests, backend startup, health and critical API reads/auth passed. No file from outside Git was added and the checkout was not patched.

## 10. CI Verification

GitHub Actions runs frontend commands at the repository root and backend commands in `server/`. The workflow runs exact installs, frontend tests/lint/build and backend tests with no production secrets and no deploy step. Equivalent commands passed from the prior release commit; hosted CI must be revalidated after the topology correction is pushed.

## 11. Deployment Configuration

Netlify builds from the repository root and publishes `dist` with SPA fallback. The backend plan requires an approved Node 22 host, strong JWT secret, exact CORS origin, writable database path and explicit simulation policy. No backend provider is selected in source.

## 12. Demo Persistence Strategy

Portable baseline: **EPHEMERAL / RESETTABLE DEMO STATE**. SQLite may reseed when an ephemeral filesystem is recreated. A persistent volume may be used only when the approved host supports it and behavior is reverified.

## 13. Hosted Deployment

**NOT EXECUTED - AWAITING DEPLOYMENT APPROVAL.**

## 14. Hosted Smoke Testing

Not applicable because deployment was not approved or performed.

## 15. Hosted Security Smoke Test

Not applicable. Local tests cover headers, hidden Express signature, CORS, auth rate limiting, protected routes, body limits, safe errors and public mutation enforcement.

## 16. Simulation Verification

WP12 and the 38-test clean run validate configuration, lifecycle, telemetry ingestion, movement state, bounded selection, alerts and notification safety. HTTP status is read-only; no public reset exists. Simulation was disabled for the startup smoke run.

## 17. Performance Observations

The clean Vite build transformed 2,825 modules without a chunk warning. Largest bundles remain Dashboard 448.65 kB, main 381.69 kB and Leaflet 154.41 kB before gzip. Hosted performance was not measured.

## 18. Postman

`Fleet Drive AI Demo.postman_collection.json` is authoritative. It uses `{{base_url}}` and `{{token}}`; login captures the JWT. Local base is `http://localhost:3001`. A hosted value must be placed in a separate secret-free environment after deployment.

## 19. README / Portfolio Assets

README now covers normalized setup, public policy, environment, simulation, deployment boundary and project evolution. Hosted URLs and release screenshots were not added because no deployment occurred. The existing capture list remains a post-deployment task.

## 20. Release Version

Proposed tag: `v1.0.0-demo`. Proposed title: **Fleet Drive AI Demo - Initial Public Demo**. No version/tag was created.

## 21. Remaining P0/P1/P2/P3 Items

- P0: none. Credential rotation and repository reproducibility are resolved.
- P1: hosted CI/deployment security and policy verification await commit and deployment approval.
- P2: two moderate Router advisories, 168 typecheck errors, Firefox/WebKit unavailable, experimental `node:sqlite`, no alert acknowledgement/PDF/CSV export, hosted performance untested.
- P3: production telematics, AI, billing, mobile, SSO, multi-tenancy, managed data and commercial operations remain future product work.

## 22. Final Release Decision

**READY FOR PUSH/DEPLOYMENT APPROVAL**

Both P0 release controls are resolved. Push, tag and deployment remain separate owner-approved actions and were not performed.

## 23. Commercial Handoff Boundary

The Demo proves full-stack workflows, simulated telemetry flow and product direction. It does not prove product-market fit, production scalability, hardware compatibility, tenant isolation, commercial AI, regulatory certification, customer adoption or SLA capability. Future work begins as **Fleet Drive AI - Commercial Discovery & Product Strategy**, not automatic feature expansion.

## Acceptance Gate

### Repository

| Item | Status |
| --- | --- |
| Authoritative Git root established | PASS |
| Frontend inside release boundary | PASS |
| Backend inside release boundary | PASS |
| Docs inside release boundary | PASS |
| WP11 source inside release boundary | PASS |
| Postman inside release boundary | PASS |
| CI inside release boundary | PASS |
| Deployment config inside release boundary | PASS |
| node_modules not tracked | PASS |
| Runtime database handled correctly | PASS |
| Required source files tracked in release commit | PASS |

### Credentials

| Item | Status |
| --- | --- |
| Historical map credential identified | PASS |
| Historical map credential rotated/revoked | PASS - OWNER CONFIRMED |
| Current source does not use old credential | PASS |
| Replacement secret not committed | PASS |
| .env safe | PASS |
| .env.example safe | PASS |

### Dependencies

| Item | Status |
| --- | --- |
| Backend audit reviewed | PASS |
| Frontend advisories reviewed | PASS |
| P0 dependency issues resolved | PASS |
| P1 dependency issues resolved or explicitly accepted | PASS |
| Build successful after safe remediation | PASS |

### Public Demo

| Item | Status |
| --- | --- |
| Mutation policy defined | PASS |
| Mutation policy enforced server-side | PASS |
| Reset strategy defined where required | PASS |
| Shared Demo cannot trivially destroy environment | PASS |
| Demo disclosure present | PASS |
| Unsupported commercial claims absent | PASS |

### Reproducibility

| Item | Status |
| --- | --- |
| Clean staged-source export succeeds | PASS |
| Clean checkout of release commit succeeds | PASS |
| Frontend npm ci succeeds | PASS |
| Frontend lint succeeds | PASS |
| Frontend tests succeed | PASS |
| Frontend build succeeds | PASS |
| Backend npm ci succeeds | PASS |
| Backend tests succeed | PASS |
| Backend startup succeeds | PASS |
| Health endpoint succeeds | PASS |
| Critical API path succeeds | PASS |

### CI

| Item | Status |
| --- | --- |
| CI paths correct | PASS |
| Frontend CI passes | BLOCKED BY ENVIRONMENT |
| Backend CI passes | BLOCKED BY ENVIRONMENT |
| CI does not require production secrets | PASS |
| CI does not automatically deploy without approval | PASS |

### Deployment

| Item | Status |
| --- | --- |
| Deployment plan documented | PASS |
| Frontend environment documented | PASS |
| Backend environment documented | PASS |
| CORS configured | PASS |
| Persistence behavior documented | PASS |
| No localhost production dependency | PASS |

### Hosted - only if deployment approved

All hosted deployment, HTTPS, health, authentication, dashboard, vehicles, map, simulation, public policy and secret-leak checks: **NOT APPLICABLE**.

### Documentation

| Item | Status |
| --- | --- |
| WP13 repository topology | PASS |
| Credential rotation document | PASS |
| Public Demo policy | PASS |
| Clean checkout verification | PASS |
| Deployment plan | PASS |
| Release notes | PASS |
| WP13 release report | PASS |
| README current | PASS |

## Release Commit

- Commit: `ca0661690f0a36ca5b5597db7140426f7ff52853`
- Message: `release: prepare Fleet Drive AI Demo v1.0.0`
- Clean-checkout proof: PASS
- Push: not performed
- Tag: not created
- Deployment: not performed
