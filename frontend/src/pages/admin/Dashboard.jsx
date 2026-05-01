import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";

export default function AdminDashboard() {
  const [s, setS] = useState({ users: 0, students: 0, tutors: 0, parents: 0, subjects: 0 });
  useEffect(() => {
    Promise.all([
      api.get("/users"),
      api.get("/users?role=student"),
      api.get("/users?role=tutor"),
      api.get("/users?role=parent"),
      api.get("/subjects"),
    ]).then(([u, st, t, p, sub]) =>
      setS({ users: u.data.users.length, students: st.data.users.length, tutors: t.data.users.length, parents: p.data.users.length, subjects: sub.data.subjects.length })
    );
  }, []);
  const cards = [
    { emoji: "👥", label: "Total Users", value: s.users, c: "from-primary to-purple-500" },
    { emoji: "🎒", label: "Students", value: s.students, c: "from-emerald-500 to-teal-500" },
    { emoji: "👩‍🏫", label: "Tutors", value: s.tutors, c: "from-amber-500 to-orange-500" },
    { emoji: "👨‍👩‍👧", label: "Parents", value: s.parents, c: "from-pink-500 to-rose-500" },
    { emoji: "📚", label: "Subjects", value: s.subjects, c: "from-cyan-500 to-blue-500" },
  ];
  return (
    <div>
      <PageHeader title="Admin Control Center" emoji="🛡️" subtitle="Eyes on everything" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-x relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.c} opacity-25 blur-2xl`} />
            <div className="text-3xl mb-2 relative">{c.emoji}</div>
            <div className="text-xs uppercase text-muted-foreground">{c.label}</div>
            <div className="text-3xl font-extrabold">{c.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
