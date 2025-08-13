import express from "express";
import {
  createPurchase,
  getUserPurchases,
  getLearningDashboard,
  checkCoursePurchase,
} from "../controllers/purchaseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.use(requireAuth);

router.post("/", createPurchase);

router.get("/history", getUserPurchases);

router.get("/dashboard", getLearningDashboard);

router.get("/check/:courseId", checkCoursePurchase);

export default router;
