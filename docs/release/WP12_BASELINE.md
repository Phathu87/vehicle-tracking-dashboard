# WP12 Release Baseline

Captured 2026-09-23 before release hardening.

## Runtime and stack

| Item | Baseline |
| --- | --- |
| Git root | `vehicle-tracking-dashboard/vehicle-tracking-dashboard` only |
| Branch | `master` |
| Commit | `d597435c583b8486dd7f401e96020c7188f95c93` |
| Node | `v22.21.0` |
| npm | `11.18.0` |
| Frontend | React 18.2, Vite 6.4.3 |
| Backend | Express 5.1.0 |
| Storage | SQLite through Node's experimental `node:sqlite` API |
| Tests | Node test runner and Supertest; frontend Node unit tests |

## Repository topology finding

The authoritative React application, Postman collection and documentation are in the outer workspace, which has no `.git` directory. The nested legacy repository is the only Git root. The active Express source is inside that nested repository, but much of it is untracked. This prevents a clean, reproducible release from the current commit and is a P0 source-control blocker until the owner approves one canonical repository boundary.

## Working-tree classification

| Item | Classification | Finding |
| --- | --- | --- |
| `server/database.js` | WP11 REQUIRED | Active SQLite persistence; untracked |
| `server/services/demoFleetSimulator.js` | WP11 REQUIRED | Active simulator; untracked |
| `server/services/demoSimulationConfig.js` | WP11 REQUIRED | Active simulator configuration; untracked |
| `server/test/simulator.test.js` | WP11 REQUIRED | Active simulator tests; untracked |
| Other `server/controllers`, `routes`, `services`, `middleware`, tests | EARLIER WORK PACKAGE / WP12 REQUIRED | Active backend source; untracked |
| `server/data.js`, `server/server.js`, package files | EARLIER WORK PACKAGE | Tracked and modified |
| `server/node_modules/**` | DEPENDENCY OUTPUT | Historically tracked; heavily dirty; must be removed from tracking in an approved repository cleanup |
| `server/*.db*` | GENERATED OUTPUT | Runtime SQLite data; now ignored |
| outer `dist/`, `node_modules/` | GENERATED / DEPENDENCY OUTPUT | Ignored by outer rules but outside Git |
| `app/.env` | SECRET-BEARING LEGACY CONFIG | Tracked deletion in working tree; token remains in Git history, rotation required |

No files were staged, committed, pushed or moved during WP12.
