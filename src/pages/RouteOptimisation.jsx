import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, ArrowDown, ArrowUp, MapPin, Plus, Route, Trash2 } from 'lucide-react';
import { routesApi } from '@/api/routes';
import { getVehicles } from '@/api/vehicles';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const inputClass = 'h-9 w-full rounded-md border border-[#1b3551] bg-[#071426] px-3 text-sm outline-none focus:border-primary';
const initialStops = [
  { name: 'Johannesburg depot', lat: -26.2041, lng: 28.0473 },
  { name: 'Pretoria stop', lat: -25.7479, lng: 28.2293 },
];

export default function RouteOptimisation() {
  const [stops, setStops] = useState(initialStops);
  const vehiclesQuery = useQuery({ queryKey: ['vehicles'], queryFn: ({ signal }) => getVehicles({ signal }) });
  const optimizeMutation = useMutation({ mutationFn: () => routesApi.optimize(stops.map(({ name, lat, lng }) => ({ name, lat: Number(lat), lng: Number(lng) }))) });
  const result = optimizeMutation.data;
  const displayedStops = result?.orderedStops || stops;
  const positions = useMemo(() => displayedStops.filter((stop) => Number.isFinite(Number(stop.lat)) && Number.isFinite(Number(stop.lng))).map((stop) => [Number(stop.lat), Number(stop.lng)]), [displayedStops]);
  const updateStop = (index, field, value) => setStops((current) => current.map((stop, itemIndex) => itemIndex === index ? { ...stop, [field]: value } : stop));
  const moveStop = (index, offset) => setStops((current) => { const next = [...current]; const target = index + offset; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const addVehicle = (vehicle) => {
    if (!Number.isFinite(vehicle.lat) || !Number.isFinite(vehicle.lng)) return;
    setStops((current) => [...current, { name: `${vehicle.id} · ${vehicle.plate}`, lat: vehicle.lat, lng: vehicle.lng }]);
  };
  const addBlank = () => setStops((current) => [...current, { name: `Stop ${current.length + 1}`, lat: -26.2041, lng: 28.0473 }]);
  const valid = stops.length >= 2 && stops.every((stop) => stop.name.trim() && Number.isFinite(Number(stop.lat)) && Number.isFinite(Number(stop.lng)));

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-heading text-xl font-bold">Route Optimisation</h1><p className="text-xs text-muted-foreground">Demo algorithmic stop ordering using straight-line distance</p></div><Button size="sm" onClick={() => optimizeMutation.mutate()} disabled={!valid || optimizeMutation.isPending}><Route className="h-4 w-4" />{optimizeMutation.isPending ? 'Optimising...' : 'Optimise route'}</Button></div>
      <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-xs text-warning">This is a deterministic Demo nearest-neighbour calculation. It does not use road networks, live traffic, Google, Mapbox, capacity constraints, or an AI routing model.</div>
      {optimizeMutation.isError && <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-xs text-danger"><AlertCircle className="h-4 w-4" />{optimizeMutation.error.message}</div>}
      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Stops</h2><p className="mt-0.5 text-[11px] text-[#8298b2]">The first stop is the fixed starting point.</p></div><Button size="icon" variant="outline" onClick={addBlank} aria-label="Add stop"><Plus className="h-4 w-4" /></Button></div><div className="mt-4 space-y-3">{stops.map((stop, index) => <div key={`${index}-${stop.name}`} className="rounded-md border border-[#1b3551] bg-[#071426] p-3"><div className="mb-2 flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{index + 1}</span><input aria-label={`Stop ${index + 1} name`} value={stop.name} onChange={(event) => updateStop(index, 'name', event.target.value)} className={`${inputClass} flex-1`} /><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveStop(index, -1)} disabled={index === 0} aria-label="Move stop up"><ArrowUp className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveStop(index, 1)} disabled={index === stops.length - 1} aria-label="Move stop down"><ArrowDown className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-8 w-8 text-danger" onClick={() => setStops((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={stops.length <= 2} aria-label="Remove stop"><Trash2 className="h-3.5 w-3.5" /></Button></div><div className="grid grid-cols-2 gap-2"><input aria-label={`Stop ${index + 1} latitude`} type="number" step="any" value={stop.lat} onChange={(event) => updateStop(index, 'lat', event.target.value)} className={inputClass} /><input aria-label={`Stop ${index + 1} longitude`} type="number" step="any" value={stop.lng} onChange={(event) => updateStop(index, 'lng', event.target.value)} className={inputClass} /></div></div>)}</div><div className="mt-4 border-t border-[#1b3551] pt-4"><p className="mb-2 text-[10px] uppercase text-[#60748d]">Add current vehicle position</p>{vehiclesQuery.isPending ? <Skeleton className="h-20" /> : <div className="flex max-h-36 flex-wrap gap-2 overflow-auto">{(vehiclesQuery.data || []).filter((vehicle) => Number.isFinite(vehicle.lat) && Number.isFinite(vehicle.lng)).map((vehicle) => <Button key={vehicle.id} size="sm" variant="outline" onClick={() => addVehicle(vehicle)}><MapPin className="h-3.5 w-3.5" />{vehicle.id}</Button>)}</div>}</div></section>
        <section className="overflow-hidden rounded-lg border border-[#1b3551] bg-[#091a2e]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b3551] px-4 py-3"><div><h2 className="text-sm font-semibold">Calculated Route</h2><p className="mt-0.5 text-[11px] text-[#8298b2]">Visual connection between coordinates, not turn-by-turn navigation.</p></div>{result && <div className="flex gap-5 text-xs"><span><strong>{result.distanceKm}</strong> km straight-line</span><span><strong>{result.durationMinutes}</strong> min estimate</span></div>}</div><div className="fleet-dark-map h-[500px]"><MapContainer center={positions[0] || [-30.5595, 22.9375]} zoom={positions.length > 2 ? 5 : 7} className="h-full w-full"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{positions.length > 1 && <Polyline positions={positions} pathOptions={{ color: '#1769ff', weight: 4 }} />}{displayedStops.map((stop, index) => <CircleMarker key={`${stop.name}-${index}`} center={[Number(stop.lat), Number(stop.lng)]} radius={9} pathOptions={{ color: '#ffffff', weight: 2, fillColor: index === 0 ? '#2bd576' : '#1769ff', fillOpacity: 1 }}><Popup><strong>{index + 1}. {stop.name}</strong>{result && <><br />Original position: {stop.originalIndex + 1}</>}</Popup></CircleMarker>)}</MapContainer></div>{result && <div className="grid gap-2 border-t border-[#1b3551] p-4 sm:grid-cols-2 lg:grid-cols-3">{result.orderedStops.map((stop, index) => <div key={`${stop.name}-${index}`} className="flex items-center gap-2 rounded-md bg-[#071426] p-2 text-xs"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">{index + 1}</span><span className="truncate">{stop.name}</span></div>)}</div>}</section>
      </div>
    </div>
  );
}
