"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type DeptNavItem = { href: string; label: string };

/** A department's own navbar. Each department passes its items from its layout.tsx. */
export function DeptNav({ items }: { items: DeptNavItem[] }) {
  const pathname = usePathname();
  // Active = the most specific item whose href is the current path or a parent of it.
  const active = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav aria-label="부서 메뉴" className="-mt-2 mb-6 flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
      {items.map((item) => {
        const isActive = item.href === active;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-red-600 text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
