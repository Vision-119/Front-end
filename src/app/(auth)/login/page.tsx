import type { Metadata } from "next";
import Image from "next/image";
import { db, DEMO_PASSWORD, USING_EXAMPLE_STAFF } from "../../../lib/db";
import { ROLE_LABEL } from "../../../lib/org";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = { title: "로그인 | Vision119" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Image src="/logo_black.svg" alt="Vision119" width={160} height={32} priority className="mx-auto h-8 w-auto dark:hidden" />
        <Image src="/logo_white.svg" alt="Vision119" width={160} height={32} priority className="mx-auto hidden h-8 w-auto dark:block" />
        <p className="mt-4 mb-8 text-center text-sm text-zinc-500">포털에 로그인하세요</p>
        <LoginForm />
        <details className="mt-6 text-xs text-zinc-500">
          <summary className="cursor-pointer">데모 로그인 안내</summary>
          <p className="mt-2">회사 이메일 + 임시 비밀번호 {DEMO_PASSWORD}</p>
          {USING_EXAMPLE_STAFF && (
            <ul className="mt-2 space-y-1 font-mono">
              {db.users.all().map((u) => (
                <li key={u.id}>{u.email} — {ROLE_LABEL[u.role]}</li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </main>
  );
}
