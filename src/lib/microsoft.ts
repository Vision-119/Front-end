import { createHash, randomBytes } from "node:crypto";

// Microsoft Entra ID (Azure AD) sign-in via OpenID Connect authorization code flow + PKCE.
// Configure in .env.local:
//   AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET
//   AZURE_AD_REDIRECT_URI (optional; defaults to <origin>/api/auth/microsoft/callback)

const TENANT = process.env.AZURE_AD_TENANT_ID;
const CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_AD_CLIENT_SECRET;

export const MS_STATE_COOKIE = "v119_ms_oauth";

export const microsoftEnabled = Boolean(TENANT && CLIENT_ID && CLIENT_SECRET);

const authority = () => `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0`;

export function redirectUri(requestUrl: string) {
  return process.env.AZURE_AD_REDIRECT_URI ?? new URL("/api/auth/microsoft/callback", requestUrl).toString();
}

export type OAuthState = { state: string; nonce: string; verifier: string };

export function newOAuthState(): OAuthState {
  const rand = () => randomBytes(32).toString("base64url");
  return { state: rand(), nonce: rand(), verifier: rand() };
}

export function authorizeUrl(s: OAuthState, redirect: string) {
  const challenge = createHash("sha256").update(s.verifier).digest("base64url");
  const url = new URL(`${authority()}/authorize`);
  url.search = new URLSearchParams({
    client_id: CLIENT_ID!,
    response_type: "code",
    redirect_uri: redirect,
    response_mode: "query",
    scope: "openid profile email",
    state: s.state,
    nonce: s.nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return url.toString();
}

type IdTokenClaims = {
  aud: string;
  tid: string;
  nonce?: string;
  exp: number;
  email?: string;
  preferred_username?: string;
  upn?: string;
};

/**
 * Exchanges the auth code for tokens and returns the signed-in user's email addresses
 * (mail, UPN — they can differ), lowercased and de-duplicated.
 * The ID token comes straight from Microsoft's token endpoint over TLS with our client secret,
 * so its claims are trusted without a separate signature check (OIDC Core 3.1.3.7).
 */
export async function exchangeCodeForEmails(code: string, s: OAuthState, redirect: string): Promise<string[]> {
  const res = await fetch(`${authority()}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect,
      code_verifier: s.verifier,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`token endpoint ${res.status}: ${await res.text()}`);

  const { id_token } = (await res.json()) as { id_token?: string };
  if (!id_token) throw new Error("no id_token in response");

  const claims = JSON.parse(Buffer.from(id_token.split(".")[1], "base64url").toString("utf8")) as IdTokenClaims;
  if (claims.aud !== CLIENT_ID) throw new Error("aud mismatch");
  if (claims.tid !== TENANT) throw new Error("tenant mismatch");
  if (claims.nonce !== s.nonce) throw new Error("nonce mismatch");
  if (claims.exp * 1000 < Date.now()) throw new Error("id_token expired");

  const emails = [claims.email, claims.preferred_username, claims.upn]
    .filter((e): e is string => Boolean(e?.includes("@")))
    .map((e) => e.toLowerCase());
  if (!emails.length) throw new Error("no email claim");
  return [...new Set(emails)];
}
