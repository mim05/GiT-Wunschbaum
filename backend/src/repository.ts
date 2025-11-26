import Database from 'better-sqlite3';
import { Wish, WishStatus } from './types.js';
import { ensureSchema } from './setup.js';

export class WishRepository {
  private db: Database.Database;

  constructor(databaseUrl: string) {
    this.db = new Database(databaseUrl);
    ensureSchema(this.db);
  }

  list(): Wish[] {
    return this.db.prepare('SELECT * FROM wishes ORDER BY id ASC').all() as Wish[];
  }

  get(id: number): Wish | undefined {
    return this.db.prepare('SELECT * FROM wishes WHERE id = ?').get(id) as Wish | undefined;
  }

  reserve(id: number, name: string, email?: string | null): Wish {
    const wish = this.get(id);
    if (!wish) throw new Error('not-found');
    if (wish.status !== 'free') throw new Error('invalid-state');

    const now = new Date().toISOString();
    this.db.prepare(
      `UPDATE wishes SET status = 'reserved', reservedAt = ?, reservedBy = ?, reservedEmail = ? WHERE id = ?`
    ).run(now, name, email ?? null, id);
    return this.get(id)!;
  }

  fulfill(id: number): Wish {
    const wish = this.get(id);
    if (!wish) throw new Error('not-found');
    if (wish.status !== 'reserved') throw new Error('invalid-state');

    const now = new Date().toISOString();
    this.db.prepare(`UPDATE wishes SET status = 'fulfilled', fulfilledAt = ? WHERE id = ?`).run(now, id);
    return this.get(id)!;
  }

  reset(id: number): Wish {
    const wish = this.get(id);
    if (!wish) throw new Error('not-found');

    this.db
      .prepare(
        `UPDATE wishes SET status = 'free', reservedAt = NULL, reservedBy = NULL, reservedEmail = NULL, fulfilledAt = NULL WHERE id = ?`
      )
      .run(id);
    return this.get(id)!;
  }

  close() {
    this.db.close();
  }
}
