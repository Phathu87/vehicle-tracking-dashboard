// Simulated South African fleet data for the Fleet Drive AI prototype.
// This is demonstration data — not connected to live tracking hardware.

export const DRIVERS = [
  { id: 'DRV-001', name: 'Thabo M.', licence: 'GP12345678', licenceExpiry: '2027-06-14', phone: '+27 82 123 4567', email: 'thabo.m@swiftmove.co.za', score: 96, city: 'Johannesburg', lat: -26.107, lng: 28.056 },
  { id: 'DRV-002', name: 'Sarah J.', licence: 'GP98765432', licenceExpiry: '2026-11-02', phone: '+27 83 234 5678', email: 'sarah.j@citylogistics.co.za', score: 94, city: 'Pretoria', lat: -25.746, lng: 28.188 },
  { id: 'DRV-003', name: 'Michael R.', licence: 'GP44556677', licenceExpiry: '2027-03-21', phone: '+27 84 345 6789', email: 'michael.r@roadrunner.co.za', score: 91, city: 'Durban', lat: -29.858, lng: 31.021 },
  { id: 'DRV-004', name: 'Nomsa K.', licence: 'GP22334455', licenceExpiry: '2026-09-18', phone: '+27 76 456 7890', email: 'nomsa.k@safefleet.co.za', score: 89, city: 'Cape Town', lat: -33.925, lng: 18.424 },
  { id: 'DRV-005', name: 'David L.', licence: 'GP77889900', licenceExpiry: '2027-01-30', phone: '+27 81 567 8901', email: 'david.l@swiftmove.co.za', score: 87, city: 'Port Elizabeth', lat: -33.960, lng: 25.602 },
  { id: 'DRV-006', name: 'Lerato T.', licence: 'GP11223344', licenceExpiry: '2026-12-12', phone: '+27 82 678 9012', email: 'lerato.t@metrotaxi.co.za', score: 93, city: 'Thohoyandou', lat: -22.945, lng: 30.486 },
  { id: 'DRV-007', name: 'Sipho N.', licence: 'GP55667788', licenceExpiry: '2027-05-09', phone: '+27 83 789 0123', email: 'sipho.n@transafrica.co.za', score: 90, city: 'Nelspruit', lat: -25.475, lng: 30.970 },
  { id: 'DRV-008', name: 'Amanda V.', licence: 'GP99001122', licenceExpiry: '2026-10-25', phone: '+27 84 890 1234', email: 'amanda.v@citylogistics.co.za', score: 95, city: 'Polokwane', lat: -23.902, lng: 29.469 },
];

export const VEHICLES = [
  { id: 'VHC-001', plate: 'CY 123 GP', make: 'Toyota', model: 'Hilux', year: 2023, driverId: 'DRV-001', status: 'online', speed: 62, fuel: 78, mileage: 45230, lastServiceMileage: 30000, serviceInterval: 15000, area: 'Sandton', lastSeen: '1m ago', freight: { loadType: 'General Cargo', weightKg: 780, capacityKg: 1000, status: 'in_transit', destination: 'Sandton CBD', eta: '14:30' } },
  { id: 'VHC-002', plate: 'CY 456 GP', make: 'Ford', model: 'Ranger', year: 2022, driverId: 'DRV-002', status: 'moving', speed: 48, fuel: 65, mileage: 34500, lastServiceMileage: 20000, serviceInterval: 15000, area: 'Pretoria', lastSeen: '2m ago', freight: { loadType: 'Retail Stock', weightKg: 620, capacityKg: 950, status: 'loading', destination: 'Midrand Depot', eta: '16:00' } },
  { id: 'VHC-003', plate: 'CY 789 GP', make: 'Isuzu', model: 'D-Max', year: 2024, driverId: 'DRV-003', status: 'idle', speed: 0, fuel: 42, mileage: 22100, lastServiceMileage: 10000, serviceInterval: 15000, area: 'Durban', lastSeen: '5m ago', freight: { loadType: 'Refrigerated Produce', weightKg: 900, capacityKg: 1100, status: 'in_transit', destination: 'Rosebank', eta: '15:15' } },
  { id: 'VHC-004', plate: 'CY 012 GP', make: 'Volkswagen', model: 'Amarok', year: 2023, driverId: 'DRV-004', status: 'online', speed: 55, fuel: 88, mileage: 38900, lastServiceMileage: 25000, serviceInterval: 15000, area: 'Cape Town', lastSeen: '1m ago', freight: { loadType: 'Construction Materials', weightKg: 850, capacityKg: 1100, status: 'in_transit', destination: 'Fourways Mall', eta: '13:45' } },
  { id: 'VHC-005', plate: 'CY 345 GP', make: 'Mercedes-Benz', model: 'Sprinter', year: 2021, driverId: 'DRV-005', status: 'offline', speed: 0, fuel: 12, mileage: 51200, lastServiceMileage: 30000, serviceInterval: 15000, area: 'Port Elizabeth', lastSeen: '1h ago', freight: { loadType: 'Parcel Freight', weightKg: 1100, capacityKg: 1500, status: 'delayed', destination: 'Roodepoort', eta: '—' } },
  { id: 'VHC-006', plate: 'CY 678 GP', make: 'Toyota', model: 'Quantum', year: 2023, driverId: 'DRV-006', status: 'maintenance', speed: 0, fuel: 35, mileage: 48000, lastServiceMileage: 33000, serviceInterval: 15000, area: 'Thohoyandou', lastSeen: '2h ago', freight: { loadType: 'E-commerce Parcels', weightKg: 260, capacityKg: 800, status: 'loading', destination: 'Centurion', eta: '17:00' } },
  { id: 'VHC-007', plate: 'CY 901 GP', make: 'Hino', model: '300 Series', year: 2022, driverId: 'DRV-007', status: 'moving', speed: 72, fuel: 54, mileage: 41500, lastServiceMileage: 30000, serviceInterval: 15000, area: 'Nelspruit', lastSeen: '3m ago', freight: { loadType: 'Construction Materials', weightKg: 4200, capacityKg: 5000, status: 'in_transit', destination: 'Boksburg Industrial', eta: '12:40' } },
  { id: 'VHC-008', plate: 'CY 234 GP', make: 'Nissan', model: 'NP300', year: 2020, driverId: null, status: 'offline', speed: 0, fuel: 0, mileage: 62300, lastServiceMileage: 45000, serviceInterval: 15000, area: 'Kempton Park', lastSeen: '3h ago', freight: { loadType: 'General Cargo', weightKg: 0, capacityKg: 1200, status: 'delivered', destination: 'Kempton Park', eta: '10:20' } },
  { id: 'VHC-009', plate: 'CY 567 GP', make: 'Toyota', model: 'Hilux', year: 2024, driverId: 'DRV-001', status: 'online', speed: 44, fuel: 71, mileage: 12800, lastServiceMileage: 0, serviceInterval: 15000, area: 'Sandton', lastSeen: '1m ago', freight: { loadType: 'Agricultural Produce', weightKg: 700, capacityKg: 1000, status: 'in_transit', destination: 'Sandton', eta: '14:50' } },
  { id: 'VHC-010', plate: 'CY 890 GP', make: 'Ford', model: 'Transit', year: 2023, driverId: 'DRV-002', status: 'online', speed: 38, fuel: 60, mileage: 29400, lastServiceMileage: 15000, serviceInterval: 15000, area: 'Pretoria', lastSeen: '4m ago', freight: { loadType: 'Retail Stock', weightKg: 900, capacityKg: 1400, status: 'in_transit', destination: 'Midrand', eta: '15:40' } },
  { id: 'VHC-011', plate: 'CA 123 WP', make: 'Isuzu', model: 'F-Series', year: 2022, driverId: 'DRV-004', status: 'moving', speed: 58, fuel: 76, mileage: 36700, lastServiceMileage: 25000, serviceInterval: 15000, area: 'Cape Town', lastSeen: '2m ago', freight: { loadType: 'Steel & Hardware', weightKg: 6800, capacityKg: 8000, status: 'in_transit', destination: 'Cape Town', eta: '2 days' } },
  { id: 'VHC-012', plate: 'CY 456 GP', make: 'Volkswagen', model: 'Crafter', year: 2023, driverId: 'DRV-008', status: 'online', speed: 51, fuel: 83, mileage: 33100, lastServiceMileage: 22000, serviceInterval: 15000, area: 'Polokwane', lastSeen: '1m ago', freight: { loadType: 'Cold Chain Goods', weightKg: 1000, capacityKg: 1500, status: 'in_transit', destination: 'Randburg', eta: '13:10' } },
  { id: 'VHC-013', plate: 'CY 789 GP', make: 'Mercedes-Benz', model: 'Atego', year: 2021, driverId: 'DRV-007', status: 'critical', speed: 0, fuel: 8, mileage: 58000, lastServiceMileage: 45000, serviceInterval: 15000, area: 'Nelspruit', lastSeen: '8m ago', freight: { loadType: 'Mining Equipment', weightKg: 9200, capacityKg: 10000, status: 'delayed', destination: 'Soweto', eta: '—' } },
  { id: 'VHC-014', plate: 'CY 012 GP', make: 'Toyota', model: 'Hilux', year: 2024, driverId: 'DRV-006', status: 'online', speed: 66, fuel: 79, mileage: 9200, lastServiceMileage: 0, serviceInterval: 15000, area: 'Thohoyandou', lastSeen: '1m ago', freight: { loadType: 'Beverages', weightKg: 640, capacityKg: 1000, status: 'in_transit', destination: 'Benoni', eta: '16:30' } },
];

// Real-world coordinates for each vehicle's current area (South African cities).
export const AREA_COORDS = {
  Sandton: { lat: -26.107, lng: 28.056 },
  Pretoria: { lat: -25.746, lng: 28.188 },
  Durban: { lat: -29.858, lng: 31.021 },
  'Cape Town': { lat: -33.925, lng: 18.424 },
  'Port Elizabeth': { lat: -33.960, lng: 25.602 },
  Thohoyandou: { lat: -22.945, lng: 30.486 },
  Nelspruit: { lat: -25.475, lng: 30.970 },
  Polokwane: { lat: -23.902, lng: 29.469 },
  'Kempton Park': { lat: -26.100, lng: 28.230 },
};

export const getVehicle = (id) => VEHICLES.find(v => v.id === id);
export const getDriver = (id) => DRIVERS.find(d => d.id === id);

const ROUTE_AREAS = ['Sandton CBD', 'Midrand Depot', 'Rosebank', 'Fourways Mall', 'Randburg', 'Centurion', 'Roodepoort', 'Boksburg Industrial'];
const ROUTE_TIMES = ['06:30', '08:15', '10:40', '12:55', '14:20', '16:05'];
const ROUTE_EVENTS = ['Departed depot', 'Stopped for delivery', 'Route checkpoint', 'Stopped for delivery', 'Heading to destination', 'Reached destination'];

export function buildRouteHistory(v) {
  const seed = parseInt(v.id.replace(/\D/g, ''), 10) || 1;
  return ROUTE_TIMES.map((t, i) => ({
    time: t,
    location: ROUTE_AREAS[(seed + i) % ROUTE_AREAS.length],
    speed: 28 + ((seed * (i + 3)) % 45),
    event: ROUTE_EVENTS[i],
  }));
}

const ACTIVITY_TEMPLATES = [
  { event: 'Engine start', time: '06:28' },
  { event: 'Exited geofence — Depot', time: '06:42' },
  { event: 'Overspeed alert — 78 km/h', time: '09:15' },
  { event: 'Refuelled — 42 L', time: '11:30' },
  { event: 'Entered geofence — Sandton', time: '13:05' },
  { event: 'Idle detected — 18 min', time: '14:22' },
  { event: 'Route completed', time: '16:10' },
];

export function buildActivity(v) {
  const seed = parseInt(v.id.replace(/\D/g, ''), 10) || 1;
  const start = seed % 2;
  return ACTIVITY_TEMPLATES.slice(start, start + 5);
}

export function buildVehicleAlerts(v) {
  const seed = parseInt(v.id.replace(/\D/g, ''), 10) || 1;
  const alerts = [];
  if (v.fuel < 20) alerts.push({ type: 'Low Fuel', time: `${seed * 3}m ago`, sev: 'critical' });
  alerts.push({ type: 'Overspeed', time: `${seed * 4}m ago`, sev: 'warning' });
  alerts.push({ type: 'Geofence Exit', time: `${seed * 7}m ago`, sev: 'info' });
  return alerts.slice(0, 3);
}

// --- Drivers ---

export const getAssignedVehicles = (driverId) => VEHICLES.filter(v => v.driverId === driverId);

export function buildDriverStats(driver) {
  const seed = parseInt(driver.id.replace(/\D/g, ''), 10) || 1;
  return {
    trips: 12 + (seed % 40),
    totalDistance: 200 + (seed * 37) % 600,
    alerts: 1 + (seed % 6),
    avgSpeed: 42 + (seed % 18),
    efficiency: driver.score,
    onTimeRate: 88 + (seed % 11),
    assignedCount: getAssignedVehicles(driver.id).length,
  };
}

const CONTACT_TEMPLATES = [
  { type: 'call', note: 'Daily check-in call', time: 'Today 07:15' },
  { type: 'message', note: 'Route update sent via SMS', time: 'Yesterday 16:40' },
  { type: 'email', note: 'Payslip emailed', time: '2 days ago' },
  { type: 'call', note: 'Missed call — no answer', time: '3 days ago' },
  { type: 'message', note: 'Maintenance reminder sent', time: '4 days ago' },
  { type: 'email', note: 'Performance review invitation', time: '6 days ago' },
];

export function buildContactHistory(driver) {
  const seed = parseInt(driver.id.replace(/\D/g, ''), 10) || 1;
  const start = seed % 2;
  return CONTACT_TEMPLATES.slice(start, start + 4);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export function buildDriverMonthly(driver) {
  const seed = parseInt(driver.id.replace(/\D/g, ''), 10) || 1;
  const base = driver.score;
  return MONTHS.map((m, i) => {
    const wobble = (seed * (i + 1)) % 9 - 4;
    const fuel = Math.max(4, Math.min(12, 7 + wobble));
    const speed = Math.max(70, Math.min(100, base + wobble));
    const safety = Math.max(60, Math.min(100, base - 2 + ((seed + i) % 7) - 3));
    return { month: m, fuel: +fuel.toFixed(1), speed, safety };
  });
}