import React from 'react';
import { Gauge, ShieldAlert, Fuel, Moon, Shield, CheckCircle2, KeyRound } from 'lucide-react';

function iconFor(event) {
  if (/overspeed/i.test(event)) return Gauge;
  if (/exit/i.test(event)) return ShieldAlert;
  if (/enter/i.test(event)) return Shield;
  if (/refuel/i.test(event)) return Fuel;
  if (/idle/i.test(event)) return Moon;
  if (/start/i.test(event)) return KeyRound;
  return CheckCircle2;
}

export default function ActivityTimeline({ events }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading font-semibold text-sm mb-4">Activity Timeline</h3>
      <div className="space-y-3">
        {events.map((e, i) => {
          const Icon = iconFor(e.event);
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-muted-foreground" /></div>
              <div className="flex-1 min-w-0"><p className="text-sm truncate">{e.event}</p></div>
              <span className="text-xs text-muted-foreground shrink-0">{e.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}