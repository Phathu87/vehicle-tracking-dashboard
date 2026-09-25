import { Router } from "express";
import { status } from "../controllers/demoController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();
router.use(authenticate);
router.get("/status", status);

export default router;
