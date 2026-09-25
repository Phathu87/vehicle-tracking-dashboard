import React from 'react';
import { Wrench, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getMaintenanceStatus } from '@/lib/maintenanceAlerts';

export default function MaintenanceCard({ vehicle }) {
  const m = getMaintenanceStatus(vehicle);
  const since = vehicle.mileage - vehicle.lastServiceMileage;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" /> Maintenance</h3>
      <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Since last service</span><span className="font-medium">{since.toLocaleString()} / {vehicle.serviceInterval.toLocaleString()} km</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={cn('h-full', m.state === 'overdue' ? 'bg-danger' : m.state === 'due-soon' ? 'bg-warning' : 'bg-success')} style={{ width: `${m.pct}%` }} /></div>
      <p className={cn('text-xs mt-2 font-medium', m.state === 'overdue' ? 'text-danger' : m.state === 'due-soon' ? 'text-warning' : 'text-muted-foreground')}>
        {m.state === 'overdue' ? `Overdue by ${Math.abs(m.remaining).toLocaleString()} km` : m.state === 'due-soon' ? `Due in ${m.remaining.toLocaleString()} km` : `${m.remaining.toLocaleString()} km to next service`}
      </p>
      <div className="mt-4 space-y-2">
        <Button className="w-full" size="sm"><Wrench className="w-4 h-4 mr-1" /> Schedule Service</Button>
        <Button variant="outline" size="sm" className="w-full" disabled title="Connect Google Calendar to enable"><CalendarPlus className="w-4 h-4 mr-1" /> Sync to Google Calendar</Button>
      </div>
    </div>
  );
}