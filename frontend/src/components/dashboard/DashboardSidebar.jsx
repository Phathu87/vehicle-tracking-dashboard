import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, LayoutDashboard, Car, Users, Bell, Wrench, Shield, FileText, Route, BarChart3, Fuel, UserCog, Settings, ChevronDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
  { label: 'Vehicles', icon: Car, href: '/app/vehicles' },
  { label: 'Drivers', icon: Users, href: '/app/drivers' },
  { label: 'Alerts', icon: Bell, href: '/app/alerts' },
  { label: 'Maintenance', icon: Wrench, href: '/app/maintenance' },
  { label: 'Geofences', icon: Shield, href: '/app/geofences' },
  { label: 'Route Optimisation', icon: Route, href: '/app/routes' },
  { label: 'Reports', icon: FileText, href: '/app/reports' },
  { label: 'Analytics', icon: BarChart3, href: '/app/analytics' },
  { label: 'Fuel Management', icon: Fuel, href: '/app/fuel' },
  { label: 'User Management', icon: UserCog, href: '/app/users' },
  { label: 'Settings', icon: Settings, href: '/app/settings' },
];

export default function DashboardSidebar({ collapsed, onNavigate }) {
  const loc = useLocation();
  const { user } = useAuth();
  const name = user?.name || user?.full_name || 'Demo Operator';
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Demo access';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <aside className={cn('flex h-full w-full flex-col border-r border-[#1b3551] bg-[#071627] transition-all duration-300', collapsed ? 'lg:w-16' : 'lg:w-[205px]')}>
      <div className="flex h-[52px] shrink-0 items-center gap-2 px-4 border-b border-[#1b3551]">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15"><Truck className="w-4 h-4 text-primary" /></div>
        {!collapsed && <><span className="font-heading text-xs font-bold text-white">Fleet Drive AI</span><span className="ml-auto rounded border border-[#294561] px-1.5 py-0.5 text-[7px] font-semibold text-[#7890a9]">DEMO</span></>}
      </div>
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        {NAV.map(item => {
          const active = loc.pathname === item.href || loc.pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} to={item.href} onClick={onNavigate} aria-current={active ? 'page' : undefined} title={collapsed ? item.label : undefined} className={cn('group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors', active ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-[#9eb0c3] hover:bg-[#10243b] hover:text-white')}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      {!collapsed && <div className="mx-2.5 mb-2 rounded-lg border border-[#1b3551] bg-[#0b1d32] p-3">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-white"><span className="h-2 w-2 rounded-full bg-success" /><Activity className="h-3 w-3 text-[#8ea4ba]" /> Demo Environment</div>
        <p className="mt-2 text-[9px] text-[#7f96ae]">Express API session connected</p>
        <p className="mt-1 text-[8px] text-[#527aa3]">Simulated operational data</p>
      </div>}
      <div className="border-t border-[#1b3551] p-2.5 shrink-0">
        <Link to="/app/settings" onClick={onNavigate} className={cn('flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-semibold shrink-0">{initials}</div>
          {!collapsed && <div className="flex-1 min-w-0"><p className="text-[10px] font-medium text-white truncate">{name}</p><p className="text-[9px] text-[#728aa5] truncate">{role}</p></div>}
          {!collapsed && <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </Link>
      </div>
    </aside>
  );
}
