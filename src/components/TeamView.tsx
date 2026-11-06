import Link from "next/link";
import { addItem, deleteItem } from "../app/(main)/teams/[teamId]/actions";
import { db } from "../lib/db";
import { getTeam, ROLE_LABEL, teamPath } from "../lib/org";
import { canCreateItem, canManageItem } from "../lib/permissions";
import type { Team, User } from "../types";
import { cardClass } from "./AppHeader";

/** Team page body, shared by 내 업무 (/teams/x) and 관리자 (/admin/teams/x) modes. */
export function TeamView({ teamId, user }: { teamId: string; user: User }) {
  const members = db.users.inTeam(teamId);
  const items = db.items.inTeam(teamId);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{teamPath(teamId)}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className={cardClass}>
          <h2 className="font-semibold">팀 항목</h2>

          {canCreateItem(user, teamId) && (
            <form action={addItem.bind(null, teamId)} className="mt-4 flex gap-2">
              <input
                name="title"
                required
                placeholder="새 항목 제목"
                className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button type="submit" className="h-10 shrink-0 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700">
                추가
              </button>
            </form>
          )}

          <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-xs text-zinc-500">
                    {db.users.byId(item.ownerId)?.name ?? "알 수 없음"} · {item.createdAt}
                  </p>
                </div>
                {canManageItem(user, item) && (
                  <form action={deleteItem.bind(null, item.id)}>
                    <button type="submit" className="text-sm text-zinc-500 hover:text-red-600">삭제</button>
                  </form>
                )}
              </li>
            ))}
            {items.length === 0 && <li className="py-3 text-sm text-zinc-500">항목이 없습니다.</li>}
          </ul>
        </section>

        <aside className={cardClass}>
          <h2 className="font-semibold">구성원</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {members.map((m) => (
              <li key={m.id} className="flex justify-between gap-2">
                <span>
                  {m.name} <span className="text-zinc-500">{m.title}</span>
                </span>
                <span className="text-zinc-500">
                  {m.ext && `☎ ${m.ext} · `}
                  {ROLE_LABEL[m.role]}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

/** Grid of team cards linking to `${basePath}/${team.id}`. */
export function TeamCards({ teams, basePath }: { teams: Team[]; basePath: string }) {
  return (
    <section className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {teams.map((team) => {
        const parent = getTeam(team.parentId ?? null);
        return (
          <Link key={team.id} href={`${basePath}/${team.id}`} className={`${cardClass} transition-colors hover:border-red-600`}>
            {parent && <p className="text-xs text-zinc-500">{parent.name}</p>}
            <h3 className="font-semibold">{team.name}</h3>
            <p className="mt-2 text-sm text-zinc-500">
              구성원 {db.users.inTeam(team.id).length}명 · 항목 {db.items.inTeam(team.id).length}건
            </p>
          </Link>
        );
      })}
    </section>
  );
}
