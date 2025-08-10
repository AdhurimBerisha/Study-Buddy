import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./config/db";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Server is running!");
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
  }
};

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
