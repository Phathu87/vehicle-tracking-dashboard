# Fleet Drive AI Demo - WP1 Repository Forensic Audit

Owner: Phathutshedzo Rakhunwana
Audit date: 2026-09-21
Scope: Read-only forensic audit of the supplied workspace. No application behavior was changed.

## 1. Executive Summary

All four requested sources are present in the workspace, but they are not peers in one application structure:

| Source | Location | Finding |
|---|---|---|
| A. original design prototype prototype | workspace root (`src/`, `design-prototype/`) | Primary design reference. Rich React UI, original design prototype authentication calls, and mostly static fleet data. |
| B. Legacy Vehicle Tracking Dashboard | `vehicle-tracking-dashboard/app/` | React + Leaflet predecessor. It has working list/map selection, client filtering, and 30-second polling, but several pages and controls are placeholders. |
| C. Current Express backend | `vehicle-tracking-dashboard/server/` | Functional backend source of truth. It currently exposes only `GET /api/vehicles`. |
| D. Vehicle Maintenance API v2 | `Vehicle Maintenance API v2.postman_collection.json` | Historical contract containing 27 requests across 25 unique method/route combinations. Most are not implemented by the current Express server. |

The main integration gap is substantial: the original design prototype UI does not consume the Express API, and the current Express backend implements only a generated vehicle list. The legacy frontend is the only frontend that calls a vehicle API, but it expects a history endpoint that the current server does not provide.

## 2. Relevant Repository Tree

Noise directories (`node_modules`, `dist`, `build`, `.git`) are excluded.

```text
vehicle-tracking-dashboard/
|-- AGENTS.md
|-- README.md
|-- package.json
|-- package-lock.json
|-- vite.config.js
|-- eslint.config.js
|-- jsconfig.json
|-- tailwind.config.js
|-- postcss.config.js
|-- components.json
|-- Vehicle Maintenance API v2.postman_collection.json
|-- design-prototype/
|   |-- config.jsonc
|   `-- entities/
|       `-- User.jsonc
|-- src/                                      # original design prototype prototype
|   |-- main.jsx
|   |-- App.jsx
|   |-- index.css
|   |-- api/
|   |   `-- design-prototypeClient.js
|   |-- hooks/
|   |   |-- use-mobile.jsx
|   |   `-- use-size.jsx
|   |-- lib/
|   |   |-- AuthContext.jsx
|   |   |-- ThemeContext.jsx
|   |   |-- app-params.js
|   |   |-- authReturnTo.js
|   |   |-- fleetData.js
|   |   |-- maintenanceAlerts.js
|   |   |-- maintenanceNotifications.js
|   |   |-- PageNotFound.jsx
|   |   |-- query-client.js
|   |   `-- utils.js
|   |-- pages/
|   |   |-- Landing.jsx
|   |   |-- Login.jsx
|   |   |-- Register.jsx
|   |   |-- ForgotPassword.jsx
|   |   |-- ResetPassword.jsx
|   |   |-- OAuthConsent.jsx
|   |   |-- Dashboard.jsx
|   |   |-- Vehicles.jsx
|   |   |-- VehicleDetail.jsx
|   |   |-- Drivers.jsx
|   |   |-- DriverDetail.jsx
|   |   |-- Maintenance.jsx
|   |   |-- Settings.jsx
|   |   `-- ComingSoon.jsx
|   `-- components/
|       |-- AuthLayout.jsx
|       |-- ProtectedRoute.jsx
|       |-- ScrollToTop.jsx
|       |-- UserNotRegisteredError.jsx
|       |-- dashboard/                       # layout, navigation, KPI, map, charts
|       |-- drivers/                         # cards, stats, charts, assignments
|       |-- landing/                         # marketing/prototype sections
|       |-- maintenance/                     # maintenance task cards
|       |-- vehicles/                        # cards, table, detail panels
|       `-- ui/                              # generated Radix-style primitives
`-- vehicle-tracking-dashboard/
    |-- README.md
    |-- app/                                 # Legacy React frontend
    |   |-- .env                             # ignored, contains API URL and Mapbox token
    |   |-- package.json
    |   |-- package-lock.json
    |   |-- vite.config.js
    |   |-- eslint.config.js
    |   |-- public/_redirects
    |   `-- src/
    |       |-- main.jsx
    |       |-- App.jsx
    |       |-- api.js
    |       |-- styles.css
    |       |-- index.css
    |       |-- assets/
    |       |-- components/
    |       |   |-- MapView.jsx
    |       |   |-- VehicleList.jsx
    |       |   |-- KpiCards.jsx
    |       |   |-- SearchFilter.jsx
    |       |   |-- Sidebar.jsx
    |       |   |-- TopbarCarousel.jsx
    |       |   |-- Loader.jsx
    |       |   |-- ErrorBanner.jsx
    |       |   `-- Footer.jsx
    |       `-- pages/
    |           |-- Dashboard.jsx
    |           |-- Vehicles.jsx
    |           |-- Drivers.jsx
    |           |-- Alerts.jsx
    |           |-- Reports.jsx
    |           `-- Settings.jsx
    `-- server/                              # Current Express backend
        |-- package.json
        |-- package-lock.json
        |-- server.js
        `-- data.js
```

There is no Git repository metadata available at the workspace root, so a source-control diff or tracked-secret check could not be performed.

## 3. Dependency and Tooling Inventory

Versions below are the installed versions after the requested `npm install`; manifests use compatible ranges unless noted.

| Capability | original design prototype prototype | Legacy frontend | Express backend |
|---|---|---|---|
| React | 18.3.1 | 19.1.1 | N/A |
| Vite | 6.4.3 | 7.1.2 | N/A |
| Express | N/A | N/A | 5.1.0 |
| Routing | `react-router-dom` 6.30.4 | `react-router-dom` 7.8.2 | Direct `app.get` only |
| Maps | `react-leaflet` 4.2.1 installed but unused; custom Three.js 0.171.0 map used | Leaflet 1.9.4 + `react-leaflet` 5.0.0; Mapbox packages installed but unused | Coordinates in generated data only |
| Styling | Tailwind CSS 3.4.19, PostCSS, Radix primitives, CSS variables | Hand-written global CSS; class names resembling Tailwind are used without Tailwind configured | N/A |
| Charts | Recharts 2.15.4 | None | None |
| Forms | `react-hook-form` 7.71.1 and Zod 3.25.76 installed; current auth forms mostly use local state | Native inputs only | No body parser and no request forms |
| Authentication | original design prototype SDK 0.8.48; email/password, Google, Microsoft, reset, current user, logout | None | None |
| HTTP/data | original design prototype SDK, generated original design prototype public-settings calls, TanStack Query installed | Axios 1.11.0 plus native `fetch` | Express, CORS, generated in-memory data; Axios imported but unused |
| UI/animation | Radix packages, Lucide, Framer Motion, Sonner/toast packages | React Icons; Swiper installed but unused | N/A |
| Test tooling | No test runner or tests | No test runner or tests | `npm test` is the default failing placeholder |
| Static checks | ESLint and `tsc` check-JS script | ESLint | None |

Backend dependency concerns:

- `nodemon`, `npm`, and `start` are production dependencies even though the server only needs Express and CORS at runtime.
- `axios` is imported by `data.js` but never used.
- Installing `npm` as an application dependency greatly expands the backend dependency tree and audit surface.

## 4. Legacy Vehicle Tracking Dashboard

### 4.1 Component Assessment

| Part | Current behavior | Classification | Recommended use |
|---|---|---|---|
| `MapView.jsx` Leaflet setup | OpenStreetMap tiles, default Leaflet marker asset fix, one marker per vehicle, popup details, click selection, `flyTo` | REUSE | Reuse the proven Leaflet mechanics and marker asset setup, adapted to the Fleet Drive data model. |
| Marker/list coordination | Clicking a row selects a vehicle; map flies to it and opens its popup | REUSE | Preserve this interaction in the Demo. |
| `VehicleList.jsx` | Scrollable vehicle table with selected-row state | REFACTOR | Reuse behavior, but align fields and design with original design prototype. |
| History loading | Polls `/vehicles/:id/history`, but stores history separately while `MapView` reads `v.history`; current server returns 404 | DISCARD | The current wiring is broken. Rebuild only the connection using a verified Express history endpoint when it exists. |
| Polyline rendering | Leaflet `Polyline` support exists, but uses each vehicle's embedded `history` array, currently empty | REFERENCE ONLY | Keep as a rendering reference, not as working history behavior. |
| Polling | Vehicle list and selected history poll every 30 seconds | REUSE | Useful orchestration pattern once the API supports changing telemetry/history. |
| One-second map tick | Forces a render every second without receiving new data | DISCARD | It adds work but no new state. |
| Vehicle ID filter | Live case-insensitive filter in `useMemo`; the visible Filter button has no handler | REFACTOR | Keep the filtering logic; remove or wire the inert command in a future implementation package. |
| KPI calculation | Total, online, and alert counts derive from vehicle data; average fuel is hard-coded to `7.3` | REFACTOR | Keep calculated counts. Replace hard-coded fuel with backend-derived data. |
| API client | Axios wrapper for list/history, with a hosted fallback URL | REFACTOR | Centralize all requests, normalize the base URL, and point the Demo to current Express. |
| Drivers page | Derives driver assignments and KPIs from vehicle API data | REUSE | The data-derived aggregation is useful; visual implementation needs original design prototype styling. |
| Reports page | Calculates totals, online/offline, average speed, and client filters from API data | REUSE | Useful data-derived KPI/filter logic. |
| Alerts page | Labels vehicles below 80 km/h as alerts while UI text says below 30 km/h; action buttons do nothing | DISCARD | The rule is contradictory and is fake alert behavior. |
| Settings page | Entirely hard-coded profile/security/settings state; buttons do nothing | DISCARD | Do not carry into the working Demo. |
| Responsive shell | Mobile drawer, overlay, horizontal KPI/navigation scrollers, 720/1100 px breakpoints | REFERENCE ONLY | Use only interaction ideas; CSS is duplicated and contains malformed declarations. |
| Sidebar/top carousel | Desktop sidebar and mobile navigation carousel | REFERENCE ONLY | original design prototype navigation is the design authority. |

### 4.2 Legacy Implementation Details

- Leaflet initialization is in both `main.jsx` and `MapView.jsx`; the default icon patch is duplicated.
- Map center defaults to Johannesburg at zoom 12; selection flies to zoom 14.
- Popup fields include vehicle ID, driver, make/model, plate, province, speed, status, and last-seen time.
- The vehicle list polls every 30 seconds from `App.jsx`.
- Selected vehicle history also polls every 30 seconds, but its result is not rendered.
- The top-level dashboard filter is vehicle-ID-only. Reports add city/status filtering.
- The legacy API default contains a trailing slash and appends another slash, producing an avoidable double slash.
- Several pages bypass `api.js` and call `fetch(import.meta.env.VITE_API_URL + '/vehicles')` directly. If the environment variable is absent, those page URLs become `undefined/vehicles` even though the dashboard has a hosted fallback.
- `Drivers.jsx` fixes the table width at `165vh`, which is not a reliable responsive strategy.
- `styles.css` duplicates large sections beginning with a second `:root` block and contains invalid declarations such as `margin: 10 40px`, `padding: 10 -20px`, `font: 20px`, and `scroll-behavior: touch`.

## 5. original design prototype Prototype Inventory

### 5.1 Pages and Navigation

Public pages:

- `/`: landing page.
- `/login`, `/register`, `/forgot-password`, `/reset-password`.
- OAuth consent code exists but is not registered as a route in `App.jsx`.

Application pages under `/app`:

- Dashboard, vehicles, vehicle detail, drivers, driver detail, maintenance, and settings have dedicated pages.
- Alerts, geofences, reports, analytics, fuel management, and user management route to `ComingSoon`.
- Desktop sidebar and mobile drawer share the same navigation component.
- Header includes global search, theme toggle, notifications, messages, user menu, and logout. Global search and messages are currently inert.

### 5.2 Components and Layouts

- `DashboardLayout`, `DashboardSidebar`, and `DashboardHeader` provide the primary authenticated-looking shell.
- Dashboard includes KPI cards, a custom Three.js map, recent vehicles, recent alerts, speed distribution, distance, fuel, maintenance, driver ranking, and quick actions.
- Vehicle views include responsive grid/table modes, search, status/make/maintenance filters, local bulk selection, local status changes, and local driver assignment.
- Detail views include route/activity timelines, driver/freight/maintenance panels, simulated alerts, assignments, contact history, and Recharts performance charts.
- Landing content includes hero, features, stats, process, testimonials, concept pricing, planned mobile apps, FAQ, and CTA sections.
- Styling uses Tailwind, CSS variables, responsive grid classes, a desktop breakpoint at `lg`, and dedicated mobile behavior.

### 5.3 Entities, Actions, Authentication, and Data

| Area | Evidence | Audit conclusion |
|---|---|---|
| original design prototype entities | Only `design-prototype/entities/User.jsonc`, defining `role` | There are no original design prototype Vehicle, Driver, Alert, Maintenance, Route, or Telemetry entities. |
| Fleet data | `src/lib/fleetData.js` exports static arrays and deterministic builders | SIMULATED DATA. It is frontend-local and bypasses Express. |
| Dashboard KPIs/charts | Most components declare their own constant arrays and values | DEMO-ONLY presentation; not derived from a shared backend state. |
| Vehicle bulk actions | Mutate page-local React state | DEMO-ONLY. Changes disappear on navigation/reload. |
| Maintenance alerts | Calculated from static mileage fields | REAL DEMO FUNCTION over SIMULATED DATA, but currently frontend-only. |
| Notification dismissal | Persists IDs in browser `localStorage` | REAL DEMO FUNCTION limited to one browser. |
| Login/reset/logout | Calls original design prototype SDK auth methods | Connected to original design prototype, not current Express. original design prototype is not authoritative for fleet backend behavior. |
| Registration | Validates locally, waits 900 ms, then navigates to dashboard | Fake UI functionality; must not be represented as account creation. |
| Settings preferences | Calls `design-prototype.auth.updateMe` | original design prototype-only user preference persistence. No Express support. |
| Live dashboard map | Three.js scene over CARTO raster tiles with static driver coordinates | Interactive DEMO-ONLY visualization using SIMULATED DATA. It is not Leaflet and not live telemetry. |
| Vehicle detail map/history | Stylized local rendering and deterministic history builders | SIMULATED DATA, not backend history. |
| Charts | Recharts over hard-coded arrays or deterministic driver builders | DEMO-ONLY. |
| Quick actions | Buttons have no action handlers | Fake UI functionality. |

Authentication caveat: `/app/*` routes are not wrapped by `ProtectedRoute`. With no original design prototype token, `AuthContext` marks the visitor unauthenticated but does not block the application routes. `design-prototypeClient.js` also sets `requiresAuth: false`.

### 5.4 Commercial Boundary Findings

The prototype includes disclaimers in several places, but also includes claims or UI that conflict with the Demo rules:

- `LandingFinalCTA` claims thousands of companies use Fleet Drive AI.
- Login claims enterprise-grade security and 24/7 support.
- The dashboard claims all systems are operational and recently checked.
- Static testimonials describe outcomes for named fictional operators.
- Pricing and app-store badges are visually presented, although nearby copy says they are illustrative/planned.
- Driver email domains and hero trust logos imply specific logistics/taxi customers.
- Dashboard and feature copy says real-time/live tracking, although no live data source is connected.

These are REFERENCE ONLY or FUTURE COMMERCIAL content. They must not be presented as current Demo facts.

## 6. Current Express Backend

### 6.1 Structure

The server has only two source files:

- `server.js`: creates Express, enables unrestricted CORS, registers one route, and listens.
- `data.js`: generates 350 vehicles at module load from 14 South African city records and 25 vehicles per city.

The requested `routes/`, `controllers/`, `services/`, `middleware/`, scheduler/job, and notification-service directories do not exist. There are no duplicate controllers or duplicate route modules because those layers are absent.

### 6.2 Actual Endpoint Inventory

| Method | Route | Authentication | Request body | Response/purpose |
|---|---|---|---|---|
| GET | `/api/vehicles` | None | None | Returns the in-memory array of 350 generated vehicle objects. |

No query filters are applied. No single-vehicle, telemetry, history, maintenance, driver, report, alert, geofence, route-optimization, or authentication endpoints are implemented.

### 6.3 Backend State and Simulation

- Vehicle data is generated once when the process starts using `Math.random`.
- Every vehicle is initialized as `Online` with random speed and empty `history`.
- Data is process-memory-only and is not updated after startup.
- There is no telemetry simulator loop, persistence, history recording, or scheduler.
- `axios` is imported but unused.
- Environment usage is limited to `PORT`; the default is `3001`.
- The legacy README says the server runs on `5000`, which is inconsistent with the implementation.
- There is no `express.json()`, authentication, authorization, validation, error middleware, logging middleware, or rate limiting.

## 7. Postman Collection Inventory

The collection variable `base_url` points to localhost port 5000. The shared `token` variable is empty, but most requests contain hard-coded bearer JWT values directly in request auth definitions. Those tokens were not executed.

| Method | Route | Auth in collection | Request body | Purpose |
|---|---|---|---|---|
| POST | `/api/auth/register` | None | username, password, name, role | Register user |
| POST | `/api/auth/login` | Bearer (unexpected for login) | username, password | Login and obtain/use auth token |
| GET | `/api/auth/me` | Bearer | None | Current user |
| GET | `/api/vehicles?city=...&status=...&speed_gt=...` | Bearer | None | List/filter vehicles |
| POST | `/api/vehicles` | Bearer | id, make, model, plate, city, province | Add vehicle |
| GET | `/api/vehicles/:id` | Bearer | None | Get vehicle |
| PUT | `/api/vehicles/:id` | Bearer | city, province example | Update vehicle |
| DELETE | `/api/vehicles/:id` | Bearer | None | Delete vehicle |
| POST | `/api/vehicles/:id/telemetry` | Bearer | lat, lng, speed, mileage, fuel | Record telemetry/history |
| GET | `/api/vehicles/:id/status` | Bearer | None | Current status |
| GET | `/api/vehicles/:id/maintenance` | Bearer | None | Vehicle maintenance tasks |
| POST | `/api/vehicles/:id/maintenance` | Bearer | type, due | Add maintenance task |
| POST | `/api/vehicles/:id/maintenance/complete` | Bearer | type, mileage | Complete maintenance task |
| DELETE | `/api/vehicles/:id/maintenance/:index` | Bearer | None | Delete maintenance task |
| GET | `/api/maintenance` | Bearer | None | Fleet maintenance status |
| POST | `/api/vehicles/:id/alerts` | Bearer | alertType (`overspeed` or `geofence`) | Trigger vehicle alert |
| POST | `/api/geofences` | Bearer | name, polygon coordinates, alertType | Create geofence |
| POST | `/api/routes/optimize` | Bearer | stops array | Optimize route |
| GET | `/api/maintenance/:vehicleId/report` | Bearer | None | Maintenance report |
| GET | `/api/reports/:vehicleId/trips` | Bearer | None | Trip report |
| GET | `/api/vehicles/:id/history?limit=100` | Bearer | None | Vehicle history |
| GET | `/api/drivers` | Bearer | None | List drivers |
| POST | `/api/drivers` | Bearer | id, name, license, contact, assignedVehicle | Add driver |
| GET | `/api/drivers/:id` | Bearer | None | Get driver |
| PUT | `/api/drivers/:id` | Bearer | No example body | Update driver |
| DELETE | `/api/drivers/:id` | Bearer | None | Delete driver |

The collection has 27 saved requests because alert and telemetry scenarios repeat existing method/route combinations with different bodies.

## 8. Matrix A - Postman vs Current Express

| Endpoint | Postman | Express | Match | Action |
|---|---|---|---|---|
| `POST /api/auth/register` | Yes | No | No | Verify product auth decision; do not port blindly. |
| `POST /api/auth/login` | Yes | No | No | Define authoritative Demo auth before implementation. |
| `GET /api/auth/me` | Yes | No | No | Same as above. |
| `GET /api/vehicles` | Bearer + query filters | Public raw list, ignores filters | Partial | Preserve existing route; document response and add verified filtering later without renaming. |
| `POST /api/vehicles` | Yes | No | No | Candidate backend extension. |
| `GET /api/vehicles/:id` | Yes | No | No | Candidate backend extension; also required by legacy README. |
| `PUT /api/vehicles/:id` | Yes | No | No | Candidate backend extension. |
| `DELETE /api/vehicles/:id` | Yes | No | No | Candidate backend extension with explicit authorization. |
| `POST /api/vehicles/:id/telemetry` | Yes | No | No | High-priority simulator ingestion boundary. |
| `GET /api/vehicles/:id/status` | Yes | No | No | Derive from backend telemetry state when implemented. |
| `GET /api/vehicles/:id/maintenance` | Yes | No | No | Candidate backend extension. |
| `POST /api/vehicles/:id/maintenance` | Yes | No | No | Candidate backend extension. |
| `POST /api/vehicles/:id/maintenance/complete` | Yes | No | No | Candidate backend extension. |
| `DELETE /api/vehicles/:id/maintenance/:index` | Yes | No | No | Re-evaluate index-based deletion before implementation. |
| `GET /api/maintenance` | Yes | No | No | High-value support for original design prototype maintenance UI. |
| `POST /api/vehicles/:id/alerts` | Yes | No | No | Prefer alerts derived from telemetry rules where possible. |
| `POST /api/geofences` | Yes | No | No | Planned after geometry/state model is defined. |
| `POST /api/routes/optimize` | Yes | No | No | FUTURE COMMERCIAL unless a real optimization engine is selected. |
| `GET /api/maintenance/:vehicleId/report` | Yes | No | No | Candidate after maintenance persistence exists. |
| `GET /api/reports/:vehicleId/trips` | Yes | No | No | Candidate after trip/history persistence exists. |
| `GET /api/vehicles/:id/history` | Yes | No | No | High priority; legacy client currently calls it and receives 404. |
| `GET /api/drivers` | Yes | No | No | Candidate backend extension. |
| `POST /api/drivers` | Yes | No | No | Candidate backend extension. |
| `GET /api/drivers/:id` | Yes | No | No | Candidate backend extension. |
| `PUT /api/drivers/:id` | Yes | No | No | Candidate backend extension. |
| `DELETE /api/drivers/:id` | Yes | No | No | Candidate backend extension with assignment rules. |

## 9. Matrix B - original design prototype vs Current Express

| UI Feature | original design prototype Source | Express Support | Classification | Action |
|---|---|---|---|---|
| Vehicle list | `Vehicles`, cards/table, `fleetData.js` | `GET /api/vehicles` | CONNECTABLE | Adapt field/status casing and connect to Express. |
| Vehicle search/filter | `Vehicles.jsx` | List contains needed fields; no server filters | CONNECTABLE | Start client-side or add verified query support later. |
| Vehicle detail | `VehicleDetail.jsx` | No single-vehicle route | BACKEND MISSING | Implement verified endpoint before connecting. |
| Live positions/map | `LiveMap.jsx` static drivers | Vehicle list has lat/lng, but no updates | CONNECTABLE | Use Express positions; add simulator/telemetry for movement. |
| Route history | Deterministic builders and detail timeline | No history route | BACKEND MISSING | Add backend history generated through telemetry. |
| Driver list/details | Static driver array and derived stats | None | BACKEND MISSING | Implement driver endpoints/state. |
| Maintenance thresholds | `maintenanceAlerts.js` | Mileage exists, but no maintenance API/state | CONNECTABLE | Move rule/state behind Express and calculate from backend values. |
| Maintenance tasks | `Maintenance.jsx` static due/completed data | None | BACKEND MISSING | Implement persistence before enabling actions. |
| Alerts | Hard-coded dashboard alerts and deterministic detail alerts | None | DEMO-ONLY | Replace with telemetry-derived backend alerts. |
| KPI cards | Hard-coded constants | Vehicle list only | DEMO-ONLY | Recalculate supported KPIs from API data; omit unsupported KPIs. |
| Charts/analytics | Hard-coded or deterministic arrays | None | DEMO-ONLY | Connect only after history/aggregate endpoints exist. |
| Bulk vehicle status/driver update | Page-local state | None | BACKEND MISSING | Do not present as persistent until APIs exist. |
| Freight/load details | Static nested vehicle data | None and absent from Postman | DEMO-ONLY | Keep sector-neutral; remove or explicitly label simulation. |
| Authentication | original design prototype SDK | None | BACKEND MISSING | Decide and document Demo auth architecture; Express remains authority for fleet data. |
| User preferences | original design prototype `auth.updateMe` | None | DEMO-ONLY | Keep separate from fleet backend or add explicit profile API later. |
| Notification dismissal | `localStorage` | None | DEMO-ONLY | Acceptable local Demo behavior if clearly scoped. |
| Geofences | ComingSoon | None | BACKEND MISSING | Historical Postman reference only; implement later if approved. |
| Reports | ComingSoon | None | BACKEND MISSING | Build only from real backend history/maintenance data. |
| Route optimization | No working UI | None | FUTURE COMMERCIAL | Do not fake; use a proven engine when product scope approves it. |
| Mobile apps | Landing planned-app section | None | FUTURE COMMERCIAL | Keep explicitly planned and remove store-like availability cues. |
| AI insights | Marketing copy only | None | FUTURE COMMERCIAL | Do not claim a production AI model. |
| Concept pricing/testimonials | Landing sections | N/A | DEMO-ONLY | Remove customer claims; label concept content or omit from core Demo. |

## 10. Function Classification

### REAL DEMO FUNCTION

- Express can start and return a generated vehicle list.
- Legacy dashboard can fetch, poll, filter, select, and map the list when configured to the working Express URL.
- original design prototype vehicle/driver filters, view toggles, theme switching, maintenance threshold calculation, and notification dismissal execute locally.
- original design prototype login/reset/settings calls are real original design prototype SDK operations when valid original design prototype configuration is supplied, but they are separate from Express fleet state.

### SIMULATED DATA

- All Express vehicle records are generated in memory at process start.
- original design prototype fleet vehicles, drivers, freight, history, activities, alerts, maintenance records, charts, and KPIs are static or deterministic frontend data.
- original design prototype maps use static coordinates and third-party raster tiles, not live devices.

### PLANNED COMMERCIAL FEATURE

- Production GPS hardware, true live tracking, route optimization, geofences, persisted trip history, advanced analytics, AI insights, mobile apps, SLAs/support commitments, and final pricing.

## 11. Risk Register

| Severity | Risk | Evidence and impact |
|---|---|---|
| Critical | Hard-coded JWTs in Postman | Multiple request auth entries contain full bearer JWTs. Treat as exposed even if expired; remove/rotate outside this audit and use collection variables. |
| High | Legacy `.env` contains a Mapbox token | The file is ignored by `.gitignore`, but exposure history cannot be checked because no Git metadata exists. The token is unused by current source. |
| High | original design prototype app routes are not protected | `/app/*` renders when no token is present; `ProtectedRoute.jsx` is unused and client config says `requiresAuth: false`. |
| High | Fake registration flow | Registration never calls a backend; it waits and navigates to the dashboard. |
| High | Backend/contract mismatch | 24 of 25 unique Postman endpoint combinations are absent; the only overlap is partial. |
| High | Legacy history is broken | The client calls an absent endpoint and does not pass fetched history into the map's actual data path. |
| High | Misleading commercial claims | Thousands of companies, 24/7 support, enterprise security, operational status, testimonials, app-store imagery, and live/AI wording exceed verified Demo evidence. |
| High | Dependency advisories | Production audit: original design prototype 10 issues (3 high); legacy 7 (1 critical, 4 high); server 23 (1 critical, 13 high). Direct affected packages include PostCSS/react-router-dom/react-quill, Axios/react-router-dom/Swiper, and backend Axios/npm. |
| Medium | Inert controls | original design prototype global search, messages, quick actions, dashboard “View all”, and several maintenance controls do nothing; legacy Filter/action/settings buttons also do nothing. |
| Medium | Hard-coded KPIs and charts | original design prototype dashboard values are not calculated from Express data; legacy average fuel is fixed at 7.3. |
| Medium | Environment inconsistency | README/Postman use port 5000; Express defaults to 3001. original design prototype build lacks required app ID/base URL. Legacy pages inconsistently use fallback vs required `VITE_API_URL`. |
| Medium | Open backend surface | Express has unrestricted CORS and no authentication, validation, rate limiting, or error middleware. |
| Medium | In-memory nondeterminism | Random startup data changes after every restart and has no telemetry loop/history persistence. |
| Medium | Typecheck is not usable | `npm run typecheck` reports hundreds of errors from Three.js and untyped JSX primitives despite `skipLibCheck`; it cannot currently serve as a quality gate. |
| Medium | Lint coverage is incomplete | original design prototype ESLint checks selected `components`/`pages` only and explicitly ignores `src/lib` and `src/components/ui`; `App.jsx`, API code, and core libraries are outside the main file set. |
| Low | Dead/unused code and dependencies | original design prototype has unused React Leaflet and other broad dependencies; legacy has unused Mapbox/Swiper; server has unused Axios and unnecessary runtime npm/start/nodemon packages. |
| Low | Duplicate/invalid CSS | Legacy `styles.css` repeats major blocks and contains malformed declarations; it still builds because CSS parsing is tolerant. |
| Low | Duplicate asset/initialization paths | Legacy contains similarly named dashboard images and repeats Leaflet icon setup. |
| Low | No automated tests | No frontend test tooling; backend test script intentionally fails. |

Broken imports: neither frontend build reported unresolved imports.
Duplicate routes/controllers: no duplicate Express routes were found; controller/route modules do not exist.
Circular dependencies: no source-level circular dependency was found by manual import inspection, but there is no dedicated cycle check in the repository.
Inconsistent naming: `FleetTrack`, `Vehicle Tracking Dashboard`, original design prototype's config name `untitled`, and Fleet Drive AI are all present; vehicle IDs use both `VH-*` and `VHC-*`; status casing differs (`Online` vs `online`).

## 12. Execution Results

| Package | Command | Result |
|---|---|---|
| original design prototype root | `npm install` | Passed; 628 packages added. Install audit reported 15 total issues including 6 high across all dependencies. |
| original design prototype root | `npm run build` | Passed after running outside the restricted filesystem sandbox. JS bundle is about 1.66 MB minified. |
| original design prototype root | `npm run lint` | Passed, subject to the limited lint scope described above. |
| original design prototype root | `npm run typecheck` | Failed with hundreds of check-JS errors, including Three.js source and JSX primitive prop typing. |
| Legacy app | `npm install` | Passed; deprecated `viewport-mercator-project` warning. Install audit reported 18 issues including 1 critical and 13 high across all dependencies. |
| Legacy app | `npm run build` | Passed. Warned about stale Browserslist data and an empty Tailwind content option from a transitive/config interaction. |
| Legacy app | `npm run lint` | Passed. |
| Express server | `npm install` | Passed. Install audit reported 23 issues including 1 critical and 13 high. |
| Express server | `npm start` | Passed; listening on port 3001. Server was stopped after probes. |
| Express probe | `GET http://localhost:3001/api/vehicles` | `200`, JSON, 350 vehicles; first ID `VH-JO-100`. |
| Express probe | `GET /api/vehicles/VH-JO-100/history` | `404`, confirming the legacy/history contract gap. |

No development server was left running.

## 13. Recommended Next Work Package Order

This audit does not implement these actions. The safest sequence is:

1. Establish and document the canonical Express API contract without deleting or renaming `GET /api/vehicles`.
2. Move simulation into a backend telemetry source and add backend state/history.
3. Connect the original design prototype-designed vehicle list/map/KPIs to Express incrementally.
4. Add driver, maintenance, alert, and history capabilities only against verified contracts.
5. Remove or clearly classify inert controls and unsupported commercial claims before presenting the Demo.
6. Add focused API and frontend integration tests, then address dependency advisories in a separate controlled package.

Audit stop point reached. No redesign, refactor, backend behavior change, UI-library installation, or TypeScript migration was performed.
