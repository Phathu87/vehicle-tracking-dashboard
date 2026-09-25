import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const statusStyles = { online: 'bg-success/10 text-success', moving: 'bg-primary/10 text-primary', idle: 'bg-purple/10 text-purple', offline: 'bg-muted text-muted-foreground', maintenance: 'bg-warning/10 text-warning' };

function formatSeen(timestamp) {
  if (!timestamp) return 'Unavailable';
  return new Intl.DateTimeFormat('en-ZA', { hour: '2-digit', minute: '2-digit' }).format(timestamp);
}

export default function RecentVehicles({ vehicles }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="font-heading text-sm font-semibold">Recent Vehicles</h2><p className="mt-1 text-[11px] text-muted-foreground">Latest records from Express</p></div><Link to="/app/vehicles" className="flex items-center gap-1 text-xs text-primary hover:underline">View fleet <ArrowRight className="h-3 w-3" /></Link></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] text-sm">
          <thead><tr className="border-b border-border text-left text-[11px] text-muted-foreground"><th className="px-4 py-2.5 font-medium">Vehicle</th><th className="px-4 py-2.5 font-medium">Driver</th><th className="px-4 py-2.5 font-medium">Location</th><th className="px-4 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 font-medium">Speed</th><th className="px-4 py-2.5 font-medium">Seen</th></tr></thead>
          <tbody>{vehicles.map((vehicle) => <tr key={vehicle.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30"><td className="px-4 py-3 font-medium">{vehicle.id}</td><td className="px-4 py-3 text-muted-foreground">{vehicle.driver || 'Unassigned'}</td><td className="px-4 py-3 text-muted-foreground">{vehicle.locationLabel}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[vehicle.status] || 'bg-muted text-muted-foreground'}`}>{vehicle.status}</span></td><td className="px-4 py-3 text-muted-foreground">{vehicle.speed} km/h</td><td className="px-4 py-3 text-muted-foreground">{formatSeen(vehicle.lastSeenTimestamp)}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
