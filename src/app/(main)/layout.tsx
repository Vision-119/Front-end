import { PageShell } from "../../components/AppHeader";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return <PageShell>{children}</PageShell>;
}
