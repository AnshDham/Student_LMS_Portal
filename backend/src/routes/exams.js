import { Router } from "express";
import Exam from "../models/Exam.js";
import Grade from "../models/Grade.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { awardXP, evaluateBadges } from "../utils/gamify.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const q = {};
    if (req.user.role === "tutor") q.tutor = req.user._id;
    const items = await Exam.find(q)
      .populate("subject", "name emoji color")
      .populate("tutor", "name")
      .sort({ scheduledAt: 1 });
    // Hide answers
    const sanitized = items.map((e) => {
      const o = e.toObject();
      o.questions = o.questions.map((q) => ({ _id: q._id, q: q.q, options: q.options }));
      return o;
    });
    res.json({ exams: sanitized });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const e = await Exam.create({ ...req.body, tutor: req.user._id });
    res.json({ exam: e });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/play", requireRole("student"), async (req, res, next) => {
  try {
    const e = await Exam.findById(req.params.id).populate("subject", "name emoji color");
    if (!e) return res.status(404).json({ error: "Not found" });
    const o = e.toObject();
    o.questions = o.questions.map((q) => ({ _id: q._id, q: q.q, options: q.options }));
    res.json({ exam: o });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/submit", requireRole("student"), async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Not found" });
    const answers = req.body.answers || {}; // { [questionId]: optionIndex }
    let correct = 0;
    for (const q of exam.questions) {
      if (answers[q._id] === q.correctIndex) correct++;
    }
    const score = Math.round((correct / Math.max(exam.questions.length, 1)) * exam.maxScore);

    await Grade.findOneAndUpdate(
      { student: req.user._id, kind: "exam", refId: exam._id },
      {
        student: req.user._id,
        subject: exam.subject,
        kind: "exam",
        refId: exam._id,
        title: exam.title,
        score,
        maxScore: exam.maxScore,
        gradedBy: exam.tutor,
      },
      { upsert: true, new: true }
    );

    const xpEarned = 20 + Math.round(score / 5);
    const xpResult = await awardXP(req.user._id, xpEarned, `Exam: ${exam.title}`);
    const newBadges = await evaluateBadges(req.user._id);

    res.json({
      score,
      correct,
      total: exam.questions.length,
      maxScore: exam.maxScore,
      xpEarned,
      xpResult,
      newBadges,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
