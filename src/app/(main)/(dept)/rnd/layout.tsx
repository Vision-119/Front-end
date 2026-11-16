import { DeptShell } from "../_components/DeptShell";
import type { DeptNavItem } from "../_components/DeptNav";

// 기업부설연구소 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/rnd", label: "팀 홈" },
];

export default function RndLayout({ children }: LayoutProps<"/rnd">) {
  return (
    <DeptShell deptId="rnd" nav={NAV}>
      {children}
    </DeptShell>
  );
}
