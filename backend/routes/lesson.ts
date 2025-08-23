import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { editLesson, deleteLesson } from "../controllers/lessonController";

const router = express.Router();

router.put("/:id", requireAuth, editLesson);
router.delete("/:id", requireAuth, deleteLesson);

export default router;
