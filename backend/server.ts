import "dotenv/config";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import sequelize from "./config/db";
import { createApolloServer } from "./config/apollo";
import "./models/User.js";

const app = express();
const PORT = 8080;

const server = await createApolloServer();

app.use(cors());
app.use(express.json());

app.use("/graphql", expressMiddleware(server));

app.get("/", (req, res) => {
  res.send("Server is running! GraphQL at /graphql");
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
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
