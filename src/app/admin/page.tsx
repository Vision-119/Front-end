import type { Metadata } from "next";
import { Suspense } from "react";
import { cardClass, NoAccess } from "../../components/AppHeader";
import OrgChart from "../../components/OrgChart";
import { TeamCards } from "../../components/TeamView";
import { requireUser } from "../../lib/auth";
import { MEMBER_TEAMS } from "../../lib/org";
import { buildOrgChart } from "../../lib/orgChart";
import { canManageOrg } from "../../lib/permissions";

export const metadata: Metadata = { title: "관리자 | Vision119" };

async function AdminHome() {
  const user = await requireUser();
  if (!canManageOrg(user)) return <NoAccess message="관리자만 접근할 수 있습니다." />;

  const org = buildOrgChart();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">전체 팀</h1>
      <p className="mt-1 text-zinc-500">
        전 직원 {org.count}명 · 팀 {MEMBER_TEAMS.length}개
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <TeamCards teams={MEMBER_TEAMS} basePath="/admin/teams" />
        <aside className={`${cardClass} self-start lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto`}>
          <h2 className="mb-4 font-semibold">조직도</h2>
          <OrgChart root={org} />
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
