import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", parentName: "", parentEmail: "", grade: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await register(f);
      toast.success(`Welcome, ${u.name}! 🚀`);
      nav("/student");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🚀</div>
          <h1 className="text-4xl font-extrabold gradient-text">Join the Adventure</h1>
          <p className="text-muted-foreground mt-1">Earn XP, unlock badges, climb the leaderboard</p>
        </div>
        <div className="card-x">
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Your name</label>
                <input className="input mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Grade</label>
                <input className="input mt-1" placeholder="e.g. Grade 8" value={f.grade} onChange={(e) => setF({ ...f, grade: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Your email</label>
              <input className="input mt-1" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Password (6+ chars)</label>
              <input className="input mt-1" type="password" minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
            </div>
            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-muted-foreground mb-2">A parent account is auto-created (default password: parent123)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Parent name</label>
                  <input className="input mt-1" value={f.parentName} onChange={(e) => setF({ ...f, parentName: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Parent email</label>
                  <input className="input mt-1" type="email" value={f.parentEmail} onChange={(e) => setF({ ...f, parentEmail: e.target.value })} required />
                </div>
              </div>
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Start learning →"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already a member? <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
