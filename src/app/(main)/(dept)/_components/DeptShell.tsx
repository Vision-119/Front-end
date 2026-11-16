import { Suspense } from "react";
import { NoAccess } from "../../../../components/AppHeader";
import { requireUser } from "../../../../lib/auth";
import { childTeams, getTeam } from "../../../../lib/org";
import { inOwnScope, isAdmin } from "../../../../lib/permissions";
import type { User } from "../../../../types";
import { DeptNav, type DeptNavItem } from "./DeptNav";

/** Who may enter a department's pages in 내 업무 mode. Returns a NoAccess message, or null if allowed. */
function denyReason(user: User, deptId: string): React.ReactNode | null {
  // A division (e.g. 영업본부): admins and anyone in the division or one of its sub-teams.
  if (childTeams(deptId).length) {
    const inDivision = user.teamId === deptId || getTeam(user.teamId)?.parentId === deptId;
    return isAdmin(user) || inDivision ? null : (
      <NoAccess message={`${getTeam(deptId)?.name} 구성원만 볼 수 있습니다.`} />
    );
  }
  // A team: own team only (본부장 also sees the division's sub-teams). Admins view other teams in 관리자 mode.
  if (inOwnScope(user, deptId)) return null;
  return isAdmin(user) ? (
    <NoAccess message="다른 팀은 관리자 모드에서 볼 수 있습니다." href={`/admin/teams/${deptId}`} linkLabel="관리자 모드로 보기" />
  ) : (
    <NoAccess message="소속 팀 페이지만 볼 수 있습니다." />
  );
}

async function Gate({ deptId, nav, children }: { deptId: string; nav: DeptNavItem[]; children: React.ReactNode }) {
  const user = await requireUser();
  const denied = denyReason(user, deptId);
  if (denied) return denied;
  return (
    <>
      <DeptNav items={nav} />
      {children}
    </>
  );
}

/**
 * Wraps every page of one department: access check + that department's own navbar.
 * Use it in the department's layout.tsx.
 */
export function DeptShell({ deptId, nav, children }: { deptId: string; nav: DeptNavItem[]; children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <Gate deptId={deptId} nav={nav}>
        {children}
      </Gate>
    </Suspense>
  );
}
