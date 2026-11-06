import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NoAccess } from "../../../../components/AppHeader";
import { TeamView } from "../../../../components/TeamView";
import { requireUser } from "../../../../lib/auth";
import { getTeam, MEMBER_TEAMS } from "../../../../lib/org";
import { isAdmin } from "../../../../lib/permissions";

export function generateStaticParams() {
  return MEMBER_TEAMS.map((t) => ({ teamId: t.id }));
}

async function TeamContent({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = getTeam(teamId);
  if (!team || !MEMBER_TEAMS.includes(team)) notFound();

  const user = await requireUser();
  // 내 업무 mode shows your own team only — admins view other teams in 관리자 mode.
  if (user.teamId !== teamId) {
    return isAdmin(user) ? (
      <NoAccess message="다른 팀은 관리자 모드에서 볼 수 있습니다." href={`/admin/teams/${teamId}`} linkLabel="관리자 모드로 보기" />
    ) : (
      <NoAccess message="소속 팀 페이지만 볼 수 있습니다." />
    );
  }

  return <TeamView teamId={teamId} user={user} />;
}

export default function TeamPage({ params }: PageProps<"/teams/[teamId]">) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <TeamContent params={params} />
    </Suspense>
  );
}
