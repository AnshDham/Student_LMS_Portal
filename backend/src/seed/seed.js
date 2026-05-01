import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Class from "../models/Class.js";
import Assignment from "../models/Assignment.js";
import Exam from "../models/Exam.js";
import Grade from "../models/Grade.js";
import Attendance from "../models/Attendance.js";
import ForumPost from "../models/ForumPost.js";
import ChatMessage from "../models/ChatMessage.js";

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms_v2";

const daysFromNow = (n) => new Date(Date.now() + n * 86400000);
const roomKey = (a, b) => [String(a), String(b)].sort().join(":");

async function run() {
  await mongoose.connect(MONGO);
  console.log("✓ Connected, wiping...");
  await Promise.all([
    User.deleteMany({}),
    Subject.deleteMany({}),
    Class.deleteMany({}),
    Assignment.deleteMany({}),
    Exam.deleteMany({}),
    Grade.deleteMany({}),
    Attendance.deleteMany({}),
    ForumPost.deleteMany({}),
    ChatMessage.deleteMany({}),
  ]);

  console.log("→ Subjects");
  const [math, sci, eng] = await Subject.create([
    { name: "Mathematics", code: "MATH101", emoji: "🔢", color: "#6366f1", description: "Numbers, algebra, geometry" },
    { name: "Science", code: "SCI101", emoji: "🔬", color: "#10b981", description: "Physics, chemistry, biology" },
    { name: "English", code: "ENG101", emoji: "📚", color: "#f59e0b", description: "Reading, writing, grammar" },
  ]);

  console.log("→ Admin & tutors");
  const admin = await User.create({ name: "Admin User", email: "admin@lms.test", password: "admin123", role: "admin" });
  const tutors = await User.create([
    { name: "Mr. Math (Tutor)", email: "tutor1@lms.test", password: "tutor123", role: "tutor", subjects: [math._id] },
    { name: "Ms. Science (Tutor)", email: "tutor2@lms.test", password: "tutor123", role: "tutor", subjects: [sci._id] },
    { name: "Mrs. English (Tutor)", email: "tutor3@lms.test", password: "tutor123", role: "tutor", subjects: [eng._id] },
  ]);

  console.log("→ Parents & students");
  const parents = [];
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const p = await User.create({
      name: `Parent ${i}`,
      email: `parent${i}@lms.test`,
      password: "parent123",
      role: "parent",
    });
    const s = await User.create({
      name: `Student ${i}`,
      email: `student${i}@lms.test`,
      password: "student123",
      role: "student",
      grade: `Grade ${5 + i}`,
      parent: p._id,
      xp: 50 + i * 80,
      level: 1 + Math.floor(i / 2),
      streakDays: i,
      lastActiveDate: new Date(),
      badges: i >= 2 ? ["first_steps"] : [],
    });
    p.children.push(s._id);
    await p.save();
    parents.push(p);
    students.push(s);
  }

  console.log("→ Classes (past + upcoming)");
  const allClasses = [];
  for (let i = 0; i < 4; i++) {
    const cls = await Class.create({
      subject: [math, sci, eng][i % 3]._id,
      tutor: tutors[i % 3]._id,
      title: `${["Math", "Science", "English"][i % 3]} session #${i + 1}`,
      startsAt: daysFromNow(i - 2),
      durationMin: 60,
      meetingUrl: "https://meet.example.com/demo",
      notes: "Bring your notebook!",
    });
    allClasses.push(cls);
  }

  console.log("→ Assignments");
  const assignments = await Assignment.create([
    { subject: math._id, tutor: tutors[0]._id, title: "Algebra worksheet", description: "Solve problems 1-20", dueDate: daysFromNow(3), maxScore: 100 },
    { subject: sci._id, tutor: tutors[1]._id, title: "Photosynthesis lab report", description: "Write 1-page report", dueDate: daysFromNow(5), maxScore: 100 },
    { subject: eng._id, tutor: tutors[2]._id, title: "Essay: My favorite book", description: "300 words", dueDate: daysFromNow(7), maxScore: 100 },
  ]);

  console.log("→ Exams (with MCQs)");
  const exams = await Exam.create([
    {
      subject: math._id,
      tutor: tutors[0]._id,
      title: "Math Quiz: Basics",
      scheduledAt: daysFromNow(2),
      durationMin: 15,
      maxScore: 100,
      questions: [
        { q: "What is 7 × 8?", options: ["54", "56", "58", "64"], correctIndex: 1 },
        { q: "Square root of 81?", options: ["7", "8", "9", "10"], correctIndex: 2 },
        { q: "15% of 200?", options: ["20", "25", "30", "35"], correctIndex: 2 },
        { q: "Solve: 2x + 5 = 15. x = ?", options: ["3", "5", "7", "10"], correctIndex: 1 },
        { q: "Sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correctIndex: 1 },
      ],
    },
    {
      subject: sci._id,
      tutor: tutors[1]._id,
      title: "Science Pop Quiz",
      scheduledAt: daysFromNow(4),
      durationMin: 10,
      maxScore: 100,
      questions: [
        { q: "Chemical symbol for water?", options: ["O2", "H2O", "CO2", "HO"], correctIndex: 1 },
        { q: "Closest planet to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correctIndex: 2 },
        { q: "Gas plants need to make food?", options: ["Oxygen", "Nitrogen", "CO2", "Helium"], correctIndex: 2 },
      ],
    },
  ]);

  console.log("→ Grades & Attendance");
  for (const s of students) {
    await Grade.create({
      student: s._id,
      subject: math._id,
      kind: "assignment",
      refId: assignments[0]._id,
      title: assignments[0].title,
      score: 70 + Math.floor(Math.random() * 25),
      maxScore: 100,
      gradedBy: tutors[0]._id,
    });
    await Grade.create({
      student: s._id,
      subject: sci._id,
      kind: "assignment",
      refId: assignments[1]._id,
      title: assignments[1].title,
      score: 65 + Math.floor(Math.random() * 30),
      maxScore: 100,
      gradedBy: tutors[1]._id,
    });
    for (const cls of allClasses.slice(0, 3)) {
      const att = Math.random() > 0.2 ? cls.durationMin : 5;
      await Attendance.create({
        student: s._id,
        class: cls._id,
        attendedMin: att,
        present: att / cls.durationMin >= 0.3,
      });
    }
  }

  console.log("→ Forum posts");
  const post = await ForumPost.create({
    subject: math._id,
    author: students[0]._id,
    title: "How do I solve quadratic equations?",
    body: "I'm stuck on the quadratic formula. Can someone explain step by step?",
    upvotes: [students[1]._id, students[2]._id],
    replies: [
      { author: tutors[0]._id, body: "Great question! Use x = (-b ± √(b²-4ac)) / 2a. Let's break it down..." },
      { author: students[3]._id, body: "I had the same problem! Watching Khan Academy helped me a lot." },
    ],
  });
  await ForumPost.create({
    subject: sci._id,
    author: students[1]._id,
    title: "Why is the sky blue?",
    body: "Asked my parents but they said 'just because'. There has to be a real reason!",
    upvotes: [students[0]._id],
    replies: [
      { author: tutors[1]._id, body: "Great curiosity! It's called Rayleigh scattering — short blue wavelengths scatter more in the atmosphere." },
    ],
  });

  console.log("→ Chat messages");
  const chatPairs = [
    [students[0]._id, tutors[0]._id, "Hi sir, I need help with homework!"],
    [tutors[0]._id, students[0]._id, "Sure! What part are you stuck on?"],
    [students[0]._id, tutors[0]._id, "Question 5, the algebra one"],
    [tutors[0]._id, students[0]._id, "Great, let's go through it together. Try isolating x first."],
  ];
  for (const [from, to, body] of chatPairs) {
    await ChatMessage.create({ room: roomKey(from, to), from, to, body });
  }

  console.log("\n✅ Seed complete!\n");
  console.log("Demo logins:");
  console.log("  admin@lms.test     / admin123");
  console.log("  tutor1@lms.test    / tutor123");
  console.log("  student1@lms.test  / student123");
  console.log("  parent1@lms.test   / parent123\n");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
