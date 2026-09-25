import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const DOT = {
  online: 'bg-success', moving: 'bg-primary', idle: 'bg-purple',
  maintenance: 'bg-warning', offline: 'bg-muted-foreground/40', critical: 'bg-danger',
};
const TXT = {
  online: 'text-success', moving: 'text-primary', idle: 'text-purple',
  maintenance: 'text-warning', offline: 'text-muted-foreground', critical: 'text-danger',
};

function lastSeen(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleString();
}

export default function VehicleTable({ vehicles }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Speed</TableHead>
              <TableHead className="text-right">Fuel</TableHead>
              <TableHead className="text-right">Mileage</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Last seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map(v => {
              return (
                <TableRow key={v.id} className="border-border">
                  <TableCell>
                    <Link to={`/app/vehicles/${v.id}`} className="block">
                      <p className="font-heading font-semibold text-sm">{v.id}</p>
                      <p className="text-[11px] text-muted-foreground">{v.plate} · {v.make} {v.model}</p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/app/vehicles/${v.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium capitalize">
                      <span className={cn('w-2 h-2 rounded-full', DOT[v.status] || DOT.offline)} /><span className={TXT[v.status] || TXT.offline}>{v.status}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{v.driver || <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                  <TableCell className="text-right text-sm">{v.speed} km/h</TableCell>
                  <TableCell className="text-right text-sm">{v.fuel}%</TableCell>
                  <TableCell className="text-right text-sm">{v.mileage.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{v.city || '—'}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground" title={lastSeen(v.lastSeen)}>{lastSeen(v.lastSeen)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
