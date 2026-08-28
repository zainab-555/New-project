// Local Storage Service with Initial Seed Data

const STORAGE_KEYS = {
  PROFILE: 'campushub_profile',
  CLASSES: 'campushub_classes',
  ATTENDANCE: 'campushub_attendance',
  ASSIGNMENTS: 'campushub_assignments',
  NOTES: 'campushub_notes',
  CGPA: 'campushub_cgpa',
  THEME: 'campushub_theme',
  SAVED_CHATS: 'campushub_ai_chats',
};

const DEFAULT_PROFILE = {
  name: 'Aman Sharma',
  college: 'National Institute of Technology',
  branch: 'Computer Science & Engineering',
  semester: '6th Semester',
  rollNo: '21BCSE042',
  avatarTone: 'violet',
  targetAttendance: 75,
  targetCgpa: 8.5,
};

const DEFAULT_CLASSES = [
  { _id: 'seed-1', title: 'Data Structures & Algorithms', code: 'CSE-301', time: '09:00 AM', room: 'LH-102', day: 'Mon', instructor: 'Dr. Sharma', tone: 'indigo' },
  { _id: 'seed-2', title: 'Database Management Systems', code: 'CSE-302', time: '10:15 AM', room: 'CS Lab 2', day: 'Mon', instructor: 'Prof. Ananya', tone: 'amber' },
  { _id: 'seed-3', title: 'Full Stack Web Development', code: 'CSE-303', time: '01:00 PM', room: 'LH-204', day: 'Mon', instructor: 'Er. Rahul Verma', tone: 'emerald' },
  { _id: 'seed-4', title: 'Operating Systems', code: 'CSE-304', time: '09:00 AM', room: 'LH-101', day: 'Tue', instructor: 'Dr. V. Rao', tone: 'rose' },
  { _id: 'seed-5', title: 'Computer Networks', code: 'CSE-305', time: '11:00 AM', room: 'Network Lab', day: 'Tue', instructor: 'Prof. Sneha Gupta', tone: 'cyan' },
  { _id: 'seed-6', title: 'Theory of Computation', code: 'CSE-306', time: '02:00 PM', room: 'LH-105', day: 'Wed', instructor: 'Dr. Mathur', tone: 'indigo' },
  { _id: 'seed-7', title: 'Data Structures & Algorithms', code: 'CSE-301', time: '09:00 AM', room: 'LH-102', day: 'Wed', instructor: 'Dr. Sharma', tone: 'indigo' },
  { _id: 'seed-8', title: 'Software Engineering', code: 'CSE-307', time: '10:30 AM', room: 'LH-103', day: 'Thu', instructor: 'Prof. K. Iyer', tone: 'amber' },
  { _id: 'seed-9', title: 'AI & Machine Learning Basics', code: 'CSE-308', time: '01:30 PM', room: 'AI Lab', day: 'Fri', instructor: 'Dr. P. Sen', tone: 'emerald' },
];

const DEFAULT_ATTENDANCE = [
  { id: 'att-1', subject: 'Data Structures & Algorithms', code: 'CSE-301', attended: 26, total: 32, instructor: 'Dr. Sharma', color: '#6366f1' },
  { id: 'att-2', subject: 'Database Management Systems', code: 'CSE-302', attended: 21, total: 30, instructor: 'Prof. Ananya', color: '#f59e0b' },
  { id: 'att-3', subject: 'Full Stack Web Development', code: 'CSE-303', attended: 28, total: 30, instructor: 'Er. Rahul Verma', color: '#10b981' },
  { id: 'att-4', subject: 'Operating Systems', code: 'CSE-304', attended: 18, total: 28, instructor: 'Dr. V. Rao', color: '#f43f5e' },
  { id: 'att-5', subject: 'Computer Networks', code: 'CSE-305', attended: 24, total: 28, instructor: 'Prof. Sneha Gupta', color: '#06b6d4' },
];

const DEFAULT_ASSIGNMENTS = [
  { id: 'asg-1', title: 'DBMS Normalization & ER Mini Project', subject: 'CSE-302', dueDate: '2026-09-05', priority: 'High', status: 'in-progress', notes: 'Design schemas up to 3NF/BCNF with MongoDB comparison.' },
  { id: 'asg-2', title: 'DSA Problem Sheet - Graphs & Dynamic Programming', subject: 'CSE-301', dueDate: '2026-09-08', priority: 'Medium', status: 'pending', notes: 'Implement Dijkstra, Prim, and 0/1 Knapsack in C++ or Java.' },
  { id: 'asg-3', title: 'React Single Page Application with REST API', subject: 'CSE-303', dueDate: '2026-09-12', priority: 'High', status: 'in-progress', notes: 'Build a college portal with CRUD timetable and authentication.' },
  { id: 'asg-4', title: 'OS Page Replacement Algorithms Simulation', subject: 'CSE-304', dueDate: '2026-09-15', priority: 'Low', status: 'pending', notes: 'Simulate FIFO, LRU, and Optimal page replacement in Python.' },
  { id: 'asg-5', title: 'Subnetting & TCP/IP Socket Programming Lab', subject: 'CSE-305', dueDate: '2026-08-25', priority: 'Medium', status: 'completed', notes: 'Done and verified in lab session.' },
];

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'DBMS Key Concepts & ACID Properties',
    category: 'DBMS',
    tags: ['DBMS', 'Exam', 'SQL'],
    pinned: true,
    updatedAt: '2026-08-28',
    content: `## ACID Properties in DBMS
- **Atomicity**: Entire transaction executes or none at all (All or Nothing).
- **Consistency**: Database remains in a valid state before and after transaction.
- **Isolation**: Concurrent transactions do not interfere with one another.
- **Durability**: Committed changes persist even after system crashes.

### Normal Forms Cheat Sheet:
1. **1NF**: Atomic column values, unique row identifiers.
2. **2NF**: In 1NF + No partial dependency (non-prime attributes depend on the full candidate key).
3. **3NF**: In 2NF + No transitive dependency (non-prime attributes cannot depend on non-prime attributes).
4. **BCNF**: For every functional dependency X -> Y, X must be a super key.`,
  },
  {
    id: 'note-2',
    title: 'Dynamic Programming Patterns for Placements',
    category: 'DSA',
    tags: ['DSA', 'Placement', 'LeetCode'],
    pinned: true,
    updatedAt: '2026-08-26',
    content: `### Top DP Patterns to Master
1. **0/1 Knapsack**: Subset Sum, Equal Partition, Target Sum.
2. **Unbounded Knapsack**: Coin Change I & II, Rod Cutting.
3. **Longest Common Subsequence (LCS)**: Edit Distance, Longest Palindromic Substring.
4. **Longest Increasing Subsequence (LIS)**: Russian Doll Envelopes.
5. **Matrix Chain Multiplication (MCM)**: Palindrome Partitioning.

> Tip: Always draw the recurrence tree and check for overlapping subproblems before writing memoization!`,
  },
  {
    id: 'note-3',
    title: 'Operating Systems - Process vs Thread & Deadlocks',
    category: 'OS',
    tags: ['OS', 'Viva', 'Interview'],
    pinned: false,
    updatedAt: '2026-08-24',
    content: `### Process vs Thread
- **Process**: Independent execution unit with its own virtual memory space, file handles, and PCB.
- **Thread**: Lightweight subprocess sharing code, data, and OS resources with sibling threads inside the same process.

### 4 Necessary Conditions for Deadlock:
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait`,
  },
];

const DEFAULT_CGPA = {
  target: 8.5,
  semesters: [
    {
      sem: 1,
      sgpa: 8.20,
      credits: 22,
      courses: [
        { name: 'Engineering Mathematics I', credits: 4, grade: 'A', points: 9 },
        { name: 'Physics for Engineers', credits: 4, grade: 'B+', points: 8 },
        { name: 'Basic Electrical Engg', credits: 3, grade: 'A', points: 9 },
        { name: 'Programming in C', credits: 4, grade: 'O', points: 10 },
        { name: 'Engineering Graphics', credits: 3, grade: 'B', points: 7 },
        { name: 'Communication Skills', credits: 2, grade: 'A+', points: 9 },
        { name: 'Programming Lab', credits: 2, grade: 'O', points: 10 },
      ],
    },
    {
      sem: 2,
      sgpa: 8.45,
      credits: 22,
      courses: [
        { name: 'Engineering Mathematics II', credits: 4, grade: 'A', points: 9 },
        { name: 'Data Structures & Algorithms', credits: 4, grade: 'O', points: 10 },
        { name: 'Digital Logic Design', credits: 4, grade: 'A+', points: 9 },
        { name: 'Environmental Science', credits: 2, grade: 'B+', points: 8 },
        { name: 'Object Oriented Programming', credits: 4, grade: 'O', points: 10 },
        { name: 'DSA Lab', credits: 2, grade: 'O', points: 10 },
        { name: 'Digital Electronics Lab', credits: 2, grade: 'A', points: 9 },
      ],
    },
    {
      sem: 3,
      sgpa: 8.60,
      credits: 24,
      courses: [
        { name: 'Discrete Mathematics', credits: 4, grade: 'A+', points: 9 },
        { name: 'Computer Organization', credits: 4, grade: 'A', points: 9 },
        { name: 'Database Management Systems', credits: 4, grade: 'O', points: 10 },
        { name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', points: 9 },
        { name: 'DBMS Lab', credits: 2, grade: 'O', points: 10 },
        { name: 'Algorithms Lab', credits: 2, grade: 'A+', points: 9 },
        { name: 'Universal Human Values', credits: 2, grade: 'A', points: 9 },
      ],
    },
    {
      sem: 4,
      sgpa: 8.55,
      credits: 23,
      courses: [
        { name: 'Operating Systems', credits: 4, grade: 'A', points: 9 },
        { name: 'Computer Networks', credits: 4, grade: 'A+', points: 9 },
        { name: 'Theory of Computation', credits: 4, grade: 'B+', points: 8 },
        { name: 'Software Engineering', credits: 3, grade: 'A', points: 9 },
        { name: 'Web Technologies', credits: 4, grade: 'O', points: 10 },
        { name: 'OS & Networks Lab', credits: 2, grade: 'A+', points: 9 },
        { name: 'Web Dev Lab', credits: 2, grade: 'O', points: 10 },
      ],
    },
    {
      sem: 5,
      sgpa: 8.70,
      credits: 21,
      courses: [
        { name: 'Compiler Design', credits: 4, grade: 'A', points: 9 },
        { name: 'AI & Machine Learning', credits: 4, grade: 'O', points: 10 },
        { name: 'Cloud Computing', credits: 3, grade: 'A+', points: 9 },
        { name: 'Cyber Security', credits: 3, grade: 'A', points: 9 },
        { name: 'Machine Learning Lab', credits: 2, grade: 'O', points: 10 },
        { name: 'Industry Internship', credits: 3, grade: 'O', points: 10 },
        { name: 'Minor Project', credits: 2, grade: 'O', points: 10 },
      ],
    },
  ],
};

// Generic storage accessors with seed fallback
export const storage = {
  getProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },
  saveProfile: (profile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getClasses: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return data ? JSON.parse(data) : DEFAULT_CLASSES;
    } catch {
      return DEFAULT_CLASSES;
    }
  },
  saveClasses: (classes) => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  getAttendance: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : DEFAULT_ATTENDANCE;
    } catch {
      return DEFAULT_ATTENDANCE;
    }
  },
  saveAttendance: (attendance) => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  },

  getAssignments: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : DEFAULT_ASSIGNMENTS;
    } catch {
      return DEFAULT_ASSIGNMENTS;
    }
  },
  saveAssignments: (assignments) => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getNotes: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  },
  saveNotes: (notes) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getCgpaData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CGPA);
      return data ? JSON.parse(data) : DEFAULT_CGPA;
    } catch {
      return DEFAULT_CGPA;
    }
  },
  saveCgpaData: (cgpaData) => {
    localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(cgpaData));
  },

  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  exportAllData: () => {
    return {
      profile: storage.getProfile(),
      classes: storage.getClasses(),
      attendance: storage.getAttendance(),
      assignments: storage.getAssignments(),
      notes: storage.getNotes(),
      cgpa: storage.getCgpaData(),
      exportedAt: new Date().toISOString(),
    };
  },

  importAllData: (data) => {
    if (!data) return false;
    if (data.profile) storage.saveProfile(data.profile);
    if (data.classes) storage.saveClasses(data.classes);
    if (data.attendance) storage.saveAttendance(data.attendance);
    if (data.assignments) storage.saveAssignments(data.assignments);
    if (data.notes) storage.saveNotes(data.notes);
    if (data.cgpa) storage.saveCgpaData(data.cgpa);
    return true;
  },

  resetAllData: () => {
    localStorage.clear();
  },
};
