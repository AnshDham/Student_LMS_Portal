import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";
import Skeleton from "../../components/Skeleton.jsx";

export default function StudentAttendance() {
  const [records, setRecords] = useState(null);
  useEffect(() => { api.get("/attendance").then((r) => setRecords(r.data.records)); }, []);
  if (!records) return <Skeleton className="h-64" />;

  const present = records.filter((r) => r.present).length;
  const pct = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div>
      <PageHeader title="Attendance" emoji="📅" subtitle={`${present} of ${records.length} classes attended (${pct}%)`} />
      <div className="grid gap-2">
        {records.map((r, i) => (
          <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="card-x flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${r.present ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className="text-xl">{r.class?.subject?.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{r.class?.title || "Class"}</div>
              <div className="text-xs text-muted-foreground">
                {r.class?.startsAt && new Date(r.class.startsAt).toLocaleString()} · attended {r.attendedMin}m
              </div>
            </div>
            <span className={`chip ${r.present ? "border-emerald-400/30 text-emerald-300" : "border-rose-400/30 text-rose-300"}`}>
              {r.present ? "Present" : "Absent"}
            </span>
          </motion.div>
        ))}
        {records.length === 0 && <div className="text-muted-foreground">No attendance records yet.</div>}
      </div>
    </div>
  );
}
