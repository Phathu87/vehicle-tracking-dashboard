import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then((vehicles) => {
        // Fake alerts: flag vehicles with speed < 30
        const flagged = vehicles.filter((v) => v.speed < 80);
        setAlerts(flagged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const alertSummary = () => {
    const total = alerts.length;
    const slow = alerts.filter(a => a.speed < 80).length;
    const stopped = alerts.filter(a => a.speed === 0).length;
    return { total, slow, stopped };
  };

  const { total, slow, stopped } = alertSummary();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Alerts Dashboard</h1>

      {/* Summary Panel */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <div style={{ background: "var(--panel)", padding: "10px", flex: 1, borderRadius: "8px" }}>
          <strong>Total Alerts:</strong> {total}
        </div>
        <div style={{ background: "var(--panel)", padding: "10px", flex: 1, borderRadius: "8px" }}>
          <strong>Slow Vehicles (&lt;30 km/h):</strong> {slow}
        </div>
        <div style={{ background: "var(--panel)", padding: "10px", flex: 1, borderRadius: "8px" }}>
          <strong>Stopped Vehicles:</strong> {stopped}
        </div>
      </div>

      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No active alerts 🚀</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--panel)", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Driver</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Vehicle</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Plate</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>City</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Province</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Speed</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Last Seen</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Location</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((v) => (
              <tr key={v.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.id}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.driver}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {v.make} {v.model}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.plate}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.city}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.province}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.status}</td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    color: v.speed === 0 ? "red" : v.speed < 80 ? "orange" : "white",
                    fontWeight: "bold",
                  }}
                >
                  {v.speed} km/h
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {new Date(v.lastSeen).toLocaleTimeString()}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {v.lat.toFixed(4)}, {v.lng.toFixed(4)}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <button style={{ marginRight: "5px" }}>View</button>
                  <button>Ping</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


