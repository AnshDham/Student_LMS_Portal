import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";

const QUICK = [
  { label: "Student", email: "student1@lms.test", password: "student123", emoji: "🎒" },
  { label: "Parent", email: "parent1@lms.test", password: "parent123", emoji: "👨‍👩‍👧" },
  { label: "Tutor", email: "tutor1@lms.test", password: "tutor123", emoji: "👩‍🏫" },
  { label: "Admin", email: "admin@lms.test", password: "admin123", emoji: "🛡️" },
];

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e, qm = null) => {
    e?.preventDefault?.();
    try {
      const u = await login(qm?.email || email, qm?.password || password);
      toast.success(`Welcome back, ${u.name}! 🎉`);
      nav(`/${u.role}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 inline-block animate-wiggle">🎓</div>
          <h1 className="text-4xl font-extrabold gradient-text">LMS Portal</h1>
          <p className="text-muted-foreground mt-1">Learn. Level up. Have fun.</p>
        </div>

        <div className="card-x">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
              <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-white/10" /> quick demo logins <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {QUICK.map((q) => (
              <button key={q.label} onClick={(e) => submit(e, q)} className="btn-outline justify-start text-left">
                <span className="text-xl">{q.emoji}</span>
                <span className="flex-1">{q.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            New student?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">Create an account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
