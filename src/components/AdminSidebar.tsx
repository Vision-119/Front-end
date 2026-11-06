"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarSection = {
  title: string;
  links: { href: string; label: string; icon?: "grid" | "team" | "users" | "box" }[];
};

const ICONS = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  team: "M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75",
  users: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  );
}

/** Admin console navigation. `activeFromPath` is off in the static fallback (no pathname yet). */
export function SidebarNav({ sections, activeFromPath = true }: { sections: SidebarSection[]; activeFromPath?: boolean }) {
  return activeFromPath ? <ActiveNav sections={sections} /> : <Nav sections={sections} pathname="" />;
}

function ActiveNav({ sections }: { sections: SidebarSection[] }) {
  return <Nav sections={sections} pathname={usePathname()} />;
}

function Nav({ sections, pathname }: { sections: SidebarSection[]; pathname: string }) {
  return (
    <nav aria-label="관리자 메뉴" className="flex flex-col gap-6">
      {sections.map((s) => (
        <div key={s.title}>
          <p className="mb-1.5 px-3 text-xs font-semibold text-zinc-500">{s.title}</p>
          <ul className="flex flex-col gap-0.5">
            {s.links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-zinc-200/70 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {l.icon ? <Icon name={l.icon} /> : <span className="size-4 shrink-0" />}
                    <span className="truncate">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
