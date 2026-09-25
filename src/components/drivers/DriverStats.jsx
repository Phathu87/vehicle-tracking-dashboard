import React from 'react';
import { Route, Bell, Gauge, Clock, CheckCircle2, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriverStats({ stats }) {
  const items = [
    { icon: Car, label: 'Assigned Vehicles', value: stats.assignedCount, accent: 'text-primary' },
    { icon: Route, label: 'Total Distance', value: `${stats.totalDistance} km`, accent: 'text-info' },
    { icon: Gauge, label: 'Avg Speed', value: `${stats.avgSpeed} km/h`, accent: 'text-purple' },
    { icon: Bell, label: 'Alerts (30d)', value: stats.alerts, accent: 'text-danger' },
    { icon: CheckCircle2, label: 'On-time Rate', value: `${stats.onTimeRate}%`, accent: 'text-success' },
    { icon: Clock, label: 'Trips (30d)', value: stats.trips, accent: 'text-warning' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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