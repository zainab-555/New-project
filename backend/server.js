import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

const classSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  room: { type: String, default: '', trim: true },
  day: { type: String, default: 'Mon' },
}, { timestamps: true });
const CollegeClass = mongoose.model('CollegeClass', classSchema);

app.get('/api/health', (_request, response) => response.json({ ok: true, database: mongoose.connection.readyState === 1 }));

app.get('/api/classes', async (_request, response, next) => {
  try { response.json(await CollegeClass.find().sort({ time: 1 })); } catch (error) { next(error); }
});
app.post('/api/classes', async (request, response, next) => {
  try { response.status(201).json(await CollegeClass.create(request.body)); } catch (error) { next(error); }
});
app.delete('/api/classes/:id', async (request, response, next) => {
  try { await CollegeClass.findByIdAndDelete(request.params.id); response.status(204).send(); } catch (error) { next(error); }
});

app.post('/api/assistant', async (request, response, next) => {
  try {
    const message = request.body?.message?.trim();
    if (!message) return response.status(400).json({ error: 'Please enter a question.' });
    if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: 'OpenAI API key is not configured yet.' });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      input: [
        { role: 'developer', content: 'You are a helpful college study assistant. Give accurate, student-friendly answers. Use simple English or Hinglish when the student writes Hinglish. For exam questions, add a short example where useful. Keep answers concise unless asked for detail.' },
        { role: 'user', content: message },
      ],
    });
    response.json({ answer: result.output_text || 'Sorry, I could not generate an answer.' });
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : 500;
  response.status(status).json({ error: error.message || 'Something went wrong. Please try again.' });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI); console.log('MongoDB connected'); }
    catch (error) { console.error('MongoDB could not connect:', error.message); }
  } else console.warn('MONGODB_URI is missing. Class APIs need MongoDB.');
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}
start();
