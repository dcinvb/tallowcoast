import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDist = join(__dirname, '..', 'client', 'dist');
const DATA_DIR = process.env.DATA_DIR || join(__dirname, 'data');
const DATA_FILE = process.env.DATA_FILE || join(DATA_DIR, 'waitlist.json');
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many signup attempts. Please try again later.' },
});
app.use('/api/waitlist', waitlistLimiter);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readWaitlist() {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function appendWaitlist(email) {
  await ensureDataDir();
  const list = await readWaitlist();
  const entry = { email: email.trim().toLowerCase(), subscribedAt: new Date().toISOString() };
  list.push(entry);
  await writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return entry;
}

app.post('/api/waitlist', async (req, res) => {
  const email = req.body?.email;
  if (email === undefined || email === null) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }
  const trimmed = String(email).trim();
  if (!trimmed) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }
  try {
    await appendWaitlist(trimmed);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Waitlist write error:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
  }
});

// In production, serve built client for single-server deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Tallow Coast API listening on http://localhost:${PORT}`);
});
