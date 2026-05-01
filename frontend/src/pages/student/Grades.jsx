import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function StudentGrades() {
  const [grades, setGrades] = useState(null);
  useEffect(() => { api.get("/grades").then((r) => setGrades(r.data.grades)); }, []);
  if (!grades) return <Skeleton className="h-64" />;

  return (
    <div>
      <PageHeader title="Grades" emoji="📊" subtitle="Read-only — final marks are set by your tutors" />
      <div className="grid gap-3">
        {grades.length === 0 && <div className="text-muted-foreground">No grades yet.</div>}
        {grades.map((g, i) => {
          const pct = (g.score / g.maxScore) * 100;
          return (
            <motion.div
              key={g._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-x flex items-center gap-4"
            >
              <span className="text-3xl">{g.subject?.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div className="font-semibold truncate">{g.title}</div>
                  <div className="font-extrabold gradient-text">{g.score}/{g.maxScore}</div>
                </div>
                <div className="text-xs text-muted-foreground">{g.subject?.name} · {g.kind}</div>
                <div className="h-2 rounded-full bg-white/5 mt-2 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                    className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
