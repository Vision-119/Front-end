import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NoAccess } from "../../../../components/AppHeader";
import { TeamView } from "../../../../components/TeamView";
import { requireUser } from "../../../../lib/auth";
import { getTeam, MEMBER_TEAMS } from "../../../../lib/org";
import { canManageOrg } from "../../../../lib/permissions";

export function generateStaticParams() {
  return MEMBER_TEAMS.map((t) => ({ teamId: t.id }));
}

async function AdminTeamContent({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = getTeam(teamId);
  if (!team || !MEMBER_TEAMS.includes(team)) notFound();

  const user = await requireUser();
  if (!canManageOrg(user)) return <NoAccess message="관리자만 접근할 수 있습니다." />;

  return <TeamView teamId={teamId} user={user} />;
}

export default function AdminTeamPage({ params }: PageProps<"/admin/teams/[teamId]">) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <AdminTeamContent params={params} />
    </Suspense>
  );
}
