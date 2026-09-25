import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { optimize } from "../controllers/routeController.js";
const router = Router();
router.use(authenticate);
router.post("/optimize", optimize);
export default router;
