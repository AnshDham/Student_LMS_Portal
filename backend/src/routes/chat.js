import { Router } from "express";
import ChatMessage from "../models/ChatMessage.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const noParents = (req, res, next) => {
  if (req.user.role === "parent") return res.status(403).json({ error: "Forbidden" });
  next();
};
router.use(noParents);

const roomKey = (a, b) => [String(a), String(b)].sort().join(":");

router.get("/threads", async (req, res, next) => {
  try {
    const me = req.user._id;
    const msgs = await ChatMessage.find({ $or: [{ from: me }, { to: me }] })
      .sort({ createdAt: -1 })
      .populate("from to", "name role avatar");
    const seen = new Set();
    const threads = [];
    for (const m of msgs) {
      const otherId = String(m.from._id) === String(me) ? m.to._id : m.from._id;
      const key = String(otherId);
      if (seen.has(key)) continue;
      seen.add(key);
      const other = String(m.from._id) === String(me) ? m.to : m.from;
      threads.push({ user: other, lastMessage: m.body, at: m.createdAt });
    }
    res.json({ threads });
  } catch (e) {
    next(e);
  }
});

router.get("/with/:userId", async (req, res, next) => {
  try {
    const room = roomKey(req.user._id, req.params.userId);
    const messages = await ChatMessage.find({ room }).sort({ createdAt: 1 });
    const partner = await User.findById(req.params.userId).select("name role avatar");
    res.json({ partner, messages });
  } catch (e) {
    next(e);
  }
});

router.post("/with/:userId", async (req, res, next) => {
  try {
    const room = roomKey(req.user._id, req.params.userId);
    const m = await ChatMessage.create({
      room,
      from: req.user._id,
      to: req.params.userId,
      body: req.body.body,
    });
    res.json({ message: m });
  } catch (e) {
    next(e);
  }
});

export default router;
