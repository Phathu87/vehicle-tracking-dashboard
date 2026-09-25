import { Router } from "express";
import { currentUser, login, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authRateLimit } from "../middleware/authRateLimit.js";

const router = Router();

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);
router.get("/me", authenticate, currentUser);

export default router;
