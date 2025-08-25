import "dotenv/config";

import express from "express";
import cors from "cors";
import { createServer } from "http";

import sequelize from "./config/db";
import "./models/index";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import groupRoutes from "./routes/group";
import tutorRoutes from "./routes/tutor";
import lessonRoutes from "./routes/lesson";
import purchaseRoutes from "./routes/purchase";
import paymentRoutes from "./routes/payment";
import adminRoutes from "./routes/admin";
import socketManager from "./config/socket";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 40012;

app.use(
  cors({
    origin: [
      "https://studybuddy-project.vercel.app",
      "http://localhost:3000", // for local development
      "http://localhost:5173", // for local development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.send("Server is running! REST API at /api");
});

// Health check endpoint for Railway
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Keep-alive endpoint to prevent container from being stopped
app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/api/test", (_req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Force redeploy to fix foreign key issues
    await sequelize.sync({ force: false, alter: false });
    console.log("✅ Database tables synchronized successfully");
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
  }
};

connectDatabase();

socketManager.initialize(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 REST base: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io ready for real-time communication`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Keep the process alive and log activity
setInterval(() => {
  console.log("Keep-alive ping:", new Date().toISOString());
}, 30000); // Log every 30 seconds
