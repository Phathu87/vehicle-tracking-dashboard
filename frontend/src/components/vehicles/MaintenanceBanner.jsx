import React from 'react';
import { AlertTriangle, CalendarPlus, Filter } from 'lucide-react';

export default function MaintenanceBanner({ alerts, onFilterDue }) {
  const overdue = alerts.filter(a => a.state === 'overdue').length;
  const dueSoon = alerts.length - overdue;
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/10 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-danger/15 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-danger" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-danger">Maintenance required — {alerts.length} vehicle{alerts.length > 1 ? 's' : ''} reached the service mileage limit</p>
          <p className="text-xs text-muted-foreground mt-0.5">{overdue} overdue · {dueSoon} due soon. Automated trigger fired on mileage threshold.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={onFilterDue} className="text-xs rounded-lg border border-border bg-secondary px-3 py-1.5 hover:bg-accent inline-flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" />Show due vehicles</button>
            <span className="text-xs rounded-lg border border-warning/30 bg-warning/10 text-warning px-3 py-1.5 inline-flex items-center gap-1.5"><CalendarPlus className="w-3.5 h-3.5" />Sync to Google Calendar — connect to enable</span>
          </div>
        </div>
      </div>
    </div>
  );
}