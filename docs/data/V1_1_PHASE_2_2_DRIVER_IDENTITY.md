# Phase 2.2 - Driver Identity Normalisation

Date: 2026-09-28
Baseline: `31843f2928ec368d29fcb984fbd8ded9b811a527`
Status: Complete

## Previous problem and root cause

The previous vehicle generator assigned a stable driver ID from each vehicle's position within a city block, but selected the accompanying driver name independently with unseeded `Math.random()`. Database initialisation grouped vehicle rows by driver ID and used `MIN(driver_name)` as that driver's display name. Across 14 vehicle samples per ID, this lexicographic minimum repeatedly selected a small set of early-sorting names. The resulting database had 25 IDs but only five display names.

## Normalisation strategy

The approved existing deterministic roster is retained. It maps `DRV-001` through `DRV-025` to 25 distinct fictional full names and does not use web-sourced or real customer/employee data. Driver records now initialise directly from that roster rather than deriving identity from vehicle rows.

Existing databases receive the canonical name and Demo-safe contact values for each stable ID. Licence number and expiry are not overwritten during this normalisation, preserving the licence identity already associated with the driver ID.

## Contact-data policy

Emails use `driver-001@example.com` through `driver-025@example.com`. `example.com` is reserved for documentation and cannot become a customer-controlled contact domain.

Phone values use the deliberately non-routable pattern `+27 00 000 0001` through `+27 00 000 0025`. They remain display-compatible while making their Demo-only nature clear. No personal contact details are stored.

## Licence-data policy

Clean seeds deterministically generate one unique `SA-########` licence number and one expiry date for every stable driver ID. Existing licence numbers and expiries are preserved. Licence status and renewal state continue to be calculated from the stored expiry by the existing driver service.

## Determinism and integrity

Two independent clean SQLite initialisations compare these fields exactly:

- ID
- name
- email
- phone
- licence number
- licence expiry

Validation also requires 25 unique IDs, names, emails, phones and licence numbers, syntactically valid reserved-domain emails, no broken `vehicles.driver_id` references, and an unchanged driver API response shape.

## Relationship preservation

This phase changes only the identity behind each stable driver ID. It does not assign, unassign, reduce, select or randomise vehicle relationships. Assignment tables and current-vehicle semantics present in the preserved worktree were not designed or expanded here.

## Current-location semantics

The driver table has no city field. A vehicle relationship does not establish a driver's permanent city. Future operational location must be derived from the driver's current vehicle and that vehicle's latest telemetry in a later phase.

## UI and asset readiness

The existing frontend consumes the same driver fields and derives initials from the canonical full name. No driver image or portrait was sourced or generated. The driver asset manifests retain `PLACEHOLDER` image status and record the refreshed canonical names.

## Deferred work

- Assignment schema: Phase 2.3
- Current vehicle semantics: Phase 2.4
- Telemetry heading: Phase 2.5
- Simulator assignment integration: Phase 2.6
- Asset manifests and final sourcing readiness: Phase 2.7
