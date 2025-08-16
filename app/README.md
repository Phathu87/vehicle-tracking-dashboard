# Vehicle Tracking Dashboard 

React + Leaflet dashboard with a mock Express API. Features:
- Map + list, click row to zoom
- Auto-refresh every 30s
- Filter by Vehicle ID
- Historical route (last hour)
- KPI cards, loading/error states
- Dark, responsive UI

## Quick Start

### (1) API
cd server
npm i
npm start
# -> http://localhost:5000/api

### (2) Frontend
cd app
npm i
npm run dev
# -> http://localhost:3000

### If your API URL differs, create app/.env (or set env when running):
VITE_API_URL=http://localhost:5000/api

### Endpoints

1. GET /api/vehicles – list with latest lat/lng/speed/status/lastSeen
2. GET /api/vehicles/:id – single vehicle
3. GET /api/vehicles/:id/history – last hour of points for route

### Notes

1. Auto-refresh interval in src/App.jsx (REFRESH_MS).
2. Tiles: OpenStreetMap (no API key required).
3. To add clustering: use react-leaflet-cluster.

## Mockup image (for reference)

[The mockup image](src/assets/vehicle-dashboard-mockup.png)

---

## Run it

### in one terminal
cd vehicle-tracking-dashboard/server && npm i && npm start
### in another
cd vehicle-tracking-dashboard/app && npm i && npm run dev