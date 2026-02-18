import 'dotenv/config';
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

// Google Apps Script webhook URL
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

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

// Google Apps Script webhook integration
async function appendToGoogleSheet(email, timestamp) {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    console.warn('Google Apps Script URL not configured - skipping sheet append');
    return;
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apps Script responded with ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Unknown error from Apps Script');
    }

    console.log(`Added ${email} to Google Sheet via Apps Script`);
  } catch (error) {
    console.error('Error writing to Google Sheet:', error.message);
    throw error;
  }
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
    const entry = await appendWaitlist(trimmed);
    
    // Also append to Google Sheets if configured
    try {
      await appendToGoogleSheet(entry.email, entry.subscribedAt);
    } catch (sheetError) {
      // Log error but don't fail the request - local backup exists
      console.error('Failed to write to Google Sheet:', sheetError.message);
    }
    
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
