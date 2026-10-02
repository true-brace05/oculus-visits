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

export async function recordDaily(
  db: D1Database,
  id: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO daily (id, date, count)
       VALUES (?1, date('now'), 1)
       ON CONFLICT(id, date) DO UPDATE SET count = daily.count + 1`,
    )
    .bind(id)
    .run();
}

export async function getLast7Days(
  db: D1Database,
  id: string,
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(count), 0) AS total FROM daily
       WHERE id = ?1 AND date >= date('now', '-6 days')`,
    )
    .bind(id)
    .first<{ total: number }>();
  return row?.total ?? 0;
}
