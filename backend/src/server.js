import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Server as IOServer } from "socket.io";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import subjectRoutes from "./routes/subjects.js";
import classRoutes from "./routes/classes.js";
import assignmentRoutes from "./routes/assignments.js";
import examRoutes from "./routes/exams.js";
import gradeRoutes from "./routes/grades.js";
import attendanceRoutes from "./routes/attendance.js";
import forumRoutes from "./routes/forum.js";
import chatRoutes from "./routes/chat.js";
import reportRoutes from "./routes/reports.js";
import gamifyRoutes from "./routes/gamify.js";
import { initChatSocket } from "./sockets/chat.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", credentials: true },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, version: "2.0.0" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/gamify", gamifyRoutes);

app.use(errorHandler);

initChatSocket(io);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms_v2";

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("✓ MongoDB connected");
    server.listen(PORT, () => console.log(`✓ API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("✗ Mongo connection failed:", err.message);
    process.exit(1);
  });
