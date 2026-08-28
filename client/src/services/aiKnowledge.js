// Built-in Academic & CS Knowledge Base for Smart College Survival Assistant

export const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['dbms', 'database', 'sql', 'normalization', 'acid', 'keys'],
    response: `### 🗄️ Database Management Systems (DBMS) Overview

**Definition**: DBMS is software that enables users to create, maintain, and control access to structured databases.

#### Key Highlights:
1. **ACID Properties**:
   - **Atomicity**: All or nothing transaction execution.
   - **Consistency**: Database transitions from one valid state to another.
   - **Isolation**: Concurrent transactions do not affect each other.
   - **Durability**: Committed data survives crashes and power loss.

2. **Normalization Levels**:
   - **1NF**: Atomic values only, no repeating groups.
   - **2NF**: 1NF + No partial dependencies (every non-key attribute fully depends on Primary Key).
   - **3NF**: 2NF + No transitive dependencies ($A \\to B$ and $B \\to C$).
   - **BCNF**: Strict 3NF where every determinant is a candidate key.

3. **Keys**: Primary Key, Candidate Key, Foreign Key, Composite Key, Super Key.`,
  },
  {
    keywords: ['oops', 'oop', 'object oriented', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction'],
    response: `### 🧱 Object-Oriented Programming (OOP) Pillars

OOP models software design around data/objects rather than functions and logic.

#### The 4 Core Pillars:
1. **Encapsulation**: Bundling data (variables) and methods (functions) inside a single unit (class), restricting direct access via access modifiers (\`private\`, \`protected\`, \`public\`).
2. **Abstraction**: Hiding internal implementation details and exposing only essential interfaces (using Abstract Classes & Interfaces).
3. **Inheritance**: Mechanism where a child class acquires attributes and behaviors of a parent class (Single, Multilevel, Multiple via interfaces, Hierarchical, Hybrid).
4. **Polymorphism**: Ability to take many forms:
   - **Compile-time**: Method Overloading & Operator Overloading.
   - **Runtime**: Method Overriding (virtual functions / \`@Override\`).`,
  },
  {
    keywords: ['dsa', 'data structures', 'algorithms', 'trees', 'graphs', 'time complexity', 'big o'],
    response: `### ⚡ Data Structures & Algorithms (DSA) Quick Guide

#### Time Complexity Hierarchy (Fastest to Slowest):
$O(1) < O(\\log N) < O(N) < O(N \\log N) < O(N^2) < O(2^N) < O(N!)$

#### Essential Structures:
- **Array / String**: $O(1)$ access, $O(N)$ insertion/deletion.
- **Linked List**: Dynamic size, $O(1)$ head/tail ops, $O(N)$ lookup.
- **Stack (LIFO)**: Function calls, Undo ops, Expression evaluation (Infix to Postfix).
- **Queue (FIFO)**: BFS, Task scheduling, Producer-Consumer buffer.
- **Binary Search Tree (BST)**: Average $O(\\log N)$ search/insert.
- **Heap / Priority Queue**: Top K elements, Dijkstra algorithm ($O(E \\log V)$).
- **Graph**: BFS ($O(V+E)$), DFS ($O(V+E)$), Topological Sort, Disjoint Set Union (DSU).`,
  },
  {
    keywords: ['os', 'operating system', 'deadlock', 'scheduling', 'paging', 'virtual memory', 'semaphore'],
    response: `### 💻 Operating Systems (OS) Core Summary

**OS** acts as an intermediary between the computer hardware and the user applications.

#### Essential Exam Topics:
1. **Process Scheduling**:
   - FCFS, Shortest Job First (SJF/SRTF), Round Robin (RR), Priority Scheduling.
2. **Deadlock (4 Coffman Conditions)**:
   - Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
   - Handled via: Prevention, Avoidance (Banker's Algorithm), Detection & Recovery.
3. **Memory Management**:
   - **Paging**: Non-contiguous allocation, translates logical address to physical address via Page Table.
   - **Virtual Memory**: Demand paging, Page replacement policies (FIFO, LRU, Optimal).
4. **Synchronization**:
   - Mutex vs Semaphore (Counting vs Binary), Producer-Consumer problem, Dining Philosophers.`,
  },
  {
    keywords: ['network', 'computer networks', 'cn', 'osi', 'tcp', 'ip', 'udp', 'http', 'dns'],
    response: `### 🌐 Computer Networks (CN) Essentials

#### 7 Layers of OSI Model (Top to Bottom):
1. **Application Layer**: HTTP, HTTPS, FTP, SMTP, DNS, SSH.
2. **Presentation Layer**: Encryption (TLS/SSL), Compression, Serialization.
3. **Session Layer**: RPC, Session management, Sockets.
4. **Transport Layer**: End-to-end delivery:
   - **TCP**: Connection-oriented, reliable 3-way handshake (SYN $\\to$ SYN-ACK $\\to$ ACK), flow & congestion control.
   - **UDP**: Connectionless, fast, best-effort (streaming, gaming).
5. **Network Layer**: IP addressing (IPv4/IPv6), Routing (OSPF, BGP, RIP).
6. **Data Link Layer**: MAC addressing, framing, CSMA/CD, switches.
7. **Physical Layer**: Bits, cables, hubs, modulation.`,
  },
  {
    keywords: ['web', 'react', 'javascript', 'frontend', 'html', 'css', 'node'],
    response: `### 🚀 Full Stack Web Development

#### React Fundamentals:
- **Component Architecture**: Functional components with hooks (\`useState\`, \`useEffect\`, \`useMemo\`, \`useCallback\`, \`useRef\`).
- **Virtual DOM**: Reconciliation algorithm calculates diffs and updates only changed nodes.
- **State Management**: Context API, Redux Toolkit, Zustand.

#### Modern Web Best Practices:
- Responsive CSS (Flexbox, CSS Grid, Media Queries, CSS Variables).
- REST APIs & GraphQL (Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).
- Performance: Lazy loading, code splitting, memoization, CDN caching.`,
  },
  {
    keywords: ['leave', 'letter', 'application', 'absent', 'sick', 'email', 'permission'],
    response: `### ✉️ Formal College Leave Application Template

**Subject**: Application for Leave of Absence - [Your Name] (Roll No: [Your Roll No])

Respected [Professor's / HOD's Name],

I am writing to formally request a leave of absence from [Start Date] to [End Date] due to [Reason, e.g., severe illness / unavoidable family emergency / medical appointment].

I assure you that I will review the lecture notes and catch up on all assigned coursework and lab submissions promptly upon my return.

Kindly grant me permission and mark my attendance accordingly.

Thank you for your understanding.

Yours sincerely,  
**[Your Name]**  
Roll No: [Your Roll No]  
Branch & Semester: [Your Branch, e.g., CSE 6th Sem]  
Contact No: [Your Phone]`,
  },
  {
    keywords: ['exam', 'important questions', 'viva', 'interview', 'quiz', 'test'],
    response: `### 🎯 Top College Exam & Viva Questions

#### Most Frequent Computer Science Questions:
1. **DBMS**: Explain 3NF vs BCNF with a functional dependency example.
2. **OS**: What is the difference between Mutex and Semaphore? How does Banker's Algorithm work?
3. **DSA**: How does Quicksort partitioning work? Compare Time Complexity of MergeSort vs QuickSort.
4. **OOP**: Explain Runtime Polymorphism using virtual tables (vptr & vtable).
5. **Networks**: Explain the TCP 3-Way Handshake and compare TCP vs UDP with packet structures.
6. **Web Dev**: What is the Event Loop in JavaScript and how do Microtasks vs Macrotasks work?`,
  },
];

/**
 * Find smart offline answer from academic knowledge base
 */
export function getOfflineAiAnswer(query) {
  const clean = query.toLowerCase();

  for (const item of AI_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => clean.includes(kw))) {
      return item.response;
    }
  }

  // Generic helpful student guidance
  return `### 💡 Study Assistant Guidance

I understand you are asking about: **"${query}"**

#### Quick Study Tips for this topic:
- **Concept Breakdown**: Start by breaking the topic into core definitions, working mechanisms, and real-world examples.
- **Draw Diagrams**: For CS & Engineering subjects, drawing architecture or memory flowcharts helps earn high marks in exams.
- **Practice Problems**: Write out standard code or numerical problems by hand.

*(Note: Connect an OpenAI API key in your backend \`.env\` file for live custom AI answers, or ask me about DBMS, DSA, OOPs, OS, Networks, Web Dev, Leave Applications, and Viva questions!)*`;
}

/**
 * Generate Flashcards from text
 */
export function generateFlashcards(subject) {
  const cards = [
    { q: `What is the primary function of ${subject}?`, a: 'To abstract low-level complexities and provide high-efficiency modular operations.' },
    { q: 'What is the standard time complexity for search/access?', a: 'O(log N) in balanced trees, O(1) in Hash Maps, and O(N) in unindexed scans.' },
    { q: 'State the most common real-world use case.', a: 'Enterprise web systems, microservices communication, and high-concurrency databases.' },
  ];
  return cards;
}
