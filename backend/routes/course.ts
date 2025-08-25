import express from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { getCourseLessons } from "../controllers/lessonController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", listCourses);
router.get("/:id", getCourse);
router.get("/:courseId/lessons", getCourseLessons);

router.post("/", requireAuth, createCourse);
router.put("/:id", requireAuth, updateCourse);
router.delete("/:id", requireAuth, deleteCourse);

export default router;
