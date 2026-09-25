import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import geofenceRoutes from "./routes/geofenceRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";
import { corsOptions, securityHeaders } from "./middleware/security.js";

export const app = express();

if (String(process.env.TRUST_PROXY || "").toLowerCase() === "true") app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors(corsOptions()));
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "fleet-drive-ai-demo-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/geofences", geofenceRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/demo", demoRoutes);

app.use("/api", (req, res) => res.status(404).json({
  error: {
    code: "ROUTE_NOT_FOUND",
    message: "The requested API route does not exist.",
    details: {},
  },
}));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The request body contains invalid JSON.",
        details: {},
      },
    });
  }

  if (err?.status === 403 && err?.code === "ORIGIN_NOT_ALLOWED") {
    return res.status(403).json({
      error: {
        code: err.code,
        message: err.message,
        details: {},
      },
    });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "The request body exceeds the allowed size.",
        details: {},
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "The server could not complete the request.",
      details: {},
    },
  });
});

export default app;
