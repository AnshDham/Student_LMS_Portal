import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, GraduationCap, Calendar, Award, Users,
  MessageSquare, MessagesSquare, Trophy, LogOut, Sparkles, FileText, BookText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import StreakBadge from "./StreakBadge.jsx";
import XPBar from "./XPBar.jsx";

const NAV = {
  student: [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/assignments", label: "Assignments", icon: BookOpen },
    { to: "/student/exams", label: "Exams", icon: GraduationCap },
    { to: "/student/grades", label: "Grades", icon: Award },
    { to: "/student/attendance", label: "Attendance", icon: Calendar },
    { to: "/forum", label: "Forum", icon: MessagesSquare },
    { to: "/chat", label: "Chat", icon: MessageSquare },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/badges", label: "Badges", icon: Sparkles },
  ],
  parent: [
    { to: "/parent", label: "Dashboard", icon: LayoutDashboard },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  tutor: [
    { to: "/tutor", label: "Dashboard", icon: LayoutDashboard },
    { to: "/tutor/grades", label: "Enter Grades", icon: Award },
    { to: "/tutor/reports", label: "Reports", icon: FileText },
    { to: "/forum", label: "Forum", icon: MessagesSquare },
    { to: "/chat", label: "Chat", icon: MessageSquare },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/subjects", label: "Subjects", icon: BookText },
    { to: "/forum", label: "Forum", icon: MessagesSquare },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  if (!user) return null;
  const items = NAV[user.role] || [];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 glass border-r border-white/5 p-4 flex flex-col gap-1 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="text-3xl">🎓</span>
          <div>
            <div className="font-bold gradient-text text-lg leading-tight">LMS Portal</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">v2 · Gamified</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-primary/30 to-accent/20 text-white shadow-md"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[10px] uppercase text-muted-foreground">{user.role}</div>
            </div>
          </div>
          <button onClick={() => { logout(); nav("/login"); }} className="btn-ghost w-full justify-start text-destructive">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {user.role === "student" && (
          <div className="px-8 pt-6 flex items-center gap-4">
            <XPBar />
            <StreakBadge />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
