import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { db, DEMO_PASSWORD, USING_EXAMPLE_STAFF } from "../../../lib/db";
import { ROLE_LABEL } from "../../../lib/org";
import { microsoftEnabled } from "../../../lib/microsoft";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = { title: "로그인 | Vision119" };

const ERRORS: Record<string, string> = {
  ms_disabled: "Microsoft 로그인이 아직 설정되지 않았습니다.",
  ms_cancelled: "Microsoft 로그인이 취소되었습니다.",
  ms_state: "로그인 세션이 만료되었습니다. 다시 시도해 주세요.",
  ms_failed: "Microsoft 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  ms_unknown_user: "포털에 등록되지 않은 계정입니다. 관리자에게 문의하세요.",
};

type SearchParams = Promise<{ error?: string }>;

// Reads searchParams (runtime data), so it renders inside <Suspense> and the rest of the page can prerender.
async function LoginError({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] : undefined;
  if (!message) return null;
  return (
    <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
      {message}
    </p>
  );
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Image src="/logo_black.svg" alt="Vision119" width={161} height={32} priority className="mx-auto h-8 w-auto dark:hidden" />
        <Image src="/logo_white.svg" alt="Vision119" width={161} height={32} priority className="mx-auto hidden h-8 w-auto dark:block" />
        <p className="mt-4 mb-8 text-center text-sm text-zinc-500">포털에 로그인하세요</p>
        <Suspense fallback={null}>
          <LoginError searchParams={searchParams} />
        </Suspense>
        {microsoftEnabled && (
          <>
            {/* Plain <a>: this is an API route that redirects to Microsoft, not a page to prefetch.
                The lint rule mistakes it for a page because of the top-level [deptId] route. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/auth/microsoft"
              className="flex h-11 items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <svg aria-hidden width="18" height="18" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Microsoft로 로그인
            </a>
            <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              또는 이메일로 로그인
              <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </>
        )}
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
