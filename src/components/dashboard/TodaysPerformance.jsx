import { Gauge, MapPinned, Radio, Truck } from 'lucide-react';

export default function TodaysPerformance({ model }) {
  const items = [
    [Truck, model.activeCount, 'Active vehicles'],
    [Gauge, `${model.averageSpeed} km/h`, 'Average speed'],
    [MapPinned, model.locationCount, 'Locations represented'],
    [Radio, model.vehicles.filter((vehicle) => vehicle.lat !== null && vehicle.lng !== null).length, 'Position records'],
  ];
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-sm font-semibold">Today's Performance</h2><p className="mt-1 text-[11px] text-muted-foreground">Current telemetry snapshot</p></div><span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-semibold text-success">API DATA</span></div>
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">{items.map(([Icon, value, label]) => <div key={label} className="bg-card p-3"><Icon className="h-4 w-4 text-primary" /><p className="mt-3 font-heading text-lg font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>)}</div>
    </section>
  );
}
