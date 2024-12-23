import { type ReactNode } from "react";
import NavigationSidebar from "./_components/navigation-sidebar";
import StatusBar from "./_components/status-bar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <NavigationSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <StatusBar />
    </div>
  );
}
