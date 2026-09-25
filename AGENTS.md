# AGENTS.md

## Project Context

Fleet Drive AI Demo is a user-owned React/Vite and Express/SQLite application.
Keep changes focused, preserve the current Fleet Drive visual language, and use
the real Express API as the backend authority.

Start with `README.md` for local setup, environment variables, and release
workflow.

## Key Paths

- `src/`: authoritative React frontend.
- `server/`: authoritative Express API and SQLite data model.
- `legacy/`: historical Vehicle Tracking Dashboard reference only.
- `docs/`: architecture, API, release, and work-package documentation.
- `scripts/`: repository validation and documentation utilities.

## Working Rules

- Do not replace Express or fabricate API responses.
- Keep simulated telemetry behind the Express API and persistent backend state.
- Do not expose secrets or commit runtime databases.
- Run frontend and backend checks before finishing code changes.
- Treat `legacy/` as reference material, not the active application.
