import { Router } from "express";
import { Parser as Json2csv } from "json2csv";
import Grade from "../models/Grade.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { awardXP, evaluateBadges } from "../utils/gamify.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { studentId } = req.query;
    let q = {};
    if (req.user.role === "student") q.student = req.user._id;
    else if (req.user.role === "parent") {
      const ids = req.user.children;
      q.student = { $in: ids };
    } else if (studentId) q.student = studentId;
    const grades = await Grade.find(q)
      .populate("subject", "name emoji color")
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json({ grades });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const { student, subject, kind, refId, title, score, maxScore, feedback } = req.body;
    const g = await Grade.findOneAndUpdate(
      { student, kind, refId },
      { student, subject, kind, refId, title, score, maxScore, feedback, gradedBy: req.user._id },
      { upsert: true, new: true }
    );
    const xpEarned = 15 + Math.round((score / (maxScore || 100)) * 25);
    const xpResult = await awardXP(student, xpEarned, `Grade: ${title}`);
    const newBadges = await evaluateBadges(student);
    res.json({ grade: g, xpResult, newBadges });
  } catch (e) {
    next(e);
  }
});

router.get("/export/:studentId", requireRole("tutor", "admin"), async (req, res, next) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate("subject", "name")
      .populate("student", "name email");
    const rows = grades.map((g) => ({
      Student: g.student?.name || "",
      Subject: g.subject?.name || "",
      Type: g.kind,
      Title: g.title,
      Score: g.score,
      MaxScore: g.maxScore,
      Percentage: ((g.score / g.maxScore) * 100).toFixed(1) + "%",
      Date: g.createdAt.toISOString().slice(0, 10),
    }));
    const parser = new Json2csv();
    const csv = rows.length ? parser.parse(rows) : "No grades";
    res.header("Content-Type", "text/csv");
    res.attachment(`grades-${req.params.studentId}.csv`);
    res.send(csv);
  } catch (e) {
    next(e);
  }
});

export default router;
