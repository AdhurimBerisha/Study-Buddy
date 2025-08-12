import express from "express";
import * as purchases from "../controllers/purchaseController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.use(requireAuth);

router.post("/", purchases.createPurchase);

router.get("/history", purchases.getUserPurchases);

router.get("/dashboard", purchases.getLearningDashboard);

router.get("/check/:courseId", purchases.checkCoursePurchase);

export default router;
