import { ZodError } from "zod";
import { toast } from "sonner";

export function handleFormError(error: unknown) {
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    errors.forEach((err) => {
      toast.error(`${err.path}: ${err.message}`);
    });

    return errors;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return [{ path: "unknown", message: error.message }];
  }

  toast.error("An unknown error occurred");
  return [{ path: "unknown", message: "An unknown error occurred" }];
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
