# LMS Portal v2 — API Reference

Base URL: `http://localhost:5000/api` · Auth: `Authorization: Bearer <jwt>`

## Auth
- `POST /auth/register` — body: `{ name, email, password, parentName, parentEmail, grade? }` → `{ token, user }`
- `POST /auth/login` — body: `{ email, password }` → `{ token, user }`
- `GET /auth/me` → `{ user }`

## Users
- `GET /users?role=` *(admin/tutor)* → `{ users }`
- `GET /users/students` → role-scoped student list
- `GET /users/leaderboard` → top 10 by XP
- `GET /users/:id`
- `DELETE /users/:id` *(admin)*

## Subjects
- `GET /subjects` · `POST /subjects` *(admin)* · `PUT /subjects/:id` · `DELETE /subjects/:id`

## Classes / Assignments / Exams
- `GET/POST /classes`, `GET/POST /assignments`, `GET/POST /exams`
- `GET /exams/:id/play` *(student)* — questions without answers
- `POST /exams/:id/submit` body: `{ answers: { [qid]: optionIndex } }` → `{ score, xpEarned, newBadges, xpResult }`

## Grades
- `GET /grades` (role-scoped, supports `?studentId=`)
- `POST /grades` *(tutor/admin)* — auto-awards XP & evaluates badges
- `GET /grades/export/:studentId` → CSV download

## Attendance
- `GET /attendance` (role-scoped)
- `POST /attendance/mark` body: `{ classId, attendedMin, studentId? }`

## Forum (no parents)
- `GET /forum/posts?subject=` · `GET /forum/posts/:id`
- `POST /forum/posts` body: `{ title, body, subject? }`
- `POST /forum/posts/:id/replies` body: `{ body }`
- `POST /forum/posts/:id/upvote`

## Chat (no parents)
- `GET /chat/threads`
- `GET /chat/with/:userId`
- `POST /chat/with/:userId` body: `{ body }`
- Socket.IO: connect with `auth: { token }`, emit `join`, `message`, `typing`

## Reports
- `GET /reports/:studentId` → `{ student, bySubject, grades, attendancePct, overall, xp, level, streakDays, badges }`

## Gamify
- `GET /gamify/badges` → catalog of all badges
