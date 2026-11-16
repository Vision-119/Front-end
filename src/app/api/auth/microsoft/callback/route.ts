import { NextResponse, type NextRequest } from "next/server";
import { encodeSession, SESSION_COOKIE } from "../../../../../lib/auth";
import { db } from "../../../../../lib/db";
import { exchangeCodeForEmails, MS_STATE_COOKIE, redirectUri, type OAuthState } from "../../../../../lib/microsoft";

// Microsoft redirects here after sign-in. Maps the Microsoft account to a portal user by email.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fail = (code: string) => {
    const res = NextResponse.redirect(new URL(`/login?error=${code}`, request.url));
    res.cookies.delete({ name: MS_STATE_COOKIE, path: "/api/auth/microsoft" });
    return res;
  };

  if (params.get("error")) return fail("ms_cancelled");

  let saved: OAuthState | null = null;
  try {
    saved = JSON.parse(request.cookies.get(MS_STATE_COOKIE)?.value ?? "null");
  } catch {}
  const code = params.get("code");
  if (!saved || !code || params.get("state") !== saved.state) return fail("ms_state");

  let emails: string[];
  try {
    emails = await exchangeCodeForEmails(code, saved, redirectUri(request.url));
  } catch (err) {
    console.error("[microsoft login]", err);
    return fail("ms_failed");
  }

  const user = emails.map((e) => db.users.byEmail(e)).find(Boolean);
  if (!user) {
    console.warn("[microsoft login] no portal user for", emails.join(", "));
    return fail("ms_unknown_user");
  }

  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.delete({ name: MS_STATE_COOKIE, path: "/api/auth/microsoft" });
  res.cookies.set(SESSION_COOKIE, encodeSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
