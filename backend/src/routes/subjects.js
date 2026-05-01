import { Router } from "express";
import Subject from "../models/Subject.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (_req, res, next) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json({ subjects });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("admin"), async (req, res, next) => {
  try {
    const s = await Subject.create(req.body);
    res.json({ subject: s });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    const s = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ subject: s });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
