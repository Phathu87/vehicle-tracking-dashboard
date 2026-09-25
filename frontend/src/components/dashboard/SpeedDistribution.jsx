import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function SpeedDistribution({ data, total }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="font-heading text-sm font-semibold">Speed Distribution</h2>
      <p className="mt-1 text-xs text-muted-foreground">Current API snapshot · {total} vehicles</p>
      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={45} outerRadius={62} paddingAngle={2} strokeWidth={0}>{data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ background: '#0b1a2d', border: '1px solid #203650', borderRadius: 8, fontSize: 12 }} /></PieChart></ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="font-heading text-xl">{total}</strong><span className="text-[10px] text-muted-foreground">vehicles</span></div>
      </div>
      <div className="grid grid-cols-2 gap-2">{data.map((entry) => <div key={entry.name} className="flex items-center justify-between text-[11px]"><span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />{entry.name} km/h</span><strong>{entry.value}</strong></div>)}</div>
    </section>
  );
}
