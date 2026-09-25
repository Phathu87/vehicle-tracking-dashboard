import React from 'react';
import { Phone, Mail, Award } from 'lucide-react';

export default function DriverCard({ driver }) {
  if (!driver) return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading font-semibold text-sm mb-3">Assigned Driver</h3>
      <p className="text-sm text-muted-foreground">Unassigned</p>
    </div>
  );
  const initials = driver.name.split(' ').map(n => n[0]).join('');
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading font-semibold text-sm mb-3">Assigned Driver</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-sm font-semibold">{initials}</div>
        <div className="min-w-0"><p className="font-medium truncate">{driver.name}</p><p className="text-xs text-muted-foreground">{driver.id} · Score {driver.score}</p></div>
      </div>
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5 shrink-0" />{driver.phone}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5 shrink-0" />{driver.email}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Award className="w-3.5 h-3.5 shrink-0" />Licence {driver.licence} · exp {driver.licenceExpiry}</div>
      </div>
    </div>
  );
}