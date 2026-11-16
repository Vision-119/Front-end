import { DeptShell } from "../../_components/DeptShell";
import type { DeptNavItem } from "../../_components/DeptNav";

// 기술영업팀 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/sales/tech-sales", label: "팀 홈" },
  { href: "/sales", label: "사업 현황판" },
];

export default function TechSalesLayout({ children }: LayoutProps<"/sales/tech-sales">) {
  return (
    <DeptShell deptId="tech-sales" nav={NAV}>
      {children}
    </DeptShell>
  );
}
