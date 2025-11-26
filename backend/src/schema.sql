CREATE TABLE IF NOT EXISTS wishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'free',
  reservedAt TEXT,
  reservedBy TEXT,
  reservedEmail TEXT,
  fulfilledAt TEXT
);
