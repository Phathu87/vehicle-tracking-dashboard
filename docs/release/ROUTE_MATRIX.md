# Frontend Route Matrix

Verified against `src/routes/AppRoutes.jsx` and Chromium on 2026-09-23.

## Public and authentication

| Routes | Classification | Notes |
| --- | --- | --- |
| `/` | WORKING | Complete original design prototype-aligned landing page; API-derived public stats |
| `/features`, `/pricing`, `/mobile-apps`, `/changelog`, `/roadmap` | WORKING | Product information; commercial boundaries stated |
| `/solutions`, `/solutions/fleet-tracking`, `/solutions/driver-management`, `/solutions/maintenance`, `/solutions/geofencing`, `/solutions/reports` | WORKING | Informational pages |
| `/about`, `/careers`, `/blog`, `/contact`, `/partners` | WORKING | Informational; no fake form submission |
| `/documentation`, `/support`, `/api-reference`, `/status`, `/community` | WORKING | Informational |
| `/privacy`, `/terms`, `/cookies`, `/prototype` | WORKING | Legal and Demo disclosure |
| `/login`, `/register` | WORKING | Real Express authentication |
| `/forgot-password`, `/reset-password` | PLACEHOLDER | Truthfully unavailable; no email/provider flow |
| unmatched route | WORKING | Rendered application 404 |

## Protected application

| Route | Classification | Notes |
| --- | --- | --- |
| `/app`, `/app/dashboard` | WORKING | `/app` redirects; API-backed dashboard and Leaflet map |
| `/app/vehicles`, `/app/vehicles/:id` | WORKING | List, detail, telemetry/history and map |
| `/app/drivers`, `/app/drivers/:id` | WORKING | CRUD, licence and assignment data |
| `/app/maintenance` | WORKING | CRUD/completion and rule-based statuses |
| `/app/alerts` | WORKING | Read-only supported alert types |
| `/app/geofences` | WORKING | CRUD, circle/polygon and vehicle checks |
| `/app/routes` | WORKING | Demo nearest-neighbour route optimiser |
| `/app/reports` | WORKING | JSON maintenance/trip reports; export disabled |
| `/app/settings` | WORKING | Profile/session and local Demo preferences |
| `/app/analytics`, `/app/fuel`, `/app/users` | FUTURE COMMERCIAL | Explicit Coming Soon screens |

Protected direct navigation redirects to login when signed out. Registration redirect, authenticated refresh, logout and post-logout protection were browser/test verified. Netlify SPA fallback is configured; deployed refresh remains unvalidated until deployment.
