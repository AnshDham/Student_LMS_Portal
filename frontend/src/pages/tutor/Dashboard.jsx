import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function TutorDashboard() {
  const [classes, setClasses] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [tab, setTab] = useState("class");

  const [cls, setCls] = useState({ subject: "", title: "", startsAt: "", durationMin: 60, meetingUrl: "" });
  const [asg, setAsg] = useState({ subject: "", title: "", description: "", dueDate: "", maxScore: 100 });

  const load = () => {
    api.get("/classes").then((r) => setClasses(r.data.classes));
    api.get("/assignments").then((r) => setAssignments(r.data.assignments));
  };
  useEffect(() => {
    load();
    api.get("/subjects").then((r) => setSubjects(r.data.subjects));
  }, []);

  const createClass = async (e) => {
    e.preventDefault();
    await api.post("/classes", cls);
    toast.success("Class scheduled! 📅");
    setCls({ subject: "", title: "", startsAt: "", durationMin: 60, meetingUrl: "" });
    load();
  };
  const createAsg = async (e) => {
    e.preventDefault();
    await api.post("/assignments", asg);
    toast.success("Assignment created! 📝");
    setAsg({ subject: "", title: "", description: "", dueDate: "", maxScore: 100 });
    load();
  };

  return (
    <div>
      <PageHeader title="Tutor Dashboard" emoji="👩‍🏫" subtitle="Manage your classes and assignments" />

      <div className="card-x mb-6">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("class")} className={tab === "class" ? "btn-primary" : "btn-outline"}>Schedule class</button>
          <button onClick={() => setTab("asg")} className={tab === "asg" ? "btn-primary" : "btn-outline"}>Create assignment</button>
        </div>
        {tab === "class" ? (
          <form onSubmit={createClass} className="grid grid-cols-2 gap-3">
            <select className="input" required value={cls.subject} onChange={(e) => setCls({ ...cls, subject: e.target.value })}>
              <option value="">Pick subject…</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.emoji} {s.name}</option>)}
            </select>
            <input className="input" placeholder="Title" required value={cls.title} onChange={(e) => setCls({ ...cls, title: e.target.value })} />
            <input className="input" type="datetime-local" required value={cls.startsAt} onChange={(e) => setCls({ ...cls, startsAt: e.target.value })} />
            <input className="input" type="number" min="15" max="240" placeholder="Duration (min)" value={cls.durationMin} onChange={(e) => setCls({ ...cls, durationMin: +e.target.value })} />
            <input className="input col-span-2" placeholder="Meeting URL (optional)" value={cls.meetingUrl} onChange={(e) => setCls({ ...cls, meetingUrl: e.target.value })} />
            <button className="btn-primary col-span-2"><Plus className="w-4 h-4" /> Schedule</button>
          </form>
        ) : (
          <form onSubmit={createAsg} className="grid grid-cols-2 gap-3">
            <select className="input" required value={asg.subject} onChange={(e) => setAsg({ ...asg, subject: e.target.value })}>
              <option value="">Pick subject…</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.emoji} {s.name}</option>)}
            </select>
            <input className="input" placeholder="Title" required value={asg.title} onChange={(e) => setAsg({ ...asg, title: e.target.value })} />
            <textarea className="input col-span-2" rows={2} placeholder="Description" value={asg.description} onChange={(e) => setAsg({ ...asg, description: e.target.value })} />
            <input className="input" type="datetime-local" required value={asg.dueDate} onChange={(e) => setAsg({ ...asg, dueDate: e.target.value })} />
            <input className="input" type="number" placeholder="Max score" value={asg.maxScore} onChange={(e) => setAsg({ ...asg, maxScore: +e.target.value })} />
            <button className="btn-primary col-span-2"><Plus className="w-4 h-4" /> Create assignment</button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <List title="📅 My Classes" items={classes} render={(c) => `${c.subject?.emoji} ${c.title} — ${new Date(c.startsAt).toLocaleString()}`} />
        <List title="📝 My Assignments" items={assignments} render={(a) => `${a.subject?.emoji} ${a.title} — Due ${new Date(a.dueDate).toLocaleDateString()}`} />
      </div>
    </div>
  );
}

function List({ title, items, render }) {
  return (
    <div className="card-x">
      <h3 className="font-bold mb-2">{title}</h3>
      {!items ? <Skeleton className="h-24" /> : items.length === 0 ? <div className="text-muted-foreground text-sm">Nothing yet.</div> : (
        <ul className="space-y-1 text-sm">{items.map((it) => <li key={it._id} className="p-2 rounded hover:bg-white/5">{render(it)}</li>)}</ul>
      )}
    </div>
  );
}
