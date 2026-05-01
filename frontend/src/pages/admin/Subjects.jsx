import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api from "../../api/client.js";
import PageHeader from "../../components/PageHeader.jsx";

const EMOJIS = ["📘", "🔢", "🔬", "📚", "🌍", "🎨", "🎵", "💻", "⚽", "🧪", "📐", "🗺️"];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#ec4899", "#84cc16"];

export default function AdminSubjects() {
  const [items, setItems] = useState([]);
  const [f, setF] = useState({ name: "", code: "", emoji: "📘", color: "#6366f1", description: "" });

  const load = () => api.get("/subjects").then((r) => setItems(r.data.subjects));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post("/subjects", f);
      toast.success("Subject created!");
      setF({ name: "", code: "", emoji: "📘", color: "#6366f1", description: "" });
      load();
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
  };

  const del = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/subjects/${id}`); load();
  };

  return (
    <div>
      <PageHeader title="Subjects" emoji="📚" subtitle="Customize the curriculum" />
      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={create} className="card-x lg:col-span-1 space-y-3">
          <h3 className="font-bold">New subject</h3>
          <input className="input" placeholder="Name (e.g. History)" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className="input" placeholder="Code (e.g. HIS101)" required value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} />
          <textarea className="input" rows={2} placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2">Pick emoji</div>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button type="button" key={e} onClick={() => setF({ ...f, emoji: e })}
                  className={`text-2xl w-10 h-10 rounded-xl grid place-items-center transition ${f.emoji === e ? "bg-primary/30 ring-2 ring-primary scale-110" : "bg-white/5 hover:bg-white/10"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2">Pick color</div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button type="button" key={c} onClick={() => setF({ ...f, color: c })}
                  className={`w-9 h-9 rounded-xl transition ${f.color === c ? "ring-2 ring-white scale-110" : ""}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <button className="btn-primary w-full"><Plus className="w-4 h-4" /> Create</button>
        </form>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
          {items.map((s, i) => (
            <motion.div key={s._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="card-x relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${s.color}, transparent)` }} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{s.emoji}</div>
                  <button onClick={() => del(s._id)} className="btn-ghost text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-lg">{s.name}</h3>
                <div className="text-xs text-muted-foreground">{s.code}</div>
                <p className="text-sm mt-2">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
