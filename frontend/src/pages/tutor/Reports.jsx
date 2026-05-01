import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";

export default function TutorReports() {
  const [students, setStudents] = useState([]);
  useEffect(() => { api.get("/users/students").then((r) => setStudents(r.data.users)); }, []);

  const downloadCSV = async (id, name) => {
    const res = await api.get(`/grades/export/${id}`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}-grades.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Student Reports" emoji="📊" subtitle="View report cards or export grades to CSV" />
      <div className="grid gap-2 max-w-3xl">
        {students.map((s) => (
          <div key={s._id} className="card-x flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center font-bold">{s.name[0]}</div>
            <div className="flex-1">
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.email} · Lvl {s.level || 1} · {s.xp || 0} XP</div>
            </div>
            <Link to={`/tutor/reports/${s._id}`} className="btn-outline"><FileText className="w-4 h-4" /> Report card</Link>
            <button onClick={() => downloadCSV(s._id, s.name)} className="btn-outline"><Download className="w-4 h-4" /> CSV</button>
          </div>
        ))}
      </div>
    </div>
  );
}
