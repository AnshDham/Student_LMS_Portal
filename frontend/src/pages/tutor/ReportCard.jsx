import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import api from "../../api/client.js";
import Skeleton from "../../components/Skeleton.jsx";

export default function ReportCard() {
  const { studentId } = useParams();
  const [r, setR] = useState(null);
  useEffect(() => { api.get(`/reports/${studentId}`).then((res) => setR(res.data)); }, [studentId]);
  if (!r) return <Skeleton className="h-96" />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="btn-primary"><Printer className="w-4 h-4" /> Print / Save PDF</button>
      </div>
      <div className="card-x">
        <div className="text-center border-b border-white/10 pb-4 mb-4">
          <div className="text-4xl">🎓</div>
          <h1 className="text-3xl font-extrabold gradient-text">Final Report Card</h1>
          <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Info label="Student" value={r.student.name} />
          <Info label="Email" value={r.student.email} />
          <Info label="Grade" value={r.student.grade || "—"} />
          <Info label="Parent" value={r.student.parent?.name || "—"} />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <Stat label="Overall" value={`${r.overall}%`} />
          <Stat label="Attendance" value={`${r.attendancePct}%`} />
          <Stat label="Level" value={r.level} />
        </div>
        <h3 className="font-bold mb-2">Subject performance</h3>
        <table className="w-full text-sm mb-6">
          <thead className="text-left text-muted-foreground">
            <tr><th className="py-2">Subject</th><th>Items</th><th>Average</th></tr>
          </thead>
          <tbody>
            {r.bySubject.map((s) => (
              <tr key={s.subject._id} className="border-t border-white/5">
                <td className="py-2">{s.subject.emoji} {s.subject.name}</td>
                <td>{s.count}</td>
                <td className="font-bold">{s.average}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="font-bold mb-2">Grades detail</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr><th className="py-2">Type</th><th>Title</th><th>Score</th></tr>
          </thead>
          <tbody>
            {r.grades.map((g) => (
              <tr key={g._id} className="border-t border-white/5">
                <td className="py-1.5">{g.kind}</td>
                <td>{g.title}</td>
                <td className="font-semibold">{g.score}/{g.maxScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Info({ label, value }) {
  return <div><div className="text-xs uppercase text-muted-foreground">{label}</div><div className="font-semibold">{value}</div></div>;
}
function Stat({ label, value }) {
  return <div className="bg-white/5 rounded-xl p-3"><div className="text-xs uppercase text-muted-foreground">{label}</div><div className="text-2xl font-extrabold">{value}</div></div>;
}
