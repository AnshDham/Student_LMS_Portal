import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";
import StudentDashboard from "./pages/student/Dashboard.jsx";
import StudentAssignments from "./pages/student/Assignments.jsx";
import StudentExams from "./pages/student/Exams.jsx";
import ExamPlay from "./pages/student/ExamPlay.jsx";
import StudentGrades from "./pages/student/Grades.jsx";
import StudentAttendance from "./pages/student/Attendance.jsx";
import ParentDashboard from "./pages/parent/Dashboard.jsx";
import TutorDashboard from "./pages/tutor/Dashboard.jsx";
import TutorGrades from "./pages/tutor/EnterGrades.jsx";
import TutorReports from "./pages/tutor/Reports.jsx";
import ReportCard from "./pages/tutor/ReportCard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminSubjects from "./pages/admin/Subjects.jsx";
import Forum from "./pages/Forum.jsx";
import ForumThread from "./pages/ForumThread.jsx";
import Chat from "./pages/Chat.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Badges from "./pages/Badges.jsx";

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route element={<Protected><Layout /></Protected>}>
          {/* Student */}
          <Route path="/student" element={<Protected roles={["student"]}><StudentDashboard /></Protected>} />
          <Route path="/student/assignments" element={<Protected roles={["student"]}><StudentAssignments /></Protected>} />
          <Route path="/student/exams" element={<Protected roles={["student"]}><StudentExams /></Protected>} />
          <Route path="/student/exam/:id" element={<Protected roles={["student"]}><ExamPlay /></Protected>} />
          <Route path="/student/grades" element={<Protected roles={["student"]}><StudentGrades /></Protected>} />
          <Route path="/student/attendance" element={<Protected roles={["student"]}><StudentAttendance /></Protected>} />

          {/* Parent */}
          <Route path="/parent" element={<Protected roles={["parent"]}><ParentDashboard /></Protected>} />

          {/* Tutor */}
          <Route path="/tutor" element={<Protected roles={["tutor"]}><TutorDashboard /></Protected>} />
          <Route path="/tutor/grades" element={<Protected roles={["tutor"]}><TutorGrades /></Protected>} />
          <Route path="/tutor/reports" element={<Protected roles={["tutor"]}><TutorReports /></Protected>} />
          <Route path="/tutor/reports/:studentId" element={<Protected roles={["tutor", "admin"]}><ReportCard /></Protected>} />

          {/* Admin */}
          <Route path="/admin" element={<Protected roles={["admin"]}><AdminDashboard /></Protected>} />
          <Route path="/admin/users" element={<Protected roles={["admin"]}><AdminUsers /></Protected>} />
          <Route path="/admin/subjects" element={<Protected roles={["admin"]}><AdminSubjects /></Protected>} />

          {/* Shared */}
          <Route path="/forum" element={<Protected roles={["student", "tutor", "admin"]}><Forum /></Protected>} />
          <Route path="/forum/:id" element={<Protected roles={["student", "tutor", "admin"]}><ForumThread /></Protected>} />
          <Route path="/chat" element={<Protected roles={["student", "tutor", "admin"]}><Chat /></Protected>} />
          <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
          <Route path="/badges" element={<Protected><Badges /></Protected>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
