import { Suspense } from "react";
import { NoAccess } from "../../../../components/AppHeader";
import { requireUser } from "../../../../lib/auth";
import { getTeam } from "../../../../lib/org";
import { isAdmin } from "../../../../lib/permissions";

// /sales — 영업본부 사업 현황판. The page itself is an interactive client page,
// so the server-side access check lives here: admins and 영업본부 members (incl. sub-teams) only.
async function SalesGate({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const canView = isAdmin(user) || user.teamId === "sales" || getTeam(user.teamId)?.parentId === "sales";
  return canView ? children : <NoAccess message="영업본부 구성원만 사업 현황판을 볼 수 있습니다." />;
}

export default function SalesLayout({ children }: LayoutProps<"/sales">) {
  return (
    <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}>
      <SalesGate>{children}</SalesGate>
    </Suspense>
  );
}
