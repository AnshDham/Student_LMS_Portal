# 🎓 LMS Portal — Learning Management System

A full-stack, gamified Learning Management Portal built with **Node.js/Express**, **MongoDB**, and **React 18 + Vite**. Designed for **Students, Parents, Tutors, and Admins** with role-based dashboards, assignments, attendance, grades, real-time chat, exams, forums, XP/badges, and more.

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based authentication with bcrypt password hashing
- Role-Based Access Control (RBAC) for 4 roles:
  - **Student** — submit assignments, take exams, earn XP/badges
  - **Parent** — view linked child's progress, grades, attendance
  - **Tutor** — create assignments/exams, grade work, mark attendance
  - **Admin** — manage users, subjects, view analytics
- Self-registration for students; admin-created accounts for others

### 📚 Core Academic Features
- **Subjects CRUD** (admin) with emoji + color customization
- **Assignments** — create, submit, grade with feedback
- **Online Exam Engine** — MCQ-based, full-screen mode, countdown timer, auto-grading, confetti on submit
- **Grades** — per-subject, per-assignment with CSV export
- **Attendance** — daily marking by tutor, calendar view for student/parent
- **Printable Report Cards** — beautiful HTML report via `window.print()`

### 🎮 Gamification Engine
- **XP & Levels** — earn XP for submissions, attendance, high grades (level threshold = 100 × level)
- **12+ Unlockable Badges** — `first_submission`, `streak_3`, `streak_7`, `math_wizard`, `perfect_attendance`, etc.
- **Streak Counter** with pulsing 🔥 emoji (daily activity tracking)
- **Leaderboard** — class-wide XP rankings
- **Subject Mastery Rings** — animated progress charts (Recharts)

### 💬 Communication
- **Real-time Chat** (Socket.IO) — 1-to-1 messaging with typing indicators and unread bubbles
- **Discussion Forum** — Reddit-style threaded posts with Markdown support and upvotes
- **Notifications** — toast notifications via `sonner`

### 🎨 UI/UX
- Dark "glassmorphism" theme with TailwindCSS
- Framer Motion page transitions and staggered animations
- Skeleton loaders for async states
- Fully responsive (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

### Backend
| Tech | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | ^4.19 | HTTP server & routing |
| MongoDB | 6+ | Database |
| Mongoose | ^8.x | ODM |
| jsonwebtoken | ^9.x | JWT auth |
| bcryptjs | ^2.x | Password hashing |
| Socket.IO | ^4.x | Real-time chat |
| express-validator | ^7.x | Input validation |
| json2csv | ^6.x | CSV export |
| dotenv | ^16.x | Env config |
| cors | ^2.x | CORS middleware |

### Frontend
| Tech | Version | Purpose |
|------|---------|---------|
| React | 18.x | UI library |
| Vite | 5.x | Build tool |
| react-router-dom | 6.x | Routing |
| axios | ^1.x | HTTP client |
| TailwindCSS | 3.x | Styling |
| shadcn/ui | latest | Component library |
| Framer Motion | ^11.x | Animations |
| Recharts | ^2.x | Charts |
| Socket.IO Client | ^4.x | Realtime |
| canvas-confetti | ^1.x | Celebrations |
| sonner | ^1.x | Toasts |
| react-markdown | ^9.x | Forum markdown |

### Database
- **MongoDB** (local or Atlas)
- Collections: `users`, `subjects`, `assignments`, `submissions`, `exams`, `examattempts`, `attendance`, `grades`, `messages`, `forumposts`, `badges`

---

## 📁 Project Structure

```
lms-portal/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection, JWT config
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # auth, RBAC, error handler
│   │   ├── utils/          # gamify.js (XP/badges), helpers
│   │   ├── sockets/        # Socket.IO handlers
│   │   ├── seed.js         # Sample data seeder
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI + shadcn components
│   │   ├── pages/          # Route pages (Login, Dashboard, etc.)
│   │   ├── hooks/          # useAuth, useSocket, etc.
│   │   ├── lib/            # axios instance, utils
│   │   ├── context/        # AuthContext
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
│
├── API.md                  # Full endpoint documentation
└── README.md
```

---

## 🚀 Running Locally (Windows 11 + VS Code)

### Prerequisites
1. **Node.js 18+** — https://nodejs.org
2. **MongoDB Community Server** — https://www.mongodb.com/try/download/community
   - Install as a Windows Service (default option)
   - Default URI: `mongodb://localhost:27017`
3. **VS Code** — https://code.visualstudio.com
4. **Git** (optional) — https://git-scm.com

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)

### Step 1 — Extract & Open
```powershell
# Extract the zip, then open in VS Code
cd C:\path\to\lms-portal
code .
```

### Step 2 — Verify MongoDB is Running
```powershell
# Check service status
Get-Service MongoDB

# If stopped, start it:
Start-Service MongoDB
```

### Step 3 — Backend Setup
Open a VS Code terminal (`` Ctrl+` ``):
```powershell
cd backend
copy .env.example .env
npm install
npm run seed       # Populate MongoDB with sample data
npm run dev        # Starts on http://localhost:5000
```

**`.env` defaults:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms_portal
JWT_SECRET=change_me_to_a_long_random_string
CLIENT_URL=http://localhost:5173
```

### Step 4 — Frontend Setup
Open a **second** terminal:
```powershell
cd frontend
copy .env.example .env
npm install
npm run dev        # Starts on http://localhost:5173
```

**`.env` defaults:**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 5 — Open the App
Visit **http://localhost:5173** in your browser.

---

## 👤 Demo Logins (after `npm run seed`)

| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Admin   | admin@lms.test       | admin123    |
| Tutor   | tutor1@lms.test      | tutor123    |
| Student | student1@lms.test    | student123  |
| Parent  | parent1@lms.test     | parent123   |

---

## 🌐 API Endpoints (summary)

Full docs in **`API.md`**. Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` — student self-signup
- `POST /auth/login` — returns JWT
- `GET  /auth/me` — current user profile

### Users (admin)
- `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`

### Subjects
- `GET /subjects`, `POST /subjects` (admin), `PUT/DELETE /subjects/:id`

### Assignments
- `GET /assignments`, `POST /assignments` (tutor)
- `POST /assignments/:id/submit` (student)
- `POST /assignments/:id/grade/:submissionId` (tutor)

### Exams
- `GET /exams`, `POST /exams` (tutor)
- `POST /exams/:id/start`, `POST /exams/:id/submit`

### Attendance
- `POST /attendance` (tutor), `GET /attendance/:userId`

### Grades
- `GET /grades/:userId`, `GET /grades/:userId/export` (CSV)

### Gamification
- `GET /gamify/leaderboard`, `GET /gamify/me/badges`

### Chat & Forum
- `GET /messages/:userId`, `POST /messages`
- `GET /forum`, `POST /forum`, `POST /forum/:id/upvote`

### Reports
- `GET /reports/:userId/card` (printable HTML report card)

---

## 🔌 Integration Example

```js
// frontend/src/lib/api.js
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Usage in a React component
const { data } = await api.get("/assignments");
```

```js
// Socket.IO client
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: { token: localStorage.getItem("token") },
});
socket.on("message", (msg) => console.log("New message:", msg));
```

---

## 📜 NPM Scripts

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Production start |
| `npm run seed` | Reset DB with sample data |

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

---

## 🐛 Troubleshooting (Windows)

| Problem | Fix |
|---------|-----|
| `MongooseServerSelectionError` | Run `Start-Service MongoDB` in PowerShell (admin) |
| Port 5000 in use | Change `PORT` in `backend/.env` |
| Port 5173 in use | Vite auto-picks 5174; or set `--port` in script |
| CORS error | Confirm `CLIENT_URL` in backend `.env` matches frontend URL |
| `JWT malformed` | Clear browser localStorage, re-login |
| Socket not connecting | Check `VITE_SOCKET_URL` and that backend is running |

---

## 🚢 Deployment Notes

- **Backend**: Deploy to Render, Railway, or any Node host. Set env vars from `.env.example`. Use **MongoDB Atlas** for managed DB.
- **Frontend**: Deploy `frontend/dist` to Vercel, Netlify, or Cloudflare Pages. Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend URLs.
- **CORS**: Update `CLIENT_URL` in backend env to your deployed frontend domain.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

**Built with ❤️ for modern education.**
