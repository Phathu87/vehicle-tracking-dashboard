import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Fuel, Gauge, MapPin, Navigation, RefreshCw, Route, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { getVehicle, getVehicleHistory } from '@/api/vehicles';
import VehicleDetailMap from '@/components/vehicles/VehicleDetailMap';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const statusClass = { online: 'text-success bg-success/10', moving: 'text-primary bg-primary/10', idle: 'text-purple bg-purple/10', maintenance: 'text-warning bg-warning/10', offline: 'text-muted-foreground bg-muted', critical: 'text-danger bg-danger/10' };

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleString();
}

function Metric({ icon: Icon, label, value }) {
  return <div className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-3"><div className="flex items-center gap-2 text-[11px] text-[#8298b2]"><Icon className="h-3.5 w-3.5 text-primary" />{label}</div><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>;
}

function DetailSkeleton() {
  return <div className="space-y-3"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24" />)}</div><Skeleton className="h-[430px]" /></div>;
}

export default function VehicleDetail() {
  const { id } = useParams();
  const vehicleQuery = useQuery({ queryKey: ['vehicle', id], queryFn: ({ signal }) => getVehicle(id, { signal }), refetchInterval: 15_000 });
  const historyQuery = useQuery({ queryKey: ['vehicle', id, 'history'], queryFn: ({ signal }) => getVehicleHistory(id, { limit: 200, signal }), refetchInterval: 15_000 });

  if (vehicleQuery.isPending || historyQuery.isPending) return <DetailSkeleton />;
  if (vehicleQuery.isError || historyQuery.isError) {
    const error = vehicleQuery.error || historyQuery.error;
    return <div className="rounded-lg border border-danger/30 bg-danger/5 p-10 text-center"><AlertCircle className="mx-auto h-8 w-8 text-danger" /><h1 className="mt-3 text-lg font-semibold">Vehicle data unavailable</h1><p className="mt-1 text-sm text-muted-foreground">{error.message}</p><div className="mt-5 flex justify-center gap-2"><Button variant="outline" asChild><Link to="/app/vehicles"><ArrowLeft className="h-4 w-4" />Vehicles</Link></Button><Button onClick={() => { vehicleQuery.refetch(); historyQuery.refetch(); }}><RefreshCw className="h-4 w-4" />Retry</Button></div></div>;
  }

  const vehicle = vehicleQuery.data;
  const history = historyQuery.data?.history || [];
  const maintenance = vehicle.maintenance || [];
  const alerts = vehicle.alerts || [];

  return (
    <div className="space-y-4 pb-8">
      <Link to="/app/vehicles" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-white"><ArrowLeft className="h-4 w-4" />Back to vehicles</Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-heading text-xl font-bold">{vehicle.id}</h1><p className="text-xs text-muted-foreground">{vehicle.plate} · {vehicle.make} {vehicle.model}{vehicle.year ? ` · ${vehicle.year}` : ''}</p></div>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', statusClass[vehicle.status] || statusClass.offline)}>{vehicle.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={Gauge} label="Speed" value={`${Math.round(vehicle.speed)} km/h`} />
        <Metric icon={Navigation} label="Mileage" value={`${Math.round(vehicle.mileage).toLocaleString()} km`} />
        <Metric icon={Fuel} label="Fuel" value={vehicle.fuel == null ? 'Unavailable' : `${Math.round(vehicle.fuel)}%`} />
        <Metric icon={ShieldCheck} label="Geofence" value={vehicle.geofenceStatus || 'unknown'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-4">
          <VehicleDetailMap vehicle={vehicle} history={history} />
          <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4">
            <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-semibold"><Route className="h-4 w-4 text-primary" />Telemetry History</h2><span className="text-[11px] text-[#8298b2]">{history.length} stored points</span></div>
            {history.length ? <div className="max-h-80 overflow-auto"><table className="w-full text-left text-xs"><thead className="sticky top-0 bg-[#091a2e] text-[#8298b2]"><tr><th className="py-2">Recorded</th><th>Position</th><th className="text-right">Speed</th><th className="text-right">Mileage</th><th className="text-right">Fuel</th></tr></thead><tbody>{[...history].reverse().map((point) => <tr key={point.id} className="border-t border-[#1b3551]"><td className="whitespace-nowrap py-2">{formatDate(point.recordedAt)}</td><td className="font-mono text-[11px]">{point.lat.toFixed(5)}, {point.lng.toFixed(5)}</td><td className="text-right">{Math.round(point.speed)} km/h</td><td className="text-right">{Math.round(point.mileage).toLocaleString()} km</td><td className="text-right">{point.fuel == null ? '—' : `${Math.round(point.fuel)}%`}</td></tr>)}</tbody></table></div> : <p className="py-8 text-center text-xs text-muted-foreground">No telemetry has been recorded for this vehicle.</p>}
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><h2 className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" />Current State</h2><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between gap-4"><dt className="text-[#8298b2]">City</dt><dd>{vehicle.city || 'Unavailable'}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8298b2]">Area</dt><dd>{vehicle.area || 'Unavailable'}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8298b2]">Last seen</dt><dd className="text-right">{formatDate(vehicle.lastSeen)}</dd></div></dl></section>
          <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><h2 className="flex items-center gap-2 text-sm font-semibold"><UserRound className="h-4 w-4 text-primary" />Assigned Driver</h2><p className="mt-3 text-sm">{vehicle.driver || 'Unassigned'}</p>{vehicle.driverId && <p className="mt-1 text-xs text-[#8298b2]">{vehicle.driverId}</p>}</section>
          <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><h2 className="flex items-center gap-2 text-sm font-semibold"><Wrench className="h-4 w-4 text-primary" />Maintenance</h2>{maintenance.length ? <div className="mt-3 space-y-2">{maintenance.map((item) => <div key={item.id} className="rounded-md bg-[#071426] p-3 text-xs"><div className="flex justify-between gap-2"><span>{item.type}</span><span className="capitalize text-warning">{item.status}</span></div>{item.dueMileage != null && <p className="mt-1 text-[#8298b2]">Due at {Math.round(item.dueMileage).toLocaleString()} km</p>}</div>)}</div> : <p className="mt-3 text-xs text-muted-foreground">No maintenance records.</p>}</section>
          <section className="rounded-lg border border-[#1b3551] bg-[#091a2e] p-4"><h2 className="flex items-center gap-2 text-sm font-semibold"><AlertCircle className="h-4 w-4 text-primary" />Alerts</h2>{alerts.length ? <div className="mt-3 space-y-2">{alerts.map((alert) => <div key={alert.id} className="rounded-md bg-[#071426] p-3 text-xs"><div className="flex justify-between gap-2"><span className="capitalize">{alert.type.replace('_', ' ')}</span><span className={alert.severity === 'critical' ? 'text-danger' : 'text-warning'}>{alert.severity}</span></div><p className="mt-1 text-[#8298b2]">{alert.message}</p><p className="mt-1 text-[10px] text-[#60748d]">{formatDate(alert.recordedAt)}</p></div>)}</div> : <p className="mt-3 text-xs text-muted-foreground">No telemetry-derived alerts.</p>}</section>
        </div>
      </div>
    </div>
  );
}
