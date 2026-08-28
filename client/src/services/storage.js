// Local Storage & Mock Persistence Service with Full 1st-8th Semester Seeds

const STORAGE_KEYS = {
  AUTH_USER: 'campushub_auth_user',
  PROFILE: 'campushub_profile',
  FACULTY_PROFILE: 'campushub_faculty_profile',
  CLASSES: 'campushub_classes',
  ATTENDANCE: 'campushub_attendance',
  ASSIGNMENTS: 'campushub_assignments',
  NOTES: 'campushub_notes',
  CGPA: 'campushub_cgpa',
  THEME: 'campushub_theme',
  VAULT_RESOURCES: 'campushub_vault_resources',
  COMMUNITY_POSTS: 'campushub_community_posts',
  LEAVES: 'campushub_leaves',
  BOOKMARKS: 'campushub_vault_bookmarks',
  ROSTER: 'campushub_student_roster',
};

export const DEMO_STUDENT = {
  id: '21BCSE042',
  enrollmentNo: '21BCSE042',
  name: 'Aman Sharma',
  role: 'student',
  college: 'National Institute of Technology',
  branch: 'Computer Science & Engineering',
  semester: 6,
  semesterLabel: '6th Semester',
  email: 'aman.sharma@nit.edu.in',
  targetAttendance: 75,
  targetCgpa: 8.5,
};

export const DEMO_FACULTY = {
  id: 'FAC-CSE-01',
  facultyId: 'FAC-CSE-01',
  name: 'Ajaz Hussain Warsi',
  role: 'faculty',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
  college: 'National Institute of Technology',
  subjectsTaught: ['Data Structures & Algorithms', 'C Programming', 'Minor Capstone Project'],
  email: 'ajaz.warsi@nit.edu.in',
  room: 'Faculty Block B - 302',
};

// Seed student roster for faculty attendance
export const DEFAULT_STUDENT_ROSTER = [
  { studentRoll: '21BCSE041', studentName: 'Aakash Verma', status: 'present', semester: 6 },
  { studentRoll: '21BCSE042', studentName: 'Aman Sharma', status: 'present', semester: 6 },
  { studentRoll: '21BCSE043', studentName: 'Ananya Roy', status: 'present', semester: 6 },
  { studentRoll: '21BCSE044', studentName: 'Devansh Singhal', status: 'absent', semester: 6 },
  { studentRoll: '21BCSE045', studentName: 'Ishaan Patel', status: 'present', semester: 6 },
  { studentRoll: '21BCSE046', studentName: 'Kavya Mehra', status: 'late', semester: 6 },
  { studentRoll: '21BCSE047', studentName: 'Mohit Rao', status: 'present', semester: 6 },
  { studentRoll: '21BCSE048', studentName: 'Pooja Nair', status: 'present', semester: 6 },
  { studentRoll: '21BCSE049', studentName: 'Rohan Gupta', status: 'absent', semester: 6 },
  { studentRoll: '21BCSE050', studentName: 'Tanvi Saxena', status: 'present', semester: 6 },
];

// Rich Academic Vault Resources for 1st to 8th Semester
export const DEFAULT_VAULT_RESOURCES = [
  // --- Semester 1 ---
  {
    _id: 'res-101',
    title: 'C Programming Complete Pointers & Memory Cheatsheet',
    resourceType: 'Note',
    semester: 1,
    subject: 'Programming for Problem Solving (C)',
    code: 'CSE-101',
    description: 'Deep-dive into pointer arithmetic, malloc/calloc/free, struct padding, and double pointers.',
    content: `## 📌 C Pointers & Dynamic Memory
\`\`\`c
int *ptr = (int*) malloc(5 * sizeof(int));
if (ptr == NULL) { printf("Memory Allocation Failed"); exit(1); }
// Always free allocated heap memory
free(ptr); ptr = NULL;
\`\`\`
### Core Rules:
1. \`*ptr\` gives value (dereferencing).
2. \`&var\` gives memory address.
3. Pass-by-reference uses pointers to alter caller variables directly.`,
    fileUrl: 'https://example.com/c-pointers-guide.pdf',
    uploadedBy: { name: 'Ajaz Hussain Warsi', role: 'faculty', id: 'FAC-01' },
    downloadsCount: 142,
    createdAt: '2026-08-10',
  },
  {
    _id: 'res-102',
    title: 'Engineering Physics - Wave Optics & Lasers PYQ 2024 (Solved)',
    resourceType: 'PYQ',
    semester: 1,
    subject: 'Engineering Physics',
    code: 'PHY-101',
    description: 'End-Semester 2024 Exam Paper with complete numerical derivations & ray diagrams.',
    examYear: '2024 End-Sem',
    solutionAvailable: true,
    content: `### Q1. Derive expression for fringe width in Young's Double Slit Experiment (YDSE).
**Solution**:
$$\\beta = \\frac{\\lambda D}{d}$$
Where $D$ = Distance between slits and screen, $d$ = distance between slits, $\\lambda$ = wavelength.

### Q2. Explain Einstein's A and B coefficients in Laser pumping.
**Solution**:
1. Spontaneous Emission ($A_{21}$)
2. Stimulated Emission ($B_{21}$)
3. Stimulated Absorption ($B_{12}$)
At thermal equilibrium: $B_{12} = B_{21}$ and $A_{21} / B_{21} = \\frac{8\\pi h \\nu^3}{c^3}$.`,
    uploadedBy: { name: 'Dr. Manisha Sen', role: 'faculty', id: 'FAC-02' },
    downloadsCount: 98,
    createdAt: '2026-08-12',
  },

  // --- Semester 2 ---
  {
    _id: 'res-201',
    title: 'Data Structures Trees & Graph Traversals Handbook',
    resourceType: 'Note',
    semester: 2,
    subject: 'Data Structures & Algorithms',
    code: 'CSE-201',
    description: 'Comprehensive AVL rotations, Segment Trees, BFS, DFS, and topological sort.',
    content: `## 🌳 Tree Traversals Summary
- **Inorder (LNR)**: Produces sorted array on Binary Search Trees (BST).
- **Preorder (NLR)**: Used to serialize/clone trees.
- **Postorder (LRN)**: Used for bottom-up deletions & tree height calculations.

### AVL Tree Rotations:
1. **LL Rotation**: Single Right Rotate.
2. **RR Rotation**: Single Left Rotate.
3. **LR Rotation**: Left Rotate left child, then Right Rotate node.
4. **RL Rotation**: Right Rotate right child, then Left Rotate node.`,
    uploadedBy: { name: 'Ajaz Hussain Warsi', role: 'faculty', id: 'FAC-01' },
    downloadsCount: 310,
    createdAt: '2026-08-14',
  },
  {
    _id: 'res-202',
    title: 'DSA Mid-Term 2025 Question Paper with Code Solutions',
    resourceType: 'PYQ',
    semester: 2,
    subject: 'Data Structures & Algorithms',
    code: 'CSE-201',
    examYear: '2025 Mid-Sem',
    solutionAvailable: true,
    description: 'Stack applications, infix to postfix conversion, and Dijkstra algorithm numericals.',
    content: `### Problem: Convert Infix \`A + B * (C ^ D - E)\` to Postfix using Stack
**Step-by-step Operator Stack Trace**:
1. Read \`A\` -> Output: \`A\`
2. Read \`+\` -> Stack: \`[+]\`
3. Read \`B\` -> Output: \`A B\`
4. Read \`*\` -> Stack: \`[+, *]\`
5. Read \`(\` -> Stack: \`[+, *, (]\`
6. Final Postfix: \`A B C D ^ E - * +\``,
    uploadedBy: { name: 'Ajaz Hussain Warsi', role: 'faculty', id: 'FAC-01' },
    downloadsCount: 220,
    createdAt: '2026-08-15',
  },

  // --- Semester 3 ---
  {
    _id: 'res-301',
    title: 'DBMS Normalization & BCNF Step-by-Step Guide',
    resourceType: 'Note',
    semester: 3,
    subject: 'Database Management Systems (DBMS)',
    code: 'CSE-301',
    description: 'Functional dependencies, candidate key determination algorithm, and 3NF vs BCNF decomposition.',
    content: `## 🗄️ Candidate Key Finding Algorithm
Given Schema $R(A, B, C, D, E)$ and FDs:
$A \\to B, BC \\to D, E \\to A$

1. Essential attributes not present on RHS: $\{C, E\}$.
2. Closure $(CE)^+ = \\{C, E, A, B, D\\} = R$.
3. Since closure contains all attributes, **CE is the Minimal Candidate Key**!`,
    uploadedBy: { name: 'Prof. Ananya', role: 'faculty', id: 'FAC-03' },
    downloadsCount: 405,
    createdAt: '2026-08-16',
  },
  {
    _id: 'res-302',
    title: 'DBMS End-Sem 2024 Solved Question Paper',
    resourceType: 'PYQ',
    semester: 3,
    subject: 'Database Management Systems (DBMS)',
    code: 'CSE-301',
    examYear: '2024 End-Sem',
    solutionAvailable: true,
    description: 'Relational algebra queries, conflict serializability graphs, and B+ Tree insertions.',
    content: `### Q1. Check if Schedule S is Conflict Serializable:
\`S: r1(X); r2(Y); w1(X); r2(X); w2(Y); w1(Y)\`

**Precedence Graph Check**:
- Conflict \`w1(X) -> r2(X)\`: Edge $T_1 \\to T_2$.
- Conflict \`r2(Y) -> w1(Y)\`: Edge $T_2 \\to T_1$.
- **Cycle Detected**: $T_1 \\rightleftharpoons T_2$. Hence, schedule is **NOT Conflict Serializable**!`,
    uploadedBy: { name: 'Prof. Ananya', role: 'faculty', id: 'FAC-03' },
    downloadsCount: 185,
    createdAt: '2026-08-17',
  },

  // --- Semester 4 ---
  {
    _id: 'res-401',
    title: 'Operating Systems CPU Scheduling & Banker\'s Algorithm',
    resourceType: 'Note',
    semester: 4,
    subject: 'Operating Systems (OS)',
    code: 'CSE-401',
    description: 'Formulas for Turnaround Time, Waiting Time, Semaphore implementation, and Deadlock Avoidance.',
    content: `## 💻 Formulas:
- $\\text{Turnaround Time (TAT)} = \\text{Completion Time (CT)} - \\text{Arrival Time (AT)}$
- $\\text{Waiting Time (WT)} = \\text{TAT} - \\text{Burst Time (BT)}$

### Banker's Algorithm Safety Matrix:
$$\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$$
If $\\text{Need} \\le \\text{Available}$, allocate resources and release upon completion.`,
    uploadedBy: { name: 'Dr. V. Rao', role: 'faculty', id: 'FAC-04' },
    downloadsCount: 290,
    createdAt: '2026-08-18',
  },
  {
    _id: 'res-402',
    title: 'Computer Networks Subnetting & Routing PYQ 2024',
    resourceType: 'PYQ',
    semester: 4,
    subject: 'Computer Networks (CN)',
    code: 'CSE-402',
    examYear: '2024 End-Sem',
    solutionAvailable: true,
    description: 'CIDR notation calculations, Dijkstra link state routing, and TCP congestion window numericals.',
    content: `### Problem: Given IP \`192.168.10.0/27\`, find:
1. **Subnet Mask**: \`255.255.255.224\`
2. **Number of Subnets**: $2^{3} = 8$ subnets
3. **Usable Hosts per subnet**: $2^{(32-27)} - 2 = 32 - 2 = 30$ hosts.`,
    uploadedBy: { name: 'Prof. Sneha Gupta', role: 'faculty', id: 'FAC-05' },
    downloadsCount: 215,
    createdAt: '2026-08-19',
  },

  // --- Semester 5 ---
  {
    _id: 'res-501',
    title: 'Machine Learning Supervised Algorithms Cheatsheet',
    resourceType: 'Note',
    semester: 5,
    subject: 'Artificial Intelligence & Machine Learning',
    code: 'CSE-501',
    description: 'Mathematical intuition for Linear Regression, Logistic, SVM Kernel trick, Decision Trees & Random Forest.',
    content: `## 🤖 ML Key Concepts
- **Gradient Descent Update**: $\\theta_j := \\theta_j - \\alpha \\frac{\\partial J}{\\partial \\theta_j}$
- **Bias-Variance Tradeoff**: High Bias = Underfitting, High Variance = Overfitting.
- **Regularization**: L1 Lasso ($|w|$) for feature selection vs L2 Ridge ($w^2$) for weight shrinking.`,
    uploadedBy: { name: 'Dr. P. Sen', role: 'faculty', id: 'FAC-06' },
    downloadsCount: 380,
    createdAt: '2026-08-20',
  },

  // --- Semester 6 ---
  {
    _id: 'res-601',
    title: 'Full Stack MERN Architecture & React 18 Concurrent Features',
    resourceType: 'Note',
    semester: 6,
    subject: 'Full Stack Web Development (MERN Stack)',
    code: 'CSE-601',
    description: 'State management patterns, REST security, JWT refresh token rotation, and MongoDB indexing.',
    content: `## 🚀 MERN Production Architecture
1. **Client**: React 18, Vite, Custom Hook abstractions, CSS Glassmorphic design.
2. **Server**: Express.js modular routes, CORS whitelisting, async error boundary.
3. **Database**: MongoDB compound indexes, schema constraints, aggregation pipelines.
4. **Security**: Helmet headers, rate-limiting, bcrypt salt hashing.`,
    uploadedBy: { name: 'Er. Rahul Verma', role: 'faculty', id: 'FAC-07' },
    downloadsCount: 460,
    createdAt: '2026-08-21',
  },
  {
    _id: 'res-602',
    title: 'Full Stack Web Dev Lab Assignment - College Assistant App',
    resourceType: 'Assignment',
    semester: 6,
    subject: 'Full Stack Web Development (MERN Stack)',
    code: 'CSE-601',
    description: 'Build a multi-role portal with Attendance Bunk Calculator, Timetable CRUD, and AI chatbot integration.',
    content: `### Lab Submission Checklist:
- [x] Dual-role authentication (Student & Faculty).
- [x] 1st to 8th Semester Academic Resource Vault.
- [x] Interactive community forum with like/reply threads.
- [x] Live Bunk-O-Meter calculation with >= 75% target threshold.`,
    uploadedBy: { name: 'Er. Rahul Verma', role: 'faculty', id: 'FAC-07' },
    downloadsCount: 195,
    createdAt: '2026-08-22',
  },

  // --- Semester 7 & 8 ---
  {
    _id: 'res-701',
    title: 'Deep Learning Transformer Architecture & Attention Mechanism',
    resourceType: 'Note',
    semester: 7,
    subject: 'Deep Learning & Neural Networks',
    code: 'CSE-701',
    description: 'Scaled dot-product self-attention formula, Multi-Head Attention, and positional encodings.',
    content: `$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$
Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.`,
    uploadedBy: { name: 'Dr. P. Sen', role: 'faculty', id: 'FAC-06' },
    downloadsCount: 275,
    createdAt: '2026-08-23',
  },
  {
    _id: 'res-801',
    title: 'High Performance Computing GPU Parallelism & CUDA Guide',
    resourceType: 'Note',
    semester: 8,
    subject: 'High Performance Computing (HPC) & GPU Architecture',
    code: 'CSE-801',
    description: 'CUDA grids, blocks, threads, shared memory bank conflicts, and reduction algorithms.',
    content: `\`\`\`cuda
__global__ void vectorAdd(float *A, float *B, float *C, int N) {
    int i = blockDim.x * blockIdx.x + threadIdx.x;
    if (i < N) C[i] = A[i] + B[i];
}
\`\`\``,
    uploadedBy: { name: 'Dr. Mathur', role: 'faculty', id: 'FAC-08' },
    downloadsCount: 180,
    createdAt: '2026-08-24',
  },
];

// Rich Campus Community Discussion Forum Posts
export const DEFAULT_COMMUNITY_POSTS = [
  {
    _id: 'post-1',
    authorName: 'Ajaz Hussain Warsi',
    authorId: 'FAC-CSE-01',
    authorRole: 'faculty',
    authorDept: 'CSE Department',
    title: '📢 6th Semester Minor Project Submission Deadline Extended',
    content: 'Dear Students, In view of the upcoming campus technical fest, the deadline for submitting the Phase 1 Minor Project synopsis & architecture diagram has been extended to **September 15, 2026**. Please ensure all team members are updated.',
    semesterTag: 'Sem 6',
    categoryTag: 'Announcement',
    isAnnouncement: true,
    isPinned: true,
    likesCount: 34,
    likedBy: ['21BCSE042'],
    replies: [
      {
        authorName: 'Aman Sharma',
        authorRole: 'student',
        text: 'Thank you sir for the extension! Will the review happen in lab slot?',
        createdAt: '2026-08-27T10:30:00Z',
      },
      {
        authorName: 'Ajaz Hussain Warsi',
        authorRole: 'faculty',
        text: 'Yes Aman, review will be conducted during your regular Friday lab session.',
        createdAt: '2026-08-27T11:00:00Z',
      },
    ],
    createdAt: '2026-08-27T09:00:00Z',
  },
  {
    _id: 'post-2',
    authorName: 'Ananya Roy',
    authorId: '21BCSE043',
    authorRole: 'student',
    authorDept: 'CSE 6th Sem',
    title: '❓ How to optimize MongoDB aggregation pipeline for college attendance?',
    content: 'I have a collection of 5000+ student attendance logs. My query is lagging when grouping by subject and calculating percentage. Should I use compound indexing or `$facet` stage?',
    semesterTag: 'Sem 6',
    categoryTag: 'Doubt',
    isAnnouncement: false,
    isPinned: false,
    likesCount: 18,
    likedBy: [],
    replies: [
      {
        authorName: 'Prof. Ananya',
        authorRole: 'faculty',
        text: 'Create a compound index on `{ studentRoll: 1, subjectCode: 1, date: -1 }`. Also use `$project` early in the pipeline to filter only required fields before `$group`.',
        createdAt: '2026-08-28T14:15:00Z',
      },
    ],
    createdAt: '2026-08-28T12:00:00Z',
  },
  {
    _id: 'post-3',
    authorName: 'Devansh Singhal',
    authorId: '21BCSE044',
    authorRole: 'student',
    authorDept: 'CSE 4th Sem',
    title: '🚀 Looking for 2 Teammates for Smart India Hackathon (SIH 2026)',
    content: 'We are building an AI-powered automated smart campus timetable & attendance system using React & Node.js. Need 1 backend dev and 1 UI/UX designer. DM or reply if interested!',
    semesterTag: 'General',
    categoryTag: 'Project',
    isAnnouncement: false,
    isPinned: false,
    likesCount: 22,
    likedBy: ['21BCSE042'],
    replies: [
      {
        authorName: 'Aman Sharma',
        authorRole: 'student',
        text: 'Hey Devansh! I have experience with React 18 and Express APIs. Would love to collaborate.',
        createdAt: '2026-08-28T16:00:00Z',
      },
    ],
    createdAt: '2026-08-28T15:00:00Z',
  },
  {
    _id: 'post-4',
    authorName: 'Dr. P. Sen',
    authorId: 'FAC-06',
    authorRole: 'faculty',
    authorDept: 'AI & Data Science Lab',
    title: '🧠 5th & 7th Sem: Recommended Research Papers on Transformer LLMs',
    content: 'For students preparing for viva and capstone projects, please read "Attention Is All You Need" (Vaswani et al.) and the "BERT" pre-training architecture. Both PDFs are uploaded to the 5th and 7th Semester Vault.',
    semesterTag: 'Sem 5',
    categoryTag: 'ExamPrep',
    isAnnouncement: true,
    isPinned: false,
    likesCount: 45,
    likedBy: [],
    replies: [],
    createdAt: '2026-08-28T18:00:00Z',
  },
];

// Rich Leave Requests for Demo
export const DEFAULT_LEAVES = [
  {
    _id: 'leave-1',
    studentName: 'Aman Sharma',
    studentRoll: '21BCSE042',
    semester: '6th Semester',
    hodName: 'Ajaz Hussain Warsi',
    reason: 'Suffering from viral fever and advised 3 days medical bed rest by physician.',
    startDate: '2026-09-02',
    endDate: '2026-09-04',
    status: 'pending',
    facultyNotes: '',
    reviewedBy: '',
    createdAt: '2026-08-28T10:00:00Z',
  },
  {
    _id: 'leave-2',
    studentName: 'Ishaan Patel',
    studentRoll: '21BCSE045',
    semester: '6th Semester',
    hodName: 'Ajaz Hussain Warsi',
    reason: 'Attending Inter-NIT Hackathon Grand Finale in New Delhi.',
    startDate: '2026-08-24',
    endDate: '2026-08-26',
    status: 'approved',
    facultyNotes: 'Approved. Duty leave marked for 3 days.',
    reviewedBy: 'Ajaz Hussain Warsi',
    createdAt: '2026-08-22T08:00:00Z',
  },
];

// Persistent storage operations
export const storage = {
  getAuthUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : DEMO_STUDENT;
    } catch {
      return DEMO_STUDENT;
    }
  },
  saveAuthUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  getProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEMO_STUDENT;
    } catch {
      return DEMO_STUDENT;
    }
  },
  saveProfile: (p) => localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(p)),

  getFacultyProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FACULTY_PROFILE);
      return data ? JSON.parse(data) : DEMO_FACULTY;
    } catch {
      return DEMO_FACULTY;
    }
  },
  saveFacultyProfile: (p) => localStorage.setItem(STORAGE_KEYS.FACULTY_PROFILE, JSON.stringify(p)),

  // Academic Vault
  getVaultResources: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VAULT_RESOURCES);
      return data ? JSON.parse(data) : DEFAULT_VAULT_RESOURCES;
    } catch {
      return DEFAULT_VAULT_RESOURCES;
    }
  },
  saveVaultResources: (res) => localStorage.setItem(STORAGE_KEYS.VAULT_RESOURCES, JSON.stringify(res)),

  getBookmarks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : ['res-101', 'res-601'];
    } catch {
      return ['res-101', 'res-601'];
    }
  },
  saveBookmarks: (b) => localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(b)),

  // Community Forum
  getCommunityPosts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
      return data ? JSON.parse(data) : DEFAULT_COMMUNITY_POSTS;
    } catch {
      return DEFAULT_COMMUNITY_POSTS;
    }
  },
  saveCommunityPosts: (posts) => localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts)),

  // Leaves
  getLeaves: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return data ? JSON.parse(data) : DEFAULT_LEAVES;
    } catch {
      return DEFAULT_LEAVES;
    }
  },
  saveLeaves: (leaves) => localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves)),

  // Roster
  getRoster: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROSTER);
      return data ? JSON.parse(data) : DEFAULT_STUDENT_ROSTER;
    } catch {
      return DEFAULT_STUDENT_ROSTER;
    }
  },
  saveRoster: (r) => localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(r)),

  // Classes & Attendance
  getClasses: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return data ? JSON.parse(data) : [
        { _id: 'seed-1', title: 'Full Stack Web Development', code: 'CSE-601', time: '09:00 AM', room: 'LH-204', day: 'Mon', instructor: 'Er. Rahul Verma', tone: 'indigo' },
        { _id: 'seed-2', title: 'Big Data Analytics', code: 'CSE-602', time: '10:15 AM', room: 'Lab 2', day: 'Mon', instructor: 'Prof. Ananya', tone: 'amber' },
        { _id: 'seed-3', title: 'Mobile App Development', code: 'CSE-603', time: '01:00 PM', room: 'LH-102', day: 'Mon', instructor: 'Dr. V. Rao', tone: 'emerald' },
        { _id: 'seed-4', title: 'Information Security', code: 'CSE-604', time: '09:00 AM', room: 'LH-101', day: 'Tue', instructor: 'Dr. K. Iyer', tone: 'rose' },
        { _id: 'seed-5', title: 'Minor Capstone Project', code: 'CSE-612', time: '11:00 AM', room: 'Project Lab', day: 'Wed', instructor: 'Dr. Sharma', tone: 'cyan' },
      ];
    } catch {
      return [];
    }
  },
  saveClasses: (c) => localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(c)),

  getAttendance: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [
        { id: 'att-1', subject: 'Full Stack Web Development', code: 'CSE-601', attended: 28, total: 32, instructor: 'Er. Rahul Verma', color: '#6366f1' },
        { id: 'att-2', subject: 'Big Data Analytics', code: 'CSE-602', attended: 22, total: 30, instructor: 'Prof. Ananya', color: '#f59e0b' },
        { id: 'att-3', subject: 'Mobile App Development', code: 'CSE-603', attended: 27, total: 30, instructor: 'Dr. V. Rao', color: '#10b981' },
        { id: 'att-4', subject: 'Information Security', code: 'CSE-604', attended: 19, total: 28, instructor: 'Dr. K. Iyer', color: '#f43f5e' },
        { id: 'att-5', subject: 'Minor Capstone Project', code: 'CSE-612', attended: 14, total: 15, instructor: 'Dr. Sharma', color: '#06b6d4' },
      ];
    } catch {
      return [];
    }
  },
  saveAttendance: (a) => localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(a)),

  getAssignments: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : [
        { id: 'asg-1', title: 'MERN Stack CampusHub Project Submission', subject: 'CSE-601', dueDate: '2026-09-08', priority: 'High', status: 'in-progress', notes: 'Implement RBAC and Academic Vault.' },
        { id: 'asg-2', title: 'Hadoop MapReduce Big Data Analysis', subject: 'CSE-602', dueDate: '2026-09-12', priority: 'Medium', status: 'pending', notes: 'Run word count and inverted index on cluster.' },
        { id: 'asg-3', title: 'Flutter Mobile Attendance App Prototype', subject: 'CSE-603', dueDate: '2026-09-15', priority: 'High', status: 'pending', notes: 'Design UI screens and state management.' },
      ];
    } catch {
      return [];
    }
  },
  saveAssignments: (a) => localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(a)),

  getNotes: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [
        {
          id: 'note-1',
          title: 'MERN Stack Authentication & Token Architecture',
          category: 'Web Dev',
          tags: ['React', 'Node', 'Security'],
          pinned: true,
          updatedAt: '2026-08-28',
          content: `### JWT Token Architecture
1. **Access Token**: Short-lived (15 min) in memory or authorization header.
2. **Refresh Token**: Long-lived (7 days) in httpOnly cookie.
3. **RBAC**: Middleware validates \`req.user.role === 'faculty'\` before executing admin mutations.`,
        },
      ];
    } catch {
      return [];
    }
  },
  saveNotes: (n) => localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(n)),

  getCgpaData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CGPA);
      return data ? JSON.parse(data) : { target: 8.5, semesters: [] };
    } catch {
      return { target: 8.5, semesters: [] };
    }
  },
  saveCgpaData: (c) => localStorage.setItem(STORAGE_KEYS.CGPA, JSON.stringify(c)),

  getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
  setTheme: (t) => localStorage.setItem(STORAGE_KEYS.THEME, t),
};
