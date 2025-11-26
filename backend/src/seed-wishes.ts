import Database from 'better-sqlite3';
import { ensureSchema } from './setup.js';

const DATABASE_URL = process.env.DATABASE_URL || 'file:./data/wishes.db';
const db = new Database(DATABASE_URL);

const defaultWishes = [
  'Lichterkinder Weihnachten',
  'Winnie Pooh',
  'Milo das Müllauto',
  'Der kleine Elefant, der so gerne einschlafen möchte',
  'Weihnachtsgeschichten für Kinder',
  'Holzeisenbahn Starterset',
  'Bunte Malstifte-Box'
];

ensureSchema(db);

const count = db.prepare('SELECT COUNT(*) as count FROM wishes').get().count as number;
if (count === 0) {
  const insert = db.prepare(`INSERT INTO wishes (title, status) VALUES (?, 'free')`);
  const insertMany = db.transaction((wishes: string[]) => {
    wishes.forEach((title) => insert.run(title));
  });
  insertMany(defaultWishes);
  console.log(`Seeded ${defaultWishes.length} wishes.`);
} else {
  console.log(`Wishes already seeded (${count}).`);
}

db.close();
