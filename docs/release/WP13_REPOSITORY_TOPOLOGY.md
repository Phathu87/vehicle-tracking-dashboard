# WP13 Repository Topology

Date: 2026-09-23

## Forensic result

The only Git repository is `C:\Users\Admin\vehicle-tracking-dashboard\vehicle-tracking-dashboard`. The surrounding workspace is not a repository and contains the authoritative React frontend, documentation, CI, Postman collection and Netlify configuration. No second nested `.git` repository was identified.

```text
C:\Users\Admin\vehicle-tracking-dashboard\          WORKSPACE (not Git)
|-- src/                                               AUTHORITATIVE FRONTEND SOURCE
|-- docs/                                              AUTHORITATIVE DOCUMENTATION
|-- scripts/                                           RELEASE SCRIPTS
|-- .github/workflows/ci.yml                           CI
|-- package.json / package-lock.json                   FRONTEND DEPENDENCIES
|-- netlify.toml                                       FRONTEND DEPLOYMENT
|-- Fleet Drive AI Demo.postman_collection.json        OPERATIONAL POSTMAN
`-- vehicle-tracking-dashboard\                        GIT ROOT
    |-- .git/
    |-- app/                                           LEGACY REACT/LEAFLET PREDECESSOR
    `-- server/                                        AUTHORITATIVE EXPRESS BACKEND
```

## Findings

- Git root: `C:\Users\Admin\vehicle-tracking-dashboard\vehicle-tracking-dashboard`.
- Required source outside Git: current React frontend, docs, scripts, CI, Netlify config and Postman collection.
- Required untracked backend source: controllers, routes, services, middleware, tests and scripts, including all four WP11 files.
- Tracked dependency output: 3,391 `server/node_modules` files out of 3,431 tracked paths.
- Tracked secret-bearing legacy file: `app/.env` is deleted in the working tree but exists in history.
- Runtime SQLite files are local output and must remain ignored; `server/database.js` is JavaScript source and must be tracked.

## Selected release boundary

Keep the existing nested Git repository as the single authoritative release root. Normalize it to:

```text
vehicle-tracking-dashboard/                            AUTHORITATIVE GIT ROOT
|-- frontend/                                          CURRENT REACT/VITE APP
|-- server/                                            CURRENT EXPRESS/SQLITE BACKEND
|-- app/                                               LEGACY PREDECESSOR (REFERENCE ONLY)
|-- docs/
|-- scripts/
|-- .github/workflows/
|-- Fleet Drive AI Demo.postman_collection.json
|-- Vehicle Maintenance API v2.postman_collection.json
|-- netlify.toml
|-- .gitignore
`-- README.md
```

`frontend/` is used instead of replacing `app/` so historical source remains intact and the release source is unambiguous. The outer workspace remains untouched as a verification fallback until the normalized candidate passes.

## Required path adjustments

- CI frontend working directory becomes `frontend`.
- Netlify base becomes `frontend`; publish remains `dist` relative to that base.
- README and documentation commands use `frontend/` and `server/`.
- Backend source paths remain unchanged.

No topology change, commit, push, tag or history rewrite had occurred when this document was first created.
