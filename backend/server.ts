import "dotenv/config";

import express from "express";
import cors from "cors";

import sequelize from "./config/db";
import "./models/index"; // Import models to register them
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import groupRoutes from "./routes/group";
import tutorRoutes from "./routes/tutor";
import lessonRoutes from "./routes/lesson";
import purchaseRoutes from "./routes/purchase";

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/", (_req, res) => {
  res.send("Server is running! REST API at /api");
});

// Test endpoint for debugging
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

    await sequelize.sync({ force: false });
    console.log("✅ Database tables created successfully");
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
  }
};

connectDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 REST base: http://localhost:${PORT}/api`);
});
