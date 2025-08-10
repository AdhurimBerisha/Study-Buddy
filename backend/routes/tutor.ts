import { Router } from "express";
import * as tutors from "../controllers/tutorController";

const router = Router();

router.get("/", tutors.listTutors);
router.get("/:id", tutors.getTutor);

export default router;
