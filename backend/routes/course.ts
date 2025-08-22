import express from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", listCourses);
router.get("/:id", getCourse);

router.post("/", requireAuth, createCourse);
router.put("/:id", requireAuth, updateCourse);
router.delete("/:id", requireAuth, deleteCourse);

export default router;
