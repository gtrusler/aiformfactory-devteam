"use client";

import { useEffect } from "react";
import { Alert } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Alert variant="destructive" className="max-w-md">
        <h2 className="text-lg font-semibold">Something went wrong!</h2>
        <p className="mt-2 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 rounded bg-destructive-foreground px-4 py-2 text-sm text-destructive hover:bg-destructive-foreground/90"
        >
          Try again
        </button>
      </Alert>
    </div>
  );
}
