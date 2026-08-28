// Full 1st to 8th Semester Computer Science & Engineering Academic Curriculum

export const SEMESTER_CURRICULUM = {
  1: {
    semester: 1,
    title: '1st Semester (Foundation)',
    subjects: [
      { code: 'CSE-101', name: 'Programming for Problem Solving (C)', instructor: 'Ajaz Hussain Warsi', credits: 4 },
      { code: 'PHY-101', name: 'Engineering Physics', instructor: 'Dr. Manisha Sen', credits: 4 },
      { code: 'MAT-101', name: 'Engineering Mathematics I (Calculus & Matrices)', instructor: 'Prof. S. N. Roy', credits: 4 },
      { code: 'EEE-101', name: 'Basic Electrical & Electronics Engineering', instructor: 'Er. A. K. Verma', credits: 3 },
      { code: 'ENG-101', name: 'Technical English & Professional Communication', instructor: 'Dr. P. Das', credits: 2 },
      { code: 'CSE-111', name: 'C Programming Lab', instructor: 'Ajaz Hussain Warsi', credits: 2 },
    ],
  },
  2: {
    semester: 2,
    title: '2nd Semester (Core Computing)',
    subjects: [
      { code: 'CSE-201', name: 'Data Structures & Algorithms', instructor: 'Ajaz Hussain Warsi', credits: 4 },
      { code: 'CSE-202', name: 'Object-Oriented Programming with C++', instructor: 'Prof. Ananya', credits: 4 },
      { code: 'MAT-201', name: 'Engineering Mathematics II (Differential Equations & Vector)', instructor: 'Prof. S. N. Roy', credits: 4 },
      { code: 'ECE-201', name: 'Digital Logic & Circuit Design', instructor: 'Dr. V. Rao', credits: 4 },
      { code: 'ENV-201', name: 'Environmental Science & Sustainability', instructor: 'Dr. Sunita Gupta', credits: 2 },
      { code: 'CSE-211', name: 'Data Structures Lab', instructor: 'Ajaz Hussain Warsi', credits: 2 },
    ],
  },
  3: {
    semester: 3,
    title: '3rd Semester (Systems & Theory)',
    subjects: [
      { code: 'CSE-301', name: 'Database Management Systems (DBMS)', instructor: 'Prof. Ananya', credits: 4 },
      { code: 'CSE-302', name: 'Computer Organization & Architecture (COA)', instructor: 'Dr. K. Iyer', credits: 4 },
      { code: 'CSE-303', name: 'Discrete Mathematics & Graph Theory', instructor: 'Dr. Mathur', credits: 4 },
      { code: 'CSE-304', name: 'Design & Analysis of Algorithms (DAA)', instructor: 'Ajaz Hussain Warsi', credits: 4 },
      { code: 'CSE-311', name: 'DBMS & SQL Lab', instructor: 'Prof. Ananya', credits: 2 },
      { code: 'CSE-312', name: 'Algorithms Simulation Lab', instructor: 'Ajaz Hussain Warsi', credits: 2 },
    ],
  },
  4: {
    semester: 4,
    title: '4th Semester (Systems Software & Networks)',
    subjects: [
      { code: 'CSE-401', name: 'Operating Systems (OS)', instructor: 'Dr. V. Rao', credits: 4 },
      { code: 'CSE-402', name: 'Computer Networks (CN)', instructor: 'Prof. Sneha Gupta', credits: 4 },
      { code: 'CSE-403', name: 'Theory of Computation (Automata & Formal Languages)', instructor: 'Dr. Mathur', credits: 4 },
      { code: 'CSE-404', name: 'Software Engineering & Agile Methodologies', instructor: 'Prof. K. Iyer', credits: 3 },
      { code: 'CSE-411', name: 'OS & Linux Shell Scripting Lab', instructor: 'Dr. V. Rao', credits: 2 },
      { code: 'CSE-412', name: 'Computer Networks & Sockets Lab', instructor: 'Prof. Sneha Gupta', credits: 2 },
    ],
  },
  5: {
    semester: 5,
    title: '5th Semester (AI, Cloud & Security)',
    subjects: [
      { code: 'CSE-501', name: 'Artificial Intelligence & Machine Learning', instructor: 'Dr. P. Sen', credits: 4 },
      { code: 'CSE-502', name: 'Compiler Design & Code Generation', instructor: 'Dr. Mathur', credits: 4 },
      { code: 'CSE-503', name: 'Cloud Computing & Distributed Systems', instructor: 'Er. Rahul Verma', credits: 3 },
      { code: 'CSE-504', name: 'Cyber Security & Cryptography', instructor: 'Prof. Sneha Gupta', credits: 3 },
      { code: 'CSE-511', name: 'Machine Learning & Python Lab', instructor: 'Dr. P. Sen', credits: 2 },
      { code: 'CSE-512', name: 'Cloud Architecture & DevOps Lab', instructor: 'Er. Rahul Verma', credits: 2 },
    ],
  },
  6: {
    semester: 6,
    title: '6th Semester (Modern Web & Enterprise)',
    subjects: [
      { code: 'CSE-601', name: 'Full Stack Web Development (MERN Stack)', instructor: 'Er. Rahul Verma', credits: 4 },
      { code: 'CSE-602', name: 'Big Data Analytics & Hadoop/Spark', instructor: 'Prof. Ananya', credits: 4 },
      { code: 'CSE-603', name: 'Mobile Application Development (Flutter/React Native)', instructor: 'Dr. V. Rao', credits: 3 },
      { code: 'CSE-604', name: 'Information Security & Ethical Hacking', instructor: 'Dr. K. Iyer', credits: 3 },
      { code: 'CSE-611', name: 'Full Stack Project Lab', instructor: 'Er. Rahul Verma', credits: 2 },
      { code: 'CSE-612', name: 'Minor Capstone Project', instructor: 'Ajaz Hussain Warsi', credits: 3 },
    ],
  },
  7: {
    semester: 7,
    title: '7th Semester (Advanced Specializations)',
    subjects: [
      { code: 'CSE-701', name: 'Deep Learning & Neural Networks', instructor: 'Dr. P. Sen', credits: 4 },
      { code: 'CSE-702', name: 'Internet of Things (IoT) & Embedded Systems', instructor: 'Dr. V. Rao', credits: 3 },
      { code: 'CSE-703', name: 'Natural Language Processing & LLMs', instructor: 'Dr. P. Sen', credits: 3 },
      { code: 'CSE-704', name: 'Blockchain Technologies & Smart Contracts', instructor: 'Prof. K. Iyer', credits: 3 },
      { code: 'CSE-711', name: 'Major Project Phase I', instructor: 'Department Committee', credits: 4 },
    ],
  },
  8: {
    semester: 8,
    title: '8th Semester (Industry Capstone & Internship)',
    subjects: [
      { code: 'CSE-801', name: 'High Performance Computing (HPC) & GPU Architecture', instructor: 'Dr. Mathur', credits: 3 },
      { code: 'CSE-802', name: 'Quantum Computing Fundamentals', instructor: 'Dr. P. Sen', credits: 3 },
      { code: 'CSE-811', name: 'Major Capstone Project Phase II / Industry Internship', instructor: 'Faculty & Industry Mentor', credits: 12 },
    ],
  },
};

export const getSubjectsForSemester = (sem) => {
  return SEMESTER_CURRICULUM[sem]?.subjects || [];
};
