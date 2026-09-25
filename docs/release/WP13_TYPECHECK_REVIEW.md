# WP13 Typecheck Review

Date: 2026-09-23

`npm run typecheck` remains non-blocking P2 debt. The clean candidate reports 168 errors across 32 JavaScript/JSX files after the low-risk Vite environment declaration adjustment.

Primary classes:

- JavaScript inference limitations around untyped `forwardRef` UI primitives and polymorphic `asChild` props.
- React Leaflet declaration/inference mismatches in map components.
- Tuple inference in icon/content arrays.
- Untyped React Query mutation parameters and API option objects.
- A tooling configuration gap for `import.meta.env`, addressed by adding `vite/client` types.

Lint, unit tests and the production build remain the release gates. Resolving the remaining errors safely requires incremental JSDoc/type work or a separately approved TypeScript programme; the application was not migrated in WP13.
