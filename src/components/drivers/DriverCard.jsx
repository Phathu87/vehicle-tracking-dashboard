import { Link } from 'react-router-dom';
import { Award, CalendarClock, Car, ChevronRight, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const licenceStyle = {
  valid: 'bg-success/10 text-success',
  expiring: 'bg-warning/10 text-warning',
  expired: 'bg-danger/10 text-danger',
};

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export default function DriverCard({ driver }) {
  return (
    <Link to={`/app/drivers/${driver.id}`} className="group block rounded-lg border border-[#1b3551] bg-[#091a2e] p-4 transition-colors hover:border-primary/60">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">{initials(driver.name)}</div>
        <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold text-white">{driver.name}</h2><p className="mt-0.5 text-[11px] text-[#8298b2]">{driver.id}</p></div>
        <ChevronRight className="h-4 w-4 text-[#60748d] transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <div className="mt-4 space-y-2 text-xs text-[#a9b8ca]">
        <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" />{driver.licenceNumber}</span><span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', licenceStyle[driver.licenceStatus])}>{driver.licenceStatus}</span></div>
        <p className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-[#60748d]" />Expires {driver.licenceExpiry}</p>
        <p className="flex items-center gap-1.5 truncate"><Phone className="h-3.5 w-3.5 text-[#60748d]" />{driver.phone || 'No phone'}</p>
        <p className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5 text-[#60748d]" />{driver.email || 'No email'}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#1b3551] pt-3 text-[11px]"><span className="flex items-center gap-1.5 text-[#8298b2]"><Car className="h-3.5 w-3.5" />{driver.assignedVehicleCount} assigned</span><span className="max-w-[55%] truncate text-right text-white">{driver.assignedPlates.length ? driver.assignedPlates.join(', ') : 'No plates'}</span></div>
    </Link>
  );
}
