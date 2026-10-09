# Driver Vehicle Live Card Contract

Status: design contract only. No endpoint is implemented by this document.

Phase 3.3E current asset authority: docs/assets/V1_1_PRIORITY_A_2D_ASSET_FREEZE.md.
Priority A portraits and vehicle images are both 15/15 AVAILABLE. Vehicle-image
frontend integration and all 3D acquisition remain NOT YET IMPLEMENTED / ACQUIRED.
Example payloads below remain illustrative shapes, not canonical fleet records.

## Proposed Response

```json
{
  "driver": {
    "id": "DRV-001",
    "name": "Example Driver",
    "photo": null,
    "licenseStatus": "valid"
  },
  "vehicle": {
    "id": "VH-JO-100",
    "year": 2024,
    "make": "Toyota",
    "model": "Corolla",
    "variant": null,
    "registration": "GP 1234 AB",
    "image": null,
    "model3d": null,
    "visualExactness": null
  },
  "assignment": {
    "current": false,
    "assignedVehicleIds": []
  },
  "location": {
    "lat": -26.103,
    "lng": 28.056,
    "heading": 143,
    "road": null,
    "area": null,
    "city": "Johannesburg",
    "province": "Gauteng"
  },
  "telemetry": {
    "speed": 61,
    "heading": 143,
    "timestamp": "2026-09-25T12:00:00.000Z"
  }
}
```

Example values describe shape only and are not fleet records.

## Property Classification

| Property | Classification | Current source / limitation |
| --- | --- | --- |
| `driver.id` | ALREADY AVAILABLE | `drivers.id`; returned by driver APIs. |
| `driver.name` | ALREADY AVAILABLE | `drivers.name`; display names are not unique. |
| `driver.photo` | AVAILABLE FOR PRIORITY A | Resolve by driver ID through the existing portrait registry and driver manifest; Priority A 15/15 AVAILABLE, Priority B/C partial. |
| `driver.licenseStatus` | DERIVABLE | Driver service derives `licenceStatus` from `licence_expiry`; contract spelling requires mapping. |
| `vehicle.id` | ALREADY AVAILABLE | `vehicles.id`. |
| `vehicle.year` | ALREADY AVAILABLE | `vehicles.year`; populated for the current snapshot. |
| `vehicle.make` | ALREADY AVAILABLE | `vehicles.make`. |
| `vehicle.model` | ALREADY AVAILABLE | `vehicles.model`. |
| `vehicle.variant` | ALREADY AVAILABLE, UNKNOWN VALUE | Canonical variant is null; do not infer trim from generated images. |
| `vehicle.registration` | DERIVABLE | Existing API field is `plate`; contract requires a name mapping only. |
| `vehicle.image` | PRIORITY A ASSET AVAILABLE; UI INTEGRATION PENDING | Resolve the canonical visualKey against the verified acquisition manifest and Phase 3.3E frozen mapping; 15/15 AVAILABLE. The original vehicle inventory is a historical planning snapshot. |
| `vehicle.model3d` | VISUAL ASSET REQUIRED | Resolve through the vehicle manifest. The practical baseline is a vehicle-type fallback, not an exact digital twin. |
| `vehicle.visualExactness` | MANIFEST-DERIVED | Frozen Priority A vehicle images are GENERATED_REPRESENTATIVE. Do not use desired EXACT planning metadata as achieved exactness. |
| `assignment.current` | ALREADY AVAILABLE | Phase 2.4 persists explicit current operation in `driver_current_vehicles`. |
| `assignment.assignedVehicleIds` | ALREADY AVAILABLE | Driver detail derives the active authorisation set from `driver_vehicle_assignments`. |
| `location.lat` | ALREADY AVAILABLE | Driver `currentLocation` derives it from the explicit current vehicle's latest stored state. |
| `location.lng` | ALREADY AVAILABLE | Driver `currentLocation` derives it from the explicit current vehicle's latest stored state. |
| `location.heading` | ALREADY AVAILABLE | Latest stored movement heading from the explicit current vehicle; degrees relative to true north in `0 <= heading < 360`, or null. |
| `location.road` | EXTERNAL GEO SERVICE REQUIRED | No road field or road matching exists. |
| `location.area` | EXTERNAL GEO SERVICE REQUIRED | `vehicles.area` exists but all 350 values duplicate city and are not reliable suburb context. |
| `location.city` | ALREADY AVAILABLE | Explicit on vehicle rows; live correctness may later be checked by reverse geocoding. |
| `location.province` | ALREADY AVAILABLE | Explicit on vehicle rows. |
| `telemetry.speed` | ALREADY AVAILABLE | Stored on telemetry and current vehicle rows. |
| `telemetry.heading` | ALREADY AVAILABLE | Stored per telemetry point and on the latest vehicle projection. Valid incoming heading wins; otherwise the backend derives movement heading above the 3 metre tolerance, preserves the prior valid heading while stationary, or returns null. |
| `telemetry.timestamp` | DERIVABLE | Existing telemetry field is `recordedAt`; contract requires a name mapping. |

## Existing API Comparison

- `GET /api/drivers/:id` returns authorised vehicles, explicit `currentVehicle`, and derived `currentLocation`; portraits remain a separate static presentation concern resolved by driver ID.
- `GET /api/vehicles/:id` returns assigned drivers and explicit `currentDriver`, plus vehicle state, maintenance, and alerts.
- `GET /api/vehicles/:id/history` returns stored heading per point, including null for historical points without heading.
- Current operation is never derived from assignment order or `vehicles.driver_id`.

The dedicated card endpoint remains a future composition choice, but the
Phase 2.4 relationship and Phase 2.5 heading data needed to assemble it now exist.

## Future Asset Resolution

The Express API remains authoritative for driver identity, vehicle identity,
assignment, current operation, location and telemetry. Physical image and 3D
files remain a separate presentation concern and must not be fabricated as
backend data.

Future card composition should use these deterministic lookups:

| Card field | Manifest lookup | Planned local path |
| --- | --- | --- |
| `driver.photo` | Driver ID in `docs/assets/driver-asset-manifest.json` | `public/assets/drivers/<driverId>.webp` |
| `vehicle.image` | Verified canonical visualKey in the acquisition manifest and Phase 3.3E frozen mapping | `public/assets/vehicles/images/<visualKey>.webp` |
| `vehicle.model3d` | Exact, family, or vehicle-type record in the vehicle manifest | `public/assets/vehicles/models/<asset-key>.glb` |
| `vehicle.visualExactness` | Exactness metadata on the selected manifest asset | No physical file of its own |

A vehicle-type GLB must be presented as a representative vehicle-type asset.
It must never be described as an exact digital twin. Manifest status and
licensing metadata must be complete before a physical asset is treated as
available.
