/**
 * Local development server.
 *
 * One process, one port:
 *  - `/api/*` and `/media/*` are handled by the same CMS handler that runs as
 *    a Netlify Function in production,
 *  - everything else is served by Vite (with HMR),
 *  - `/admin` serves the admin single-page app.
 *
 * The database is PGlite (real Postgres, WASM) and photos are written to
 * `.data/media`, so you can try the whole admin flow locally.
 */
import { mkdir } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { createServer as createViteServer, type ViteDevServer } from "vite";
import { handleRequest } from "../cms/server/handler";
import { createDevDb } from "../cms/server/dev-db";
import { createFileStorage } from "../cms/server/dev-storage";
import { ensureAdminUser, getSite } from "../cms/server/seed";

const PORT = Number(process.env.PORT ?? 5173);
const HOST = process.env.HOST ?? "0.0.0.0";
const DATA_DIR = process.env.CMS_DATA_DIR ?? path.join(process.cwd(), ".data");

const DEV_ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "owner@chantara.co.uk";
const DEV_ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Chantara2026!";

async function main() {
  await mkdir(path.join(DATA_DIR, "pglite"), { recursive: true });
  await mkdir(path.join(DATA_DIR, "media"), { recursive: true });

  const { db, applied } = await createDevDb(path.join(DATA_DIR, "pglite"));
  const storage = createFileStorage(path.join(DATA_DIR, "media"));
  const site = await getSite(db);
  const admin = await ensureAdminUser(db, site.id, {
    email: DEV_ADMIN_EMAIL,
    password: DEV_ADMIN_PASSWORD,
    name: "Chantara Owner",
  });

  if (applied.length) {
    console.log(`[cms] Applied migrations: ${applied.join(", ")}`);
  }
  if (admin.created) {
    console.log(`[cms] Created the first admin account for ${DEV_ADMIN_EMAIL}`);
  }

  const vite = await createViteServer({
    server: { middlewareMode: true, host: true, allowedHosts: true },
    appType: "custom",
  });

  const server = http.createServer(async (req, res) => {
    const started = Date.now();
    const url = req.url ?? "/";
    try {
      if (url.startsWith("/api/") || url.startsWith("/media/")) {
        const response = await handleRequest(await toWebRequest(req), { db, storage });
        await sendWebResponse(res, response);
        return;
      }

      const pathname = new URL(url, "http://localhost").pathname;
      const accept = req.headers.accept ?? "";
      const hasFileExtension = /\.[a-z0-9]+$/i.test(pathname);
      const isDocument =
        req.method === "GET" &&
        (req.headers["sec-fetch-dest"] === "document" ||
          accept.includes("text/html") ||
          (accept.includes("*/*") && !hasFileExtension));

      if (isDocument) {
        const file = pathname === "/admin" || pathname.startsWith("/admin/")
          ? "admin.html"
          : "index.html";
        await sendHtml(vite, res, `/${file}`, url);
        return;
      }

      await new Promise<void>((resolve) => {
        vite.middlewares(req, res, () => resolve());
      });
      if (res.writableEnded) return;

      if (isDocument) {
        const file = pathname === "/admin" || pathname.startsWith("/admin/")
          ? "admin.html"
          : "index.html";
        await sendHtml(vite, res, `/${file}`, url);
        return;
      }

      res.statusCode = 404;
      res.end("Not found");
    } catch (error) {
      console.error("[cms] Request failed", error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
      }
      res.end("Something went wrong.");
    } finally {
      if (url.startsWith("/api/")) {
        console.log(`${req.method} ${url} → ${res.statusCode} (${Date.now() - started}ms)`);
      }
    }
  });

  server.listen(PORT, HOST, () => {
    console.log("");
    console.log("  Chantara Thai Massage — local preview");
    console.log(`  Website:  http://localhost:${PORT}/`);
    console.log(`  Admin:    http://localhost:${PORT}/admin`);
    console.log(`  Login:    ${DEV_ADMIN_EMAIL} / ${DEV_ADMIN_PASSWORD}`);
    console.log("            (set CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD to change)");
    console.log("");
  });

  const shutdown = async () => {
    server.close();
    await vite.close();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

async function toWebRequest(req: http.IncomingMessage): Promise<Request> {
  const method = (req.method ?? "GET").toUpperCase();
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }

  const host = req.headers.host ?? `localhost:${PORT}`;
  const protocol = headers.get("x-forwarded-proto") ?? "http";

  let body: Uint8Array | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    if (chunks.length) body = new Uint8Array(Buffer.concat(chunks));
  }

  return new Request(`${protocol}://${host}${req.url ?? "/"}`, {
    method,
    headers,
    body: body as unknown as BodyInit,
  });
}

async function sendWebResponse(res: http.ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  const cookies = response.headers.getSetCookie?.() ?? [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.setHeader(key, value);
  });
  if (cookies.length) res.setHeader("set-cookie", cookies);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length) res.setHeader("content-length", String(buffer.length));
  res.end(buffer);
}

async function sendHtml(
  vite: ViteDevServer,
  res: http.ServerResponse,
  file: string,
  url: string
): Promise<void> {
  const { readFile } = await import("node:fs/promises");
  const html = await readFile(path.join(process.cwd(), file.slice(1)), "utf8");
  const transformed = await vite.transformIndexHtml(url, html);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(transformed);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
