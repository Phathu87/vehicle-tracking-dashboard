import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { index } from "../controllers/maintenanceController.js";
import { maintenance as maintenanceReport } from "../controllers/reportController.js";

const router = Router();
router.use(authenticate);
router.get("/", index);
router.get("/:vehicleId/report", maintenanceReport);

export default router;
