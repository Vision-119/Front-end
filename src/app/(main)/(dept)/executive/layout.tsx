import { DeptShell } from "../_components/DeptShell";
import type { DeptNavItem } from "../_components/DeptNav";

// 임원실 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/executive", label: "팀 홈" },
];

export default function ExecutiveLayout({ children }: LayoutProps<"/executive">) {
  return (
    <DeptShell deptId="executive" nav={NAV}>
      {children}
    </DeptShell>
  );
}
