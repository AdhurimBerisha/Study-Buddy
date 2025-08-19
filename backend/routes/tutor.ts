import express from "express";
import {
  createTutor,
  getTutor,
  getAllTutors,
  updateTutor,
  deleteTutor,
  createCourse,
} from "../controllers/tutorController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", getAllTutors);
router.get("/:id", getTutor);

router.post("/", requireAuth, createTutor);
router.post("/courses", requireAuth, createCourse);
router.put("/:id", requireAuth, updateTutor);
router.delete("/:id", requireAuth, deleteTutor);

export default router;
