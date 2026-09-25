import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = { online: '#2bd576', moving: '#1769ff', idle: '#995cff', maintenance: '#ff9f1a', offline: '#687c94', critical: '#ff4545' };

export default function VehicleDetailMap({ vehicle, history }) {
  const route = history.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)).map((point) => [point.lat, point.lng]);
  const center = Number.isFinite(vehicle.lat) && Number.isFinite(vehicle.lng) ? [vehicle.lat, vehicle.lng] : [-30.5595, 22.9375];
  const color = STATUS_COLOR[vehicle.status] || STATUS_COLOR.offline;

  return (
    <section className="overflow-hidden rounded-lg border border-[#1b3551] bg-[#091a2e]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b3551] px-4 py-3">
        <div><h2 className="text-sm font-semibold text-white">Latest Position</h2><p className="mt-0.5 text-[11px] text-[#8298b2]">{vehicle.area || vehicle.city || 'Location unavailable'}</p></div>
        <p className="font-mono text-[11px] text-[#8298b2]">{Number(vehicle.lat).toFixed(5)}, {Number(vehicle.lng).toFixed(5)}</p>
      </div>
      <div className="fleet-dark-map h-[360px] sm:h-[430px]">
        <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {route.length > 1 && <Polyline positions={route} pathOptions={{ color, weight: 4, opacity: 0.75 }} />}
          <CircleMarker center={center} radius={9} pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 1 }}>
            <Popup><strong>{vehicle.id}</strong><br />{vehicle.speed} km/h<br />{vehicle.fuel ?? '—'}% fuel</Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </section>
  );
}
