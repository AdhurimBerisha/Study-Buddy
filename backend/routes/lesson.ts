import { Router } from "express";
import {
  getCourseLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  updateLessonProgress,
  getCourseProgress,
} from "../controllers/lessonController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/course/:courseId", getCourseLessons);
router.get("/:lessonId", getLesson);

router.use(requireAuth);

router.post("/course/:courseId", createLesson);
router.put("/:lessonId", updateLesson);
router.delete("/:lessonId", deleteLesson);

router.put("/:lessonId/progress", updateLessonProgress);
router.get("/course/:courseId/progress", getCourseProgress);

export default router;
