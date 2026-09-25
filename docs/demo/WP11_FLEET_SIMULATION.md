# WP11 Fleet Demo Simulation

## Purpose

Fleet Drive AI Demo does not claim production GPS or IoT hardware. Its optional
simulator acts as an external-style telematics producer so the real application
can demonstrate changing fleet activity without a second frontend data model.

## Architecture

```text
Demo fleet simulator
  -> authenticated POST /api/vehicles/:id/telemetry
  -> Express validation and transaction
  -> SQLite current vehicle state and telemetry history
  -> backend alert and geofence rules
  -> mileage-based maintenance evaluation
  -> existing GET APIs
  -> React and TanStack Query
```

The simulator imports no React code and does not write to SQLite. Future GPS
trackers, OEM APIs, mobile driver apps, MQTT consumers, webhooks, or telematics
providers can replace it by submitting the same telemetry contract.

## Lifecycle

`startDemoFleetSimulator()` starts one guarded loop, performs an initial tick,
and logs one concise startup message with the participant count. Repeated starts
reuse the current loop. `stopDemoFleetSimulator()` clears the timer and
`getDemoSimulationStatus()` reports safe runtime state. Its `active` flag is
true only while the loop is running without a current delivery error. Closing
the HTTP server stops the simulator.

The server reads configuration only after it is listening. Disabled simulation
does not create a timer. Enabled simulation without a token fails safely and
leaves Express running.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `DEMO_SIMULATION_ENABLED` | `false` | Exact opt-in switch |
| `DEMO_SIMULATION_INTERVAL_MS` | `10000` | Tick interval, safely bounded from 1 second to 1 hour |
| `DEMO_SIMULATION_VEHICLE_LIMIT` | `15` | Sorted eligible vehicle subset, bounded to 1-100 |
| `DEMO_SIMULATION_SPEED_MULTIPLIER` | `1` | Time compression applied to movement distance |
| `DEMO_SIMULATION_SEED` | `fleet-drive-demo` | Reproducible route and speed seed |
| `DEMO_SIMULATION_SCENARIO` | `NORMAL_FLEET` | `NORMAL_FLEET`, `ALERT_DEMO`, or `GEOFENCE_DEMO` |
| `DEMO_SIMULATION_TOKEN` | empty | JWT used for the real protected telemetry API |
| `TELEMETRY_OFFLINE_AFTER_MS` | `120000` | Age after which GET APIs derive `offline` |
| `TELEMETRY_HISTORY_RETENTION_POINTS` | `5000` | Maximum stored telemetry points per vehicle |
| `TELEMETRY_ALERT_COOLDOWN_MS` | `900000` | Per-vehicle/type rule-alert cooldown |

Invalid numeric values fall back to defaults. No simulator variable is a
production provider credential. The JWT is local runtime configuration and must
not be committed.

## Participating vehicles

The simulator reads the current `/api/vehicles` dataset and keeps only records
with valid coordinates. Selection is deterministic: vehicles are sorted by ID,
grouped by city, and selected round-robin across alphabetically sorted cities up
to the configured limit. This avoids a simple first-N slice concentrating the
Demo in one region when several regions are available. `GEOFENCE_DEMO`
prioritises Johannesburg so its named Demo boundary is exercised. Existing
coordinates, mileage, fuel, driver IDs, names, plates, make/model values, and
assignments are preserved.

## State and movement model

The internal operational cycle is deterministic: moving, idle, stopped, and an
offline window for a small subset. Backend terminology remains `moving`, `idle`,
and `offline`. Offline participants simply stop submitting telemetry; GET APIs
derive offline state from `lastSeen`.

Known Demo cities use fixed South African routes. Other valid locations use an
eight-point route deterministically generated from vehicle ID and seed. Movement
advances toward the next point based on speed and interval, then reverses at
route endpoints; it does not randomly teleport. Each in-memory vehicle state
tracks route index, direction, movement state, and last-update time. Idle and
stopped packets retain coordinates. The normal scenario uses plausible 38-77
km/h speeds.

## Controlled scenarios

- `NORMAL_FLEET` exercises moving, idle, stopped, and telemetry-absence offline
  states. Offline is derived by the existing `lastSeen` age rule.
- `ALERT_DEMO` periodically submits 88-98 km/h for the first participant. The
  telemetry service, rather than the simulator, creates the overspeed alert.
- `GEOFENCE_DEMO` prioritises a Johannesburg vehicle and follows a fixed route
  from outside the `Demo Johannesburg Operations Zone`, through the circle, and
  outside again. Existing telemetry processing creates one entry and one exit
  per crossing and does not repeat entry while the vehicle remains inside.

Maintenance remains rule-based. Simulated mileage flows through telemetry and
the existing threshold evaluation; the simulator never directly marks a task
due or complete. Prolonged-idle alert detection is not implemented by the
current backend, so WP11 does not claim an idle alert. Fuel-theft detection is a
future commercial feature, not part of this Demo simulator.

## Mileage and fuel

Mileage increases by haversine distance actually travelled and never decreases.
Fuel is the existing percentage convention, clamped to 0-100. It decreases
gradually with movement, very slowly while idling, and stays stable while
stopped. A stopped vehicle below 20 percent can receive a deterministic Demo
refuel up to 95 percent.

## Existing backend interactions

- Every accepted point enters the existing telemetry history table and updates
  vehicle position, speed, mileage, fuel, `lastSeen`, and derived status.
- Express alone applies overspeed and low-fuel rules. A cooldown prevents a
  persistent condition from producing an alert every interval.
- Existing circle and polygon geofence evaluation runs inside telemetry
  ingestion and creates entry/exit alerts only on state transitions.
- Maintenance status remains deterministic and is recalculated from persisted
  mileage/date thresholds. The simulator never toggles task state.
- Bad vehicle data or one rejected packet logs a concise warning and does not
  stop other participants or Express.

## Frontend refresh

The dashboard and vehicle list poll the existing vehicle API every 15 seconds.
Vehicle detail and alert screens already poll every 15 seconds; geofence and
maintenance views use 30-second intervals. A small authenticated-header status
reads `GET /api/demo/status` and displays either `Simulated telemetry active` or
`Demo data static`. The UI never calls simulated telemetry `Live GPS`.

## Running and disabling

1. Configure a stable local `JWT_SECRET`, then start Express with simulation
   disabled and register or log in.
2. Put the returned JWT in `DEMO_SIMULATION_TOKEN`.
3. Set `DEMO_SIMULATION_ENABLED=true` and restart Express with the same
   `JWT_SECRET` so the token remains valid.
4. Use `NORMAL_FLEET` for routine use, `ALERT_DEMO` for overspeed, or
   `GEOFENCE_DEMO` for controlled entry/exit transitions.
5. Set `DEMO_SIMULATION_ENABLED=false` and restart to disable it.

The standalone `npm run telemetry` command remains available for running the
same lifecycle-managed simulator as a separate process against an already
running API. It accepts the legacy `SIMULATOR_TOKEN` and `SIMULATOR_INTERVAL_MS`
names as compatibility fallbacks.

## Reset semantics

`resetDemoFleetSimulator()` clears only simulator-owned in-memory route states,
offline IDs, counters, last tick time, the deduplicated warning, and current
delivery error. It does not create another timer and does not change the active
configuration. On the next tick, route state is rebuilt deterministically from
the current API vehicle state and configured seed.

Reset does not delete or rewrite users, authentication, vehicles, drivers,
plates, make/model data, assignments, geofences, maintenance tasks, alerts,
telemetry history, SQLite configuration, or environment values. It also does
not rerun database seeding. The additive database seed only ensures that the
named Demo Johannesburg circle exists; existing geofences are preserved.

## Limitations and production boundary

- Demo routes are bounded geometric paths, not road-aware navigation.
- Offline state is based on telemetry age, not device connectivity diagnostics.
- SQLite retention is point-count based. Commercial Fleet Drive AI will require
  production-grade, time-series capable storage and retention policies.
- The simulator token expires like a normal Demo user session and must be
  refreshed manually.
- No HTTP start/stop/scenario mutation endpoints were added. They would require
  an administrative account-management and authorization policy first.
- No paid telematics, Google/Mapbox routing, ML model, fuel-theft detection,
  production hardware, or external notification provider is claimed.

External notification delivery: **NOT PRESENT IN CURRENT BACKEND**. A source
search found no Nodemailer, Twilio, Gmail, SMTP, SendGrid, Mailgun, SMS, or other
provider implementation or dependency. Simulation therefore cannot invoke or
spam an external delivery provider. In-app alert records remain real backend
records created by existing rules.

## Verification coverage

Focused tests cover disabled/default configuration, safe fallback values,
start/stop/reset/restart lifecycle, duplicate-start prevention, deterministic
and city-diverse selection, route metadata, moving and stationary coordinates,
monotonic mileage, bounded fuel, missing telemetry for offline participants,
API history persistence, dynamic offline status, stable driver/vehicle identity,
overspeed alerts, geofence entry and exit, no repeated entry while inside,
maintenance thresholds, reset preservation, and authenticated status reporting.
The test launcher uses per-worker in-memory SQLite so a running Demo simulator
cannot lock or mutate the test database.

## Files

Created:

- `server/services/demoSimulationConfig.js`
- `server/services/demoFleetSimulator.js`
- `server/controllers/demoController.js`
- `server/routes/demoRoutes.js`
- `server/test/simulator.test.js`
- `server/scripts/runTests.js`
- `src/api/demo.js`
- `docs/demo/WP11_FLEET_SIMULATION.md`

Modified:

- `server/app.js`, `server/server.js`, and `server/services/vehicleService.js`
- `server/scripts/telemetryProducer.js`, `server/package.json`, and
  `server/.env.example`
- `src/components/dashboard/DashboardHeader.jsx` and `src/pages/Dashboard.jsx`
- `README.md` and `docs/api/API_REFERENCE.md`

## Verification results

- `npm test` from the Express server: 28 tests passed, 0 failed. The launcher
  uses isolated per-worker in-memory SQLite.
- `npm run lint` from the frontend root: passed.
- `npm run build` from the frontend root: passed with Vite 6.4.3 and
  `NODE_OPTIONS=--max-old-space-size=4096`. A prior attempt without the explicit
  heap limit ended in a host-level Node out-of-memory error during transform.
- Disabled backend startup created no simulator timer.
- A live `ALERT_DEMO` run sampled one vehicle before and after multiple ticks:
  coordinates and `lastSeen` changed, mileage increased from `73487.200` to
  `73487.254` km, fuel moved from `60.00` to `59.99` percent, and history grew
  from 20 to 23 points.
- The live API returned `moving` status and persisted alert, geofence, and
  maintenance data. Focused integration tests independently verified overspeed,
  geofence entry/remain/exit transitions, and a mileage threshold becoming
  overdue through the real telemetry endpoint.
- Final backend startup uses `NORMAL_FLEET`, a 10-second interval, and 15
  participants. Its authenticated status reported `active: true`, 6 completed
  ticks, 90 accepted telemetry packets, and no delivery error at verification.
- A final isolated controlled run used the real HTTP API and in-memory SQLite.
  `ALERT_DEMO` completed 6 ticks and accepted 90 packets, producing one
  rule-generated overspeed alert. `GEOFENCE_DEMO` completed 20 ticks, accepted
  296 packets, and selected participants spanning 14 cities. The Johannesburg
  vehicle changed position and `lastSeen`; history grew from 6 to 32 points;
  mileage rose from 18000 to 18004.881 km; fuel remained valid at 23.08 percent;
  its plate, make/model, and driver were unchanged; and its mileage-based test
  task became overdue through existing maintenance processing. Named Demo-zone
  entry and exit alerts were persisted. The simulator then reported not running,
  and the backend emitted no repeated exception loop or log flood.
- Browser verification reached the authenticated login boundary, but the local
  in-app browser input channel timed out before form submission. Rendered marker
  motion and visual flicker are therefore not directly validated in this
  recovery. Source inspection confirms the dashboard refetches the vehicle API
  every 15 seconds, Leaflet markers read API `lat`/`lng`, and no frontend motion
  loop mutates vehicle coordinates.

Commands exercised included `npm test`, `npm run lint`, `npm run build`, backend
startup with simulation disabled and enabled, registration for a Demo JWT, and
authenticated GET requests for vehicles, vehicle detail, history, status,
alerts, geofences, maintenance reports, and `/api/demo/status`.

## Recovery audit

The interrupted WP11 delta affected `server/database.js`,
`server/services/demoFleetSimulator.js`,
`server/services/demoSimulationConfig.js`, and `server/test/simulator.test.js`.
The changes are complete, required by WP11, and safe within the documented Demo
boundary. Static syntax checks passed and no unfinished markers, missing exports,
route/controller mismatch, second loop, or destructive reset path was found.

The nested legacy repository tracks dependency output and has extensive changes
from earlier work packages. Recovery did not revert or normalise those unrelated
changes. WP11 source identification therefore uses the known interrupted-file
set and direct inspection rather than attributing the entire repository diff to
this recovery.
