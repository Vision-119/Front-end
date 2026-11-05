import Link from "next/link";
import { Suspense } from "react";
import { cardClass } from "../../components/AppHeader";
import { requireUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { getTeam, ROLE_LABEL } from "../../lib/org";
import { isAdmin, visibleTeams } from "../../lib/permissions";

async function Dashboard() {
  const user = await requireUser();
  const teams = visibleTeams(user);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">안녕하세요, {user.name}</h1>
      <p className="mt-1 text-zinc-500">
        {ROLE_LABEL[user.role]} 권한 ·{" "}
        {isAdmin(user) ? "전체 팀을 볼 수 있습니다." : "소속 팀 페이지를 볼 수 있습니다."}
      </p>

      <h2 className="mt-8 mb-3 text-sm font-semibold text-zinc-500">{isAdmin(user) ? "전체 팀" : "내 팀"}</h2>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const parent = getTeam(team.parentId ?? null);
          return (
            <Link key={team.id} href={`/teams/${team.id}`} className={`${cardClass} transition-colors hover:border-red-600`}>
              {parent && <p className="text-xs text-zinc-500">{parent.name}</p>}
              <h3 className="font-semibold">{team.name}</h3>
              <p className="mt-2 text-sm text-zinc-500">
                구성원 {db.users.inTeam(team.id).length}명 · 항목 {db.items.inTeam(team.id).length}건
              </p>
            </Link>
          );
        })}
      </section>
      {teams.length === 0 && <p className={cardClass}>소속된 팀이 없습니다.</p>}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <Dashboard />
    </Suspense>
  );
}
