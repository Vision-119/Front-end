"use client";

import { useEffect, useRef, useState } from "react";
import { logout } from "../app/(auth)/actions";

type Props = {
  name: string;
  title: string;
  email: string;
  roleLabel: string;
  team: string;
  ext: string;
  isAdmin: boolean;
};

export default function ProfileMenu({ name, title, email, roleLabel, team, ext, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const avatar = (size: string) => (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${size} ${
        isAdmin ? "bg-red-600" : "bg-zinc-700 dark:bg-zinc-600"
      }`}
    >
      {name.slice(0, 1)}
    </span>
  );

  const rows = [
    { label: "권한", value: roleLabel },
    { label: "소속", value: team || "—" },
    { label: "내선", value: ext || "—" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        {avatar("size-8 text-sm")}
        <span className="hidden text-sm font-medium md:inline">
          {name} <span className="font-normal text-zinc-500">{title}</span>
        </span>
        <svg viewBox="0 0 20 20" fill="currentColor" className={`size-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
            {avatar("size-11 text-base")}
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {name} <span className="font-normal text-zinc-500">{title}</span>
              </p>
              <p className="truncate text-xs text-zinc-500">{email}</p>
            </div>
          </div>

          <dl className="space-y-2 p-4 text-sm">
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between gap-4">
                <dt className="text-zinc-500">{r.label}</dt>
                <dd className="truncate text-right font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>

          <form action={logout} className="border-t border-zinc-200 p-2 dark:border-zinc-800">
            <button
              type="submit"
              role="menuitem"
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
