import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export function ensureSchema(db: Database.Database) {
  const schemaPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(sql);
}
