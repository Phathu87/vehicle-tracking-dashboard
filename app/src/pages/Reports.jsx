import { useEffect, useState, useMemo } from "react";

export default function Reports() {
  const [vehicles, setVehicles] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (v) =>
        (filterCity ? v.city === filterCity : true) &&
        (filterStatus ? v.status === filterStatus : true)
    );
  }, [vehicles, filterCity, filterStatus]);

  // Summary stats
  const totalVehicles = vehicles.length;
  const onlineVehicles = vehicles.filter((v) => v.status === "Online").length;
  const offlineVehicles = vehicles.filter((v) => v.status !== "Online").length;
  const avgSpeed =
    vehicles.length > 0
      ? (vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length).toFixed(1)
      : 0;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Reports</h1>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <strong>Total Vehicles:</strong> {totalVehicles}
        </div>
        <div style={{ flex: 1, background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <strong>Online:</strong> {onlineVehicles}
        </div>
        <div style={{ flex: 1, background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <strong>Offline:</strong> {offlineVehicles}
        </div>
        <div style={{ flex: 1, background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <strong>Average Speed:</strong> {avgSpeed} km/h
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px" }}
        >
          <option value="">All Cities</option>
          {[...new Set(vehicles.map((v) => v.city))].map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px" }}
        >
          <option value="">All Status</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      {/* Vehicle Table */}
      {filteredVehicles.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No data available.</p>
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
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Last Seen</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => (
              <tr key={v.id} style={{ background: "", transition: "background 0.2s" }}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.id}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.driver}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {v.make} {v.model}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.plate}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.city}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{v.status}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {v.speed} km/h
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {new Date(v.lastSeen).toLocaleString()}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee", width: "120px" }}>
                  <div style={{ background: "#eee", borderRadius: "5px", height: "8px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${v.progress || 0}%`,
                        height: "8px",
                        background: v.status === "Online" ? "#4caf50" : "#f44336",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Future Charts placeholder */}
      <div style={{ marginTop: "30px", background: "var(--panel)", padding: "20px", borderRadius: "8px" }}>
        <h2>Fleet Analytics</h2>
        <p>Charts and graphs will go here (speed trends, city distribution, online vs offline).</p>
      </div>
    </div>
  );
}



