import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import type pg from "pg";
import { handleRequest } from "../../cms/server/handler";
import { createPgDb } from "../../cms/server/db";
import { createBlobStorage } from "../../cms/server/storage";
import { ensureAdminFromEnv, getSite } from "../../cms/server/seed";
import { ensureSchema } from "../../cms/server/migrate";
import type { CmsDeps } from "../../cms/server/context";

/**
 * Launchpad CMS API.
 *
 * One function serves the public content feed, the admin API and optimised
 * gallery images.
 *
 * Database options, in order of preference:
 *   1. Netlify Database (provisioned automatically for this site) — no config.
 *   2. Any Postgres connection string in DATABASE_URL (Neon, Supabase, RDS…),
 *      for deployments that cannot use Netlify Database.
 *
 * Photos live in Netlify Blobs, which needs no setup or extra credentials.
 */
function connectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.NETLIFY_DB_URL ??
    process.env.NETLIFY_DATABASE_URL ??
    undefined
  );
}

let deps: Promise<CmsDeps> | null = null;

function connect(): Promise<CmsDeps> {
  if (!deps) {
    deps = (async () => {
      const url = connectionString();
      const database = url ? getDatabase({ connectionString: url }) : getDatabase();
      const db = createPgDb(database.pool as unknown as pg.Pool);
      const storage = createBlobStorage(
        getStore("media") as unknown as Parameters<typeof createBlobStorage>[0]
      );
      await ensureSchema(db);
      return { db, storage };
    })().catch((error) => {
      deps = null;
      throw error;
    });
  }
  return deps;
}

let bootstrap: Promise<void> | null = null;

function ensureReady(ctx: CmsDeps): Promise<void> {
  if (!bootstrap) {
    bootstrap = (async () => {
      const site = await getSite(ctx.db);
      await ensureAdminFromEnv(ctx.db, site.id);
    })().catch((error) => {
      bootstrap = null;
      throw error;
    });
  }
  return bootstrap;
}

function failure(error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  const missingConnection = /database|connection|NETLIFY_DB_URL/i.test(message);
  const hint = missingConnection
    ? "No database is connected to this site. In Netlify open Data & Storage → Database and create one, or set a DATABASE_URL environment variable pointing at any Postgres database, then redeploy."
    : "The database is not reachable. Check its status in Netlify → Data & Storage → Database.";

  console.error("[cms] Database unavailable:", message);
  return new Response(
    JSON.stringify({
      ok: false,
      error: { message: "The content database is not available yet.", hint },
    }),
    {
      status: 503,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

export default async (request: Request): Promise<Response> => {
  try {
    const ctx = await connect();
    await ensureReady(ctx);
    return await handleRequest(request, ctx);
  } catch (error) {
    return failure(error);
  }
};
