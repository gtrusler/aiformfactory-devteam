import { cn } from "@/lib/utils";
import {
  ChatBubbleIcon,
  FileIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationSidebarProps {
  className?: string;
}

export function NavigationSidebar({ className }: NavigationSidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: HomeIcon,
      href: "/",
    },
    {
      label: "Chat",
      icon: ChatBubbleIcon,
      href: "/chat",
    },
    {
      label: "Files",
      icon: FileIcon,
      href: "/files",
    },
    {
      label: "Settings",
      icon: GearIcon,
      href: "/settings",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      <div className="flex items-center gap-2 px-2">
        <span className="text-xl font-bold">AI Form Factory</span>
      </div>

      <nav className="flex flex-col gap-1">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                isActive && "bg-muted"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
