import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Db } from "./db";
import { one } from "./db";
import type { AdminUser } from "../shared/types";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

export const SESSION_COOKIE = "lp_cms_session";
export const SESSION_HOURS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, SCRYPT.keylen);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  // Parameters come from our own hashes; cap them defensively.
  if (Number(n) > 65536 || Number(r) > 16 || Number(p) > 4) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      expected.length,
      { N: Number(n), r: Number(r), p: Number(p) },
      (error, key) => (error ? reject(error) : resolve(key as Buffer))
    );
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** A valid-looking hash used to keep unknown-email logins slow. */
export const DUMMY_HASH =
  "scrypt$16384$8$1$Y2hhbnRhcmEtZHVtbXktc2FsdA==$z1n7c0FQbY0jvZxH1Jw0o3G0d5fWzB9K0Yl0Q0w0X0k=";

export type SessionUser = AdminUser & { siteId: string };

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function findUserByEmail(
  db: Db,
  siteId: string,
  email: string
): Promise<{
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor";
  password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
} | null> {
  return one(
    db,
    `select id, email, name, role, password_hash, failed_attempts, locked_until
       from admin_users where site_id = $1 and lower(email) = lower($2) limit 1`,
    [siteId, email]
  );
}

export async function recordFailedLogin(db: Db, userId: string): Promise<void> {
  await db.query(
    `update admin_users
        set failed_attempts = failed_attempts + 1,
            locked_until = case when failed_attempts + 1 >= $2
                                then now() + ($3 || ' minutes')::interval
                                else locked_until end,
            updated_at = now()
      where id = $1`,
    [userId, MAX_FAILED_ATTEMPTS, String(LOCK_MINUTES)]
  );
}

export async function recordSuccessfulLogin(db: Db, userId: string): Promise<void> {
  await db.query(
    `update admin_users
        set failed_attempts = 0, locked_until = null, last_login_at = now(), updated_at = now()
      where id = $1`,
    [userId]
  );
}

export async function createSession(
  db: Db,
  userId: string,
  siteId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await db.query(
    `insert into admin_sessions (id, user_id, site_id, token_hash, expires_at)
     values (gen_random_uuid(), $1, $2, $3, $4)`,
    [userId, siteId, hashToken(token), expiresAt.toISOString()]
  );
  return { token, expiresAt };
}

export async function getSessionUser(db: Db, token: string): Promise<SessionUser | null> {
  if (!token || token.length < 20) return null;
  const row = await one<{
    id: string;
    email: string;
    name: string;
    role: "owner" | "editor";
    site_id: string;
    session_id: string;
    expires_at: string;
    last_seen_at: string;
  }>(
    db,
    `select u.id, u.email, u.name, u.role, u.site_id, s.id as session_id,
            s.expires_at, s.last_seen_at
       from admin_sessions s
       join admin_users u on u.id = s.user_id
      where s.token_hash = $1 and s.expires_at > now()
      limit 1`,
    [hashToken(token)]
  );
  if (!row) return null;

  // Sliding expiry, refreshed at most once an hour to keep writes down.
  const lastSeen = new Date(row.last_seen_at).getTime();
  if (Date.now() - lastSeen > 60 * 60 * 1000) {
    await db.query(
      `update admin_sessions
          set last_seen_at = now(), expires_at = now() + ($2 || ' hours')::interval
        where id = $1`,
      [row.session_id, String(SESSION_HOURS)]
    );
  }

  return { id: row.id, email: row.email, name: row.name, role: row.role, siteId: row.site_id };
}

export async function destroySession(db: Db, token: string): Promise<void> {
  if (!token) return;
  await db.query(`delete from admin_sessions where token_hash = $1`, [hashToken(token)]);
}

export async function destroyAllSessions(db: Db, userId: string, keepToken?: string): Promise<void> {
  if (keepToken) {
    await db.query(`delete from admin_sessions where user_id = $1 and token_hash <> $2`, [
      userId,
      hashToken(keepToken),
    ]);
  } else {
    await db.query(`delete from admin_sessions where user_id = $1`, [userId]);
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function sessionCookie(token: string, secure: boolean): string {
  const maxAge = SESSION_HOURS * 60 * 60;
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie(secure: boolean): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function isSecureRequest(request: Request): boolean {
  const url = new URL(request.url);
  return url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}
