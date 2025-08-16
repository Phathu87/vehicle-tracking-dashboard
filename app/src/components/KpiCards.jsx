import React from 'react';

export default function KpiCards({ kpis }) {
  return (
    <div className="kpis">
      <div className="kpi">
        <div className="kpi-label">Total Vehicles</div>
        <div className="kpi-value">{kpis.total}</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Online</div>
        <div className="kpi-value">{kpis.online}</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Active Alerts</div>
        <div className="kpi-value">{kpis.alerts}</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Fuel Usage (L/100km)</div>
        <div className="kpi-value">{kpis.avgFuel}</div>
      </div>
    </div>
  );
}
