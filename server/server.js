import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------------------
// Mongoose Schemas & Models
// -------------------------------------------------------------------------

// 1. Class Schema
const classSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  room: { type: String, default: '', trim: true },
  day: { type: String, default: 'Mon' },
  instructor: { type: String, default: '', trim: true },
  tone: { type: String, default: 'indigo' },
}, { timestamps: true });
const CollegeClass = mongoose.model('CollegeClass', classSchema);

// 2. Academic Vault Resource Schema (1st to 8th Semester)
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  resourceType: { type: String, enum: ['Note', 'Assignment', 'PYQ'], required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  subject: { type: String, required: true, trim: true },
  code: { type: String, default: '', trim: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' }, // Markdown notes / questions / solution text
  fileUrl: { type: String, default: '' },
  examYear: { type: String, default: '2025' }, // For PYQs
  solutionAvailable: { type: Boolean, default: true },
  uploadedBy: {
    name: { type: String, default: 'Faculty' },
    role: { type: String, default: 'faculty' },
    id: { type: String, default: 'FAC-01' },
  },
  downloadsCount: { type: Number, default: 0 },
}, { timestamps: true });
const Resource = mongoose.model('Resource', resourceSchema);

// 3. Community Post & Discussion Schema
const communityPostSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorId: { type: String, required: true },
  authorRole: { type: String, enum: ['student', 'faculty'], default: 'student' },
  authorDept: { type: String, default: 'CSE' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  semesterTag: { type: String, default: 'General' }, // 'General' | 'Sem 1' .. 'Sem 8'
  categoryTag: { type: String, default: 'Doubt' }, // 'Doubt' | 'Announcement' | 'Project' | 'ExamPrep'
  isAnnouncement: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  replies: [
    {
      authorName: { type: String, required: true },
      authorRole: { type: String, enum: ['student', 'faculty'], default: 'student' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

// 4. Leave Request Schema
const leaveRequestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentRoll: { type: String, required: true },
  semester: { type: String, default: '6th Semester' },
  hodName: { type: String, default: 'Dr. Sharma' },
  reason: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  facultyNotes: { type: String, default: '' },
  reviewedBy: { type: String, default: '' },
}, { timestamps: true });
const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

// 5. Faculty Attendance Roster Schema
const attendanceRosterSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subject: { type: String, required: true },
  subjectCode: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  facultyId: { type: String, default: 'FAC-01' },
  facultyName: { type: String, default: 'Dr. Sharma' },
  records: [
    {
      studentRoll: { type: String, required: true },
      studentName: { type: String, required: true },
      status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    },
  ],
}, { timestamps: true });
const AttendanceRoster = mongoose.model('AttendanceRoster', attendanceRosterSchema);

// -------------------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------------------

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1,
  });
});

// ==================== 1. Classes API ====================
app.get('/api/classes', async (_req, res, next) => {
  try {
    const classes = await CollegeClass.find().sort({ day: 1, time: 1 });
    res.json(classes);
  } catch (error) { next(error); }
});

app.post('/api/classes', async (req, res, next) => {
  try {
    const { title, code, time, room, day, instructor, tone } = req.body;
    if (!title || !code || !time) {
      return res.status(400).json({ error: 'Title, code, and time are required.' });
    }
    const created = await CollegeClass.create({
      title, code, time, room: room || 'TBD', day: day || 'Mon', instructor: instructor || '', tone: tone || 'indigo',
    });
    res.status(201).json(created);
  } catch (error) { next(error); }
});

app.delete('/api/classes/:id', async (req, res, next) => {
  try {
    await CollegeClass.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) { next(error); }
});

// ==================== 2. Academic Vault Resources API ====================
app.get('/api/resources', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.semester) filter.semester = Number(req.query.semester);
    if (req.query.type) filter.resourceType = req.query.type;
    if (req.query.subject) filter.subject = new RegExp(req.query.subject, 'i');

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) { next(error); }
});

app.post('/api/resources', async (req, res, next) => {
  try {
    const { title, resourceType, semester, subject, code, description, content, fileUrl, examYear } = req.body;
    if (!title || !resourceType || !semester || !subject) {
      return res.status(400).json({ error: 'Title, resourceType, semester, and subject are required.' });
    }
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) { next(error); }
});

app.delete('/api/resources/:id', async (req, res, next) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) { next(error); }
});

// ==================== 3. Campus Community Discussion Forum API ====================
app.get('/api/community/posts', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.semester && req.query.semester !== 'All') {
      filter.semesterTag = req.query.semester;
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.categoryTag = req.query.category;
    }
    const posts = await CommunityPost.find(filter).sort({ isPinned: -1, createdAt: -1 });
    res.json(posts);
  } catch (error) { next(error); }
});

app.post('/api/community/posts', async (req, res, next) => {
  try {
    const { authorName, authorId, authorRole, title, content, semesterTag, categoryTag, isAnnouncement } = req.body;
    if (!authorName || !title || !content) {
      return res.status(400).json({ error: 'Author, title, and content are required.' });
    }
    const post = await CommunityPost.create({
      ...req.body,
      isAnnouncement: Boolean(isAnnouncement || authorRole === 'faculty'),
    });
    res.status(201).json(post);
  } catch (error) { next(error); }
});

app.post('/api/community/posts/:id/like', async (req, res, next) => {
  try {
    const { userId } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    const alreadyLiked = post.likedBy?.includes(userId);
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== userId);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likedBy.push(userId);
      post.likesCount += 1;
    }
    await post.save();
    res.json(post);
  } catch (error) { next(error); }
});

app.post('/api/community/posts/:id/reply', async (req, res, next) => {
  try {
    const { authorName, authorRole, text } = req.body;
    if (!text || !authorName) {
      return res.status(400).json({ error: 'Reply text and author name are required.' });
    }
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    post.replies.push({
      authorName,
      authorRole: authorRole || 'student',
      text,
      createdAt: new Date(),
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) { next(error); }
});

// ==================== 4. Leave Management API ====================
app.get('/api/leaves', async (_req, res, next) => {
  try {
    const leaves = await LeaveRequest.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) { next(error); }
});

app.post('/api/leaves', async (req, res, next) => {
  try {
    const { studentName, studentRoll, reason, startDate, endDate } = req.body;
    if (!studentName || !studentRoll || !reason || !startDate || !endDate) {
      return res.status(400).json({ error: 'All leave fields are required.' });
    }
    const leave = await LeaveRequest.create(req.body);
    res.status(201).json(leave);
  } catch (error) { next(error); }
});

app.put('/api/leaves/:id', async (req, res, next) => {
  try {
    const { status, facultyNotes, reviewedBy } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, facultyNotes, reviewedBy },
      { new: true }
    );
    res.json(leave);
  } catch (error) { next(error); }
});

// ==================== 5. Faculty Attendance Roster API ====================
app.get('/api/faculty/attendance', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.semester) filter.semester = Number(req.query.semester);
    if (req.query.subjectCode) filter.subjectCode = req.query.subjectCode;
    const records = await AttendanceRoster.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (error) { next(error); }
});

app.post('/api/faculty/attendance', async (req, res, next) => {
  try {
    const { semester, subject, subjectCode, records, date, facultyId, facultyName } = req.body;
    if (!semester || !subject || !records) {
      return res.status(400).json({ error: 'Semester, subject, and records are required.' });
    }
    const roster = await AttendanceRoster.create({
      semester: Number(semester),
      subject,
      subjectCode: subjectCode || 'CSE-101',
      date: date || new Date().toISOString().split('T')[0],
      facultyId: facultyId || 'FAC-01',
      facultyName: facultyName || 'Dr. Sharma',
      records,
    });
    res.status(201).json(roster);
  } catch (error) { next(error); }
});

// ==================== 6. AI Assistant Endpoint ====================
app.post('/api/assistant', async (req, res, next) => {
  try {
    const message = req.body?.message?.trim();
    if (!message) return res.status(400).json({ error: 'Please enter a question.' });
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'OpenAI API key is not configured in server .env file.',
        hint: 'Built-in offline CS assistant will handle this query automatically.',
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an intelligent, empathetic College Study & Survival Assistant. Provide structured markdown answers with bullet points, short code examples, and clear definitions. Help students with academic doubts, revision summaries, and formal letters.',
        },
        { role: 'user', content: message },
      ],
    });

    const answer = result.choices?.[0]?.message?.content || 'Could not generate an answer.';
    res.json({ answer });
  } catch (error) { next(error); }
});

// Error handling
app.use((error, _req, res, _next) => {
  console.error('[API Error]:', error);
  res.status(500).json({ error: error.message || 'Server error occurred.' });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } catch (err) {
      console.warn('⚠️ MongoDB could not connect:', err.message);
    }
  } else {
    console.warn('⚠️ MONGODB_URI not set. Running in resilient mock/offline mode.');
  }
  app.listen(port, () => {
    console.log(`🚀 Smart College API running on http://localhost:${port}`);
  });
}

start();
