import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  editLesson,
  deleteLesson,
  getCourseProgress,
} from "../controllers/lessonController";

const router = express.Router();

router.put("/:id", requireAuth, editLesson);
router.delete("/:id", requireAuth, deleteLesson);
router.get("/course/:courseId/progress", requireAuth, getCourseProgress);

export default router;
