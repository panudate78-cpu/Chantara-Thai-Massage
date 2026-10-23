import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";
import type pg from "pg";
import { handleRequest } from "../../cms/server/handler";
import { createPgDb } from "../../cms/server/db";
import { createBlobStorage } from "../../cms/server/storage";
import { ensureAdminFromEnv, getSite } from "../../cms/server/seed";

/**
 * Launchpad CMS API.
 *
 * One function serves the public content feed, the admin API and optimised
 * gallery images. The database client and blob store are created once per
 * instance, then reused across invocations.
 */
const database = getDatabase();
const db = createPgDb(database.pool as unknown as pg.Pool);
const storage = createBlobStorage(
  getStore("media") as unknown as Parameters<typeof createBlobStorage>[0]
);

let bootstrap: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!bootstrap) {
    bootstrap = (async () => {
      const site = await getSite(db);
      await ensureAdminFromEnv(db, site.id);
    })().catch((error) => {
      bootstrap = null;
      throw error;
    });
  }
  return bootstrap;
}

export default async (request: Request): Promise<Response> => {
  await ensureReady();
  return handleRequest(request, { db, storage });
};
