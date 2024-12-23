"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  ChatBubbleIcon,
  FileIcon,
  GearIcon,
  HomeIcon,
} from "@radix-ui/react-icons";

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

export default function NavigationSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[72px] flex-col items-center space-y-4 bg-muted py-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "group flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-primary/10",
            pathname === route.href && "bg-primary/10"
          )}
        >
          <route.icon
            className={cn(
              "h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary",
              pathname === route.href && "text-primary"
            )}
          />
        </Link>
      ))}
    </div>
  );
}
