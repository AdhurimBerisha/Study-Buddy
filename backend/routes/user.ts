import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { myProfile, updateProfile } from "../controllers/userController";
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

export default router;
