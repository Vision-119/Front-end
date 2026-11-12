import { NoAccess } from "../../../components/AppHeader";
import SalesDashboard from "../../../components/SalesDashboard";
import { requireUser } from "../../../lib/auth";
import { getTeam } from "../../../lib/org";
import { isAdmin } from "../../../lib/permissions";
import { Suspense } from "react";

async function SalesContent() {
  const user = await requireUser();
  const canView = isAdmin(user) || user.teamId === "sales" || getTeam(user.teamId)?.parentId === "sales";

  if (!canView) {
    return <NoAccess message="영업본부 구성원만 사업 현황판을 볼 수 있습니다." />;
  }

  return <SalesDashboard />;
}

export default function SalesPage() {
  return <Suspense fallback={<p className="text-zinc-500">불러오는 중…</p>}><SalesContent /></Suspense>;
}
