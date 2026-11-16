import { Suspense } from "react";
import { TeamView } from "../../../../components/TeamView";
import { requireUser } from "../../../../lib/auth";

async function Content({ teamId }: { teamId: string }) {
  const user = await requireUser();
  return <TeamView teamId={teamId} user={user} />;
}

/** A team's home page (team items + members). Access is checked by the team's layout (DeptShell). */
export function TeamHome({ teamId }: { teamId: string }) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <Content teamId={teamId} />
    </Suspense>
  );
}
