import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function StudentAssignments() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get("/assignments").then((r) => setItems(r.data.assignments)); }, []);

  if (!items) return <Skeleton className="h-64" />;

  return (
    <div>
      <PageHeader title="Assignments" emoji="📝" subtitle="Stay on top of your work — earn XP for every submission!" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((a, i) => {
          const overdue = new Date(a.dueDate) < new Date();
          return (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="card-x"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{a.subject?.emoji}</span>
                <div className="flex-1">
                  <div className="text-xs uppercase text-muted-foreground">{a.subject?.name}</div>
                  <h3 className="font-bold text-lg">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`chip ${overdue ? "border-destructive/40 text-red-300" : "border-emerald-400/30 text-emerald-300"}`}>
                      {overdue ? "Overdue" : `Due ${new Date(a.dueDate).toLocaleDateString()}`}
                    </span>
                    <span className="chip">/ {a.maxScore} pts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {items.length === 0 && <div className="text-muted-foreground">No assignments yet. 🎉</div>}
      </div>
    </div>
  );
}
