import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  myProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController";
import { uploadAvatar, handleUploadError } from "../middlewares/upload";
import {
  validateProfileUpdate,
  handleValidationErrors,
} from "../middlewares/validation";
import { profileUpdateRateLimit } from "../middlewares/rateLimit";

const router = express.Router();

router.get("/me", requireAuth, myProfile);

router.put(
  "/me",
  requireAuth,
  profileUpdateRateLimit,
  uploadAvatar,
  handleUploadError,
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);

router.put("/change-password", requireAuth, changePassword);

export default router;
