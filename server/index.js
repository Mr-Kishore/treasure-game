import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDB, getDB } from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'treasure-hunt-secret-key-change-in-prod';

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());

initDB();

// ─── Auth Middleware ────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── Student Auth ───────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { username, name, age, password } = req.body;
  if (!username || !name || !age || !password)
    return res.status(400).json({ error: 'All fields are required' });

  if (age < 4 || age > 18)
    return res.status(400).json({ error: 'Age must be between 4 and 18' });

  const db = getDB();
  const existing = db.prepare('SELECT id FROM students WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'Username already taken' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = db
    .prepare('INSERT INTO students (username, name, age, password) VALUES (?, ?, ?, ?)')
    .run(username, name, parseInt(age), hashedPassword);

  const student = db.prepare('SELECT id, username, name, age FROM students WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ id: student.id, username: student.username }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, student });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  const db = getDB();
  const student = db.prepare('SELECT * FROM students WHERE username = ?').get(username);
  if (!student) return res.status(401).json({ error: 'Invalid username or password' });

  const valid = await bcrypt.compare(password, student.password);
  if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ id: student.id, username: student.username }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeStudent } = student;

  res.json({ token, student: safeStudent });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const db = getDB();
  const student = db.prepare('SELECT id, username, name, age FROM students WHERE id = ?').get(req.user.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ student });
});

// ─── Student Progress ───────────────────────────────────────────────────────
app.post('/api/progress', requireAuth, (req, res) => {
  const { level, score } = req.body;
  const db = getDB();

  const existing = db
    .prepare('SELECT id, score FROM student_progress WHERE student_id = ? AND level = ?')
    .get(req.user.id, level);

  if (existing) {
    if (score > existing.score) {
      db.prepare('UPDATE student_progress SET score = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(score, existing.id);
    }
  } else {
    db.prepare('INSERT INTO student_progress (student_id, level, score) VALUES (?, ?, ?)')
      .run(req.user.id, level, score);
  }

  res.json({ success: true });
});

app.get('/api/progress', requireAuth, (req, res) => {
  const db = getDB();
  const progress = db
    .prepare('SELECT level, score, completed_at FROM student_progress WHERE student_id = ? ORDER BY level')
    .all(req.user.id);
  res.json({ progress });
});

// ─── Question Sets ──────────────────────────────────────────────────────────
app.get('/api/question-sets', (req, res) => {
  const db = getDB();
  const sets = db.prepare('SELECT * FROM question_sets ORDER BY created_at DESC').all();
  const result = sets.map((set) => ({
    ...set,
    questions: db.prepare('SELECT * FROM questions WHERE set_id = ? ORDER BY rowid').all(set.id).map((q) => ({
      id: q.id,
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4],
      correctIndex: q.correct_index,
      hint: q.hint || '',
    })),
  }));
  res.json({ sets: result });
});

app.post('/api/question-sets', (req, res) => {
  const { id, name, questions, createdAt } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'id and name are required' });

  const db = getDB();

  db.prepare('INSERT OR REPLACE INTO question_sets (id, name, created_at) VALUES (?, ?, ?)').run(id, name, createdAt || Date.now());
  db.prepare('DELETE FROM questions WHERE set_id = ?').run(id);

  const insertQ = db.prepare(
    'INSERT INTO questions (id, set_id, question, option1, option2, option3, option4, correct_index, hint) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (const q of questions || []) {
    insertQ.run(q.id, id, q.question, q.options[0], q.options[1], q.options[2], q.options[3], q.correctIndex, q.hint || '');
  }

  res.json({ success: true });
});

app.delete('/api/question-sets/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM question_sets WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/question-sets/:id', (req, res) => {
  const db = getDB();
  const set = db.prepare('SELECT * FROM question_sets WHERE id = ?').get(req.params.id);
  if (!set) return res.status(404).json({ error: 'Set not found' });

  const questions = db.prepare('SELECT * FROM questions WHERE set_id = ? ORDER BY rowid').all(set.id).map((q) => ({
    id: q.id,
    question: q.question,
    options: [q.option1, q.option2, q.option3, q.option4],
    correctIndex: q.correct_index,
    hint: q.hint || '',
  }));

  res.json({ ...set, questions });
});

// ─── Students list (teacher view) ──────────────────────────────────────────
app.get('/api/students', (req, res) => {
  const db = getDB();
  const students = db.prepare('SELECT id, username, name, age, created_at FROM students ORDER BY created_at DESC').all();
  const result = students.map((s) => ({
    ...s,
    levelsCompleted: db.prepare('SELECT COUNT(*) as count FROM student_progress WHERE student_id = ?').get(s.id).count,
  }));
  res.json({ students: result });
});

// ─── Root Route ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Treasure Hunt API is running!', endpoints: ['/api/auth/register', '/api/auth/login', '/api/game/*'] });
});

app.listen(PORT, () => {
  console.log(`🚀 Treasure Hunt API running on http://localhost:${PORT}`);
});
