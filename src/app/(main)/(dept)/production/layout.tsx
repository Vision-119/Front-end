import { DeptShell } from "../_components/DeptShell";
import type { DeptNavItem } from "../_components/DeptNav";

// 생산팀 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/production", label: "팀 홈" },
];

export default function ProductionLayout({ children }: LayoutProps<"/production">) {
  return (
    <DeptShell deptId="production" nav={NAV}>
      {children}
    </DeptShell>
  );
}
