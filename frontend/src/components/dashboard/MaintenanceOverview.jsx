import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Wrench } from 'lucide-react';

export default function MaintenanceOverview({ data, available }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-sm font-semibold">Maintenance Overview</h2><p className="mt-1 text-[11px] text-muted-foreground">Persisted tasks and rule-calculated status</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">{available ? 'API DATA' : 'EMPTY'}</span></div>
      {available ? <><div className="relative h-36"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={40} outerRadius={56} strokeWidth={0}>{data.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ background: '#0b1a2d', border: '1px solid #203650', borderRadius: 8, fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="font-heading text-xl">{total}</strong><span className="text-[10px] text-muted-foreground">tasks</span></div></div><div className="space-y-1.5">{data.map((item) => <div key={item.name} className="flex items-center justify-between text-[11px]"><span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.name}</span><strong>{item.value}</strong></div>)}</div></> : <div className="flex min-h-40 flex-col items-center justify-center text-center"><Wrench className="h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">No maintenance tasks</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">The maintenance API returned no records.</p></div>}
    </section>
  );
}
