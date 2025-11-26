import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'node:path';
import { WishRepository } from './repository.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'file:./data/wishes.db';
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const STATIC_FRONTEND_PATH = process.env.STATIC_FRONTEND_PATH;

const repo = new WishRepository(DATABASE_URL);

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
if (CORS_ORIGIN) {
  app.use(cors({ origin: CORS_ORIGIN }));
} else {
  app.use(cors());
}

app.get('/api/wishes', (_req, res) => {
  res.json(repo.list());
});

app.post('/api/wishes/:id/reserve', (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body ?? {};
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const wish = repo.reserve(id, name, email);
    res.json(wish);
  } catch (error) {
    if (error instanceof Error && error.message === 'not-found') return res.status(404).json({ message: 'Not found' });
    if (error instanceof Error && error.message === 'invalid-state') return res.status(400).json({ message: 'Wish not free' });
    console.error(error);
    res.status(500).json({ message: 'Unexpected error' });
  }
});

app.post('/api/wishes/:id/fulfill', (req, res) => {
  const id = Number(req.params.id);
  try {
    const wish = repo.fulfill(id);
    res.json(wish);
  } catch (error) {
    if (error instanceof Error && error.message === 'not-found') return res.status(404).json({ message: 'Not found' });
    if (error instanceof Error && error.message === 'invalid-state')
      return res.status(400).json({ message: 'Wish not reserved' });
    console.error(error);
    res.status(500).json({ message: 'Unexpected error' });
  }
});

app.post('/api/wishes/:id/reset', (req, res) => {
  const id = Number(req.params.id);
  try {
    const wish = repo.reset(id);
    res.json(wish);
  } catch (error) {
    if (error instanceof Error && error.message === 'not-found') return res.status(404).json({ message: 'Not found' });
    console.error(error);
    res.status(500).json({ message: 'Unexpected error' });
  }
});

if (STATIC_FRONTEND_PATH) {
  const absolute = path.resolve(STATIC_FRONTEND_PATH);
  app.use(express.static(absolute));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(absolute, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
