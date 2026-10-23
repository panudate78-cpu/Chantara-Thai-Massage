import type { FieldErrors } from "../shared/validate";

const BASE_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
};

export function json(
  data: unknown,
  init: { status?: number; headers?: Record<string, string>; cache?: string } = {}
): Response {
  const headers = new Headers(BASE_HEADERS);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", init.cache ?? "no-store");
  Object.entries(init.headers ?? {}).forEach(([key, value]) => headers.set(key, value));
  return new Response(JSON.stringify(data), { status: init.status ?? 200, headers });
}

export function errorResponse(
  status: number,
  message: string,
  fields?: FieldErrors
): Response {
  return json({ error: { message, fields: fields ?? null } }, { status });
}

export function noContent(): Response {
  return new Response(null, { status: 204, headers: BASE_HEADERS });
}

export function methodNotAllowed(allowed: string[]): Response {
  return json(
    { error: { message: "Method not allowed", fields: null } },
    { status: 405, headers: { Allow: allowed.join(", ") } }
  );
}

export async function readJsonBody<T = unknown>(
  request: Request,
  maxBytes = 6_000_000
): Promise<{ ok: true; value: T } | { ok: false; response: Response }> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length && length > maxBytes) {
    return {
      ok: false,
      response: errorResponse(413, "That file is too large. Please choose a smaller photo."),
    };
  }
  const text = await request.text();
  if (text.length > maxBytes) {
    return {
      ok: false,
      response: errorResponse(413, "That upload is too large. Please choose a smaller photo."),
    };
  }
  if (!text) return { ok: true, value: {} as T };
  try {
    return { ok: true, value: JSON.parse(text) as T };
  } catch {
    return { ok: false, response: errorResponse(400, "The request could not be read.") };
  }
}

/**
 * CSRF protection: the admin client always sends a custom header, which a
 * cross-site HTML form cannot set. We also check Origin when the browser
 * provides it.
 */
export function isTrustedMutation(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  if (request.headers.get("x-cms-request") !== "1") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return !host || originUrl.host === host;
  } catch {
    return false;
  }
}

export function requestIp(request: Request): string {
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function withCookie(response: Response, cookie: string): Response {
  response.headers.append("Set-Cookie", cookie);
  return response;
}

export function etagFor(payload: string): string {
  // Simple, stable, dependency-free weak ETag.
  let hash = 5381;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash * 33) ^ payload.charCodeAt(i);
  }
  return `W/"${(hash >>> 0).toString(16)}-${payload.length.toString(16)}"`;
}
