# WP7 Operational Dashboard

## Outcome

The Fleet Drive AI Demo dashboard now uses the original design prototype visual direction with a
real Express data path. Vehicle data is fetched through the central API client
and React Query, normalized once, and then used to derive every supported KPI
and widget. The dashboard refreshes the vehicle response every 30 seconds.

## Implemented dashboard areas

- Responsive sidebar and header with authenticated user profile.
- API-derived KPI row.
- Leaflet live-tracking map using South African Demo coordinates.
- Rule-derived recent alerts.
- Recent vehicle table.
- Speed distribution.
- Today's performance snapshot.
- Distance-over-time state.
- Maintenance overview state.
- Fuel-consumption state.
- Top-driver activity ranking.
- Quick-action navigation.

## Data mapping

| Dashboard value | Source | Classification |
| --- | --- | --- |
| Total vehicles | Length of `GET /api/vehicles` response | Real Demo function |
| Online vehicles | API status values normalized to online/moving/active | Real Demo function |
| Drivers | Unique non-empty driver names in vehicle records | Derived Demo value |
| Locations | Unique city/area/province labels in vehicle records | Derived Demo value |
| Average speed | Mean of current API speed values | Derived Demo value |
| Alerts | Overspeed rule at 75 km/h; optional low-fuel and service rules when fields exist | Derived Demo value |
| Recent vehicles | API records sorted by `lastSeen` | Real Demo function |
| Speed distribution | Current API speeds grouped into four bands | Derived Demo value |
| Top drivers | Unique driver assignments ranked by active vehicle count | Demo ranking |
| Map markers | API latitude and longitude values | Simulated data |

## Leaflet implementation

The dashboard replaces its separate Three.js fixture with a refactored version
of the proven legacy React Leaflet approach. It uses OpenStreetMap tiles,
responsive bounds, colored circle markers, popups, selected-vehicle focus, and
mobile and desktop vehicle selectors. Default map framing covers South Africa.

## Backend gaps

The current vehicle response does not provide fuel-consumption history,
mileage/service intervals, or usable position history. Those widgets render
explicit `BACKEND GAP` empty states and do not fabricate chart values.

The Express backend also has no current driver or alert collection endpoint.
Driver summaries and overspeed alerts are therefore derived from vehicle
records and labelled accordingly. Header maintenance notifications still use
the existing simulated maintenance fixture and are labelled as Demo indicators.

Several quick-action destinations remain planned module surfaces. They navigate
to the existing labelled pages and do not claim that their backend operations
are available.

## Loading, empty, and error behavior

- Initial API loading uses a dashboard-shaped skeleton.
- Failed API requests show the standardized API message and a working retry
  control.
- An empty vehicle array shows a dedicated source-data empty state.
- Widgets with optional fields render their own honest empty state.
- The map renders a no-location state if the API contains no valid coordinates.
- Alerts and driver ranking include valid zero-result states.

## Verification

- Direct API/model smoke test: 350 vehicles, 350 online, 25 unique drivers,
  40 current rule-based alerts, and 14 locations in the active backend snapshot.
- Empty model input verified as zero vehicles without an exception.
- Leaflet rendered 350 markers and OpenStreetMap tiles; a marker popup opened.
- Dashboard canvas and map widths were checked at 375, 430, 768, 1024, 1440,
  and 1920 pixels with no horizontal overflow.
- Mobile sidebar open and close behavior was verified.
- Frontend lint and production build were run after implementation.

## original design prototype visual alignment correction

The authenticated application shell and dashboard were tightened to match the
approved original design prototype reference more closely: compact dark navigation, a 52-pixel
header, six dense KPI tiles on wide screens, a two-to-one tracking and alerts
layout, and the selected-driver map overlay. The map uses keyless
OpenStreetMap tiles with a scoped dark treatment, so it does not display a
third-party API-key watermark. This correction is limited to authenticated
dashboard code; the public landing page was preserved.
