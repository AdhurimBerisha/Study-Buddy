import express from "express";
import {
  createTutor,
  getTutor,
  getAllTutors,
  updateTutor,
  deleteTutor,
  getTutorByUserId,
} from "../controllers/tutorController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", getAllTutors);
router.get("/:id", getTutor);
router.get("/user/:userId", getTutorByUserId);

router.post("/", requireAuth, createTutor);
router.put("/:id", requireAuth, updateTutor);
router.delete("/:id", requireAuth, deleteTutor);

export default router;
