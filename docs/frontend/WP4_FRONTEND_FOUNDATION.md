# Fleet Drive AI Demo - WP4 Frontend Foundation

Owner: Phathutshedzo Rakhunwana
Completed: 2026-09-21
Scope: Frontend architecture and shared runtime foundation only

## 1. Outcome

The workspace-root React application is now the implementation frontend for
Fleet Drive AI Demo. It retains the Base44 prototype's visual language while
removing Base44 SDK and Vite-plugin runtime coupling.

This package did not implement every product screen and did not change Express
behavior. Existing prototype pages remain available as design and interaction
references while later work packages connect them to real API data.

## 2. Source decisions

| Source | Use in WP4 |
| --- | --- |
| Base44 prototype | Primary source for color, typography, spacing, navigation, page composition, theme behavior, and existing UI primitives |
| Legacy React app | Reference for central API access, vehicle polling, Leaflet markers, marker/list selection, popups, and fly-to behavior |
| Current Express API | Runtime API authority and default local endpoint |
| WP3 API contract | Route, auth, response, and limitation authority |

The legacy Leaflet code was not copied into the dashboard yet. Its useful map
behavior is reserved for `src/components/maps/` when a later work package
connects maps to Express data. The broken history wiring and forced one-second
rerender were not reused.

## 3. Route architecture

Routes are centralised in `src/routes/AppRoutes.jsx` and lazy-load page modules.

| Layout/boundary | Routes | Current behavior |
| --- | --- | --- |
| `PublicLayout` | `/` | Hosts public pages without dashboard chrome |
| `AuthLayout` | `/login`, `/register`, `/forgot-password`, `/reset-password` | Hosts authentication and account-recovery pages |
| `AuthenticationBoundary` | `/app/*` | Loads session state and provides the future enforcement point |
| `DashboardLayout` | Dashboard and module routes | Shared header, responsive sidebar, mobile drawer, and scroll container |
| Not found | `*` | Backend-neutral 404 page |

The dashboard boundary is intentionally configured with `required={false}`.
Authentication endpoints are contract-only and the Demo must remain usable.
When Express auth is implemented and verified, changing the boundary to
`required={true}` enables redirects to `/login?returnTo=...` without restructuring
the route tree.

## 4. Layouts and responsive navigation

### PublicLayout

- Provides the public route boundary.
- Leaves the existing Base44-derived landing composition intact.

### AuthLayout

- Provides a separate route shell for account pages.
- `AuthPanel` is the reusable compact authentication panel.
- Login and registration preserve the Base44 visual direction but now submit to
  the Express contract rather than Base44 or a fake timer.
- Password recovery pages state that no authoritative endpoint exists and do not
  simulate a successful reset.

### DashboardLayout

- Preserves the Base44 sidebar/header composition.
- Uses a desktop collapse mode and a modal mobile drawer.
- Mobile navigation closes on route change, overlay click, or Escape.
- Body scrolling is locked while the drawer is open.
- Active navigation works for detail routes as well as exact module routes.
- Hard-coded alert badges, operational uptime claims, and the fictional admin
  identity were removed from the shell.
- Global search now routes to the vehicle screen and supplies its search query.

## 5. Design tokens and primitives

The Base44-derived HSL token set remains authoritative in `src/index.css`:

- background, card, popover, foreground, muted, border, and input
- primary, success, warning, danger, info, and chart colors
- light and dark themes
- heading, body, display, and monospace font families
- shared radius values
- sidebar colors

WP4 added layout tokens for header height, expanded/collapsed sidebar widths,
content width, and control height. Dashboard shell dimensions now consume those
tokens.

Reusable primitives now include:

- existing Radix-based controls under `src/components/ui/`
- `AppErrorBoundary`
- `LoadingState` and `PageLoadingState`
- `AsyncState`
- `PageHeader`
- `AuthPanel`

## 6. Component domains

The frontend now has explicit domains under `src/components/`:

```text
common/
landing/
authentication/
dashboard/
vehicles/
drivers/
maintenance/
alerts/
geofences/
reports/
maps/
ui/
```

Alerts, geofences, reports, and maps contain boundary notes rather than invented
components or data. They will receive implementation only when their connected
work packages begin.

## 7. Central API client

`src/api/client.js` is the single transport boundary.

- Reads `VITE_API_URL`.
- Defaults to `http://localhost:3001/api` for local development.
- Normalises trailing slashes and joins relative API paths consistently.
- Sends `Accept: application/json`.
- Serialises JSON request bodies and sets `Content-Type` when appropriate.
- Injects `Authorization: Bearer <token>` from local storage.
- Handles JSON, text, empty, and `204` responses.
- Throws a standard `ApiError` with `status`, `code`, `details`, and response
  `body`.
- Converts network failures to `NETWORK_ERROR`.
- Clears the local token and emits `fleet-drive:unauthorized` on `401`.

Domain API modules currently include `auth.js` and `vehicles.js`. Vehicle list,
detail, and history functions follow the WP3 paths, but existing pages were not
all connected in this foundation package.

## 8. Authentication foundation

`AuthContext` is backend-neutral and provides:

- session states: `checking`, `authenticated`, and `guest`
- login and registration through the central API client
- current-user lookup when a token already exists
- JWT storage and removal
- cross-application `401` handling
- logout and route-boundary state

No hard-coded JWT, Base44 token, OAuth provider, or simulated registration
success remains in the active authentication flow. Public registration sends
only `name`, `username`, and `password`; it cannot request an administrator role.

## 9. Base44 dependency boundary

Removed from the active frontend runtime:

- `@base44/sdk`
- `@base44/vite-plugin`
- Base44 client construction
- Base44 public-settings bootstrap
- Base44 login, registration-adjacent, reset, user-update, and logout calls
- Base44-specific Vite instrumentation

`vite.config.js` now uses the React plugin and an explicit `@` alias only.
Base44-hosted design images still appear in the supplied prototype UI; these are
visual assets, not backend/API dependencies. Localising those assets is deferred.

## 10. Configuration

Root `.env.example` contains the variable name only:

```text
VITE_API_URL=
```

The README documents the local value without committing runtime configuration.
Existing ignore rules exclude `.env` and `.env.local`.

## 11. Verification

Executed from the workspace root:

| Check | Result |
| --- | --- |
| `npm run lint` | PASS, exit code 0 |
| `npm run build` | PASS, 2,768 modules transformed |

The Vite build required the established elevated Windows execution path because
restricted esbuild access failed with `Cannot read directory "..": Access is
denied`. The completed production build emitted route-level chunks successfully.

Build warning:

- The lazy-loaded dashboard chunk is approximately 538 kB minified because it
  still includes the existing Three.js map and dashboard visualisations. This is
  not a build failure. Map replacement/code splitting should be evaluated when
  the connected map work begins.

## 12. Deferred work and limitations

- Existing dashboard, vehicle, driver, maintenance, chart, and map content still
  uses Base44 prototype data. WP4 deliberately did not connect every screen.
- Express currently supports only `GET /api/vehicles`; login and registration
  will return a standard API error until WP3 contract routes are implemented.
- Dashboard access remains optional-auth Demo access until backend auth exists.
- Password reset has no API contract and is explicitly unavailable.
- The existing Three.js dashboard map remains in place. Legacy Leaflet mechanics
  are the preferred reference for a later Express-backed implementation.
- Alerts, geofences, and reports remain unimplemented modules and do not fabricate
  responses.
- Base44-hosted image URLs should eventually be localised if the Demo must operate
  without that asset host.
- No frontend test runner exists. This package used the required lint and
  production-build verification only.
