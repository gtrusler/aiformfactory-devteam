import { Loader2, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  isLoading?: boolean;
  isConnected?: boolean;
}

export function StatusIndicator({ isLoading, isConnected }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isConnected ? (
        <Wifi className={cn(
          "h-4 w-4",
          isLoading ? "text-yellow-500" : "text-green-500"
        )} />
      ) : (
        <WifiOff className="h-4 w-4 text-red-500" />
      )}
      <span>
        {isConnected
          ? isLoading
            ? "Processing..."
            : "Connected"
          : "Disconnected"}
      </span>
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
