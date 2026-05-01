import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      api.get(`/reports/${user.id}`),
      api.get("/classes?upcoming=1"),
      api.get("/assignments"),
    ]).then(([r, c, a]) => {
      setReport(r.data);
      setClasses(c.data.classes);
      setAssignments(a.data.assignments);
    });
  }, [user?.id]);

  return (
    <div>
      <PageHeader
        title={`Hey ${user?.name?.split(" ")[0]} 👋`}
        subtitle="Here's what's happening today. Let's earn some XP!"
      />

      {!report ? (
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard emoji="🎯" label="Overall Score" value={`${report.overall}%`} color="from-primary to-purple-500" />
            <StatCard emoji="📅" label="Attendance" value={`${report.attendancePct}%`} color="from-emerald-500 to-teal-500" />
            <StatCard emoji="🏅" label="Badges" value={report.badges.length} color="from-amber-500 to-orange-500" />
          </div>

          <h2 className="text-xl font-bold mb-3">📚 Subject Mastery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {report.bySubject.map((s, i) => (
              <motion.div
                key={s.subject._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-x flex items-center gap-4 hover:scale-[1.02] transition-transform"
              >
                <div className="w-24 h-24">
                  <ResponsiveContainer>
                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: s.average, fill: s.subject.color }]} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={20} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="text-3xl">{s.subject.emoji}</div>
                  <div className="font-semibold">{s.subject.name}</div>
                  <div className="text-2xl font-extrabold gradient-text">{s.average}%</div>
                  <div className="text-xs text-muted-foreground">{s.count} grades</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="📅 Upcoming Classes" link={null}>
              {classes.length === 0 && <Empty text="No upcoming classes" />}
              {classes.slice(0, 4).map((c) => (
                <Row key={c._id} emoji={c.subject?.emoji} title={c.title} sub={new Date(c.startsAt).toLocaleString()} />
              ))}
            </Section>

            <Section title="📝 Assignments Due" link="/student/assignments">
              {assignments.length === 0 && <Empty text="All caught up! 🎉" />}
              {assignments.slice(0, 4).map((a) => (
                <Row key={a._id} emoji={a.subject?.emoji} title={a.title} sub={`Due ${new Date(a.dueDate).toLocaleDateString()}`} />
              ))}
            </Section>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ emoji, label, value, color }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="card-x relative overflow-hidden">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-30 blur-2xl`} />
      <div className="relative">
        <div className="text-4xl mb-2">{emoji}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-3xl font-extrabold mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

function Section({ title, link, children }) {
  return (
    <div className="card-x">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">{title}</h3>
        {link && <Link to={link} className="text-xs text-primary hover:underline">View all →</Link>}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ emoji, title, sub }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="text-sm text-muted-foreground py-4 text-center">{text}</div>;
}
