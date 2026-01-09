import express from "express";
import dotenv from "dotenv";
import authRouts from "./routes/auth.route.js";
import chatRoute from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./utils/db.js";
dotenv.config();

//runnig port prod
const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_URL || "http://localhost:5173",
    credentials: true,
  })
);

//routes
app.use("/api/auth", authRouts);
app.use("/api", chatRoute);
// app.use("/api/messages", messageRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectDB();
});
