import React, { useEffect, useMemo, useState } from 'react';
import { fetchVehicles, fetchVehicleHistory } from './api';
import MapView from './components/MapView.jsx';
import VehicleList from './components/VehicleList.jsx';
import SearchFilter from './components/SearchFilter.jsx';
import KpiCards from './components/KpiCards.jsx';
import Loader from './components/Loader.jsx';
import ErrorBanner from './components/ErrorBanner.jsx';
import Sidebar from './components/Sidebar.jsx';


const REFRESH_MS = 30_000;

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const filtered = useMemo(
    () => vehicles.filter(v => v.id.toLowerCase().includes(q.trim().toLowerCase())),
    [vehicles, q]
  );

  const kpis = useMemo(() => {
    const total = vehicles.length;
    const online = vehicles.filter(v => v.status === 'Online').length;
    const alerts = vehicles.filter(v => v.status === 'Offline' || v.speed > 80).length;
    const avgFuel = 7.3; // placeholder
    return { total, online, alerts, avgFuel };
  }, [vehicles]);

  async function load() {
    try {
      setErr(null);
      const data = await fetchVehicles();
      setVehicles(data);
    } catch {
      setErr('Failed to fetch vehicles.');
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(id) {
    try {
      const hist = await fetchVehicleHistory(id);
      setHistory(hist);
    } catch {
      setHistory([]);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selected) return;
    loadHistory(selected.id);
    const t = setInterval(() => loadHistory(selected.id), REFRESH_MS);
    return () => clearInterval(t);
  }, [selected]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">FleetTrack</div>
        <nav>
          <a className="active">Dashboard</a>
          <a>Vehicles</a>
          <a>Drivers</a>
          <a>Alerts</a>
          <a>Reports</a>
          <a>Settings</a>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>Vehicle Tracking Dashboard</h1>
          <div className="topbar-right">
            <span className="muted">Auto-Refresh: 30s</span>
            <span className="pill on">ON</span>
          </div>
        </header>

        <KpiCards kpis={kpis} />

        <div className="controls">
          <SearchFilter value={q} onChange={setQ} />
        </div>

        {err && <ErrorBanner message={err} />}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid">
            <MapView
              vehicles={filtered}
              selected={selected}
              onSelect={setSelected}
              history={history}
            />
            <VehicleList
              vehicles={filtered}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        )}
      </main>
    </div>
  );
}
