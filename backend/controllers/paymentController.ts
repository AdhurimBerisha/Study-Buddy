import { Request, Response } from "express";
import Stripe from "stripe";
import { Purchase } from "../models/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, courseId, userId } = req.body;

    if (!amount || !courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, courseId, userId",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        courseId,
        userId,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, courseId, userId } = req.body;

    if (!paymentIntentId || !courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await Purchase.create({
        userId,
        courseId,
        amount: paymentIntent.amount / 100,
        status: "completed",
      });

      res.json({
        success: true,
        message: "Payment confirmed and course purchased successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
    });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
    });
  }
};
