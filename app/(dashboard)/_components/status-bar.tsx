"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function StatusBar() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection check
    const checkConnection = () => {
      // Replace with actual connection check logic
      setIsConnected(true);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-12 items-center justify-between border-t bg-card px-4">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Connected</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-muted-foreground">Disconnected</span>
          </>
        )}
      </div>
      <ThemeToggle />
    </div>
  );
}
