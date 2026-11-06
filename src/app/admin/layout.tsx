import { PageShell } from "../../components/AppHeader";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <PageShell mode="admin">{children}</PageShell>;
}
