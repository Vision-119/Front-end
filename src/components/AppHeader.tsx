import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "../lib/auth";
import { ROLE_LABEL, teamPath } from "../lib/org";
import { isAdmin } from "../lib/permissions";
import ProfileMenu from "./ProfileMenu";

/** "work" = the user's own pages; "admin" = company-wide admin console (admins only). */
export type Mode = "work" | "admin";

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/** Segmented toggle between 내 업무 and 관리자 mode. */
function ModeToggle({ mode }: { mode: Mode }) {
  const options = [
    { mode: "work" as const, href: "/", label: "내 업무", Icon: BriefcaseIcon },
    { mode: "admin" as const, href: "/admin", label: "관리자", Icon: ShieldIcon },
  ];
  return (
    <div role="group" aria-label="모드 전환" className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
      {options.map(({ mode: m, href, label, Icon }) => {
        const active = m === mode;
        return (
          <Link
            key={m}
            href={href}
            title={`${label} 모드`}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Icon />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

async function UserNav({ mode }: { mode: Mode }) {
  const user = await getSession();
  if (!user) return null;
  const links =
    mode === "admin"
      ? [
          { href: "/admin", label: "전체 팀" },
          { href: "/admin/users", label: "사용자 관리" },
        ]
      : [{ href: "/", label: "홈" }];

  return (
    <>
      {isAdmin(user) && <ModeToggle mode={mode} />}
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="font-medium hover:text-red-600">
          {l.label}
        </Link>
      ))}
      <ProfileMenu
        name={user.name}
        title={user.title}
        email={user.email}
        roleLabel={ROLE_LABEL[user.role]}
        team={teamPath(user.teamId)}
        ext={user.ext}
        isAdmin={isAdmin(user)}
      />
    </>
  );
}

export default function AppHeader({ mode }: { mode: Mode }) {
  return (
    <header
      className={`border-b bg-white dark:bg-zinc-950 ${
        mode === "admin" ? "border-red-600/40 shadow-[inset_0_3px_0_0_var(--color-red-600)]" : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <Link href={mode === "admin" ? "/admin" : "/"} aria-label="홈">
            <Image src="/logo_black.svg" alt="Vision119" width={120} height={24} priority className="h-6 w-auto dark:hidden" />
            <Image src="/logo_white.svg" alt="Vision119" width={120} height={24} priority className="hidden h-6 w-auto dark:block" />
          </Link>
          {mode === "admin" && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">관리자 모드</span>
          )}
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Suspense>
            <UserNav mode={mode} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

export function PageShell({ mode, children }: { mode: Mode; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader mode={mode} />
      <main className="w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

export function NoAccess({
  message = "이 페이지에 접근할 권한이 없습니다.",
  href = "/",
  linkLabel = "홈으로",
}: {
  message?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <p className="font-semibold">접근 권한 없음</p>
      <p className="mt-2 text-sm text-zinc-500">{message}</p>
      <Link href={href} className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline">{linkLabel}</Link>
    </div>
  );
}

export const cardClass = "rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";
