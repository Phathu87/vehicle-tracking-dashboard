import React from 'react';

export default function RouteTimeline({ route }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading font-semibold text-sm mb-4">Route History</h3>
      <div className="relative pl-6">
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border" />
        <div className="space-y-4">
          {route.map((stop, i) => (
            <div key={i} className="relative">
              <span className={`absolute -left-[19px] top-1 w-3 h-3 rounded-full ring-4 ring-card ${i === route.length - 1 ? 'bg-success' : 'bg-primary'}`} />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0"><p className="text-sm font-medium truncate">{stop.location}</p><p className="text-[11px] text-muted-foreground">{stop.event}</p></div>
                <div className="text-right shrink-0"><p className="text-xs text-muted-foreground">{stop.time}</p><p className="text-[11px] text-muted-foreground">{stop.speed} km/h</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}