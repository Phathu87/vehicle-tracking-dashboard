import { Fuel, Gauge, ShieldCheck, Wrench } from 'lucide-react';

const icons = { Overspeed: Gauge, 'Low Fuel': Fuel, 'Service Overdue': Wrench, 'Service Due Soon': Wrench };
const styles = { critical: 'bg-danger/10 text-danger', warning: 'bg-warning/10 text-warning' };

export default function RecentAlerts({ alerts }) {
  const recent = alerts.slice(0, 7);
  return (
    <section className="h-full rounded-lg border border-[#1b3551] bg-[#091a2e] p-3.5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div><h2 className="font-heading text-sm font-semibold text-white">Recent Alerts</h2><p className="mt-1 text-[10px] text-[#728aa5]">Current API snapshot</p></div>
        <span className="text-[10px] font-medium text-primary">View all →</span>
      </div>
      {recent.length ? (
        <div className="space-y-2">
          {recent.map((alert) => {
            const Icon = icons[alert.type] || ShieldCheck;
            return (
              <div key={alert.id} className="flex items-center gap-3 rounded-md px-1 py-2.5 hover:bg-[#10243b]">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${styles[alert.severity]}`}><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{alert.type}</p><p className="truncate text-[10px] text-[#72a8e5]">{alert.vehicle.id} · {alert.vehicle.locationLabel}</p></div>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${styles[alert.severity]}`}>{alert.severity}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center text-center"><ShieldCheck className="h-7 w-7 text-success" /><p className="mt-3 text-sm font-medium">No current rule-based alerts</p><p className="mt-1 text-xs text-muted-foreground">The API payload is within the available Demo thresholds.</p></div>
      )}
    </section>
  );
}
