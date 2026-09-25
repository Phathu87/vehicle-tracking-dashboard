import { useQuery } from '@tanstack/react-query';
import { getVehicles } from '@/api/vehicles';

export default function LandingStats() {
  const vehiclesQuery = useQuery({ queryKey: ['public', 'fleet-stats'], queryFn: ({ signal }) => getVehicles({ signal }), staleTime: 60_000 });
  const vehicles = Array.isArray(vehiclesQuery.data) ? vehiclesQuery.data : [];
  const operatingAreas = new Set(vehicles.map((vehicle) => vehicle.city || vehicle.area).filter(Boolean)).size;
  const activeVehicles = vehicles.filter((vehicle) => ['online', 'moving'].includes(String(vehicle.status).toLowerCase())).length;
  const mappedVehicles = vehicles.filter((vehicle) => Number.isFinite(vehicle.lat) && Number.isFinite(vehicle.lng)).length;
  const displayValue = (value) => vehiclesQuery.isPending ? '...' : vehiclesQuery.isError ? 'Unavailable' : value;
  const stats = [
    [displayValue(vehicles.length), 'Simulated vehicles'],
    [displayValue(operatingAreas), 'Operating areas represented'],
    [displayValue(activeVehicles), 'Vehicles active in this snapshot'],
    [displayValue(mappedVehicles), 'API position records'],
  ];

  return (
    <section className="border-y border-border py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-primary">Demo dataset</p><h2 className="mt-2 font-heading text-2xl font-bold">A transparent snapshot, not a customer claim.</h2></div>
          <p className="max-w-lg text-sm text-muted-foreground">These values are calculated from the Express Demo API and change with its simulated dataset.</p>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="bg-card p-5 sm:p-7">
              <p className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">{value}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
