import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Circle, CircleMarker, MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Pencil, Plus, Shield, Trash2 } from 'lucide-react';
import { geofencesApi } from '@/api/geofences';
import { getVehicles } from '@/api/vehicles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const blank = { name: '', shapeType: 'circle', centerLat: '-26.2041', centerLng: '28.0473', radiusMeters: '5000', polygonText: '-33.98,18.36\n-33.86,18.36\n-33.86,18.53\n-33.98,18.53' };
const inputClass = 'h-9 w-full rounded-md border border-[#1b3551] bg-[#071426] px-3 text-sm outline-none focus:border-primary';

function payload(form) {
  if (form.shapeType === 'circle') return { name: form.name, shapeType: 'circle', center: { lat: Number(form.centerLat), lng: Number(form.centerLng) }, radiusMeters: Number(form.radiusMeters) };
  return { name: form.name, shapeType: 'polygon', polygon: form.polygonText.split(/\r?\n/).filter(Boolean).map((line) => { const [lat, lng] = line.split(',').map(Number); return { lat, lng }; }) };
}

function toForm(item) {
  return { name: item.name, shapeType: item.shapeType, centerLat: item.center?.lat ?? '', centerLng: item.center?.lng ?? '', radiusMeters: item.radiusMeters ?? '', polygonText: item.polygon?.map((point) => `${point.lat},${point.lng}`).join('\n') || '' };
}

export default function Geofences() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { canMutateSharedDemo } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const geofencesQuery = useQuery({ queryKey: ['geofences'], queryFn: ({ signal }) => geofencesApi.list({ signal }) });
  const vehiclesQuery = useQuery({ queryKey: ['vehicles'], queryFn: ({ signal }) => getVehicles({ signal }), refetchInterval: 30_000 });
  const selected = useMemo(() => (geofencesQuery.data || []).find((item) => item.id === selectedId) || null, [geofencesQuery.data, selectedId]);
  const checkQuery = useQuery({ queryKey: ['geofence-check', selectedId], queryFn: ({ signal }) => geofencesApi.check(selectedId, null, { signal }), enabled: Boolean(selectedId), refetchInterval: 30_000 });
  const refresh = async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['geofences'] }), queryClient.invalidateQueries({ queryKey: ['geofence-check'] })]); };
  const createMutation = useMutation({ mutationFn: () => geofencesApi.create(payload(form)), onSuccess: async (item) => { await refresh(); setSelectedId(item.id); setDialogOpen(false); toast({ title: 'Geofence created', description: 'The boundary is stored and available to telemetry checks.' }); } });
  const updateMutation = useMutation({ mutationFn: () => geofencesApi.update(editing.id, payload(form)), onSuccess: async () => { await refresh(); setDialogOpen(false); toast({ title: 'Geofence updated', description: 'The stored boundary was updated.' }); } });
  const deleteMutation = useMutation({ mutationFn: (id) => geofencesApi.remove(id), onSuccess: async () => { setSelectedId(null); await refresh(); toast({ title: 'Geofence deleted', description: 'The boundary and its vehicle states were removed.' }); } });
  const geofences = Array.isArray(geofencesQuery.data) ? geofencesQuery.data : [];
  const vehicles = Array.isArray(vehiclesQuery.data) ? vehiclesQuery.data : [];
  const error = geofencesQuery.error || vehiclesQuery.error || checkQuery.error || createMutation.error || updateMutation.error || deleteMutation.error;
  const busy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const openCreate = () => { setEditing(null); setForm(blank); setDialogOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm(toForm(item)); setDialogOpen(true); };
  const remove = (item) => { if (window.confirm(`Delete ${item.name}?`)) deleteMutation.mutate(item.id); };
  const submit = (event) => { event.preventDefault(); if (editing) updateMutation.mutate(); else createMutation.mutate(); };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-heading text-xl font-bold">Geofences</h1><p className="text-xs text-muted-foreground">Persisted circle and polygon boundaries with backend vehicle checks</p></div>{canMutateSharedDemo && <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" />Create geofence</Button>}</div>
      {error && <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-xs text-danger"><AlertCircle className="h-4 w-4" />{error.message}</div>}
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-2">{geofencesQuery.isPending ? Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-28 rounded-lg" />) : geofences.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={cn('w-full rounded-lg border p-3 text-left transition-colors', selectedId === item.id ? 'border-primary bg-primary/10' : 'border-[#1b3551] bg-[#091a2e] hover:border-primary/50')}><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold">{item.name}</p><p className="mt-0.5 text-[10px] uppercase text-[#8298b2]">{item.shapeType}</p></div><Shield className="h-4 w-4 text-primary" /></div><p className="mt-2 text-[11px] text-[#8298b2]">{item.shapeType === 'circle' ? `${Math.round(item.radiusMeters).toLocaleString()} m radius` : `${item.polygon.length} polygon points`}</p>{canMutateSharedDemo && <div className="mt-3 flex gap-2"><Button size="sm" variant="outline" className="h-7" onClick={(event) => { event.stopPropagation(); openEdit(item); }}><Pencil className="h-3.5 w-3.5" />Edit</Button><Button size="icon" variant="ghost" className="h-7 w-7 text-danger" aria-label="Delete geofence" onClick={(event) => { event.stopPropagation(); remove(item); }}><Trash2 className="h-3.5 w-3.5" /></Button></div>}</button>)}{!geofencesQuery.isPending && !geofences.length && <div className="rounded-lg border border-border bg-card p-8 text-center text-xs text-muted-foreground">No geofences configured.</div>}</aside>
        <section className="overflow-hidden rounded-lg border border-[#1b3551] bg-[#091a2e]"><div className="border-b border-[#1b3551] px-4 py-3"><h2 className="text-sm font-semibold">Operations Map</h2><p className="mt-0.5 text-[11px] text-[#8298b2]">Select a boundary to query current entry and exit state.</p></div><div className="fleet-dark-map h-[520px]"><MapContainer center={[-30.5595, 22.9375]} zoom={5} className="h-full w-full"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{geofences.map((item) => item.shapeType === 'circle' ? <Circle key={item.id} center={[item.center.lat, item.center.lng]} radius={item.radiusMeters} pathOptions={{ color: selectedId === item.id ? '#2bd576' : '#1769ff', fillOpacity: 0.12 }} eventHandlers={{ click: () => setSelectedId(item.id) }} /> : <Polygon key={item.id} positions={item.polygon.map((point) => [point.lat, point.lng])} pathOptions={{ color: selectedId === item.id ? '#2bd576' : '#995cff', fillOpacity: 0.12 }} eventHandlers={{ click: () => setSelectedId(item.id) }} />)}{vehicles.filter((vehicle) => Number.isFinite(vehicle.lat) && Number.isFinite(vehicle.lng)).map((vehicle) => <CircleMarker key={vehicle.id} center={[vehicle.lat, vehicle.lng]} radius={4} pathOptions={{ color: '#ffffff', weight: 1, fillColor: '#1769ff', fillOpacity: 0.9 }}><Popup><strong>{vehicle.id}</strong><br />{vehicle.plate}<br />{vehicle.driver || 'Unassigned'}</Popup></CircleMarker>)}</MapContainer></div></section>
      </div>
      {selected && <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-semibold">Vehicle Check · {selected.name}</h2><p className="text-[11px] text-[#8298b2]">Calculated by the Express geofence engine from current stored positions.</p></div><div className="flex gap-3 text-xs"><span className="text-success">Inside {checkQuery.data?.states.filter((item) => item.state === 'inside').length || 0}</span><span className="text-warning">Outside {checkQuery.data?.states.filter((item) => item.state === 'outside').length || 0}</span></div></div>{checkQuery.isPending ? <Skeleton className="mt-3 h-24" /> : <div className="mt-3 grid max-h-64 gap-2 overflow-auto sm:grid-cols-2 lg:grid-cols-3">{(checkQuery.data?.states || []).map((item) => <div key={item.vehicleId} className="flex items-center justify-between rounded-md bg-[#071426] p-2 text-xs"><div><p>{item.vehicleId} · {item.plate}</p><p className="text-[10px] text-[#8298b2]">{item.driver || 'Unassigned'}</p></div><span className={item.state === 'inside' ? 'text-success' : 'text-warning'}>{item.state}</span></div>)}</div>}</section>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="border-[#1b3551] bg-[#091a2e]"><DialogHeader><DialogTitle>{editing ? 'Edit geofence' : 'Create geofence'}</DialogTitle></DialogHeader><form className="space-y-3" onSubmit={submit}><label className="block space-y-1 text-xs text-[#8298b2]"><span>Name</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputClass} /></label><label className="block space-y-1 text-xs text-[#8298b2]"><span>Shape</span><select value={form.shapeType} onChange={(event) => setForm((current) => ({ ...current, shapeType: event.target.value }))} className={inputClass}><option value="circle">Circle</option><option value="polygon">Polygon</option></select></label>{form.shapeType === 'circle' ? <div className="grid gap-3 sm:grid-cols-3">{[['centerLat', 'Latitude'], ['centerLng', 'Longitude'], ['radiusMeters', 'Radius (m)']].map(([field, label]) => <label key={field} className="space-y-1 text-xs text-[#8298b2]"><span>{label}</span><input required type="number" step="any" min={field === 'radiusMeters' ? '1' : undefined} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className={inputClass} /></label>)}</div> : <label className="block space-y-1 text-xs text-[#8298b2]"><span>Polygon points · one latitude,longitude pair per line</span><textarea required rows="7" value={form.polygonText} onChange={(event) => setForm((current) => ({ ...current, polygonText: event.target.value }))} className="w-full rounded-md border border-[#1b3551] bg-[#071426] p-3 font-mono text-xs outline-none focus:border-primary" /></label>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={busy}>{editing ? 'Save boundary' : 'Create boundary'}</Button></div></form></DialogContent></Dialog>
    </div>
  );
}
