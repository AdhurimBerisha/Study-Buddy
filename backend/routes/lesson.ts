import { Router } from "express";
import * as lessons from "../controllers/lessonController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Public routes (no auth required)
router.get("/course/:courseId", lessons.getCourseLessons);
router.get("/:lessonId", lessons.getLesson);

// Protected routes (auth required)
router.use(requireAuth);

// Instructor routes (course ownership required)
router.post("/course/:courseId", lessons.createLesson);
router.put("/:lessonId", lessons.updateLesson);
router.delete("/:lessonId", lessons.deleteLesson);

// Student routes
router.put("/:lessonId/progress", lessons.updateLessonProgress);
router.get("/course/:courseId/progress", lessons.getCourseProgress);

export default router;
