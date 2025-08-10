import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectMySql } from "./config/db";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Server is running!");
});

connectMySql();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
