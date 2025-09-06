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
          if (!grouped[v.driver]) {
            grouped[v.driver] = [];
          }
          grouped[v.driver].push(v);
        });

        // Convert to array of driver objects
        const driverList = Object.entries(grouped).map(([name, cars]) => ({
          name,
          vehicles: cars,
        }));

        setDrivers(driverList);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Driver Assignments</h1>
      {drivers.length === 0 ? (
        <p>No drivers found 🚗</p>
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
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.name} style={{ background: "" }}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                  {d.name}
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
                    ? "Online"
                    : "Mixed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

