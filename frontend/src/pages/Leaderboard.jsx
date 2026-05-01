import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import Skeleton from "../components/Skeleton.jsx";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [list, setList] = useState(null);
  useEffect(() => { api.get("/users/leaderboard").then((r) => setList(r.data.leaderboard)); }, []);
  if (!list) return <Skeleton className="h-64" />;
  return (
    <div>
      <PageHeader title="Leaderboard" emoji="🏆" subtitle="Top 10 learners by XP — climb to the top!" />
      <div className="grid gap-2 max-w-2xl">
        {list.map((u, i) => (
          <motion.div key={u._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`card-x flex items-center gap-3 ${i < 3 ? "ring-1 ring-amber-400/30" : ""}`}>
            <div className="w-10 text-center text-2xl">{MEDALS[i] || `#${i + 1}`}</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center font-bold">{u.name[0]}</div>
            <div className="flex-1">
              <div className="font-bold">{u.name}</div>
              <div className="text-xs text-muted-foreground">Level {u.level} · 🔥 {u.streakDays}d · {u.badges.length} badges</div>
            </div>
            <div className="text-2xl font-extrabold gradient-text">{u.xp} XP</div>
          </motion.div>
        ))}
        {list.length === 0 && <div className="text-muted-foreground">No students ranked yet.</div>}
      </div>
    </div>
  );
}
