import express from "express";
import cors from "cors";
import { vehicles } from "./data.js"; // keep your data.js in server folder

const app = express();
app.use(cors());

// API endpoint to fetch vehicles
app.get("/api/vehicles", (req, res) => {
  res.json(vehicles);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
