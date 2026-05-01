import { Router } from "express";
import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { awardXP, evaluateBadges } from "../utils/gamify.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    let q = {};
    if (req.user.role === "student") q.student = req.user._id;
    else if (req.user.role === "parent") q.student = { $in: req.user.children };
    else if (req.query.studentId) q.student = req.query.studentId;
    const records = await Attendance.find(q)
      .populate({ path: "class", populate: { path: "subject", select: "name emoji color" } })
      .sort({ createdAt: -1 });
    res.json({ records });
  } catch (e) {
    next(e);
  }
});

router.post("/mark", requireRole("student", "tutor", "admin"), async (req, res, next) => {
  try {
    const { classId, attendedMin, studentId } = req.body;
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ error: "Class not found" });
    const sid = req.user.role === "student" ? req.user._id : studentId;
    const present = attendedMin / cls.durationMin >= 0.3;
    const r = await Attendance.findOneAndUpdate(
      { student: sid, class: classId },
      { student: sid, class: classId, attendedMin, present },
      { upsert: true, new: true }
    );
    let xpResult = null;
    let newBadges = [];
    if (present && req.user.role === "student") {
      xpResult = await awardXP(sid, 10, `Attended: ${cls.title}`);
      newBadges = await evaluateBadges(sid);
    }
    res.json({ attendance: r, xpResult, newBadges });
  } catch (e) {
    next(e);
  }
});

export default router;
