import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type FileAttachment } from "@/types/chat";
import { PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  onFileUpload?: (file: File) => Promise<FileAttachment>;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  onFileUpload,
  isLoading,
  placeholder = "Type a message...",
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage("");
      setFiles([]);
      textareaRef.current?.focus();
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-background p-4",
        isDragActive && "border-primary",
        className
      )}
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm"
            >
              <span>{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => removeFile(index)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="min-h-[60px] flex-1 resize-none"
          {...getInputProps()}
        />

        <div className="flex gap-2">
          {onFileUpload && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => document.getElementById("file-input")?.click()}
              disabled={isLoading}
            >
              <PaperclipIcon className="h-4 w-4" />
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files!),
                    ]);
                  }
                }}
              />
            </Button>
          )}

          <Button onClick={handleSend} disabled={isLoading}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 text-muted-foreground">
          Drop files here
        </div>
      )}
    </div>
  );
}
