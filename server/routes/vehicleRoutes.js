import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authenticateTelemetryMutation, requireSharedDemoMutation } from "../middleware/demoMutationPolicy.js";
import { create, history, index, remove, show, status, telemetry, update } from "../controllers/vehicleController.js";
import { complete as completeMaintenance, create as createMaintenance, remove as removeMaintenance, update as updateMaintenance, vehicleIndex as vehicleMaintenance } from "../controllers/maintenanceController.js";

const router = Router();

router.get("/", index);
router.post("/", authenticate, requireSharedDemoMutation, create);
router.get("/:id/status", authenticate, status);
router.get("/:id/history", authenticate, history);
router.post("/:id/telemetry", authenticateTelemetryMutation, telemetry);
router.get("/:id/maintenance", authenticate, vehicleMaintenance);
router.post("/:id/maintenance", authenticate, requireSharedDemoMutation, createMaintenance);
router.put("/:id/maintenance/:taskId", authenticate, requireSharedDemoMutation, updateMaintenance);
router.post("/:id/maintenance/:taskId/complete", authenticate, requireSharedDemoMutation, completeMaintenance);
router.delete("/:id/maintenance/:taskId", authenticate, requireSharedDemoMutation, removeMaintenance);
router.get("/:id", authenticate, show);
router.put("/:id", authenticate, requireSharedDemoMutation, update);
router.delete("/:id", authenticate, requireSharedDemoMutation, remove);

export default router;
