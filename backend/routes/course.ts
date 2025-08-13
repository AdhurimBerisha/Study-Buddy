import express from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  purchaseCourse,
} from "../controllers/courseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", listCourses);
router.get("/:id", getCourse);

router.post("/", requireAuth, createCourse);
router.put("/:id", requireAuth, updateCourse);
router.delete("/:id", requireAuth, deleteCourse);

router.post("/:id/purchase", requireAuth, purchaseCourse);

export default router;
