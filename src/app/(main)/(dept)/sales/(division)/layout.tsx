import { DeptShell } from "../../_components/DeptShell";
import type { DeptNavItem } from "../../_components/DeptNav";

// 영업본부 navbar. "(division)" is a route group: it applies to /sales itself
// but not to the sub-team folders (tech-sales, sales-planning, pr), which have their own navbars.
const NAV: DeptNavItem[] = [
  { href: "/sales", label: "사업 현황판" },
];

export default function SalesLayout({ children }: LayoutProps<"/sales">) {
  return (
    <DeptShell deptId="sales" nav={NAV}>
      {children}
    </DeptShell>
  );
}
