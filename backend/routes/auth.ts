import { Router } from "express";
import { userSignup, userLogin } from "../controllers/authController";

const router = Router();

router.post("/register", userSignup);
router.post("/login", userLogin);

export default router;
