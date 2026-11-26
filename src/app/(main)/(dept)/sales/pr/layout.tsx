import { DeptShell } from "../../_components/DeptShell";
import type { DeptNavItem } from "../../_components/DeptNav";

// 홍보팀 navbar — add a menu item here when you add a page under this folder.
const NAV: DeptNavItem[] = [
  { href: "/sales/pr", label: "팀 홈" },
  { href: "/sales/pr/contacts", label: "이메일·담당자" },
  { href: "/sales/pr/mail", label: "메일 발송" },
  { href: "/sales", label: "사업 현황판" },
];

export default function PrLayout({ children }: LayoutProps<"/sales/pr">) {
  return (
    <DeptShell deptId="pr" nav={NAV}>
      {children}
    </DeptShell>
  );
}
