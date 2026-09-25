import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { index, types } from "../controllers/alertController.js";
const router = Router();
router.use(authenticate);
router.get("/", index);
router.get("/types", types);
export default router;
