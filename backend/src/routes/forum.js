import { Router } from "express";
import ForumPost from "../models/ForumPost.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { BADGES } from "../utils/gamify.js";

const router = Router();
router.use(requireAuth);
// Parents are read-only excluded entirely from forum
const noParents = (req, res, next) => {
  if (req.user.role === "parent") return res.status(403).json({ error: "Forbidden" });
  next();
};

router.get("/posts", noParents, async (req, res, next) => {
  try {
    const q = {};
    if (req.query.subject) q.subject = req.query.subject;
    const posts = await ForumPost.find(q)
      .populate("author", "name role avatar")
      .populate("subject", "name emoji color")
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (e) {
    next(e);
  }
});

router.get("/posts/:id", noParents, async (req, res, next) => {
  try {
    const p = await ForumPost.findById(req.params.id)
      .populate("author", "name role avatar")
      .populate("subject", "name emoji color")
      .populate("replies.author", "name role avatar");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ post: p });
  } catch (e) {
    next(e);
  }
});

router.post("/posts", noParents, async (req, res, next) => {
  try {
    const p = await ForumPost.create({ ...req.body, author: req.user._id });
    // forum_starter badge for students
    if (req.user.role === "student" && !req.user.badges.includes("forum_starter")) {
      const u = await User.findById(req.user._id);
      u.badges.push("forum_starter");
      await u.save();
    }
    res.json({ post: p });
  } catch (e) {
    next(e);
  }
});

router.post("/posts/:id/replies", noParents, async (req, res, next) => {
  try {
    const p = await ForumPost.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    p.replies.push({ author: req.user._id, body: req.body.body });
    await p.save();
    const populated = await ForumPost.findById(p._id).populate("replies.author", "name role avatar");
    res.json({ replies: populated.replies });
  } catch (e) {
    next(e);
  }
});

router.post("/posts/:id/upvote", noParents, async (req, res, next) => {
  try {
    const p = await ForumPost.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    const i = p.upvotes.findIndex((u) => u.toString() === req.user._id.toString());
    if (i >= 0) p.upvotes.splice(i, 1);
    else p.upvotes.push(req.user._id);
    await p.save();
    res.json({ upvotes: p.upvotes.length, upvoted: i < 0 });
  } catch (e) {
    next(e);
  }
});

export default router;
