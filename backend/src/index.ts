import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
