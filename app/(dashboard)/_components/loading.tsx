import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
    </div>
  );
}
