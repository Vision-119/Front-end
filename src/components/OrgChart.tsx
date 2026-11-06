"use client";

import { useMemo, useState } from "react";
import type { OrgNode, OrgPerson } from "../lib/orgChart";

const AVATAR_COLORS = ["bg-sky-600", "bg-emerald-600", "bg-amber-600", "bg-violet-600", "bg-rose-600", "bg-teal-600", "bg-indigo-600"];

const colorFor = (id: string) => AVATAR_COLORS[[...id].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

const matches = (p: OrgPerson, q: string) =>
  [p.name, p.title, p.team, p.ext, p.email.split("@")[0]].some((f) => f.toLowerCase().includes(q));

/** Keep only people matching `q` (and the departments that contain them). */
function filterTree(node: OrgNode, q: string): OrgNode | null {
  const nameHit = node.name.toLowerCase().includes(q);
  const people = nameHit ? node.people : node.people.filter((p) => matches(p, q));
  const children = node.children.map((c) => (nameHit ? c : filterTree(c, q))).filter((c): c is OrgNode => !!c);
  if (!people.length && !children.length && !nameHit) return null;
  return { ...node, people, children };
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={`size-4 shrink-0 text-zinc-500 transition-transform ${open ? "" : "-rotate-90"}`}>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

function Person({ p }: { p: OrgPerson }) {
  return (
    <li className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900" title={`${p.team}${p.ext ? ` · 내선 ${p.ext}` : ""} · ${p.email}`}>
      <span className="relative shrink-0">
        <span className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white ${colorFor(p.id)}`}>
          {p.name.slice(0, 1)}
        </span>
        {p.head && (
          <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white ring-2 ring-white dark:bg-white dark:text-zinc-900 dark:ring-zinc-950">
            M
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">
        {p.name} {p.title}
      </span>
      {p.ext && <span className="shrink-0 text-xs text-zinc-400">{p.ext}</span>}
    </li>
  );
}

function Department({ node, depth, collapsed, toggle, forceOpen }: {
  node: OrgNode;
  depth: number;
  collapsed: Set<string>;
  toggle: (id: string) => void;
  forceOpen: boolean;
}) {
  const open = forceOpen || !collapsed.has(node.id);
  const isRoot = depth === 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => toggle(node.id)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 rounded-lg px-1 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        <Chevron open={open} />
        <span className={isRoot ? "font-semibold" : "text-sm font-medium"}>{node.name}</span>
        {isRoot ? (
          <span className="text-sm text-zinc-500">{node.count}</span>
        ) : (
          <span className="ml-1 flex items-center gap-0.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800">
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3" aria-hidden>
              <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H3z" />
            </svg>
            {node.count}
          </span>
        )}
      </button>

      {open && (
        <ul className="ml-3 border-l border-zinc-100 pl-2 dark:border-zinc-900">
          {node.people.map((p) => (
            <Person key={p.id} p={p} />
          ))}
          {node.children.map((c) => (
            <Department key={c.id} node={c} depth={depth + 1} collapsed={collapsed} toggle={toggle} forceOpen={forceOpen} />
          ))}
          {!node.people.length && !node.children.length && <li className="px-2 py-1.5 text-xs text-zinc-400">구성원 없음</li>}
        </ul>
      )}
    </li>
  );
}

export default function OrgChart({ root }: { root: OrgNode }) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const q = query.trim().toLowerCase();
  const tree = useMemo(() => (q ? filterTree(root, q) : root), [root, q]);

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      <label className="relative block">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.4 9.83l3.13 3.14a.75.75 0 1 0 1.06-1.06l-3.13-3.14A5.5 5.5 0 0 0 9 3.5zM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">조직도 검색</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름, 직급, 부서, 내선, 아이디"
          className="h-10 w-full rounded-lg bg-zinc-100 pr-3 pl-9 text-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-red-600/30 dark:bg-zinc-900"
        />
      </label>

      <ul className="mt-4">
        {tree ? (
          <Department node={tree} depth={0} collapsed={collapsed} toggle={toggle} forceOpen={!!q} />
        ) : (
          <li className="px-2 py-6 text-center text-sm text-zinc-500">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}
