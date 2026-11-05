import { DashboardShell } from "@/components/features/DashboardShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
