import { Router } from "express";
import * as courses from "../controllers/courseController";

const router = Router();

router.get("/", courses.listCourses);
router.get("/:id", courses.getCourse);

export default router;
