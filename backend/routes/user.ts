import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { myProfile, updateProfile } from "../controllers/userController";
import { uploadAvatar, handleUploadError } from "../middlewares/upload";

const router = express.Router();

router.get("/me", requireAuth, myProfile);

router.put("/me", requireAuth, uploadAvatar, handleUploadError, updateProfile);

export default router;
