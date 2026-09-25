import React from 'react';
import { Gauge, Fuel, Route, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VehicleMetrics({ vehicle }) {
  const items = [
    { icon: Gauge, label: 'Current Speed', value: `${vehicle.speed} km/h`, accent: 'text-primary' },
    { icon: Fuel, label: 'Fuel Level', value: `${vehicle.fuel}%`, accent: vehicle.fuel < 20 ? 'text-danger' : 'text-success' },
    { icon: Route, label: 'Total Mileage', value: `${vehicle.mileage.toLocaleString()} km`, accent: 'text-info' },
    { icon: Clock, label: 'Last Seen', value: vehicle.lastSeen, accent: 'text-purple' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(m => (
        <div key={m.label} className="rounded-xl border border-border bg-card p-4">
          <div className={cn('w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3', m.accent)}><m.icon className="w-[18px] h-[18px]" /></div>
          <p className="text-lg font-bold font-heading leading-none">{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  );
}