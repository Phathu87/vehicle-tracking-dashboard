import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Bell, Fuel, Gauge, ShieldCheck } from 'lucide-react';
import { alertsApi } from '@/api/alerts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const severityClass = { critical: 'bg-danger/10 text-danger', warning: 'bg-warning/10 text-warning', info: 'bg-primary/10 text-primary' };
const typeIcon = { overspeed: Gauge, low_fuel: Fuel, geofence_entry: ShieldCheck, geofence_exit: ShieldCheck };
const selectClass = 'h-9 rounded-md border border-[#1b3551] bg-[#091a2e] px-3 text-xs outline-none focus:border-primary';

function label(value) { return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); }

export default function Alerts() {
  const [severity, setSeverity] = useState('all');
  const [type, setType] = useState('all');
  const [state, setState] = useState('all');
  const alertsQuery = useQuery({ queryKey: ['alerts'], queryFn: ({ signal }) => alertsApi.list({ signal }), refetchInterval: 15_000 });
  const typesQuery = useQuery({ queryKey: ['alert-types'], queryFn: ({ signal }) => alertsApi.types({ signal }) });
  const alerts = Array.isArray(alertsQuery.data) ? alertsQuery.data : [];
  const filtered = useMemo(() => alerts.filter((alert) => severity === 'all' || alert.severity === severity).filter((alert) => type === 'all' || alert.type === type).filter((alert) => state === 'all' || alert.state === state), [alerts, severity, type, state]);
  const types = typesQuery.data?.types || [];

  return (
    <div className="space-y-4 pb-8">
      <div><h1 className="font-heading text-xl font-bold">Alerts</h1><p className="text-xs text-muted-foreground">Persisted telemetry and geofence events · read-only state</p></div>
      <div className="flex flex-wrap gap-2"><select value={severity} onChange={(event) => setSeverity(event.target.value)} className={selectClass}><option value="all">All severities</option><option value="critical">Critical</option><option value="warning">Warning</option><option value="info">Info</option></select><select value={type} onChange={(event) => setType(event.target.value)} className={selectClass}><option value="all">All supported types</option>{types.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select><select value={state} onChange={(event) => setState(event.target.value)} className={selectClass}><option value="all">All states</option><option value="open">Open</option></select></div>
      {alertsQuery.isPending ? <div className="space-y-2">{Array.from({ length: 7 }, (_, index) => <Skeleton key={index} className="h-20 rounded-lg" />)}</div> : alertsQuery.isError ? <div className="rounded-lg border border-danger/30 bg-danger/5 p-8 text-center"><AlertCircle className="mx-auto h-7 w-7 text-danger" /><p className="mt-2 text-sm">{alertsQuery.error.message}</p><Button className="mt-4" onClick={() => alertsQuery.refetch()}>Retry</Button></div> : filtered.length ? <div className="overflow-hidden rounded-lg border border-[#1b3551] bg-[#091a2e]"><div className="hidden grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-3 border-b border-[#1b3551] px-4 py-2 text-[10px] uppercase text-[#60748d] md:grid"><span>Severity</span><span>Vehicle</span><span>Driver</span><span>Type</span><span>Time</span><span>State</span></div>{filtered.map((alert) => { const Icon = typeIcon[alert.type] || Bell; return <article key={alert.id} className="grid gap-2 border-b border-[#1b3551] px-4 py-3 last:border-0 md:grid-cols-[auto_1fr_1fr_1fr_1fr_auto] md:items-center md:gap-3"><span className={cn('w-fit rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', severityClass[alert.severity] || severityClass.info)}>{alert.severity}</span><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /><div><p className="text-xs font-semibold">{alert.vehicleId}</p><p className="text-[10px] text-[#8298b2]">{alert.plate}</p></div></div><p className="text-xs">{alert.driver || 'Unassigned'}</p><div><p className="text-xs">{label(alert.type)}</p><p className="mt-0.5 text-[10px] text-[#8298b2]">{alert.message}</p></div><time className="text-[11px] text-[#8298b2]">{new Date(alert.recordedAt).toLocaleString()}</time><span className="text-[10px] uppercase text-warning">{alert.state}</span></article>; })}</div> : <div className="rounded-lg border border-border bg-card p-12 text-center"><Bell className="mx-auto h-7 w-7 text-success" /><p className="mt-3 text-sm font-medium">No persisted alerts match these filters</p><p className="mt-1 text-xs text-muted-foreground">Alerts appear only after supported telemetry or geofence rules fire.</p></div>}
      <p className="text-[11px] text-[#60748d]">Acknowledgement is not exposed because the backend currently stores alert state as read-only.</p>
    </div>
  );
}
