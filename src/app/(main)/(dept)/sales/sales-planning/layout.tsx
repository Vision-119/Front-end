import { DeptShell } from "../../_components/DeptShell";
import type { DeptNavItem } from "../../_components/DeptNav";

// 영업기획팀 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/sales/sales-planning", label: "팀 홈" },
  { href: "/sales", label: "사업 현황판" },
];

export default function SalesPlanningLayout({ children }: LayoutProps<"/sales/sales-planning">) {
  return (
    <DeptShell deptId="sales-planning" nav={NAV}>
      {children}
    </DeptShell>
  );
}
