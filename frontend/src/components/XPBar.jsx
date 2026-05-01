import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function XPBar() {
  const { user } = useAuth();
  const [data, setData] = useState({ xp: 0, level: 1 });

  useEffect(() => {
    if (!user) return;
    api.get("/auth/me").then((r) => setData(r.data.user));
    const t = setInterval(() => api.get("/auth/me").then((r) => setData(r.data.user)).catch(() => {}), 8000);
    return () => clearInterval(t);
  }, [user?.id]);

  // xp needed for current level: 100 * level
  const xpForLevel = (l) => 100 * l;
  let lvl = 1, total = 0;
  while (total + xpForLevel(lvl) <= data.xp) { total += xpForLevel(lvl); lvl++; }
  const progressXP = data.xp - total;
  const needed = xpForLevel(lvl);
  const pct = Math.min(100, (progressXP / needed) * 100);

  return (
    <div className="flex-1 glass rounded-2xl p-3 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center font-bold shadow-lg shadow-primary/30">
        {lvl}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold">Level {lvl}</span>
          <span className="text-muted-foreground">{progressXP} / {needed} XP</span>
        </div>
        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary via-accent to-yellow-400"
          />
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-extrabold gradient-text">{data.xp}</div>
        <div className="text-[10px] uppercase text-muted-foreground tracking-widest">total XP</div>
      </div>
    </div>
  );
}
