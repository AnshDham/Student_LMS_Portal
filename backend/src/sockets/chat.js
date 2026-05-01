import jwt from "jsonwebtoken";
import ChatMessage from "../models/ChatMessage.js";

const roomKey = (a, b) => [String(a), String(b)].sort().join(":");

export function initChatSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("missing token"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      socket.role = payload.role;
      next();
    } catch (e) {
      next(new Error("invalid token"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.role === "parent") {
      socket.disconnect(true);
      return;
    }
    console.log(`🔌 socket connected ${socket.userId}`);

    socket.on("join", (otherUserId) => {
      const room = roomKey(socket.userId, otherUserId);
      socket.join(room);
    });

    socket.on("typing", ({ to, typing }) => {
      const room = roomKey(socket.userId, to);
      socket.to(room).emit("typing", { from: socket.userId, typing });
    });

    socket.on("message", async ({ to, body }) => {
      if (!body || !to) return;
      const room = roomKey(socket.userId, to);
      const m = await ChatMessage.create({ room, from: socket.userId, to, body });
      io.to(room).emit("message", m);
    });

    socket.on("disconnect", () => {
      console.log(`✗ socket disconnected ${socket.userId}`);
    });
  });
}
