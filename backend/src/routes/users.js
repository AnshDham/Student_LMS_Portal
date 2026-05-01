import { Router } from "express";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole("admin", "tutor"), async (req, res, next) => {
  try {
    const { role } = req.query;
    const q = role ? { role } : {};
    const users = await User.find(q).select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (e) {
    next(e);
  }
});

router.get("/students", requireRole("admin", "tutor", "parent"), async (req, res, next) => {
  try {
    let q = { role: "student" };
    if (req.user.role === "parent") q._id = { $in: req.user.children };
    const users = await User.find(q).select("-password").sort({ name: 1 });
    res.json({ users });
  } catch (e) {
    next(e);
  }
});

router.get("/leaderboard", async (_req, res, next) => {
  try {
    const top = await User.find({ role: "student" })
      .select("name xp level streakDays badges avatar")
      .sort({ xp: -1, level: -1 })
      .limit(10);
    res.json({ leaderboard: top });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("-password").populate("parent children", "name email");
    if (!u) return res.status(404).json({ error: "Not found" });
    res.json({ user: u });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
