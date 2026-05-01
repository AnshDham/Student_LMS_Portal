import User from "../models/User.js";
import Grade from "../models/Grade.js";
import Attendance from "../models/Attendance.js";

export const BADGES = {
  first_steps: { name: "First Steps", emoji: "👣", desc: "Complete your first assignment" },
  streak_3: { name: "On Fire", emoji: "🔥", desc: "3-day learning streak" },
  streak_7: { name: "Streak Master", emoji: "⚡", desc: "7-day learning streak" },
  perfect_score: { name: "Perfect Score", emoji: "💯", desc: "Score 100% on any test" },
  high_scorer: { name: "High Scorer", emoji: "🎯", desc: "Score 90%+ three times" },
  attendance_hero: { name: "Attendance Hero", emoji: "🦸", desc: "Attend 10 classes" },
  math_wizard: { name: "Math Wizard", emoji: "🧙", desc: "Master Mathematics" },
  science_explorer: { name: "Science Explorer", emoji: "🔬", desc: "Master Science" },
  word_smith: { name: "Word Smith", emoji: "📝", desc: "Master English" },
  level_5: { name: "Rising Star", emoji: "🌟", desc: "Reach Level 5" },
  level_10: { name: "Knowledge Knight", emoji: "🛡️", desc: "Reach Level 10" },
  forum_starter: { name: "Conversationalist", emoji: "💬", desc: "Start a forum thread" },
};

export const xpForLevel = (lvl) => 100 * lvl;

export const computeLevel = (xp) => {
  let lvl = 1;
  let total = 0;
  while (total + xpForLevel(lvl) <= xp) {
    total += xpForLevel(lvl);
    lvl++;
  }
  return lvl;
};

export async function awardXP(studentId, amount, reason = "") {
  const user = await User.findById(studentId);
  if (!user || user.role !== "student") return null;
  user.xp += amount;
  const newLevel = computeLevel(user.xp);
  const leveledUp = newLevel > user.level;
  user.level = newLevel;

  // streak update
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  if (last) last.setHours(0, 0, 0, 0);
  if (!last) {
    user.streakDays = 1;
  } else {
    const diff = Math.round((today - last) / 86400000);
    if (diff === 0) {
      /* same day, no change */
    } else if (diff === 1) {
      user.streakDays += 1;
    } else {
      user.streakDays = 1;
    }
  }
  user.lastActiveDate = today;

  // level badges
  if (user.level >= 5 && !user.badges.includes("level_5")) user.badges.push("level_5");
  if (user.level >= 10 && !user.badges.includes("level_10")) user.badges.push("level_10");
  if (user.streakDays >= 3 && !user.badges.includes("streak_3")) user.badges.push("streak_3");
  if (user.streakDays >= 7 && !user.badges.includes("streak_7")) user.badges.push("streak_7");

  await user.save();
  return { xp: user.xp, level: user.level, leveledUp, streakDays: user.streakDays, reason };
}

export async function evaluateBadges(studentId) {
  const user = await User.findById(studentId);
  if (!user) return [];
  const newly = [];

  const grades = await Grade.find({ student: studentId }).populate("subject");
  if (grades.length > 0 && !user.badges.includes("first_steps")) {
    user.badges.push("first_steps");
    newly.push("first_steps");
  }
  if (grades.some((g) => g.score === g.maxScore) && !user.badges.includes("perfect_score")) {
    user.badges.push("perfect_score");
    newly.push("perfect_score");
  }
  const high = grades.filter((g) => g.score / g.maxScore >= 0.9).length;
  if (high >= 3 && !user.badges.includes("high_scorer")) {
    user.badges.push("high_scorer");
    newly.push("high_scorer");
  }
  // subject mastery: avg >= 85% in a subject across >= 2 grades
  const bySubject = {};
  for (const g of grades) {
    if (!g.subject) continue;
    const k = g.subject.name.toLowerCase();
    bySubject[k] = bySubject[k] || { total: 0, max: 0, count: 0 };
    bySubject[k].total += g.score;
    bySubject[k].max += g.maxScore;
    bySubject[k].count += 1;
  }
  if (bySubject["mathematics"]?.count >= 2 && bySubject["mathematics"].total / bySubject["mathematics"].max >= 0.85 && !user.badges.includes("math_wizard")) {
    user.badges.push("math_wizard");
    newly.push("math_wizard");
  }
  if (bySubject["science"]?.count >= 2 && bySubject["science"].total / bySubject["science"].max >= 0.85 && !user.badges.includes("science_explorer")) {
    user.badges.push("science_explorer");
    newly.push("science_explorer");
  }
  if (bySubject["english"]?.count >= 2 && bySubject["english"].total / bySubject["english"].max >= 0.85 && !user.badges.includes("word_smith")) {
    user.badges.push("word_smith");
    newly.push("word_smith");
  }

  const presentCount = await Attendance.countDocuments({ student: studentId, present: true });
  if (presentCount >= 10 && !user.badges.includes("attendance_hero")) {
    user.badges.push("attendance_hero");
    newly.push("attendance_hero");
  }

  if (newly.length) await user.save();
  return newly;
}
