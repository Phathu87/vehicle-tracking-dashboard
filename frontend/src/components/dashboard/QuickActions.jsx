import { Link } from 'react-router-dom';
import { ArrowUpRight, Car, FileText, Route, Shield, Users, Wrench } from 'lucide-react';

const actions = [
  [Car, 'View Fleet', '/app/vehicles', 'Available'],
  [Users, 'Driver Records', '/app/drivers', 'Demo'],
  [Wrench, 'Maintenance', '/app/maintenance', 'Demo'],
  [Shield, 'Geofences', '/app/geofences', 'Connected'],
  [Route, 'Route Optimisation', '/app/routes', 'Demo algorithm'],
  [FileText, 'Reports', '/app/reports', 'Connected'],
];

export default function QuickActions() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4"><h2 className="font-heading text-sm font-semibold">Quick Actions</h2><p className="mt-1 text-[11px] text-muted-foreground">Navigate to available Demo areas and labelled product surfaces.</p></div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{actions.map(([Icon, label, to, status]) => <Link key={label} to={to} className="group flex min-h-20 items-center gap-3 rounded-md border border-border bg-secondary/50 p-3 transition-colors hover:border-primary/40 hover:bg-accent"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-[18px] w-[18px]" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold leading-tight">{label}</span><span className="mt-1 block text-[10px] uppercase text-muted-foreground">{status}</span></span><ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" /></Link>)}</div>
    </section>
  );
}
