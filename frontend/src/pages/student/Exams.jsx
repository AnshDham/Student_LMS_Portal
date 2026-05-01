import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function StudentExams() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get("/exams").then((r) => setItems(r.data.exams)); }, []);
  if (!items) return <Skeleton className="h-64" />;
  return (
    <div>
      <PageHeader title="Exams" emoji="🎯" subtitle="Take a deep breath — you've got this!" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((e, i) => (
          <motion.div key={e._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-x flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase text-muted-foreground">{e.subject?.emoji} {e.subject?.name}</div>
              <h3 className="font-bold text-lg">{e.title}</h3>
              <div className="text-xs text-muted-foreground mt-1">
                {e.questions.length} questions · {e.durationMin} min · {e.maxScore} pts
              </div>
              <div className="text-xs mt-1">📅 {new Date(e.scheduledAt).toLocaleString()}</div>
            </div>
            <Link to={`/student/exam/${e._id}`} className="btn-primary"><Play className="w-4 h-4" /> Start</Link>
          </motion.div>
        ))}
        {items.length === 0 && <div className="text-muted-foreground">No exams scheduled.</div>}
      </div>
    </div>
  );
}
