import React from 'react';
import MapView from '../components/MapView.jsx';
import VehicleList from '../components/VehicleList.jsx';
import SearchFilter from '../components/SearchFilter.jsx';
import KpiCards from '../components/KpiCards.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import TopbarCarousel from '../components/TopbarCarousel.jsx';


export default function DashboardPage({ kpis, filtered, q, setQ, err, loading, selected, setSelected, history }) {
  return (
    <div className="content">
      {/* Mobile carousel */}
  <TopbarCarousel />
      <header className="topbar flex justify-between items-center">
        <h1>Vehicle Tracking Dashboard</h1>
        <div className="topbar-right flex gap-2 items-center">
          <span className="muted">Auto-Refresh: 30s</span>
          <span className="pill on">ON</span>
        </div>
      </header>

      <KpiCards kpis={kpis} />

      <div className="controls my-4">
        <SearchFilter value={q} onChange={setQ} />
      </div>

      {err && <ErrorBanner message={err} />}
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
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
    </div>
  );
}
