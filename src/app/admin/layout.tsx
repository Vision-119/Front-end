import { Suspense } from "react";
import { SidebarNav, type SidebarSection } from "../../components/AdminSidebar";
import { PageShell } from "../../components/AppHeader";
import { getSession } from "../../lib/auth";
import { MEMBER_TEAMS, teamPath } from "../../lib/org";
import { isAdmin } from "../../lib/permissions";

const SECTIONS: SidebarSection[] = [
  {
    title: "전체 팀",
    links: [
      { href: "/admin", label: "팀 현황", icon: "grid" },
      ...MEMBER_TEAMS.map((t) => ({ href: `/admin/teams/${t.id}`, label: teamPath(t.id) })),
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/admin/users", label: "사용자 관리", icon: "users" },
      { href: "/admin/products", label: "제품 관리", icon: "box" },
    ],
  },
];

async function Sidebar() {
  const user = await getSession();
  if (!user || !isAdmin(user)) return null;
  return (
    <Suspense fallback={<SidebarNav sections={SECTIONS} activeFromPath={false} />}>
      <SidebarNav sections={SECTIONS} />
    </Suspense>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <PageShell
      mode="admin"
      sidebar={
        <aside className="shrink-0 border-b border-zinc-200 bg-white px-3 py-6 md:w-60 md:border-r md:border-b-0 dark:border-zinc-800 dark:bg-zinc-950">
          <Suspense>
            <Sidebar />
          </Suspense>
        </aside>
      }
    >
      {children}
    </PageShell>
  );
}
