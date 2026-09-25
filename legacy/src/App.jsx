import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import DashboardPage from "./pages/Dashboard.jsx";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { fetchVehicles, fetchVehicleHistory } from './api';

const REFRESH_MS = 30_000;

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(
    () => vehicles.filter(v => v.id.toLowerCase().includes(q.trim().toLowerCase())),
    [vehicles, q]
  );

  const kpis = useMemo(() => {
    const total = vehicles.length;
    const online = vehicles.filter(v => v.status === 'Online').length;
    const alerts = vehicles.filter(v => v.status === 'Offline' || v.speed > 80).length;
    const avgFuel = 7.3;
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
    <div className="app-wrapper flex flex-col min-h-screen">

      <div className="layout flex flex-1">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="content flex-1">
          <Routes>
            <Route path="/" element={
              <DashboardPage
                kpis={kpis}
                vehicles={vehicles}
                filtered={filtered}
                q={q}
                setQ={setQ}
                err={err}
                loading={loading}
                selected={selected}
                setSelected={setSelected}
                history={history}
              />
            }/>
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

