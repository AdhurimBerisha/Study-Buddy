import { Router } from "express";
import {
  userSignup,
  userLogin,
  googleAuth,
  promoteToAdmin,
  createAdminAccount,
  createTutorAccount,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/register", userSignup);
router.post("/login", userLogin);
router.post("/google", googleAuth);
router.post("/promote-admin", requireAuth, promoteToAdmin);
router.post("/create-admin", createAdminAccount);
router.post("/create-tutor", createTutorAccount);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

export default router;
