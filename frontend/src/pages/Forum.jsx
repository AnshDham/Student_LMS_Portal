import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { ChevronUp, Plus } from "lucide-react";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ title: "", body: "", subject: "" });

  const load = () => api.get("/forum/posts").then((r) => setPosts(r.data.posts));
  useEffect(() => { load(); api.get("/subjects").then((r) => setSubjects(r.data.subjects)); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/forum/posts", f);
    toast.success("Posted! 💬");
    setF({ title: "", body: "", subject: "" }); setShow(false); load();
  };
  const upvote = async (id) => {
    await api.post(`/forum/posts/${id}/upvote`); load();
  };

  return (
    <div>
      <PageHeader title="Discussion Forum" emoji="💬" subtitle="Ask questions. Share ideas. Help each other.">
        <button onClick={() => setShow(!show)} className="btn-primary"><Plus className="w-4 h-4" /> New post</button>
      </PageHeader>
      {show && (
        <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onSubmit={create} className="card-x mb-4 space-y-2">
          <select className="input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>
            <option value="">No subject</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.emoji} {s.name}</option>)}
          </select>
          <input className="input" placeholder="Title" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <textarea className="input" rows={4} placeholder="Markdown supported…" required value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          <button className="btn-primary">Post</button>
        </motion.form>
      )}
      <div className="grid gap-3">
        {posts.map((p, i) => {
          const upvoted = p.upvotes.some((u) => String(u) === String(user?.id));
          return (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="card-x flex gap-3">
              <button onClick={() => upvote(p._id)}
                className={`flex flex-col items-center gap-0 px-2 rounded-xl transition ${upvoted ? "bg-primary/20 text-primary" : "hover:bg-white/5"}`}>
                <ChevronUp className="w-5 h-5" />
                <span className="font-bold">{p.upvotes.length}</span>
              </button>
              <div className="flex-1 min-w-0">
                <Link to={`/forum/${p._id}`} className="font-bold hover:underline block truncate">{p.title}</Link>
                <div className="text-xs text-muted-foreground">
                  {p.subject && <span>{p.subject.emoji} {p.subject.name} · </span>}
                  by {p.author?.name} · {p.replies.length} replies
                </div>
                <div className="text-sm mt-2 line-clamp-2 prose prose-invert max-w-none">
                  <ReactMarkdown>{p.body}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          );
        })}
        {posts.length === 0 && <div className="text-muted-foreground">Be the first to post!</div>}
      </div>
    </div>
  );
}
