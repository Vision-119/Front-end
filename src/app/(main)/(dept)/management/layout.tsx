import { DeptShell } from "../_components/DeptShell";
import type { DeptNavItem } from "../_components/DeptNav";

// 경영지원팀 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/management", label: "팀 홈" },
];

export default function ManagementLayout({ children }: LayoutProps<"/management">) {
  return (
    <DeptShell deptId="management" nav={NAV}>
      {children}
    </DeptShell>
  );
}
