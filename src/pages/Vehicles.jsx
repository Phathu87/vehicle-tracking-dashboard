import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ChevronLeft, ChevronRight, LayoutGrid, Search, Table2 } from 'lucide-react';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleTable from '@/components/vehicles/VehicleTable';
import { getVehicles } from '@/api/vehicles';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 24;
const selectClass = 'h-9 rounded-md border border-[#1b3551] bg-[#091a2e] px-3 text-xs text-white outline-none focus:border-primary';

function compareVehicles(sort, direction) {
  const factor = direction === 'desc' ? -1 : 1;
  return (a, b) => {
    const left = sort === 'lastSeen' ? Date.parse(a[sort]) || 0 : a[sort] ?? '';
    const right = sort === 'lastSeen' ? Date.parse(b[sort]) || 0 : b[sort] ?? '';
    return (typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left).localeCompare(String(right), undefined, { numeric: true })) * factor;
  };
}

function VehicleListSkeleton() {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{Array.from({ length: 12 }, (_, index) => <Skeleton key={index} className="h-56 rounded-lg" />)}</div>;
}

export default function Vehicles() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('id');
  const [direction, setDirection] = useState('asc');
  const [view, setView] = useState('table');
  const [page, setPage] = useState(1);
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: ({ signal }) => getVehicles({ signal }),
    refetchInterval: 15_000,
  });

  const vehicles = Array.isArray(vehiclesQuery.data) ? vehiclesQuery.data : [];
  const cities = useMemo(() => [...new Set(vehicles.map((vehicle) => vehicle.city).filter(Boolean))].sort(), [vehicles]);
  const statuses = useMemo(() => [...new Set(vehicles.map((vehicle) => vehicle.status).filter(Boolean))].sort(), [vehicles]);
  const filtered = useMemo(() => vehicles
    .filter((vehicle) => city === 'all' || vehicle.city === city)
    .filter((vehicle) => status === 'all' || vehicle.status === status)
    .filter((vehicle) => {
      if (!query.trim()) return true;
      const haystack = [vehicle.id, vehicle.plate, vehicle.make, vehicle.model, vehicle.driver, vehicle.city].join(' ').toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort(compareVehicles(sort, direction)), [vehicles, city, status, query, sort, direction]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageVehicles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query, city, status, sort, direction]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-heading text-xl font-bold">Vehicles</h1><p className="text-xs text-muted-foreground">{vehicles.length} database records · refreshed every 15 seconds</p></div>
        <div className="inline-flex rounded-md border border-[#1b3551] bg-[#091a2e] p-0.5">
          <button type="button" aria-label="Grid view" onClick={() => setView('grid')} className={cn('grid h-8 w-8 place-items-center rounded', view === 'grid' && 'bg-primary text-white')}><LayoutGrid className="h-4 w-4" /></button>
          <button type="button" aria-label="Table view" onClick={() => setView('table')} className={cn('grid h-8 w-8 place-items-center rounded', view === 'table' && 'bg-primary text-white')}><Table2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_repeat(4,auto)]">
        <label className="relative"><span className="sr-only">Search vehicles</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, plate, make, model or driver" className="h-9 w-full rounded-md border border-[#1b3551] bg-[#091a2e] pl-9 pr-3 text-xs text-white outline-none focus:border-primary" /></label>
        <select aria-label="City filter" value={city} onChange={(event) => setCity(event.target.value)} className={selectClass}><option value="all">All cities</option>{cities.map((value) => <option key={value}>{value}</option>)}</select>
        <select aria-label="Status filter" value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass}><option value="all">All statuses</option>{statuses.map((value) => <option key={value}>{value}</option>)}</select>
        <select aria-label="Sort vehicles" value={sort} onChange={(event) => setSort(event.target.value)} className={selectClass}><option value="id">Sort: ID</option><option value="make">Make</option><option value="driver">Driver</option><option value="speed">Speed</option><option value="mileage">Mileage</option><option value="fuel">Fuel</option><option value="city">City</option><option value="lastSeen">Last seen</option></select>
        <select aria-label="Sort direction" value={direction} onChange={(event) => setDirection(event.target.value)} className={selectClass}><option value="asc">Ascending</option><option value="desc">Descending</option></select>
      </div>

      {vehiclesQuery.isPending ? <VehicleListSkeleton /> : vehiclesQuery.isError ? (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-8 text-center"><AlertCircle className="mx-auto h-7 w-7 text-danger" /><h2 className="mt-3 font-semibold">Vehicle API unavailable</h2><p className="mt-1 text-sm text-muted-foreground">{vehiclesQuery.error.message}</p><Button className="mt-4" onClick={() => vehiclesQuery.refetch()}>Retry</Button></div>
      ) : pageVehicles.length ? (
        view === 'table' ? <VehicleTable vehicles={pageVehicles} /> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{pageVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} driver={vehicle.driver ? { name: vehicle.driver } : null} />)}</div>
      ) : <div className="rounded-lg border border-border bg-card p-10 text-center"><p className="font-medium">No vehicles match these filters</p><p className="mt-1 text-xs text-muted-foreground">Adjust the search, city, or status filter.</p></div>}

      {!vehiclesQuery.isPending && !vehiclesQuery.isError && filtered.length > 0 && <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="h-4 w-4" /></Button><span>Page {page} of {pageCount}</span><Button variant="outline" size="icon" className="h-8 w-8" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight className="h-4 w-4" /></Button></div></div>}
    </div>
  );
}
