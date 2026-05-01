import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { celebrate } from "../../lib/celebrate.js";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";

export default function TutorEnterGrades() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [f, setF] = useState({ student: "", kind: "assignment", refId: "", score: "", feedback: "" });

  useEffect(() => {
    api.get("/users/students").then((r) => setStudents(r.data.users));
    api.get("/assignments").then((r) => setAssignments(r.data.assignments));
    api.get("/exams").then((r) => setExams(r.data.exams));
  }, []);

  const choices = f.kind === "assignment" ? assignments : exams;
  const chosen = choices.find((c) => c._id === f.refId);

  const submit = async (e) => {
    e.preventDefault();
    if (!chosen) return toast.error("Pick an item to grade");
    const payload = {
      student: f.student,
      subject: chosen.subject?._id || chosen.subject,
      kind: f.kind,
      refId: f.refId,
      title: chosen.title,
      score: +f.score,
      maxScore: chosen.maxScore || 100,
      feedback: f.feedback,
    };
    const { data } = await api.post("/grades", payload);
    toast.success("Grade saved ✓");
    if (data.newBadges?.length) { celebrate(); toast.success(`🏅 Student unlocked: ${data.newBadges.join(", ")}`); }
    if (data.xpResult?.leveledUp) toast.success(`🚀 Student leveled up to ${data.xpResult.level}!`);
    setF({ ...f, score: "", feedback: "" });
  };

  return (
    <div>
      <PageHeader title="Enter Grades" emoji="✏️" subtitle="Score work — students earn XP and badges automatically" />
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="card-x grid grid-cols-2 gap-3 max-w-2xl">
        <select className="input col-span-2" required value={f.student} onChange={(e) => setF({ ...f, student: e.target.value })}>
          <option value="">Pick student…</option>
          {students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
        </select>
        <select className="input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value, refId: "" })}>
          <option value="assignment">📝 Assignment</option>
          <option value="exam">🎯 Exam</option>
        </select>
        <select className="input" required value={f.refId} onChange={(e) => setF({ ...f, refId: e.target.value })}>
          <option value="">Pick {f.kind}…</option>
          {choices.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <input className="input col-span-2" type="number" placeholder={`Score (max ${chosen?.maxScore || 100})`} required value={f.score} onChange={(e) => setF({ ...f, score: e.target.value })} />
        <textarea className="input col-span-2" rows={2} placeholder="Feedback (optional)" value={f.feedback} onChange={(e) => setF({ ...f, feedback: e.target.value })} />
        <button className="btn-primary col-span-2">Save grade</button>
      </motion.form>
    </div>
  );
}
