import express from "express";
import * as courses from "../controllers/courseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", courses.listCourses);
router.get("/:id", courses.getCourse);

router.post("/", requireAuth, courses.createCourse);
router.put("/:id", requireAuth, courses.updateCourse);
router.delete("/:id", requireAuth, courses.deleteCourse);

router.post("/:id/purchase", requireAuth, courses.purchaseCourse);

export default router;
