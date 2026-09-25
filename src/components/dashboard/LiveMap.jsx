import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { ArrowLeft, Maximize2, Minus, Plus, Radio } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const SOUTH_AFRICA_CENTER = [-29.0, 24.5];
const colors = { online: '#2bd576', moving: '#1769ff', idle: '#995cff', maintenance: '#ff9f1a', offline: '#687c94', critical: '#ff4545', unknown: '#687c94' };

function MapController({ vehicles, selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 12, { duration: 0.7 });
      return;
    }
    const points = vehicles.map((vehicle) => [vehicle.lat, vehicle.lng]);
    if (points.length === 1) map.setView(points[0], 12);
    else if (points.length > 1) map.fitBounds(points, { padding: [24, 24], maxZoom: 9 });
    else map.setView(SOUTH_AFRICA_CENTER, 5);
  }, [map, selected, vehicles]);
  return null;
}

export default function LiveMap({ vehicles }) {
  const mappedVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.lat !== null && vehicle.lng !== null), [vehicles]);
  const [selectedId, setSelectedId] = useState(() => mappedVehicles[0]?.id || null);
  const [map, setMap] = useState(null);
  const selected = mappedVehicles.find((vehicle) => vehicle.id === selectedId) || null;

  useEffect(() => {
    if (selectedId && !mappedVehicles.some((vehicle) => vehicle.id === selectedId)) setSelectedId(mappedVehicles[0]?.id || null);
  }, [mappedVehicles, selectedId]);

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-[#1b3551] bg-[#091a2e]">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-[#1b3551] px-3 py-2.5">
        <div><h2 className="font-heading text-sm font-semibold text-white">Live Driver Tracking</h2><p className="mt-0.5 text-[10px] text-[#8298b2]">Nationwide · {selected ? selected.locationLabel : 'South Africa'} · simulated telemetry</p></div>
        <div className="flex items-center gap-1">
          <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-success/10 px-2 py-1 text-[9px] font-semibold text-success sm:flex"><Radio className="h-2.5 w-2.5" /> API CONNECTED</span>
          <button type="button" onClick={() => map?.zoomIn()} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#10243b] text-[#a8bad0] hover:text-white" aria-label="Zoom in"><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={() => map?.zoomOut()} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#10243b] text-[#a8bad0] hover:text-white" aria-label="Zoom out"><Minus className="h-4 w-4" /></button>
          <button type="button" onClick={() => setSelectedId(null)} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#10243b] text-[#a8bad0] hover:text-white" aria-label="National view"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>

      {mappedVehicles.length ? (
        <div className="relative h-[clamp(340px,48vw,530px)] min-h-[340px] bg-[#06101c]">
          <MapContainer ref={setMap} center={SOUTH_AFRICA_CENTER} zoom={5} scrollWheelZoom zoomControl={false} className="fleet-dark-map h-full w-full bg-[#06101c]">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
            <MapController vehicles={mappedVehicles} selected={selected} />
            {mappedVehicles.map((vehicle) => (
              <CircleMarker key={vehicle.id} center={[vehicle.lat, vehicle.lng]} radius={selectedId === vehicle.id ? 9 : 5} pathOptions={{ color: '#07111f', weight: 2, fillColor: colors[vehicle.status] || colors.unknown, fillOpacity: 0.95 }} eventHandlers={{ click: () => setSelectedId(vehicle.id) }}>
                <Popup><div className="min-w-44 text-sm"><strong>{vehicle.id}</strong><br />{vehicle.driver || 'Unassigned'}<br />{vehicle.locationLabel}<br />{vehicle.speed} km/h · {vehicle.status}</div></Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {selected && (
            <div className="absolute left-3 top-3 z-[500] w-[min(205px,calc(100%-1.5rem))] rounded-lg border border-[#21405f] bg-[#091a2e]/95 p-3 text-white shadow-xl backdrop-blur-md">
              <button type="button" onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-[10px] text-[#4d9cff] hover:underline"><ArrowLeft className="h-3 w-3" /> National view</button>
              <div className="mt-3 flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-semibold">{selected.driver || 'Unassigned driver'}</p><p className="mt-0.5 truncate text-[9px] text-[#8da3ba]">{selected.id} · {selected.locationLabel}</p></div><span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[8px] font-semibold capitalize text-success">{selected.status}</span></div>
              <dl className="mt-3 space-y-2 border-y border-[#1b3551] py-2 text-[9px]">
                <div className="flex justify-between gap-3"><dt className="text-[#8096ad]">Vehicle</dt><dd className="truncate font-semibold">{selected.make ? `${selected.make} ${selected.model || ''}` : selected.id}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-[#8096ad]">Speed</dt><dd className="font-semibold">{selected.speed} km/h</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-[#8096ad]">Area</dt><dd className="truncate font-semibold">{selected.locationLabel}</dd></div>
              </dl>
              <div className="mt-2 flex justify-between gap-3 text-[8px]"><span className="text-[#8096ad]">Exact position</span><span className="font-mono font-semibold">{Math.abs(selected.lat).toFixed(4)}°S, {selected.lng.toFixed(4)}°E</span></div>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-3 right-3 z-[500] text-[8px] text-white/45">Demo positions · OpenStreetMap</div>
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center text-center text-[#8da3ba]"><p className="text-sm font-medium">No valid locations</p><p className="mt-1 text-xs">Vehicle coordinates are missing from the API response.</p></div>
      )}
    </section>
  );
}
