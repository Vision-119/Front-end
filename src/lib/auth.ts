import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "../types";
import { db } from "./db";
import { SESSION_COOKIE } from "./session";

export { SESSION_COOKIE };

// The cookie holds `<userId>.<hmac>` so users can't forge another user's (e.g. an admin's) session.
const SECRET = process.env.SESSION_SECRET ?? "dev-only-insecure-secret";

const sign = (value: string) => createHmac("sha256", SECRET).update(value).digest("base64url");

export function encodeSession(userId: string) {
  return `${userId}.${sign(userId)}`;
}

function decodeSession(raw: string): string | null {
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const userId = raw.slice(0, dot);
  const given = Buffer.from(raw.slice(dot + 1));
  const expected = Buffer.from(sign(userId));
  return given.length === expected.length && timingSafeEqual(given, expected) ? userId : null;
}

export async function getSession(): Promise<User | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = raw ? decodeSession(raw) : null;
  return userId ? (db.users.byId(userId) ?? null) : null;
}

/** For server actions and protected content: the current user, or redirect to login. */
export async function requireUser(): Promise<User> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}
