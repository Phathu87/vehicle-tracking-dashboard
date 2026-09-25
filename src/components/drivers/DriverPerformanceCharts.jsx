import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  fuel: 'hsl(var(--chart-2))',
  speed: 'hsl(var(--chart-1))',
  safety: 'hsl(var(--chart-4))',
};

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
  color: 'hsl(var(--foreground))',
};

function Chart({ title, value, unit, data, dataKey, color, domain }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-heading font-semibold">{title}</h4>
        <span className="text-xs font-medium text-muted-foreground">avg <span className="text-foreground">{value}{unit}</span></span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={domain} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(var(--muted-foreground))' }} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DriverPerformanceCharts({ data }) {
  const avg = (key) => (data.reduce((s, d) => s + d[key], 0) / data.length).toFixed(1);
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <Chart title="Fuel Efficiency" value={avg('fuel')} unit=" km/L" data={data} dataKey="fuel" color={COLORS.fuel} domain={[0, 12]} />
      <Chart title="Speed Adherence" value={avg('speed')} unit="%" data={data} dataKey="speed" color={COLORS.speed} domain={[60, 100]} />
      <Chart title="Safety Score" value={avg('safety')} unit="/100" data={data} dataKey="safety" color={COLORS.safety} domain={[50, 100]} />
    </div>
  );
}