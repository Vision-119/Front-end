import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cardClass, NoAccess } from "../../../../components/AppHeader";
import { requireUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { getTeam, MEMBER_TEAMS, ROLE_LABEL, teamPath } from "../../../../lib/org";
import { canCreateItem, canManageItem, canViewTeam } from "../../../../lib/permissions";
import { addItem, deleteItem } from "./actions";

export function generateStaticParams() {
  return MEMBER_TEAMS.map((t) => ({ teamId: t.id }));
}

async function TeamContent({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = getTeam(teamId);
  if (!team || !MEMBER_TEAMS.includes(team)) notFound();

  const user = await requireUser();
  if (!canViewTeam(user, teamId)) return <NoAccess message="소속 팀 페이지만 볼 수 있습니다." />;

  const members = db.users.inTeam(teamId);
  const items = db.items.inTeam(teamId);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{teamPath(teamId)}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
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

export default function TeamPage({ params }: PageProps<"/teams/[teamId]">) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <TeamContent params={params} />
    </Suspense>
  );
}
