import { useEffect, useState } from "react";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
      .then((res) => res.json())
      .then((vehicles) => {
        // Extract unique drivers with their vehicles
        const grouped = {};
        vehicles.forEach((v) => {
          if (!grouped[v.driver]) {
            grouped[v.driver] = [];
          }
          grouped[v.driver].push(v);
        });

        // Convert to an array of driver objects
        const driverList = Object.entries(grouped).map(([name, cars]) => ({
          name,
          vehicles: cars,
        }));

        setDrivers(driverList);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Drivers</h1>
      {drivers.length === 0 ? (
        <p>No drivers found 🚗</p>
      ) : (
        <ul>
          {drivers.map((d) => (
            <li key={d.name}>
              <strong>{d.name}</strong> — {d.vehicles.length} vehicles
              <ul>
                {d.vehicles.map((v) => (
                  <li key={v.id}>
                    {v.plate} ({v.model})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
