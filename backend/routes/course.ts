import { Router } from "express";
import * as courses from "../controllers/courseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Public routes
router.get("/", courses.listCourses);
router.get("/:id", courses.getCourse);

// Protected routes
router.post("/", requireAuth, courses.createCourse);
router.put("/:id", requireAuth, courses.updateCourse);
router.delete("/:id", requireAuth, courses.deleteCourse);

// Enrollment routes
router.post("/:id/enroll", requireAuth, courses.enrollInCourse);
router.delete("/:id/enroll", requireAuth, courses.unenrollFromCourse);
router.get("/my/enrolled", requireAuth, courses.getMyCourses);
router.put("/:id/progress", requireAuth, courses.updateCourseProgress);

export default router;
