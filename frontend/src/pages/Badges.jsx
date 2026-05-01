import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Badges() {
  const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [me, setMe] = useState({ badges: [] });
  useEffect(() => {
    api.get("/gamify/badges").then((r) => setAll(r.data.badges));
    if (user?.id) api.get(`/users/${user.id}`).then((r) => setMe(r.data.user));
  }, [user?.id]);

  return (
    <div>
      <PageHeader title="Badge Gallery" emoji="🏅" subtitle={`You've unlocked ${me.badges?.length || 0} of ${all.length}`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {all.map((b, i) => {
          const owned = me.badges?.includes(b.key);
          return (
            <motion.div key={b.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`card-x text-center ${owned ? "" : "opacity-40 grayscale"}`} title={b.desc}>
              <div className="text-5xl mb-2">{b.emoji}</div>
              <div className="font-bold">{b.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
              {owned && <span className="chip mt-2 border-emerald-400/30 text-emerald-300">Unlocked ✓</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
