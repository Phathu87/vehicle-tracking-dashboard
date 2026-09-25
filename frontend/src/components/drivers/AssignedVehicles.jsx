import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const STYLES = { online: 'text-success bg-success/10', moving: 'text-primary bg-primary/10', idle: 'text-purple bg-purple/10', maintenance: 'text-warning bg-warning/10', offline: 'text-muted-foreground bg-muted', critical: 'text-danger bg-danger/10' };

export default function AssignedVehicles({ vehicles }) {
  if (!vehicles.length) return (
    <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">No vehicles assigned.</p></div>
  );
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border"><h3 className="font-heading font-semibold text-sm">Assigned Vehicles</h3></div>
      <div className="divide-y divide-border">
        {vehicles.map(v => (
          <Link key={v.id} to={`/app/vehicles/${v.id}`} className="flex items-center justify-between gap-3 p-3 hover:bg-accent/40 transition-colors">
            <div><p className="text-sm font-medium">{v.id}</p><p className="text-[11px] text-muted-foreground">{v.plate} · {v.make} {v.model}</p></div>
            <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full capitalize', STYLES[v.status])}>{v.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}