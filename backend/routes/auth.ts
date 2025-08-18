import { Router } from "express";
import {
  userSignup,
  userLogin,
  googleAuth,
  promoteToAdmin,
  createAdminAccount,
  createTutorAccount,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/register", userSignup);
router.post("/login", userLogin);
router.post("/google", googleAuth);
router.post("/promote-admin", requireAuth, promoteToAdmin);
router.post("/create-admin", createAdminAccount);
router.post("/create-tutor", createTutorAccount);

export default router;
