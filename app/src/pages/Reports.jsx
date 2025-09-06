import { useEffect, useState } from "react";

export default function Reports() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Reports</h1>
      {vehicles.length === 0 ? (
        <p>No data available.</p>
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
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} style={{ background: "" }}>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


