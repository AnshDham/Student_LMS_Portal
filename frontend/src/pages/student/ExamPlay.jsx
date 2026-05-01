import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "../../api/client.js";
import { celebrate } from "../../lib/celebrate.js";
import Skeleton from "../../components/Skeleton.jsx";

export default function ExamPlay() {
  const { id } = useParams();
  const nav = useNavigate();
  const [exam, setExam] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/exams/${id}/play`).then((r) => {
      setExam(r.data.exam);
      setSecondsLeft((r.data.exam.durationMin || 15) * 60);
    });
  }, [id]);

  useEffect(() => {
    if (!exam || result) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [exam, result]);

  useEffect(() => {
    if (exam && secondsLeft === 0 && !result) submit();
    // eslint-disable-next-line
  }, [secondsLeft]);

  const submit = async () => {
    if (result) return;
    const { data } = await api.post(`/exams/${id}/submit`, { answers });
    setResult(data);
    if (data.score >= 80) celebrate();
    if (data.newBadges?.length) toast.success(`🎉 New badge${data.newBadges.length > 1 ? "s" : ""} unlocked!`);
    if (data.xpResult?.leveledUp) toast.success(`🚀 Leveled up to ${data.xpResult.level}!`);
  };

  if (!exam) return <Skeleton className="h-96" />;

  if (result) {
    const pct = Math.round((result.score / result.maxScore) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-x">
          <div className="text-7xl mb-3">{pct >= 80 ? "🏆" : pct >= 50 ? "🎉" : "💪"}</div>
          <h1 className="text-4xl font-extrabold gradient-text">{result.score} / {result.maxScore}</h1>
          <p className="text-muted-foreground mt-2">{result.correct} of {result.total} correct ({pct}%)</p>
          <div className="mt-5 flex justify-center gap-2 text-sm">
            <span className="chip">+{result.xpEarned} XP</span>
            {result.xpResult?.leveledUp && <span className="chip border-amber-400/40 text-amber-300">Level {result.xpResult.level}!</span>}
            {result.newBadges?.map((b) => <span key={b} className="chip">🏅 {b}</span>)}
          </div>
          <button className="btn-primary mt-6" onClick={() => nav("/student")}>Back to dashboard</button>
        </motion.div>
      </div>
    );
  }

  const q = exam.questions[idx];
  const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");
  const pct = ((idx + 1) / exam.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase text-muted-foreground">{exam.subject?.emoji} {exam.title}</div>
          <div className="text-sm">Question {idx + 1} of {exam.questions.length}</div>
        </div>
        <div className={`text-2xl font-mono font-bold ${secondsLeft < 30 ? "text-destructive animate-pulse" : ""}`}>
          ⏱ {m}:{s}
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-5">
        <motion.div className="h-full bg-gradient-to-r from-primary to-accent" animate={{ width: `${pct}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q._id}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          className="card-x"
        >
          <h2 className="text-2xl font-bold mb-5">{q.q}</h2>
          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const selected = answers[q._id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [q._id]: i })}
                  className={`text-left rounded-xl px-4 py-3 border transition-all ${
                    selected ? "border-primary bg-primary/15 scale-[1.01]" : "border-white/10 hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            <button className="btn-outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Prev</button>
            {idx < exam.questions.length - 1 ? (
              <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next →</button>
            ) : (
              <button className="btn-primary" onClick={submit}>Submit ✓</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
