import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "../app/(auth)/actions";
import { getSession } from "../lib/auth";
import { ROLE_LABEL, teamPath } from "../lib/org";
import { canManageOrg } from "../lib/permissions";

async function UserNav() {
  const user = await getSession();
  if (!user) return null;
  return (
    <>
      <Link href="/" className="font-medium hover:text-red-600">홈</Link>
      {canManageOrg(user) && (
        <Link href="/admin" className="font-medium hover:text-red-600">관리자</Link>
      )}
      <span className="hidden text-zinc-500 md:inline">
        {user.name} {user.title} · {ROLE_LABEL[user.role]}
        {user.teamId && ` · ${teamPath(user.teamId)}`}
      </span>
    </>
  );
}

export default function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="홈" className="shrink-0">
          <Image src="/logo_black.svg" alt="Vision119" width={120} height={24} priority className="h-6 w-auto dark:hidden" />
          <Image src="/logo_white.svg" alt="Vision119" width={120} height={24} priority className="hidden h-6 w-auto dark:block" />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Suspense>
            <UserNav />
          </Suspense>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              로그아웃
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

export function NoAccess({ message = "이 페이지에 접근할 권한이 없습니다." }: { message?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <p className="font-semibold">접근 권한 없음</p>
      <p className="mt-2 text-sm text-zinc-500">{message}</p>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline">홈으로</Link>
    </div>
  );
}

export const cardClass = "rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";
