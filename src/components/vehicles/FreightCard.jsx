import React from 'react';
import { Package, MapPin, Clock, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS = {
  loading: { label: 'Loading', cls: 'text-warning bg-warning/10' },
  in_transit: { label: 'In Transit', cls: 'text-primary bg-primary/10' },
  delivered: { label: 'Delivered', cls: 'text-success bg-success/10' },
  delayed: { label: 'Delayed', cls: 'text-danger bg-danger/10' },
};

export default function FreightCard({ vehicle }) {
  const f = vehicle.freight;
  if (!f) return null;
  const s = STATUS[f.status] || STATUS.in_transit;
  const pct = Math.min(100, Math.round((f.weightKg / f.capacityKg) * 100));

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-sm">Freight & Delivery</h3>
        <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', s.cls)}>{s.label}</span>
      </div>
      <div className="flex items-center gap-2.5 text-sm">
        <Package className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="font-medium">{f.loadType}</span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5" />Load weight</span>
          <span className="text-foreground font-medium">{f.weightKg.toLocaleString()} / {f.capacityKg.toLocaleString()} kg</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />Destination</span>
          <span className="font-medium">{f.destination}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3.5 h-3.5" />Est. delivery</span>
          <span className="font-medium">{f.eta}</span>
        </div>
      </div>
    </div>
  );
}