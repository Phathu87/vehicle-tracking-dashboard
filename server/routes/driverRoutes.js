import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireSharedDemoMutation } from "../middleware/demoMutationPolicy.js";
import { assignments, create, index, remove, show, update } from "../controllers/driverController.js";

const router = Router();
router.use(authenticate);
router.get("/", index);
router.post("/", requireSharedDemoMutation, create);
router.get("/:id", show);
router.put("/:id", requireSharedDemoMutation, update);
router.put("/:id/vehicles", requireSharedDemoMutation, assignments);
router.delete("/:id", requireSharedDemoMutation, remove);

export default router;
