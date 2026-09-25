import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';
import KpiCards from '@/components/dashboard/KpiCards';
import LiveMap from '@/components/dashboard/LiveMap';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import RecentVehicles from '@/components/dashboard/RecentVehicles';
import SpeedDistribution from '@/components/dashboard/SpeedDistribution';
import DistanceOverTime from '@/components/dashboard/DistanceOverTime';
import TodaysPerformance from '@/components/dashboard/TodaysPerformance';
import FuelConsumption from '@/components/dashboard/FuelConsumption';
import MaintenanceOverview from '@/components/dashboard/MaintenanceOverview';
import DriverLeaderboard from '@/components/dashboard/DriverLeaderboard';
import QuickActions from '@/components/dashboard/QuickActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getVehicles } from '@/api/vehicles';
import { alertsApi } from '@/api/alerts';
import { driversApi } from '@/api/drivers';
import { maintenanceApi } from '@/api/maintenance';
import { buildDashboardModel } from '@/lib/dashboardModel';

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading dashboard">
      <div className="space-y-2"><Skeleton className="h-7 w-40" /><Skeleton className="h-4 w-72 max-w-full" /></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28 rounded-lg" />)}</div>
      <div className="grid gap-4 lg:grid-cols-3"><Skeleton className="aspect-[16/9] rounded-lg lg:col-span-2" /><Skeleton className="min-h-72 rounded-lg" /></div>
      <div className="grid gap-4 lg:grid-cols-3"><Skeleton className="h-72 rounded-lg lg:col-span-2" /><Skeleton className="h-72 rounded-lg" /></div>
    </div>
  );
}

function DashboardMessage({ icon: Icon, title, message, action }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
        <h1 className="mt-4 font-heading text-lg font-bold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
        {action}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const vehiclesQuery = useQuery({
    queryKey: ['dashboard', 'vehicles'],
    queryFn: ({ signal }) => getVehicles({ signal }),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });
  const alertsQuery = useQuery({ queryKey: ['dashboard', 'alerts'], queryFn: ({ signal }) => alertsApi.list({ signal }), refetchInterval: 15_000, refetchIntervalInBackground: false });
  const driversQuery = useQuery({ queryKey: ['dashboard', 'drivers'], queryFn: ({ signal }) => driversApi.list({ signal }), refetchInterval: 30_000, refetchIntervalInBackground: false });
  const maintenanceQuery = useQuery({ queryKey: ['dashboard', 'maintenance'], queryFn: ({ signal }) => maintenanceApi.list({ signal }), refetchInterval: 30_000, refetchIntervalInBackground: false });
  const queries = [vehiclesQuery, alertsQuery, driversQuery, maintenanceQuery];

  if (queries.some((query) => query.isPending)) return <DashboardSkeleton />;
  const failedQuery = queries.find((query) => query.isError);
  if (failedQuery) {
    return (
      <DashboardMessage
        icon={AlertCircle}
        title="Dashboard data unavailable"
        message={failedQuery.error?.message || 'The Fleet Drive API could not be reached.'}
        action={<Button className="mt-5" onClick={() => Promise.all(queries.map((query) => query.refetch()))}><RefreshCw className="h-4 w-4" /> Retry</Button>}
      />
    );
  }

  const model = buildDashboardModel(vehiclesQuery.data, {
    alerts: alertsQuery.data,
    drivers: driversQuery.data,
    maintenance: maintenanceQuery.data,
  });
  if (!model.vehicles.length) {
    return <DashboardMessage icon={Database} title="No fleet data yet" message="The API returned an empty vehicle dataset. Add data at the source to populate this dashboard." />;
  }

  return (
    <div className="space-y-3 pb-4">
      <h1 className="sr-only">Operational Dashboard</h1>

      <KpiCards model={model} />

      <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="min-w-0"><LiveMap vehicles={model.vehicles} /></div>
        <RecentAlerts alerts={model.alerts} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2"><RecentVehicles vehicles={model.recentVehicles} /></div>
        <SpeedDistribution data={model.speedDistribution} total={model.vehicles.length} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <TodaysPerformance model={model} />
        <DistanceOverTime data={model.distanceSeries} available={model.historyAvailable} />
        <MaintenanceOverview data={model.maintenance} available={model.maintenanceAvailable} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <FuelConsumption consumption={model.fuelConsumption} available={model.fuelConsumptionAvailable} />
        <div className="min-w-0 lg:col-span-2"><DriverLeaderboard drivers={model.topDrivers} /></div>
      </div>

      <QuickActions />
    </div>
  );
}
