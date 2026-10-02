import type { Storage } from "./types.ts";

export class D1Storage implements Storage {
  constructor(private db: D1Database) {}

  async incr(id: string): Promise<number> {
    const row = await this.db
      .prepare(
        `INSERT INTO counters (id, count, updated_at)
         VALUES (?1, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
         ON CONFLICT(id) DO UPDATE SET
           count = counters.count + 1,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
         RETURNING count`,
      )
      .bind(id)
      .first<{ count: number }>();
    return row?.count ?? 0;
  }

  async get(id: string): Promise<number> {
    const row = await this.db
      .prepare(`SELECT count FROM counters WHERE id = ?1`)
      .bind(id)
      .first<{ count: number }>();
    return row?.count ?? 0;
  }
}
