import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils/cn";

interface StatusIndicatorProps {
  connected: boolean;
  processing: boolean;
  error: Error | null;
}

export function StatusIndicator({
  connected,
  processing,
  error,
}: StatusIndicatorProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            connected ? "bg-green-500" : "bg-red-500"
          )}
        />
        <span className="text-sm text-muted-foreground">
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {processing && (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Processing...</span>
        </div>
      )}

      {!processing && connected && (
        <div className="flex items-center space-x-2 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Ready</span>
        </div>
      )}
    </div>
  );
}
