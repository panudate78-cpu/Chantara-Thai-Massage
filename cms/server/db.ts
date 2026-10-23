import type { Pool, PoolClient } from "pg";

export type QueryResult<T> = { rows: T[]; rowCount: number };

export interface Queryable {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
}

export interface Db extends Queryable {
  transaction<T>(fn: (tx: Queryable) => Promise<T>): Promise<T>;
}

/** Wraps a node-postgres client/pool in the small interface the CMS uses. */
export function pgQueryable(client: Pool | PoolClient): Queryable {
  return {
    async query<T>(text: string, params: unknown[] = []) {
      const result = await client.query(text, params);
      return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
    },
  };
}

export function createPgDb(pool: Pool): Db {
  return {
    ...pgQueryable(pool),
    async transaction<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const value = await fn(pgQueryable(client));
        await client.query("commit");
        return value;
      } catch (error) {
        try {
          await client.query("rollback");
        } catch {
          /* the transaction is already gone */
        }
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

/** Convenience for single-row lookups. */
export async function one<T>(db: Queryable, text: string, params?: unknown[]): Promise<T | null> {
  const result = await db.query<T>(text, params);
  return result.rows[0] ?? null;
}

export async function many<T>(
  db: Queryable,
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await db.query<T>(text, params);
  return result.rows;
}
