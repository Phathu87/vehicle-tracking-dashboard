import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Clock3 } from 'lucide-react';

export default function DistanceOverTime({ data, available }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-sm font-semibold">Distance Over Time</h2><p className="mt-1 text-[11px] text-muted-foreground">Requires position history</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">{available ? 'API DATA' : 'BACKEND GAP'}</span></div>
      {available ? (
        <div className="mt-4 h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ left: -22, right: 6 }}><defs><linearGradient id="distance-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1769ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#1769ff" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#203650" vertical={false} /><XAxis dataKey="point" tick={{ fill: '#687c94', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#687c94', fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: '#0b1a2d', border: '1px solid #203650', borderRadius: 8, fontSize: 12 }} /><Area type="monotone" dataKey="distance" unit=" km" stroke="#1769ff" strokeWidth={2} fill="url(#distance-fill)" /></AreaChart></ResponsiveContainer></div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center text-center"><Clock3 className="h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">History is not available</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">The current vehicle response contains no position history. No distance series is fabricated.</p></div>
      )}
    </section>
  );
}
