import { redirect } from "next/navigation";
import { Suspense } from "react";
import { cardClass } from "../../components/AppHeader";
import { TeamCards } from "../../components/TeamView";
import { requireUser } from "../../lib/auth";
import { ROLE_LABEL } from "../../lib/org";
import { isAdmin, workTeams } from "../../lib/permissions";

// 내 업무 mode: everyone (admins included) sees only their own team here.
// Admins switch to 관리자 mode with the header toggle to see every team.
async function Dashboard() {
  const user = await requireUser();
  const teams = workTeams(user);

  // Admins with no team (e.g. 대표이사) have no personal workspace.
  if (!teams.length && isAdmin(user)) redirect("/admin");

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{`안녕하세요, ${user.name} ${user.title}님`}</h1>
      <p className="mt-1 text-zinc-500">
        {ROLE_LABEL[user.role]} 권한
        {isAdmin(user) && " · 전체 팀은 상단의 관리자 모드에서 볼 수 있습니다."}
      </p>

      <h2 className="mt-8 mb-3 text-sm font-semibold text-zinc-500">내 팀</h2>
      {teams.length ? <TeamCards teams={teams} basePath="/teams" /> : <p className={cardClass}>소속된 팀이 없습니다.</p>}
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
