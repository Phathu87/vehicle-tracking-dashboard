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
    <div>
      <h1>Reports</h1>
      <pre>{JSON.stringify(vehicles, null, 2)}</pre>
    </div>
  );
}

