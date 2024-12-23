import { type ReactNode } from "react";
import { NavigationSidebar } from "./_components/navigation-sidebar";
import { StatusBar } from "./_components/status-bar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <NavigationSidebar className="w-64 border-r" />
      <main className="flex flex-1 flex-col">
        <StatusBar className="border-b" />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
