# WP13 Repository Topology

Date: 2026-09-25

## Corrected forensic result

The repository had been initialized one directory too deep at `C:\Users\Admin\vehicle-tracking-dashboard\vehicle-tracking-dashboard`. That made the old container appear to be the product root while the intended React application and its root configuration lived outside Git.

The Git metadata and release source have now been consolidated at `C:\Users\Admin\vehicle-tracking-dashboard`. The configured GitHub remote and existing commit history were preserved.

```text
C:\Users\Admin\vehicle-tracking-dashboard\          AUTHORITATIVE GIT ROOT
|-- .git/
|-- src/                                               CURRENT REACT/VITE APP
|-- public/
|-- server/                                            CURRENT EXPRESS/SQLITE BACKEND
|-- legacy/                                            LEGACY PREDECESSOR (REFERENCE ONLY)
|-- docs/
|-- scripts/
|-- .github/workflows/
|-- Fleet Drive AI Demo.postman_collection.json
|-- Vehicle Maintenance API v2.postman_collection.json
|-- package.json / package-lock.json
|-- netlify.toml
`-- README.md
```

## Findings

- Git root: `C:\Users\Admin\vehicle-tracking-dashboard`.
- Current frontend source: root `src/` and `public/`.
- Current backend source: `server/`.
- Legacy frontend source: `legacy/`, retained for implementation reference only.
- Local recovery copies: `.topology-recovery/`, ignored by Git.
- Release-proof workspaces: `.wp13-*/`, ignored by Git.
- Dependency output, environment files and runtime SQLite files remain ignored.

## Selected release boundary

Use the outer project directory as the single authoritative release root:

```text
vehicle-tracking-dashboard/                            AUTHORITATIVE GIT ROOT
|-- src/                                               CURRENT REACT/VITE APP
|-- public/
|-- server/                                            CURRENT EXPRESS/SQLITE BACKEND
|-- legacy/                                            LEGACY PREDECESSOR (REFERENCE ONLY)
|-- docs/
|-- scripts/
|-- .github/workflows/
|-- Fleet Drive AI Demo.postman_collection.json
|-- Vehicle Maintenance API v2.postman_collection.json
|-- netlify.toml
|-- .gitignore
`-- README.md
```

The former nested repository and design-reference metadata are preserved locally under `.topology-recovery/`. They are not release inputs and are excluded from Git.

## Required path adjustments

- CI runs frontend commands from the repository root.
- Netlify builds from the repository root and publishes `dist`.
- README and documentation commands use the repository root for frontend tasks and `server/` for backend tasks.
- Backend source paths remain unchanged.

The consolidation preserves history and does not rewrite commits. It is recorded in a dedicated topology correction commit; pushing remains a separate owner-directed action.
