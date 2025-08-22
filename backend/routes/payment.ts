import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", requireAuth, createPaymentIntent);

router.post("/confirm-payment", requireAuth, confirmPayment);

router.get("/status/:paymentIntentId", getPaymentStatus);

export default router;
