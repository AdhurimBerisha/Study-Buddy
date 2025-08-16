import { Router } from "express";
import {
  userSignup,
  userLogin,
  googleAuth,
} from "../controllers/authController";

const router = Router();

router.post("/register", userSignup);
router.post("/login", userLogin);
router.post("/google", googleAuth);

export default router;
