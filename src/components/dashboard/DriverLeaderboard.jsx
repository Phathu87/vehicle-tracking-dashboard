import { Activity, Trophy } from 'lucide-react';

export default function DriverLeaderboard({ drivers }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="flex items-center gap-2 font-heading text-sm font-semibold"><Trophy className="h-4 w-4 text-warning" /> Top Drivers</h2><p className="mt-1 text-[11px] text-muted-foreground">Ranked by active assigned vehicles in the API snapshot</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">DEMO RANKING</span></div>
      {drivers.length ? <div className="grid gap-2 sm:grid-cols-2">{drivers.map((driver, index) => <div key={driver.name} className="flex items-center gap-3 rounded-md border border-border p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-muted-foreground">{index + 1}</span><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{driver.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{driver.name}</p><p className="text-[11px] text-muted-foreground">{driver.vehicleCount} assigned · {driver.averageSpeed} km/h avg</p></div><span className="flex items-center gap-1 text-xs font-semibold text-success"><Activity className="h-3.5 w-3.5" />{driver.activeCount}</span></div>)}</div> : <p className="py-10 text-center text-sm text-muted-foreground">No driver names are present in the vehicle response.</p>}
    </section>
  );
}
