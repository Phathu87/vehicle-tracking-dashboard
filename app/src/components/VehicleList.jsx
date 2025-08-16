import React from 'react';

export default function VehicleList({ vehicles, selected, onSelect }) {
  return (
  <div className="panel list">
  <div className="panel-header">
    <span>Vehicles</span>
  </div>

  {/* Scrollable container */}
  <div className="table-container">
    <div className="table">
      <div className="row header">
        <div>ID</div>
        <div>Driver</div>
        <div>Speed</div>
        <div>Last Seen</div>
        <div>Status</div>
      </div>
      {vehicles.map(v => {
        const isSel = selected?.id === v.id;
        return (
          <button
            key={v.id}
            className={`row ${isSel ? 'selected' : ''}`}
            onClick={() => onSelect(v)}
            title="Click to center & zoom"
          >
            <div>{v.id}</div>
            <div>{v.driver}</div>
            <div>{v.speed} km/h</div>
            <div>{new Date(v.lastSeen).toLocaleTimeString()}</div>
            <div className={`status ${v.status.toLowerCase()}`}>{v.status}</div>
          </button>
        );
      })}
    </div>
  </div>
</div>
  );
}
