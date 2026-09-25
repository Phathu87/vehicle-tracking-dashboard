import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Fuel, MapPin, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMaintenanceStatus } from '@/lib/maintenanceAlerts';

const STATUS = {
  online: { dot: 'bg-success', text: 'text-success' },
  moving: { dot: 'bg-primary', text: 'text-primary' },
  idle: { dot: 'bg-purple', text: 'text-purple' },
  maintenance: { dot: 'bg-warning', text: 'text-warning' },
  offline: { dot: 'bg-muted-foreground/40', text: 'text-muted-foreground' },
  critical: { dot: 'bg-danger', text: 'text-danger' },
};

export default function VehicleCard({ vehicle, driver, selectable, selected, onSelect }) {
  const maint = getMaintenanceStatus(vehicle);
  const s = STATUS[vehicle.status] || STATUS.offline;
  return (
    <Link to={`/app/vehicles/${vehicle.id}`} className="group block rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2">
          {selectable && (
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(); }} className={cn('mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors', selected ? 'bg-primary border-primary' : 'border-border bg-secondary hover:border-primary')} aria-label={selected ? 'Deselect' : 'Select'}>
              {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </button>
          )}
          <div>
            <p className="font-heading font-semibold text-sm">{vehicle.id}</p>
            <p className="text-[11px] text-muted-foreground">{vehicle.plate}</p>
          </div>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-medium capitalize', s.text)}><span className={cn('w-2 h-2 rounded-full', s.dot)} />{vehicle.status}</span>
      </div>
      <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model} · {vehicle.year}</p>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{vehicle.area}</div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-secondary p-2"><p className="text-muted-foreground text-[10px]">Driver</p><p className="font-medium truncate">{driver?.name || 'Unassigned'}</p></div>
        <div className="rounded-lg bg-secondary p-2"><p className="text-muted-foreground text-[10px]">Speed</p><p className="font-medium flex items-center gap-1"><Gauge className="w-3 h-3" />{vehicle.speed} km/h</p></div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Service</span>
          <span className={maint.state === 'overdue' ? 'text-danger' : maint.state === 'due-soon' ? 'text-warning' : 'text-muted-foreground'}>
            {maint.state === 'overdue' ? 'Overdue' : maint.state === 'due-soon' ? 'Due soon' : `${maint.remaining.toLocaleString()} km`}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className={cn('h-full rounded-full', maint.state === 'overdue' ? 'bg-danger' : maint.state === 'due-soon' ? 'bg-warning' : 'bg-success')} style={{ width: `${maint.pct}%` }} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground"><Fuel className="w-3.5 h-3.5" />{vehicle.fuel}%</span>
        <span className="text-muted-foreground">{vehicle.mileage.toLocaleString()} km</span>
        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">View <ChevronRight className="w-3 h-3" /></span>
      </div>
    </Link>
  );
}