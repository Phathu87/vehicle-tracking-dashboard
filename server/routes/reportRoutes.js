import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { trips } from "../controllers/reportController.js";
const router = Router();
router.use(authenticate);
router.get("/:vehicleId/trips", trips);
export default router;
