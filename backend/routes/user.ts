import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { myProfile, updateProfile } from "../controllers/userController";
import {
  uploadAvatar,
  handleUploadError,
  debugUpload,
} from "../middlewares/upload";

const router = express.Router();

router.get("/me", requireAuth, myProfile);

router.put(
  "/me",
  requireAuth,
  debugUpload,
  uploadAvatar,
  handleUploadError,
  updateProfile
);

export default router;
