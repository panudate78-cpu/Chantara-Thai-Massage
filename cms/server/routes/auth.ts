import type { AdminContext, PublicContext } from "../context";
import { errorResponse, json, requestIp, withCookie } from "../http";
import { logAudit } from "../audit";
import {
  SESSION_COOKIE,
  clearSessionCookie,
  createSession,
  destroyAllSessions,
  destroySession,
  findUserByEmail,
  getSessionUser,
  hashPassword,
  isSecureRequest,
  readCookie,
  recordFailedLogin,
  recordSuccessfulLogin,
  sessionCookie,
  verifyPassword,
  DUMMY_HASH,
} from "../auth";
import { validatePassword } from "../../shared/validate";
import { loadBusiness } from "../content";

type LoginBody = { email?: unknown; password?: unknown };

/** Small in-memory guard against credential stuffing; DB lock-out is the real one. */
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX_FAILURES = 20;

function isLockedOut(ip: string): boolean {
  const entry = ipAttempts.get(ip);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    ipAttempts.delete(ip);
    return false;
  }
  return entry.count >= IP_MAX_FAILURES;
}

function recordIpFailure(ip: string): void {
  const now = Date.now();
  if (ipAttempts.size > 5000) {
    for (const [key, value] of ipAttempts) {
      if (value.resetAt < now) ipAttempts.delete(key);
    }
  }
  const entry = ipAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    ipAttempts.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

function clearIpFailures(ip: string): void {
  ipAttempts.delete(ip);
}

export async function login(ctx: PublicContext): Promise<Response> {
  const ip = requestIp(ctx.request);
  if (isLockedOut(ip)) {
    return errorResponse(429, "Too many attempts. Please wait a few minutes and try again.");
  }

  const body = (await ctx.request.json().catch(() => ({}))) as LoginBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return errorResponse(422, "Enter your email address and password.");
  }

  const user = await findUserByEmail(ctx.db, ctx.site.id, email);

  if (user?.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    return errorResponse(
      429,
      "Too many failed attempts. Please try again in 15 minutes or contact Launchpad Studio."
    );
  }

  const valid = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyPassword(password, DUMMY_HASH);

  if (!user || !valid) {
    if (user) await recordFailedLogin(ctx.db, user.id);
    recordIpFailure(ip);
    return errorResponse(401, "That email address and password don't match.");
  }

  clearIpFailures(ip);
  await recordSuccessfulLogin(ctx.db, user.id);
  await ctx.db
    .query(`delete from admin_sessions where expires_at < now() - interval '7 days'`)
    .catch(() => undefined);
  const { token } = await createSession(ctx.db, user.id, ctx.site.id);

  const business = await loadBusiness(ctx.db, ctx.site.id);
  const response = json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    site: { name: business.name, url: ctx.site.siteUrl },
  });
  return withCookie(response, sessionCookie(token, isSecureRequest(ctx.request)));
}

export async function logout(ctx: PublicContext): Promise<Response> {
  const token = readCookie(ctx.request, SESSION_COOKIE);
  if (token) await destroySession(ctx.db, token);
  const response = json({ ok: true });
  return withCookie(response, clearSessionCookie(isSecureRequest(ctx.request)));
}

export async function session(ctx: PublicContext): Promise<Response> {
  const token = readCookie(ctx.request, SESSION_COOKIE);
  const user = token ? await getSessionUser(ctx.db, token) : null;
  if (!user) return errorResponse(401, "Not signed in.");
  const business = await loadBusiness(ctx.db, user.siteId);
  return json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    site: { name: business.name, url: ctx.site.siteUrl },
  });
}

export async function changePassword(ctx: AdminContext): Promise<Response> {
  const body = (await ctx.request.json().catch(() => ({}))) as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  const problem = validatePassword(newPassword);
  if (problem) return errorResponse(422, "Please check the highlighted fields.", { newPassword: problem });
  if (newPassword === currentPassword) {
    return errorResponse(422, "Choose a password you haven't used before.", {
      newPassword: "Choose a different password.",
    });
  }

  const row = await findUserByEmail(ctx.db, ctx.site.id, ctx.user.email);
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return errorResponse(422, "Your current password is not correct.", {
      currentPassword: "That password doesn't match our records.",
    });
  }

  const hash = await hashPassword(newPassword);
  await ctx.db.transaction(async (tx) => {
    await tx.query(`update admin_users set password_hash = $1, updated_at = now() where id = $2`, [
      hash,
      ctx.user.id,
    ]);
    await logAudit(tx, ctx.site.id, ctx.user.email, "updated", "account", ctx.user.id, "Password changed");
  });

  const token = readCookie(ctx.request, SESSION_COOKIE) ?? undefined;
  await destroyAllSessions(ctx.db, ctx.user.id, token);

  return json({ ok: true });
}
