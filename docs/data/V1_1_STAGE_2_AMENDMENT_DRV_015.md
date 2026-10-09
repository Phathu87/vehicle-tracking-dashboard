# Fleet Drive AI Demo v1.1 Stage 2 Amendment - DRV-015

Status: controlled post-freeze amendment.

## Reason

Owner-approved fictional driver identity reconciliation before visual
integration. A portrait exists outside the application asset tree for the
fictional Demo identity `DRV-015 - Tshifhiwa Netshanda`; no portrait file is
integrated by this amendment.

## Before

| Field | Value |
| --- | --- |
| Driver ID | DRV-015 |
| Name | Tshilidzi Tshivhase |
| Licence number | SA-70001918 |
| Licence expiry | 2026-10-27 |
| Phone | +27 00 000 0015 |
| Email | driver-015@example.com |
| Active assigned vehicles | 14 |
| Current vehicle | NONE |
| Priority | C |
| Simulator participant | NO |

## After

| Field | Value |
| --- | --- |
| Driver ID | DRV-015 |
| Name | Tshifhiwa Netshanda |
| Licence number | SA-70001918 |
| Licence expiry | 2026-10-27 |
| Phone | +27 00 000 0015 |
| Email | driver-015@example.com |
| Active assigned vehicles | 14 |
| Current vehicle | VH-JO-114 |
| Priority | B |
| Simulator participant | NO |

## Assignment

DRV-015 already had valid authorised assignments in
`driver_vehicle_assignments`, so no new authorised assignment was created.

Selected current vehicle policy: choose the first existing DRV-015 authorised
vehicle by stable vehicle ID that does not alter the normal 15-vehicle
simulator participant set, only if the vehicle has no competing current driver.

| Vehicle ID | Registration | Year | Make | Model | Type | City | Province |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| VH-JO-114 | GP 7973 TB | 2024 | Hyundai | Elantra | SEDAN | Johannesburg | Gauteng |

## Counts

| Metric | Before | After |
| --- | ---: | ---: |
| Drivers | 25 | 25 |
| Unique driver IDs | 25 | 25 |
| Unique driver names | 25 | 25 |
| Active assignments | 349 | 349 |
| Current-operation rows | 20 | 21 |
| Simulator participants | 15 | 15 |

## Asset Status

The target portrait path is `public/assets/drivers/DRV-015.webp`.

Physical portrait status remains `NOT INTEGRATED` until Phase 3.2C. This
amendment does not convert, optimise, copy, or reference any physical portrait
file in the runtime application.
