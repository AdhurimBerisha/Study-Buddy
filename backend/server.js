import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
