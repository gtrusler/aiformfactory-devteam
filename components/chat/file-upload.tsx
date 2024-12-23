"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export default function FileUpload({
  onFileSelect,
  accept = {
    "application/pdf": [".pdf"],
    "text/plain": [".txt"],
    "application/json": [".json"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > maxSize) {
          setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
          return;
        }
        setError(null);
        onFileSelect(file);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25",
          error && "border-destructive"
        )}
      >
        <Input {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="text-sm text-primary">Drop the file here</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Drag & drop a file here, or click to select
              </p>
              <Button type="button" variant="ghost" size="sm" className="mt-2">
                Select File
              </Button>
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
