# Feature Status Matrix

| Feature | Status | Evidence / boundary |
| --- | --- | --- |
| Authentication | REAL DEMO FUNCTION | SQLite users, bcrypt, JWT, protected routes |
| Vehicles and CRUD | REAL DEMO FUNCTION | Express persistence and tested routes |
| Drivers and assignments | REAL DEMO FUNCTION | Express CRUD and assignment endpoint |
| Telemetry producer | SIMULATED DATA | Producer posts through authenticated Express API |
| Telemetry/history/status | REAL DEMO FUNCTION | Persisted and queried through API |
| Maps | REAL DEMO FUNCTION | Leaflet/OpenStreetMap with simulated positions |
| Maintenance | REAL DEMO FUNCTION | Persistent tasks and deterministic service rules |
| Alerts | REAL DEMO FUNCTION | Persisted supported rule alerts; read-only UI |
| Geofences | REAL DEMO FUNCTION | Circle/polygon CRUD and containment checks |
| Routing | DEMO-ONLY | Transparent nearest-neighbour straight-line algorithm |
| Reports | REAL DEMO FUNCTION | JSON maintenance/trip reports |
| Fuel level | SIMULATED DATA | Vehicle telemetry field |
| Fuel consumption | PARTIAL | No consumption history; widget states backend gap |
| Simulation | DEMO-ONLY | Environment-controlled deterministic fleet source |
| Analytics | NOT IMPLEMENTED | Labelled Coming Soon |
| User management | NOT IMPLEMENTED | Labelled Coming Soon; no admin API |
| Mobile applications | PLANNED COMMERCIAL | No published app |
| Production AI/ML | PLANNED COMMERCIAL | No trained model claim |
| Billing | PLANNED COMMERCIAL | Not present |
| GPS hardware | PLANNED COMMERCIAL | No production hardware integration |
