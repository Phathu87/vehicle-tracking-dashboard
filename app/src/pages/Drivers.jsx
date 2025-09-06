import { useEffect, useState } from "react";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then((vehicles) => {
        // Group vehicles by driver
        const grouped = {};
        vehicles.forEach((v) => {
          if (!grouped[v.driver]) grouped[v.driver] = [];
          grouped[v.driver].push(v);
        });

        const driverList = Object.entries(grouped).map(([name, cars]) => ({
          name,
          vehicles: cars,
          totalVehicles: cars.length,
          onlineVehicles: cars.filter((v) => v.status === "Online").length,
          offlineVehicles: cars.filter((v) => v.status !== "Online").length,
        }));

        setDrivers(driverList);
      })
      .catch(console.error);
  }, []);

  const totalDrivers = drivers.length;
  const totalVehicles = drivers.reduce((acc, d) => acc + d.vehicles.length, 0);
  const totalOnline = drivers.reduce((acc, d) => acc + d.vehicles.filter(v => v.status === "Online").length, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Driver Assignments</h1>

      {/* Dashboard summary */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <h3>Total Drivers</h3>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>{totalDrivers}</p>
        </div>
        <div style={{ background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <h3>Total Vehicles</h3>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>{totalVehicles}</p>
        </div>
        <div style={{ background: "var(--panel)", padding: "15px", borderRadius: "8px" }}>
          <h3>Vehicles Online</h3>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>{totalOnline}</p>
        </div>
      </div>

      {/* Driver table */}
      {drivers.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No drivers found 🚗</p>
      ) : (
        <table
          style={{
            width: "165vh",
            borderCollapse: "collapse",
            marginTop: "20px",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--panel)", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Driver</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Vehicles</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Plates</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>City</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Last Seen</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.name}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                  {d.name} ({d.totalVehicles})
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {d.vehicles.map((v) => `${v.make} ${v.model}`).join(", ")}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {d.vehicles.map((v) => v.plate).join(", ")}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {d.vehicles.map((v) => v.city).join(", ")}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {d.vehicles.every((v) => v.status === "Online")
                    ? <span style={{ color: "green", fontWeight: "bold" }}>Online</span>
                    : <span style={{ color: "orange", fontWeight: "bold" }}>Mixed</span>}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {Math.max(...d.vehicles.map(v => v.lastSeen)) ? new Date(Math.max(...d.vehicles.map(v => v.lastSeen))).toLocaleString() : "N/A"}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <button style={{ marginRight: "5px" }}>View Map</button>
                  <button>Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

