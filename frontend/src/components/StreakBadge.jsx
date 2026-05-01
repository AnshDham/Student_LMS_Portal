import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function StreakBadge() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    if (!user) return;
    api.get("/auth/me").then((r) => setStreak(r.data.user.streakDays || 0));
  }, [user?.id]);
  return (
    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2 animate-pulse-glow">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="text-xl font-extrabold leading-none">{streak}</div>
        <div className="text-[10px] uppercase text-muted-foreground tracking-widest">day streak</div>
      </div>
    </div>
  );
}
