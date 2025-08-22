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
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/requireAuth";
import {
  validateRegistration,
  validateLogin,
  validateGoogleAuth,
  validateEmailVerification,
  validateAdminCreation,
  validateTutorCreation,
  handleValidationErrors,
} from "../middlewares/validation";
import { authRateLimit } from "../middlewares/rateLimit";

const router = Router();

router.post(
  "/register",
  authRateLimit,
  validateRegistration,
  handleValidationErrors,
  userSignup
);
router.post(
  "/login",
  authRateLimit,
  validateLogin,
  handleValidationErrors,
  userLogin
);
router.post(
  "/google",
  authRateLimit,
  validateGoogleAuth,
  handleValidationErrors,
  googleAuth
);
router.post("/promote-admin", requireAuth, promoteToAdmin);
router.post(
  "/create-admin",
  authRateLimit,
  validateAdminCreation,
  handleValidationErrors,
  createAdminAccount
);
router.post(
  "/create-tutor",
  authRateLimit,
  validateTutorCreation,
  handleValidationErrors,
  createTutorAccount
);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification",
  authRateLimit,
  validateEmailVerification,
  handleValidationErrors,
  resendVerificationEmail
);

router.post("/forgot-password", authRateLimit, forgotPassword);

router.post("/reset-password", authRateLimit, resetPassword);

export default router;
