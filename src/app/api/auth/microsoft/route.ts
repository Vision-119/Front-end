import { NextResponse } from "next/server";
import { authorizeUrl, microsoftEnabled, MS_STATE_COOKIE, newOAuthState, redirectUri } from "../../../../lib/microsoft";

// Starts Microsoft sign-in: remembers state/nonce/PKCE verifier in a short-lived cookie, then redirects.
export async function GET(request: Request) {
  if (!microsoftEnabled) {
    return NextResponse.redirect(new URL("/login?error=ms_disabled", request.url));
  }

  const s = newOAuthState();
  const res = NextResponse.redirect(authorizeUrl(s, redirectUri(request.url)));
  res.cookies.set(MS_STATE_COOKIE, JSON.stringify(s), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/microsoft",
    maxAge: 60 * 10,
  });
  return res;
}
