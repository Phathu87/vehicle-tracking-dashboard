import { Link } from 'react-router-dom';
import { ArrowUpRight, Bell, Fuel, MapPin, Navigation, Truck, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getVehicles } from '@/api/vehicles';
import { buildDashboardModel } from '@/lib/dashboardModel';

export default function LandingDashboardPreview() {
  const vehiclesQuery = useQuery({ queryKey: ['public', 'dashboard-preview'], queryFn: ({ signal }) => getVehicles({ signal }), staleTime: 60_000 });
  const model = buildDashboardModel(vehiclesQuery.data);
  const value = (number) => vehiclesQuery.isPending ? '...' : vehiclesQuery.isError ? 'Unavailable' : number;
  const recentVehicles = model.recentVehicles.slice(0, 4);

  return (
    <section className="border-y border-border bg-[#07111f] py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-cyan-300">Working dashboard</p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Move from fleet overview to operational detail.</h2>
            <p className="mt-4 text-white/65">This preview is calculated from the same simulated dataset used by the Demo interface.</p>
          </div>
          <Button asChild variant="outline" className="w-fit border-white/25 bg-white/5 text-white hover:bg-white hover:text-[#07111f]"><Link to="/app/dashboard">Open the dashboard <ArrowUpRight className="h-4 w-4" /></Link></Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0b1727] shadow-2xl shadow-black/30">
          <div className="flex h-12 items-center justify-between border-b border-white/10 px-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold"><Truck className="h-4 w-4 text-blue-400" /> Fleet overview</div>
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">SIMULATED DATA</span>
          </div>
          <div className="grid gap-px bg-white/10 lg:grid-cols-[1fr_1.6fr]">
            <div className="bg-[#0b1727] p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  [Truck, value(model.vehicles.length), 'Vehicles', 'text-blue-400'],
                  [Navigation, value(model.activeCount), 'Active now', 'text-emerald-400'],
                  [Users, value(model.driverCount), 'Assigned drivers', 'text-cyan-300'],
                  [Bell, value(model.alerts.length), 'Need attention', 'text-amber-400'],
                ].map(([Icon, value, label, color]) => (
                  <div key={label} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <p className="mt-3 font-heading text-2xl font-bold">{value}</p>
                    <p className="text-[11px] text-white/50">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-md border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-white/55"><Fuel className="h-4 w-4 text-amber-400" /> Average fuel</span><strong>{model.averageFuel === null ? 'Unavailable' : `${value(model.averageFuel)}%`}</strong></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-400" style={{ width: `${model.averageFuel || 0}%` }} /></div>
              </div>
            </div>

            <div className="bg-[#0e1c2d] p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold">Vehicle activity</h3><span className="text-[11px] text-white/45">{vehiclesQuery.isError ? 'API unavailable' : 'API snapshot'}</span></div>
              <div className="relative min-h-56 overflow-hidden rounded-md border border-white/10 bg-[#08121f] p-4">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
                <div className="relative grid gap-2 sm:grid-cols-2">
                  {recentVehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="flex items-center gap-3 rounded-md border border-white/10 bg-[#0b1727]/95 p-3" style={{ marginTop: index % 2 ? '1.25rem' : 0 }}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${vehicle.status === 'moving' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}><MapPin className="h-4 w-4" /></span>
                      <div className="min-w-0"><p className="truncate text-xs font-semibold">{vehicle.id} · {vehicle.plate}</p><p className="truncate text-[10px] text-white/50">{vehicle.area} · {vehicle.speed} km/h</p></div>
                    </div>
                  ))}
                  {!vehiclesQuery.isPending && recentVehicles.length === 0 && <p className="text-xs text-white/55">No vehicle records are available.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
