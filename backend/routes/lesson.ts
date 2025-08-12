import { Router } from "express";
import * as lessons from "../controllers/lessonController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/course/:courseId", lessons.getCourseLessons);
router.get("/:lessonId", lessons.getLesson);

router.use(requireAuth);

router.post("/course/:courseId", lessons.createLesson);
router.put("/:lessonId", lessons.updateLesson);
router.delete("/:lessonId", lessons.deleteLesson);

router.put("/:lessonId/progress", lessons.updateLessonProgress);
router.get("/course/:courseId/progress", lessons.getCourseProgress);

export default router;
