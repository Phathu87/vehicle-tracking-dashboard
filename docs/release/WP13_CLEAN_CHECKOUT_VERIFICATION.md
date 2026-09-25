# WP13 Clean Checkout Verification

Final verification: 2026-09-25
Release commit: `ca0661690f0a36ca5b5597db7140426f7ff52853`

This record is completed after cloning the release commit into a new directory with no reused `node_modules`, `dist`, runtime database or local `.env`. The checkout was not patched and no source files were copied from outside Git.

## Isolation

- Checked-out files: 293
- Pre-install `node_modules`: 0
- Pre-install `dist`: 0
- Local `.env`: 0
- Runtime database: 0

## Results

| Gate | Result |
| --- | --- |
| Frontend `npm ci` | PASS |
| Frontend lint | PASS |
| Frontend tests | PASS: 2 |
| Frontend production build | PASS: Vite 6.4.3, 2,825 modules |
| Backend `npm ci` | PASS: 105 packages, 0 advisories |
| Backend tests | PASS: 38 |
| Backend startup | PASS on isolated port 3016 |
| `GET /api/health` | PASS: `status=ok` |
| Registration/login/`me` | PASS |
| Vehicle, driver and maintenance reads | PASS |
| Simulation status | PASS, explicitly disabled for this run |
| Public vehicle deletion | PASS: rejected with 403 |
| Typecheck | NON-BLOCKING FAIL: 168 documented JavaScript inference/declaration errors |

The backend process was stopped after verification. The generated database and build output exist only in the disposable verification directory and are not part of the staged source.

## Limitation

Release commit plus the documented environment produces a working Fleet Drive AI Demo. Repository reproducibility P0 is **RESOLVED**.
