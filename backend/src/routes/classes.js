import { Router } from "express";
import Class from "../models/Class.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    const q = {};
    if (upcoming === "1") q.startsAt = { $gte: new Date() };
    if (req.user.role === "tutor") q.tutor = req.user._id;
    const classes = await Class.find(q)
      .populate("subject", "name emoji color")
      .populate("tutor", "name email")
      .sort({ startsAt: 1 });
    res.json({ classes });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const c = await Class.create({ ...req.body, tutor: req.user._id });
    res.json({ class: c });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
