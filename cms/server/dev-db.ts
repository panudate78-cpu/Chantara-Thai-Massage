/**
 * Local development database.
 *
 * Uses PGlite (PostgreSQL compiled to WebAssembly) so the admin panel runs
 * end-to-end without Docker or a hosted database. Production uses Netlify
 * Database with the very same SQL through the same Db interface.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import type { Db, Queryable } from "./db";

const MIGRATIONS_DIR = path.join(process.cwd(), "netlify", "database", "migrations");

type PgliteLike = {
  query: <T>(text: string, params?: unknown[]) => Promise<{ rows: T[]; affectedRows?: number }>;
  exec: (sql: string) => Promise<unknown>;
  transaction: <T>(fn: (tx: PgliteLike) => Promise<T>) => Promise<T>;
};

function adapter(client: PgliteLike): Queryable {
  return {
    async query<T>(text: string, params: unknown[] = []) {
      const result = await client.query<T>(text, params);
      return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length };
    },
  };
}

export async function applyMigrations(client: PgliteLike): Promise<string[]> {
  await client.exec(
    `create table if not exists cms_migrations (
       name text primary key,
       applied_at timestamptz not null default now()
     )`
  );

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const applied: string[] = [];
  for (const file of files) {
    const existing = await client.query(`select 1 from cms_migrations where name = $1`, [file]);
    if (existing.rows.length) continue;
    const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
    await client.exec(sql);
    await client.query(`insert into cms_migrations (name) values ($1)`, [file]);
    applied.push(file);
  }
  return applied;
}

export type DevDatabase = {
  db: Db;
  applied: string[];
  close: () => Promise<void>;
};

export async function createDevDb(dataDir: string): Promise<DevDatabase> {
  const pglite = (await PGlite.create({ dataDir })) as unknown as PgliteLike;
  const db: Db = {
    ...adapter(pglite),
    async transaction<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
      return pglite.transaction((tx) => fn(adapter(tx)));
    },
  };

  const applied = await applyMigrations(pglite);

  return {
    db,
    applied,
    close: async () => {
      await (pglite as unknown as { close?: () => Promise<void> }).close?.();
    },
  };
}
