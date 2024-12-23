import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatBubbleIcon, FileIcon, GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function DashboardPage() {
  const quickActions = [
    {
      label: "Start Chat",
      description: "Begin a new conversation with AI agents",
      icon: ChatBubbleIcon,
      href: "/chat",
    },
    {
      label: "Manage Files",
      description: "Upload and organize your documents",
      icon: FileIcon,
      href: "/files",
    },
    {
      label: "Settings",
      description: "Configure agents and preferences",
      icon: GearIcon,
      href: "/settings",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to AI Form Factory</h1>
        <p className="text-muted-foreground">
          Your intelligent document processing assistant
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.href}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <action.icon className="h-5 w-5" />
                {action.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
              <Button asChild className="mt-4">
                <Link href={action.href}>Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
