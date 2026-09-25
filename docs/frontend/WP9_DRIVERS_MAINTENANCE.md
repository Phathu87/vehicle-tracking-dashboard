# WP9 - Drivers and Maintenance

## Outcome

Driver, vehicle-assignment, licence-expiry, and maintenance workflows now use
the Express API and persistent SQLite records. The React pages no longer import
driver or maintenance fixtures from `fleetData.js`.

## Drivers

Implemented routes:

- `GET /api/drivers`
- `POST /api/drivers`
- `GET /api/drivers/:id`
- `PUT /api/drivers/:id`
- `DELETE /api/drivers/:id`
- `PUT /api/drivers/:id/vehicles`

The list and detail screens show ID, name, licence number, calculated licence
status, expiry, renewal state, phone, email, assigned vehicles, and assigned
plates. Driver creation, editing, deletion, and vehicle assignment persist in
SQLite. Deletion is rejected while vehicles remain assigned.

Licence state is deterministic date logic:

- expired date: `expired` / `overdue`
- expiry within 60 days: `expiring` / `due_soon`
- later expiry: `valid` / `not_due`

Phone and email controls open the device handler. The Demo does not claim an
SMS or email was sent because no messaging provider is connected.

## Maintenance

Implemented routes:

- `GET /api/maintenance`
- `GET /api/vehicles/:id/maintenance`
- `POST /api/vehicles/:id/maintenance`
- `PUT /api/vehicles/:id/maintenance/:taskId`
- `POST /api/vehicles/:id/maintenance/:taskId/complete`
- `DELETE /api/vehicles/:id/maintenance/:taskId`

The maintenance screen separates overdue, due-soon, scheduled, and completed
history records. Add, edit, complete, and delete actions call the API and show
success only after the backend responds successfully.

Maintenance state is rule-based. It compares persisted vehicle mileage with a
task's due mileage, or the current date with a due date. It is not described as
machine-learning AI.

## Database migration

WP9 adds a `drivers` table and normalizes the legacy generator's conflicting
driver-ID/name combinations to one canonical name per driver ID. Vehicle
assignment writes update both the relational driver ID and display name in one
database transaction. Existing maintenance rows remain intact, while a small
completed service history is seeded once for a new Demo database. Database seed
markers prevent intentionally deleted records from reappearing after restart.

## Verification

- 19 backend tests passed.
- Driver CRUD, assignment, assignment validation, and assigned-driver deletion
  protection were tested with Supertest.
- Maintenance create, update, complete, aggregate history, and delete were
  tested with Supertest.
- A live HTTP verification completed the maintenance lifecycle against the
  file-backed database.
- Frontend ESLint passed.
- Frontend production build passed.

## Known limitations

- Driver assignments are vehicle-to-one-driver; no shift or assignment history
  model exists yet.
- Email and SMS providers are not connected.
- The repository-wide JavaScript typecheck currently reports pre-existing JSX
  inference errors in shared UI components. WP9 lint and production build pass.
