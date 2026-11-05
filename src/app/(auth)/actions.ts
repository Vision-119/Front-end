"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encodeSession, SESSION_COOKIE } from "../../lib/auth";
import { db, DEMO_PASSWORD } from "../../lib/db";

export type LoginState = { error?: string; email?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // TODO: verify credentials against the backend API.
  const user = db.users.byEmail(email);
  if (!user || password !== DEMO_PASSWORD) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다.", email };
  }

  (await cookies()).set(SESSION_COOKIE, encodeSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
