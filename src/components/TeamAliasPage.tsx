import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NoAccess } from "./AppHeader";
import { TeamView } from "./TeamView";
import { requireUser } from "../lib/auth";
import { getTeam, MEMBER_TEAMS } from "../lib/org";
import { inOwnScope, isAdmin } from "../lib/permissions";

export async function TeamAliasContent({ teamId }: { teamId: string }) {
  const team = getTeam(teamId);
  if (!team || !MEMBER_TEAMS.includes(team)) notFound();

  const user = await requireUser();
  if (!inOwnScope(user, teamId)) {
    return isAdmin(user)
      ? <NoAccess message="다른 팀은 관리자 모드에서 볼 수 있습니다." href={`/admin/teams/${teamId}`} linkLabel="관리자 모드로 보기" />
      : <NoAccess message="소속 팀 페이지만 볼 수 있습니다." />;
  }

  return <TeamView teamId={teamId} user={user} />;
}

export function TeamAliasPage({ teamId }: { teamId: string }) {
  return <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}><TeamAliasContent teamId={teamId} /></Suspense>;
}
