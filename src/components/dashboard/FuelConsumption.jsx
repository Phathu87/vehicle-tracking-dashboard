import { Fuel } from 'lucide-react';

export default function FuelConsumption({ consumption, available }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-sm font-semibold">Fuel Consumption</h2><p className="mt-1 text-[11px] text-muted-foreground">Consumed volume, not tank level</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">{available ? 'API DATA' : 'BACKEND GAP'}</span></div>
      {available ? <div className="flex min-h-36 items-center justify-center"><div className="text-center"><Fuel className="mx-auto h-7 w-7 text-warning" /><p className="mt-3 font-heading text-3xl font-bold">{consumption.toLocaleString()} L</p><p className="mt-1 text-xs text-muted-foreground">Current API total</p></div></div> : <div className="flex min-h-36 flex-col items-center justify-center text-center"><Fuel className="h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Consumption telemetry is unavailable</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">The API has no fuel-consumed history, so this widget remains intentionally empty.</p></div>}
    </section>
  );
}
