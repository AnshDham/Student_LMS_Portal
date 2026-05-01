import { Router } from "express";
import Assignment from "../models/Assignment.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const q = {};
    if (req.user.role === "tutor") q.tutor = req.user._id;
    const items = await Assignment.find(q)
      .populate("subject", "name emoji color")
      .populate("tutor", "name")
      .sort({ dueDate: 1 });
    res.json({ assignments: items });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const a = await Assignment.create({ ...req.body, tutor: req.user._id });
    res.json({ assignment: a });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
