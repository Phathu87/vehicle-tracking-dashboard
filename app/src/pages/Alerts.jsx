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
    <div>
      <h1>Alerts</h1>
      {alerts.length === 0 ? (
        <p>No active alerts 🚀</p>
      ) : (
        <ul>
          {alerts.map((v) => (
            <li key={v.id}>
              <strong>{v.plate}</strong> - Speed: {v.speed} km/h
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

