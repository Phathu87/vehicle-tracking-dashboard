# Dependency Advisory Review

Date: 2026-09-25

## Result

- Backend production audit: **PASS**, 0 advisories.
- Frontend before remediation: 9 advisories: 2 high, 6 moderate, 1 low.
- Frontend full and production-only audits after remediation: 2 moderate advisories, both in React Router 6.
- No critical or high advisory remains.

## Remediation

Unused direct dependencies `react-quill`, `jspdf`, and `html2canvas` were removed. Safe lockfile updates resolved vulnerable `dompurify`, `fflate`, `nanoid`, `postcss`, `postcss-selector-parser`, and the React Router DOM 6.30.5-specific advisory.
Safe transitive updates also resolved later registry findings in development-only `@humanfs/node`, `brace-expansion`, `browserslist`, and `js-yaml`.

| Package/path | Initial severity | Exposure | Action |
| --- | --- | --- | --- |
| `postcss` / `nanoid` | High | Build tooling; no user-controlled CSS build input | Updated within compatible ranges; resolved |
| `dompurify`, `fflate` | Moderate | Transitive through unused PDF tooling | Unused parent dependencies removed; resolved |
| `quill` / `react-quill` | Moderate | Package was not imported | Removed; resolved |
| `postcss-selector-parser` | Low | Build tooling | Compatible update; resolved |
| `react-router-dom` / `react-router` | Moderate | Client-side SPA routing | Accepted Demo risk |

## Accepted Demo risk

The remaining advisories require React Router 7.18.4, a breaking major upgrade. One concerns SSR hydration, which this Vite client-side SPA does not use. The open-redirect class remains relevant in principle, but application navigation targets are fixed internal routes or validated local return paths. Migration is deferred as P2 and must be reassessed before a commercial production release.

`npm audit fix --force` was not used.
