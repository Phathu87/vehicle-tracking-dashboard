import { Bell, Gauge, MapPinned, Truck, Users, Wifi } from 'lucide-react';

const accents = ['text-primary', 'text-success', 'text-info', 'text-danger', 'text-warning', 'text-purple'];

export default function KpiCards({ model }) {
  const kpis = [
    [Truck, 'Total Vehicles', model.vehicles.length],
    [Wifi, 'Online Vehicles', model.activeCount],
    [Users, 'Active Drivers', model.driverCount],
    [Bell, 'Total Alerts', model.alerts.length],
    [Gauge, 'Average Speed', `${model.averageSpeed} km/h`],
    [MapPinned, 'Locations', model.locationCount],
  ];

  return (
    <section aria-label="Fleet key performance indicators" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {kpis.map(([Icon, label, value], index) => (
        <article key={label} className="min-w-0 rounded-lg border border-[#1b3551] bg-[#091a2e] px-3 py-3 transition-colors hover:border-primary/50">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0"><p className="truncate font-heading text-xl font-bold leading-none text-white">{value}</p><p className="mt-2 truncate text-[10px] text-[#91a7c0]">{label}</p></div>
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#10243b] ${accents[index]}`}><Icon className="h-3.5 w-3.5" /></div>
          </div>
        </article>
      ))}
    </section>
  );
}
