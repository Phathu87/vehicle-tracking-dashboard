import { useEffect, useState } from "react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Vehicles</h1>
      {vehicles.length === 0 ? (
        <p>No vehicles found 🚘</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              <strong>{v.plate}</strong> — {v.model} ({v.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

