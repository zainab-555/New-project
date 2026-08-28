# 🎓 CampusHub — Smart College Survival Assistant

A complete, modern college companion web application built with **React**, **Vite**, **Node.js/Express**, **MongoDB**, and **AI Doubt Solver**.

---

## 📁 Project Structure

```
├── client/                     # ⚛️ React Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # App entry point
│       ├── App.jsx             # Main router & layout shell
│       ├── styles.css          # Glassmorphic Dark/Light CSS design system
│       ├── components/
│       │   ├── Header.jsx      # Top greeting & quick search bar
│       │   ├── Sidebar.jsx     # Desktop navigation drawer
│       │   ├── BottomNav.jsx   # Mobile floating bottom navbar
│       │   ├── Toast.jsx       # Floating notification alerts
│       │   ├── QuickSearchModal.jsx # Ctrl+K global search palette
│       │   ├── AddClassModal.jsx
│       │   ├── AddAssignmentModal.jsx
│       │   └── AddNoteModal.jsx
│       ├── views/
│       │   ├── HomeView.jsx         # Dashboard with Live Bunk-O-Meter
│       │   ├── TimetableView.jsx    # Schedule with Day filters & CRUD
│       │   ├── AssistantView.jsx    # AI Study Assistant & Doubt Solver
│       │   ├── AttendanceView.jsx   # Subject-wise attendance & Bunk math
│       │   ├── AssignmentsView.jsx  # Kanban board & countdown deadlines
│       │   ├── NotesView.jsx        # Study notes & engineering cheatsheets
│       │   ├── CgpaView.jsx         # SGPA/CGPA target planner
│       │   └── ProfileView.jsx      # Student details, theme, API config
│       └── services/
│           ├── api.js          # REST API client (http://localhost:5000)
│           ├── storage.js      # Persistent localStorage fallback & seed data
│           └── aiKnowledge.js  # Built-in CS/Academic knowledge base
│
├── server/                     # 🚀 Node.js / Express Backend
│   ├── server.js               # Express API (/api/classes, /api/assistant, /api/health)
│   ├── package.json
│   └── .env.example
│
└── package.json                # Root workspace configuration
```

---

## 🚀 How to Run

### Option 1: Run Both Frontend & Backend Together (Root Directory)
```bash
# 1. Install dependencies
npm run install:all

# 2. Run both Client & Server concurrently
npm run dev
```

- **Frontend (React)** runs at: `http://localhost:5173`
- **Backend (Express)** runs at: `http://localhost:5000`

---

### Option 2: Run Separately

#### ⚛️ Start Frontend (Client)
```bash
cd client
npm install
npm run dev
```

#### 🚀 Start Backend (Server)
```bash
cd server
npm install
# Optional: copy .env.example to .env and configure MongoDB & OpenAI
node --watch server.js
```

---

## ✨ Key Features & Highlights

1. **🏠 Interactive Dashboard**:
   - Time-based greeting, live stats (Attendance %, CGPA, Pending Deadlines, Today's Class Count).
   - **Bunk-O-Meter Widget**: Real-time calculator that tells you how many lectures you can safely skip or need to attend to maintain your 75%/80% target.

2. **📅 Timetable & Schedule Manager**:
   - Filter by day (Mon–Sat, All), List & Grid views.
   - Add/Delete classes with live backend sync (`/api/classes`) + local fallback.
   - Export to JSON and Print schedule.

3. **🤖 AI Study Assistant & Doubt Solver**:
   - Interactive chat connected to `/api/assistant`.
   - Built-in CS knowledge base for DBMS, DSA, OOPs, OS, Networks, and Web Dev.
   - Specialized tools: **Flashcard Generator** and **Formal Leave Letter Drafter**.

4. **📊 Attendance & Bunk Tracker**:
   - Subject-wise attendance calculation with circular gauges.
   - +Present / +Absent quick logger with instant persistence.

5. **📝 Assignments & Deadlines**:
   - Kanban board (Pending, In Progress, Submitted) and List view.
   - Priority badges (High, Medium, Low) and days-remaining counters.

6. **📚 Study Notes & Cheatsheets**:
   - Categorized markdown notes with search & pin feature.
   - Pre-loaded cheatsheets for SQL queries, Git commands, Big-O complexity, and HTTP status codes.

7. **🎓 GPA & CGPA Target Simulator**:
   - Semester-wise SGPA calculations and target grade goals.

8. **🎨 Modern UI & Theme Engine**:
   - Dark Glassmorphism and Clean Light modes.
   - Responsive for Mobile (bottom navigation) and Desktop (sidebar drawer).
