import type { CmsDeps } from "./context";
import { getSite, ensureAdminFromEnv } from "./seed";
import { loadPublicContent } from "./content";
import { errorResponse, etagFor, isTrustedMutation, json, methodNotAllowed } from "./http";
import { SESSION_COOKIE, getSessionUser, readCookie } from "./auth";
import { login, logout, session, changePassword } from "./routes/auth";
import {
  getBusiness,
  getHomepage,
  overview,
  updateBusiness,
  updateHomepage,
  exportContent,
} from "./routes/admin";
import {
  archiveTreatment,
  createTreatment,
  deleteTreatment,
  listTreatments,
  reorderTreatments,
  updateTreatment,
} from "./routes/treatments";
import {
  createOffer,
  deleteOffer,
  listOffers,
  toggleOffer,
  updateOffer,
} from "./routes/offers";
import {
  deletePhoto,
  listGallery,
  reorderGallery,
  updatePhoto,
  uploadPhoto,
} from "./routes/gallery";
import { serveMedia } from "./routes/media";

const PUBLIC_CACHE = "public, max-age=0, s-maxage=30, stale-while-revalidate=300";

export async function handleRequest(request: Request, deps: CmsDeps): Promise<Response> {
  const url = new URL(request.url);
  let pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  // If a platform rewrite reached us through the function's default URL,
  // restore the public path (/api/... or /media/...) before routing.
  const functionPrefix = "/.netlify/functions/api";
  if (pathname.startsWith(functionPrefix)) {
    const rest = pathname.slice(functionPrefix.length) || "/";
    pathname = rest.startsWith("/media") ? rest : `/api${rest}`;
  }

  try {
    if (pathname === "/api/health") {
      return json({ ok: true, service: "launchpad-cms" });
    }

    const site = await getSite(deps.db);
    const base = { request, url, db: deps.db, storage: deps.storage, site };

    if (pathname === "/api/content") {
      if (method !== "GET" && method !== "HEAD") return methodNotAllowed(["GET"]);
      const content = await loadPublicContent(deps.db, site.id);
      const body = JSON.stringify(content);
      const etag = etagFor(body);
      const headers = {
        ETag: etag,
        "Cache-Control": PUBLIC_CACHE,
        "X-Content-Type-Options": "nosniff",
      };
      if (request.headers.get("if-none-match") === etag) {
        return new Response(null, { status: 304, headers });
      }
      return json(content, { headers });
    }

    if (pathname.startsWith("/media/")) {
      if (method !== "GET" && method !== "HEAD") return methodNotAllowed(["GET"]);
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length !== 3) return new Response("Not found", { status: 404 });
      return serveMedia(base, parts[1], parts[2]);
    }

    if (!pathname.startsWith("/api/admin/")) {
      return errorResponse(404, "Not found.");
    }

    if (!isTrustedMutation(request)) {
      return errorResponse(403, "This request was blocked for security reasons.");
    }

    await ensureAdminFromEnv(deps.db, site.id);

    if (pathname === "/api/admin/login") {
      if (method !== "POST") return methodNotAllowed(["POST"]);
      return login(base);
    }

    if (pathname === "/api/admin/logout") {
      if (method !== "POST") return methodNotAllowed(["POST"]);
      return logout(base);
    }

    if (pathname === "/api/admin/session") {
      if (method !== "GET") return methodNotAllowed(["GET"]);
      return session(base);
    }

    const token = readCookie(request, SESSION_COOKIE);
    const user = token ? await getSessionUser(deps.db, token) : null;
    if (!user || user.siteId !== site.id) {
      return errorResponse(401, "Your session has expired. Please sign in again.");
    }

    const ctx = { ...base, user };
    const parts = pathname.split("/").filter(Boolean); // api, admin, section, id?, action?
    const section = parts[2] ?? "";
    const id = parts[3] ?? "";
    const action = parts[4] ?? "";

    switch (section) {
      case "overview":
        if (method !== "GET") return methodNotAllowed(["GET"]);
        return overview(ctx);

      case "business":
        if (method === "GET") return getBusiness(ctx);
        if (method === "PUT") return updateBusiness(ctx);
        return methodNotAllowed(["GET", "PUT"]);

      case "homepage":
        if (method === "GET") return getHomepage(ctx);
        if (method === "PUT") return updateHomepage(ctx);
        return methodNotAllowed(["GET", "PUT"]);

      case "export":
        if (method !== "GET") return methodNotAllowed(["GET"]);
        return exportContent(ctx);

      case "treatments":
        if (!id) {
          if (method === "GET") return listTreatments(ctx);
          if (method === "POST") return createTreatment(ctx);
          return methodNotAllowed(["GET", "POST"]);
        }
        if (id === "reorder") {
          if (method !== "POST") return methodNotAllowed(["POST"]);
          return reorderTreatments(ctx);
        }
        if (action === "archive") {
          if (method !== "POST") return methodNotAllowed(["POST"]);
          return archiveTreatment(ctx, id);
        }
        if (action) return errorResponse(404, "Not found.");
        if (method === "PUT") return updateTreatment(ctx, id);
        if (method === "DELETE") return deleteTreatment(ctx, id);
        return methodNotAllowed(["PUT", "DELETE"]);

      case "offers":
        if (!id) {
          if (method === "GET") return listOffers(ctx);
          if (method === "POST") return createOffer(ctx);
          return methodNotAllowed(["GET", "POST"]);
        }
        if (action === "toggle") {
          if (method !== "POST") return methodNotAllowed(["POST"]);
          return toggleOffer(ctx, id);
        }
        if (action) return errorResponse(404, "Not found.");
        if (method === "PUT") return updateOffer(ctx, id);
        if (method === "DELETE") return deleteOffer(ctx, id);
        return methodNotAllowed(["PUT", "DELETE"]);

      case "gallery":
        if (!id) {
          if (method === "GET") return listGallery(ctx);
          if (method === "POST") return uploadPhoto(ctx);
          return methodNotAllowed(["GET", "POST"]);
        }
        if (id === "reorder") {
          if (method !== "POST") return methodNotAllowed(["POST"]);
          return reorderGallery(ctx);
        }
        if (action) return errorResponse(404, "Not found.");
        if (method === "PUT") return updatePhoto(ctx, id);
        if (method === "DELETE") return deletePhoto(ctx, id);
        return methodNotAllowed(["PUT", "DELETE"]);

      case "account":
        if (id === "password" && method === "POST") return changePassword(ctx);
        return errorResponse(404, "Not found.");

      default:
        return errorResponse(404, "Not found.");
    }
  } catch (error) {
    console.error("CMS request failed", error);
    return errorResponse(500, "Something went wrong. Please try again in a moment.");
  }
}
