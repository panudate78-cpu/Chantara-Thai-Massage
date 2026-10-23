import { one, type Db, type Queryable } from "./db";
import { SCHEMA_STATEMENTS } from "./schema.generated";

/**
 * Schema self-healing.
 *
 * Netlify Database applies `netlify/database/migrations` during the deploy
 * lifecycle. This module covers the other cases:
 *
 *  - an external Postgres (Neon, Supabase, RDS…) supplied through DATABASE_URL,
 *    where Netlify's migration step never runs,
 *  - a database provisioned after the last deploy,
 *  - a first request that arrives before the migration step has finished.
 *
 * Every statement in the migrations is idempotent (`create table if not
 * exists`, `add column if not exists`), and a transaction-scoped advisory lock
 * means concurrent cold starts cannot race each other.
 */
const SCHEMA_LOCK_ID = 918_273_645;

export async function schemaReady(db: Queryable): Promise<boolean> {
  const row = await one<{ ready: boolean }>(
    db,
    `select to_regclass('public.sites') is not null as ready`
  );
  return Boolean(row?.ready);
}

export async function ensureSchema(db: Db): Promise<{ created: boolean }> {
  if (await schemaReady(db)) return { created: false };

  return db.transaction(async (tx) => {
    await tx.query(`select pg_advisory_xact_lock($1)`, [SCHEMA_LOCK_ID]);
    // Another instance may have created the schema while we waited.
    if (await schemaReady(tx)) return { created: false };

    for (const statement of SCHEMA_STATEMENTS) {
      await tx.query(statement);
    }
    console.log(`[cms] Created the database schema (${SCHEMA_STATEMENTS.length} statements)`);
    return { created: true };
  });
}
