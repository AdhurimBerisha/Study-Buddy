import express from "express";
import * as courses from "../controllers/courseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

// Public routes
router.get("/", courses.listCourses);
router.get("/:id", courses.getCourse);

// Protected routes (require authentication)
router.post("/", requireAuth, courses.createCourse);
router.put("/:id", requireAuth, courses.updateCourse);
router.delete("/:id", requireAuth, courses.deleteCourse);

// Purchase course (no enrollment needed)
router.post("/:id/purchase", requireAuth, courses.purchaseCourse);

export default router;
