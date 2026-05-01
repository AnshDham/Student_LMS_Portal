import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function ParentDashboard() {
  const [children, setChildren] = useState(null);
  const [reports, setReports] = useState({});

  useEffect(() => {
    api.get("/users/students").then(async (r) => {
      setChildren(r.data.users);
      const map = {};
      for (const c of r.data.users) {
        const rep = await api.get(`/reports/${c._id}`);
        map[c._id] = rep.data;
      }
      setReports(map);
    });
  }, []);

  if (!children) return <Skeleton className="h-64" />;

  return (
    <div>
      <PageHeader title="My Children" emoji="👨‍👩‍👧" subtitle="Track their progress at a glance" />
      <div className="grid gap-4 md:grid-cols-2">
        {children.map((c, i) => {
          const rep = reports[c._id];
          return (
            <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card-x">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-extrabold">
                  {c.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <div className="text-xs text-muted-foreground">{c.email} · {c.grade}</div>
                </div>
                <span className="chip">Lvl {c.level || 1}</span>
              </div>
              {rep ? (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label="Overall" value={`${rep.overall}%`} />
                  <Stat label="Attendance" value={`${rep.attendancePct}%`} />
                  <Stat label="Badges" value={rep.badges.length} />
                </div>
              ) : <Skeleton className="h-16" />}
              {rep && (
                <div className="mt-4 space-y-1">
                  {rep.bySubject.slice(0, 3).map((s) => (
                    <div key={s.subject._id} className="flex items-center gap-2 text-sm">
                      <span>{s.subject.emoji}</span>
                      <span className="flex-1">{s.subject.name}</span>
                      <span className="font-semibold">{s.average}%</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-2">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
