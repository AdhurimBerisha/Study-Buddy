import express from "express";
import * as purchases from "../controllers/purchaseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

// All purchase routes require authentication
router.use(requireAuth);

// Create a new purchase
router.post("/", purchases.createPurchase);

// Get user's purchase history
router.get("/history", purchases.getUserPurchases);

// Get user's learning dashboard (purchased courses with progress)
router.get("/dashboard", purchases.getLearningDashboard);

// Check if user has purchased a specific course
router.get("/check/:courseId", purchases.checkCoursePurchase);

export default router;
