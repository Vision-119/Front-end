import type { Metadata } from "next";
import { Suspense } from "react";
import { cardClass, NoAccess } from "../../components/AppHeader";
import { TeamCards } from "../../components/TeamView";
import { requireUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { childTeams, MEMBER_TEAMS } from "../../lib/org";
import { canManageOrg } from "../../lib/permissions";

export const metadata: Metadata = { title: "관리자 | Vision119" };

function OrgTree({ parentId }: { parentId?: string }) {
  const teams = childTeams(parentId);
  if (teams.length === 0) return null;
  return (
    <ul className={parentId ? "ml-4 border-l border-zinc-200 pl-3 dark:border-zinc-800" : ""}>
      {teams.map((t) => (
        <li key={t.id} className="py-1">
          <span className="text-sm">{t.name}</span>
          {MEMBER_TEAMS.includes(t) && <span className="ml-2 text-xs text-zinc-500">{db.users.inTeam(t.id).length}명</span>}
          <OrgTree parentId={t.id} />
        </li>
      ))}
    </ul>
  );
}

async function AdminHome() {
  const user = await requireUser();
  if (!canManageOrg(user)) return <NoAccess message="관리자만 접근할 수 있습니다." />;

  const unassigned = db.users.all().filter((u) => !u.teamId).length;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">전체 팀</h1>
      <p className="mt-1 text-zinc-500">
        전 직원 {db.users.all().length}명 · 팀 {MEMBER_TEAMS.length}개 · 팀 미지정 {unassigned}명
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_240px]">
        <TeamCards teams={MEMBER_TEAMS} basePath="/admin/teams" />
        <aside className={`${cardClass} self-start`}>
          <h2 className="font-semibold">조직도</h2>
          <div className="mt-3">
            <OrgTree />
          </div>
        </aside>
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <AdminHome />
    </Suspense>
  );
}
