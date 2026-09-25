import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON = { call: Phone, message: MessageSquare, email: Mail };
const COLOR = { call: 'text-primary', message: 'text-success', email: 'text-info' };

export default function ContactHistory({ events }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-heading font-semibold text-sm mb-4">Contact History</h3>
      <div className="space-y-3">
        {events.map((e, i) => {
          const Icon = ICON[e.type] || Phone;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-lg bg-secondary flex items-center justify-center', COLOR[e.type])}><Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0"><p className="text-sm truncate">{e.note}</p><p className="text-[11px] text-muted-foreground capitalize">{e.type}</p></div>
              <span className="text-xs text-muted-foreground shrink-0">{e.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}