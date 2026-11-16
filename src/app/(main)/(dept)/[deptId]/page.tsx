import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NoAccess } from "../../../../components/AppHeader";
import { TeamView } from "../../../../components/TeamView";
import { requireUser } from "../../../../lib/auth";
import { getTeam, MEMBER_TEAMS } from "../../../../lib/org";
import { inOwnScope, isAdmin } from "../../../../lib/permissions";

// /<id> (route group "(dept)", not in the URL): a department's detail page.
// 영업본부's 사업 현황판 is its own page at ../sales (a static segment wins over [deptId]).

export function generateStaticParams() {
  return MEMBER_TEAMS.map((t) => ({ deptId: t.id }));
}

async function DeptContent({ params }: { params: Promise<{ deptId: string }> }) {
  const { deptId } = await params;
  const team = getTeam(deptId);
  if (!team || !MEMBER_TEAMS.includes(team)) notFound();

  const user = await requireUser();
  // 내 업무 mode shows your own team only — admins view other teams in 관리자 mode.
  if (!inOwnScope(user, deptId)) {
    return isAdmin(user) ? (
      <NoAccess message="다른 팀은 관리자 모드에서 볼 수 있습니다." href={`/admin/teams/${deptId}`} linkLabel="관리자 모드로 보기" />
    ) : (
      <NoAccess message="소속 팀 페이지만 볼 수 있습니다." />
    );
  }

  return <TeamView teamId={deptId} user={user} />;
}

export default function DeptPage({ params }: PageProps<"/[deptId]">) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <DeptContent params={params} />
    </Suspense>
  );
}
