import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then((vehicles) => {
        // Fake alerts: flag vehicles with speed < 30
        const flagged = vehicles.filter((v) => v.speed < 30);
        setAlerts(flagged);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Alerts</h1>
      {alerts.length === 0 ? (
        <p>No active alerts 🚀</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
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
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Speed</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((v) => (
              <tr key={v.id} style={{ background: "" }}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.id}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.driver}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {v.make} {v.model}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.plate}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.city}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.status}</td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    color: v.speed < 20 ? "red" : "orange", // extra emphasis
                    fontWeight: "bold",
                  }}
                >
                  {v.speed} km/h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


