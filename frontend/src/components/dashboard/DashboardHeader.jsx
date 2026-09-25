import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, ChevronDown, LogOut, Settings as SettingsIcon, Wrench, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { buildMaintenanceNotifications, getDismissedIds, dismissNotifications } from '@/lib/maintenanceNotifications';
import { demoApi } from '@/api/demo';

export default function DashboardHeader({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const notifications = useMemo(() => buildMaintenanceNotifications(), []);
  const [dismissed, setDismissed] = useState(() => getDismissedIds());
  const active = notifications.filter(n => !dismissed.includes(n.id));
  const unread = active.length;
  const demoStatus = useQuery({ queryKey: ['demo-status'], queryFn: ({ signal }) => demoApi.status({ signal }), refetchInterval: 15_000, retry: false });
  const name = user?.name || user?.full_name || 'Demo Operator';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Demo access';
  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/app/vehicles?search=${encodeURIComponent(value)}` : '/app/vehicles');
  };
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-[#1b3551] bg-[#071627] px-3 lg:px-4">
      <button onClick={onMenuToggle} className="flex h-8 w-8 items-center justify-center rounded-md text-[#9aadc2] hover:bg-[#10243b] hover:text-white" aria-label="Toggle menu"><Menu className="w-[18px] h-[18px]" /></button>
      <form onSubmit={submitSearch} className="relative min-w-0 flex-1 max-w-[360px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#728aa5]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search vehicles" placeholder="Search vehicles, drivers, alerts..." className="h-9 w-full rounded-lg border border-[#1b3551] bg-[#0b1d32] pl-9 pr-14 text-xs text-white outline-none placeholder:text-[#728aa5] focus:border-primary focus:ring-1 focus:ring-primary/30" />
        <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-[#294561] px-1.5 py-0.5 font-mono text-[8px] text-[#6f88a2] sm:block">Ctrl /</span>
      </form>
      <span className="hidden items-center gap-1.5 whitespace-nowrap text-[9px] font-semibold uppercase text-[#8298b2] md:flex" title={demoStatus.data?.error || undefined}><span className={`h-1.5 w-1.5 rounded-full ${demoStatus.data?.active ? 'bg-success' : 'bg-warning'}`} />{demoStatus.data?.active ? 'Simulated telemetry active' : 'Demo data static'}</span>
      <div className="flex items-center gap-1 ml-auto">
        <button onClick={toggleTheme} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#10243b]" aria-label="Toggle day/night theme" title={theme === 'dark' ? 'Switch to day' : 'Switch to night'}>
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#9aadc2]" /> : <Moon className="w-4 h-4 text-[#9aadc2]" />}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#10243b]" aria-label="Notifications">
              <Bell className="w-4 h-4 text-[#9aadc2]" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-[9px] font-semibold text-white flex items-center justify-center">{unread}</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <div><span className="block text-xs font-semibold">Notifications</span><span className="block text-[10px] text-muted-foreground">Demo maintenance indicators</span></div>
              {unread > 0 && <button onClick={() => { const ids = notifications.map(n => n.id); dismissNotifications(ids); setDismissed(ids); }} className="text-[11px] text-primary hover:underline">Mark all read</button>}
            </div>
            <DropdownMenuSeparator />
            {active.map(n => (
              <DropdownMenuItem key={n.id} asChild className="items-start gap-2.5 py-2.5 cursor-pointer">
                <Link to="/app/maintenance">
                  <Wrench className={`w-4 h-4 mt-0.5 ${n.overdue ? 'text-danger' : 'text-warning'}`} />
                  <div className="min-w-0"><p className="text-sm leading-snug">{n.title}</p><p className="text-[11px] text-muted-foreground mt-0.5">{n.detail}</p></div>
                </Link>
              </DropdownMenuItem>
            ))}
            {unread === 0 && <div className="py-6 text-center text-xs text-muted-foreground">You're all caught up</div>}
          </DropdownMenuContent>
        </DropdownMenu>
        <button type="button" disabled className="hidden h-8 w-8 items-center justify-center rounded-md text-[#71869d] sm:flex" aria-label="Messages unavailable" title="Messages are not available in the Demo"><Mail className="h-4 w-4" /></button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden items-center gap-2 border-l border-[#1b3551] pl-3 outline-none sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">{initials}</div>
              <div className="hidden max-w-40 text-left md:block"><p className="truncate text-[10px] font-semibold leading-tight text-white">{name}</p><p className="text-[9px] text-[#728aa5]">{role}</p></div>
              <ChevronDown className="w-3.5 h-3.5 text-[#728aa5]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Signed in as {name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/app/settings" className="cursor-pointer"><SettingsIcon className="w-4 h-4 mr-2" />Settings</Link></DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => logout()}><LogOut className="w-4 h-4 mr-2" />Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
