import { Router } from "express";
import Grade from "../models/Grade.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/:studentId", requireRole("student", "parent", "tutor", "admin"), async (req, res, next) => {
  try {
    const sid = req.params.studentId;
    if (req.user.role === "student" && String(req.user._id) !== sid)
      return res.status(403).json({ error: "Forbidden" });
    if (req.user.role === "parent" && !req.user.children.map(String).includes(sid))
      return res.status(403).json({ error: "Forbidden" });

    const student = await User.findById(sid).select("-password").populate("parent", "name email");
    if (!student) return res.status(404).json({ error: "Not found" });

    const grades = await Grade.find({ student: sid }).populate("subject", "name emoji color");
    const subjects = await Subject.find();
    const bySubject = subjects.map((s) => {
      const list = grades.filter((g) => g.subject && String(g.subject._id) === String(s._id));
      const total = list.reduce((acc, g) => acc + g.score, 0);
      const max = list.reduce((acc, g) => acc + g.maxScore, 0);
      return {
        subject: { _id: s._id, name: s.name, emoji: s.emoji, color: s.color },
        count: list.length,
        average: max ? Math.round((total / max) * 100) : 0,
      };
    });

    const att = await Attendance.find({ student: sid });
    const attendancePct = att.length
      ? Math.round((att.filter((a) => a.present).length / att.length) * 100)
      : 0;

    const overall = grades.length
      ? Math.round((grades.reduce((a, g) => a + g.score, 0) / grades.reduce((a, g) => a + g.maxScore, 0)) * 100)
      : 0;

    res.json({
      student,
      bySubject,
      grades,
      attendancePct,
      overall,
      xp: student.xp,
      level: student.level,
      streakDays: student.streakDays,
      badges: student.badges,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
