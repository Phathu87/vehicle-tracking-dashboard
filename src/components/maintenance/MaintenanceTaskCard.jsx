import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MaintenanceTaskCard({ vehicle, driver, alert }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-heading font-semibold text-sm">{vehicle.make} {vehicle.model}</p>
          <p className="text-[11px] text-muted-foreground">{vehicle.id} · {vehicle.plate}</p>
        </div>
        <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', alert.state === 'overdue' ? 'text-danger bg-danger/10' : 'text-warning bg-warning/10')}>
          {alert.state === 'overdue' ? 'Overdue' : 'Due soon'}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Service progress</span><span className="font-medium">{alert.sinceService.toLocaleString()} / {vehicle.serviceInterval.toLocaleString()} km</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={cn('h-full', alert.state === 'overdue' ? 'bg-danger' : 'bg-warning')} style={{ width: `${alert.pct}%` }} /></div>
      <p className="text-xs text-muted-foreground mt-2">Driver: {driver?.name || 'Unassigned'} · {vehicle.area}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" className="flex-1"><Wrench className="w-4 h-4 mr-1" />Schedule</Button>
        <Button size="sm" variant="outline" disabled className="flex-1"><CalendarPlus className="w-4 h-4 mr-1" />Calendar</Button>
        <Button asChild size="sm" variant="ghost"><Link to={`/app/vehicles/${vehicle.id}`}>Details</Link></Button>
      </div>
    </div>
  );
}