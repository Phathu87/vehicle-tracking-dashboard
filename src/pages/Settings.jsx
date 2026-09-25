import React, { useState, useEffect } from 'react';
import { Shield, Bell, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const NOTIF_PREFS = [
  ['maintenance', 'Maintenance alerts', 'Trigger when a vehicle reaches its service limit'],
  ['alerts', 'Real-time alerts', 'Speed, geofence and fuel warnings'],
  ['driver', 'Driver updates', 'Licence expiries and performance changes'],
  ['reports', 'Weekly reports', 'Fleet summary every Monday'],
];
const PREFERENCES_KEY = 'fleet-drive:notification-preferences';

function readPreferences() {
  try {
    const saved = localStorage.getItem(PREFERENCES_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function Settings() {
  const { user, logout } = useAuth();
  const [notif, setNotif] = useState(() => readPreferences() || { maintenance: true, alerts: true, reports: false, driver: true });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.notification_preferences) setNotif(user.notification_preferences);
  }, [user]);

  const savePrefs = () => {
    setSaving(true);
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(notif));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const name = user?.name || user?.full_name || 'Demo Operator';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const email = user?.email || user?.username || '—';
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Demo access';

  return (
    <div className="space-y-4 max-w-3xl">
      <div><h1 className="font-heading text-xl font-bold">Settings</h1><p className="text-sm text-muted-foreground">Manage your account and preferences</p></div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-lg font-semibold">{initials}</div>
          <div className="flex-1 min-w-0"><p className="font-heading font-semibold truncate">{name}</p><p className="text-sm text-muted-foreground truncate">{email}</p></div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">{role}</span>
        </div>
        <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground mb-1">Full name</p><p className="font-medium truncate">{name}</p></div>
          <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground mb-1">Email</p><p className="font-medium truncate">{email}</p></div>
          <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground mb-1">Role</p><p className="font-medium">{role}</p></div>
          <div className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground mb-1">User ID</p><p className="font-medium truncate">{user?.id || '—'}</p></div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-1 flex items-center gap-2"><Bell className="w-4 h-4" />Demo notification preferences</h3>
        <p className="mb-4 text-xs text-muted-foreground">Stored on this device only. No email, SMS or push provider is connected.</p>
        <div className="space-y-4">
          {NOTIF_PREFS.map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="min-w-0"><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              <Switch checked={notif[key]} onCheckedChange={v => setNotif(s => ({ ...s, [key]: v }))} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-success">Saved on this device</span>}
          <Button size="sm" onClick={savePrefs} disabled={saving}><Save className="w-4 h-4 mr-1" />{saving ? 'Saving…' : 'Save preferences'}</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4" />Session</h3>
        <p className="text-sm text-muted-foreground mb-4">Sign out of your account on this device.</p>
        <Button variant="destructive" onClick={() => logout()}><LogOut className="w-4 h-4 mr-1" />Sign out</Button>
      </div>
    </div>
  );
}
